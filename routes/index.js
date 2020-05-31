var express = require("express"), 
    router = express.Router(),  
    passport = require("passport"),
    Campground      = require("../models/campground"),
    Comment         = require("../models/comment"),
    User            = require("../models/user")

router.get("/", function (req, res) {
    res.render("landing");
})

router.get("/register", function (req, res) {
    res.render("register");
})

router.post("/register", function (req, res) {
    var newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            // short circuit here
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function () {
            req.flash("success", "Welcome to YelpCamp, " + user.username);
            res.redirect("/campgrounds");
        });

    })
})

router.get("/login", function (req, res) {
    res.render("login");
})

// p-l-m gave us User.authenticate to use, and we told passport to use it
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function (req, res) {
    req.flash("success", "Welcome to YelpCamp, " + user.username);
});

router.get("/logout", function (req, res) {
    req.logout();
    req.flash("success", "Successfully logged you out!")
    res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect("/login");
    }
};

module.exports = router;