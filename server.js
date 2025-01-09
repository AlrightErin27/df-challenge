const express = require("express");
const dotenv = require("dotenv");

// Initialize dotenv
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());

// Basic Route
app.get("/", (req, res) => {
  res.send("Server is running 🏃...");
});

// Start the Server
app.listen(PORT, () => {
  console.log(`Server running on 🚢:http://localhost:${PORT}`);
});
