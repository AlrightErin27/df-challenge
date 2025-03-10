import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Components
import Home from "./Components/Home/Home";
import Entry from "./Components/Entry/Entry";
import Dashboard from "./Components/Dashboard/Dashboard";
import CreateList from "./Components/Dashboard/CreateList";
import ViewSingleList from "./Components/Dashboard/ViewSingleList";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />}>
          <Route index element={<Entry />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="dashboard/create-list" element={<CreateList />} />
          <Route path="dashboard/view-list" element={<ViewSingleList />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
