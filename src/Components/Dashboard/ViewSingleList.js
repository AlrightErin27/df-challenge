import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import "./ViewSingleList.css";
import { useState, useEffect } from "react";

export default function ViewSingleList() {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentList, setCurrentList] = useState(location.state?.list);
  const { refreshLists } = useOutletContext();

  // Fetch fresh list data when component mounts
  useEffect(() => {
    const fetchCurrentList = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`/api/lists/${currentList._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

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
        `/api/lists/${currentList._id}/items/${itemId}`,
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

  return (
    <div className="view-single-list-cont container">
      <div className="text-center mb-4">
        List:
        <h2 className="display-6 list-title">{currentList.title}</h2>
        <div className="status-badge mb-2">
          {currentList.checkedList ? (
            <span className="badge bg-success">Completed</span>
          ) : (
            <span className="badge bg-warning">In Progress</span>
          )}
        </div>
        <p className="text-light">
          <small>Created: {formatDate(currentList.createdAt)}</small>
        </p>
      </div>

      <div className="list-items-container">
        <ol className="list-container">
          {currentList.items.map((item) => (
            <li
              key={item._id}
              className={`list-item d-flex justify-content-between align-items-center ${
                item.checkedItem ? "item-checked" : "item-unchecked"
              }`}
              onClick={() => handleItemClick(item._id, item.checkedItem)}
            >
              <div className="fw-bold">
                <span>{item.checkedItem ? "☒" : "☐"}</span> {item.text}
              </div>
            </li>
          ))}
        </ol>
      </div>

      <button
        className="back-to-lists-btn mt-4"
        onClick={() => {
          refreshLists();
          navigate("/dashboard");
        }}
      >
        Back to Lists
      </button>
    </div>
  );
}
