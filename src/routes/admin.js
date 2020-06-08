const router = require("express").Router();
const passport = require("passport");
const login = require("connect-ensure-login");
const { Order } = require("../models/Order");
const User = require("../models/User");

router.all("/*", login.ensureLoggedIn("/login"), function (req, res, next) {
  next();
});

/**
 * Admin Dashboard
 * shows global data analysis
 */
router.get("/", async (request, response) => {
  const total_orders = await Order.countDocuments();
  const active_orders = await Order.countDocuments({
    status: { $ne: "DELIVERED" },
  });
  const completed_orders = await Order.countDocuments({
    status: { $eq: "DELIVERED" },
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
  const { search } = request.query;
  const filters = { status: { $ne: "DELIVERED" } };

  try {
    if (search) {
      filters.$or = [
        { email: { $regex: search, $options: "i" } },
        { mobile: { $regex: search, $options: "i" } },
        { "items.item": { $regex: search, $options: "i" } },
      ];
    }

    const orders = await Order.find(filters).sort({
      status: 1,
      created_at: -1,
    });

    response.render("admin_orders_list", {
      orders,
      url_api,
      title: "Active Orders",
      page: "active",
      search,
    });
  } catch (error) {
    response.status(400).send({ status: "error", message: error });
  }
});

router.get("/pastorders", async (request, response) => {
  const url_api = `${request.protocol}://${request.headers.host}${request.originalUrl}/`;
  const { search } = request.query;
  const filters = { status: "DELIVERED" };

  try {
    if (search) {
      filters.$or = [
        { email: { $regex: search, $options: "i" } },
        { mobile: { $regex: search, $options: "i" } },
        { "items.item": { $regex: search, $options: "i" } },
      ];
    }
    const orders = await Order.find(filters).sort({
      created_at: -1,
    });
    response.render("admin_orders_list", {
      orders,
      url_api,
      title: "Orders Completed",
      page: "past",
      search,
    });
  } catch (error) {
    response.status(400).send({ status: "error", message: error });
  }
});

/**
 *
 */
router.get("/orders/:id/flag/:flag", async (request, response) => {
  const id = request.params.id;
  const flag = request.params.flag;

  try {
    const order = await Order.findById(id);
    await order.updateFlag(flag, request.user);
    await order.save();
    response.redirect("/admin/orders");
  } catch (error) {
    console.log(error);
    response.status(400).send({ status: "error", message: error });
  }
});

/**
 *
 */
router.get("/orders/:id/delete", async (request, response) => {
  try {
    const order = await Order.findById(request.params.id);
    await order.delete();
    response.redirect("/admin/orders");
  } catch (err) {
    console.log(err);
    response.status(400).send({ status: "error", message: err });
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
    if (order.status == "PRINTED") {
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
    await order.updateFlag("DELIVERED", request.user);
    await order.save();
    response.render("thankyou");
  } catch (err) {
    response.status(400).send({ status: "error", message: error });
  }
});

module.exports = router;
