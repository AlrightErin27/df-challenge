import "./Home.css";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Entry from "../Entry/Entry";
import Dashboard from "../Dashboard/Dashboard";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = () => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  useEffect(() => {
    handleLogin();
  }, []);

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
            <Entry handleLogin={handleLogin} />
          ) : (
            <Dashboard handleLogout={handleLogout} />
          )}
        </div>
      </div>

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
