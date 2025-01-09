import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Components
import Home from "./Components/Home/Home";
import Entry from "./Components/Entry/Entry";
import Dashboard from "./Components/Dashboard/Dashboard";

function App() {
  return (
    <Router>
      <div style={{ height: "100%" }}>
        <Home />
        <Routes>
          {/* Render Home as a wrapper for other components */}
          <Route path="/" element={<Entry />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
