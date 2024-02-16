const express = require("express");
const router = express.Router();
const Order = require("../../models/order");
const Driver = require("../../models/driver");

router.get("/", async (req, res) => {
  try {
    const orders = await Order.find();
    console.log(orders);
    return res.render("order/manage", { orders });
  } catch (err) {
    console.error(err);
    return res.status(500).send("An error occurred while fetching orders.");
  }
});

router.post("/search", async (req, res) => {
  const orders = await Order.find({ custName: req.body.custName });
  return res.render("order/manage", { orders });
});

router.post("/update_status", async (req, res) => {
  await Order.findByIdAndUpdate(req.body.order_id, {
    orderStatus: req.body.orderStatus,
  });
  return res.redirect("/manage");
});

router.get("/completed_orders", async (req, res) => {
  const orders = await Order.find({ orderStatus: "DELIVERED" });
  return res.render("order/completed_orders", { orders });
});

module.exports = router;
