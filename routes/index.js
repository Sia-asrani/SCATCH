const express = require("express");
const IsLoggedIn = require("../middleware/IsLoggedIn");
const productModel = require("../models/product-model");
const userModel = require("../models/user-model")
const router = express.Router();

router.get("/", function (req, res){
    let error = req.flash("error"); //got the error
    res.render("index", {error, loggedin: false}); // we need to send error to the ejs file asw
});
//the logged is different from the function "IsLoggedIn" -> this is a sep var for my ejs file.

router.get("/shop", IsLoggedIn, async function(req, res){
    let products = await productModel.find({});
    let success = req.flash("success");
    res.render("shop", {products, success});
});

router.get("/cart", IsLoggedIn, async function(req, res){
    let user = await userModel.findOne({email: req.user.email}).populate("cart");
    const bill = Number(user.cart[0].price + 20) - Number(user.cart[0].discount);
    res.render("cart", {user, bill});
});

router.get("/addedtocart/:productid", IsLoggedIn, async function(req, res){
    let user = await userModel.findOne({email: req.user.email});
    user.cart.push(req.params.productid)
    await user.save();
    req.flash("success", "added to cart");
    res.redirect("/shop");
});

router.get("/logout",IsLoggedIn, function(req, res){
    res.render("shop");
});

module.exports = router;
