import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
  FaCog,
  FaUsers,
  FaSignOutAlt,
  FaUserCircle,
  FaEnvelope // Add this icon for Email Settings
} from "react-icons/fa";
import Swal from 'sweetalert2';
import "./Sidebar.css";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Load user data from localStorage on component mount
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  // Helper function to check if a path is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Handle logout
  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will be logged out of the system',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        // Clear user data from localStorage
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        
        // Show success message
        Swal.fire({
          icon: 'success',
          title: 'Logged Out!',
          text: 'You have been successfully logged out.',
          timer: 1500,
          showConfirmButton: false
        });
        
        // Navigate to login page
        navigate('/');
      }
    });
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (user?.username) {
      return user.username.substring(0, 2).toUpperCase();
    }
    return 'AD';
  };

  // Get display name
  const getDisplayName = () => {
    if (user?.username) {
      return user.username;
    }
    return 'Admin User';
  };

  // Get display email
  const getDisplayEmail = () => {
    if (user?.email) {
      return user.email;
    }
    return 'admin@company.com';
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
            to="/users" 
            className={`ta-menu-item ${isActive("/users") ? "active" : ""}`}
          >
            <FaUsers /> Users
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

          {/* New Email Settings Link */}
          <Link 
            to="/email-settings" 
            className={`ta-menu-item ${isActive("/email-settings") ? "active" : ""}`}
          >
            <FaEnvelope /> Email Settings
          </Link>
        </div>
      </div>

      {/* Footer with User Info and Logout */}
      <div className="ta-sidebar-footer">
        <div className="ta-user-info-wrapper">
          <div className="ta-avatar">
            {user?.profile_picture ? (
              <img src={user.profile_picture} alt={getDisplayName()} />
            ) : (
              getUserInitials()
            )}
          </div>
          <div className="ta-user-details">
            <p className="ta-user-name">{getDisplayName()}</p>
            <span className="ta-user-email">{getDisplayEmail()}</span>
          </div>
          <button 
            className="ta-logout-btn" 
            onClick={handleLogout}
            title="Logout"
          >
            <FaSignOutAlt />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;