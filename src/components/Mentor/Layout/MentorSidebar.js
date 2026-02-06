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
            to="/dashboard" 
            className={`ta-menu-item ${isActive("/dashboard") ? "active" : ""}`}
          >
            <FaThLarge /> Dashboard
          </Link>

          <Link 
            to="/candidates" 
            className={`ta-menu-item ${isActive("/candidates") ? "active" : ""}`}
          >
            <FaUserGraduate /> Candidates
          </Link>

          <Link 
            to="/logbook-approvals" 
            className={`ta-menu-item ${isActive("/logbook-approvals") ? "active" : ""}`}
          >
            <FaBook /> Logbook Approvals
          </Link>

          <Link 
            to="/evidence-review" 
            className={`ta-menu-item ${isActive("/evidence-review") ? "active" : ""}`}
          >
            <FaEye /> Evidence Review
          </Link>

          <Link 
            to="/rotation-tracking" 
            className={`ta-menu-item ${isActive("/rotation-tracking") ? "active" : ""}`}
          >
            <FaSyncAlt /> Rotation Tracking
          </Link>

          <Link 
            to="/compliance" 
            className={`ta-menu-item ${isActive("/compliance") ? "active" : ""}`}
          >
            <FaShieldAlt /> Compliance
          </Link>

          <Link 
            to="/feedback" 
            className={`ta-menu-item ${isActive("/feedback") ? "active" : ""}`}
          >
            <FaCommentAlt /> Feedback
          </Link>

          <Link 
            to="/reports" 
            className={`ta-menu-item ${isActive("/reports") ? "active" : ""}`}
          >
            <FaChartBar /> Reports
          </Link>
        </div>
      </div>

      {/* Footer - Profile Link */}
      <div className="ta-sidebar-footer">
        <div className="ta-avatar">
          <FaUser />
        </div>
        <div className="ta-user-info">
          <p className="ta-user-name">Profile</p>
          {/* Email not shown in image, keeping minimal */}
        </div>
      </div>
    </aside>
  );
};

export default MentorSidebar;