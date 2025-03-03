const express = require("express");
const {add_product,
  update_product,
  delete_product,
  list_products,
  get_product_details,
} = require("../controller/sellerController");

const router = express.Router();

// Seller adds a product
router.post("/add", add_product);

// Seller updates an existing product
router.put("/update", update_product);

// Seller deletes a product
router.delete("/delete", delete_product);

// List all products of a seller
router.get("/getall", list_products);

// Get details of a product
router.get("/product/:productId", get_product_details);

module.exports = router;



// get all routes with prefix /api/seller with params/query/body

// 1. add product -- method: POST -- endpoint: https://e-commerce-ecuo.onrender.com/api/seller/add -- body: {title, description, price, stock, image}

// 2. update product -- method: PUT -- endpoint: https://e-commerce-ecuo.onrender.com/api/seller/update -- body: {productId, title, description, price, stock, image}

// 3. delete product -- method: DELETE -- endpoint: https://e-commerce-ecuo.onrender.com/api/seller/delete -- body: {productId} 

// 4. list products -- method: GET -- endpoint: https://e-commerce-ecuo.onrender.com/api/seller/getall -- query: {sellerId}

// 5. get product details -- method: GET -- endpoint: https://e-commerce-ecuo.onrender.com/api/seller/product/:productId -- params: {productId} 


