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
    let user = await userModel.findOne({email: req.user.email}).populate("cart.product");
    let subtotal = 0;
    user.cart.forEach(item => {
        subtotal += (item.product.price - item.product.discount) * item.quantity;
    });
    const bill = subtotal + 20; // platform fee
    res.render("cart", {user, bill, subtotal});
});

router.get("/addedtocart/:productid", IsLoggedIn, async function(req, res){
    let user = await userModel.findOne({email: req.user.email});
    let productId = req.params.productid;
    let cartItem = user.cart.find(item => item.product.toString() === productId);
    if (cartItem) {
        cartItem.quantity += 1;
    } else {
        user.cart.push({ product: productId, quantity: 1 });
    }
    await user.save();
    req.flash("success", "added to cart");
    res.redirect("/shop");
});

router.get("/increase/:index", IsLoggedIn, async function(req, res){
    let user = await userModel.findOne({email: req.user.email});
    user.cart[req.params.index].quantity += 1;
    await user.save();
    res.redirect("/cart");
});

router.get("/decrease/:index", IsLoggedIn, async function(req, res){
    let user = await userModel.findOne({email: req.user.email});
    if (user.cart[req.params.index].quantity > 1) {
        user.cart[req.params.index].quantity -= 1;
    }
    await user.save();
    res.redirect("/cart");
});

router.get("/logout",IsLoggedIn, function(req, res){
    res.render("shop");
});

module.exports = router;
