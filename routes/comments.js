var express = require("express"),
    //  so we can access things passed through params:
    router = express.Router({ mergeParams: true }),
    passport = require("passport"),
    middleware = require("../middleware"),
    Campground = require("../models/campground"),
    Comment = require("../models/comment"),
    User = require("../models/user")

// Just write the middle ware func, don't call
router.get("/new", middleware.isLoggedIn, function (req, res) {
    // ID's are unique in MongoDB
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", { campground: campground });
        }
    })
})

// Should make sure to add middleware to any routes that should be protected
router.post("/", middleware.isLoggedIn, function (req, res) {
    // ID's are unique in MongoDB
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds")
        } else {
            Comment.create({
                text: req.body.comment.text,
                author: {
                    id: req.user._id,
                    username: req.user.username
                }
            }, function (err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "Successfully created comment!");
                    res.redirect("/campgrounds/" + campground._id);
                };
            })
        }
    })
});

router.get("/:comment_id/edit", middleware.checkCommentOwnership, function (req, res) {
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
            return res.redirect("back");
        } else {
            Comment.findById(req.params.comment_id, function (err, comment) {
                if (err) {
                    console.log(err);
                    return res.redirect("back");
                } else {
                    res.render("comments/edit", {
                        comment: comment,
                        campground: campground
                    });
                }
            });
        }
    })
})

router.put("/:comment_id", middleware.checkCommentOwnership, function (req, res) {
    // .populate needs to happen up here
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, campground) {
        if (err) {
            console.log(err);
            return res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
})

router.delete("/:comment_id", middleware.checkCommentOwnership, function (req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function (err) {
        if (err) {
            res.redirect("/campgrounds/" + req.params.id);
        } else {
            req.flash("error", "Successfully deleted comment!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;