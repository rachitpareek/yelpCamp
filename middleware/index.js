var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function (err, campground) {
            if (err) {
                console.log(err);
                req.flash("error", "There was an error!");
                //  redirect is which route's typed in, render is which view as a file
                return res.redirect("back");
            } else {
                // ObjectID's are a different type of object
                if (campground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You are not authorized to do this!");
                    res.redirect("back");
                }
                // Don't need the leading / as this is an absolute path inside of views
            }
        });
    } else {
        // I've been looking for this!
        req.flash("error", "Please log in first!");
        res.redirect("back")
    }
}

middlewareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        req.flash("error", "Please log in first!");
        // Flashes on the next page you go to!
        res.redirect("/login");
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        // params is query string and form, body is body-parser
        Comment.findById(req.params.comment_id, function (err, comment) {
            if (err) {
                console.log(err);
                req.flash("error", "There was an error!");
                //  redirect is which route's typed in, render is which view as a file
                return res.redirect("back");
            } else {
                // ObjectID's are a different type of object
                console.log(comment.author.id);
                console.log(req.user._id);
                if (comment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You are not authorized to do this!");
                    return res.redirect("back");
                }
                // Don't need the leading / as this is an absolute path inside of views
            }
        });
    } else {
        // I've been looking for this!
        req.flash("error", "Please log in first!");
        return res.redirect("back")
    }
}

module.exports = middlewareObj;