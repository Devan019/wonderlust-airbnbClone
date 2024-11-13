const Reviews = require('../models/reviews');
const Listing = require('../models/listing');
const flash = require('connect-flash');

module.exports.addReview = async(req,res)=>{
    // console.log("in review");
    let {id} = req.params;
    
    // console.log(rate , comment , id)
    // console.log(req.body);

    let ownerReview = {...req.body , owner : req.user._id.toString()};

    const review = new Reviews(ownerReview);


    let list = await Listing.findById(id);
    if(!list){
        req.flash("failer" , "Listing doesn't exit!");
        res.redirect("/listings");
    }
    list.reviews.push(review);

    await review.save();
    await list.save();

    req.flash("success" , "review created");

    res.redirect(`/listings/${id}`);
     
};

module.exports.deleteReview = async(req,res)=>{

    let {id , reid} = req.params;
    if(!reid){
        req.flash("failer" , "review doen't exit!");
        res.redirect(`/listings/${id}`);
    }
    if(!id){
        req.flash("failer" , "Listing doesn't exit!");
        res.redirect("/listings");
    }

    await Listing.findByIdAndUpdate(id , {$pull : {reviews : reid}});
    await Reviews.findByIdAndDelete(reid);

    req.flash("success" , "review deleted");

    res.redirect(`/listings/${id}`);

};