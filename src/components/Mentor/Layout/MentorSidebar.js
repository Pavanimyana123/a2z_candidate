import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaThLarge,
  FaUserGraduate,
  FaBook,
  FaEye,
  FaSyncAlt,
  FaShieldAlt,
  FaCommentAlt,
  FaChartBar,
  FaUser
} from "react-icons/fa";

const MentorSidebar = () => {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <aside className="ta-sidebar">
      {/* Logo */}
      <div className="ta-sidebar-header">
        <div className="ta-logo-icon">IP</div>
        <div>
          <h6 className="mb-0">InspectPro</h6>
          <small>Mentor Portal</small>
        </div>
      </div>

      {/* Scrollable Menu */}
      <div className="ta-sidebar-scroll">
        {/* All items in single section based on image */}
        <div className="ta-menu-section">
          {/* No section title in image, but keeping structure similar */}
          <Link 
            to="/mentor-dashboard" 
            className={`ta-menu-item ${isActive("/mentor-dashboard") ? "active" : ""}`}
          >
            <FaThLarge /> Dashboard
          </Link>

          <Link 
            to="/mentor-candidates" 
            className={`ta-menu-item ${isActive("/mentor-candidates") ? "active" : ""}`}
          >
            <FaUserGraduate /> Candidates
          </Link>

          <Link 
            to="/mentor-logbook" 
            className={`ta-menu-item ${isActive("/mentor-logbook") ? "active" : ""}`}
          >
            <FaBook /> Logbook Approvals
          </Link>

          <Link 
            to="/mentor-evidence" 
            className={`ta-menu-item ${isActive("/mentor-evidence") ? "active" : ""}`}
          >
            <FaEye /> Evidence Review
          </Link>

          <Link 
            to="/mentor-rotation" 
            className={`ta-menu-item ${isActive("/mentor-rotation") ? "active" : ""}`}
          >
            <FaSyncAlt /> Rotation Tracking
          </Link>

          <Link 
            to="/mentor-compliance" 
            className={`ta-menu-item ${isActive("/mentor-compliance") ? "active" : ""}`}
          >
            <FaShieldAlt /> Compliance
          </Link>

          <Link 
            to="/mentor-feedback" 
            className={`ta-menu-item ${isActive("/mentor-feedback") ? "active" : ""}`}
          >
            <FaCommentAlt /> Feedback
          </Link>

          <Link 
            to="/mentor-reports" 
            className={`ta-menu-item ${isActive("/mentor-reports") ? "active" : ""}`}
          >
            <FaChartBar /> Reports
          </Link>
        </div>
      </div>

      {/* Footer - Profile Link */}
      <div className="ta-sidebar-footer">
        <Link 
          to="/mentor-profile" 
          className="ta-menu-item"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "10px 14px",
            borderRadius: "8px",
            color: "#e5e7eb",
            cursor: "pointer",
            textDecoration: "none",
            width: "100%"
          }}
        >
          <div className="ta-avatar">
            <FaUser />
          </div>
          <div className="ta-user-info">
            <p className="ta-user-name" style={{ margin: 0, fontWeight: "500" }}>Profile</p>
          </div>
        </Link>
      </div>
    </aside>
  );
};

export default MentorSidebar;