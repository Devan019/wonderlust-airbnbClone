const express = require("express");
const Route = express.Router({mergeParams : true});
const ExpressError = require('../utils/ExpressError');
const joiReview = require('../utils/joireview.js');
const {isLogined} = require('../middleware.js');
const asyncWrap = require("../utils/asyncWrap.js");
const {addReview , deleteReview} = require('../Controllers/review.js');

//validation with joi to reviews route

const validationWithReview = (req,res,next) => {
    let {error} = joiReview.validate(req.body);
    if(error){
        // console.log(error);
        
        let errMsg = error.details.map((ele)=>ele.message).join(" , ");
        throw new ExpressError(402 , errMsg)
    }
    next();
}


//for reviews
//add review
Route.post("" , isLogined,  validationWithReview, asyncWrap(addReview));

//delete review
Route.delete("/:reid" ,isLogined, asyncWrap(deleteReview))

module.exports = Route
