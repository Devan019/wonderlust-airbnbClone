const express = require('express');
const route = express.Router();
const passport = require('passport')
const User = require("../models/user");

route.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }));

route.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    async (req, res) => {
        try {
            const { name, email } = req.user.profile._json;

            let user = await User.findOne({ email: email });

            if (!user) {
                user = new User({
                    email: email,
                    username: name,
                });
                await User.register(user, "google-login-on-airbnb");
            }
            req.user = user;

            req.login(user, (err) => {
                if (err) {
                    req.flash("failer", "Login error, please try again.");
                    return res.redirect("/login");
                }
                req.flash("success", "Welcome to wonderlust");
                res.redirect("/listings");
            });

        } catch (error) {
            req.flash("failer", error.message);
            res.redirect("/signup");
        }

    });

route.get('/github',
    passport.authenticate('github', { scope: ['user:email'] }));

route.get('/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    async (req, res) => {
        // Successful authentication, redirect home.
        try {
            // res.send(req.user);
            const obj = req.user.profile._json;
            let email = obj.html_url;
            let name = obj.login;
            let githubuser = await User.findOne({ email: email });
            if (!githubuser) {
                githubuser = new User({
                    email: email,
                    username: name,
                });
                await User.register(githubuser, "github-login-on-airbnb");
                req.user = githubuser;

                req.login(githubuser, (err) => {
                    if (err) {
                        req.flash("failer", "Login error, please try again.");
                        return res.redirect("/login");
                    }
                    req.flash("success", "Welcome to wonderlust");
                    res.redirect("/listings");
                });
            }
        } catch (error) {
            req.flash("failer", error.message);
            res.redirect("/signup");
        }
    });


module.exports = route