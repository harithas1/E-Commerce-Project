import axios from "axios";

// Get the count of items in the user's cart
const getCartDetails = async ({ id, setCartItems }) => {
  axios
    .get(`https://e-commerce-project-l7gm.onrender.com/api/cart/items/${id}`)
    .then((response) => {
      setCartItems(response.data.cartItems);
      console.log("Cart details:", response.data.cartItems);
    })
    .catch((error) => {
      console.error("Error fetching cart count:", error);
    });
};

// Add item to the cart
const addToCart = async ({ userId, productId }) => {
  console.log("Adding to cart", userId, productId);
  axios
    .post("https://e-commerce-project-l7gm.onrender.com/api/cart/add", {
      userId,
      productId,
      quantity: 1,
    })
    .then((response) => {
      console.log("Added to cart:", response.data);
    })
    .catch((error) => {
      console.error("Error adding to cart:", error);
    });
};

//  Remove from cart -- method: DELETE
//    Endpoint: https://e-commerce-project-l7gm.onrender.com/api/cart/remove
//    Body: { userId, productId }
// Remove item from the cart
const removeFromCart = async ({ userId, productId }) => {
  // If the product is already in the cart, remove it

  axios
    .delete("https://e-commerce-project-l7gm.onrender.com/api/cart/remove", {
      data: {
        userId,
        productId,
      },
    })
    .then((response) => {
      console.log("Removed from cart:", response.data);
    })
    .catch((error) => {
      console.error("Error removing from cart:", error);
    });
};

export { getCartDetails, addToCart, removeFromCart };
