import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import "./ViewSingleList.css";
import BASE_URL from "../../config";
import { useState, useEffect } from "react";

//  * This component allows the user to view a single to-do list, toggle item statuses, add new items, or delete the list.
export default function ViewSingleList() {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentList, setCurrentList] = useState(location.state?.list);
  const [newItemInput, setNewItemInput] = useState("");
  const { refreshLists } = useOutletContext();

  //  * Fetches the latest version of the current list (GET request).
  //  * Ensures the data displayed in this component is up to date with any changes made elsewhere.
  useEffect(() => {
    const fetchCurrentList = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve the user's authentication token
        const response = await fetch(
          `${BASE_URL}/api/lists/${currentList._id}`, // GET request to fetch the current list
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include token for authentication
            },
          }
        );

        if (response.ok) {
          const freshList = await response.json();
          setCurrentList(freshList);
        }
      } catch (error) {
        console.error("Error fetching list:", error);
      }
    };

    fetchCurrentList();
  }, [currentList._id]);

  //  * Toggles the `checkedItem` state of a specific list item (PATCH request).
  //  * Sends a PATCH request to update the item's status in the database.
  const handleItemClick = async (itemId, currentChecked) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${BASE_URL}/api/lists/${currentList._id}/items/${itemId}`, // PATCH request to update the item's checked status
        {
          method: "PATCH", // HTTP method for partial updates
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include token for authentication
          },
          body: JSON.stringify({
            checkedItem: !currentChecked, // Toggle the item's current checked state
          }),
        }
      );

      if (response.ok) {
        const updatedList = await response.json();
        setCurrentList(updatedList);
      } else {
        console.error("Failed to update item");
      }
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  //  * Adds a new item to the current list (POST request).
  //  * Sends the new item's text to the backend, which appends it to the list.
  const addItemToList = async () => {
    if (newItemInput.trim() === "") return; // Prevent adding empty items

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${BASE_URL}/api/lists/${currentList._id}/items`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ text: newItemInput }), // Send the new item's text
        }
      );

      if (response.ok) {
        const updatedList = await response.json();
        setCurrentList(updatedList); // Update state with the modified list
        setNewItemInput(""); // Clear the input field
      } else {
        console.error("Failed to add item to the list");
      }
    } catch (error) {
      console.error("Error adding item to list:", error);
    }
  };

  //  * Deletes the current list (DELETE request).
  //  * Removes the list from the database and navigates back to the dashboard.
  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/api/lists/${currentList._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        refreshLists(); // Refresh the list of all lists in the dashboard
        navigate("/dashboard");
      } else {
        console.error("Failed to delete list");
      }
    } catch (error) {
      console.error("Error deleting list:", error);
    }
  };

  //  * Formats a date string into a human-readable format.
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
              key={`${item._id}-${item.checkedItem}`}
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
