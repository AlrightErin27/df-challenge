import { useState } from "react";
import "./Entry.css";
import LoginForm from "./LoginForm";
import RegForm from "./RegForm";

export default function Entry() {
  const [showLogin, setShowLogin] = useState(true);

  const toggleForm = () => {
    setShowLogin(!showLogin);
  };

  return (
    <div className="entry-cont">
      <div className="form-container">
        {showLogin ? (
          <>
            <LoginForm />
            <button className="toggle-btn" onClick={toggleForm}>
              Don't have an account? Register
            </button>
          </>
        ) : (
          <>
            <RegForm />
            <button className="toggle-btn" onClick={toggleForm}>
              Already have an account? Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}
