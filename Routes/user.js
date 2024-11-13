const express = require('express');
const asyncWrap = require('../utils/asyncWrap');
const ExpressError = require('../utils/ExpressError');
const Route = express.Router();
const flash = require('connect-flash')
const passport = require('passport');
const { saveUrl } = require('../middleware');
const { signup, signupForm, login, loginform, logout } = require('../Controllers/user');

//get sign up and form of sign up
Route.route("/signup")
    .get(signup)
    .post( asyncWrap(signupForm))


//login and form
Route.route("/login")
    .get(login)
    .post(saveUrl, passport.authenticate("local", {
        failureRedirect: '/login',
        failureFlash: true,
    }),
        asyncWrap(loginform));


//logout 
Route.get("/logout", logout)

module.exports = Route;