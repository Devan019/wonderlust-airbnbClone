module.exports.isLogined = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        // console.log("in auth " ,  req.session.redirectUrl);
        req.flash("failer" , "user must be logined!");
        res.redirect("/login");
    }else{
        next();
    }
}

module.exports.saveUrl = (req,res , next) => {
    // console.log("in save " ,  req.session.redirectUrl);
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next()
}


