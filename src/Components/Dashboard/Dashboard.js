import { useNavigate, useLocation, Outlet } from "react-router-dom";
import "./Dashboard.css";
import Lists from "./Lists";
import CreateList from "./CreateList";
import ViewSingleList from "./ViewSingleList";

export default function Dashboard({ handleLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  console.log("Current location:", location);

  function handleNewList() {
    console.log("handleNewList clicked");
    console.log("About to navigate to:", "/dashboard/create-list");
    navigate("/dashboard/create-list");
    console.log("Navigation completed");
  }
  // Function to handle rendering views based on URL path
  function handleDashView() {
    if (location.pathname === "/dashboard") {
      return (
        <div>
          <Lists />
          <button className="custom-btn" onClick={() => handleNewList()}>
            Create New List
          </button>
        </div>
      );
    }
    return <Outlet />;
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
