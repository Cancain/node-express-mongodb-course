/* eslint-disable no-param-reassign */
const express = require("express");
const mongoose = require("mongoose");
const { ensureAuthenticated } = require("../helpers/auth");

const router = express.Router();

// Load idea model
require("../models/Idea");

const Idea = mongoose.model("ideas");

// Idea Index page
router.get("/", ensureAuthenticated, (req, res) => {
  Idea.find({ user: req.user.id })
    .sort({ date: "desc" })
    .then((ideas) => {
      res.render("ideas/index", {
        ideas,
      });
    });
});

// Add idea form
router.get("/add", ensureAuthenticated, (req, res) => {
  res.render("ideas/add");
});

// edit idea form
router.get("/edit/:id", ensureAuthenticated, (req, res) => {
  Idea.findOne({
    _id: req.params.id,
  }).then((idea) => {
    if (idea.user !== req.user.id) {
      req.flash("error_msg", "Not authorized");
      res.redirect("/ideas");
    } else {
      res.render("ideas/edit", {
        idea,
      });
    }
  });
});

// Process form
router.post("/", ensureAuthenticated, (req, res) => {
  const errors = [];

  if (!req.body.title) {
    errors.push({ text: "Please add a title" });
  }

  if (!req.body.details) {
    errors.push({ text: "Please add some details" });
  }

  if (errors.length > 0) {
    res.render("ideas/add", {
      errors,
      title: req.body.title,
      details: req.body.details,
    });
  } else {
    const newUser = {
      title: req.body.title,
      details: req.body.details,
      user: req.user.id,
    };
    new Idea(newUser).save().then(() => {
      req.flash("success_msg", "Idea added");
      res.redirect("/ideas");
    });
  }
});

// Edit form process
router.put("/:id", ensureAuthenticated, (req, res) => {
  Idea.findOne({
    _id: req.params.id,
  }).then((idea) => {
    // New values
    idea.title = req.body.title;
    idea.details = req.body.details;

    idea.save().then(() => {
      req.flash("success_msg", "Idea updated");
      res.redirect("/ideas");
    });
  });
});

// Delete idea
router.delete("/:id", ensureAuthenticated, (req, res) => {
  Idea.remove({ _id: req.params.id }).then(() => {
    req.flash("success_msg", "Idea deleted");
    res.redirect("/ideas");
  });
});

module.exports = router;
