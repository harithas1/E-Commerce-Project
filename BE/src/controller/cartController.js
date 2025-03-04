const {
  addToCart,
  getCartItems,
  removeFromCart,
  clearCart,
  updateCartQuantity
} = require("../services/cartService");

// Controller to add a product to the cart
const add_to_cart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || !quantity || isNaN(quantity) || quantity < 1) {
      return res
        .status(400)
        .json({ message: "Invalid quantity. Must be a positive number." });
    }

    const cartItem = await addToCart({ userId, productId, quantity });
    return res
      .status(201)
      .json({ success: true, message: "Item added to cart", cartItem });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Controller to get all items in the cart for a user
const get_cart_items = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId); 

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const cartItems = await getCartItems(userId);

    if (!Array.isArray(cartItems)) {
      return res
        .status(200)
        .json({ success: true, message: "Cart is empty", cartItems: [] });
    }

    return res
      .status(200)
      .json({ success: true, message: "Cart items retrieved", cartItems });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


// Controller to remove a product from the cart
const remove_from_cart = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({ message: "Missing userId or productId" });
    }

    const response = await removeFromCart({ userId, productId });
    return res.status(200).json({ success: true, ...response });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};



// Controller to clear all items in the cart for a user
const clear_cart = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const response = await clearCart(userId);
    return res.status(200).json({ success: true, ...response });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


const update_cart_quantity = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    const response = await updateCartQuantity({ userId:parseInt(userId), productId:parseInt(productId), quantity:parseInt(quantity) });
    return res.status(200).json({ success: true, ...response });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};




module.exports = {
  add_to_cart,
  get_cart_items,
  remove_from_cart,
  clear_cart,
  update_cart_quantity
};
