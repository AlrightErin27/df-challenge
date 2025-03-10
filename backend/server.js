// Import required modules
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const path = require("path");

//Models
const User = require("./models/User");
const List = require("./models/List");

// npm run start-all

// Initialize dotenv to use environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// ---------------------------------------------------------- Middleware
// Parse JSON request bodies
app.use(express.json());

// Enable CORS
app.use(cors());

if (process.env.NODE_ENV === "production") {
  // Serve static files from the React frontend build directory
  app.use(express.static(path.join(__dirname, "frontend/build")));
}

// Connect to MongoDB
const connectToDatabase = async () => {
  try {
    // await mongoose.connect(process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB 🚀");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1); // Exit the process if unable to connect
  }
};

// USED FOR JEST BELOW!!!
// const connectToDatabase = async () => {
//   try {
//     const mongoURI =
//       process.env.NODE_ENV === "test"
//         ? "mongodb://localhost:27017/clarity-test" //for jest test
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
//  * Basic route to check if the server is running.
app.get("/", (req, res) => {
  res.send("Server is running 🏃...");
});

//  * User Registration Route (POST /register)
//  * Handles user registration by:
//  * - Checking if the username already exists.
//  * - Hashing the password.
//  * - Creating a new user in the database.
//  * - Generating a JWT for the newly registered user.
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  console.log("Registration attempt:", { username, email });

  try {
    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      console.log("Registration failed: Username already exists");
      return res.status(400).json({ error: "Username already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    // Generate JWT
    const token = jwt.sign(
      { id: newUser._id, username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("Registration successful for user:", username, "JWT:", token);

    // Respond with token and sanitized user data
    res.status(201).json({
      message: "User created successfully!",
      token,
      user: { id: newUser._id, username, email },
    });
  } catch (error) {
    console.error("Error during registration:", error.message);
    res.status(500).json({ error: "Server error: " + error.message });
  }
});

//  * User Login Route (POST /login)
//  * Handles user login by:
//  * - Checking if the username exists.
//  * - Validating the password.
//  * - Generating a JWT for the user upon successful login.
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  console.log("Login attempt for username:", username);

  try {
    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      console.log("Login failed: Invalid username");
      return res.status(400).json({ error: "Invalid username or password" });
    }

    // Compare the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log("Login failed: Invalid password for user:", username);
      return res.status(400).json({ error: "Invalid username or password" });
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id, username }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    console.log("Login successful for user:", username, "JWT:", token);

    // Respond with token and sanitized user data
    res.status(200).json({
      message: "Login successful!",
      token,
      user: { id: user._id, username, email: user.email },
    });
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ error: "Server error: " + error.message });
  }
});

//GET username for lists.js
// GET current user's username
app.get("/api/user", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const user = await User.findById(userId).select("username");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ username: user.username });
  } catch (error) {
    console.error("Error fetching username:", error);
    res.status(500).json({ error: "Error fetching username" });
  }
});

// GET lists for logged in user, display in dashboard
app.get("/api/lists", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const lists = await List.find({ userId }).sort({ createdAt: -1 }); // Sort by newest first
    console.log(`Retrieved ${lists.length} lists for user:`, decoded.username);
    res.json(lists);
  } catch (error) {
    console.error("Error fetching lists:", error);
    res.status(500).json({ error: "Error fetching lists" });
  }
});

//  * Create List Route (POST /lists)
app.post("/api/lists", async (req, res) => {
  try {
    // Get token from headers
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      console.log("List creation failed: No token provided");
      return res.status(401).json({ error: "No token provided" });
    }

    // Verify token and get user id
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // Get list data from request body
    const { title, items } = req.body;
    console.log("List creation attempt by user:", decoded.username);
    console.log("List details:", {
      title,
      itemCount: items.length,
    });

    // Create new list using your existing model
    const newList = new List({
      userId,
      title,
      items,
      checkedList: false,
    });

    await newList.save();
    console.log("List created successfully for user:", decoded.username);
    res
      .status(201)
      .json({ message: "List created successfully", list: newList });
  } catch (error) {
    console.error("Error creating list:", error);
    console.log("List creation failed:", error.message);
    res.status(500).json({ error: "Error creating list" });
  }
});

// PATCH find list item and alter it
// In the existing route, we already have this logic but it needs a small fix
// In the existing route, we already have this logic but it needs a small fix
app.patch("/api/lists/:listId/items/:itemId", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // Find the list and update the specific item
    const list = await List.findOneAndUpdate(
      {
        _id: req.params.listId,
        userId,
        "items._id": req.params.itemId,
      },
      {
        $set: { "items.$.checkedItem": req.body.checkedItem },
      },
      { new: true }
    );

    if (!list) {
      return res.status(404).json({ error: "List or item not found" });
    }

    // Check if all items are checked and update list status
    const allItemsChecked = list.items.every((item) => item.checkedItem);
    list.checkedList = allItemsChecked;
    await list.save(); // Make sure this save happens

    console.log(
      `Item ${req.params.itemId} in list ${req.params.listId} updated. CheckedItem: ${req.body.checkedItem}`
    );
    console.log(
      `List ${req.params.listId} checkedList status updated to: ${allItemsChecked}`
    ); // Add this log

    res.json(list);
  } catch (error) {
    console.error("Error updating item:", error);
    res.status(500).json({ error: "Error updating item" });
  }
});

//GET list item
app.get("/api/lists/:listId", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const list = await List.findOne({ _id: req.params.listId, userId });

    if (!list) {
      return res.status(404).json({ error: "List not found" });
    }

    res.json(list);
  } catch (error) {
    console.error("Error fetching list:", error);
    res.status(500).json({ error: "Error fetching list" });
  }
});

// POST to add an item to an existing list
app.post("/api/lists/:listId/items", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // Find the list by ID and ensure it belongs to the current user
    const list = await List.findOne({ _id: req.params.listId, userId });
    if (!list) {
      return res.status(404).json({ error: "List not found" });
    }

    // Add the new item to the list
    const newItem = {
      text: req.body.text,
      checkedItem: false,
    };
    list.items.push(newItem);

    // Save the updated list
    await list.save();

    res.status(200).json(list);
  } catch (error) {
    console.error("Error adding item to list:", error);
    res.status(500).json({ error: "Error adding item to list" });
  }
});

//DELETE
app.delete("/api/lists/:listId", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const list = await List.findOneAndDelete({
      _id: req.params.listId,
      userId,
    });

    if (!list) {
      return res.status(404).json({ error: "List not found" });
    }

    console.log(
      `List ${req.params.listId} deleted by user: ${decoded.username}`
    );
    res.json({ message: "List deleted successfully" });
  } catch (error) {
    console.error("Error deleting list:", error);
    res.status(500).json({ error: "Error deleting list" });
  }
});

// ---------------------------------------------------------- Production for Routes
// Serve React frontend for unmatched routes (only in production)
if (process.env.NODE_ENV === "production") {
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend/build", "index.html"));
  });
}

// ---------------------------------------------------------- Error Handling Middleware
//  * Error handling middleware for unexpected server errors.
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!!!!");
});

// ---------------------------------------------------------- Start the Server
//  * Start the server on the specified PORT.
app.listen(PORT, () => {
  console.log(`Server running on 🚢: http://localhost:${PORT}`);
});

// Added for jest testing
// module.exports = app;
