const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/scatch");

const userSchema = mongoose.Schema({
    fullname: {
        type:String,
        trim: true,
        minLength: 3,
        required: true
    },
    email: {
        type: String, 
        required:true,
        unique: true
    },
    password: {
        type:String, 
        required:true
    },
    cart: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId, 
                ref: "product",
            },
            quantity: {
                type: Number,
                default: 1
            }
        }
    ],
    orders:{
        type: Array, default:[]
    },
    contact: Number,
    picture: String
});

module.exports = mongoose.model("user", userSchema);