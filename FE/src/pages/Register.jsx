import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios for API requests
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "CUSTOMER",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" }); // Clear previous messages
    console.log(formData);
    

    try {
      const response = await axios.post(
        "https://e-commerce-ecuo.onrender.com/api/auth/register",
        formData
      );

      if (response.data.message) {
        setMessage({ type: "success", text: response.data.message });
        setTimeout(() => navigate("/login"), 2000); // Redirect after delay
      } else {
        setMessage({
          type: "error",
          text: response.data.error || "Something went wrong",
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Network error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Toaster />
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-4">Register</h2>

        {message.text && (
          <Alert
            className={`mb-4 ${
              message.type === "error"
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            <AlertTitle>
              {message.type === "error" ? "Error" : "Success"}
            </AlertTitle>
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <Input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <Input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          >
            <option value="CUSTOMER">Customer</option>
            <option value="SELLER">Seller</option>
          </select>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </Button>
        </form>

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

export default Register;
