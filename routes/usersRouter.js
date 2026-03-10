const express = require("express");
const router = express.Router();
const {registerUser, loginUser, logout} = require("../controllers/AuthController");
const IsLoggedIn = require("../middleware/IsLoggedIn");


router.get("/", function(req, res){
    res.send("hey");
});

//we need to use hashing to hash passowrd and also set up session (with cookies)
router.post("/register", registerUser);

//login page
router.post("/login", loginUser);

//logout route
router.get("/logout", logout);

module.exports = router;