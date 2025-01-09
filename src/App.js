import React, { useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Components
import Home from "./Components/Home/Home";
import Entry from "./Components/Entry/Entry";
import Dashboard from "./Components/Dashboard/Dashboard";

function App() {
  //is user logged in
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Home>
              {isLoggedIn ? (
                <Dashboard />
              ) : (
                <Entry onLogin={() => setIsLoggedIn(true)} />
              )}
            </Home>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
