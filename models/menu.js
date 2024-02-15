const mongoose = require("mongoose");

// Define a schema
const Schema = mongoose.Schema;

const menuItemsSchema = new Schema({
  name: String,
  imgURI: String,
  description: String,
  price: Number,
});

const Menu = mongoose.model("menu_item_collection", menuItemsSchema);

module.exports = Menu;
