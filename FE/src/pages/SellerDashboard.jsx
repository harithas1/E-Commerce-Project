import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import {  getSellerOrders, updateOrderStatus } from "./Order";

const API_BASE_URL = "https://e-commerce-project-l7gm.onrender.com/api/seller";
const CATEGORY_API =
  "https://e-commerce-project-l7gm.onrender.com/api/products/category-list";

const SellerDashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState("view");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState({});

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    categoryId: "",
    price: "",
    stock: "",
    image: "",
    productId: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
    if (
      activeTab === "view" ||
      activeTab === "update" ||
      activeTab === "delete" ||
      activeTab === "orders"
    ) {
      fetchSellerProducts();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "orders") {
      getSellerOrders({ sellerId: user.id }).then((res) =>
        setOrders(res.orders)
      );
    }
  }, [activeTab]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(CATEGORY_API);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchSellerProducts = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/getall?sellerId=${user.id}`
      );
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleInputChange = (e, productId) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (productId) {
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === productId ? { ...product, [name]: value } : product
        )
      );
    }
  };

  const handleProductAction = async (action, product = null) => {
    try {
      if (action === "add") {
        await axios.post(`${API_BASE_URL}/add`, {
          ...formData,
          sellerId: user.id,
          categoryId: Number(formData.categoryId),
          price: Number(formData.price),
          stock: Number(formData.stock),
        });
        alert("Product added successfully!");
      } else if (action === "update" && product) {
        console.log(product);

        await axios.put(`${API_BASE_URL}/update`, {
          ...product,
          productId: product.id,
          sellerId: user.id,
          categoryId: Number(product.categoryId),
          price: Number(product.price),
          stock: Number(product.stock),
        });
        alert("Product updated successfully!");
      } else if (action === "delete" && product) {
        await axios.delete(`${API_BASE_URL}/delete`, {
          data: {
            productId: product.id,
            sellerId: user.id,
          },
        });
        alert("Product deleted successfully!");
      }

      resetForm();
      fetchSellerProducts();
    } catch (error) {
      console.error(`Error ${action}ing product:`, error);
      alert(`Failed to ${action} product. Please try again.`);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      categoryId: "",
      price: "",
      stock: "",
      image: "",
      productId: "",
    });
  };

  const goToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="p-6">
      <div className="flex flex-wrap md:grid md:grid-cols-3 lg:grid-cols-6 gap-2 border-b pb-2 overflow-x-auto">
        {["profile", "add", "update", "delete", "view", "orders"].map((tab) => (
          <Button
            variant="outline"
            key={tab}
            className={`px-4 py-2 min-w-[80px] text-sm md:text-base ${
              activeTab === tab
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-blue-600"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </Button>
        ))}
      </div>

      <div className="mt-6">
        {activeTab === "profile" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Seller Profile</h2>
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
            <p>Role: {user.role}</p>
            <Button variant="destructive" onClick={goToDashboard}>
              <LogOut />
              Go to Dashboard
            </Button>
          </div>
        )}

        {activeTab === "add" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Add a New Product</h2>
            <Input
              name="title"
              placeholder="Title"
              value={formData.title}
              onChange={(e) => handleInputChange(e)}
            />
            <Input
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={(e) => handleInputChange(e)}
            />
            <Select
              value={formData.categoryId}
              onValueChange={(value) =>
                handleInputChange({ target: { name: "categoryId", value } })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={String(category.id)}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              name="price"
              type="number"
              placeholder="Price"
              value={formData.price}
              onChange={(e) => handleInputChange(e)}
            />
            <Input
              name="stock"
              type="number"
              placeholder="Stock"
              value={formData.stock}
              onChange={(e) => handleInputChange(e)}
            />
            <Input
              name="image"
              placeholder="Image URL"
              value={formData.image}
              onChange={(e) => handleInputChange(e)}
            />
            <Button
              onClick={() => handleProductAction("add")}
              className="bg-green-500 text-white"
            >
              Add Product
            </Button>
          </div>
        )}
        {(activeTab === "update" || activeTab === "delete") && (
          <div>
            <h2 className="text-xl font-semibold">Manage Your Products</h2>
            <div className="hidden md:block">
              {" "}
              {/* Table layout for larger screens */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Stock</TableCell>
                    <TableCell>Image</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.id}</TableCell>
                      <TableCell>
                        <Input
                          name="title"
                          value={product.title}
                          onChange={(e) => handleInputChange(e, product.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          name="description"
                          value={product.description}
                          onChange={(e) => handleInputChange(e, product.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <Select
                          value={product.categoryId}
                          onValueChange={(value) =>
                            handleInputChange(
                              { target: { name: "categoryId", value } },
                              product.id
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem
                                key={category.id}
                                value={String(category.id)}
                              >
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input
                          name="price"
                          type="number"
                          value={product.price}
                          onChange={(e) => handleInputChange(e, product.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          name="stock"
                          type="number"
                          value={product.stock}
                          onChange={(e) => handleInputChange(e, product.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          name="image"
                          value={product.image}
                          onChange={(e) => handleInputChange(e, product.id)}
                        />
                      </TableCell>
                      <TableCell>
                        {/* Update & Delete Buttons */}
                        {activeTab === "update" && (
                          <Button
                            onClick={() =>
                              handleProductAction("update", product)
                            }
                            className="bg-yellow-500 text-white"
                          >
                            Update
                          </Button>
                        )}
                        {activeTab === "delete" && (
                          <Button
                            onClick={() =>
                              handleProductAction("delete", product)
                            }
                            className="bg-red-500 text-white"
                          >
                            Delete
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="md:hidden">
              {" "}
              {/* Card layout for smaller screens */}
              {products.map((product) => (
                <div
                  key={product.id}
                  className="border p-4 mb-4 rounded-lg shadow-sm"
                >
                  <h3 className="text-lg font-semibold">{product.title}</h3>
                  <p>{product.description}</p>
                  <div className="flex space-x-4">
                    <div>
                      <span className="font-medium">Category:</span>
                      <Select
                        value={product.categoryId}
                        onValueChange={(value) =>
                          handleInputChange(
                            { target: { name: "categoryId", value } },
                            product.id
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem
                              key={category.id}
                              value={String(category.id)}
                            >
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <span className="font-medium">Price:</span>
                      <Input
                        name="price"
                        type="number"
                        value={product.price}
                        onChange={(e) => handleInputChange(e, product.id)}
                      />
                    </div>
                    <div>
                      <span className="font-medium">Stock:</span>
                      <Input
                        name="stock"
                        type="number"
                        value={product.stock}
                        onChange={(e) => handleInputChange(e, product.id)}
                      />
                    </div>
                    <div>
                      <span className="font-medium">Image:</span>
                      <Input
                        name="image"
                        value={product.image}
                        onChange={(e) => handleInputChange(e, product.id)}
                      />
                    </div>
                  </div>
                  {/* Update & Delete Buttons */}
                  {activeTab === "update" && (
                    <Button
                      onClick={() => handleProductAction("update", product)}
                      className="bg-yellow-500 text-white mt-2"
                    >
                      Update
                    </Button>
                  )}
                  {activeTab === "delete" && (
                    <Button
                      onClick={() => handleProductAction("delete", product)}
                      className="bg-red-500 text-white mt-2"
                    >
                      Delete
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "view" && (
          <div>
            <h2 className="text-2xl rounded-t-lg font-bold mb-4 bg-yellow-300 p-4">
              Your Products
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {products.length > 0 ? (
                products.map((product) => (
                  <Card
                    key={product.id}
                    className="p-4 shadow-lg cursor-pointer hover:scale-105 transition"
                  >
                    <CardContent className="flex flex-col items-center justify-between h-full">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="object-cover rounded-md mb-4"
                      />
                      <h3 className="text-lg font-bold">{product.title}</h3>
                      <p className="text-gray-500 font-semibold">
                        ₹{product.price}
                      </p>
                      <p className="text-gray-500">Stock: {product.stock}</p>
                      <div className="relative group w-full">
                        <p className="text-gray-600 line-clamp-2 group-hover:line-clamp-none transition-all">
                          {product.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="col-span-full text-center">No products found.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div>
            <h2 className="text-2xl rounded-t-lg font-bold mb-4 bg-yellow-300 p-4 text-center">
              Your Orders
            </h2>

            {orders.length === 0 ? (
              <p className="text-center">No orders found.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {orders.map((order) => (
                  <Card
                    key={order.id}
                    className="p-4 shadow-lg hover:shadow-xl transition-transform duration-200"
                  >
                    <CardContent className="flex flex-col items-center">
                      <img
                        src={order.product.image}
                        alt={order.product.title}
                        className="w-32 h-32 object-cover rounded-md mb-2"
                      />

                      <h3 className="text-lg font-bold">
                        {order.product.title}
                      </h3>
                      <p className="text-gray-500 font-semibold">
                        ₹{order.totalAmount}
                      </p>
                      <p className="text-gray-600 text-sm">
                        Buyer: {order.user.name}
                      </p>
                      <p className="text-gray-600 text-sm">
                        Address: {order.shippingAddress}
                      </p>

                      <div className="w-full mt-2">
                        <Select
                          value={selectedStatus[order.id] || order.status}
                          onValueChange={(value) =>
                            setSelectedStatus((prev) => ({
                              ...prev,
                              [order.id]: value,
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Update Status" />
                          </SelectTrigger>
                          <SelectContent>
                            {["SHIPPED", "DELIVERED", "CANCELLED"].map(
                              (status) => (
                                <SelectItem key={status} value={status}>
                                  {status}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      </div>

                      <Button
                        onClick={() =>
                          updateOrderStatus({
                            orderId: order.id,
                            sellerId: user.id,
                            status: selectedStatus[order.id],
                          })
                        }
                        className="bg-blue-500 text-white w-full mt-2"
                      >
                        Update Status
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerDashboard;
