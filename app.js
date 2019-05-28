/* eslint-disable no-console */
const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

// Load routes
const ideas = require("./routes/ideas");
const users = require("./routes/users");

// Connect to mongoose
mongoose
	.connect("mongodb://localhost/vidjot-dev", {
		useNewUrlParser: true
	})
	.then(() => {
		console.log("MongoDB connected...");
	})
	.catch(err => { 
		console.log(err);
	});

// Handlebars Middleware
app.engine(
	"handlebars",
	exphbs({
		defaultLayout: "main"
	})
);

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Static folder
// eslint-disable-next-line no-undef
app.use(express.static(path.join(__dirname, "public")));

// Method override middleware
app.use(methodOverride("_method"));

// Express session middleware
app.use(
	session({
		secret: "secret",
		resave: true,
		saveUninitialized: true
	})
);

app.use(flash());

// Global variables
app.use(function (req, res, next) {
	res.locals.success_msg = req.flash("success_msg");
	res.locals.error_msg = req.flash("error_msg");
	res.locals.error = req.flash("error");
	next();
});

app.set("view engine", "handlebars");

//Index route
app.get("/", (req, res) => {
	const title = "Welcome";
	res.render("index", {
		title: title
	});
});

// About route
app.get("/about", (req, res) => {
	res.render("about");
});

// Use routes
app.use("/ideas", ideas);
app.use("/users", users);

const port = 5000;

app.listen(port, () => {
	console.log(`Server started on port ${port}`);
});
