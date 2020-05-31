var express = require("express"),
    router = express.Router({ mergeParams: true }),
    passport = require("passport"),
    // Since I require the folder and use a file named "index within it, I don't need to say index.js"
    middleware = require("../middleware"),
    Campground = require("../models/campground"),
    Comment = require("../models/comment"),
    User = require("../models/user")

router.get("/", function (req, res) {
    Campground.find({}, function (err, campgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", { campgrounds: campgrounds });
        }
    });
})

// This is part of the REST convention of naming routes
router.get("/new", middleware.isLoggedIn, function (req, res) {
    res.render("campgrounds/new");
})

router.post("/", middleware.isLoggedIn, function (req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    console.log(req.user._id);
    // Could create author object earlier
    Campground.create({
        name: name,
        image: image,
        description: desc,
        author: author,
    }, function (err, newCampground) {
        if (err) {
            console.log(err);
        } else {
            // This is an absolute path
            res.redirect("/campgrounds");
        }
    });
});

// This needs to go below the campgrounds/new route!
router.get("/:id", function (req, res) {
    // ID's are unique in MongoDB
    Campground.findById(req.params.id).populate("comments").exec(function (err, campground) {
        if (err || campground == null) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            console.log(campground);
            res.render("campgrounds/show", { campground: campground });
        }
    })
});

router.get("/:id/edit", middleware.checkCampgroundOwnership, function (req, res) {
    Campground.findById(req.params.id, function (err, campground) {
        res.render("campgrounds/edit", { campground: campground });
    });
});

router.put("/:id", middleware.checkCampgroundOwnership, function (req, res) {
    // .populate needs to happen up here
    Campground.findByIdAndUpdate(req.params.id, req.body.campground).populate("comments").exec(function (err, campground) {
        if (err) {
            console.log(err);
        } else {
            // Don't need the leading / as this is an absolute path inside of views
            // careful with the /, using routes makes this confusing
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

router.delete("/:id", middleware.checkCampgroundOwnership, function (req, res) {
    Campground.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;