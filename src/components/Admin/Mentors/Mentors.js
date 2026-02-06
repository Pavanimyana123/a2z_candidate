import React from "react";
import Sidebar from "../Layout/Sidebar";
import Header from "../Layout/Header";
import "./Mentors.css";
import { FaEllipsisH, FaCheckCircle } from "react-icons/fa";

const Mentors = () => {
  return (
    <div className="ta-layout-wrapper">
      <Sidebar />

      <div className="ta-main-wrapper">
        <Header />

        <div className="ta-content-area">
          <div className="mm-wrapper">
            {/* Page Header */}
            <div className="mm-header">
              <div>
                <h2>Mentor Management</h2>
                <p>Manage mentors and their assigned candidates</p>
              </div>
              <button className="btn btn-primary mm-add-btn">
                Add Mentor
              </button>
            </div>

            {/* Stats */}
            <div className="row g-4 mt-1">
              <StatBox title="Total Mentors" value="6" />
              <StatBox title="Active Mentors" value="5" />
              <StatBox title="Pending Validations" value="10" />
              <StatBox title="Avg Approval Rate" value="93%" />
            </div>

            {/* Search */}
            <div className="mm-search-box mt-4">
              <input
                type="text"
                className="form-control"
                placeholder="Search mentors..."
              />
            </div>

            {/* Mentor Cards */}
            <div className="row g-4 mt-3">
              <MentorCard
                initials="DJW"
                name="Dr. James Wilson"
                dept="Manufacturing & Quality"
                assigned="8"
                pending="3"
                rate="94"
              />

              <MentorCard
                initials="DEB"
                name="Dr. Emily Brown"
                dept="QA/QC Systems"
                assigned="6"
                pending="1"
                rate="98"
              />

              <MentorCard
                initials="DRL"
                name="Dr. Robert Lee"
                dept="Coating & Testing"
                assigned="5"
                pending="0"
                rate="92"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* -------- Components -------- */

const StatBox = ({ title, value }) => (
  <div className="col-lg-3 col-md-6">
    <div className="mm-stat-card">
      <p>{title}</p>
      <h3>{value}</h3>
    </div>
  </div>
);

const MentorCard = ({ initials, name, dept, assigned, pending, rate }) => (
  <div className="col-lg-4">
    <div className="mm-mentor-card">
      <div className="mm-card-header">
        <div className="mm-avatar">{initials}</div>
        <div className="mm-mentor-info">
          <h5>{name}</h5>
          <span>{dept}</span>
        </div>
        <FaEllipsisH />
      </div>

      <div className="mm-card-body">
        <div className="mm-metric">
          <span>Assigned Candidates</span>
          <strong>{assigned}</strong>
        </div>
        <div className="mm-metric">
          <span>Pending Validations</span>
          <strong className="text-warning">{pending}</strong>
        </div>

        <div className="mm-progress-wrap">
          <span>Approval Rate</span>
          <strong>{rate}%</strong>
        </div>

        <div className="progress mm-progress">
          <div
            className="progress-bar"
            style={{ width: `${rate}%` }}
          />
        </div>
      </div>

      <div className="mm-card-footer">
        <span className="mm-status active">active</span>
        <button className="btn btn-outline-primary btn-sm">
          <FaCheckCircle /> Review
        </button>
      </div>
    </div>
  </div>
);

export default Mentors;
