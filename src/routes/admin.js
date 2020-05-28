const router = require("express").Router();
const passport = require("passport");
const login = require("connect-ensure-login");
const { Order } = require("../models/Order");
const User = require("../models/User");

router.all("/*", login.ensureLoggedIn("/login"), function (req, res, next) {
  next();
});

router.get("/", async (request, response) => {
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
    title: "Dashboard",
    total_orders,
    active_orders,
    objects: nb_objects[0].totalSize,
    user: request.user,
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
      title: "Active Orders",
      page: "active",
    });
  } catch (error) {
    response.status(400).send({ status: "error", message: error });
  }
});

router.get("/pastorders", async (request, response) => {
  const url_api = `${request.protocol}://${request.headers.host}${request.originalUrl}/`;
  try {
    const orders = await Order.find({ status: "DELIVERED" }).sort({
      created_at: -1,
    });
    response.render("admin_orders_list", {
      orders,
      url_api,
      title: "Orders Completed",
      page: "past",
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

module.exports = router;
