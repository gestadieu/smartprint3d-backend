const router = require("express").Router();
const { request, response } = require("express");
const passport = require("passport");
const login = require("connect-ensure-login");

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

const displayAllOptions = (orders) => {
  const q10Options = ["library", "school", "museum", "touristspot", "park"]; //other

  orders.forEach((order, i) => {
    const q10 = order?.presurvey?.q10;
    // for each options, create a separate column with 0 or 1
    q10Options.forEach((opt) => {
      orders[i].presurvey[`q10_${opt}`] = q10.includes(opt) ? 1 : 0;
    });

    // get the "other" option text
    let q10other = q10.filter((answer) => {
      return !q10Options.includes(answer) ? answer : "";
    });
    orders[i].presurvey.q10_other = q10other.join("/");
  });
  return orders;
};

router.get(
  "/export",
  login.ensureLoggedIn("/login"),
  async (request, response) => {
    // get data from MongoDB
    const launchDate = new Date("2020-06-15");
    const q10Options = ["library", "school", "museum", "touristspot", "park"]; //other

    const filters = {
      status: { $ne: "DELETED" },
      created_at: {
        $gte: launchDate,
      },
    };

    try {
      let orders = await Order.find(filters).sort({
        created_at: -1,
      });

      orders = await displayAllOptions(orders);

      response.render("admin_surveys_list2", {
        orders,
        title: "Surveys",
      });
    } catch (error) {
      response.status(400).send({ status: "error", message: error });
    }
  }
);

module.exports = router;
