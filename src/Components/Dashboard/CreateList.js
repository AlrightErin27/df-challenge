import { useState } from "react";
import BASE_URL from "../../config";
import "bootstrap/dist/css/bootstrap.min.css";
import "./CreateList.css";
import { useNavigate, useOutletContext } from "react-router-dom";

//  * This component allows the user to create a new list with a title and multiple items.
export default function CreateList() {
  const [title, setTitle] = useState("");
  const [items, setItems] = useState([]);
  const [itemInput, setItemInput] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Shared context function to refresh the list of all lists (passed from parent)
  const { refreshLists } = useOutletContext();

  //  * Adds a new item to the list.
  //  * The item is only added if the input is not empty.
  function addItem() {
    if (itemInput.trim() !== "") {
      setItems([
        ...items,
        {
          text: itemInput,
          checkedItem: false,
        },
      ]);
      setItemInput(""); // Clear the input field
    }
  }

  //  * Removes an item from the list.
  function removeItem(index) {
    setItems(items.filter((_, i) => i !== index)); // Remove the item at the specified index
  }

  //  * Submits the list to the backend via a POST request.
  //  * Handles validation to ensure the title and at least one item are provided.
  async function handleFinish(e) {
    e.preventDefault(); // Prevent the default form submission behavior

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

      // Make a POST request to create the new list
      const response = await fetch(`${BASE_URL}/api/lists`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title, // Title of the list
          items: items.map((item) => ({
            text: item.text, // Text of the item
            checkedItem: item.checkedItem, // Checked state of the item
          })),
          checkedList: false, // Initial state of the list
        }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("List created successfully");
        await refreshLists();
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
      <h2 className="text-center mb-4">Create List</h2>
      {/* Display message if present */}
      {message && <p className="alert alert-danger">{message}</p>}

      <form className="mb-4" onSubmit={handleFinish}>
        {/* List Title Input */}
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

        {/* Add Item Input and Button */}
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

        {/* Display List of Items */}
        <div className={`${items.length === 0 ? "empty-list" : ""}`}>
          {items.map((item, index) => (
            <li key={index} className="list-item d-flex align-items-center">
              <p
                className="flex-grow-1 mb-0"
                style={{
                  textDecoration: item.checkedItem ? "line-through" : "none", // Strike-through if item is checked
                  textDecorationColor: "var(--dark-teal)", // Color for the strike-through
                  textDecorationThickness: "2px", // Thickness of the strike-through
                }}
              >
                {item.text}
              </p>
              <button
                type="button"
                className="btn remove-item-btn"
                onClick={() => removeItem(index)} // Remove the item at the specified index
              >
                x
              </button>
            </li>
          ))}
        </div>

        <button type="submit" className="btn btn-primary create-list-btn mt-4">
          Finish
        </button>
      </form>
    </div>
  );
}
