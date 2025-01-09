import "./Home.css";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Entry from "../Entry/Entry";
import Dashboard from "../Dashboard/Dashboard";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  // Update the path based on isLoggedIn
  useEffect(() => {
    if (isLoggedIn && location.pathname !== "/dashboard") {
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
          {!isLoggedIn ? <Entry /> : <Dashboard />}
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
