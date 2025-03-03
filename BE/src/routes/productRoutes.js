const express = require("express");
const {
  add_product,
  update_product,
  delete_product,
  list_products,
  add_category,
  get_all_categories,
  product_by_id,
  get_all_products,
  get_Home_Page_Products,
} = require("../controller/productController");

const router = express.Router();

// Seller adds a product
router.post("/add", add_product);

// Seller updates an existing product
router.put("/update", update_product);

// Seller deletes a product
router.delete("/delete", delete_product);

// List all products of a seller
router.get("/list", list_products);

// Add a new category
router.post("/add-category", add_category);

// Get all categories
router.get("/category-list", get_all_categories);

// Get a product by ID
router.get("/:productId", product_by_id);

// get all products
router.get("/", get_all_products);

// get_Home_Page_Products
router.get("/home", get_Home_Page_Products);

module.exports = router;

// all product endpoins with params/body

// get all products  -- method: GET -- endpoint: https://e-commerce-ecuo.onrender.com/api/products/

// get product by id -- method: GET -- endpoint: https://e-commerce-ecuo.onrender.com/api/products/:productId

// add product -- method: POST -- endpoint: https://e-commerce-ecuo.onrender.com/api/products/add -- body: {title, description, price, stock, categoryId}

// update product -- method: PUT -- endpoint: https://e-commerce-ecuo.onrender.com/api/products/update -- body: {productId, title, description, price, stock, image}

// delete product -- method: DELETE -- endpoint: https://e-commerce-ecuo.onrender.com/api/products/delete -- body: {productId}

// add category -- method: POST -- endpoint: https://e-commerce-ecuo.onrender.com/api/products/add-category -- body: {name}

// get all categories -- method: GET -- endpoint: https://e-commerce-ecuo.onrender.com/api/products/category-list

// get home page products -- method: GET -- endpoint: https://e-commerce-ecuo.onrender.com/api/products/home

// get all products of a seller -- method: GET -- endpoint: https://e-commerce-ecuo.onrender.com/api/products/list -- query: {sellerId}
