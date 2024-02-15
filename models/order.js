const mongoose = require("mongoose");

const ordersSchema = new mongoose.Schema({
  custName: String,
  deliveryAddr: String,
  itemsOrdered: Array,
  orderTime: Date,
  orderStatus: String,
  deliveredBy: String,
  lisencePlate: String,
  proof: String,
});

module.exports = mongoose.model("order_collection", ordersSchema);
