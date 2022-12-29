const mongoose = require("mongoose");



const planSchema = new mongoose.Schema({

    name: {
        type: String,
        trim: true,
        unique: true,
        required: [true, 'Please add a plan name'],
        maxlength: 32
    },

    price: {
        type: Number,
        trim: true,
        required: [true, 'Please add a price']
    },
 
}, {timestamps: true})




module.exports = mongoose.model("Plan", planSchema);