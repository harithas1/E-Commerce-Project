import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const formatPriceInINR = (price) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(price);
};

export const calculateTotalAmount = ({ cartItems }) => {
  let total = 0;
  cartItems.forEach((item) => {
    total += item.quantity * item.product.price;
  });
  console.log("Total amount:", total);
  return total;
};


