import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Layout/Sidebar";
import Header from "../Layout/Header";
import "./Dashboard.css";
import "./Layout.css";
import { BASE_URL } from "../../../ApiUrl";

import {
  FaUsers,
  FaUserTie,
  FaSyncAlt,
  FaClock,
  FaExclamationTriangle,
  FaCheckCircle,
  FaHeartbeat,
  FaShieldAlt,
  FaFileAlt,
  FaBalanceScale,
  FaHeartbeat as FaMedical
} from "react-icons/fa";

const Dashboard = () => {
  const navigate = useNavigate();
  const [candidatesCount, setCandidatesCount] = useState(0);
  const [mentorsCount, setMentorsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch candidates count
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/candidate/candidates/`);
        const data = await response.json();
        if (data.status && data.data) {
          setCandidatesCount(data.data.length);
        }
      } catch (error) {
        console.error("Error fetching candidates:", error);
      }
    };

    const fetchMentors = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/mentor/mentors/`);
        const data = await response.json();
        if (data.status && data.data) {
          setMentorsCount(data.data.length);
        }
      } catch (error) {
        console.error("Error fetching mentors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
    fetchMentors();
  }, []);

  const handleCardClick = (path) => {
    navigate(path);
  };

  return (
    <div className="ta-layout-wrapper">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Area */}
      <div className="ta-main-wrapper">
        {/* Header */}
        <Header />

        {/* Dashboard Content */}
        <div className="ta-content-area">
          <div className="dashboard-wrapper">
            {/* Page Header */}
            <div className="dashboard-header">
              <h2>Dashboard</h2>
              <p>Overview of training and surveyor management</p>
            </div>

            {/* Top Stats - Only Candidates and Mentors cards */}
            {/* Top Stats */}
<div className="dashboard-stats">
  <StatCard 
    title="Total Candidates" 
    value={loading ? "Loading..." : candidatesCount} 
    // trend="+12% from last month" 
    icon={<FaUsers />} 
    color="blue"
    onClick={() => handleCardClick("/candidate")}
  />

  <StatCard 
    title="Total Mentors" 
    value={loading ? "Loading..." : mentorsCount} 
    // trend="+3 from last month" 
    icon={<FaUserTie />} 
    color="green"
    onClick={() => handleCardClick("/mentor")}
  />

  <StatCard 
    title="Compliance Alerts" 
    value="7" 
    icon={<FaExclamationTriangle />} 
    color="red"
  />
</div>

            {/* Bottom Section */}
            <div className="row g-4 mt-2">
              {/* Candidates by Level */}
              <div className="col-lg-6">
                <div className="dashboard-card">
                  <h5 className="card-title mb-3">Candidates by Level</h5>

                  {[
                    ["Level 0", 45, "level-gray"],
                    ["Level 1", 82, "level-blue"],
                    ["Level 2", 64, "level-darkblue"],
                    ["Level 3", 38, "level-green"],
                    ["Level 4", 21, "level-orange"],
                    ["Level 5", 12, "level-red"],
                  ].map(([label, value, color]) => (
                    <div className="level-row" key={label}>
                      <span>{label}</span>
                      <div className="level-bar">
                        <div className={`level-fill ${color}`} style={{ width: `${(value / 82) * 100}%` }} />
                      </div>
                      <strong>{value}</strong>
                    </div>
                  ))}
                </div>
              </div>

              {/* Compliance Alerts */}
              <div className="col-lg-6">
                <div className="dashboard-card">
                  <h5 className="card-title mb-3">Compliance Alerts</h5>

                  <AlertItem icon={<FaMedical />} text="Medical Certificates Expiring" count="5" color="red" />
                  <AlertItem icon={<FaShieldAlt />} text="Safety Induction Due" count="8" color="orange" />
                  <AlertItem icon={<FaFileAlt />} text="Missing Documentation" count="3" color="yellow" />
                  <AlertItem icon={<FaBalanceScale />} text="Ethics Compliance Review" count="2" color="gray" />
                </div>
              </div>
            </div>

            {/* Extra Bottom Section */}
            <div className="row g-4 mt-3">
              {/* Recent Activity */}
              <div className="col-lg-6">
                <div className="dashboard-card dash-recent-activity">
                  <h5 className="card-title">Recent Activity</h5>

                  <div className="dash-activity-item">
                    <div className="dash-activity-icon blue">↑</div>
                    <div>
                      <p>John Smith promoted to Level 3</p>
                      <small>2 min ago</small>
                    </div>
                  </div>

                  <div className="dash-activity-item">
                    <div className="dash-activity-icon orange">⚠</div>
                    <div>
                      <p>Medical certificate expiring for 3 candidates</p>
                      <small>15 min ago</small>
                    </div>
                  </div>

                  <div className="dash-activity-item">
                    <div className="dash-activity-icon green">✓</div>
                    <div>
                      <p>Logbook approved for Sarah Johnson</p>
                      <small>1 hour ago</small>
                    </div>
                  </div>

                  <div className="dash-activity-item">
                    <div className="dash-activity-icon blue">＋</div>
                    <div>
                      <p>New candidate registered: Mike Chen</p>
                      <small>2 hours ago</small>
                    </div>
                  </div>

                  <div className="dash-activity-item">
                    <div className="dash-activity-icon green">✓</div>
                    <div>
                      <p>Evidence validated for Level 2 competency</p>
                      <small>3 hours ago</small>
                    </div>
                  </div>
                </div>
              </div>

              {/* System Status */}
              <div className="col-lg-6">
                <div className="dashboard-card dash-system-status">
                  <h5 className="card-title">System Status</h5>

                  <div className="dash-status-row">
                    <span>Database Connection</span>
                    <span className="dash-status-pill green">Healthy</span>
                  </div>

                  <div className="dash-status-row">
                    <span>API Services</span>
                    <span className="dash-status-pill green">Operational</span>
                  </div>

                  <div className="dash-status-row">
                    <span>Authentication</span>
                    <span className="dash-status-pill green">Secure</span>
                  </div>

                  <div className="dash-status-row">
                    <span>Backup Status</span>
                    <span className="dash-status-pill green">Up to date</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---- Components ---- */

/* ---- Components ---- */

const StatCard = ({ title, value, trend, icon, color, onClick }) => (
  <div 
    className="stat-card-wrapper"
    onClick={onClick}
    style={{ cursor: onClick ? "pointer" : "default" }}
  >
    <div className="dashboard-card stat-card">
      <div>
        <p className="stat-title">{title}</p>
        <h3>{value}</h3>
        {trend && <small className="stat-trend">{trend}</small>}
      </div>
      <div className={`stat-icon ${color}`}>{icon}</div>
    </div>
  </div>
);

const AlertItem = ({ icon, text, count, color }) => (
  <div className={`alert-item ${color}`}>
    <div className="alert-left">
      {icon}
      <span>{text}</span>
    </div>
    <strong>{count}</strong>
  </div>
);

export default Dashboard;