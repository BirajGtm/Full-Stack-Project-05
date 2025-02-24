const express = require("express");
const router = express.Router();
const Driver = require("../../models/driver");
const Orders = require("../../models/order");
const bcrypt = require("bcrypt");
const passport = require("passport");
const path = require("path");
const fs = require("fs");

const auth = require("../../middlewares/authenticator");

//Multer Setup
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname + "/temp/"));
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now());
  },
});
const upload = multer({ storage: storage });


const initializePassport = require("../../passport-config");
initializePassport(passport);

const flash = require("express-flash");
const session = require("express-session");

router.use(
  flash({
    sessionKeyName: "express-flash-message",
  })
);
router.use(
  session({
    secret: "Group 5 Secret",
    resave: false,
    saveUninitialized: false,
  })
);

router.use(passport.initialize());
router.use(passport.session());
router.use(express.static(path.join(__dirname, "../../public")));

//Routes Start from here

router.get("/", auth, async (req, res) => {
  const orders = await Orders.find({
    orderStatus: "READY FOR DELIVERY",
  }).exec();
  return res.render("delivery/open-deliveries", { user: req.user, orders });
});

//Login
router.get("/login", (req, res) => {
  return res.render("delivery/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/delivery",
    failureRedirect: "/delivery/login",
    failureFlash: true,
  })
);


//Register
router.get("/register", (req, res) => {
  return res.render("delivery/register");
});

router.post("/register", async (req, res) => {
  const newDriver = new Driver({ ...req.body });

  const salt = bcrypt.genSaltSync(10);
  newDriver.password = bcrypt.hashSync(newDriver.password, salt);

  try {
    let driver = await Driver.findOne({ username: newDriver.username });

    if (driver) {
      req.flash("error", "This username already exists !");
      return res.redirect("/delivery/register");
    }

    driver = await newDriver.save();
    req.flash("success", "Account created successfully, Please Login !");
    return res.redirect("/delivery/login");
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Some server error occured");
  }
});


//Accept Delivery
router.get("/open-deliveries/accept/:id", auth, async (req, res) => {
  try {
    const ongoing = await Orders.findOne({
      orderStatus: "IN TRANSIT",
      deliveredBy: req.user.name,
    }).exec();

    if (ongoing) {
      req.flash(
        "error",
        "You already have ongoing delivery. Please deliver the order first"
      );
      return res.redirect("/delivery/ongoing-delivery");
    }
    const accept = await Orders.findByIdAndUpdate(req.params.id, {
      orderStatus: "IN TRANSIT",
      deliveredBy: req.user.name,
      lisencePlate: req.user.license_plate,
    });
    return res.redirect("/delivery/ongoing-delivery");
  } catch (error) {
    console.log(error);
  }
});

//Deliver with Image
router.post(
  "/open-deliveries/deliver/:id",
  auth,
  upload.single("proof"),
  async (req, res) => {
    const imgPath = path.join(__dirname + "/temp/" + req.file.filename);
    const imageBuffer = fs.readFileSync(imgPath);

    const file_64 = Buffer.from(imageBuffer).toString("base64");
    try {
      const ongoing = await Orders.findByIdAndUpdate(req.params.id, {
        orderStatus: "DELIVERED",
        proof: file_64,
      });
      req.flash("success", "Order Delivered Successfully!");
      return res.redirect("/delivery");
    } catch (error) {
      console.log(error);
    }
  }
);


//ongoing delivery
router.get("/ongoing-delivery", auth, async (req, res) => {
  try {
    const ongoingOrder = await Orders.findOne({
      orderStatus: "IN TRANSIT",
      deliveredBy: req.user.name,
    });
    return res.render("delivery/delivery", {
      user: req.user,
      order: ongoingOrder,
    });
  } catch (error) {
    console.log(errors);
  }
});

//my deliveries
router.get("/my-deliveries", auth, async (req, res) => {
  try {
    const deliveries = await Orders.find({
      deliveredBy: req.user.name,
      orderStatus: "DELIVERED",
    });
    return res.render("delivery/completed-deliveries", {
      user: req.user,
      orders: deliveries,
    });
  } catch (error) {
    console.log(error);
  }
});


//logout
router.get("/logout", auth, (req, res) => {
  return req.logOut(() => res.redirect("/delivery/login"));
});

module.exports = router;
