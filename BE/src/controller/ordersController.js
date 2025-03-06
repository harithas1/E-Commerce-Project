const {
  createOrder,
  getUserOrders,
  getSellerOrders,
  updateOrderStatus,
} = require("../services/orderService");


// to (checkout)
const create_order = async (req, res) => {
  const { userId, shippingAddress } = req.body;

  try {
    if (!userId || !shippingAddress) {
      return res
        .status(400)
        .json({ message: "User ID and shipping address are required." });
    }

    const order = await createOrder(userId, shippingAddress);
    return res
      .status(201)
      .json({ success: true, message: "Order created successfully.", order });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Endpoint to get all orders for a customer
const get_orders = async (req, res) => {
  const { userId } = req.params;

  try {
    const orders = await getUserOrders(parseInt(userId));
    return res
      .status(200)
      .json({
        success: true,
        message: "Orders retrieved successfully.",
        orders,
      });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

//  to get all orders for a seller
const get_seller_orders = async (req, res) => {
  const { sellerId } = req.params;

  try {
    const orders = await getSellerOrders(parseInt(sellerId));
    return res
      .status(200)
      .json({
        success: true,
        message: "Seller orders retrieved successfully.",
        orders,
      });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

// to update the order status (only for sellers)
const update_order_status = async (req, res) => {
  const { orderId } = req.params;
  const { sellerId, status } = req.body;

  if (!["SHIPPED", "DELIVERED", "CANCELLED"].includes(status)) {
    return res.status(400).json({ success: false, message: "Invalid status." });
  }

  try {
    const updatedOrder = await updateOrderStatus(
      orderId,
      sellerId,
      status
    );
    return res
      .status(200)
      .json({
        success: true,
        message: "Order status updated successfully.",
        updatedOrder,
      });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}




module.exports = {
  create_order,
  get_orders,
  get_seller_orders,
  update_order_status,
};
