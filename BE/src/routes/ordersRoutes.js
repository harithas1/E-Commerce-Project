const express = require("express");
const router = express.Router();
const {
  create_order,
  get_orders,
  get_seller_orders,
  update_order_status,
} = require("../controller/ordersController");

router.post("/checkout", create_order);
router.get("/orders/:userId", get_orders);

router.get("/orders/seller/:sellerId", get_seller_orders);
router.patch("/orders/:orderId/status", update_order_status);

module.exports = router;


// get all routes with prefix /api/orders with params/query

// 1. create order -- method: POST -- endpoint: https://e-commerce-project-l7gm.onrender.com/api/orders/checkout -- body: {userId, shippingAddress}

// 2. get orders -- method: GET -- endpoint: https://e-commerce-project-l7gm.onrender.com/api/orders/orders/:userId -- params: {userId}

// 3. get seller orders -- method: GET -- endpoint: https://e-commerce-project-l7gm.onrender.com/api/orders/orders/seller/:sellerId -- params: {sellerId}



// 4. update order status -- method: PATCH -- endpoint: https://e-commerce-project-l7gm.onrender.com/api/orders/orders/:orderId/status -- params: {orderId} -- body: {sellerId, status}
