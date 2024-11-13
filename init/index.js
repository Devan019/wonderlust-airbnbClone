if (process.env.NODE_ENV != 'production') {
    require('dotenv').config();
}

const Listing = require('../models/listing');
const mongoose = require('mongoose');
const sampleListings = require('./init');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({ accessToken: process.env.MAP_TOKEN });

async function connection() {
    await mongoose.connect(process.env.CLUSTER_URL);
}

connection()
    .then(() => {
        console.log("Connection successful");
    })
    .catch((err) => {
        console.error("Database connection error:", err);
    });

async function main() {
    // try {
        await Listing.deleteMany({});

        let i = 0;
        for (let data of sampleListings.data) {
            try {
                // Mapbox geocoding request
                const api = await geocodingClient.forwardGeocode({
                    query: `${data.location}, ${data.country}`,
                    limit: 1
                }).send();

                const geometry = api.body.features[0]?.geometry;
                if (!geometry) {
                    continue;
                }

                let owner = "6734998424242d67a7647ab0";
                if (i % 2 === 1) owner = "67349ef11222a05955b34e15";
                i++;

                let newInfo = new Listing({
                    title: data.title,
                    description: data.description,
                    image: {
                        url: data.image.url,
                        filename: data.image.filename
                    },
                    geometry: {
                        type: geometry.type,
                        coordinates: geometry.coordinates
                    },
                    category : data.category,
                    price: data.price,
                    location: data.location,
                    country: data.country,
                    owner: owner
                });

                await newInfo.save();
            } catch (err) {
                console.error("Error with Mapbox geocoding or saving listing:", err);
            }
        }
    // } catch (err) {
    //     console.error("Error in main function:", err);
    // }
}

main();
