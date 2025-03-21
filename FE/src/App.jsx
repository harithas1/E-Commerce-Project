import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import SellerDashboard from "./pages/SellerDashboard";
// import Checkout from "./pages/Checkout";
import { Toaster } from "@/components/ui/sonner";

const PrivateRoute = ({ element, isAuthenticated }) => {
  return isAuthenticated ? element : <Navigate to="/login" />;
};

function App() {
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    
    if (token && userData) {
      try {
        const parsedUserData = JSON.parse(userData);
        setUser({
          token: token,
          user: parsedUserData,
        });
      } catch (error) {
        console.error("Error parsing user data:", error);
        setUser(null);
      }
    } else {
      setUser(null);
    }

    setLoading(false); // Stop loading once token check is complete
  }, []);

  // Logout Functionality
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  if (loading) {
    return <div>Loading...</div>; 
  }

  return (
    <Router>
      <Toaster />
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            !user ? <Navigate to="/login" /> : <Navigate to="/dashboard" />
          }
        />
        <Route
          path="/register"
          element={!user ? <Register /> : <Navigate to="/dashboard" />}
        />
        <Route path="/login" element={<Login setUser={setUser} />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute
              element={<Dashboard user={user?.user} onLogout={handleLogout} />}
              isAuthenticated={user?.token}
            />
          }
        />
        <Route
          path="/seller-dashboard"
          element={
            <PrivateRoute
              element={<SellerDashboard user={user?.user} onLogout={handleLogout} />}
              isAuthenticated={user?.token}
            />
          }
        />
       
        {/* <Route
          path="/checkout"
          element={<PrivateRoute element={<Checkout user={user?.user} />} isAuthenticated={user?.token} />}
        /> */}
        {/* Default Redirect */}
        <Route
          path="*"
          element={<Navigate to={!user ? "/login" : "/dashboard"} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
