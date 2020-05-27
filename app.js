require("dotenv").config();
var path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const orderRoute = require("./src/routes/order");
const adminRoute = require("./src/routes/admin");
const surveyRoute = require("./src/routes/survey");

const app = express();
const port = 8082;

app.use(cors());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
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
  // const admin = new AdminBro(adminOptions);
  // const adminRouter = buildAdminRouter(admin);
  // app.use(admin.options.rootPath, adminRouter);
  app.use("/api", orderRoute);
  app.use("/admin", adminRoute);
  app.use(surveyRoute);

  app.listen(port, () => console.log(`listening on port ${port}`));
};

// const run = require("./src/server");
run();
