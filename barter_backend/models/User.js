const mongoose = require("mongoose")


// create a model schema for users

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    account_balance: {
        type: Number, 
        required: true
    },
    account_number: {
        type: Number,
        required: true
    },
    kyc_tier: {
        type: Number,
        default: 1
    },
    reg_date: { type: Date, default: Date.now },
    userRef: {
        type: String,
        default: ""
    },
    

})

module.exports = mongoose.model("User", UserSchema)