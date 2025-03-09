const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const ejs_mate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const MongoStore = require('connect-mongo');
const User = require('./models/user.js');

if (process.env.NODE_ENV != 'production') {
    require('dotenv').config();
}

const listings = require('./Routes/listing.js');
const reviews = require('./Routes/reviews.js');
const user = require('./Routes/user.js');
const auth = require('./Routes/auth.js');

const app = express();
const port = 8080;

const db_url = process.env.CLUSTER_URL;
const localurl = "mongodb://127.0.0.1:27017/wanderlust"

const store = MongoStore.create({
    mongoUrl: db_url,
    crypto: {
        secret: process.env.SESSION_SECRET
    },
    touchAfter: 24 * 3600
});

const sessionOtp = {
    // store,
    secret: "18my9032-air2bnb400",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 3600 * 1000,
        maxAge: 7 * 3600 * 1000,
        httpOnly: true
    }
};

console.log(process.env.SESSION_SECERT)

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejs_mate);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
app.use(flash());
app.use(session(sessionOtp));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



console.log("all done")

app.use((err , req, res, next) => {
    console.log(err , "err")
    console.log("woe");
    res.locals.success = req.flash("success") || null;
    res.locals.failer = req.flash("failer") || null;
    res.locals.error = req.flash("error") || null;
    res.locals.err = req.flash("err") || null;
    res.locals.currUser = req.user || null;
    res.locals.userId = req.user && req.user._id ? req.user._id.toString() : "no";
    res.locals.category = "";
    next();
});
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
}, function (accessToken, refreshToken, profile, done) {
    const userProfile = { profile };
    done(null, userProfile);
}));

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/github/callback"
}, function (accessToken, refreshToken, profile, done) {
    const userProfile = { profile };
    done(null, userProfile);
}));
app.get("/", (req, res) => {
    res.redirect("/listings");
});

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);
app.use("/", user);
app.use("/auth", auth);

app.use((err, req, res, next) => {
    const { statusCode = 400, msg = 'Something went wrong' } = err;
    res.status(statusCode).render("errors/error", { msg });
});

app.all("*", (req, res, next) => {
    const msg = 'Page not found';
    res.status(404).render("errors/notFound", { msg });
});

app.listen(port, () => {
    console.log("App is starting on port", port);
});

async function connection() {
    try {
        await mongoose.connect(localurl);
        console.log("Connection successful");
    } catch (err) {
        console.error("Connection error:", err);
    }
}

connection()
.then(()=>{console.log("Connection successful");})
.catch((err)=>{console.error("Connection error:", err);})

