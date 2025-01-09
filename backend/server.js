const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/User");

//start backend and frontend $: npm run start-all

// Initialize dotenv
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// ---------------------------------------------------------- Middleware
app.use(express.json()); // Parse JSON request bodies

// Connect to MongoDB
const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB 🚀");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1); // Exit if unable to connect
  }
};
connectToDatabase();

// ---------------------------------------------------------- Routes
app.get("/", (req, res) => {
  res.send("Server is running 🏃...");
});

// User Registration Route ---POST
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  console.log("Registration attempt:", { username, email });

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      console.log("Registration failed: Username already exists");
      return res.status(400).json({ error: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });

    await newUser.save();
    console.log("Registration successful for user:", username);
    res
      .status(201)
      .json({ message: "User created successfully!", user: newUser });
  } catch (error) {
    console.error("Error during registration:", error.message);
    res.status(500).json({ error: "Server error: " + error.message });
  }
});

// User Login Route --POST
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  console.log("Login attempt for username:", username);

  try {
    const user = await User.findOne({ username });
    if (!user) {
      console.log("Login failed: Invalid username");
      return res.status(400).json({ error: "Invalid username or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log("Login failed: Invalid password for user:", username);
      return res.status(400).json({ error: "Invalid username or password" });
    }

    console.log("Login successful for user:", username);
    res.status(200).json({ message: "Login successful!", user });
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ error: "Server error: " + error.message });
  }
});

// ---------------------------------------------------------- Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!!!!");
});

// ---------------------------------------------------------- Start the Server
app.listen(PORT, () => {
  console.log(`Server running on 🚢:http://localhost:${PORT}`);
});
