import { useState } from "react";
import "./Entry.css";
import LoginForm from "./LoginForm";
import RegForm from "./RegForm";

//  * Entry component serves as a toggle-able container for Login and Registration forms.
export default function Entry({ handleLogin }) {
  const [showLogin, setShowLogin] = useState(true);

  //  * Toggles between the LoginForm and RegForm.
  const toggleForm = () => {
    setShowLogin(!showLogin);
  };

  return (
    <div className="entry-cont">
      <div className="form-container">
        {showLogin ? (
          <>
            {/* Render LoginForm and a button to switch to Registration */}
            <LoginForm handleLogin={handleLogin} />
            <button className="toggle-btn" onClick={toggleForm}>
              Don't have an account? Register
            </button>
          </>
        ) : (
          <>
            {/* Render RegForm and a button to switch to Login */}
            <RegForm handleLogin={handleLogin} />
            <button className="toggle-btn" onClick={toggleForm}>
              Already have an account? Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}
