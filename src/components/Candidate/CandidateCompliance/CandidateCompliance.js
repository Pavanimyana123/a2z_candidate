import React from "react";
import CandidateSidebar from "../Layout/CandidateSidebar";
import Header from "../Layout/CandidateHeader";
import { FaShieldAlt, FaExclamationTriangle, FaCheck } from "react-icons/fa";
import "./CandidateCompliance.css";

const CandidateComplianceDashboard = () => {
  return (
    <div className="ccd-layout-wrapper">
      <CandidateSidebar />

      <div className="ccd-main-content">
        <Header />

        <div className="ccd-content-wrapper">
          <div className="container-fluid">

            {/* ================= HEADER ================= */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h2 className="ccd-title">Compliance & Safety</h2>
                <p className="ccd-subtitle">
                  Your compliance status and safety requirements
                </p>
              </div>

              <button className="btn ccd-review-btn">
                Schedule Review
              </button>
            </div>

            {/* ================= SUMMARY ================= */}
            <div className="row g-4 mb-4">

              {/* Compliance Score */}
              <div className="col-lg-6">
                <div className="ccd-card d-flex align-items-center">
                  <div className="ccd-circle">
                    86%
                  </div>
                  <div className="ms-4">
                    <h5>Compliance Score</h5>
                    <p className="ccd-muted">6 of 7 requirements met</p>
                    <div>
                      <span className="ccd-badge-success">6 Compliant</span>
                      <span className="ccd-badge-warning ms-2">1 Warning</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Deployable */}
              <div className="col-lg-3">
                <div className="ccd-card text-center">
                  <FaShieldAlt className="ccd-icon-success" />
                  <h4>Yes</h4>
                  <p className="ccd-muted">Deployable Status</p>
                </div>
              </div>

              {/* Attention */}
              <div className="col-lg-3">
                <div className="ccd-card text-center">
                  <FaExclamationTriangle className="ccd-icon-warning" />
                  <h4>1</h4>
                  <p className="ccd-muted">Items Need Attention</p>
                </div>
              </div>
            </div>

            {/* ================= MAIN SECTION ================= */}
            <div className="row g-4">

              {/* REQUIREMENTS */}
              <div className="col-lg-8">
                <div className="ccd-card">
                  <h4>Compliance Requirements</h4>
                  <p className="ccd-muted">
                    All your safety and compliance items
                  </p>

                  <Requirement status="success"
                    title="Platform Safety Certification"
                    subtitle="Valid until June 2025"
                    badge="Safety Induction"
                    expiry="Expires: 15 Jun 2025"
                    checked="Checked: 10 Jan 2024"
                  />

                  <Requirement status="success"
                    title="BOSIET Training"
                    subtitle="Offshore survival training complete"
                    badge="Safety Induction"
                    expiry="Expires: 20 Aug 2025"
                    checked="Checked: 10 Jan 2024"
                  />

                  <Requirement status="success"
                    title="Personal Protective Equipment"
                    subtitle="All equipment verified and in good condition"
                    badge="PPE"
                    checked="Checked: 15 Jan 2024"
                  />

                  <Requirement status="warning"
                    title="Offshore Medical Certificate"
                    subtitle="Expires in 60 days - schedule renewal"
                    badge="Medical"
                    expiry="Expires: 15 Mar 2024"
                    checked="Checked: 10 Jan 2024"
                  />

                  <Requirement status="success"
                    title="Fit for Duty Assessment"
                    badge="Medical"
                    expiry="Expires: 01 Dec 2024"
                    checked="Checked: 05 Jan 2024"
                  />

                  <Requirement status="success"
                    title="Code of Conduct Acknowledgment"
                    subtitle="Annual renewal not required until June 2024"
                    badge="Ethics"
                    checked="Checked: 15 Jun 2023"
                  />

                  <Requirement status="success"
                    title="Insurance Coverage"
                    badge="Documentation"
                    expiry="Expires: 31 Dec 2024"
                    checked="Checked: 01 Jan 2024"
                  />
                </div>
              </div>

              {/* RIGHT PANEL */}
              <div className="col-lg-4">
                {/* PPE */}
                <div className="ccd-card mb-4">
                  <h5>PPE Checklist</h5>
                  <p className="ccd-muted">Personal Protective Equipment</p>

                  <PPE label="Safety Helmet" />
                  <PPE label="Safety Glasses" />
                  <PPE label="Safety Boots" />
                  <PPE label="Hi-Vis Vest" />
                  <PPE label="Gloves" />
                  <PPE label="Hearing Protection" />
                  <PPE label="Coveralls" warning />
                  <PPE label="Fall Protection Harness" />

                  <div className="ccd-progress">
                    <div className="ccd-progress-fill" />
                  </div>

                  <p className="text-end small">Completion 7/8</p>
                </div>

                {/* Quick Actions */}
                <div className="ccd-card">
                  <h5>Quick Actions</h5>
                  <button className="ccd-action-btn">Report Incident</button>
                  <button className="ccd-action-btn">Book Medical</button>
                  <button className="ccd-action-btn">Update PPE</button>
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

const Requirement = ({ title, subtitle, badge, expiry, checked, status }) => (
  <div className={`ccd-req ${status}`}>
    <div>
      <strong>{title}</strong>
      {badge && <span className="ccd-small-badge">{badge}</span>}
      {subtitle && <p className="ccd-muted">{subtitle}</p>}
    </div>
    <div className="text-end">
      {expiry && <p className="ccd-expiry">{expiry}</p>}
      {checked && <p className="ccd-muted small">{checked}</p>}
    </div>
  </div>
);

const PPE = ({ label, warning }) => (
  <div className={`ccd-ppe ${warning ? "warning" : ""}`}>
    <span>{label}</span>
    {warning ? "⚠" : <FaCheck />}
  </div>
);

export default CandidateComplianceDashboard;