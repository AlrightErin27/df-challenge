import "./Dashboard.css";

export default function Lists() {
  return (
    <div className="lists-cont">
      <h2>Your Lists</h2>
      {/* <p>Here are your current to-do lists:</p> */}
      <ol>
        <li>☒ ListName, Created 01/06/25</li>
        <li>☐ ListName, Created 01/05/25</li>
        <li>☐ ListName, Created 01/01/25</li>
        <li>☐ListName, Created 12/05/24</li>
      </ol>
    </div>
  );
}
