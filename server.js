const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");

// Setting up .env
require("dotenv").config();
const PORT = process.env.PORT || 3001;

//View Engine Setup
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Connecting to MongoDB
const mongoose = require("mongoose");
const mongoURI = process.env.DATABASE_URL;

mongoose.connect(
  mongoURI);
const db = mongoose.connection;

db.on("error", (error) => console.error(error));
db.once("open", () => console.log(`Connected to the database`));

const router = require("./routes/index.js");

// app.use(router.routes());

app.use(router);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://127.0.0.1:${PORT}`);
});
