import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { ShoppingCart, Heart, User, Star } from "lucide-react";
import { Pagination } from "@/components/ui/pagination";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { formatPriceInINR } from "@/lib/utils";
import ProductSection from "./ProductSection";
import { addToCart, getCartDetails, removeFromCart } from "./Cart";
import {
  addToWishlist,
  getWishlistDetails,
  removeFromWishlist,
} from "./Wishlist";
import Automotive from "../assets/Automotive.png";
import Books from "../assets/Books.png";
import Electronics from "../assets/Electronics.png";
import Fashion from "../assets/Fashion.png";
import Beauty from "../assets/Beauty.png";
import Sports from "../assets/Sports.png";
import Toys from "../assets/Toys.png";
import Appliances from "../assets/Appliances.png";
import Grocery from "../assets/Grocery.png";
import { SlidersHorizontal } from "lucide-react";
import flipkart from "../assets/flipkart.png";
import { Link } from "react-router-dom";
import { Trash } from "lucide-react";
import { PopoverArrow } from "@radix-ui/react-popover";
import { addingReview } from "./Reviews";
import { Skeleton } from "@/components/ui/skeleton";

const categoryIcons = {
  Automotive,
  Books,
  Electronics,
  Fashion,
  Beauty,
  Sports,
  Toys,
  Appliances,
  Grocery,
  flipkart,
};

const Dashboard = ({ user }) => {
  const navigate = useNavigate();

  // State Variables
  const [bestSellers, setBestSellers] = useState([]);
  const [newestArrivals, setNewestArrivals] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("price");
  const [order, setOrder] = useState("asc");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [totalProducts, setTotalProducts] = useState(0);
  const [categories, setCategories] = useState([]);
  const totalPages = Math.ceil(totalProducts / pageSize);

  // Product Details
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [addReview, setAddReview] = useState({ rating: 0, comment: "" });
  const [toggleWishlist, setToggleWishlist] = useState(false);
  const [toggleCart, setToggleCart] = useState(false);

  // to Calculate total amount for the cart
  const calculateTotalAmount = () => {
    let total = 0;
    cartItems.forEach((item) => {
      total += item.quantity * item.product.price;
    });
    console.log("Total amount:", total);
    return total;
  };

  // Fetch Categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "https://e-commerce-project-l7gm.onrender.com/api/products/category-list"
      );
      setCategories(response.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Fetch Homepage Products (Best Sellers & Newest Arrivals)
  const fetchHomePageProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://e-commerce-project-l7gm.onrender.com/api/auth/homeproducts",
        { params: { limit: 10 } }
      );

      if (response.data) {
        setBestSellers(response.data.bestSellers || []);
        console.log("Best Sellers:", response.data.bestSellers);

        setNewestArrivals(response.data.newestArrivals || []);
      }
    } catch (error) {
      console.error("Error fetching homepage products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Filtered Products
  const fetchFilteredProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        categoryId: category !== "all" ? category : undefined,
        minPrice: minPrice ? parseFloat(minPrice) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
        search: search.trim() || undefined,
        sortBy,
        order,
        page,
        pageSize,
      };

      const response = await axios.get(
        "https://e-commerce-project-l7gm.onrender.com/api/auth/filter",
        { params }
      );

      if (response.data) {
        setFilteredProducts(response.data.data || []);
        setTotalProducts(response.data.totalCount || 0);
      }
    } catch (error) {
      console.error("Error filtering products:", error);
    } finally {
      setLoading(false);
    }
  }, [category, search, sortBy, order, minPrice, maxPrice, page]);

  // Update Cart and Wishlist after Add/Remove
  const updateCartAndWishlist = () => {
    getCartDetails({ id: user.id, setCartItems });
    getWishlistDetails({ id: user.id, setWishlistItems });
  };

  useEffect(() => {
    updateCartAndWishlist(); // Fetch cart and wishlist initially
  }, [user.id]);

  useEffect(() => {
    fetchHomePageProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (search.trim() || category !== "all" || minPrice || maxPrice) {
      fetchFilteredProducts();
    } else {
      setFilteredProducts([]);
    }
  }, [
    category,
    search,
    sortBy,
    order,
    minPrice,
    maxPrice,
    page,
    fetchFilteredProducts,
  ]);

  // Handle Category Click
  const handleCategoryClick = (categoryId) => {
    setCategory(categoryId);
    setPage(1);
  };

  // Handle Page Change
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  // Handle Product Click
  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setReviews(product.reviews);
  };

  // Handle Add to Cart
  const handleAddToCart = async () => {
    setToggleCart((prev) => !prev);

    // Optimistically update UI
    if (toggleCart) {
      setCartItems((prevCartItems) =>
        prevCartItems.filter((item) => item.product.id !== selectedProduct.id)
      );
      await removeFromCart({ userId: user.id, productId: selectedProduct.id });
    } else {
      setCartItems((prevCartItems) => [
        ...prevCartItems,
        { product: selectedProduct, quantity: 1 },
      ]);
      await addToCart({ userId: user.id, productId: selectedProduct.id });
    }

    // Refresh Cart Data from Server
    updateCartAndWishlist();
  };

  // Handle Add to Wishlist
  const handleAddToWishlist = async () => {
    setToggleWishlist((prev) => !prev);

    // Optimistically update UI
    if (toggleWishlist) {
      setWishlistItems((prevWishlistItems) =>
        prevWishlistItems.filter(
          (item) => item.product.id !== selectedProduct.id
        )
      );
      await removeFromWishlist({
        userId: user.id,
        productId: selectedProduct.id,
      });
    } else {
      setWishlistItems((prevWishlistItems) => [
        ...prevWishlistItems,
        { product: selectedProduct },
      ]);
      await addToWishlist({ id: user.id, proId: selectedProduct.id });
    }

    // Refresh Wishlist Data from Server
    updateCartAndWishlist();
  };

  // Handle Add Review
  const handleAddReview = async () => {
    await addingReview(
      user.id,
      selectedProduct.id,
      addReview.rating,
      addReview.comment
    );
    setReviews([...reviews, addReview]);
    setAddReview({ rating: 0, comment: "" });
  };

  // Apply Filters
  const applyFilters = () => {
    fetchFilteredProducts();
  };

  // Reset Filters
  const resetFilters = () => {
    setSearch("");
    setCategory("all");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("price");
    setOrder("asc");
    setPage(1);
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <div className="flex flex-col h-screen">
      <nav className="bg-blue-700 text-white px-4 py-3 flex justify-between items-center fixed top-0 left-0 right-0 z-40">
        <div className="flex items-center flex-row gap-4">
          <Link to="/">
            <img src={categoryIcons.flipkart} alt="Logo" className="" />
          </Link>
          <Input
            className="text-white placeholder:text-gray-300"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Popover>
            <PopoverTrigger>
              <SlidersHorizontal
                aria-label="Filter products"
                className="size-6 mr-4 cursor-pointer"
              />
            </PopoverTrigger>
            <PopoverContent className="bg-blue-700 text-white p-4 w-64">
              <div className="flex flex-col space-y-4">
                <div>
                  <Select
                    onValueChange={(value) => setCategory(value)}
                    value={category}
                  >
                    <SelectTrigger className="text-white">
                      Category
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Input
                    className="placeholder:text-gray-300  text-white"
                    placeholder="Min Price"
                    type="number"
                    min={minPrice ? parseInt(minPrice) : 0}
                    onChange={(e) => setMinPrice(e.target.value)}
                  />
                  <Input
                    className="placeholder:text-gray-300 text-white"
                    placeholder="Max Price"
                    type="number"
                    min={parseInt(minPrice) + 1}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Select
                    onValueChange={(value) => setSortBy(value)}
                    value={sortBy}
                  >
                    <SelectTrigger className="placeholder:text-gray-300 text-white">
                      Sort By
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="price">Price</SelectItem>
                      <SelectItem value="popularity">Popularity</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    onValueChange={(value) => setOrder(value)}
                    value={order}
                  >
                    <SelectTrigger className="placeholder:text-gray-300 text-white">
                      Order
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asc">Asc</SelectItem>
                      <SelectItem value="desc">Desc</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={applyFilters}
                  className="bg-yellow-300 text-black"
                >
                  Apply Filters
                </Button>
                <Button onClick={resetFilters} className="bg-red-600">
                  Reset Filters
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex gap-4 ">
          {/* Cart popover */}
          <Popover>
            <PopoverTrigger>
              <div className="relative flex flex-col items-center">
                <ShoppingCart
                  className="cursor-pointer size-6 text-white"
                  // onClick={() => setShowCart(true)}
                />
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                    {cartItems.length}
                  </span>
                )}
                <span className="text-white text-xs mt-1">Cart</span>
              </div>
            </PopoverTrigger>

            <PopoverContent className="bg-blue-700 mr-4 text-white p-6 w-full max-h-[400px] overflow-y-auto rounded-lg shadow-lg">
              <PopoverArrow sideoffset={10} />

              <h2 className="text-lg font-bold mb-4">Your Cart</h2>

              {/* Table for cart details */}
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="text-left p-2">Image</th>
                    <th className="text-left p-2">Title</th>
                    <th className="text-left p-2">Price</th>
                    <th className="text-left p-2">Quantity</th>
                    <th className="text-left p-2">Total</th>
                    <th className="text-left p-2">Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.length > 0 ? (
                    cartItems.map((item) => (
                      <tr key={item.id} className="border-b border-gray-200">
                        <td className="p-2">
                          <img
                            src={item.product.image}
                            alt={item.product.title}
                            className="w-12 h-12 object-cover rounded-md"
                          />
                        </td>
                        <td className="p-2">{item.product.title}</td>
                        <td className="p-2">
                          {formatPriceInINR(item.product.price)}
                        </td>
                        <td className="p-2">{item.quantity}</td>
                        <td className="p-2">
                          {formatPriceInINR(item.product.price * item.quantity)}
                        </td>
                        <td className="p-2">
                          <button
                            onClick={() =>
                              removeFromCart({
                                userId: user.id,
                                productId: item.product.id,
                              })
                            }
                            className="text-red-500 hover:text-red-700 transition duration-200 font-bold"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="text-center p-4 text-sm text-gray-400"
                      >
                        Your cart is empty.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Total Row */}
              {cartItems.length > 0 && (
                <div className="flex justify-between border-t border-gray-300 mt-4 pt-4">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-lg font-bold">
                    {formatPriceInINR(calculateTotalAmount())}
                  </span>
                </div>
              )}

              {/* Checkout Button */}
              <div className="flex justify-end mt-4">
                <Button
                  onClick={() => navigate("/checkout")}
                  className="bg-yellow-300 text-black rounded-lg py-2 px-4 hover:bg-yellow-400 transition duration-200"
                >
                  Checkout
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Wishlist popover */}

          <Popover>
            <PopoverTrigger>
              <div className="relative flex flex-col items-center">
                <Heart
                  className="cursor-pointer size-6 text-white"
                  onClick={() =>
                    getWishlistDetails({ id: user.id, setWishlistItems })
                  }
                />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                    {wishlistItems.length}
                  </span>
                )}
                <span className="text-white text-xs mt-1">Wishlist</span>
              </div>
            </PopoverTrigger>

            <PopoverContent className="bg-blue-700 mr-4 p-4 w-64 max-h-96 overflow-y-auto">
              <PopoverArrow sideoffset={5} />

              <h2 className="text-lg font-bold mb-4 text-white">
                Your Wishlist
              </h2>
              <div>
                {wishlistItems.length > 0 ? (
                  wishlistItems.map((item) => (
                    <Card
                      key={item.product.id}
                      className="p-3 mb-4 rounded-lg shadow-lg flex items-start"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.title}
                        className="w-16 h-16 object-cover mr-4 rounded"
                      />
                      <div className="flex-1">
                        <h3 className="text-sm font-bold">
                          {item.product.title}
                        </h3>
                        <p className="text-xs text-gray-700">
                          {item.product.description}
                        </p>
                        <p className="text-xs text-blue-400 font-bold mt-2">
                          ₹ {item.product.price.toFixed(2)}
                        </p>

                        <section className="flex flex-col">
                          <Button
                            onClick={() =>
                              addToCart({
                                userId: user.id,
                                productId: item.productId,
                              })
                            }
                            className="-ml-6 bg-yellow-300 text-black mt-2 hover:bg-yellow-400 transition duration-200"
                          >
                            <ShoppingCart className="size-4" />
                            Add to Cart
                          </Button>

                          <Button
                            onClick={() => removeFromWishlist(item.id)}
                            className="-ml-6 hover:bg-red-700 transition duration-200 bg-red-600 mt-2"
                          >
                            {" "}
                            <Trash className="size-4" />
                            Remove
                          </Button>
                        </section>
                      </div>
                    </Card>
                  ))
                ) : (
                  <p className="text-white text-xs">Your wishlist is empty.</p>
                )}
              </div>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger>
              <div className="flex flex-col items-center">
                <User className="cursor-pointer size-6" />
                <span className="text-xs mt-1">Profile</span>
              </div>
            </PopoverTrigger>

            <PopoverContent className="bg-blue-700 text-white p-4 mr-4">
              <PopoverArrow sideOffset={5} />
              <div>
                <strong className="text-xl font-semibold">{user.name}</strong>
                <p className="text-gray-400">{user.email}</p>
                {user.role === "SELLER" && (
                  <div className="mt-2">
                    <Button
                      onClick={() => navigate("/seller-dashboard")}
                      className="bg-green-300 w-full text-black"
                    >
                      Seller Dashboard
                    </Button>
                  </div>
                )}
                <div className="mt-2">
                  <Button onClick={handleLogout} className="bg-red-600 w-full">
                    Logout
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </nav>

      {/* All categories */}
      <div className="container mx-auto mt-24 p-4  border-4 border-yellow-200 rounded-xl flex flex-wrap justify-center gap-4">
        {categories.length === 0
          ? // Skeleton Loader
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="flex flex-col items-center space-y-2">
                <Skeleton className="w-12 h-12 rounded-full" />
                <Skeleton className="h-4 w-16 rounded" />
              </div>
            ))
          : // Categories
            categories.map((category) => (
              <div
                key={category.id}
                className="flex flex-col items-center cursor-pointer transition-transform hover:scale-105 hover:text-blue-500"
                onClick={() => handleCategoryClick(category.id)}
              >
                <img
                  className="w-8 h-8 mb-2"
                  src={categoryIcons[category.name]}
                  alt={category.name}
                />
                <span className="text-xs">{category.name}</span>
              </div>
            ))}
      </div>
      <div className="container mx-auto p-4">
        {/* Show Best Sellers and New Arrivals if no filters/search */}
        {filteredProducts.length === 0 && !search && (
          <>
            <ProductSection
              title="Best Sellers"
              products={bestSellers}
              loading={loading}
              onProductClick={handleProductClick}
              user={user}
            />
            <ProductSection
              title="Newest Arrivals"
              products={newestArrivals}
              loading={loading}
              onProductClick={handleProductClick}
              user={user}
            />
          </>
        )}

        {/* Show filtered products if filters or search are applied */}
        {(filteredProducts.length > 0 || search) && (
          <ProductSection
            title="Filtered Products"
            products={filteredProducts}
            loading={loading}
            onProductClick={handleProductClick}
            user={user}
          />
        )}

        {selectedProduct && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center ">
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
                  onClick={() => handleAddToCart(selectedProduct)}
                  className="size-7 cursor-pointer"
                />
                <Heart
                  onClick={() => handleAddToWishlist(selectedProduct)}
                  className="size-7 cursor-pointer"
                />
              </div>
              <h3 className="text-xl font-bold">{selectedProduct.title}</h3>
              <p className="text-gray-600">{selectedProduct.description}</p>
              <p className="font-semibold text-green-700 text-xl mt-4">
                {formatPriceInINR(selectedProduct.price || 0)}
              </p>

              <div className="mt-4">
                {/* add rating and comment */}
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
                          setAddReview({
                            ...addReview,
                            rating: index + 1,
                          })
                        }
                      />
                    ))}
                  </div>
                </div>
                <div className="mt-4">
                  <textarea
                    placeholder="Add a comment"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={addReview.comment}
                    onChange={(e) =>
                      setAddReview({
                        ...addReview,
                        comment: e.target.value,
                      })
                    }
                  />
                  <Button
                    onClick={handleAddReview}
                    className="mt-2 w-full bg-blue-600"
                  >
                    Add Review
                  </Button>
                </div>
                {/* previous reviews */}
                <div className="mt-4 max-h-96 overflow-y-auto">
                  <h2 className="text-lg font-semibold mb-2">
                    Previous Reviews
                  </h2>
                  {reviews.map((review) => (
                    //  reviewer name, comment,ratings
                    <div
                      key={review.id}
                      className="mb-4 border-2 p-2 rounded-lg"
                    >
                      <p className="font-semibold">{review.reviewerName}</p>
                      <p>comment: {review.comment}</p>
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
          </div>
        )}
        <Pagination
          page={page}
          totalpages={totalPages}
          // onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default Dashboard;
