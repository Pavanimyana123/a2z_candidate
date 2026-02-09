import React from "react";
import CandidateSidebar from "../Layout/CandidateSidebar";
import Header from "../Layout/CandidateHeader";
import {
  FaCheckCircle,
  FaLock,
  FaChevronRight,
  FaExclamationCircle,
  FaUpload,
  FaUserFriends,
  FaBookOpen
} from "react-icons/fa";
import "./CandidateCompetency.css";

const CandidateCompetencyProgression = () => {
  return (
    <div className="ta-layout-wrapper">
      <CandidateSidebar />

      <div className="ta-main-wrapper">
        <Header />

        <div className="ta-content-area">
          <div className="container-fluid cp-wrapper">

            {/* ================================================= */}
            {/* IMAGE 1 — CURRENT LEVEL */}
            {/* ================================================= */}
            <div className="cp-section">
              <h3 className="cp-page-title">Competency Progression</h3>
              <p className="cp-page-subtitle">
                Track your journey from Aspirant to Principal
              </p>

              <div className="cp-current-card">
                <div className="cp-current-left">
                  <span className="cp-label">Current Level</span>
                  <h2>Level 2 - Developing</h2>
                  <p>Junior Surveyor</p>
                </div>

                <div className="cp-current-level">2</div>
              </div>

              <div className="cp-unlock-box">
                <h6>Current Level Unlocks</h6>
                <div className="cp-unlocks">
                  <span className="cp-pill">
                    <FaCheckCircle /> Independent inspection work
                  </span>
                  <span className="cp-pill">
                    <FaCheckCircle /> Certification sponsorship
                  </span>
                </div>
              </div>
            </div>

            {/* ================================================= */}
            {/* IMAGE 2 — PROGRESS TO LEVEL 3 */}
            {/* ================================================= */}
            <div className="cp-section">
              <div className="cp-progress-card">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h4>Progress to Level 3</h4>
                    <p className="cp-muted">Surveyor</p>
                  </div>

                  <div className="text-end">
                    <h3>40%</h3>
                    <span className="cp-muted">2/5 requirements</span>
                  </div>
                </div>

                <div className="cp-progress-bar">
                  <div className="cp-progress-fill" style={{ width: "40%" }} />
                </div>

                <div className="cp-req-list mt-4">
                  <Requirement
                    label="Complete all department rotations"
                    status="partial"
                    value="4/6"
                  />
                  <Requirement
                    label="Log 1,000+ exposure hours"
                    status="done"
                    value="1,847h"
                  />
                  <Requirement
                    label="Pass advanced assessment"
                    status="pending"
                    value="Not taken"
                  />
                  <Requirement
                    label="Obtain 3 certifications"
                    status="partial"
                    value="2/3"
                  />
                  <Requirement
                    label="Ethics score above 85%"
                    status="done"
                    value="92%"
                  />
                </div>

                <div className="cp-unlock-next">
                  <h6>What you'll unlock at Level 3</h6>
                  <div className="cp-unlocks">
                    <span className="cp-pill lock">
                      <FaLock /> Lead inspector role
                    </span>
                    <span className="cp-pill lock">
                      <FaLock /> SIT mentorship eligibility
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ================================================= */}
            {/* IMAGE 3 — COMPLETE JOURNEY OVERVIEW */}
            {/* ================================================= */}
            <div className="cp-section">
              <h4>Complete Journey Overview</h4>
              <p className="cp-muted">
                All levels from Aspirant to Principal
              </p>

              <JourneyItem
                level="0"
                title="Level 0 - Aspirant"
                role="Aspirant"
                done
              />
              <JourneyItem
                level="1"
                title="Level 1 - Foundation"
                role="Surveyor-in-Training (SIT)"
                done
              />
              <JourneyItem
                level="2"
                title="Level 2 - Developing"
                role="Junior Surveyor"
                current
              />
              <JourneyItem
                level="3"
                title="Level 3 - Competent"
                role="Surveyor"
                locked
              />
              <JourneyItem
                level="4"
                title="Level 4 - Proficient"
                role="Senior Surveyor / Lead"
                locked
              />
              <JourneyItem
                level="5"
                title="Level 5 - Expert"
                role="Principal / Authority"
                locked
              />
            </div>


              {/* ================================================= */}
            {/* IMAGE FROM PNG — ACTION CARDS */}
            {/* ================================================= */}
            <div className="cp-section">
              <div className="cp-action-cards-wrapper">
                <div className="cp-action-card">
                  <div className="cp-action-icon">
                    <FaBookOpen className="cp-action-icon-inner" />
                  </div>
                  <div className="cp-action-content">
                    <h5 className="cp-action-title">Complete Training</h5>
                    <p className="cp-action-subtitle">3 modules pending</p>
                  </div>
                  <div className="cp-action-badge">
                    <span className="cp-action-badge-text">Resume</span>
                    <FaChevronRight className="cp-action-badge-arrow" />
                  </div>
                </div>

                <div className="cp-action-card">
                  <div className="cp-action-icon">
                    <FaUpload className="cp-action-icon-inner" />
                  </div>
                  <div className="cp-action-content">
                    <h5 className="cp-action-title">Add Certification</h5>
                    <p className="cp-action-subtitle">Upload credentials</p>
                  </div>
                  <div className="cp-action-badge">
                    <span className="cp-action-badge-text">Upload</span>
                    <FaChevronRight className="cp-action-badge-arrow" />
                  </div>
                </div>

                <div className="cp-action-card">
                  <div className="cp-action-icon">
                    <FaUserFriends className="cp-action-icon-inner" />
                  </div>
                  <div className="cp-action-content">
                    <h5 className="cp-action-title">Find a Mentor</h5>
                    <p className="cp-action-subtitle">Connect with seniors</p>
                  </div>
                  <div className="cp-action-badge">
                    <span className="cp-action-badge-text">Connect</span>
                    <FaChevronRight className="cp-action-badge-arrow" />
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

/* ================= SUB COMPONENTS ================= */

const Requirement = ({ label, status, value }) => (
  <div className={`cp-req ${status}`}>
    <div className="d-flex align-items-center gap-2">
      {status === "done" ? (
        <FaCheckCircle className="cp-ok" />
      ) : (
        <FaExclamationCircle className="cp-warn" />
      )}
      <strong>{label}</strong>
    </div>
    <span className="cp-req-value">{value}</span>
  </div>
);

const JourneyItem = ({ level, title, role, done, current, locked }) => (
  <div className={`cp-journey ${done ? "done" : current ? "current" : locked ? "locked" : ""}`}>
    <div className="cp-journey-left">
      <div className="cp-journey-badge">
        {done ? <FaCheckCircle /> : locked ? <FaLock /> : level}
      </div>
      <div>
        <strong>{title}</strong>
        <p className="cp-muted mb-0">{role}</p>
      </div>
    </div>

    <div className="cp-journey-right">
      {current && <span className="cp-current-tag">Current</span>}
      {!locked && <FaChevronRight />}
    </div>
  </div>
);

export default CandidateCompetencyProgression;