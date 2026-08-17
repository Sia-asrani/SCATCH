const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {generateToken} = require("../utils/generateToken");

module.exports.registerUser = async function(req, res){
    try {
        let { email, password, fullname } = req.body;

        //need a check where even if one field mising, do not create account
        //this need arises since mongodb is schema less and will allow creation even if some fields left empty
        //use a package named joy?
        if (!email || !password || !fullname) {
            return res.render("index", {
                error: "All fields are required"
            });
        }
        //even if we dont write "fullname" in let and asked for it -> app crashes

        //also check if email already used
        let user = await userModel.findOne({email: email})
        if(user) return res.status(401).send("user already exists, please login");

        //for hashing
        bcrypt.genSalt(12, function(err, salt){
            bcrypt.hash(password, salt, async function(err, hash){
                if(err) return res.send(err.message);
                else {
                    let user = await userModel.create({
                    email,
                    password: hash,
                    fullname
                    });

                    //details needed during the session for authentication (token)
                    let token = generateToken(user);
                    res.cookie("token", token);

                    res.send("user created successfully");
                }
            });
        });
    } catch (err) {
        console.log(err.message);
        res.render("index", {
            error: "User already exists or something went wrong"
        });
    }
};

module.exports.loginUser = async function (req, res){
    let {email, password} = req.body;
    let user = await userModel.findOne({email});
    if(!user) return res.send("Email or password incorrect");
    //check if user exits and credentials correct
    bcrypt.compare(password, user.password, function(err, result) {
        if(result) {
            //set token usimg jwt
            let token = generateToken(user);
            res.cookie("token", token);
            res.redirect("/shop");
        }
        else{
            //Handling wrong password
            res.send("Email or password incorrect");
        }
    });
};

module.exports.logout = function(req, res){
    res.cookie("token", "");
    res.redirect("/");
};