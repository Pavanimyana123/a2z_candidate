import React from "react";
import CandidateSidebar from "../Layout/CandidateSidebar";
import Header from "../Layout/CandidateHeader";
import {
  FaClock,
  FaCamera,
  FaCertificate,
  FaShieldAlt,
  FaPlus,
  FaUpload,
  FaCheck
} from "react-icons/fa";
import "./CandidateDashboard.css";

const CandidateDashboard = () => {
  return (
    <div className="ta-layout-wrapper">
      {/* Sidebar */}
      <CandidateSidebar />

      {/* Main Area */}
      <div className="ta-main-wrapper">
        {/* Header */}
        <Header />

        {/* Dashboard Content */}
        <div className="ta-content-area">
          <div className="container-fluid training-dashboard">
            {/* ================= HEADER ================= */}
            <div className="d-flex justify-content-between align-items-start mb-4">
              <div>
                <h2 className="td-title">Good morning, James</h2>
                <p className="td-subtitle">
                  Junior Surveyor • Level 2 - Developing
                </p>
              </div>

              <div className="td-demo-box">
                <span className="me-2">Demo Mode:</span>
                <select className="form-select td-demo-select">
                  <option>Junior Surveyor</option>
                </select>
              </div>
            </div>

            {/* ================= STATS ================= */}
            <div className="row g-4 mb-4">
              <StatCard title="Total Exposure Hours" value="1,847" desc="Logged field time" change="+12%" icon={<FaClock />} />
              <StatCard title="Evidence Uploads" value="127" desc="Photos & documents" change="+8%" icon={<FaCamera />} />
              <StatCard title="Active Certifications" value="2" desc="1 expiring soon" icon={<FaCertificate />} />
              <StatCard title="Compliance Score" value="94%" desc="All requirements met" change="+2%" icon={<FaShieldAlt />} />
            </div>

            {/* ================= COMPETENCY + ACTIONS ================= */}
            <div className="row g-4">
              <div className="col-lg-8">
                <div className="td-card">
                  <h5 className="mb-1">Competency Level</h5>
                  <p className="td-muted">Your progression journey</p>

                  <div className="td-progress-line">
                    {["Aspirant", "SIT", "Junior", "Surveyor", "Senior", "Principal"].map(
                      (item, index) => (
                        <div key={index} className={`td-progress-step ${index <= 2 ? "active" : ""}`}>
                          <div className="td-step-circle">
                            {index < 2 ? <FaCheck /> : index === 2 ? "2" : "🔒"}
                          </div>
                          <span>{item}</span>
                        </div>
                      )
                    )}
                  </div>

                  <div className="td-level-box">
                    <strong>Level 2 - Developing</strong>
                    <p className="mb-0">
                      Complete required evidence and assessments to unlock Level 3
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-lg-4">
                <div className="td-card">
                  <h5 className="mb-1">Quick Actions</h5>
                  <p className="td-muted">Common tasks</p>

                  <div className="qa-grid qa-grid-2">
                    {/* New Logbook */}
                    <div className="qa-box qa-primary">
                      <div className="qa-icon dark">
                        <FaPlus />
                      </div>
                      <h6>New Logbook Entry</h6>
                      <p>Record field activity</p>
                      <span className="qa-arrow">→</span>
                    </div>

                    {/* Upload Evidence */}
                    <div className="qa-box">
                      <div className="qa-icon">
                        <FaUpload />
                      </div>
                      <h6>Upload Evidence</h6>
                      <p>Add photos & documents</p>
                      <span className="qa-arrow">→</span>
                    </div>

                    {/* View Learning */}
                    <div className="qa-box">
                      <div className="qa-icon">📘</div>
                      <h6>View Learning</h6>
                      <p>Continue training</p>
                      <span className="qa-arrow">→</span>
                    </div>

                    {/* Compliance */}
                    <div className="qa-box">
                      <div className="qa-icon">📄</div>
                      <h6>Check Compliance</h6>
                      <p>Review status</p>
                      <span className="qa-arrow">→</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ================= BELOW SECTION (IMAGE MATCH) ================= */}
            <div className="row g-4 mt-3 cd-section">
              {/* Recent Logbook */}
              <div className="col-lg-8">
                <div className="cd-card">
                  <div className="d-flex justify-content-between mb-3">
                    <div>
                      <h5 className="mb-0">Recent Logbook Entries</h5>
                      <p className="cd-muted">Your latest field activities</p>
                    </div>
                    <button className="btn btn-outline-secondary cd-btn">View All →</button>
                  </div>

                  <LogItem title="FPSO Harmony" status="Validated" work="Hull structural inspection - Phase 2"
                    meta="Jurong Shipyard • Floating Production • 15 Jan 2024" hours="8h" files="3" />

                  <LogItem title="Platform Bravo" status="Pending" work="Coating inspection - Upper deck"
                    meta="Singapore Offshore • Fixed Platform • 12 Jan 2024" hours="14h" files="2" />

                  <LogItem title="Drilling Rig Delta" status="Validated" work="NDT examination - Leg structure"
                    meta="Batam Yard • Jack-up Rig • 08 Jan 2024" hours="24h" files="1" />
                </div>
              </div>

              {/* Right Column */}
              <div className="col-lg-4">
                <div className="cd-card">
                  <div className="d-flex justify-content-between mb-3">
                    <div>
                      <h5 className="mb-0">Certifications</h5>
                      <p className="cd-muted">2 active certifications</p>
                    </div>
                    <button className="btn btn-outline-secondary cd-btn">Manage →</button>
                  </div>

                  <CertCard title="API 510 Pressure Vessel Inspector" org="American Petroleum Institute"
                    status="173 days left" type="success" issued="01 Aug 2023" expires="01 Aug 2026" />

                  <CertCard title="CSWIP 3.1 Welding Inspector" org="TWI Certification Ltd"
                    status="Expired" type="warning" issued="15 Mar 2023" expires="15 Mar 2024" />
                </div>
              </div>
            </div>

            {/* ================= COMPETENCY ASSESSMENT + ROTATION ================= */}
            <div className="row g-4 mt-4">
              {/* Competency Assessment */}
              <div className="col-lg-6">
                <div className="ca-card">
                  <h5 className="mb-1">Competency Assessment</h5>
                  <p className="ca-muted">Cross-cutting skill evaluation</p>

                  <div className="ca-radar-wrapper">
                    <div className="ca-radar">
                      <div className="ca-radar-grid"></div>
                      <div className="ca-radar-fill"></div>

                      <span className="ca-label top">Technical</span>
                      <span className="ca-label right">Field Discipline</span>
                      <span className="ca-label bottom-right">Documentation</span>
                      <span className="ca-label bottom-left">Ethics</span>
                      <span className="ca-label left">Communication</span>
                    </div>
                  </div>

                  {/* Scores */}
                  <div className="row g-3 mt-3">
                    <Score label="Technical" value="78%" />
                    <Score label="Field Discipline" value="85%" good />
                    <Score label="Documentation" value="72%" />
                    <Score label="Ethics" value="92%" good />
                    <Score label="Communication" value="68%" />
                  </div>
                </div>
              </div>

              {/* Departmental Rotation */}
              <div className="col-lg-6">
                <div className="dr-card">
                  <div className="d-flex align-items-start gap-3 mb-3">
                    <div className="dr-icon">📋</div>
                    <div>
                      <h5 className="mb-0">Departmental Rotation</h5>
                      <p className="dr-muted">2 of 6 departments completed</p>
                    </div>
                  </div>

                  <div className="dr-progress">
                    <div className="dr-progress-fill" />
                  </div>

                  <div className="dr-list mt-4">
                    <RotationItem title="Manufacturing" score="88%" done />
                    <RotationItem title="Coating" score="92%" done />
                    <RotationItem title="QA/QC" active />
                    <RotationItem title="Testing" index="4" />
                    <RotationItem title="Dispatch & Logistics" index="5" />
                    <RotationItem title="Marine Assets" index="6" />
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

const StatCard = ({ title, value, desc, change, icon }) => (
  <div className="col-xl-3 col-md-6">
    <div className="td-stat-card">
      <div className="td-stat-top">
        <h6>{title}</h6>
        <div className="td-icon-box">{icon}</div>
      </div>
      <h3>{value}</h3>
      <p className="td-muted">{desc}</p>
      {change && <span className="td-positive">{change} vs last month</span>}
    </div>
  </div>
);

const LogItem = ({ title, status, work, meta, hours, files }) => (
  <div className="cd-log">
    <div>
      <div className="d-flex gap-2 align-items-center mb-1">
        <strong>{title}</strong>
        <span className={`cd-badge ${status === "Validated" ? "ok" : "pending"}`}>{status}</span>
      </div>
      <p className="mb-1">{work}</p>
      <p className="cd-muted small">{meta}</p>
    </div>
    <div className="text-end">
      <strong>{hours}</strong>
      <p className="cd-muted small">exposure</p>
      <p className="cd-muted small">📷 {files}</p>
    </div>
  </div>
);

const CertCard = ({ title, org, status, type, issued, expires }) => (
  <div className="cd-cert">
    <div className="d-flex justify-content-between">
      <strong>{title}</strong>
      <span className={type === "success" ? "cd-green" : "cd-orange"}>{status}</span>
    </div>
    <p className="cd-muted">{org}</p>
    <div className="cd-bar">
      <div className={`cd-fill ${type}`} />
    </div>
    <div className="cd-dates">
      <span>Issued: {issued}</span>
      <span>Expires: {expires}</span>
    </div>
  </div>
);

const Score = ({ label, value, good }) => (
  <div className="col-md-6">
    <div className="ca-score">
      <span>{label}</span>
      <strong className={good ? "ca-good" : "ca-warn"}>{value}</strong>
    </div>
  </div>
);

const RotationItem = ({ title, score, done, active, index }) => (
  <div className={`dr-item ${active ? "active" : ""}`}>
    <div className="d-flex align-items-center gap-3">
      <div className={`dr-badge ${done ? "done" : active ? "active" : ""}`}>
        {done ? "✓" : index}
      </div>
      <div>
        <strong>{title}</strong>
        {score && <p className="dr-muted">Evaluation: {score}</p>}
        {active && <p className="dr-active">Currently active</p>}
      </div>
    </div>
    {done && <span className="dr-check">✓</span>}
  </div>
);

export default CandidateDashboard;