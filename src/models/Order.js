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
  timeline: [
    {
      status: {
        type: String,
        required: true,
        default: "ORDERED",
        enum: ["ORDERED", "PRINTING", "PRINTED", "DELIVERED"],
      },
      date: {
        type: Date,
        required: true,
        default: Date.now,
      },
      user: { type: Schema.Types.ObjectId, ref: "User" },
    },
  ],
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
  postsurvey: {
    q1: String,
    q2: String,
    q3: Number,
    q4: Number,
    q5: Number,
    q6: Number,
    q7: Number,
    q8: String,
    q9: Number,
    q10: Number,
  },
  status: {
    type: String,
    required: true,
    default: "ORDERED",
    enum: ["ORDERED", "PRINTING", "PRINTED", "DELIVERED"],
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

OrderSchema.methods.updateFlag = function (cb) {
  return mongoose.model("Animal").find({ type: this.type }, cb);
};

OrderSchema.method({
  /**
   *
   * @param {String} flag
   * 1 test if newFlag is allowed, 2 check if it is in the right order, 3 update timeline
   */
  updateFlag: function (flag, user) {
    const newFlag = flag.toUpperCase();
    const VALID_FLAGS = ["ORDERED", "PRINTING", "PRINTED", "DELIVERED"];
    if (VALID_FLAGS.includes(newFlag)) {
      this.status = newFlag;
      this.timeline.push({
        status: this.status,
        date: Date.now(),
        user: user._id,
      });
    }
  },
});

const Order = mongoose.model("Order", OrderSchema);

module.exports = { OrderSchema, Order };
