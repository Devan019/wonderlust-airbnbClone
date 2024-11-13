const Listing = require('../models/listing');
const flash = require('connect-flash');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({ accessToken: process.env.MAP_TOKEN });

module.exports.index = async (req, res, next) => {
    let listings = await Listing.find();
    res.render("listings/index", { listings });
}

module.exports.newList = (req, res, next) => {
    res.render("listings/new");
}

module.exports.createList = async (req, res, next) => {

    let newList = req.body;
    // res.send(newList);

    const api = await geocodingClient.forwardGeocode({
        query: `${newList.location}, ${newList.country}`,
        limit: 1
    })
        .send()

    const geometry = api.body.features[0].geometry;
    // console.log(geometry)

    
    newList = {
        ...newList, owner: req.user._id.toString(),
        image: {
            url: req.file.path,
            filename: req.file.filename
        },
        geometry:{
            type : geometry.type,
            coordinates : geometry.coordinates
        }
    };
    
    // res.send(newList)

    await Listing.create(newList);
    req.flash("success", "New Lising created");
    res.redirect("/listings")

};


module.exports.ownerList = async (req, res, next) => {
    let ownerLists = await Listing.find({ owner: req.user._id.toString() })
    res.render("listings/index", { listings: ownerLists })
};

module.exports.showList = async (req, res, next) => {

    let { id } = req.params;
    // console.log(id);
    let list = await Listing.findById(id).populate({
        path: "reviews", populate: {
            path: "owner"
        }
    }).populate("owner");

    if (!list) {
        req.flash("failer", "Listing doesn't exit!");
        return res.redirect("/listings");
    }
    res.render("listings/show", { list});
};

module.exports.updateListopt = async (req, res, next) => {
    let { id } = req.params;
    let list = await Listing.findById(id);
    let orignalList = list.image.url;
    let newUrl;


    if (orignalList.includes("unsplash")) newUrl = orignalList + "?w=200&h=250";
    else newUrl = orignalList.replace("/upload", "/upload/w_250,q_auto")

    if (!list) {
        req.flash("failer", "Listing doesn't exit!");
        res.redirect("/listings");
    }

    res.render('listings/update', { list, newUrl })

};

module.exports.updateList = async (req, res, next) => {
    // console.log("in")
    let { id } = req.params;
    let { title, description, price, location, country , category } = req.body;

    await Listing.findByIdAndUpdate(id, {
        title: title,
        description: description,
        price: price,
        location: location,
        country: country,
        category : category
    }, { new: true });
    if (req.file) {
        await Listing.findByIdAndUpdate(id, {
            image: {
                url: req.file.path,
                filename: req.file.filename
            },
        }, { new: true });
    }



    req.flash("success", "Lising updated");
    res.redirect(`/listings/${id}`);

};

module.exports.deleteList = async (req, res, next) => {
    let { id } = req.params;
    if (!id) {
        req.flash("failer", "Listing doesn't exit!");
        res.redirect("/listings");
    }
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Lising deleted");
    res.redirect("/listings")
};

