import React from "react";
import Sidebar from "../Layout/Sidebar";
import Header from "../Layout/Header";
import "./LevelManagement.css";
import { FaSave, FaEdit } from "react-icons/fa";

const LevelsManagement = () => {
  return (
    <div className="ta-layout-wrapper">
      <Sidebar />

      <div className="ta-main-wrapper">
        <Header />

        <div className="ta-content-area">
          <div className="lm-wrapper">
            {/* Page Header */}
            <div className="lm-header">
              <div>
                <h2>Levels Management</h2>
                <p>Configure training levels and progression requirements</p>
              </div>

              <button className="btn btn-primary lm-save-btn">
                <FaSave /> Save Changes
              </button>
            </div>

            {/* Level Cards */}
            <LevelCard
              level="0"
              title="Trainee"
              desc="Entry-level candidates undergoing initial orientation and basic training"
              candidates="45"
              exposure="40h"
              mandatory={[
                "Safety induction",
                "Basic orientation",
                "Department introduction"
              ]}
              promotion={[
                "Complete all orientation modules",
                "Pass basic assessment"
              ]}
              authority={[
                "Observation only",
                "No independent tasks"
              ]}
            />

            <LevelCard
              level="1"
              title="Junior Surveyor"
              desc="Candidates with basic training, working under direct supervision"
              candidates="82"
              exposure="120h"
              mandatory={[
                "Level 0 completion",
                "Department rotation start",
                "Basic competency test"
              ]}
              promotion={[
                "Minimum 120 exposure hours",
                "Mentor approval",
                "Competency assessment"
              ]}
              authority={[
                "Supervised tasks only",
                "Basic documentation"
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------------- Components ---------------- */

const LevelCard = ({
  level,
  title,
  desc,
  candidates,
  exposure,
  mandatory,
  promotion,
  authority
}) => (
  <div className="lm-card">
    {/* Header */}
    <div className="lm-card-header">
      <div className="lm-title-wrap">
        <div className="lm-level-badge">{level}</div>
        <div>
          <h5>{title}</h5>
          <p>{desc}</p>
        </div>
      </div>

      <div className="lm-card-actions">
        <span className="lm-candidate-pill">
          {candidates} candidates
        </span>
        <FaEdit />
      </div>
    </div>

    {/* Content */}
    <div className="row mt-3">
      {/* Minimum Exposure */}
      <div className="col-lg-3">
        <h6 className="lm-section-title">Minimum Exposure</h6>
        <div className="lm-exposure">{exposure}</div>
      </div>

      {/* Mandatory Requirements */}
      <div className="col-lg-3">
        <h6 className="lm-section-title">Mandatory Requirements</h6>
        <ul className="lm-list blue">
          {mandatory.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>

      {/* Promotion Rules */}
      <div className="col-lg-3">
        <h6 className="lm-section-title">Promotion Rules</h6>
        <ul className="lm-list green">
          {promotion.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>

      {/* Authority Limits */}
      <div className="col-lg-3">
        <h6 className="lm-section-title">Authority Limits</h6>
        <ul className="lm-list orange">
          {authority.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

export default LevelsManagement;
