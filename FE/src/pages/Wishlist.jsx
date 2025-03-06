import axios from "axios";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Trash, ShoppingCart } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { addToCart } from "./Cart";
import { useMemo } from "react";


// Get the count of items in the user's wishlist
const getWishlistDetails = async ({ id, setWishlistItems }) => {
  axios
    .get("https://e-commerce-project-l7gm.onrender.com/api/wishlist/get", {
      params: { userId: id },
    })
    .then((response) => {
      setWishlistItems(response.data);
      console.log("Wishlist count:", response.data);
    })
    .catch((error) => {
      console.error("Error fetching wishlist count:", error);
    });
};

// Add item to the wishlist
const addToWishlist = async ({ id, proId }) => {
  console.log(id, proId);

  try {
    const response = await axios.post(
      "https://e-commerce-project-l7gm.onrender.com/api/wishlist/add",
      {
        userId: id,
        productId: proId,
      }
    );
    console.log("Added to wishlist:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    throw error;
  }
};

// Remove item from the wishlist
const removeFromWishlist = async ({ userId, productId }) => {
  axios
    .delete(
      "https://e-commerce-project-l7gm.onrender.com/api/wishlist/remove",
      {
        data: {
          userId,
          productId,
        },
      }
    )
    .then((response) => {
      console.log("Removed from wishlist:", response.data);
    })
    .catch((error) => {
      console.error("Error removing from wishlist:", error);
    });
};








const WishlistDialog = ({ user }) => {
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    if (user?.id) {
      getWishlistDetails({ id: user.id, setWishlistItems });
    }
  }, [user?.id]);

  const wishlistCount = useMemo(() => wishlistItems.length, [wishlistItems]);

  const handleRemoveFromWishlist = (productId) => {
    setWishlistItems((prev) =>
      prev.filter((item) => item.product.id !== productId)
    );
    removeFromWishlist(productId);
  };

  const handleAddToCart = (productId) => {
    addToCart({ userId: user.id, productId });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="relative flex flex-col items-center">
          <Button
            className="p-4 mt-2 w-full flex items-center justify-center gap-2"
            onClick={() =>
              getWishlistDetails({ id: user.id, setWishlistItems })
            }
          >
            <Heart className="w-6 h-6" />
            {wishlistCount > 0 && (
              <sup className="size-2 bg-red-600 rounded-full right-3"></sup>
            )}
            Wishlist
          </Button>
        </div>
      </DialogTrigger>

      <DialogContent className="mx-4">
        <DialogTitle className="text-xl font-semibold text-gray-800 mb-4">
          Your Wishlist
        </DialogTitle>
        <DialogDescription className="text-sm text-gray-600 mb-4">
          {wishlistCount > 0
            ? `You have ${wishlistCount} items in your wishlist.`
            : "Your wishlist is empty."}
        </DialogDescription>

        <div className="max-h-[80vh] overflow-y-auto">
          {wishlistCount > 0 &&
            wishlistItems.map(({ product }) => (
              <div
                key={product.id}
                className="p-4 mb-4 rounded-lg shadow-lg flex items-start bg-white text-black"
              >
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-24 h-24 object-cover mr-4 rounded"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{product.title}</h3>
                  <p className="text-sm text-gray-700">{product.description}</p>
                  <p className="text-sm text-blue-400 font-semibold mt-2">
                    ₹ {product.price.toFixed(2)}
                  </p>

                  <section className="flex flex-col gap-2 mt-4">
                    <Button
                      onClick={() => handleAddToCart(product.id)}
                      className="bg-yellow-300 text-black hover:bg-yellow-400 transition duration-200 w-full py-2"
                    >
                      <ShoppingCart className="size-5 mr-2" />
                      Add to Cart
                    </Button>

                    <Button
                      onClick={() => handleRemoveFromWishlist(product.id)}
                      className="bg-red-600 hover:bg-red-700 transition duration-200 w-full py-2 mt-2"
                    >
                      <Trash className="size-5 mr-2" />
                      Remove
                    </Button>
                  </section>
                </div>
              </div>
            ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export {
  getWishlistDetails,
  addToWishlist,
  removeFromWishlist,
  WishlistDialog,
};
