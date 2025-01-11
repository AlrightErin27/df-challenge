import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import "./ViewSingleList.css"; // Updated to use the renamed CSS file
import { useState, useEffect } from "react";

export default function ViewSingleList() {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentList, setCurrentList] = useState(location.state?.list);
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
    });
  };

  const handleItemClick = async (itemId, currentChecked) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${BASE_URL}/api/lists/${currentList._id}/items/${itemId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            checkedItem: !currentChecked,
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
              onClick={() => handleItemClick(item._id, item.checkedItem)}
            >
              <div className={item.checkedItem ? "custom-checked-item" : ""}>
                {item.text}
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="d-flex justify-content-center gap-3">
        <button className="custom-delete-list-btn mt-4" onClick={handleDelete}>
          Delete List
        </button>
      </div>
    </div>
  );
}
