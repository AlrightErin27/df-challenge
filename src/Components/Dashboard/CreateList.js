import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./CreateList.css";
import { useNavigate, useOutletContext } from "react-router-dom";

export default function CreateList() {
  const [title, setTitle] = useState("");
  const [items, setItems] = useState([]);
  const [itemInput, setItemInput] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { refreshLists } = useOutletContext();

  function addItem() {
    if (itemInput.trim() !== "") {
      setItems([
        ...items,
        {
          text: itemInput,
          checkedItem: false,
        },
      ]);
      setItemInput("");
    }
  }

  function removeItem(index) {
    setItems(items.filter((_, i) => i !== index));
  }

  async function handleFinish(e) {
    e.preventDefault();

    // Basic validation
    if (!title.trim()) {
      setMessage("Please enter a list title");
      return;
    }
    if (items.length === 0) {
      setMessage("Please add at least one item to your list");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      console.log("Attempting to create list...");

      const response = await fetch("/api/lists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title,
          items: items.map((item) => ({
            text: item.text,
            checkedItem: item.checkedItem,
          })),
          checkedList: false,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("List created successfully");
        await refreshLists(); // refresh dashboard to reveal newly created list
        navigate("/dashboard");
      } else {
        setMessage(data.error || "Failed to create list");
      }
    } catch (error) {
      console.error("Error creating list:", error);
      setMessage("Failed to create list. Please try again.");
    }
  }

  return (
    <div className="create-list-cont container">
      <h2 className="text-center mb-4">Create a New List</h2>
      {message && <p className="alert alert-danger">{message}</p>}
      <form className="mb-4" onSubmit={handleFinish}>
        <div className="mb-3">
          <input
            type="text"
            className="form-control title-input"
            placeholder="List Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="input-row mb-3 d-flex align-items-center">
          <span className="me-2">•</span>
          <input
            type="text"
            className="form-control add-item-input flex-grow-1 me-2"
            placeholder="Add an item"
            value={itemInput}
            onChange={(e) => setItemInput(e.target.value)}
          />
          <button
            type="button"
            className="btn btn-secondary add-item-btn"
            onClick={addItem}
          >
            +
          </button>
        </div>

        <div className={` ${items.length === 0 ? "empty-list" : ""}`}>
          {
            items.length > 0 ? (
              <ol className="ps-4">
                {items.map((item, index) => (
                  <li
                    key={index}
                    className="list-item d-flex align-items-center"
                  >
                    <span className="me-2">•</span>
                    <p className="flex-grow-1 mb-0">{item.text}</p>
                    <button
                      type="button"
                      className="btn remove-item-btn"
                      onClick={() => removeItem(index)}
                    >
                      x
                    </button>
                  </li>
                ))}
              </ol>
            ) : null // Render nothing if the list is empty
          }
        </div>

        <button type="submit" className="btn btn-primary create-list-btn mt-4">
          Finish
        </button>
      </form>
    </div>
  );
}
