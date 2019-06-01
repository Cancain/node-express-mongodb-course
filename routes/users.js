/* eslint-disable new-cap */
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const passport = require("passport");

const router = express.Router();

const empty = 0;
const saltLength = 10;

// Load user model
require("../models/Users");

const User = mongoose.model("users");

// User login route
router.get("/login", (req, res) => {
  res.render("users/login");
});

// User register route
router.get("/register", (req, res) => {
  res.render("users/register");
});

// Login Form POST
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/ideas",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next);
});

// Register form POST
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
      errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2,
    });
  } else {
    User.findOne({ email: req.body.email }).then((user) => {
      if (user) {
        req.flash("error_msg", "Email already registered");
        res.redirect("/users/register");
      } else {
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
        });
        // eslint-disable-next-line handle-callback-err
        bcrypt.genSalt(saltLength, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (error, hash) => {
            if (error) {
              throw error;
            }
            newUser.password = hash;
            newUser
              .save()
              .then(() => {
                req.flash("success_msg", "You are now registered and can log in");
                res.redirect("/users/login");
              })
              .catch((e) => {
                console.log(e);
              });
          });
        });
      }
    });
  }
});

module.exports = router;
