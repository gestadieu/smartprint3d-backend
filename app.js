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

const {
  PORT = 8082,
  NODE_ENV = "dev",
  SESSION_NAME = "_smartPrint3D",
  SESSION_SECRET = "SmartPrint3Duifsa234jklafdajkqqvnvnzppadfjk",
} = process.env;

// Basic securing the app
app.use(helmet());
app.use(
  cors({
    origin: ["smartprint3d.io", "en.smartprint3d.io", "api.smartprint3d.io"],
  })
);

// Session and Flash middleware
app.use(
  session({
    secret: SESSION_SECRET,
    name: SESSION_NAME,
    cookie: { secure: false },
    store: redisStore,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());

// Pug Template Engine
app.set("views", path.join(__dirname, "src/views"));
app.set("view engine", "pug");

// Static files
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

// Passport Middleware for Authentication
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api", orderRoute);
app.use("/admin", adminRoute);
app.use(surveyRoute);
app.use(authRoute);

const run = async () => {
  // MongoDB connection
  await mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });

  http.createServer(app).listen(8082);
};

run();
