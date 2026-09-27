const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 5000;

// ===============================
// MIDDLEWARE
// ===============================

app.use(
  cors({
    origin: true
  })
);

app.use(express.json());


// ===============================
// MOCK USER DATA
// ===============================

let users = [
  {
    id: 1,
    name: "Demo User",
    email: "demo@gmail.com",
    password: "12345678"
  }
];


// ===============================
// TEST BACKEND
// ===============================

app.get("/", (req, res) => {
  res.send("NexaFlow Backend is Running");
});


// ===============================
// HEALTH CHECK
// ===============================

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Backend server is running"
  });
});


// ===============================
// CREATE ACCOUNT / REGISTER
// ===============================

app.post("/api/register", (req, res) => {
  const { name, email, password } = req.body;

  // Check empty fields
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields are required"
    });
  }

  // Email validation
  const emailPattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Please enter a valid email address"
    });
  }

  // Password validation
  if (password.length < 8) {
    return res.status(400).json({
      success: false,
      message:
        "Password must contain at least 8 characters"
    });
  }

  // Check if email already exists
  const existingUser = users.find(
    (user) =>
      user.email.toLowerCase() ===
      email.toLowerCase()
  );

  if (existingUser) {
    return res.status(409).json({
      success: false,
      message:
        "An account with this email already exists"
    });
  }

  // Create new user
  const newUser = {
    id: users.length + 1,
    name: name.trim(),
    email: email.trim(),
    password: password
  };

  users.push(newUser);

  console.log(
    "New account created:",
    newUser.email
  );

  return res.status(201).json({
    success: true,
    message: "Account created successfully",

    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email
    }
  });
});


// ===============================
// LOGIN
// ===============================

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  // Check empty fields
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message:
        "Email and password are required"
    });
  }

  // Find user
  const user = users.find(
    (user) =>
      user.email.toLowerCase() ===
      email.toLowerCase()
  );

  // User not found
  if (!user) {
    return res.status(401).json({
      success: false,
      message:
        "Invalid email or password"
    });
  }

  // Password doesn't match
  if (user.password !== password) {
    return res.status(401).json({
      success: false,
      message:
        "Invalid email or password"
    });
  }

  // Login successful
  console.log(
    "Login successful:",
    user.email
  );

  return res.status(200).json({
    success: true,
    message: "Login successful",

    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  });
});


// ===============================
// UNKNOWN API ROUTE
// ===============================

app.use("/api", (req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found"
  });
});


// ===============================
// START SERVER
// ===============================

app.listen(PORT, () => {
  console.log("");
  console.log("=================================");
  console.log(
    `Server running on http://localhost:${PORT}`
  );
  console.log(
    `Health check: http://localhost:${PORT}/api/health`
  );
  console.log("=================================");
  console.log("");
});