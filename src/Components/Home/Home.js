import "./Home.css";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Entry from "../Entry/Entry";
import Dashboard from "../Dashboard/Dashboard";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  //  * Handles login by checking if a token exists in localStorage.
  //  * If the token exists, the user is considered logged in.
  const handleLogin = () => {
    const token = localStorage.getItem("token"); // Check for a saved token
    setIsLoggedIn(!!token); // Update state: true if token exists, false otherwise
  };

  //  * Handles logout by removing the token from localStorage
  //  * and updating the login state.
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove the token to log the user out
    setIsLoggedIn(false); // Update state to reflect logout
  };

  //  * Initial effect to check login state when the component mounts.
  //  * Ensures the user remains logged in if a token exists.
  useEffect(() => {
    handleLogin(); // Check login status when the component loads
  }, []);

  //  * Effect to handle navigation based on login status and current path.
  //  * - Redirect to /dashboard if logged in and not already on a dashboard path.
  //  * - Redirect to / (home page) if not logged in and on a restricted path.
  useEffect(() => {
    if (isLoggedIn && !location.pathname.startsWith("/dashboard")) {
      navigate("/dashboard"); // Redirect to dashboard if logged in
    } else if (!isLoggedIn && location.pathname !== "/") {
      navigate("/"); // Redirect to the home page if not logged in
    }
  }, [isLoggedIn, navigate, location.pathname]);

  //  * - If the user is not logged in, render the Entry component (login/registration page).
  //  * - If the user is logged in, render the Dashboard component.
  return (
    <div className="home-cont">
      {/* Main container with a header and conditional content */}
      <div className="container text-center py-4">
        {/* Header Section */}
        <div className="header-container mb-3">
          <h1 className="display-4 fw-bold text-white">Clarity</h1>
          <h3 className="text-light">Your Path to Organization</h3>
        </div>

        {/* Conditional Rendering of Content */}
        <div className="content-container p-4 bg-transparent border rounded-3 shadow">
          {!isLoggedIn ? (
            <Entry handleLogin={handleLogin} />
          ) : (
            <Dashboard handleLogout={handleLogout} />
          )}
        </div>
      </div>

      {/* Footer Section */}
      <footer className="mt-4">
        <p>
          Built for simplicity, powered by Clarity
          <br />
          Created by
          <a
            href="https://www.erinvanbrunt.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "underline", color: "inherit" }}
          >
            {" "}
            Erin Van Brunt, Software Engineer
          </a>
          &copy; {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
