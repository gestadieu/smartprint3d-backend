const mongoose = require("mongoose");
var Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new Schema({
  email: String,
  encryptedPassword: String,
  password: String,
  level: String,
  active: Boolean,
  roles: [{ type: String, enum: ["admin", "admin_users"] }],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
