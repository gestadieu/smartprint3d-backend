require("dotenv").config();
const path = require("path");
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const flash = require("connect-flash");
// const cookieParser = require("cookie-parser");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const https = require("https");
const http = require("http");
const fs = require("fs");
const mongoose = require("mongoose");

const helmet = require("helmet");
const User = require("./src/models/User");
const orderRoute = require("./src/routes/order");
const adminRoute = require("./src/routes/admin");
const surveyRoute = require("./src/routes/survey");
const authRoute = require("./src/routes/auth");
const { redisStore } = require("./src/services/redis");

// var options = {
//   key: fs.readFileSync("/etc/ssl/letsencrypt/smartprint3d.io.key"),
//   cert: fs.readFileSync("/etc/ssl/letsencrypt/smartprint3d.io.cer"),
// };

const app = express();
const port = 8082;
// const ssl_port = 443;

app.use(helmet());
app.use(cors());
// app.use(
//   session({
//     secret: "SmartPrint3Duifsa234jklafdajkqqvnvnzppadfjk",
//     keys: ["secrefqtkey1", "secretayhqkey2", "fdasfqwrenksdgjlh"],
//     name: "_smartPrint3Dsess",
//     // cookie: { secure: true },
//     resave: false,
//     saveUninitialized: true,
//   })
// );
app.use(flash());

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
