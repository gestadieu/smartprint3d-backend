require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const orderRouter = require("./src/routes/order");
const { default: AdminBro } = require("admin-bro");
const adminOptions = require("./src/admin/admin.options");
const buildAdminRouter = require("./src/admin/admin.router");
const AdminBroExpress = require("admin-bro-expressjs");
const AdminBroMongoose = require("admin-bro-mongoose");

const app = express();
const port = 8082;

app.use(cors());
app.use(express.static("public"));
app.use(
  express.json({
    limit: "1mb",
  })
);
app.use(
  express.urlencoded({
    extended: true,
  })
);

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const admin = new AdminBro(adminOptions);
  const adminRouter = buildAdminRouter(admin);
  app.use(admin.options.rootPath, adminRouter);
  app.use("/api", orderRouter);

  app.listen(port, () => console.log(`listening on port ${port}`));
};

// const run = require("./src/server");
run();
