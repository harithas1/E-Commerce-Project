import axios from "axios";

// Get the count of items in the user's wishlist
const getWishlistDetails = async ({ id, setWishlistItems })=> {
  axios
    .get("https://e-commerce-ecuo.onrender.com/api/wishlist/get", {
      params: { userId: id },
    })
    .then((response) => {
      setWishlistItems(response.data);
      console.log("Wishlist count:", response.data);
    })
    .catch((error) => {
      console.error("Error fetching wishlist count:", error);
    });
}

// Add item to the wishlist
const addToWishlist = async ({ id, proId })=> {
  console.log(id, proId);
  
    axios
      .post("https://e-commerce-ecuo.onrender.com/api/wishlist/add", {
        userId: id,
        productId: proId,
      })
      .then((response) => {
        console.log("Added to wishlist:", response.data);
      })
      .catch((error) => {
        console.error("Error adding to wishlist:", error);
      });
}

// Remove item from the wishlist
const removeFromWishlist = async({ userId, productId }) =>{
  // remove from wishlist -- method: DELETE -- endpoint: https://e-commerce-ecuo.onrender.com/api/wishlist/remove -- body: {userId, productId}
  axios
    .delete("https://e-commerce-ecuo.onrender.com/api/wishlist/remove", {
      data: {
        userId,
        productId,
      },
    })
    .then((response) => {
      console.log("Removed from wishlist:", response.data);
    })
    .catch((error) => {
      console.error("Error removing from wishlist:", error);
    });
}

export { getWishlistDetails, addToWishlist, removeFromWishlist };
