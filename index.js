if (process.env.NODE_ENV != 'production') {
    require('dotenv').config();
}

const mongoose = require('mongoose')
const express = require('express');
const path = require('path');
var methodOverride = require('method-override')
const ejs_mate = require('ejs-mate');

const listings = require('./Routes/listing.js')
const reviews = require('./Routes/reviews.js');
const user = require('./Routes/user.js');

const User = require('./models/user.js');

const session = require('express-session'); //for use session
const flash = require('connect-flash'); //for connect to flash

const passport = require('passport'); // for use passpost
const LocalStrategy = require('passport-local'); //use local strategy of passport

const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;

const db_url = process.env.CLUSTER_URL;
const MongoStore = require('connect-mongo')


const auth = require('./Routes/auth.js');

async function connection(){
    await mongoose.connect(db_url);

}


connection()
    .then(() => {
        console.log("connection sucessfully")
    })
    .catch((err) => {
        console.log(err);
    })


const store = MongoStore.create({
    mongoUrl : db_url,
    crypto : {
        secret : process.env.SESSION_SECERT
    },
    touchAfter : 24 * 3600
})

const sessionOtp = {
    store,
    secret: process.env.SESSION_SECERT,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 3600 * 1000,
        maxAge: 7 * 3600 * 1000,
        httpOnly: true
    }
} //session options

const port = 3000
const app = express()

app.set("view engine", "ejs"); //engine set of ejs
app.set("views", path.join(__dirname, "views"))

app.use(flash());
app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, "public")))
app.use(session(sessionOtp));




//set up passport
//1 -> initialize passport
app.use(passport.initialize());

//2 -> use seesion in passport
app.use(passport.session());

//3-> use Localstrargy
passport.use(new LocalStrategy(User.authenticate()));

//4 -> set serializable-deserizable
passport.serializeUser((user, done) => {
    done(null, user);
})
passport.deserializeUser((user, done) => {
    done(null, user);
})


app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.failer = req.flash("failer");
    res.locals.error = req.flash("error");
    res.locals.err = req.flash("err");
    res.locals.currUser = req.user;
    res.locals.userId = "no";
    if (req.user && req.user._id) {
        res.locals.userId = req.user._id.toString();
    }
    res.locals.category = "";
    // console.log(req.user)
    next();
})

//5-> google setup
// console.log(process.env.GOOGLE_CLIENT_ID , process.env.GOOGLE_CLIENT_SECRET)
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
}, function (accessToken, refreshToken, profile, done) {
    const userProfile = {
        profile: profile,
    };
    done(null, userProfile);
}))


passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/github/callback"
},
    function (accessToken, refreshToken, profile, done) {
        const userProfile = {
            profile: profile,
        };
        done(null, userProfile);
    }
));




app.use(methodOverride('_method'))
app.engine("ejs", ejs_mate)


//root path
app.get("/", (req, res) => {
    res.redirect("/listings");
})


app.use("/listings", listings)
app.use("/listings/:id/reviews", reviews);
app.use("/", user);
app.use("/auth", auth);




app.use((err, req, res, next) => {

    let { statusCode = 400, msg = 'something went wrong' } = err;

    if (err && msg == "something went wrong") {
        msg = err;
    }

    // if(err.message)  msg = err.message;
    res.status(statusCode).render("errors/error", { msg })
})
app.all("*", (req, res, next) => {
    let msg = 'page is not found';

    return res.status(404).render("errors/notFound", { msg });
})




app.listen(port, () => {
    console.log("app is starting");
})