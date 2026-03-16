// components/Pages/Login/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Swal from 'sweetalert2';
import "./Login.css";
import { BASE_URL } from "../../../ApiUrl";

const Login = () => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

const handleLogin = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  if (!identifier.trim() || !password.trim()) {
    setError("Please enter both identifier and password");
    setLoading(false);
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/api/admin/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        identifier: identifier.trim(),
        password: password
      })
    });

    const data = await response.json();
    console.log('📥 Login response:', data);

    if (!response.ok) {
      throw new Error(data.message || 'Login failed. Please check your credentials.');
    }

    if (data.status && data.data) {

      const userType = data.data.user_type;

      console.log('✅ Login successful:', data);

      /* -----------------------------------------
         Store user data based on user_type
      ------------------------------------------ */

      let storageKey = "user";

      if (userType === "admin") {
        storageKey = "admin_user";
      } else if (userType === "mentor") {
        storageKey = "mentor_user";
      } else if (userType === "candidate") {
        storageKey = "candidate_user";
      }

      localStorage.setItem(storageKey, JSON.stringify(data.data));

      /* -----------------------------------------
         Store token based on user_type
      ------------------------------------------ */

      const token = data.data.token || data.token;

      if (token) {
        localStorage.setItem(`${userType}_token`, token);
      }

      /* -----------------------------------------
         Success Message
      ------------------------------------------ */

      await Swal.fire({
        icon: 'success',
        title: 'Login Successful!',
        text: 'Welcome back!',
        timer: 1500,
        showConfirmButton: false
      });

      /* -----------------------------------------
         Role Based Navigation
      ------------------------------------------ */

      switch (userType) {
        case 'admin':
          navigate('/dashboard');
          break;

        case 'mentor':
          navigate('/mentor-dashboard');
          break;

        case 'candidate':
          navigate('/candidate-dashboard');
          break;

        default:
          console.error('Unknown user type:', userType);
          navigate('/dashboard');
      }

    } else {
      throw new Error(data.message || 'Invalid response from server');
    }

  } catch (err) {

    console.error('❌ Login error:', err);

    setError(err.message || 'Login failed. Please try again.');

    Swal.fire({
      icon: 'error',
      title: 'Login Failed',
      text: err.message || 'Invalid credentials. Please try again.',
      timer: 3000,
      showConfirmButton: true
    });

  } finally {
    setLoading(false);
  }
};

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="training-admin-login d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="training-admin-login-card card p-4 shadow" style={{ width: "100%", maxWidth: "400px", maxHeight: "600px"  }}>
        <div className="card-body">

          <div className="training-admin-login-header login-text-center mb-4">
            <div className="mb-3">
              <div className="training-admin-logo" style={{ 
                width: "80px",
                height: "80px",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto",
                fontSize: "40px",
                color: "white"
              }}>
                🛡️
              </div>
            </div>

            <h3 className="training-admin-login-title" style={{ fontSize: "24px", fontWeight: "600", color: "#333" }}>
              Training Admin
            </h3>

            <p className="training-admin-login-subtitle text-muted" style={{ fontSize: "14px" }}>
              Surveyor Management System
            </p>
          </div>

          {error && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert" style={{ fontSize: "14px" }}>
              {error}
              <button type="button" className="btn-close" onClick={() => setError("")}></button>
            </div>
          )}

          <form onSubmit={handleLogin}>

            <div className="mb-3">
              <label htmlFor="identifier" className="form-label" style={{ fontWeight: "500", fontSize: "14px" }}>
                Email or Phone Number <span className="text-danger">*</span>
              </label>

              <input
                type="text"
                className="form-control"
                id="identifier"
                placeholder="Enter your email or phone number"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                disabled={loading}
                style={{ padding: "12px", fontSize: "14px" }}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="form-label" style={{ fontWeight: "500", fontSize: "14px" }}>
                Password <span className="text-danger">*</span>
              </label>

              <div className="input-group">

                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  style={{ padding: "12px", fontSize: "14px" }}
                />

                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={togglePasswordVisibility}
                  disabled={loading}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>

              </div>
            </div>

            <div className="d-grid mb-3">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{
                  padding: "12px",
                  fontSize: "16px",
                  fontWeight: "500",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  border: "none"
                }}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </div>

            <div className="text-center mb-3">
              <button
                type="button"
                className="training-admin-forgot-link"
                onClick={() => navigate("/forgot-password")}
              >
                Add / Forgot Password
              </button>
            </div>

          </form>

          <div className="text-center mt-4">
            <small className="text-muted">
              © 2026 Training Admin. All rights reserved.
            </small>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;