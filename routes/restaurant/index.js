const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Define a schema
const Schema = mongoose.Schema;

const menuItemsSchema = new Schema({
  name: String,
  imgURI: String,
  description: String,
  price: Number,
});

// Compile model from schema
const orderData = require("../../models/order");
const menuItem = mongoose.model("menu_item_collection", menuItemsSchema);

// Create home route
router.get("/", async (req, res) => {
  try {
    const menu = await menuItem.find().exec();
    return res.render("restaurant", { menuItems: menu });
  } catch (error) {
    console.error("Error fetching Menu Items:", error);
    res.status(500).json({ error: "Error fetching Menu Items" });
  }
});

// Create order route
router.post("/order", async (req, res) => {
  const time = new Date();

  const itemsOrdered = Array.isArray(req.body.orderItem)
    ? req.body.orderItem
    : [req.body.orderItem];

  const menuItems = [];

  try {
    for (const id of itemsOrdered) {
      const menu = await menuItem.findById(id).exec();
      menuItems.push({
        id: menu._id,
        name: menu.name,
        price: menu.price,
      });
    }
  } catch (error) {
    res.status(500).json({ error: "Error fetching Menu Item" });
  }

  const orderDetails = {
    custName: req.body.customerName,
    deliveryAddr: req.body.customerAddress,
    itemsOrdered: menuItems,
    orderTime: time,
    orderStatus: "RECEIVED",
  };

  try {
    // console.log("In /order try block")
    const createOrder = new orderData(orderDetails);
    await createOrder.save();
    // Redirect to "/order-completed" with orderId and error as query parameters
    return res.redirect(
      `/order-completed?orderId=${createOrder._id}&error=null`
    );
  } catch (error) {
    // Redirect to "/order-completed" with error as a query parameter
    res.redirect(
      `/order-completed?error=${encodeURIComponent(
        `Sorry! Error making the order! ${error}`
      )}`
    );
  }
});

router.get("/order-completed", async (req, res) => {
  const id = req.query.orderId;
  const error = req.query.error;

  try {
    const data = await orderData.findById(id).exec();
    res.render("order-completed", { order: data, error: error });
  } catch (error) {
    res.render("order-completed", {
      order: null,
      error: `Sorry! Error making the order! ${error}`,
    });
  }
});

router.post("/check-status", async (req, res) => {
  const id = req.body.orderId;
  // console.log(id);
  try {
    const orderDetails = await orderData.findById(id).exec();
    if (orderDetails) {
      res.render("order-status", { orderStatus: orderDetails, error: null });
    } else {
      res.render("order-status", {
        orderStatus: null,
        error: `Sorry! No such order with ID : "${id}" found! ${error}`,
      });
    }
  } catch (error) {
    res.render("order-status", {
      orderStatus: null,
      error: `Sorry! No such order with ID : "${id}" found! ${error}`,
    });
  }
});

module.exports = router;
