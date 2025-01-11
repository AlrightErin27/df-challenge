import "./List.css";
import { useState, useEffect } from "react";
import BASE_URL from "../../config";

export default function Lists({ lists, error, onListClick }) {
  const [username, setUsername] = useState("");

  // Fetch the current user's username
  const fetchUsername = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/api/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsername(data.username);
      } else {
        console.error("Failed to fetch username");
      }
    } catch (error) {
      console.error("Error fetching username:", error);
    }
  };

  useEffect(() => {
    fetchUsername();
  }, []);

  // Helper function to format dates consistently using locale string
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
    });
  };

  return (
    <div className="lists-cont">
      <h2 className="text-center mb-4">
        {username !== "" ? username : "Your"}'s' Lists
      </h2>

      {/* Error handling display */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="lists-scroll-container">
        {lists.length > 0 ? (
          <ol className="list-group list-group-numbered">
            {lists.map((list) => (
              <li
                key={list._id}
                className="list-group-item d-flex justify-content-between align-items-center"
                onClick={() => onListClick(list)}
              >
                <div className="ms-2 me-auto">
                  {/* List title with a conditional class */}
                  <div
                    className={`fw-bold ${
                      list.checkedList ? "completed-list" : "incomplete-list"
                    }`}
                  >
                    {list.title}
                  </div>
                  <small className="text-light">
                    Created {formatDate(list.createdAt)}
                  </small>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-center text-light fst-italic">
            No lists found. Create one to get started!
          </p>
        )}
      </div>
    </div>
  );
}
