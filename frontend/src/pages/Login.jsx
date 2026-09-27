import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// Render backend URL
const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://pandiselvi-login-interfaces-pages.onrender.com";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  // ===============================
  // FORM VALIDATION
  // ===============================

  const validateForm = () => {
    const newErrors = {};

    // Correct email pattern
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailPattern.test(email.trim())) {
      newErrors.email = "Enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password =
        "Password must contain at least 8 characters";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // ===============================
  // LOGIN
  // ===============================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setServerError("");

    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/login`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email: email.trim(),
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Save logged-in user
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      // Go to dashboard
      navigate("/dashboard");
    } catch (error) {
      setServerError(
        error.message ||
          "Unable to connect to the backend."
      );
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // UI
  // ===============================

  return (
    <div className="page">
      <div className="auth-wrapper">

        {/* Brand */}
        <div className="brand">
          <div className="logo">
            N
          </div>

          <h1>PandiSelvi Login Pages</h1>

          <p>
            Simple. Secure. Modern.
          </p>
        </div>

        {/* Login Card */}
        <div className="card">

          <h2>
            Welcome Back
          </h2>

          <p className="muted">
            Sign in to continue to your account.
          </p>

          {/* Backend Error */}
          {serverError && (
            <div className="alert error">
              {serverError}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            noValidate
          >

            {/* Email */}
            <label>
              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);

                setErrors({
                  ...errors,
                  email: "",
                });
              }}
            />

            {errors.email && (
              <div className="field-error">
                {errors.email}
              </div>
            )}

            {/* Password */}
            <label>
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);

                setErrors({
                  ...errors,
                  password: "",
                });
              }}
            />

            {errors.password && (
              <div className="field-error">
                {errors.password}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              className="primary"
              disabled={loading}
            >
              {loading
                ? "Signing in..."
                : "Sign In"}
            </button>

          </form>

          {/* Separator */}
          <div className="separator">
            <span>OR</span>
          </div>

          {/* Register */}
          <p className="center muted">
            Don't have an account?
          </p>

          <Link
            to="/register"
            className="secondary"
          >
            Create Account
          </Link>

          {/* Demo Account */}
          <div className="demo">

            <strong>
              Demo Account
            </strong>

            <p>
              Email: demo@gmail.com
            </p>

            <p>
              Password: 12345678
            </p>

          </div>

        </div>
      </div>
    </div>
  );
}

export default Login;

