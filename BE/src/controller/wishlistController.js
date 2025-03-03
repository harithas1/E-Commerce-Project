const {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} = require("../services/wishlistService");

//Add to Wishlist Controller
const add_to_wishlist = async (req, res) => {
  try {
    const { userId, productId } = req.body; 
    const wishlist = await addToWishlist(userId, productId);
    res.status(201).json(wishlist);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Remove from Wishlist Controller
const remove_from_wishlist = async (req, res) => {
  try {
    const { userId, productId } = req.body; 
    const wishlist = await removeFromWishlist(userId, productId);

    if (!wishlist) {
      return res.status(404).json({ error: "Wishlist item not found" });
    }

    res.status(200).json({ success: true, message: "Removed from wishlist" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//  Get Wishlist Controller
const get_wishlist = async (req, res) => {
  try {
    const { userId } = req.params; 
    const wishlist = await getWishlist(userId);
    res.status(200).json(wishlist);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  add_to_wishlist,
  remove_from_wishlist,
  get_wishlist,
};
