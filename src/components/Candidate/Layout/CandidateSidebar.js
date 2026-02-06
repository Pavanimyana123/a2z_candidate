import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaThLarge,
  FaIdCard,
  FaBook,
  FaCheckCircle,
  FaCertificate,
  FaShieldAlt,
  FaGraduationCap,
  FaUsers
} from "react-icons/fa";

const CandidateSidebar = () => {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <aside className="ta-sidebar">
      {/* Logo */}
      <div className="ta-sidebar-header">
        <div className="ta-logo-icon">IC</div>
        <div>
          <h6 className="mb-0">ICSEM</h6>
          <small>Surveyor Platform</small>
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
            to="/professional-id" 
            className={`ta-menu-item ${isActive("/professional-id") ? "active" : ""}`}
          >
            <FaIdCard /> Professional ID
          </Link>

          <Link 
            to="/digital-logbook" 
            className={`ta-menu-item ${isActive("/digital-logbook") ? "active" : ""}`}
          >
            <FaBook /> Digital Logbook
          </Link>

          <Link 
            to="/competency" 
            className={`ta-menu-item ${isActive("/competency") ? "active" : ""}`}
          >
            <FaCheckCircle /> Competency
          </Link>

          <Link 
            to="/rotation-program" 
            className={`ta-menu-item ${isActive("/rotation-program") ? "active" : ""}`}
          >
            <FaCertificate /> Rotation Program
          </Link>
        </div>

        {/* COMPLIANCE */}
        <div className="ta-menu-section">
          <p className="ta-menu-title">COMPLIANCE</p>

          <Link 
            to="/compliance-safety" 
            className={`ta-menu-item ${isActive("/compliance-safety") ? "active" : ""}`}
          >
            <FaShieldAlt /> Compliance & Safety
          </Link>

          <Link 
            to="/certifications" 
            className={`ta-menu-item ${isActive("/certifications") ? "active" : ""}`}
          >
            <FaCertificate /> Certifications
          </Link>
        </div>

        {/* DEVELOPMENT */}
        <div className="ta-menu-section">
          <p className="ta-menu-title">DEVELOPMENT</p>

          <Link 
            to="/learning" 
            className={`ta-menu-item ${isActive("/learning") ? "active" : ""}`}
          >
            <FaGraduationCap /> Learning
          </Link>

          <Link 
            to="/mentorship" 
            className={`ta-menu-item ${isActive("/mentorship") ? "active" : ""}`}
          >
            <FaUsers /> Mentorship
          </Link>
        </div>
      </div>

      {/* Footer - Candidate Info */}
      <div className="ta-sidebar-footer">
        <div className="ta-avatar">JA</div>
        <div className="ta-user-info">
          <p className="ta-user-name">James Anderson</p>
          <span className="ta-user-email">Junior Surveyor</span>
        </div>
      </div>
    </aside>
  );
};

export default CandidateSidebar;