const { default: AdminBro } = require("admin-bro");
const AdminBroMongoose = require("admin-bro-mongoose");

AdminBro.registerAdapter(AdminBroMongoose);

const AdminOrder = require("./Order.admin");
const Survey = require("../models/Survey");

/** @type {import('admin-bro').AdminBroOptions} */
const options = {
  resources: [AdminOrder, Survey],
  branding: {
    companyName: "SmartPrint3D",
    logo: "/images/logo-smartprint3d.jpg",
  },
};

module.exports = options;
