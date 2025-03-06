const prisma = require("../prisma/prismaClient.js");


// Create a new order
const createOrder = async (userId, shippingAddress) => {
  if (!userId || !shippingAddress)
    throw new Error("User ID and shipping address are required.");

  const cartItems = await prisma.cart.findMany({
    where: { userId: parseInt(userId) },
    include: { product: true },
  });

  if (!cartItems.length) throw new Error("Your cart is empty.");

  // Calculate total amount
  const totalAmount = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const orders = await prisma.$transaction(
    cartItems.map((item) =>
      prisma.order.create({
        data: {
          userId: parseInt(userId),
          shippingAddress,
          totalAmount: item.product.price * item.quantity,
          status: "PENDING",
          productId: item.productId,
          quantity: item.quantity,
        },
      })
    )
  );

  // Update product stock
  await updateProductStock(cartItems);

  // Clear the cart
  await prisma.cart.deleteMany({ where: { userId: parseInt(userId) } });

  return order;
};

// Update product stock after creating order
const updateProductStock = async (cartItems) => {
  const productUpdates = cartItems.map((item) => {
    return prisma.product.update({
      where: { id: parseInt(item.productId) },
      data: { stock: { decrement: item.quantity } },
    });
  });

  await Promise.all(productUpdates);
};

// Get all orders for a customer
const getUserOrders = async (userId) => {
  const orders = await prisma.order.findMany({
    where: { userId: parseInt(userId) },
    include: { product: true },
  });

  return orders;
};

// Get all orders for a seller (only their products)
const getSellerOrders = async (sellerId) => {
  const orders = await prisma.order.findMany({
    where: {
      product: { sellerId: parseInt(sellerId) },
    },
    include: { product: true, user: true },
  });

  return orders;
};

// Update the status of an order (SHIPPED, DELIVERED, CANCELLED) by the seller
const updateOrderStatus = async (orderId, sellerId, status) => {
  const order = await prisma.order.findUnique({
    where: { id: parseInt(orderId) },
    include: { product: true },
  });

  if (!order) throw new Error("Order not found.");
  if (order.product.sellerId !== parseInt(sellerId))
    throw new Error("You are not authorized to update this order.");

  const updatedOrder = await prisma.order.update({
    where: { id: parseInt(orderId) },
    data: { status },
  });

  return updatedOrder;
};



module.exports = {
  createOrder,
  getUserOrders,
  getSellerOrders,
  updateOrderStatus,
};
