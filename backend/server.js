// Import required modules
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const path = require("path");

// Import Mongoose models
const User = require("./models/User");
const List = require("./models/List");

// Initialize dotenv to use environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// ---------------------------------------------------------- Middleware

// Parse incoming JSON request bodies
app.use(express.json());

// Enable CORS for cross-origin requests
app.use(cors());

// Serve static files in production mode
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "frontend/build")));
}

// Connect to MongoDB
const connectToDatabase = async () => {
  try {
    // 🎭 Jester Jest Testing Configuration
    const mongoURI =
      process.env.NODE_ENV === "test"
        ? "mongodb://localhost:27017/clarity-test" // Test database for Jest
        : process.env.MONGO_URI;

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB 🚀");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

// 🎭 Jester Jest
// Uncomment for Jest testing purposes:
// const connectToDatabase = async () => {
//   try {
//     const mongoURI =
//       process.env.NODE_ENV === "test"
//         ? "mongodb://localhost:27017/clarity-test" // Test database for Jest
//         : process.env.MONGO_URI;

//     await mongoose.connect(mongoURI);
//     console.log("Connected to MongoDB 🚀");
//   } catch (error) {
//     console.error("MongoDB connection error:", error.message);
//     process.exit(1);
//   }
// };

connectToDatabase();

// ---------------------------------------------------------- Routes

/**
 * Health Check Route (GET /)
 * Confirms the server is running.
 */
app.get("/", (req, res) => {
  res.send("Server is running 🏃...");
});

/**
 * User Registration Route (POST /register)
 * Registers a new user, hashes their password, and returns a JWT.
 */
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "User created successfully!",
      token,
      user: { id: newUser._id, username, email },
    });
  } catch (error) {
    res.status(500).json({ error: "Server error: " + error.message });
  }
});

/**
 * User Login Route (POST /login)
 * Authenticates the user and returns a JWT.
 */
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    const token = jwt.sign({ id: user._id, username }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      message: "Login successful!",
      token,
      user: { id: user._id, username, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ error: "Server error: " + error.message });
  }
});

/**
 * Get Current User's Username (GET /api/user)
 * Returns the logged-in user's username.
 */
app.get("/api/user", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("username");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ username: user.username });
  } catch (error) {
    res.status(500).json({ error: "Error fetching username" });
  }
});

/**
 * Get All Lists (GET /api/lists)
 * Retrieves all lists belonging to the logged-in user.
 */
app.get("/api/lists", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const lists = await List.find({ userId: decoded.id }).sort({
      createdAt: -1,
    });
    res.json(lists);
  } catch (error) {
    res.status(500).json({ error: "Error fetching lists" });
  }
});

/**
 * Create New List (POST /api/lists)
 * Creates a new list for the logged-in user.
 */
app.post("/api/lists", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { title, items } = req.body;
    if (!title || typeof title !== "string" || title.trim() === "") {
      return res.status(400).json({ error: "Invalid or missing title" });
    }
    if (!Array.isArray(items)) {
      return res.status(400).json({ error: "Items must be an array" });
    }

    const newList = new List({
      userId: decoded.id,
      title,
      items,
      checkedList: false,
    });

    await newList.save();
    res
      .status(201)
      .json({ message: "List created successfully", list: newList });
  } catch (error) {
    res.status(500).json({ error: "Error creating list" });
  }
});

/**
 * Add New Item to List (POST /api/lists/:listId/items)
 * Adds a new item to an existing list.
 */
app.post("/api/lists/:listId/items", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const list = await List.findOne({
      _id: req.params.listId,
      userId: decoded.id,
    });
    if (!list) return res.status(404).json({ error: "List not found" });

    const newItem = {
      text: req.body.text,
      checkedItem: false,
    };
    list.items.push(newItem);
    await list.save();

    res.status(200).json(list);
  } catch (error) {
    res.status(500).json({ error: "Error adding item to list" });
  }
});

/**
 * Update Item's Checked Status (PATCH /api/lists/:listId/items/:itemId)
 * Toggles the checked status of a specific item in a list.
 */
app.patch("/api/lists/:listId/items/:itemId", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const list = await List.findOneAndUpdate(
      {
        _id: req.params.listId,
        userId: decoded.id,
        "items._id": req.params.itemId,
      },
      { $set: { "items.$.checkedItem": req.body.checkedItem } },
      { new: true }
    );

    if (!list) return res.status(404).json({ error: "List or item not found" });

    list.checkedList = list.items.every((item) => item.checkedItem);
    await list.save();

    res.json(list);
  } catch (error) {
    res.status(500).json({ error: "Error updating item" });
  }
});

/**
 * Delete List (DELETE /api/lists/:listId)
 * Deletes a specific list belonging to the logged-in user.
 */
app.delete("/api/lists/:listId", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const list = await List.findOneAndDelete({
      _id: req.params.listId,
      userId: decoded.id,
    });

    if (!list) return res.status(404).json({ error: "List not found" });

    res.json({ message: "List deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting list" });
  }
});

// ---------------------------------------------------------- Serve React App in Production
if (process.env.NODE_ENV === "production") {
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend/build", "index.html"));
  });
}

// ---------------------------------------------------------- Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!!!!");
});

// ---------------------------------------------------------- Start the Server
app.listen(PORT, () => {
  console.log(`Server running on 🚢: http://localhost:${PORT}`);
});

// 🎭 Jester Jest Testing Export
// Uncomment the below for Jest testing purposes:
// module.exports = app;
