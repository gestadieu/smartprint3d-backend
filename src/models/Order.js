const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const OrderSchema = new Schema({
  email: String,
  mobile: String,
  items: [
    {
      item: {
        type: String,
        required: true,
      },
      qty: {
        type: String,
        required: true,
      },
    },
  ],
  // timeline: [
  //   {
  //     status: String,
  //     date: Date,
  //   },
  // ],
  presurvey: {
    q1: String,
    q2: String,
    q3: String,
    q4: String,
    q51: Number,
    q52: Number,
    q53: Number,
    q54: Number,
    q55: Number,
    q56: Number,
    q57: Number,
    q6: String,
    q7: String,
    q8: Number,
    q91: Number,
    q92: Number,
    q10: Array,
  },
  postsurvey: {},
  status: {
    type: String,
    required: true,
    default: "ORDERED",
    enum: ["ORDERED", "PRINTING", "PRINTED", "DELIVERED"],
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const Order = mongoose.model("Order", OrderSchema);

module.exports = { OrderSchema, Order };
