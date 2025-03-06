import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Heart, Star } from "lucide-react";
import { formatPriceInINR } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { getCartDetails, addToCart, removeFromCart } from "./Cart";
import {
  getWishlistDetails,
  addToWishlist,
  removeFromWishlist,
} from "./Wishlist";
import { Button } from "@/components/ui/button";
import { addingReview } from "./Reviews";

export const ProductCard = ({
  selectedProduct,
  user,
  setSelectedProduct,
  cartItems,
  wishlistItems,
  setCartItems,
  setWishlistItems,
}) => {
  console.log("selectedProduct", selectedProduct);
  console.log(
    "wishlistItems",
    wishlistItems.find((item) => item.productId=== selectedProduct.id)?"true":"false"
  );
  
  
  const [reviews, setReviews] = useState([]);
  const [addReview, setAddReview] = useState({ rating: 0, comment: "" });

  useEffect(() => {
    if (selectedProduct) {
      setReviews(selectedProduct.reviews || []);
    }
  }, [selectedProduct]); // Runs only when `selectedProduct` changes

  const handleAddReview = async () => {
    await addingReview(
      user.id,
      selectedProduct.id,
      addReview.rating,
      addReview.comment
    );
    setReviews((prev) => [...prev, addReview]);
    setAddReview({ rating: 0, comment: "" });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg relative max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <Button
          className="absolute top-2 right-2 text-xl"
          onClick={() => setSelectedProduct(null)}
        >
          X
        </Button>
        <img
          src={selectedProduct.image}
          alt={selectedProduct.title}
          className="h-48 place-self-center object-cover rounded-md mb-4"
        />

        <div className="absolute top-14 right-4 flex flex-col gap-2">
          <ShoppingCart
            onClick={() => {
              if (
                cartItems.some((item) => item.productId === selectedProduct.id)
              ) {
                removeFromCart({
                  userId: user.id,
                  productId: selectedProduct.id,
                });
                setCartItems((prev) =>
                  prev.filter((item) => item.productId !== selectedProduct.id)
                ); // Update state after removing
              } else {
                addToCart({
                  userId: user.id,
                  productId: selectedProduct.id,
                });
                setCartItems((prev) => [
                  ...prev,
                  { productId: selectedProduct.id },
                ]); // Update state after adding
              }
            }}
            className={`size-7 cursor-pointer transition-colors duration-200 ${
              cartItems.some((item) => item.productId === selectedProduct.id)
                ? "text-green-600"
                : "text-gray-400"
            }`}
          />

          <Heart
            onClick={() => {
              if (
                wishlistItems.some(
                  (item) => item.productId === selectedProduct.id
                )
              ) {
                removeFromWishlist({
                  userId: user.id,
                  productId: selectedProduct.id,
                });
                setWishlistItems((prev) =>
                  prev.filter((item) => item.productId !== selectedProduct.id)
                ); // Update state after removing
              } else {
                addToWishlist({
                  userId: user.id,
                  productId: selectedProduct.id,
                });
                setWishlistItems((prev) => [
                  ...prev,
                  { productId: selectedProduct.id },
                ]); // Update state after adding
              }
            }}
            className={`size-7 cursor-pointer transition-colors duration-200 ${
              wishlistItems.some(
                (item) => item.productId === selectedProduct.id
              )
                ? "text-red-600"
                : "text-gray-400"
            }`}
          />
        </div>

        <h3 className="text-xl font-bold">{selectedProduct.title}</h3>
        <p className="text-gray-600">{selectedProduct.description}</p>
        <p className="font-semibold text-green-700 text-xl mt-4">
          {formatPriceInINR(selectedProduct.price || 0)}
        </p>

        {/* Rating & Review */}
        <div className="mt-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Rating:</span>
            <div className="flex gap-1">
              {[...Array(5)].map((_, index) => (
                <Star
                  key={index}
                  className={`w-5 h-5 cursor-pointer fill-current ${
                    index < addReview.rating
                      ? "text-yellow-400"
                      : "text-gray-400"
                  }`}
                  onClick={() =>
                    setAddReview({ ...addReview, rating: index + 1 })
                  }
                />
              ))}
            </div>
          </div>

          <textarea
            placeholder="Add a comment"
            className="w-full p-2 border border-gray-300 rounded-md mt-2"
            value={addReview.comment}
            onChange={(e) =>
              setAddReview({ ...addReview, comment: e.target.value })
            }
          />
          <Button onClick={handleAddReview} className="mt-2 w-full bg-blue-600">
            Add Review
          </Button>
        </div>

        {/* Previous Reviews */}
        <div className="mt-4 max-h-96 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-2">Previous Reviews</h2>
          {reviews.map((review) => (
            <div key={review.id} className="mb-4 border-2 p-2 rounded-lg">
              <p className="font-semibold">{review.reviewerName}</p>
              <p>Comment: {review.comment}</p>
              <div className="flex items-center gap-1">
                Rating:{" "}
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    className={`w-5 h-5 fill-current ${
                      index < review.rating
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};





const Products = ({ title, products, loading, user }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    if (user?.id) {
      getCartDetails({ id: user.id, setCartItems });
      getWishlistDetails({ id: user.id, setWishlistItems });
    }
  }, [user?.id]);

  const toggleWishlist = async (e, productId) => {
    e.stopPropagation();
    if (wishlistItems.some((item) => item.productId === productId)) {
      await removeFromWishlist({ userId: user.id, productId });
      setWishlistItems((prev) =>
        prev.filter((item) => item.productId !== productId)
      );
    } else {
      await addToWishlist({ id: user.id, proId: productId });
      setWishlistItems((prev) => [...prev, { productId }]);
      console.log("Added to wishlist:", wishlistItems.length);
    }
  };

  const toggleCart = async (e, productId) => {
    e.stopPropagation();
    if (cartItems.some((item) => item.productId === productId)) {
      await removeFromCart({ userId: user.id, productId });
      setCartItems((prev) =>
        prev.filter((item) => item.productId !== productId)
      );
    } else {
      await addToCart({ userId: user.id, productId });
      setCartItems((prev) => [...prev, { productId }]);
    }
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  return (
    <section className="mb-8">
      <h2 className="text-2xl rounded-t-lg font-bold mb-4 bg-yellow-300 p-4">
        {title}
      </h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <Card
              key={index}
              className="p-4 shadow-md rounded-lg cursor-pointer transition hover:scale-105"
            >
              <CardContent className="flex flex-col items-center space-y-3">
                <Skeleton className="h-[180px] w-[180px] rounded-md" />
                <div className="w-full space-y-2">
                  <Skeleton className="h-5 w-4/5" />
                  <Skeleton className="h-4 w-3/5" />
                </div>
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
              onClick={() => handleProductClick(product)}
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
                  <div className="flex justify-between mt-4">
                    <Heart
                      className={`mr-2 cursor-pointer ${
                        wishlistItems.some(
                          (item) => item.productId === product.id
                        )
                          ? "text-red-500"
                          : "text-gray-500"
                      }`}
                      onClick={(e) => toggleWishlist(e, product.id)}
                      fill={
                        wishlistItems.some(
                          (item) => item.productId === product.id
                        )
                          ? "red"
                          : "none"
                      }
                    />
                    <ShoppingCart
                      className={`mr-2 cursor-pointer ${
                        cartItems.some((item) => item.productId === product.id)
                          ? "text-green-500"
                          : "text-gray-500"
                      }`}
                      onClick={(e) => toggleCart(e, product.id)}
                      fill={
                        cartItems.some((item) => item.productId === product.id)
                          ? "green"
                          : "none"
                      }
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
      {selectedProduct && (
        <ProductCard
          selectedProduct={selectedProduct}
          user={user}
          setSelectedProduct={setSelectedProduct}
          cartItems={cartItems}
          wishlistItems={wishlistItems}
          setWishlistItems={setWishlistItems}
          setCartItems={setCartItems}
        />
      )}
    </section>
  );
};

export default Products;
