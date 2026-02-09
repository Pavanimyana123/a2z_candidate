import React from "react";
import CandidateSidebar from "../Layout/CandidateSidebar";
import Header from "../Layout/CandidateHeader";
import {
  FaFilter,
  FaPlay,
  FaCheckCircle,
  FaClock
} from "react-icons/fa";
import "./CandidateLearning.css";

const CandidateLearningDashboard = () => {
  return (
    <div className="cld-layout-wrapper">
      {/* Sidebar */}
      <CandidateSidebar />

      {/* Main Content */}
      <div className="cld-main-wrapper">
        <Header />

        <div className="cld-content-area">
          <div className="container-fluid">
            {/* ================= PAGE HEADER ================= */}
            <div className="cld-header">
              <div>
                <h2>Learning & Upskilling</h2>
                <p className="cld-muted">Develop your competencies with structured training</p>
              </div>

              <button className="btn cld-filter-btn">
                <FaFilter /> Filter Modules
              </button>
            </div>

            {/* ================= STATS ================= */}
            <div className="row g-4 mb-4">
              <StatCard 
                icon="🏆" 
                value="3" 
                label="Completed" 
              />
              <StatCard 
                icon="▶" 
                value="2" 
                label="In Progress" 
              />
              <StatCard 
                icon="🕒" 
                value="12h" 
                label="Hours Completed" 
              />
              <StatCard 
                icon="🎯" 
                value="46h" 
                label="Total Available" 
              />
            </div>

            {/* ================= CONTINUE LEARNING SECTION ================= */}
            <div className="cld-card mb-4">
              <div className="mb-3">
                <h4>Continue Learning</h4>
                <p className="cld-muted">Pick up where you left off</p>
              </div>

              <div className="row g-4">
                <ContinueCard
                  title="Coating Inspection Methods"
                  desc="Surface preparation assessment and coating quality evaluation"
                  hours="5 hours"
                  progress={75}
                />

                <ContinueCard
                  title="NDT Fundamentals"
                  desc="Non-destructive testing methods and applications"
                  hours="8 hours"
                  progress={30}
                />
              </div>
            </div>

            {/* ================= ALL LEARNING MODULES ================= */}
            <div className="cld-card mb-4">
              <div className="mb-3">
                <h4>All Learning Modules</h4>
                <p className="cld-muted">Browse available training content</p>
              </div>

              <ModuleRow
                title="Introduction to Marine Surveying"
                badge="Foundation"
                hours="4 hours"
                completed={true}
              />

              <ModuleRow
                title="Steel Structure Inspection"
                badge="Technical"
                hours="6 hours"
                completed={true}
              />

              <ModuleRow
                title="Coating Inspection Methods"
                badge="Technical"
                hours="5 hours"
                progress={75}
              />

              <ModuleRow
                title="NDT Fundamentals"
                badge="Technical"
                hours="8 hours"
                progress={30}
              />

              <ModuleRow
                title="Documentation & Reporting"
                badge="Professional"
                hours="3 hours"
                start={true}
              />
            </div>

            {/* ================= SKILL MATRIX ================= */}
            <div className="cld-card">
              <div className="mb-3">
                <h4>Your Skill Matrix</h4>
                <p className="cld-muted">Competency levels by discipline</p>
              </div>

              <div className="row g-4">
                <SkillBar title="Visual Inspection" value={75} />
                <SkillBar title="NDT Interpretation" value={45} />
                <SkillBar title="Coating Assessment" value={68} />
                <SkillBar title="Documentation" value={82} />
                <SkillBar title="Safety Procedures" value={90} />
                <SkillBar title="Technical Reporting" value={55} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ================= SUB COMPONENTS ================= */

const StatCard = ({ icon, value, label }) => (
  <div className="col-lg-3 col-md-6">
    <div className="cld-stat-card">
      <div className="cld-stat-icon">{icon}</div>
      <h3>{value}</h3>
      <p>{label}</p>
    </div>
  </div>
);

const ContinueCard = ({ title, desc, hours, progress }) => (
  <div className="col-lg-6">
    <div className="cld-continue-card">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <span className="cld-badge">Technical</span>
        <span style={{ color: '#6c7a89', fontWeight: '500' }}>{hours}</span>
      </div>

      <h5>{title}</h5>
      <p>{desc}</p>

      <div className="cld-progress">
        <div style={{ width: `${progress}%` }} />
      </div>

      <button className="btn cld-primary-btn">
        <FaPlay /> Continue
      </button>
    </div>
  </div>
);

const ModuleRow = ({ title, badge, hours, completed, progress, start }) => (
  <div className="cld-module-row">
    <div className="cld-module-left">
      {completed && <FaCheckCircle className="cld-green" />}
      {!completed && !progress && !start && <FaClock style={{ color: '#a0aec0' }} />}
      {progress && <FaClock style={{ color: '#1f3a5f' }} />}
      {start && <FaClock style={{ color: '#a0aec0' }} />}

      <div>
        <h6>{title}</h6>
        <span className="cld-badge small">{badge}</span>
      </div>
    </div>

    <div className="cld-module-right">
      {progress && (
        <div className="cld-mini-progress">
          <div style={{ width: `${progress}%` }} />
          <span>{progress}%</span>
        </div>
      )}

      <span style={{ color: '#6c7a89', minWidth: '60px' }}>{hours}</span>

      {completed && (
        <button className="btn btn-light" style={{ minWidth: '90px' }}>
          Review
        </button>
      )}
      {progress && (
        <button className="btn cld-primary-btn" style={{ minWidth: '90px' }}>
          <FaPlay style={{ fontSize: '12px' }} /> Continue
        </button>
      )}
      {start && (
        <button className="btn cld-primary-btn" style={{ minWidth: '90px' }}>
          Start
        </button>
      )}
    </div>
  </div>
);

const SkillBar = ({ title, value }) => (
  <div className="col-lg-4 col-md-6">
    <div className="cld-skill-box">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <span>{title}</span>
        <strong>{value}%</strong>
      </div>
      <div className="cld-progress">
        <div style={{ width: `${value}%` }} />
      </div>
    </div>
  </div>
);

export default CandidateLearningDashboard;