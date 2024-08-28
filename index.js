// app.js
const express = require("express");
const app = express();
const path = require("path");

// Set the view engine to EJS
app.set("view engine", "ejs");

// Set the directory for serving static files
app.use(express.static(path.join(__dirname, "public")));

// Define a route to render the index.ejs file
app.get("/", (req, res) => {
  res.render("pages/home");
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
