import { useNavigate, useLocation, Outlet } from "react-router-dom";
import BASE_URL from "../../config";
import { useState, useEffect } from "react";
import "./Dashboard.css";
import Lists from "./Lists";

//  * Handles navigation between different views within the dashboard.
export default function Dashboard({ handleLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [lists, setLists] = useState([]);
  const [error, setError] = useState("");

  //  * Fetches the user's lists from the backend (GET request).
  //  * Updates the `lists` state with the retrieved data or sets an error message if the request fails.
  const fetchLists = async () => {
    try {
      const token = localStorage.getItem("token"); // Retrieve the user's authentication token
      const response = await fetch(`${BASE_URL}/api/lists`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in the request headers for authentication
        },
      });

      if (response.ok) {
        const data = await response.json();
        setLists(data); // Update state with the fetched lists
      } else {
        setError("Failed to fetch lists");
      }
    } catch (error) {
      console.error("Error fetching lists:", error);
      setError("Failed to fetch lists");
    }
  };

  //  * Effect to fetch the lists when the component mounts.
  //  * Ensures the user's lists are displayed when they navigate to the dashboard.
  useEffect(() => {
    fetchLists();
  }, []);

  //  * Effect to fetch the lists whenever the path is "/dashboard".
  //  * Ensures the lists are refreshed when the user returns to the main dashboard view.
  useEffect(() => {
    if (location.pathname === "/dashboard") {
      fetchLists(); // Fetch the lists if the user is on the main dashboard route
    }
  }, [location.pathname]); // Re-run this logic when the path changes

  //  * Handles clicking on a list to navigate to the view-list page.
  const handleListClick = (list) => {
    console.log("clicked list: ", list.title);
    navigate("/dashboard/view-list", { state: { list } }); // Navigate to the view-list page with the selected list as state
  };

  //  * Navigates to the create-list page.
  function handleNewList() {
    console.log("handleNewList clicked");
    navigate("/dashboard/create-list");
  }

  //  * Renders the appropriate view based on the current route.
  //  * - If on "/dashboard", displays the user's lists and a button to create a new list.
  //  * - Otherwise, renders child components for specific routes.
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
    // Render child routes and pass the fetchLists function as context
    return <Outlet context={{ refreshLists: fetchLists }} />;
  }

  return (
    <div className="dashboard-cont">
      <div className="container text-center">
        {/* Render the main dashboard view or child routes */}
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
