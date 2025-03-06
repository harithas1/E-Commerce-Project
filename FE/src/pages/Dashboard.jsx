import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {User} from "lucide-react";
import { Pagination } from "@/components/ui/pagination";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import Products from "./Products";
import {
  CartDialog,
} from "./Cart";
import { WishlistDialog } from "./Wishlist";
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
import { PopoverArrow } from "@radix-ui/react-popover";
import { Skeleton } from "@/components/ui/skeleton";
import { LogOut } from "lucide-react";
import { OrderDialog } from "./Order";

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
    localStorage.removeItem("user");
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
          {/* <CartDialog user={user} /> */}

          {/* Wishlist popover */}

          {/* <Heart onClick={() => navigate("/wishlist")} className="size-6 cursor-pointer" /> */}
          {/* <WishlistDialog user={user} /> */}

          <Popover>
            <PopoverTrigger>
              <div className="flex flex-col items-center">
                <User className="cursor-pointer size-6" />
                <span className="text-xs mt-1">Profile</span>
              </div>
            </PopoverTrigger>

            <PopoverContent className=" text-blue-700 p-4 mr-4">
              <PopoverArrow sideoffset={5} />
              <div>
                <strong className="text-xl font-semibold">{user.name}</strong>
                <p className="text-red-400">{user.email}</p>
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
                <OrderDialog user={user} />
                <CartDialog user={user} />
                <WishlistDialog user={user} />

                <div className="mt-2">
                  <Button onClick={handleLogout} className="bg-red-600 w-full">
                    Logout <LogOut className="ml-2" />
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
            <Products
              title="Best Sellers"
              products={bestSellers}
              loading={loading}
              user={user}
            />
            <Products
              title="Newest Arrivals"
              products={newestArrivals}
              loading={loading}
              user={user}
            />
          </>
        )}

        {/* Show filtered products if filters or search are applied */}
        {(filteredProducts.length > 0 || search) && (
          <Products
            title="Filtered Products"
            products={filteredProducts}
            loading={loading}
            user={user}
          />
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
