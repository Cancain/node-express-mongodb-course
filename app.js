const express = require("express");

const app = express();
//
//Index route
app.get("/", (req, res) => {
  res.send("Index");
});

//About route
app.get("/about", (req, res) => {
  res.send("About");
});
const port = 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
