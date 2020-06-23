const router = require("express").Router();
const passport = require("passport");
const passportLocal = require("passport-local");
const User = require("../models/User");

// passport.use(User.createStrategy());
passport.use(new passportLocal.Strategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

router.get("/", (req, res) => {
  res.render("index", { user: req.user });
});

router.get("/login", function (request, response) {
  response.render("login", {
    user: request.user,
    message: request.flash("error"),
  });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successReturnToOrRedirect: "/",
    failureRedirect: "/login",
  }),
  function (request, response) {
    response.redirect("/admin");
  }
);

router.get("/logout", function (request, response) {
  request.logout();
  response.redirect("/admin");
});

// router.post("/register", function (req, res, next) {
//   User.register(
//     new User({ username: req.body.username }),
//     req.body.password,
//     function (err) {
//       if (err) {
//         return next(err);
//       }
//       res.redirect("/admin");
//     }
//   );
// });

// function ensureAuthenticated(req, res, next) {
//   if (req.isAuthenticated()) {
//     // req.user is available for use here
//     return next();
//   }
//   // denied. redirect to login
//   res.redirect("/");
// }
// app.get("/protected", ensureAuthenticated, function (req, res) {
//   res.send("access granted. secure stuff happens here");
// });

module.exports = router;
