const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const SurveySchema = new Schema({
  order: { type: Schema.Types.ObjectId, ref: "Order" },
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
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Survey", SurveySchema);
