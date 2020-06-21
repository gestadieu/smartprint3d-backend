const router = require("express").Router();
const passport = require("passport");
const login = require("connect-ensure-login");
const { Order } = require("../models/Order");
const User = require("../models/User");
const url = require("url");
const { sendEmail, emailPrinted } = require("../models/Mail");
const PAGE_SIZE = 20;

router.all("/*", login.ensureLoggedIn("/login"), function (req, res, next) {
  next();
});

/**
 * Admin Dashboard
 * shows global data analysis
 */
router.get("/", async (request, response) => {
  const total_orders = await Order.countDocuments({
    status: { $ne: "DELETED" },
  });

  const active_orders = await Order.countDocuments({
    $and: [{ status: { $ne: "04.DELIVERED" } }, { status: { $ne: "DELETED" } }],
  });
  const completed_orders = await Order.countDocuments({
    status: { $eq: "04.DELIVERED" },
  });
  const nb_objects = await Order.aggregate([
    {
      $group: { _id: null, totalSize: { $sum: { $size: "$items" } } },
    },
  ]);

  response.render("dashboard", {
    title: "Dashboard",
    total_orders,
    active_orders,
    completed_orders,
    total_objects: nb_objects[0].totalSize,
    user: request.user,
  });
});

/**
 *
 */
router.get("/orders", async (request, response) => {
  const url_api = `${request.protocol}://${request.headers.host}${request.originalUrl}/`;
  const url_page = `${request.protocol}://${request.headers.host}${request.baseUrl}${request.path}`;

  const ordersParams = request.session.ordersParams || {};
  ordersParams.page = request.query.page || ordersParams["page"] || 1;
  ordersParams.limit =
    request.query.limit || ordersParams["limit"] || PAGE_SIZE;
  ordersParams.search = request.query.search || ordersParams["search"] || "";
  ordersParams.status = request.query.status || ordersParams["status"] || "";
  if (request.query.search == "") {
    ordersParams.search = "";
  }
  if (request.query.status == "active") {
    ordersParams.status = "";
  }
  request.session.ordersParams = ordersParams;

  let filters = {
    $and: [{ status: { $ne: "04.DELIVERED" } }, { status: { $ne: "DELETED" } }],
  };
  if (ordersParams.status == "04.delivered") {
    filters = { status: "04.DELIVERED" };
  } else if (ordersParams.status == "deleted") {
    filters = { status: "DELETED" };
  }

  try {
    const orders = await Order.find()
      .bySearch(filters, ordersParams.search)
      .populate({ path: "timeline.user", select: "username" })
      .limit(ordersParams.limit * 1)
      .skip(ordersParams.limit * (ordersParams.page - 1))
      .sort({
        status: 1,
        updated_at: -1,
        created_at: -1,
      });
    const total = await Order.countDocuments().bySearch(
      filters,
      ordersParams.search
    );

    response.render("admin_orders_list", {
      orders,
      url_page,
      title: "Orders",
      ordersParams,
      total,
    });
  } catch (error) {
    response.status(400).send({ status: "error", message: error });
  }
});

/**
 *
 */
// router.put("/orders/:id", async (req, res) => {
//   const { id, flag } = req.body;
//   try {
//     const order = await Order.findById(id);
//     if (flag) {
//       await orderUpdateFlag(flag, request.user);
//       await order.save();
//       if (order.status == "03.PRINTED" && order["email"]) {
//         sendEmail(emailPrinted(order));
//       }
//     }
//     response.redirect("/admin/orders");
//   } catch (err) {
//     response.status(400).send({ status: "error", message: error });
//   }
// });
router.get("/orders/:id/flag/:flag", async (request, response) => {
  const { id, flag } = request.params;

  try {
    const order = await Order.findById(id);
    await order.updateFlag(flag, request.user);
    await order.save();
    if (order.status == "03.PRINTED" && order["email"]) {
      sendEmail(emailPrinted(order));
    }
    response.redirect("/admin/orders");
  } catch (error) {
    response.status(400).send({ status: "error", message: error });
  }
});

/**
 *
 */
router.get("/orders/:id/online", async (request, response) => {
  const { id } = request.params;

  try {
    const order = await Order.findById(id);
    order.is_online = !order.is_online;
    await order.save();
    response.redirect("/admin/orders");
  } catch (err) {
    response.status(400).send({ status: "error", message: error });
  }
});

/**
 *
 */
router.get("/orders/:id/restore", async (request, response) => {
  const { id } = request.params;

  try {
    const order = await Order.findById(id);
    if (order.status == "DELETED") {
      order.status = order.lastActiveStatus();
      order.updateFlag(order.status, request.user);
      await order.save();
    }

    response.redirect("/admin/orders");
  } catch (err) {
    response.status(400).send({ status: "error", message: error });
  }
});

/**
 *
 */
router.get("/surveys", async (request, response) => {
  const filters = { status: { $ne: "DELETED" } };

  try {
    // if (search) {
    //   filters.$or = [
    //     { email: { $regex: search, $options: "i" } },
    //     { mobile: { $regex: search, $options: "i" } },
    //     { "items.item": { $regex: search, $options: "i" } },
    //     { status: { $regex: search, $options: "i" } },
    //   ];
    // }

    const orders = await Order.find(filters).sort({
      created_at: 1,
    });

    response.render("admin_surveys_list", {
      orders,
      title: "Surveys",
    });
  } catch (err) {
    response.status(400).send({ status: "error", message: error });
  }
});

/**
 *
 */
router.get("/users", async (request, response) => {
  try {
    const users = await User.find();
    response.render("admin_users_list", {
      title: "Users",
      users,
    });
  } catch (error) {
    response.status(400).send({ status: "error", message: error });
  }
});

/**
 *
 */
router.get("/postsurvey/:id", async (request, response) => {
  try {
    const lang = request.query["lang"] ? request.query.lang : "cn";
    const order = await Order.findById(request.params.id);
    if (order.status == "03.PRINTED") {
      response.render(`postsurvey_${lang}`, { order, lang });
    } else {
      response.redirect(`/api/orders/${order._id}`);
    }
  } catch (err) {
    response.status(400).send({ status: "error", message: error });
  }
});

/**
 *
 */
router.post("/postsurvey", async (request, response) => {
  const order_id = request.body.order_id;
  const postsurvey = request.body.postsurvey;

  try {
    const order = await Order.findById(order_id);
    order.postsurvey = postsurvey;
    await order.updateFlag("04.DELIVERED", request.user);
    await order.save();
    response.render("thankyou");
  } catch (err) {
    response.status(400).send({ status: "error", message: error });
  }
});

module.exports = router;
