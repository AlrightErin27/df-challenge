import React from "react";
import "./LoginForm.css";

export default function LoginForm() {
  const handleLogin = (event) => {
    event.preventDefault();
    console.log("Login submitted");
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
          required
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          placeholder="Enter your password"
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
