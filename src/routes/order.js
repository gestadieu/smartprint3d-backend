const router = require("express").Router();
const { Order } = require("../models/Order");
const Survey = require("../models/Survey");
// const { PreSurvey } = require("../models/googleSheetsService");
const QRCode = require("qrcode");

const STATUS_FLAGS = ["ORDERED", "PRINTING", "PRINTED", "DELIVERED"];

/**
 *
 */
router.get("/orders", async (request, response) => {
  try {
    const orders = await Order.find();
    response.json({ count: orders.length, docs: orders });
  } catch (error) {
    response.status(400).send({ status: "error", message: error });
  }
});

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

  try {
    const order = new Order(data);
    await order.save();

    const survey = new Survey({
      order: order._id,
      presurvey: data.presurvey,
    });
    await survey.save();

    const host = request.get("host");
    const url_api = `${request.protocol}://${host}/api`;
    const url_postsurvey = `${url_api}/${order._id}`;

    // save data in Google Spreadsheet
    // const s = new PreSurvey();
    // s.addRows(order);

    // generate a QRCode based on the document id url
    await QRCode.toFile(`public/qrcodes/${order._id}.png`, url_postsurvey, {
      type: "png",
    });
    response.json({ status: "success", order });
  } catch (error) {
    console.log(error);
    response.status(400).send({ status: "error", message: error });
  }
});

/**
 *
 */
router.get("/orders/:id", async (request, response) => {
  try {
    const order = await Order.findById(request.params.id);
    response.json(order);
  } catch (error) {
    response.status(400).send({ status: "error", message: error });
  }

  // if (doc.status == "PRINTED") {
  // }
  // is not yet" post-surveyed"
  // if (doc.isPostSurvey) {
  //   // AND ready to collect
  //   if (doc.isReadyToCollect) {
  //     response.redirect(200, `/postsurvey.html?id=${doc._id}`);
  //   } else {
  //     // AND not yet ready to collect: show current status
  //   }
  // }

  // response.redirect(200, `/postsurvey.html?id=${doc._id}`);
  //   }
  // );
});

/**
 *
 */
router.get("/orders/status/:id/:flag", (request, response) => {
  const id = request.params.id;
  const flag = request.params.flag;

  db.findOne(
    {
      _id: id,
    },
    (err, doc) => {
      // if db error or flags is not whitelisted
      if (err || STATUS_FLAGS.find((f) => f == flag)) {
        response.redirect(404, "/404.html");
      }

      db.update(
        { _id: id },
        { $set: { STATUS: flag } },
        {},
        (err, numReplaced) => {
          if (err) {
            response.json({
              status: "501",
              message: "Could not save to database the updated document",
            });
          }
          // should also add to timeline?
          // { $push: { timeline: {flag, datetime } } }

          // update Google Spreadsheet
          // 1. Change flag
          // 2. Change link?

          response.json({ numReplaced, flag });
        }
      );
      // response.json(doc);
    }
  );
});

module.exports = router;
