const express = require("express");
const {
  add_to_cart,
  get_cart_items,
  remove_from_cart,
  clear_cart,
  update_cart_quantity
} = require("../controller/cartController");

const router = express.Router();

// Add a product to the cart
router.post("/add", add_to_cart);

// Get all items in the cart
router.get("/items/:userId", get_cart_items);

// Remove a product from the cart
router.delete("/remove", remove_from_cart);

// Clear the cart
router.delete("/clear", clear_cart);

// Update the quantity of a product in the cart
router.put("/updatequantity", update_cart_quantity);

module.exports = router;

// get all routes with prefix /api/cart with params/query

// 1. Add to cart -- method: POST
//    Endpoint: https://e-commerce-project-l7gm.onrender.com/api/cart/add
//    Body: { userId, productId, quantity }

// 2. Get cart items -- method: GET
//    Endpoint: https://e-commerce-project-l7gm.onrender.com/api/cart/items/:userId

// 3. Remove from cart -- method: DELETE
//    Endpoint: https://e-commerce-project-l7gm.onrender.com/api/cart/remove
//    Body: { userId, productId }

// 4. Clear cart -- method: DELETE
//    Endpoint: https://e-commerce-project-l7gm.onrender.com/api/cart/clear
//    Example: https://e-commerce-project-l7gm.onrender.com/api/cart/clear?userId={userId}

// 5. Update cart quantity -- method: PUT
//    Endpoint: https://e-commerce-project-l7gm.onrender.com/api/cart/updatequantity
//    Body: { userId, productId, quantity }