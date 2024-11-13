const express = require("express");
const Route = express.Router();
const asyncWrap = require("../utils/asyncWrap");
const ExpressError = require('../utils/ExpressError.js');
const joiListing = require('../utils/joiModal.js');
const flash = require('connect-flash');
const {isLogined} = require('../middleware.js');
const {index , newList , createList , ownerList ,showList , updateListopt , updateList ,deleteList} = require("../Controllers/listing.js");
const multer = require('multer');
const {storage} = require('../cloudConfing.js');
const upload = multer({storage});

//validation with joi of listing schema

const validationWithJoi = (req,res,next) => {
    let {error} = joiListing.validate(req.body);

    if(error){
        // console.log(error);
        
        let errMsg = error.details.map((ele)=>ele.message).join(" , ");
        throw new ExpressError(402 , errMsg)
    }

    return next()

}


//index route and new list post route
Route.route("/")
.get(asyncWrap(index))
.post(isLogined, upload.single('upload')   ,asyncWrap(createList));
// ,validationWithJoi
// Route.post("/",upload.single('upload'), (req,res) => {
//     console.log(req.body);
//     res.send(req.file);
// })


//new route 
Route.get("/new",isLogined , newList);

//owner's lists
Route.get("/my" ,isLogined , asyncWrap(ownerList));

//show route & update route & delete route
Route.route("/:id")
.get(asyncWrap(showList))
.patch(isLogined ,asyncWrap(updateListopt))
.delete( isLogined ,asyncWrap(deleteList));



//update list route
Route.post("/:id/edit",isLogined  ,upload.single("image_upload")  , asyncWrap(updateList))




module.exports = Route