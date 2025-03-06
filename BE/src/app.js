require("dotenv").config();
const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const reviewRoutes = require("./routes/reviewsRoutes");
const sellerRoutes = require("./routes/sellerRoutes");
const orderRoutes = require("./routes/ordersRoutes");


const app = express();

app.use(cors());

// -----------------------------------------------
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  })
);

app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    process.env.FRONTEND_URL
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  next();
});

// -----------------------------------------------------------

app.use(express.json());

// Add user routes
app.use("/api/auth", userRoutes);

// Add product routes
app.use("/api/products", productRoutes);

// cart routes
app.use("/api/cart", cartRoutes);

// Add review routes
app.use("/api/reviews", reviewRoutes);

// Add seller routes
app.use("/api/seller", sellerRoutes);

app.get("/test", (req, res) => {
  res.send("Test route works!");
});

// Add wishlist routes
app.use("/api/wishlist", wishlistRoutes);

// Add order routes
app.use("/api/orders", orderRoutes);

module.exports = app;
