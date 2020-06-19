require("dotenv").config();
var path = require("path");
const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./src/models/User");
const flash = require("connect-flash");
const https = require("https");
const http = require("http");
const fs = require("fs");
const mongoose = require("mongoose");
const cors = require("cors");
const orderRoute = require("./src/routes/order");
const adminRoute = require("./src/routes/admin");
const surveyRoute = require("./src/routes/survey");
const authRoute = require("./src/routes/auth");
var helmet = require("helmet");
// var { redisStore } = require("./src/services/redis");

// var options = {
//   key: fs.readFileSync("/etc/ssl/letsencrypt/smartprint3d.io.key"),
//   cert: fs.readFileSync("/etc/ssl/letsencrypt/smartprint3d.io.cer"),
// };

const app = express();
const port = 8082;
const ssl_port = 443;

app.use(
  session({
    secret: "SmartPrint3Duifsa234jklafdajkqqvnvnzppadfjk",
    keys: ["secretkey1", "secretkey2", "fdasfqwrenksdgjlh"],
    name: "_smartPrint3D",
    cookie: {},
    resave: false,
    saveUninitialized: false,
  })
);
app.use(cors());
app.use(flash());

// app.use(
//   session({
//     secret: "SmartPrint3Duifsa234jklafdajkqqvnvnzppadfjk",
//     name: "_smartPrint3D",
//     cookie: { secure: false },
//     store: redisStore,
//     resave: false,
//     saveUninitialized: false,
//   })
// );

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

// if (app.get("env") === "production") {
//   // Serve secure cookies, requires HTTPS
//   session.cookie.secure = true;
// }
app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(helmet());

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

  http.createServer(app).listen(port);
  // https.createServer(options, app).listen(ssl_port);

  // app.listen(port, () => console.log(`listening on port ${port}`));
};

run();
