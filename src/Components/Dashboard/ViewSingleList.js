import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import "./ViewSingleList.css";
import BASE_URL from "../../config";
import { useState, useEffect } from "react";

export default function ViewSingleList() {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentList, setCurrentList] = useState(location.state?.list);
  const [newItemInput, setNewItemInput] = useState(""); // New state for item input
  const { refreshLists } = useOutletContext();

  useEffect(() => {
    const fetchCurrentList = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${BASE_URL}/api/lists/${currentList._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
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

  const addItemToList = async () => {
    if (newItemInput.trim() === "") return; // Ensure non-empty input

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
          body: JSON.stringify({ text: newItemInput }),
        }
      );

      if (response.ok) {
        const updatedList = await response.json();
        setCurrentList(updatedList); // Update the current list state
        setNewItemInput(""); // Clear input field
      } else {
        console.error("Failed to add item to the list");
      }
    } catch (error) {
      console.error("Error adding item to list:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
    });
  };

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
        refreshLists();
        navigate("/dashboard");
      } else {
        console.error("Failed to delete list");
      }
    } catch (error) {
      console.error("Error deleting list:", error);
    }
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
              key={`${item._id}-${item.checkedItem}`} // Ensure uniqueness to trigger re-render
              className="custom-list-item d-flex align-items-center"
            >
              <div className={item.checkedItem ? "custom-checked-item" : ""}>
                <div className="item-text-smartphone">{item.text}</div>
              </div>
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

      <div className="d-flex justify-content-center gap-3 mt-4">
        <button className="custom-delete-list-btn" onClick={handleDelete}>
          Delete List
        </button>
      </div>
    </div>
  );
}
