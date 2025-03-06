// get all routes with prefix /api/orders with params/query

// 1. create order -- method: POST -- endpoint: https://e-commerce-project-l7gm.onrender.com/api/orders/checkout -- body: {userId, shippingAddress}

// 2. get orders -- method: GET -- endpoint: https://e-commerce-project-l7gm.onrender.com/api/orders/orders/:userId -- params: {userId}

// 3. get seller orders -- method: GET -- endpoint: https://e-commerce-project-l7gm.onrender.com/api/orders/orders/seller/:sellerId -- params: {sellerId}

// 4. update order status -- method: PATCH -- endpoint: https://e-commerce-project-l7gm.onrender.com/api/orders/orders/:orderId/status -- params: {orderId} -- body: {sellerId, status}

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Truck, Clock, XCircle, CheckCircle } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import axios from "axios";
import { useMemo } from "react";
import { useRef } from "react";



export const createOrder = async ({ userId, shippingAddress }) => {
    try {
        const response = await axios.post(
            "https://e-commerce-project-l7gm.onrender.com/api/orders/checkout",
            {
                userId,
                shippingAddress,
            }
        );
        console.log("Order created:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error creating order:", error);
        throw error;
    }
};


export const getOrders = async ({ userId, setOrders }) => {
  try {
    const response = await axios.get(
      `https://e-commerce-project-l7gm.onrender.com/api/orders/orders/${userId}`
    );
    console.log("Orders fetched:", response.data.orders);
    setOrders(response.data.orders);

    // return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};



export const getSellerOrders = async ({sellerId}) => {
    try {
        const response = await axios.get(
            `https://e-commerce-project-l7gm.onrender.com/api/orders/orders/seller/${sellerId}`
        );
        console.log("Orders fetched:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching orders:", error);
        throw error;
    }
}


export const updateOrderStatus = async ({orderId, sellerId, status}) => {
    try {
        const response = await axios.patch(
            `https://e-commerce-project-l7gm.onrender.com/api/orders/orders/${orderId}/status`,
            {
                sellerId,
                status,
            }
        );
        console.log("Order status updated:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error updating order status:", error);
        throw error;
    }
}


export const OrderDialog = ({ user }) => {
  const [orders, setOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const prevUserId = useRef(null);

  // Fetch orders only when the dialog opens & user ID changes
  useEffect(() => {
    if (isOpen && user?.id && user.id !== prevUserId.current) {
      prevUserId.current = user.id;
      getOrders({ userId: user.id, setOrders });
    }
  }, [isOpen, user?.id]);

  const handleStatusChange = (orderId, newStatus) => {
    setSelectedStatus((prev) => ({ ...prev, [orderId]: newStatus }));
  };

  const handleUpdateStatus = async (orderId) => {
    const newStatus = selectedStatus[orderId];
    if (!newStatus) return;

    try {
      await updateOrderStatus({
        orderId,
        sellerId: user.id,
        status: newStatus,
      });
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  // Filter orders only when needed
  const filteredOrders = useMemo(() => orders.filter(Boolean), [orders]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="relative flex flex-col items-center">
          <Button className="p-4 mt-2 w-full flex items-center justify-center gap-2">
            <Truck className="w-6 h-6" />
            {orders.length > 0 && (
              <sup className="size-2 bg-red-600 rounded-full right-3"></sup>
            )}
            Orders
          </Button>
        </div>
      </DialogTrigger>

      <DialogContent className="mx-4">
        <DialogTitle className="text-xl font-semibold text-gray-800 mb-4">
          Your Orders
        </DialogTitle>
        <DialogDescription className="text-sm text-gray-600 mb-4">
          {filteredOrders.length > 0
            ? `You have ${filteredOrders.length} orders.`
            : "You have no orders yet."}
        </DialogDescription>

        <div className="max-h-[80vh] overflow-y-auto">
          {filteredOrders.map((order) => (
            <Card
              key={order.id}
              className="p-4 mb-4 rounded-lg shadow-lg flex items-start bg-white text-black"
            >
              <CardContent className="flex flex-col w-full">
                <div className="flex items-start">
                  <img
                    src={order.product.image}
                    alt={order.product.title}
                    className="w-24 h-24 object-cover mr-4 rounded"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">
                      {order.product.title}
                    </h3>
                    <p className="text-sm text-gray-700">
                      {order.product.description}
                    </p>
                    <p className="text-sm text-blue-400 font-semibold mt-2">
                      ₹ {order.totalAmount.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">
                      Address: {order.shippingAddress}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Status:{" "}
                      <span
                        className={`font-semibold ${
                          order.status === "SHIPPED"
                            ? "text-blue-600"
                            : order.status === "DELIVERED"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {order.status}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Status Update (For Sellers) */}
                {user?.role === "seller" && (
                  <div className="mt-4">
                    <Select
                      value={selectedStatus[order.id] || order.status}
                      onValueChange={(value) =>
                        handleStatusChange(order.id, value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Update Status" />
                      </SelectTrigger>
                      <SelectContent>
                        {["SHIPPED", "DELIVERED", "CANCELLED"].map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Button
                      onClick={() => handleUpdateStatus(order.id)}
                      className="bg-blue-500 text-white w-full mt-2"
                    >
                      Update Status
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};