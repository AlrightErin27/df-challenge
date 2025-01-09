import React, { useState } from "react";
import "./RegForm.css";

//  * Registration form for new users.
//  * Sends form data to the backend /register endpoint.

export default function RegForm() {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  //  * Updates the form data state whenever the user types in the input fields.
  const handleChange = (event) => {
    const { id, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  //  * Handles form submission and sends a POST request to the backend for registration.
  const handleRegister = async (event) => {
    event.preventDefault();
    try {
      console.log("Submitting registration data:", formData);
      const response = await fetch("/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Registration successful:", data);
        setMessage("Registration successful! Please log in.");
        setFormData({ email: "", username: "", password: "" });
      } else {
        console.error("Registration failed:", data.error);
        setMessage(data.error || "Registration failed.");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="reg-form-cont">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          required
        />
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
        <button type="submit">Register</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
}
