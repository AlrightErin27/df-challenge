import React, { useState } from "react";
import "./LoginForm.css";

//  * Login form for existing users.
//  * Sends form data to the backend /login endpoint.
export default function LoginForm() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  //  * Updates the form data state whenever the user types in the input fields.

  const handleChange = (event) => {
    const { id, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  //  * Handles form submission and sends a POST request to the backend for login.
  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      console.log("Submitting login data:", formData);
      const response = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        //successful log in
        console.log("Login successful:", data);

        // Store the JWT in localStorage
        localStorage.setItem("token", data.token);

        setMessage("Login successful!");
        // Redirect to dashboard or handle session
      } else {
        console.error("Login failed:", data.error);
        setMessage(data.error || "Login failed.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="login-form-cont">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          placeholder="Enter your username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
}
