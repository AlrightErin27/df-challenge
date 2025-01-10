import "./List.css";

export default function Lists({ lists, error, onListClick }) {
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
      <h2 className="text-center mb-4">Your Lists</h2>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="lists-scroll-container">
        {lists.length > 0 ? (
          <ol className="list-group list-group-numbered">
            {lists.map((list) => (
              <li
                key={list._id}
                className="list-group-item d-flex justify-content-between align-items-center text-white"
                onClick={() => onListClick(list)}
              >
                <div className="ms-2 me-auto">
                  <div className="fw-bold">
                    {list.checkedList ? "☒" : "☐"} {list.title}
                  </div>
                  <small className="text-light">
                    Created {formatDate(list.createdAt)}
                  </small>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-center text-light fst-italic">
            No lists found. Create one to get started!
          </p>
        )}
      </div>
    </div>
  );
}
