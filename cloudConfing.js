const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');


cloudinary.config({
    cloud_name : "dpnae0bod",
    api_key : "182347773412996",
    api_secret : "ITWnUv_CNVorMBfbhWzRqyUehdY"
})

const storage = new CloudinaryStorage({
    cloudinary : cloudinary,
    params : {
        folder : 'Airbnb_Wonderlust',
        allowedFormats : ["jpeg" , "jpg" , "png"]
    }
})


module.exports = {
    cloudinary , storage
}