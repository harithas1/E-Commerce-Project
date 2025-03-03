const express = require("express");
const {
  register_user,
  verify_email,
  login_user,
  add_review,
  create_order,
  get_all_products,
  get_Home_Page_Products,
  get_Filtered_Products,
} = require("../controller/userController");

const router = express.Router();

// Authentication Routes
router.post("/register", register_user);
router.get("/verify-email", verify_email);
router.post("/login", login_user);

// Review and Order Routes
router.post("/reviews", add_review); // Add a review
router.post("/orders", create_order); // Create an order

// Product Routes
router.get("/products", get_all_products);

// get home product
router.get("/homeproducts", get_Home_Page_Products);

// filter
router.get("/filter", get_Filtered_Products);

module.exports = router;

// all routes with params/query

// 1. register  -- method: POST -- endpoint: https://e-commerce-project-l7gm.onrender.com/api/auth/register -- body: {name, email, password, role}

// 2. verify-email  -- method: GET -- endpoint: https://e-commerce-project-l7gm.onrender.com/api/auth/verify-email -- query: {token}

// 3. login  -- method: POST -- endpoint: https://e-commerce-project-l7gm.onrender.com/api/auth/login -- body: {email, password}

// 4. add review -- method: POST -- endpoint: https://e-commerce-project-l7gm.onrender.com/api/auth/reviews -- body: {userId, productId, rating, comment}

// 5. create order  -- method: POST -- endpoint: https://e-commerce-project-l7gm.onrender.com/api/auth/orders -- body: {userId, productId, quantity}

// 6. get all products -- method: GET -- endpoint: https://e-commerce-project-l7gm.onrender.com/api/auth/products -- query: {limit, skip, search, categoryId}

// 7. get home page products -- method: GET -- endpoint: https://e-commerce-project-l7gm.onrender.com/api/auth/homeproducts -- query: {limit}

// 8. get filtered products -- method: GET -- endpoint: https://e-commerce-project-l7gm.onrender.com/api/auth/filter -- query: {categoryId, minPrice, maxPrice, search, sortBy, order, page, pageSize}
