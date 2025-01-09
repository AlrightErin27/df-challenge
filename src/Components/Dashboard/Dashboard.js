import React from "react";
import "./Dashboard.css";

export default function Dashboard() {
  return (
    <div className="dashboard-cont">
      <div className="container text-center">
        <h2>Your To-Do Lists</h2>
        <p>Here are your current to-do lists:</p>
        {/* Add your list components here */}
        <button className="btn btn-danger mt-3">Logout</button>
      </div>
    </div>
  );
}
