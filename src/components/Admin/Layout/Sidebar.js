import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaThLarge,
  FaUserGraduate,
  FaUserTie,
  FaLayerGroup,
  FaBuilding,
  FaSyncAlt,
  FaShieldAlt,
  FaCertificate,
  FaChartBar,
  FaFileAlt,
  FaCog
} from "react-icons/fa";

const Sidebar = () => {
  const location = useLocation();
  
  // Helper function to check if a path is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <aside className="ta-sidebar">
      {/* Logo */}
      <div className="ta-sidebar-header">
        <div className="ta-logo-icon">🛡️</div>
        <div>
          <h6 className="mb-0">Training Admin</h6>
          <small>Surveyor Management</small>
        </div>
      </div>

      {/* Scrollable Menu */}
      <div className="ta-sidebar-scroll">
        {/* MAIN */}
        <div className="ta-menu-section">
          <p className="ta-menu-title">MAIN</p>

          <Link 
            to="/dashboard" 
            className={`ta-menu-item ${isActive("/dashboard") ? "active" : ""}`}
          >
            <FaThLarge /> Dashboard
          </Link>

          <Link 
            to="/candidate" 
            className={`ta-menu-item ${isActive("/candidate") ? "active" : ""}`}
          >
            <FaUserGraduate /> Candidates
          </Link>

          <Link 
            to="/mentor" 
            className={`ta-menu-item ${isActive("/mentor") ? "active" : ""}`}
          >
            <FaUserTie /> Mentors
          </Link>

          <Link 
            to="/level" 
            className={`ta-menu-item ${isActive("/level") ? "active" : ""}`}
          >
            <FaLayerGroup /> Levels Management
          </Link>

          <Link 
            to="/department" 
            className={`ta-menu-item ${isActive("/department") ? "active" : ""}`}
          >
            <FaBuilding /> Departments
          </Link>

          <Link 
            to="/rotation" 
            className={`ta-menu-item ${isActive("/rotation") ? "active" : ""}`}
          >
            <FaSyncAlt /> Rotation Program
          </Link>
        </div>

        {/* COMPLIANCE */}
        <div className="ta-menu-section">
          <p className="ta-menu-title">COMPLIANCE</p>

          <Link 
            to="/compliance" 
            className={`ta-menu-item ${isActive("/compliance") ? "active" : ""}`}
          >
            <FaShieldAlt /> Compliance Manage
          </Link>

          <Link 
            to="/certificate" 
            className={`ta-menu-item ${isActive("/certificate") ? "active" : ""}`}
          >
            <FaCertificate /> Certifications
          </Link>
        </div>

        {/* SYSTEM */}
        <div className="ta-menu-section">
          <p className="ta-menu-title">SYSTEM</p>

          <Link 
            to="/report" 
            className={`ta-menu-item ${isActive("/report") ? "active" : ""}`}
          >
            <FaChartBar /> Reports & Analytics
          </Link>

          <Link 
            to="/audit" 
            className={`ta-menu-item ${isActive("/audit") ? "active" : ""}`}
          >
            <FaFileAlt /> Audit Logs
          </Link>

          <Link 
            to="/system" 
            className={`ta-menu-item ${isActive("/system") ? "active" : ""}`}
          >
            <FaCog /> System Settings
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="ta-sidebar-footer">
        <div className="ta-avatar">AD</div>
        <div className="ta-user-info">
          <p className="ta-user-name">Admin User</p>
          <span className="ta-user-email">admin@company.com</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;