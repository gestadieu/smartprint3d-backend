const router = require("express").Router();
const Survey = require("../models/Survey");
const { Order } = require("../models/Order");

router.get("/postsurvey/:id", async (request, response) => {
  const order = await Order.findById(request.params.id);
  response.render("postsurvey", { order });
});

module.exports = router;
