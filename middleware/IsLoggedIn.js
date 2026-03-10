const jwt = require("jsonwebtoken");
const userModel = require("../models/user-model")

module.exports = async function(req, res, next){
    //token not there -> not  logged in
    if(!req.cookies.token){
        req.flash("error", "you need  to login first");
        res.redirect("/");
    }
    //check if password is correct
    try{
        let decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);
        let user = await userModel.findOne({email: decoded.email}).select("-password"); //but not password (can be fatal)
        req.user = user;
        next();
    } catch(err) {
        req.flash("error", "something went wrong");
        res.redirect("/");
    }
};
