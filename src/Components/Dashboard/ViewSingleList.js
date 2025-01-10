import { useLocation } from "react-router-dom";
import "./ViewSingleList.css";

export default function ViewSingleList() {
  const location = useLocation();
  const list = location.state?.list;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
    });
  };

  return (
    <div className="view-single-list-cont container">
      <div className="text-center mb-4">
        <h2 className="display-6 fw-bold text-white">List: {list.title}</h2>
        <div className="status-badge mb-2">
          {list.checkedList ? (
            <span className="badge bg-success">Completed</span>
          ) : (
            <span className="badge bg-warning">In Progress</span>
          )}
        </div>
        <p className="text-light">
          <small>Created: {formatDate(list.createdAt)}</small>
        </p>
      </div>

      <div className="list-items-container">
        <ol className="list-group list-group-numbered">
          {list.items.map((item, index) => (
            <li
              key={index}
              className="list-group-item d-flex align-items-center bg-transparent text-white border-light"
            >
              <div className="ms-2 me-auto">
                <div className="fw-normal">
                  {item.checkedItem ? "☒" : "☐"} {item.text}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
