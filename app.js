require("dotenv").config();
const path = require("path");
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const flash = require("connect-flash");
const passport = require("passport");
const http = require("http");
const mongoose = require("mongoose");

const helmet = require("helmet");
const User = require("./src/models/User");
const orderRoute = require("./src/routes/order");
const adminRoute = require("./src/routes/admin");
const surveyRoute = require("./src/routes/survey");
const authRoute = require("./src/routes/auth");
const { redisStore } = require("./src/services/redis");

const app = express();
const { PORT = 8082 } = process.env;

app.use(helmet());
app.use(cors({ origin: ["smartprint3d.io", "en.smartprint3d.io"] }));

app.use(
  session({
    secret: "SmartPrint3Duifsa234jklafdajkqqvnvnzppadfjk",
    name: "_smartPrint3D",
    cookie: { secure: false },
    store: redisStore,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());
app.set("views", path.join(__dirname, "src/views"));
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
app.use(passport.initialize());
app.use(passport.session());

app.use("/api", orderRoute);
app.use("/admin", adminRoute);
app.use(surveyRoute);
app.use(authRoute);

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });

  http.createServer(app).listen(PORT);
};

run();
