import React, { useState } from "react"; //
import BASE_URL from "../../config";
import "./RegForm.css";

//  * Sends user data (email, username, password) to the backend `/register` endpoint.
//  * @param {function} handleLogin - Callback function to notify parent (Home.js) about login state change.
export default function RegForm({ handleLogin }) {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  //  * Updates the corresponding field in formData when the user types.
  const handleChange = (event) => {
    const { id, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  //  * Handles form submission for user registration.
  //  * Sends a POST request to the `/register` endpoint with the form data.
  const handleRegister = async (event) => {
    event.preventDefault();

    console.log("Starting registration...");
    console.log("Using BASE_URL:", BASE_URL);

    try {
      const fetchURL = `${BASE_URL}/register`;
      console.log("Making fetch request to:", fetchURL);

      // Make a POST request to register the user
      const response = await fetch(fetchURL, {
        method: "POST", // HTTP method for creating new resources
        headers: { "Content-Type": "application/json" }, // Set request headers
        body: JSON.stringify(formData), // Convert form data to JSON
      });

      const data = await response.json(); // Parse the JSON response
      if (response.ok && data.token) {
        // If registration is successful and a token is received
        localStorage.setItem("token", data.token);
        handleLogin(); // Notify Home.js to check token and update login state
        setMessage("Registration successful!");
      } else {
        setMessage(data.error || "Registration failed.");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    }
  };

  function interpretErrs() {
    if (
      message.includes(
        "E11000 duplicate key error collection: claritydb.users index: email_1 dup"
      )
    ) {
      return (
        <>
          🚫 The email you entered is already linked to an account. Please use a
          different email or log in.
        </>
      );
    } else if (
      message === "Registration failed: Username already exists" ||
      message === "Username already exists"
    ) {
      return (
        <>
          ⚠️ The username you entered is already taken. Please choose a
          different one.
        </>
      );
    } else if (
      message.includes(
        "User validation failed: email: Please enter a valid email address"
      )
    ) {
      return (
        <>
          ❌ The email address you entered is invalid. Please double-check and
          try again.
        </>
      );
    } else if (
      message.includes("User validation failed: username: Path `username`")
    ) {
      return (
        <>
          ✍️ Usernames must be longer than 3 characters. Please update and try
          again.
        </>
      );
    } else if (message !== "") {
      console.log(message);
      return (
        <>
          🚨 An unexpected error occurred. Please try again later or contact
          support.
        </>
      );
    }
  }

  return (
    <div className="reg-form-cont">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        {/* Email Input */}
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        {/* Username Input */}
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          placeholder="Enter your username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        {/* Password Input */}
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit">Register</button>
      </form>

      {message && <p className="message">{interpretErrs()}</p>}
    </div>
  );
}
