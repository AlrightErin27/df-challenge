import React from "react";
import "./RegForm.css";

export default function RegForm() {
  const handleRegister = (event) => {
    event.preventDefault();
    console.log("Registration submitted");
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
          required
        />
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          placeholder="Enter your username"
          required
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          placeholder="Enter your password"
          required
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
