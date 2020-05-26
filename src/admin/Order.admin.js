const AdminBro = require("admin-bro");
const { Order } = require("../models/Order");

/** @type {AdminBro.ResourceOptions} */
const options = {
  listProperties: ["email", "mobile", "items", "status"],
  showProperties: ["email", "mobile", "items", "status"],
};

module.exports = {
  options,
  resource: Order,
};
