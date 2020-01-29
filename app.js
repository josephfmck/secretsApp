//jshint esversion:6
//3.2 npm i dotenv
require('dotenv').config(); //3.2 environment var to hide our secret encryption
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

//3.3 grabbing from .env
console.log(process.env.API_KEY);


app.use(express.static("public")); //allows use of public folder
app.set('view engine', 'ejs');//ejs setup
app.use(bodyParser.urlencoded({
    extended: true
})); //body parses json? req.body

//2.0connect to db
mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true });

/*
//2.0 Setup DB
//2.1 Schema
const userSchema = {
    email: String,
    password: String
};
*/

//LEVEL2 Encryotion
//3.0 Mongoose Schema
//change userSchema to mongoose schema
const userSchema = new mongoose.Schema ({
    email: String,
    password: String
});

//3.1 using convenient method defining a secret
//using secret to encrypt our DB
//3.2  const secret = "movedThissecret." moved to secret moved to .env

                    //3.3 grab secret from .env
userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] }); //encryptedFields encrypts only password
//encrypt package as plugin
    //save() will encrypt password field
    //findOne() will decrypt our password field


//2.2 setup Model           //User collection, using schema
const User = new mongoose.model("User", userSchema);



//1.0 ROUTES
app.get("/", function(req, res){
    res.render("home"); //ejs
});

app.get("/login", function(req, res){
    res.render("login"); //ejs
});

app.get("/register", function(req, res){
    res.render("register"); //ejs
});


//2.3 Register POST route, FORM DATA
app.post("/register", function(req, res){
    //Create user using info from register form
        //creating from model
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });

    //2.4 save user and display secrets page
    newUser.save(function(err){
        if (err) {
            console.log(err);
        } else {
            //only access, render within register route
            res.render("secrets"); //ejs display
        }
    });
});

//2.5 login POST route, FORM DATA
app.post("/login", function(req, res){
    //2.5 User Entered credentials
    const username = req.body.username;
    const password = req.body.password;

    //2.6 look and check them against DB 
    User.findOne(
        {email: username}, //2.6 email with that username in the DB
        function(err, foundUser){
            if (err) {
                console.log(err);
            } else {
                if (foundUser) { //2.7 if DB email exists
                    //check DBpassword = inputPassword
                    if (foundUser.password === password){
                        res.render("secrets"); //ejs display
                    }
                }
            }
    });

});







app.listen(3000, function(){
    console.log("Server started on port 3000");
});