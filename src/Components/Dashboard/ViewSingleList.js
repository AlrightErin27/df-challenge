import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import "./ViewSingleList.css";
import BASE_URL from "../../config";
import { useState, useEffect } from "react";

export default function ViewSingleList() {
  const location = useLocation(); // Access route-specific state passed via navigation
  const navigate = useNavigate(); // Navigate programmatically between routes
  const [currentList, setCurrentList] = useState(location.state?.list); // Store the current list's details
  const [newItemInput, setNewItemInput] = useState(""); // Input for adding a new item
  const { refreshLists } = useOutletContext(); // Refresh function passed via context from parent component

  /**
   * Fetch the latest version of the current list (GET request).
   * Ensures that if the list changes elsewhere, the data here is up to date.
   */
  useEffect(() => {
    const fetchCurrentList = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve the user's authentication token
        const response = await fetch(
          `${BASE_URL}/api/lists/${currentList._id}`, // GET request to fetch a specific list
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include token for authentication
            },
          }
        );

        if (response.ok) {
          const freshList = await response.json(); // Parse the returned JSON data
          setCurrentList(freshList); // Update state with the latest list data
        }
      } catch (error) {
        console.error("Error fetching list:", error); // Log errors for debugging
      }
    };

    fetchCurrentList();
  }, [currentList._id]); // Re-run this effect only when the list ID changes

  /**
   * Toggles the `checkedItem` state of a specific item in the list (PATCH request).
   * Clicking an item sends a PATCH request to update its state in the database.
   */
  const handleItemClick = async (itemId, currentChecked) => {
    try {
      const token = localStorage.getItem("token"); // Retrieve the user's authentication token
      const response = await fetch(
        `${BASE_URL}/api/lists/${currentList._id}/items/${itemId}`, // PATCH request to update an item's `checkedItem` status
        {
          method: "PATCH", // HTTP method for partial updates
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include token for authentication
          },
          body: JSON.stringify({
            checkedItem: !currentChecked, // Toggle the current `checkedItem` value
          }),
        }
      );

      if (response.ok) {
        const updatedList = await response.json(); // Parse the updated list data
        setCurrentList(updatedList); // Update state with the modified list
      } else {
        console.error("Failed to update item");
      }
    } catch (error) {
      console.error("Error updating item:", error); // Log errors for debugging
    }
  };

  /**
   * Adds a new item to the list (POST request).
   * The new item's text is sent to the server and appended to the current list.
   */
  const addItemToList = async () => {
    if (newItemInput.trim() === "") return; // Prevent empty submissions

    try {
      const token = localStorage.getItem("token"); // Retrieve the user's authentication token
      const response = await fetch(
        `${BASE_URL}/api/lists/${currentList._id}/items`, // POST request to add a new item to the list
        {
          method: "POST", // HTTP method for creating new resources
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include token for authentication
          },
          body: JSON.stringify({ text: newItemInput }), // Send the item's text
        }
      );

      if (response.ok) {
        const updatedList = await response.json(); // Parse the updated list data
        setCurrentList(updatedList); // Update state with the modified list
        setNewItemInput(""); // Clear the input field
      } else {
        console.error("Failed to add item to the list");
      }
    } catch (error) {
      console.error("Error adding item to list:", error); // Log errors for debugging
    }
  };

  /**
   * Deletes the entire list (DELETE request).
   * Removes the list from the database and navigates back to the dashboard.
   */
  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token"); // Retrieve the user's authentication token
      const response = await fetch(`${BASE_URL}/api/lists/${currentList._id}`, {
        method: "DELETE", // HTTP method for deleting resources
        headers: {
          Authorization: `Bearer ${token}`, // Include token for authentication
        },
      });

      if (response.ok) {
        refreshLists(); // Refresh the list of all lists in the dashboard
        navigate("/dashboard"); // Navigate back to the dashboard
      } else {
        console.error("Failed to delete list");
      }
    } catch (error) {
      console.error("Error deleting list:", error); // Log errors for debugging
    }
  };

  /**
   * Formats a date string into a user-friendly format.
   */
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
    });
  };

  return (
    <div className="view-single-list-custom-container container">
      <div className="text-center mb-4">
        <h2 className="custom-list-title">{currentList.title}</h2>
        <div className="custom-status-badge mb-2">
          {currentList.checkedList ? (
            <span className="custom-badge custom-success">Completed</span>
          ) : (
            <span className="custom-badge custom-warning">In Progress</span>
          )}
        </div>
        <p className="text-light">
          <small>Created: {formatDate(currentList.createdAt)}</small>
        </p>
      </div>

      <div className="custom-list-items-container">
        <ol className="custom-list-view">
          {currentList.items.map((item) => (
            <li
              key={`${item._id}-${item.checkedItem}`} // Unique key ensures React re-renders correctly
              className={`custom-list-item d-flex align-items-center ${
                item.checkedItem ? "custom-checked-item" : ""
              }`}
              onClick={() => handleItemClick(item._id, item.checkedItem)}
            >
              <div>{item.text}</div>
            </li>
          ))}
        </ol>
      </div>

      <div className="add-item-container">
        <input
          type="text"
          className="add-item-input"
          placeholder="Add a new item"
          value={newItemInput}
          onChange={(e) => setNewItemInput(e.target.value)}
        />
        <button className="add-item-btn" onClick={addItemToList}>
          +
        </button>
      </div>

      <div className="d-flex justify-content-center gap-3">
        <button className="custom-delete-list-btn mt-4" onClick={handleDelete}>
          Delete List
        </button>
      </div>
    </div>
  );
}
