const prisma = require("../prisma/prismaClient");




const addToWishlist = async (userId, productId) => {
  try {
    const wishlistItem = await prisma.wishlist.create({
      data: {
        userId,
        productId,
      },
    });
    
    return wishlistItem;
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    throw new Error("Failed to add to wishlist");
  }
};



const removeFromWishlist = async (userId, productId) => {
  try {
    const wishlistItem = await prisma.wishlist.findFirst({
      where: { userId, productId },
    });

    if (!wishlistItem) {
      throw new Error("Wishlist item not found");
    }

    await prisma.wishlist.delete({
      where: { id: wishlistItem.id }, 
    });

    return { success: true, message: "Removed from wishlist" };
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    throw new Error("Failed to remove from wishlist");
  }
};



const getWishlist = async (userId) => {
  try {
    const wishlist = await prisma.wishlist.findMany({
      where: { userId },
      include: {
        product: true,
      },
    });
    return wishlist;
  } catch (error) {
    console.error("Error getting wishlist:", error);
    throw new Error("Failed to get wishlist");
  }
};



module.exports = {
  addToWishlist,
  removeFromWishlist,
  getWishlist
};