# Food Delivery Platform

This is a **full-stack web application** that simulates a food delivery platform. Customers can browse restaurant menus, place orders, and track their deliveries, while restaurants and drivers manage their side of operations.

---

## 🚀 Features

### Customer-side
- Browse restaurant menus
- Place food orders
- Track order and delivery status

### Restaurant-side
- Manage menus (add/update items)
- View and process incoming orders

### Driver-side
- View delivery assignments
- Update delivery progress

### Admin-side (restaurant owner)
- Update Food delivery status
- Check status of current and old deliveries

---

## 🌐 Live Demo

Check out the live demo here:  
👉 [https://bhansa-ghar.onrender.com/](https://bhansa-ghar.onrender.com/)

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (via Mongoose)
- **Frontend**: EJS templating, HTML/CSS, static assets
- **Authentication**: Passport.js (local + JWT), bcrypt
- **File Handling**: Multer (for file uploads)
- **Environment Management**: dotenv

---

## 📂 Project Structure

```bash
/controllers        → Delivery and business logic
/middlewares        → Custom middleware like authenticators
/models             → Mongoose schemas (driver, menu, order)
/public             → Static assets (CSS, images)
/routes             → Modular Express routes (delivery, order, restaurant)
/views              → EJS templates (order status, completion pages)
server.js          → Main server setup and MongoDB connection
