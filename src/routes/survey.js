const router = require("express").Router();
const Survey = require("../models/Survey");
const { Order } = require("../models/Order");

// router.get("/postsurvey/:id", async (request, response) => {
//   try {
//     const order = await Order.findById(request.params.id);
//     if (order.status == "PRINTED") {
//       response.render("postsurvey", { order });
//     } else {
//       response.redirect(`/orders/${order._id}`);
//     }
//   } catch (err) {
//     response.status(400).send({ status: "error", message: error });
//   }
// });

// router.post("/postsurvey", async (request, response) => {
//   try {
//     console.log(request.body.order_id);
//     const order = await Order.findById(request.body.order_id);
//     order.postsurvey = request.body.postsurvey;
//     order.status = "DELIVERED";
//     order.save();
//     response.render("thankyou");
//   } catch (err) {
//     response.status(400).send({ status: "error", message: error });
//   }
// });

module.exports = router;
