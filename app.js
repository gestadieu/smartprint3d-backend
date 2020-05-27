require("dotenv").config();
var path = require("path");
const express = require("express");
const https = require("https");
const http = require("http");
const fs = require("fs");
const mongoose = require("mongoose");
const cors = require("cors");
const orderRoute = require("./src/routes/order");
const adminRoute = require("./src/routes/admin");
const surveyRoute = require("./src/routes/survey");

// var options = {
//   key: fs.readFileSync("/etc/ssl/letsencrypt/smartprint3d.io.key"),
//   cert: fs.readFileSync("/etc/ssl/letsencrypt/smartprint3d.io.cer"),
// };

const app = express();
const port = 8082;
const ssl_port = 443;

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
app.use("/api", orderRoute);
app.use("/admin", adminRoute);
app.use(surveyRoute);

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  http.createServer(app).listen(port);
  // https.createServer(options, app).listen(ssl_port);

  // app.listen(port, () => console.log(`listening on port ${port}`));
};

run();
