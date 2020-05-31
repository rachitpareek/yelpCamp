var express         = require("express"),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    flash           = require("connect-flash");
    methodOverride  = require("method-override");
    LocalStrategy   = require("passport-local"),
    Campground      = require("./models/campground"),
    Comment         = require("./models/comment"),
    User            = require("./models/user"),
    seedDB          = require("./seed"),
    commentRoutes   = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes     = require("./routes/index")

// don't need .js

var app = express();
app.use(flash());
app.use(bodyParser.urlencoded({ extended: true }));

// Helps set up cookies, esp for logged in sessions
app.use(require("express-session")({
    secret: "This is the secret.",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Make sure to include next and pass it in
app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error"); 
    res.locals.success = req.flash("success"); 
    next();
});

app.use(methodOverride("_method"));

// Here's where we specify which db to use
mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true, useUnifiedTopology: true });
app.use(express.static(__dirname + "/public"));

app.set("view engine", "ejs");

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

seedDB();

// Campground.create(
//      {
//          name: "Granite Hill", 
//          image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg",
//          description: "This is a huge granite hill, no bathrooms.  No water. Beautiful granite!"

//      },
//      function(err, campground){
//       if(err){
//           console.log(err);
//       } else {
//           console.log("NEWLY CREATED CAMPGROUND: ");
//           console.log(campground);
//       }
//     });

// {name: "Salmon Creek", image: "https://boyslifeorg.files.wordpress.com/2014/04/tent-featured.jpg?w=700&h=525"},
// {name: "Mountain Creek", image: "https://miro.medium.com/max/1200/1*ZwsuiM48pU22ugmPQq_5vA.jpeg"},
// {name: "Actual Creek", image: "https://grist.files.wordpress.com/2017/05/tent-campsite-by-river.jpg?w=1024&h=576&crop=1"},


app.listen(process.env.PORT || 3000, function () {
    console.log("yelpCamp server has started...");
});