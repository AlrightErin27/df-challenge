import { useState } from "react";
import "./Dashboard.css";
import Lists from "./Lists";
import CreateList from "./CreateList";
import ViewSingleList from "./ViewSingleList";

export default function Dashboard({ handleLogout }) {
  const [currentLocal, setCurrentLocal] = useState("");

  function handleNewList() {
    // Change view to create list
    console.log("create a new list");
    setCurrentLocal("create-list");
  }

  function handleDashView() {
    if (currentLocal === "") {
      return (
        <div>
          <Lists />
          <button className="custom-btn" onClick={() => handleNewList()}>
            Create New List
          </button>
        </div>
      );
    } else if (currentLocal === "create-list") {
      return <CreateList />;
    } else if (currentLocal === "view-list") {
      return <ViewSingleList />;
    }
  }

  return (
    <div className="dashboard-cont">
      <div className="container text-center">
        {handleDashView()}
        {currentLocal !== "" ? (
          <button className="custom-btn" onClick={() => setCurrentLocal("")}>
            Back
          </button>
        ) : null}
        <button className="custom-btn" onClick={() => handleLogout()}>
          Logout
        </button>
      </div>
    </div>
  );
}
