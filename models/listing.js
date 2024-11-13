const mongoose = require('mongoose');
const Review = require('./reviews')


const ListingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        url: String,
        filename: String
    },
    price: {
        type: Number,
    },
    location: String,
    country: String,
    category : [String],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
    }],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }

})

//use when list is delete and all review should be deleted.....
ListingSchema.post("findOneAndDelete", async (list) => {
    if (list) {
        await Review.deleteMany({ _id: { $in: list.reviews } });
    }
})

const Listing = new mongoose.model("Listing", ListingSchema);

module.exports = Listing;