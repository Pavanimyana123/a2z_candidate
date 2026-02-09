// components/Pages/Login/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons from react-icons
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    // Validate credentials
    if (email === "admin@gmail.com" && password === "admin@123") {
      // Admin credentials - navigate to /dashboard
      navigate("/dashboard");
    } else if (email === "mentor@gmail.com" && password === "mentor@123") {
      // Mentor credentials - navigate to /mentor-dashboard
      navigate("/mentor-dashboard");
    } else if (email === "candidate@gmail.com" && password === "candidate@123") {
      navigate("/candidate-dashboard");
    }
      else {
      // Invalid credentials
      setError("Invalid email or password. Please try again.");
    }
  };

  // Optional: Pre-fill demo credentials for testing
  const fillAdminCredentials = () => {
    setEmail("admin@gmail.com");
    setPassword("admin@123");
  };

  const fillMentorCredentials = () => {
    setEmail("mentor@gmail.com");
    setPassword("mentor@123");
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="training-admin-login d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="training-admin-login-card card p-4 shadow" style={{ width: "100%", maxWidth: "400px" }}>
        <div className="card-body">
          <div className="training-admin-login-header text-center mb-4">
            <h3 className="training-admin-login-title">Training Admin</h3>
            <p className="training-admin-login-subtitle text-muted">Surveyor Management System</p>
          </div>
          
          {error && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              {error}
              <button type="button" className="btn-close" onClick={() => setError("")}></button>
            </div>
          )}
          
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email address</label>
              <input 
                type="email" 
                className="form-control" 
                id="email" 
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="mb-3 position-relative">
              <label htmlFor="password" className="form-label">Password</label>
              <div className="input-group">
                <input 
                  type={showPassword ? "text" : "password"} 
                  className="form-control" 
                  id="password" 
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button 
                  type="button" 
                  className="btn btn-outline-secondary"
                  onClick={togglePasswordVisibility}
                  style={{
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                    borderColor: '#ced4da'
                  }}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {/* <div className="form-text">
                Click the eye icon to {showPassword ? "hide" : "show"} password
              </div> */}
            </div>
            
            <div className="d-grid mb-3">
              <button type="submit" className="btn btn-primary">
                Sign In
              </button>
            </div>
          </form>
{/*           
          <div className="training-admin-login-note text-center mt-4">
            <div className="mb-2">
              <small className="text-muted">
                Use the following credentials for testing:
              </small>
            </div>
            
            <div className="d-flex flex-column gap-2">
              <button 
                type="button" 
                className="btn btn-sm btn-outline-primary"
                onClick={fillAdminCredentials}
              >
                Admin: admin@gmail.com / admin@123
              </button>
              
              <button 
                type="button" 
                className="btn btn-sm btn-outline-secondary"
                onClick={fillMentorCredentials}
              >
                Mentor: mentor@gmail.com / mentor@123
              </button>
            </div>
            
            <div className="mt-3">
              <small className="text-muted">
                • Admin will be redirected to <code>/dashboard</code><br/>
                • Mentor will be redirected to <code>/mentor-dashboard</code>
              </small>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Login;