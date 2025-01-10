import "./Dashboard.css";

export default function Lists({ lists, error }) {
  // Format date to match your example (MM/DD/YY)
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
      <h2>Your Lists</h2>
      {error && <p className="error">{error}</p>}
      <ol>
        {lists.map((list) => (
          <li key={list._id}>
            {list.checkedList ? "☒" : "☐"} {list.title}, Created{" "}
            {formatDate(list.createdAt)}
          </li>
        ))}
      </ol>
      {lists.length === 0 && <p>No lists found. Create one to get started!</p>}
    </div>
  );
}
