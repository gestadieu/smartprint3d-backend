const router = require("express").Router();
const passport = require("passport");
const login = require("connect-ensure-login");
const { Order } = require("../models/Order");

router.all("/*", login.ensureLoggedIn("/login"), function (req, res, next) {
  next();
});

router.get("/", async (request, response) => {
  console.log(request.user);
  const total_orders = await Order.countDocuments();
  const active_orders = await Order.countDocuments({
    status: { $ne: "DELIVERED" },
  });
  const nb_objects = await Order.aggregate([
    {
      $group: { _id: null, totalSize: { $sum: { $size: "$items" } } },
    },
  ]);

  response.render("dashboard", {
    total_orders,
    active_orders,
    objects: nb_objects[0].totalSize,
  });
});

/**
 *
 */
router.get("/orders", async (request, response) => {
  const url_api = `${request.protocol}://${request.headers.host}${request.originalUrl}/`;
  try {
    const orders = await Order.find({ status: { $ne: "DELIVERED" } }).sort({
      status: 1,
      created_at: 1,
    });
    response.render("admin_orders_list", {
      orders,
      url_api,
      title: "Active",
      page: "active",
    });
  } catch (error) {
    response.status(400).send({ status: "error", message: error });
  }
});

router.get("/allorders", async (request, response) => {
  const url_api = `${request.protocol}://${request.headers.host}${request.originalUrl}/`;
  try {
    const orders = await Order.find().sort({ created_at: -1 });
    response.render("admin_orders_list", {
      orders,
      url_api,
      title: "All",
      page: "all",
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
    await order.updateFlag(flag);
    await order.save();
    response.redirect("/admin/orders");
  } catch (error) {
    console.log(error);
    response.status(400).send({ status: "error", message: error });
  }
});

module.exports = router;
