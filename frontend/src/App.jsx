import { useState } from "react";
import axios from "axios";
import "./index.css";

const API_URL = import.meta.env.VITE_API_URL;

// ======================================================
// MAIN APP
// ======================================================

function App() {
  const [page, setPage] = useState("login");
  const [user, setUser] = useState(null);

  // Login successful
  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setPage("dashboard");
  };

  // Logout
  const handleLogout = () => {
    setUser(null);
    setPage("login");
  };

  return (
    <>
      {page === "login" && (
        <LoginPage
          onLoginSuccess={handleLoginSuccess}
          onCreateAccount={() => setPage("register")}
        />
      )}

      {page === "register" && (
        <RegisterPage
          onRegisterSuccess={() => setPage("login")}
          onBackToLogin={() => setPage("login")}
        />
      )}

      {page === "dashboard" && (
        <Dashboard
          user={user}
          onLogout={handleLogout}
        />
      )}
    </>
  );
}

// ======================================================
// LOGIN PAGE
// ======================================================

function LoginPage({
  onLoginSuccess,
  onCreateAccount
}) {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle input
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value
    });

    setErrors({
      ...errors,
      [name]: ""
    });

    setServerError("");
  };

  // Validate
  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email
      )
    ) {
      newErrors.email =
        "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password =
        "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password =
        "Password must be at least 6 characters";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Login
  const handleSubmit = async (event) => {
    event.preventDefault();

    setServerError("");

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${API_URL}/login`,
        formData
      );

      onLoginSuccess(response.data.user);

    } catch (error) {
      setServerError(
        error.response?.data?.message ||
          "Unable to connect to the backend server"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        {/* BRAND */}
        <div className="brand">

          <div className="brand-logo">
            N
          </div>

          <div>
            <h1>NexaFlow</h1>
            <p>Smart. Simple. Secure.</p>
          </div>

        </div>

        {/* HEADING */}
        <div className="heading">

          <h2>Welcome back</h2>

          <p>
            Sign in to continue to your account
          </p>

        </div>

        {/* SERVER ERROR */}
        {serverError && (
          <div className="error-box">
            {serverError}
          </div>
        )}

        {/* LOGIN FORM */}
        <form onSubmit={handleSubmit}>

          {/* EMAIL */}
          <div className="form-group">

            <label htmlFor="login-email">
              Email Address
            </label>

            <input
              id="login-email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />

            {errors.email && (
              <small className="field-error">
                {errors.email}
              </small>
            )}

          </div>

          {/* PASSWORD */}
          <div className="form-group">

            <label htmlFor="login-password">
              Password
            </label>

            <input
              id="login-password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />

            {errors.password && (
              <small className="field-error">
                {errors.password}
              </small>
            )}

          </div>

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            className="primary-button"
            disabled={loading}
          >
            {loading
              ? "Signing in..."
              : "Sign In"}
          </button>

        </form>

        {/* DIVIDER */}
        <div className="divider">
          <span>OR</span>
        </div>

        {/* CREATE ACCOUNT */}
        <p className="switch-text">

          Don't have an account?

          <button
            type="button"
            className="link-button"
            onClick={onCreateAccount}
          >
            Create Account
          </button>

        </p>

        {/* DEMO ACCOUNT */}
        <div className="demo-box">

          <strong>Demo Account</strong>

          <p>
            Email: demo@gmail.com
          </p>

          <p>
            Password: 123456
          </p>

        </div>

      </div>

    </div>
  );
}

// ======================================================
// REGISTER PAGE
// ======================================================

function RegisterPage({
  onRegisterSuccess,
  onBackToLogin
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] =
    useState("");
  const [loading, setLoading] = useState(false);

  // Handle input
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value
    });

    setErrors({
      ...errors,
      [name]: ""
    });

    setServerError("");
  };

  // Validate registration
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name =
        "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email =
        "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email
      )
    ) {
      newErrors.email =
        "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password =
        "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password =
        "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword =
        "Please confirm your password";
    } else if (
      formData.password !==
      formData.confirmPassword
    ) {
      newErrors.confirmPassword =
        "Passwords do not match";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Register
  const handleSubmit = async (event) => {
    event.preventDefault();

    setServerError("");
    setSuccessMessage("");

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        `${API_URL}/register`,
        {
          name: formData.name,
          email: formData.email,
          password: formData.password
        }
      );

      setSuccessMessage(
        "Account created successfully! Redirecting..."
      );

      setTimeout(() => {
        onRegisterSuccess();
      }, 1500);

    } catch (error) {
      setServerError(
        error.response?.data?.message ||
          "Unable to create account"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        {/* BRAND */}
        <div className="brand">

          <div className="brand-logo">
            N
          </div>

          <div>
            <h1>NexaFlow</h1>
            <p>Smart. Simple. Secure.</p>
          </div>

        </div>

        {/* HEADING */}
        <div className="heading">

          <h2>Create your account</h2>

          <p>
            Join NexaFlow and get started today
          </p>

        </div>

        {/* ERROR */}
        {serverError && (
          <div className="error-box">
            {serverError}
          </div>
        )}

        {/* SUCCESS */}
        {successMessage && (
          <div className="success-box">
            {successMessage}
          </div>
        )}

        {/* REGISTER FORM */}
        <form onSubmit={handleSubmit}>

          {/* NAME */}
          <div className="form-group">

            <label htmlFor="register-name">
              Full Name
            </label>

            <input
              id="register-name"
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
            />

            {errors.name && (
              <small className="field-error">
                {errors.name}
              </small>
            )}

          </div>

          {/* EMAIL */}
          <div className="form-group">

            <label htmlFor="register-email">
              Email Address
            </label>

            <input
              id="register-email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />

            {errors.email && (
              <small className="field-error">
                {errors.email}
              </small>
            )}

          </div>

          {/* PASSWORD */}
          <div className="form-group">

            <label htmlFor="register-password">
              Password
            </label>

            <input
              id="register-password"
              type="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
            />

            {errors.password && (
              <small className="field-error">
                {errors.password}
              </small>
            )}

          </div>

          {/* CONFIRM PASSWORD */}
          <div className="form-group">

            <label htmlFor="confirm-password">
              Confirm Password
            </label>

            <input
              id="confirm-password"
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />

            {errors.confirmPassword && (
              <small className="field-error">
                {errors.confirmPassword}
              </small>
            )}

          </div>

          {/* REGISTER BUTTON */}
          <button
            type="submit"
            className="primary-button"
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>

        </form>

        {/* LOGIN LINK */}
        <p className="switch-text">

          Already have an account?

          <button
            type="button"
            className="link-button"
            onClick={onBackToLogin}
          >
            Sign In
          </button>

        </p>

      </div>

    </div>
  );
}

// ======================================================
// DASHBOARD
// ======================================================

function Dashboard({
  user,
  onLogout
}) {
  return (
    <div className="dashboard">

      {/* HEADER */}
      <header className="dashboard-header">

        <div className="dashboard-brand">

          <div className="brand-logo">
            N
          </div>

          <div>
            <h2>NexaFlow</h2>
            <span>Dashboard</span>
          </div>

        </div>

        <button
          type="button"
          className="logout-button"
          onClick={onLogout}
        >
          Logout
        </button>

      </header>

      {/* CONTENT */}
      <main className="dashboard-content">

        {/* WELCOME */}
        <div className="welcome-card">

          <div className="welcome-icon">
            ✓
          </div>

          <h1>
            Welcome, {user?.name}!
          </h1>

          <p>
            You have successfully logged into
            your NexaFlow account.
          </p>

          {/* USER INFORMATION */}
          <div className="user-info">

            <div>
              <span>Name</span>

              <strong>
                {user?.name}
              </strong>
            </div>

            <div>
              <span>Email</span>

              <strong>
                {user?.email}
              </strong>
            </div>

          </div>

        </div>

        {/* CARDS */}
        <div className="dashboard-grid">

          <div className="dashboard-card">

            <div className="card-icon">
              📊
            </div>

            <h3>Analytics</h3>

            <p>
              View application activity
              and statistics.
            </p>

          </div>

          <div className="dashboard-card">

            <div className="card-icon">
              ⚙️
            </div>

            <h3>Settings</h3>

            <p>
              Manage your account and
              application settings.
            </p>

          </div>

          <div className="dashboard-card">

            <div className="card-icon">
              🔒
            </div>

            <h3>Security</h3>

            <p>
              Your account uses frontend
              and backend validation.
            </p>

          </div>

        </div>

      </main>

    </div>
  );
}

export default App;