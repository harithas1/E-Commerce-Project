const express = require("express");
const {
  add_to_wishlist,
  remove_from_wishlist,
  get_wishlist,
} = require("../controller/wishlistController");

const router = express.Router();

// Add a product to the wishlist
router.post("/add", add_to_wishlist);

// Remove a product from the wishlist
router.delete("/remove", remove_from_wishlist);

// Get the wishlist for a user
router.get("/get", get_wishlist);

module.exports = router;

// get all routes with prefix /api/wishlist with params/query

// 1. add to wishlist -- method: POST -- endpoint: https://e-commerce-project-l7gm.onrender.com/api/wishlist/add -- body: {userId, productId}

// 2. remove from wishlist -- method: DELETE -- endpoint: https://e-commerce-project-l7gm.onrender.com/api/wishlist/remove -- body: {userId, productId}

// 3. get wishlist -- method: GET -- endpoint: https://e-commerce-project-l7gm.onrender.com/api/wishlist/get -- query: {userId}
