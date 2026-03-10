const mongoose = require("mongoose");
const dbgr = require("debug")("development: mongoose"); 
//debugger for good industry practice
//use "$env:DEBUG=development:*" in terminal
//all development ones should be run, DEBUG is the env var
//set DEBUG= empty, if we dont want any debuggers to run
const config = require("config");
const dotenv = require("dotenv").config();


mongoose.connect("mongodb://localhost:27017/scatch");
// .then(function(){
//     dbgr("connected");
// })
// .catch(function(err){
//     dbgr(err);
// })

module.exports = mongoose.connection;