import React, { useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Components
import Home from "./Components/Home/Home";
import Entry from "./Components/Entry/Entry";
import Dashboard from "./Components/Dashboard/Dashboard";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  return (
    <Router>
      <Routes>
        {/* Entry Route */}
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Home>
                <Entry onLogin={() => setIsLoggedIn(true)} />
              </Home>
            )
          }
        />

        {/* Dashboard Route */}
        <Route
          path="/dashboard"
          element={
            isLoggedIn ? (
              <Home>
                <Dashboard />
              </Home>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
