import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Format price in INR
const formatPriceInINR = (price) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(price);
};

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://e-commerce-ecuo.onrender.com/api/products/${id}`
        );
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product details:", error);
        setError("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [id]);

  if (loading)
    return (
      <p className="text-center text-gray-500">Loading product details...</p>
    );
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!product)
    return <p className="text-center text-gray-500">Product not found.</p>;

  return (
    <div className="p-6 flex justify-center">
      <Card className="max-w-lg w-full shadow-lg">
        <CardContent>
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-64 object-cover rounded-md"
          />
          <h1 className="text-2xl font-bold mt-4">{product.title}</h1>
          <p className="text-lg font-semibold text-blue-600">
            {formatPriceInINR(product.price)}
          </p>
          <p className="text-gray-500 mt-2">{product.description}</p>
          <Button className="mt-4" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
