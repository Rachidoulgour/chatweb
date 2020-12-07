const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = Schema({
    username:{
        type: String,
        unique: true,
        required: true,
        min: 4,
        lowercase: true
    },
    email:{
        type: String,
        unique: true,
        required: true,
        lowercase: true
    },
    password:{
        type: String,
        required: true
    },
    city: String,
    role:{
        type: String,
        required: true
    },
    terms:{
        type: String,
        required: true
    },
    confirmedEmail:{
        type: Boolean
    },
    avatar: String

});
module.exports = mongoose.model('User', userSchema);