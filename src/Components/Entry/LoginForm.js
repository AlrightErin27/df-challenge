import React, { useState } from "react";
import "./LoginForm.css";
import BASE_URL from "../../config";

export default function LoginForm({ handleLogin }) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  //  * Handles changes to the form inputs.
  //  * Updates the corresponding field in the `formData` state.
  //  * @param {Event} event - The input change event.
  const handleChange = (event) => {
    const { id, value } = event.target; // Destructure the id
    setFormData((prevData) => ({ ...prevData, [id]: value })); // Update the specific field in the formData object
  };

  //  * Submits the login form.
  //  * Sends the `formData` to the server's /login endpoint for authentication.
  //  * @param {Event} event - The form submission event.
  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    try {
      // Make a POST request to the /login endpoint
      const response = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }, // Specify JSON content type
        body: JSON.stringify(formData), // Send formData (username and password) in the request body
      });

      const data = await response.json(); // Parse the JSON response from the server

      if (response.ok && data.token) {
        // Check if the login was successful and a token was received
        localStorage.setItem("token", data.token); // Store the received token in localStorage
        handleLogin(); // Call the `handleLogin` function passed down from the parent component to update state
        setMessage("Login successful!");
      } else {
        setMessage(data.error || "Login failed.");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="login-form-cont">
      <h2>Welcome</h2>
      {/* Form for user login */}
      <form onSubmit={handleLoginSubmit}>
        {/* Username input field */}
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          placeholder="Enter your username"
          value={formData.username}
          onChange={handleChange}
          required
        />

        {/* Password input field */}
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
