import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// Render backend URL
const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://pandiselvi-login-interfaces-pages.onrender.com";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  // ===============================
  // HANDLE INPUT CHANGE
  // ===============================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: "",
    });

    setServerError("");
  };

  // ===============================
  // FORM VALIDATION
  // ===============================

  const validateForm = () => {
    const newErrors = {};

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 3) {
      newErrors.name =
        "Name must contain at least 3 characters";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !emailPattern.test(formData.email.trim())
    ) {
      newErrors.email =
        "Enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password =
        "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password =
        "Password must contain at least 8 characters";
    }

    // Confirm password validation
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

  // ===============================
  // REGISTER
  // ===============================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setServerError("");

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/register`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name: formData.name.trim(),
            email: formData.email.trim(),
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Registration failed"
        );
      }

      alert("Account created successfully!");

      navigate("/login");
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

          <h1>
            Pandi Selvi Login Page
          </h1>

          <p>
            Create your account and get started.
          </p>

        </div>

        {/* Register Card */}
        <div className="card">

          <h2>
            Create Account
          </h2>

          <p className="muted">
            Create your PandiSelvi Login Page account.
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

            {/* Name */}
            <label>
              Full Name
            </label>

            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
            />

            {errors.name && (
              <div className="field-error">
                {errors.name}
              </div>
            )}

            {/* Email */}
            <label>
              Email Address
            </label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
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
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
            />

            {errors.password && (
              <div className="field-error">
                {errors.password}
              </div>
            )}

            {/* Confirm Password */}
            <label>
              Confirm Password
            </label>

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />

            {errors.confirmPassword && (
              <div className="field-error">
                {errors.confirmPassword}
              </div>
            )}

            {/* Register Button */}
            <button
              type="submit"
              className="primary"
              disabled={loading}
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}
            </button>

          </form>

          {/* Separator */}
          <div className="separator">
            <span>OR</span>
          </div>

          {/* Login */}
          <p className="center muted">
            Already have an account?
          </p>

          <Link
            to="/login"
            className="secondary"
          >
            Back to Login
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Register;

