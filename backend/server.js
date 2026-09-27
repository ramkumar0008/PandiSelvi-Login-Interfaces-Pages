const express = require("express");
const cors = require("cors");

const app = express();

const PORT = 5000;

// ======================================
// MIDDLEWARE
// ======================================

app.use(cors());

app.use(express.json());

// ======================================
// MOCK USER DATA
// ======================================

const users = [
  {
    id: 1,
    name: "Demo User",
    email: "demo@gmail.com",
    password: "123456"
  }
];

// ======================================
// HOME API
// ======================================

app.get("/", (req, res) => {
  res.json({
    message:
      "NexaFlow Backend API is running"
  });
});

// ======================================
// REGISTER API
// ======================================

app.post("/api/register", (req, res) => {

  const {
    name,
    email,
    password
  } = req.body;

  // Check empty fields
  if (!name || !email || !password) {

    return res.status(400).json({
      message:
        "All fields are required"
    });
  }

  // Validate email
  const emailPattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {

    return res.status(400).json({
      message:
        "Please enter a valid email address"
    });
  }

  // Validate password
  if (password.length < 6) {

    return res.status(400).json({
      message:
        "Password must be at least 6 characters"
    });
  }

  // Check duplicate email
  const existingUser = users.find(
    (user) =>
      user.email.toLowerCase() ===
      email.toLowerCase()
  );

  if (existingUser) {

    return res.status(409).json({
      message:
        "An account with this email already exists"
    });
  }

  // Create new user
  const newUser = {

    id: users.length + 1,

    name: name.trim(),

    email: email.trim(),

    password
  };

  users.push(newUser);

  return res.status(201).json({

    message:
      "Account created successfully",

    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email
    }

  });
});

// ======================================
// LOGIN API
// ======================================

app.post("/api/login", (req, res) => {

  const {
    email,
    password
  } = req.body;

  // Check empty fields
  if (!email || !password) {

    return res.status(400).json({
      message:
        "Email and password are required"
    });
  }

  // Find user
  const user = users.find(
    (user) =>
      user.email.toLowerCase() ===
        email.toLowerCase() &&
      user.password === password
  );

  // Invalid login
  if (!user) {

    return res.status(401).json({
      message:
        "Invalid email or password"
    });
  }

  // Successful login
  return res.status(200).json({

    message:
      "Login successful",

    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }

  });
});

// ======================================
// START SERVER
// ======================================

app.listen(PORT, () => {

  console.log(
   ` Backend server running on http://localhost:${PORT}`
  );

});