/* eslint-disable max-lines-per-function */
/* eslint-disable new-cap */
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const router = express.Router();

const empty = 0;
const saltLength = 10;

//Load user model
require("../models/Users");
const User = mongoose.model("users");

//User login route
router.get("/login", (req, res) => {
  res.render("users/login");
});

//User register route
router.get("/register", (req, res) => {
  res.render("users/register");
});

//Register form POST
router.post("/register", (req, res) => {
  const errors = [];

  if (req.body.password !== req.body.password2) {
    errors.push({ text: "Passwords do not match" });
  }

  if (req.body.password.length < 4) {
    errors.push({ text: "Password must be at least 4 characters" });
  }

  if (errors.length > empty) {
    res.render("users/register", {
      errors: errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2
    });
  } else {
    User.findOne({ email: req.body.email }).then(user => {
      if (user) {
        req.flash("error_msg", "Email already registered");
        res.redirect("/users/register");
      } else {
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password
        });
        // eslint-disable-next-line handle-callback-err
        bcrypt.genSalt(saltLength, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) {
              throw err;
            }
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  "success_msg",
                  "You are now registered and can log in"
                );
                res.redirect("/users/login");
              })
              .catch(err => {
                console.log(err);
              });
          });
        });
      }
    });
  }
});

module.exports = router;
