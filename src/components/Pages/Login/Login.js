// components/Pages/Login/Login.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // In a real app, you would authenticate here
    navigate("/dashboard");
  };

  return (
    <div className="training-admin-login d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="training-admin-login-card card p-4 shadow" style={{ width: "100%", maxWidth: "400px" }}>
        <div className="card-body">
          <div className="training-admin-login-header text-center mb-4">
            <h3 className="training-admin-login-title">Training Admin</h3>
            <p className="training-admin-login-subtitle text-muted">Surveyor Management System</p>
          </div>
          
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email address</label>
              <input 
                type="email" 
                className="form-control" 
                id="email" 
                placeholder="admin@company.com"
                defaultValue="admin@company.com"
              />
            </div>
            
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input 
                type="password" 
                className="form-control" 
                id="password" 
                placeholder="Enter password"
                defaultValue="password"
              />
            </div>
            
            <div className="d-grid">
              <button type="submit" className="btn btn-primary">
                Sign In to Dashboard
              </button>
            </div>
          </form>
          
          <div className="training-admin-login-note text-center mt-4">
            <small className="text-muted">
              Use admin@company.com / password to login
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;