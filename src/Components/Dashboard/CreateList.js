import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./CreateList.css";

export default function CreateList() {
  const [title, setTitle] = useState(""); // For the list title
  const [items, setItems] = useState([]); // For list items
  const [itemInput, setItemInput] = useState(""); // For the current input to add a new item

  // Add item to the list
  function addItem() {
    if (itemInput.trim() !== "") {
      setItems([...items, { text: itemInput, checkedItem: false }]); // Adds obj to items arr
      setItemInput(""); // Clear the input field
    }
  }

  // Remove an item from the list
  function removeItem(index) {
    setItems(items.filter((_, i) => i !== index)); // Removes obj from items arr
  }

  return (
    <div className="create-list-cont container">
      <h2 className="text-center mb-4">Create a New List</h2>
      <form className="mb-4">
        {/* List Title */}
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="List Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Add Items to the List */}
        <div className="input-row mb-3 d-flex align-items-center">
          <span className="me-2">•</span>
          <input
            type="text"
            className="form-control flex-grow-1 me-2"
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
      </form>

      {/* List of Items */}
      <ol className="ps-4">
        {items.map((item, index) => (
          <li key={index} className="list-item d-flex align-items-center">
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

      <button className="custom-btn mt-4">Finish</button>
    </div>
  );
}
