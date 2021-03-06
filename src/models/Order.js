const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const OrderSchema = new Schema({
  email: String,
  mobile: String,
  is_online: {
    type: Boolean,
    default: true,
  },
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
        default: "01.ORDERED",
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
    q0: String,
    q01: String,
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
    q80: Number,
    q81: Number,
    q82: Number,
    q83: Number,
    q84: Number,
    q91: Number,
    q92: Number,
    q10: Array,
    q11: String,
  },
  postsurvey: {
    q1: String,
    q2: String,
    q3: Number,
    q4: Number,
    q5: Number,
    q6: Number,
    q7a: Number,
    q7b: Number,
    q8: String,
    q9: Number,
    q10: Number,
    q11: Number,
    q12: Number,
    q13: Number,
    q14: Number,
    q15: Number,
    q16: String,
    q17: String,
  },
  status: {
    type: String,
    required: true,
    default: "01.ORDERED",
    enum: [
      "01.ORDERED",
      "02.PRINTING",
      "03.PRINTED",
      "04.DELIVERED",
      "DELETED",
      "CANCELED",
    ],
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

OrderSchema.pre("save", function (next) {
  var currentDate = new Date();
  this.updated_at = currentDate;
  if (!this.created_at) this.created_at = currentDate;
  next();
});

OrderSchema.method({
  /**
   *
   * @param {String} flag
   * @param {User} user
   * 1 test if newFlag is allowed, 2 check if it is in the right order, 3 update timeline
   */
  updateFlag: function (flag, user) {
    const newFlag = flag.toUpperCase();
    const VALID_FLAGS = [
      "01.ORDERED",
      "02.PRINTING",
      "03.PRINTED",
      "04.DELIVERED",
      "DELETED",
    ];
    if (VALID_FLAGS.includes(newFlag)) {
      this.status = newFlag;
      this.timeline.push({
        status: this.status,
        date: Date.now(),
        user: user ? user._id : undefined,
      });
    }
  },

  /**
   * lastActiveStatus
   * returns the last status not 'DELETED'
   */
  lastActiveStatus: function () {
    for (let i = this.timeline.length - 1; i >= 0; i--) {
      if (this.timeline[i].status !== "DELETED") {
        return this.timeline[i].status;
      }
    }
  },
});

/**
 *
 * @param {String} search
 */
OrderSchema.query.bySearch = function (filters, search) {
  if (search) {
    filters.$or = [
      { email: { $regex: search, $options: "i" } },
      { mobile: { $regex: search, $options: "i" } },
      { "items.item": { $regex: search, $options: "i" } },
      { status: { $regex: search, $options: "i" } },
    ];
    return this.where(filters);
  } else {
    return this.where(filters);
  }
};

const Order = mongoose.model("Order", OrderSchema);

module.exports = { OrderSchema, Order };
