// seperation of concerns
//different model for owner

const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost.27017/scatch");

const ownerSchema = mongoose.Schema({
    fullname: {
        type:String,
        trim: true,
        minLength: 3
    },
    email: String,
    password: String,
    products: {
        tyep:Array, default:[]
    },
    gstin: String,
    picture: String
});

module.exports = mongoose.model("owner", ownerSchema);

