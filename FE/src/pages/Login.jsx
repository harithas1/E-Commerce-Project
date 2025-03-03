import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios for API requests
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

function Login({ setUser }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // const loginUser = async ({ email, password }) => {
  //   const user = await prisma.user.findUnique({ where: { email } });
  //   if (!user) throw new Error("Invalid email or password");

  //   // Check password
  //   const isValid = await bcrypt.compare(password, user.password);
  //   if (!isValid) throw new Error("Invalid email or password");

  //   // Generate JWT
  //   const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
  //     expiresIn: "7d",
  //   });

  //   return { message: "Login successful", token };
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" }); // Clear previous messages
    console.log(JSON.stringify(formData));

    try {
      const response = await axios.post(
        "https://e-commerce-ecuo.onrender.com/api/auth/login",

        formData
      );
      // const data=response
      console.log(response.data.message === "Login successful");

      if (response.data.message === "Login successful") {
        console.log(response.data.message);

        localStorage.setItem("token", response.data.token); // Store token in localStorage
        localStorage.setItem("user", JSON.stringify(response.data.user)); // Store user as a string (JSON)

        // Set the user in the parent component state
        setUser({
          token: response.data.token,
          user: response.data.user,
        });

         console.log("Token stored:", response.data.token);
         console.log("User stored:", response.data.user);

        setMessage({
          type: "success",
          text: response.data.message,
        });
        // console.log(formData.email);
        // console.log(formData.password);

        navigate("/dashboard");
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
        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>

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
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <p className="text-sm text-center mt-4">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-600">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;
