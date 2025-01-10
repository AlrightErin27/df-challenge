import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Dashboard.css";
import Lists from "./Lists";

export default function Dashboard({ handleLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [lists, setLists] = useState([]);
  const [error, setError] = useState("");

  const fetchLists = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/lists", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setLists(data);
      } else {
        setError("Failed to fetch lists");
      }
    } catch (error) {
      console.error("Error fetching lists:", error);
      setError("Failed to fetch lists");
    }
  };

  useEffect(() => {
    fetchLists();
  }, []);

  useEffect(() => {
    // Fetch lists whenever the path is "/dashboard"
    if (location.pathname === "/dashboard") {
      fetchLists();
    }
  }, [location.pathname]);

  const handleListClick = (list) => {
    console.log("clicked list: ", list.title);
    navigate("/dashboard/view-list", { state: { list } });
  };

  function handleNewList() {
    console.log("handleNewList clicked");
    navigate("/dashboard/create-list");
  }

  function handleDashView() {
    if (location.pathname === "/dashboard") {
      return (
        <div>
          <Lists lists={lists} error={error} onListClick={handleListClick} />
          <button className="custom-btn" onClick={() => handleNewList()}>
            Create New List
          </button>
        </div>
      );
    }
    return <Outlet context={{ refreshLists: fetchLists }} />;
  }

  return (
    <div className="dashboard-cont">
      <div className="container text-center">
        {handleDashView()}
        {location.pathname !== "/dashboard" && (
          <button className="custom-btn" onClick={() => navigate("/dashboard")}>
            Back
          </button>
        )}
        <button className="custom-btn" onClick={() => handleLogout()}>
          Logout
        </button>
      </div>
    </div>
  );
}
