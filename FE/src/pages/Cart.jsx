
import axios from "axios";
import { useState } from "react";
import { ShoppingCart,Trash } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";


import { calculateTotalAmount, formatPriceInINR } from "@/lib/utils";
import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { createOrder } from "./Order";


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
  console.log("removing...");

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

// 5. Update cart quantity -- method: PUT
//    Endpoint: https://e-commerce-project-l7gm.onrender.com/api/cart/updatequantity
//    Body: { userId, productId, quantity }

const handleSetQuantity = async ({ userId, productId, quantity }) => {
  axios
    .put(
      "https://e-commerce-project-l7gm.onrender.com/api/cart/updatequantity",
      {
        userId,
        productId,
        quantity,
      }
    )
    .then((response) => {
      console.log("Quantity updated:", response.data);
    })
    .catch((error) => {
      console.error("Error updating quantity:", error);
    });
};









//-----------------------------------------------------------



const CartDialog = ({ user }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isCheckout, setIsCheckout] = useState(false);
  const [shippingAddress, setShippingAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [cartFetched, setCartFetched] = useState(false); // ✅ Prevents unnecessary calls

  const fetchCart = async () => {
    if (!cartFetched && user?.id) {
      await getCartDetails({ id: user.id, setCartItems });
      setCartFetched(true);
    }
  };

  const handleOpenDialog = () => {
    setIsOpen(true);
    fetchCart(); // ✅ Fetch only when opening the dialog
  };

  const handleRemoveItem = async (productId) => {
    await removeFromCart({ userId: user.id, productId });
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.productId !== productId)
    );
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity <= 0) return;
    await handleSetQuantity({
      userId: user.id,
      productId,
      quantity: newQuantity,
    });

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.productId === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handlePlaceOrder = async () => {
    if (!shippingAddress.trim()) {
      alert("Please enter a valid shipping address.");
      return;
    }

    setLoading(true);
    try {
      await createOrder({ userId: user.id, shippingAddress });

      setCartItems([]); // ✅ Clear cart after order
      setIsOpen(false); // ✅ Close dialog
      setIsCheckout(false); // ✅ Reset checkout state
      setCartFetched(false); // ✅ Ensure fresh data next time
    } catch (error) {
      console.error("Order Error:", error);
      alert("Failed to place order. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="relative flex flex-col items-center">
          <Button
            className="p-4 mt-2 w-full flex items-center justify-center gap-2"
            onClick={handleOpenDialog} // ✅ Load cart only when needed
          >
            <ShoppingCart className="w-6 h-6" />
            {cartItems.length > 0 && (
              <sup className="size-2 bg-green-600 rounded-full right-3"></sup>
            )}
            Cart
          </Button>
        </div>
      </DialogTrigger>

      <DialogContent className="mx-4">
        {!isCheckout ? (
          <>
            <DialogTitle className="text-xl font-semibold text-gray-800 mb-4">
              Your Cart
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600 mb-4">
              {cartItems.length > 0
                ? `You have ${cartItems.length} items in your cart.`
                : "Your cart is empty."}
            </DialogDescription>

            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-start bg-white shadow-lg p-4 rounded-lg"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.title}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <div className="flex-1 ml-4">
                    <h3 className="text-lg font-semibold">
                      {item.product.title}
                    </h3>
                    <p className="text-sm text-gray-700">
                      {item.product.description}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-blue-400 font-semibold">
                        {formatPriceInINR(item.product.price)}
                      </p>
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() =>
                            handleQuantityChange(
                              item.productId,
                              item.quantity - 1
                            )
                          }
                          className={`bg-yellow-300 text-black hover:bg-yellow-400 transition duration-200 p-2 ${
                            item.quantity === 1 ? "hidden" : ""
                          }`}
                        >
                          -
                        </Button>
                        <span>{item.quantity}</span>
                        <Button
                          onClick={() =>
                            handleQuantityChange(
                              item.productId,
                              item.quantity + 1
                            )
                          }
                          className="bg-yellow-300 text-black hover:bg-yellow-400 transition duration-200 p-2"
                        >
                          +
                        </Button>
                      </div>
                      <Button
                        onClick={() => handleRemoveItem(item.productId)}
                        className="text-red-500 hover:text-red-700 transition duration-200 font-bold"
                      >
                        <Trash className="size-5" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {cartItems.length > 0 && (
              <>
                <div className="flex justify-between border-t border-gray-300 mt-4 pt-4">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-lg font-bold">
                    {formatPriceInINR(calculateTotalAmount({ cartItems }))}
                  </span>
                </div>

                <div className="flex justify-end mt-4">
                  <Button
                    onClick={() => setIsCheckout(true)}
                    className="bg-yellow-300 text-black rounded-lg py-2 px-4 hover:bg-yellow-400 transition duration-200"
                  >
                    Checkout
                  </Button>
                </div>
              </>
            )}
          </>
        ) : (
          <>
            <DialogTitle className="text-xl font-semibold text-gray-800 mb-4">
              Checkout
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600 mb-4">
              Enter your shipping details to complete the purchase.
            </DialogDescription>

            <div className="mt-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Shipping Address
              </label>
              <Input
                type="text"
                placeholder="Enter your shipping address"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2"
              />
            </div>

            <div className="flex justify-between border-t border-gray-300 mt-4 pt-4">
              <span className="text-lg font-bold">Total</span>
              <span className="text-lg font-bold">
                {formatPriceInINR(calculateTotalAmount({ cartItems }))}
              </span>
            </div>

            <div className="flex justify-between mt-4">
              <Button
                onClick={() => setIsCheckout(false)}
                className="bg-gray-300 text-black rounded-lg py-2 px-4"
              >
                Back to Cart
              </Button>
              <Button
                onClick={handlePlaceOrder}
                className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition duration-200"
                disabled={loading}
              >
                {loading ? "Placing Order..." : "Confirm Order"}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};


export default CartDialog;

export {
  getCartDetails,
  addToCart,
  removeFromCart,
  handleSetQuantity,
  CartDialog,
};
