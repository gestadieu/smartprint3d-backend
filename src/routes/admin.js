const router = require("express").Router();
const { Order } = require("../models/Order");
const Survey = require("../models/Survey");

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
    response.render("admin_orders_list", { orders, url_api, title: "Active" });
  } catch (error) {
    response.status(400).send({ status: "error", message: error });
  }
});

router.get("/allorders", async (request, response) => {
  const url_api = `${request.protocol}://${request.headers.host}${request.originalUrl}/`;
  try {
    const orders = await Order.find().sort({ created_at: -1 });
    response.render("admin_orders_list", { orders, url_api, title: "All" });
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
