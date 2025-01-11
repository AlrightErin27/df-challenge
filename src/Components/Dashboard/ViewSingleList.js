import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import "./ViewSingleList.css"; // Import the corresponding CSS file
import { useState, useEffect } from "react";

export default function ViewSingleList() {
  const location = useLocation(); // Get the current location
  const navigate = useNavigate(); // Hook for navigation
  const [currentList, setCurrentList] = useState(location.state?.list); // State to store the current list
  const { refreshLists } = useOutletContext(); // Refresh the lists in the parent component

  // Fetch the updated list from the server
  useEffect(() => {
    const fetchCurrentList = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve the auth token
        const response = await fetch(`/api/lists/${currentList._id}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Add the token to the request header
          },
        });

        if (response.ok) {
          const freshList = await response.json();
          setCurrentList(freshList); // Update the current list
        }
      } catch (error) {
        console.error("Error fetching list:", error);
      }
    };

    fetchCurrentList();
  }, [currentList._id]);

  // Format the date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
    });
  };

  // Handle item toggle (checked/unchecked)
  const handleItemClick = async (itemId, currentChecked) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `/api/lists/${currentList._id}/items/${itemId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            checkedItem: !currentChecked, // Toggle the item's checked state
          }),
        }
      );

      if (response.ok) {
        const updatedList = await response.json();
        setCurrentList(updatedList); // Update the list state with the new data
      } else {
        console.error("Failed to update item");
      }
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  // Handle list deletion
  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/lists/${currentList._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the header
        },
      });

      if (response.ok) {
        refreshLists(); // Refresh the parent list after deletion
        navigate("/dashboard"); // Navigate back to the dashboard
      } else {
        console.error("Failed to delete list");
      }
    } catch (error) {
      console.error("Error deleting list:", error);
    }
  };

  return (
    <div className="view-single-list-cont container">
      <div className="text-center mb-4">
        <h2 className="display-6 list-title">{currentList.title}</h2>
        <div className="status-badge mb-2">
          {currentList.checkedList ? (
            <span className="badge bg-custom-success">Completed</span>
          ) : (
            <span className="badge bg-custom-warning">In Progress</span>
          )}
        </div>
        <p className="text-light">
          <small>Created: {formatDate(currentList.createdAt)}</small>
        </p>
      </div>

      <div className="list-items-container">
        <ol className="list-container-view">
          {currentList.items.map((item) => (
            <li
              key={item._id}
              className="list-item d-flex align-items-center"
              onClick={() => handleItemClick(item._id, item.checkedItem)}
            >
              <div
                className="fw-bold"
                style={{
                  textDecorationLine: item.checkedItem
                    ? "line-through"
                    : "none",
                  textDecorationColor: item.checkedItem
                    ? "var(--dark-teal)"
                    : "none",
                  textDecorationThickness: item.checkedItem ? "2px" : "initial",
                }}
              >
                {item.text}
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="d-flex justify-content-center gap-3">
        <button className="delete-list-btn mt-4" onClick={handleDelete}>
          Delete List
        </button>
      </div>
    </div>
  );
}
