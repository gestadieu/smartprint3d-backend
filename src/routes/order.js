const router = require("express").Router();
const { Order } = require("../models/Order");
const Survey = require("../models/Survey");
const QRCode = require("qrcode");
const mailer = require("nodemailer");

/**
 *
 */
// router.get("/orders", async (request, response) => {
//   try {
//     const orders = await Order.find();
//     response.json({ count: orders.length, docs: orders });
//   } catch (error) {
//     response.status(400).send({ status: "error", message: error });
//   }
// });

/**
 *
 */
router.post("/orders", async (request, response) => {
  const data = request.body;

  // deal with presurvey.q10 and q10othter
  if (data && data.presurvey && data.presurvey["q10"]) {
    data.presurvey.q10 = data.presurvey.q10.split(",");
    if ("q10other" in data) {
      data.presurvey.q10.push(data["q10other"]);
    }
  }

  // pre-process the order items and quantities
  data.items = [];
  const items = data.cartItemsId.split(",");
  const qties = data.cartItemsQuantity.split(",");
  for (let i = 0; i < items.length; i++) {
    data.items.push({ item: items[i], qty: qties[i] });
  }

  delete data.q10others;
  delete data.cartItemsId;
  delete data.cartItemsQuantity;

  data.timeline = { status: "ORDERED", date: Date.now(), user: undefined };

  try {
    const order = new Order(data);
    await order.save();

    const survey = new Survey({
      order: order._id,
      presurvey: data.presurvey,
    });
    await survey.save();

    const url_status = `${request.protocol}://${request.headers.host}/api/orders/${order._id}`;
    // generate a QRCode based on the document id url
    await QRCode.toFile(`public/qrcodes/${order._id}.png`, url_status, {
      type: "png",
    });

    //Send email with QRCode

    response.json({
      success: 1,
      successMessage: "Your order has been received",
    });
  } catch (error) {
    response.status(400).send({ status: "error", message: error });
  }
});

/**
 *
 */
router.get("/orders/:id", async (request, response) => {
  try {
    const order = await Order.findById(request.params.id);
    response.render("order", { order });
  } catch (error) {
    response.status(400).send({ status: "error", message: error });
  }
});

module.exports = router;
