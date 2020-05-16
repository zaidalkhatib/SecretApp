//jshint esversion:6
require('dotenv').config()
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption")

mongoose.connect("mongodb://localhost:27017/user", { useNewUrlParser: true, useUnifiedTopology: true });
const userSchema = new mongoose.Schema({ email: String, password: String });

secret = process.env.SECRET;
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] })

const User = mongoose.model("user", userSchema);
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }))
app.get("/", (req, res) => {
    res.render("home")
})
app.get("/login", (req, res) => {
    res.render("login")
})
app.get("/secrets", (req, res) => {
    res.render("secrets")
})
app.get("/submit", (req, res) => {
    res.render("submit")
})
app.get("/logout", (req, res) => {
    res.redirect("/")
})
app.get("/register", (req, res) => {
    res.render("register")
})
app.post("/register", (req, res) => {
    const user = {
        email: req.body.username,
        password: req.body.password
    }
    newUser = new User({ email: user.email, password: user.password })
    newUser.save((err) => {
        if (err) {
            console.log("error")

        } else {
            console.log("items inserted")
            res.redirect("/login")
        }
    })

});
app.post("/login", (req, res) => {

    const email = req.body.username
    const password = req.body.password


    User.findOne({ email: email }, function(err, userInfo) {
        if (err) {
            console.log("err")
        } else {
            if (userInfo) {
                if (userInfo.password == password) {
                    console.log("found");
                    res.redirect("/secrets")
                } else {
                    res.redirect("/")
                    console.log("passward not found")
                }
            } else {
                res.redirect("/")
                console.log("not found")
            }
        }
    });
})
app.listen(3000, (req, res) => {
    console.log("port 3000 is working...")
})