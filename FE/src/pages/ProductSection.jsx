import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Heart } from "lucide-react";
import { formatPriceInINR } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const ProductSection = ({ title, products, loading, onProductClick, user }) => {
  const [wishlistedItems, setWishlistedItems] = useState({});
  const [cartItems, setCartItems] = useState({});

  // Fetch initial data for wishlist and cart
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user's wishlist
        const wishlistResponse = await axios.get(
          "https://e-commerce-project-l7gm.onrender.com/api/wishlist/get",
          { params: { userId: user.id } }
        );
        setWishlistedItems(
          wishlistResponse.data.reduce((acc, item) => {
            acc[item.productId] = true;
            return acc;
          }, {})
        );

        // Fetch user's cart items
        const cartResponse = await axios.get(
          `https://e-commerce-project-l7gm.onrender.com/api/cart/items/${user.id}`
        );
        setCartItems(
          cartResponse.data.cartItems.reduce((acc, item) => {
            acc[item.productId] = true;
            return acc;
          }, {})
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [user.id]); // Runs once when `user.id` changes

  // Toggle Wishlist State
  const toggleWishlist = (e, productId) => {
    e.stopPropagation();
    const isInWishlist = wishlistedItems[productId];

    if (isInWishlist) {
      // If the product is already in the wishlist, remove it
      axios
        .delete(
          "https://e-commerce-project-l7gm.onrender.com/api/wishlist/remove",
          {
            data: { userId: user.id, productId: productId },
          }
        )
        .then(() => {
          setWishlistedItems((prev) => ({ ...prev, [productId]: false }));
        })
        .catch((error) => {
          console.error("Error removing from wishlist:", error);
        });
    } else {
      // If the product is not in the wishlist, add it
      axios
        .post("https://e-commerce-project-l7gm.onrender.com/api/wishlist/add", {
          userId: user.id,
          productId: productId,
        })
        .then(() => {
          setWishlistedItems((prev) => ({ ...prev, [productId]: true }));
        })
        .catch((error) => {
          console.error("Error adding to wishlist:", error);
        });
    }
  };

  // Toggle Cart State
  const toggleCart = (e, productId) => {
    e.stopPropagation();
    const isInCart = cartItems[productId];

    if (isInCart) {
      // If the product is already in the cart, remove it
      axios
        .delete(
          "https://e-commerce-project-l7gm.onrender.com/api/cart/remove",
          {
            data: { userId: user.id, productId: productId },
          }
        )
        .then(() => {
          setCartItems((prev) => ({ ...prev, [productId]: false }));
        })
        .catch((error) => {
          console.error("Error removing from cart:", error);
        });
    } else {
      // If the product is not in the cart, add it
      axios
        .post("https://e-commerce-project-l7gm.onrender.com/api/cart/add", {
          userId: user.id,
          productId: productId,
          quantity: 1,
        })
        .then(() => {
          setCartItems((prev) => ({ ...prev, [productId]: true }));
        })
        .catch((error) => {
          console.error("Error adding to cart:", error);
        });
    }
  };

  useEffect(() => {
    console.log("Wishlisted Items:", wishlistedItems);
    console.log("Cart Items:", cartItems);
  }, [wishlistedItems, cartItems]);

  return (
    <section className="mb-8">
      <h2 className="text-2xl rounded-t-lg font-bold mb-4 bg-yellow-300 p-4">
        {title}
      </h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {loading ? (
          // show skeleton
          Array.from({ length: 6 }).map((_, index) => (
            <Card
              key={index}
              className="p-4 shadow-md rounded-lg cursor-pointer transition hover:scale-105"
            >
              <CardContent className="flex flex-col items-center space-y-3">
                {/* Image Skeleton */}
                <Skeleton className="h-[180px] w-[180px] rounded-md" />

                {/* Text Skeletons */}
                <div className="w-full space-y-2">
                  <Skeleton className="h-5 w-4/5" />
                  <Skeleton className="h-4 w-3/5" />
                </div>

                {/* Wishlist & Cart */}
                <div className="flex justify-between w-full px-4">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <Skeleton className="h-6 w-6 rounded-full" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : products.length > 0 ? (
          products.map((product) => (
            <Card
              key={product.id}
              className="p-4 shadow-lg cursor-pointer hover:scale-100 transition"
              onClick={() => onProductClick(product)}
            >
              <CardContent className="flex flex-col items-center justify-between h-full">
                <section>
                  <img
                    src={product.image}
                    alt={product.title}
                    className="object-cover rounded-md mb-4"
                  />
                </section>
                <section>
                  <h3 className="text-lg font-bold">{product.title}</h3>
                  <p className="text-gray-500">
                    {formatPriceInINR(product.price)}
                  </p>
                  {/* Wishlist & Cart Icons */}
                  <div className="flex justify-between mt-4">
                    <Heart
                      className={`mr-2 cursor-pointer ${
                        wishlistedItems[product.id]
                          ? "text-red-500"
                          : "text-gray-500"
                      }`}
                      onClick={(e) => toggleWishlist(e, product.id)}
                      fill={wishlistedItems[product.id] ? "red" : "none"}
                    />
                    <ShoppingCart
                      className={`mr-2 cursor-pointer ${
                        cartItems[product.id]
                          ? "text-green-500"
                          : "text-gray-500"
                      }`}
                      onClick={(e) => toggleCart(e, product.id)}
                      fill={cartItems[product.id] ? "green" : "none"}
                    />
                  </div>
                </section>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-3 text-center">No {title} Available</div>
        )}
      </div>
    </section>
  );
};

export default ProductSection;
