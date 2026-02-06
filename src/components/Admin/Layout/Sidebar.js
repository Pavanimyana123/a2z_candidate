import React from "react";
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

          <a className="ta-menu-item active">
            <FaThLarge /> Dashboard
          </a>

          <a className="ta-menu-item">
            <FaUserGraduate /> Candidates
          </a>

          <a className="ta-menu-item">
            <FaUserTie /> Mentors
          </a>

          <a className="ta-menu-item">
            <FaLayerGroup /> Levels Management
          </a>

          <a className="ta-menu-item">
            <FaBuilding /> Departments
          </a>

          <a className="ta-menu-item">
            <FaSyncAlt /> Rotation Program
          </a>
        </div>

        {/* COMPLIANCE */}
        <div className="ta-menu-section">
          <p className="ta-menu-title">COMPLIANCE</p>

          <a className="ta-menu-item">
            <FaShieldAlt /> Compliance Manage
          </a>

          <a className="ta-menu-item">
            <FaCertificate /> Certifications
          </a>
        </div>

        {/* SYSTEM */}
        <div className="ta-menu-section">
          <p className="ta-menu-title">SYSTEM</p>

          <a className="ta-menu-item">
            <FaChartBar /> Reports & Analytics
          </a>

          <a className="ta-menu-item">
            <FaFileAlt /> Audit Logs
          </a>

          <a className="ta-menu-item">
            <FaCog /> System Settings
          </a>
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
