const User = require('../models/user');
const flash = require('connect-flash');

module.exports.signup = (req, res) => {
    res.render("Users/signup.ejs")
}

module.exports.signupForm = async (req, res, next) => {

    try {
        let { username, email, password } = req.body;


        const user = new User({
            email: email,
            username: username,
        })

        const resultuser = await User.register(user , password);
        

        req.login(resultuser , (err)=>{

            if(err){
                return next(err)
            }else{
                req.flash("success", "welcome to wonderlust");
            }
            res.redirect("/listings");
            
        })

    } catch (error) {
        req.flash("failer", error.message);
        res.redirect("/signup");
        // next({msg : error.message});
    }

};

module.exports.login = (req, res) => {
    const errorMessage = req.flash('error'); 
    // console.log(errorMessage)
    res.render("Users/login.ejs");
};

module.exports.loginform =  async(req, res) => {
    // console.log("in")
    req.flash("success", "Welcome back to wonderlust!");
    let redirectUrl = res.locals.redirectUrl || '/listings';
    
    if(redirectUrl.endsWith("reviews")){
        redirectUrl = redirectUrl.slice(0 , redirectUrl.length - 8);
    }
    res.redirect(redirectUrl);
};

module.exports.logout = (req,res) => {
    req.logout((err)=>{
        if(err){
            req.flash("failer" ,err);
        }else{
            req.flash("success" , "user logout successfully");
        }
        res.redirect("/listings");
    })
};