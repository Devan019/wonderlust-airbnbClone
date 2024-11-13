const mongoose = require('mongoose');
const passportPlugin = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true
    }
})

UserSchema.plugin(passportPlugin); //use plugin for set auto password and username with salting and hasing

module.exports = new mongoose.model('User' , UserSchema);