import "./Home.css";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Entry from "../Entry/Entry";
import Dashboard from "../Dashboard/Dashboard";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Called when a user logs in or registers
  const handleLogin = () => {
    const token = localStorage.getItem("token"); // Check for the token in localStorage
    if (token) {
      setIsLoggedIn(true); // Set login state to true if token exists
    } else {
      setIsLoggedIn(false); // Ensure state is false if no token
    }
  };

  // Called when a user logs out
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove the JWT
    setIsLoggedIn(false); // Set login state to false
  };

  // Check for token on initial load
  useEffect(() => {
    handleLogin(); // Call handleLogin to verify token on app load
  }, []); // Only runs once on initial render

  // Redirects user based on login state
  useEffect(() => {
    if (isLoggedIn && !location.pathname.startsWith("/dashboard")) {
      navigate("/dashboard");
    } else if (!isLoggedIn && location.pathname !== "/") {
      navigate("/");
    }
  }, [isLoggedIn, navigate, location.pathname]);
  return (
    <div className="home-cont">
      <div className="container text-center py-4">
        <div className="header-container mb-3">
          <h1 className="display-4 fw-bold text-white">Clarity</h1>
          <h3 className="text-light">Your Path to Organization</h3>
        </div>

        <div className="content-container p-4 bg-transparent border rounded-3 shadow">
          {!isLoggedIn ? (
            <Entry handleLogin={handleLogin} /> // Pass handleLogin to Entry
          ) : (
            <Dashboard handleLogout={handleLogout} /> // Pass handleLogout to Dashboard
          )}
        </div>

        <footer className="mt-4">
          <p className="text-muted">
            Built for simplicity, powered by Clarity
            <br />
            Created by Erin Van Brunt, Software Engineer &copy;{" "}
            {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </div>
  );
}
