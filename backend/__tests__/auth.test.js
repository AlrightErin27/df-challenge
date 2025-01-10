// Import required testing and application dependencies
const request = require("supertest"); // For making HTTP requests in tests
const app = require("../server"); // Your Express application
const mongoose = require("mongoose"); // MongoDB connection
const User = require("../models/User"); // User model for database operations

// Set up test environment variables
// This creates a JWT secret just for testing purposes
process.env.JWT_SECRET = "test-secret-key";

// --------------------- Test Setup and Cleanup ---------------------

// beforeAll runs once before any tests start
// We use this to clean the test database to ensure a fresh start
beforeAll(async () => {
  // Delete all users from the test database
  // This ensures each test starts with a clean slate
  await User.deleteMany({});
});

// afterAll runs once after all tests complete
// We use this for cleanup - closing connections and servers
afterAll(async () => {
  // Close the MongoDB connection
  await mongoose.connection.close();
  // Wait for 500ms to ensure all operations complete
  // This fixes the Jest "did not exit one second after" warning
  await new Promise((resolve) => setTimeout(() => resolve(), 500));
});

// --------------------- Test Suites ---------------------

// describe blocks group related tests together
describe("Registration Endpoint", () => {
  // Test Case 1: Successful Registration
  it("should register a new user successfully", async () => {
    // Make a POST request to the registration endpoint
    const res = await request(app).post("/register").send({
      username: "testuser",
      email: "test@test.com",
      password: "password123",
    });

    // Verify the response meets our expectations
    expect(res.statusCode).toBe(201); // Should return 201 Created
    expect(res.body).toHaveProperty("token"); // Should include a JWT token
    expect(res.body).toHaveProperty("user"); // Should include user data
    expect(res.body.user.username).toBe("testuser"); // Username should match
  });

  // Test Case 2: Duplicate Username
  it("should not register a duplicate username", async () => {
    // Try to register with the same username again
    const res = await request(app).post("/register").send({
      username: "testuser", // Same username as previous test
      email: "test2@test.com", // Different email
      password: "password123",
    });

    // Verify the error response
    expect(res.statusCode).toBe(400); // Should return 400 Bad Request
    expect(res.body.error).toBe("Username already exists"); // Should have error message
  });

  // Test Case 3: Invalid Email Format
  it("should not register with invalid email format", async () => {
    const res = await request(app).post("/register").send({
      username: "newuser",
      email: "invalid-email", // Invalid email format
      password: "password123",
    });

    expect(res.statusCode).toBe(500); // Server should reject invalid email
  });

  // Test Case 4: Missing Required Fields
  it("should not register with missing fields", async () => {
    const res = await request(app).post("/register").send({
      username: "testuser3",
      // Missing email and password
    });

    expect(res.statusCode).toBe(500); // Server should reject incomplete data
  });
});

// Additional test suite for edge cases
describe("Registration Input Validation", () => {
  // Test Case 5: Very Long Username
  it("should handle very long username input", async () => {
    const res = await request(app)
      .post("/register")
      .send({
        username: "a".repeat(100), // Very long username
        email: "long@test.com",
        password: "password123",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user.username).toBe("a".repeat(100));
  });

  // Test Case 6: Special Characters in Username
  it("should handle special characters in username", async () => {
    const res = await request(app).post("/register").send({
      username: "test@user!123",
      email: "special@test.com",
      password: "password123",
    });

    // Depending on your validation, this might be accepted or rejected
    expect([201, 400]).toContain(res.statusCode);
  });
});
