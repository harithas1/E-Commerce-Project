const prisma = require("../prisma/prismaClient.js");

const addToCart = async ({ userId, productId, quantity }) => {
  if (!userId || !productId || !quantity) {
    throw new Error("Missing required fields");
  }
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  // Check if requested quantity exceeds stock
  if (quantity > product.stock) {
    throw new Error(`Only ${product.stock} items available in stock`);
  }

  const existingCartItem = await prisma.cart.findFirst({
    where: { userId, productId },
  });

  if (existingCartItem) {
    if (existingCartItem.quantity + quantity < 1) {
      throw new Error("Quantity must be at least 1");
    }
    const updatedCartItem = await prisma.cart.update({
      where: { id: existingCartItem.id },
      data: {
        quantity: existingCartItem.quantity + quantity,
      },
    });
    return updatedCartItem;
  } else {
    const newCartItem = await prisma.cart.create({
      data: {
        userId,
        productId,
        quantity,
      },
    });
    return newCartItem;
  }
};

const getCartItems = async (userId) => {
  if (!userId) throw new Error("userId is required.");

  const cartItems = await prisma.cart.findMany({
    where: { userId },
    include: {
      product: {
        select: {
          id: true,
          title: true,
          price: true,
          image: true,
        },
      },
    },
  });

  if (!cartItems.length) return { message: "Your cart is empty", items: [] };

  return cartItems;
};

const removeFromCart = async ({ userId, productId }) => {
  if (!userId || !productId)
    throw new Error("userId and productId are required.");

  const existingCartItem = await prisma.cart.findFirst({
    where: { userId, productId },
  });

  if (!existingCartItem) throw new Error("Item not found in the cart");

  await prisma.cart.delete({ where: { id: existingCartItem.id } });

  return { message: "Item removed from cart", deletedItem: existingCartItem };
};

// Service to clear all items in the cart for a user
const clearCart = async (userId) => {
  if (!userId) throw new Error("userId is required.");

  const existingItems = await prisma.cart.findMany({ where: { userId } });

  if (!existingItems.length) throw new Error("Cart is already empty");

  const deletedItems = await prisma.cart.deleteMany({ where: { userId } });

  return {
    message: "Cart cleared successfully",
    itemsDeleted: deletedItems.count,
  };
};






const updateCartQuantity = async ({ userId, productId, quantity }) => {
  if (!userId || !productId || quantity === undefined) {
    throw new Error("Missing required fields");
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  if (quantity > product.stock) {
    throw new Error(`Only ${product.stock} items available in stock`);
  }

  const existingCartItem = await prisma.cart.findFirst({
    where: { userId, productId },
  });

  if (!existingCartItem) {
    throw new Error("Item not found in the cart");
  }

  if (quantity < 1) {
    await prisma.cart.delete({
      where: { id: existingCartItem.id },
    });
    return { message: "Item removed from cart" };
  }

  const updatedCartItem = await prisma.cart.update({
    where: { id: existingCartItem.id },
    data: {
      quantity,
    },
  });

  return updatedCartItem;
};




module.exports = {
  addToCart,
  getCartItems,
  removeFromCart,
  clearCart,
  updateCartQuantity,
};
