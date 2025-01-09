import { useState } from "react";
import "./Dashboard.css";
import Lists from "./Lists";
import CreateList from "./CreateList";
import ViewSingleList from "./ViewSingleList";

export default function Dashboard({ handleLogout }) {
  const [currentLocal, setCurrentLocal] = useState("");

  // function viewSelList(listId) {
  //   //nav path to /dashboard/view-list
  //   console.log("Viewing list:", listId);
  //   setCurrentLocal("view-list");
  // }

  function handleNewList() {
    //nav path to /dashboard/create-list
    console.log("create a new list");
    setCurrentLocal("create-list");
  }

  function handleLogOut() {
    //nav path to /
    console.log("logging out");
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

        <button className="custom-btn" onClick={() => handleLogout()}>
          Logout
        </button>
      </div>
    </div>
  );
}
