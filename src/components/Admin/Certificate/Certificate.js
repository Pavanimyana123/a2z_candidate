import React from "react";
import Sidebar from "../Layout/Sidebar";
import Header from "../Layout/Header";
import "./Certificate.css";
import { FaCheckCircle, FaClock, FaTimesCircle } from "react-icons/fa";

const Certifications = () => {
  return (
    <div className="ta-layout-wrapper">
      <Sidebar />

      <div className="ta-main-wrapper">
        <Header />

        <div className="ta-content-area">
          <div className="cert-wrapper">

            {/* =========================
                PAGE HEADER
            ========================== */}
            <div className="cert-header d-flex justify-content-between align-items-center">
              <div>
                <h2>Certifications</h2>
                <p>Manage and track candidate certifications</p>
              </div>
              <button className="btn btn-primary cert-issue-btn">
                + Issue Certificate
              </button>
            </div>

            {/* =========================
                TOP SUMMARY CARDS (IMAGE 1)
            ========================== */}
            <div className="row g-4 mt-2">
              <CertStat title="Total Certifications" value="214" />
              <CertStat title="Valid" value="180" icon={<FaCheckCircle />} green />
              <CertStat title="Expiring Soon" value="21" icon={<FaClock />} orange />
              <CertStat title="Expired" value="13" icon={<FaTimesCircle />} red />
            </div>

            {/* =========================
                CERTIFICATION TYPES (IMAGE 1)
            ========================== */}
            <div className="cert-card mt-4">
              <h5>Certification Types</h5>
              <p className="text-muted">Overview of certification distribution</p>

              <CertBar label="Basic Surveyor" total={85} valid={70} expiring={10} expired={5} />
              <CertBar label="Marine Equipment" total={42} valid={30} expiring={8} expired={4} />
              <CertBar label="QA/QC Specialist" total={38} valid={25} expiring={8} expired={5} />
              <CertBar label="Senior License" total={21} valid={15} expiring={4} expired={2} />
              <CertBar label="Safety Inspector" total={28} valid={22} expiring={4} expired={2} />

              <div className="cert-legend">
                <span className="valid" /> Valid
                <span className="expiring" /> Expiring
                <span className="expired" /> Expired
              </div>
            </div>

            {/* =========================
                RECENT CERTIFICATIONS (IMAGE 2)
            ========================== */}
            <div className="cert-card mt-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h5>Recent Certifications</h5>
                  <p className="text-muted">Latest certification updates</p>
                </div>
                <input
                  className="form-control cert-search"
                  placeholder="Search certifications..."
                />
              </div>

              <div className="table-responsive">
                <table className="table cert-table">
                  <thead>
                    <tr>
                      <th>Certification</th>
                      <th>Candidate</th>
                      <th>Level</th>
                      <th>Issue Date</th>
                      <th>Expiry Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <CertRow
                      name="Basic Surveyor Certification"
                      candidate="John Smith"
                      level="1"
                      issue="2023-06-15"
                      expiry="2024-06-15"
                      status="valid"
                    />
                    <CertRow
                      name="Marine Equipment Inspector"
                      candidate="Sarah Johnson"
                      level="2"
                      issue="2023-03-01"
                      expiry="2024-03-01"
                      status="expiring"
                    />
                    <CertRow
                      name="QA/QC Specialist"
                      candidate="Mike Chen"
                      level="2"
                      issue="2023-08-20"
                      expiry="2024-08-20"
                      status="valid"
                    />
                    <CertRow
                      name="Senior Surveyor License"
                      candidate="Emily Davis"
                      level="4"
                      issue="2022-12-01"
                      expiry="2023-12-01"
                      status="expired"
                    />
                    <CertRow
                      name="Safety Inspector Certification"
                      candidate="David Brown"
                      level="3"
                      issue="2023-09-10"
                      expiry="2024-09-10"
                      status="valid"
                    />
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================
   SUB COMPONENTS
========================= */

const CertStat = ({ title, value, icon, green, orange, red }) => (
  <div className="col-lg-3 col-md-6">
    <div className={`cert-stat ${green ? "green" : ""} ${orange ? "orange" : ""} ${red ? "red" : ""}`}>
      <div>
        <p>{title}</p>
        <h3>{value}</h3>
      </div>
      {icon && <div className="cert-stat-icon">{icon}</div>}
    </div>
  </div>
);

const CertBar = ({ label, total, valid, expiring, expired }) => (
  <div className="cert-bar-row">
    <span>{label}</span>
    <div className="cert-bar">
      <div className="valid" style={{ width: `${(valid / total) * 100}%` }} />
      <div className="expiring" style={{ width: `${(expiring / total) * 100}%` }} />
      <div className="expired" style={{ width: `${(expired / total) * 100}%` }} />
    </div>
    <strong>{total}</strong>
  </div>
);

const CertRow = ({ name, candidate, level, issue, expiry, status }) => (
  <tr>
    <td>{name}</td>
    <td>{candidate}</td>
    <td><span className="cert-level">{level}</span></td>
    <td>{issue}</td>
    <td>{expiry}</td>
    <td>
      <span className={`cert-status ${status}`}>{status}</span>
    </td>
    <td>
      <button className="btn btn-outline-primary btn-sm">View</button>
    </td>
  </tr>
);

export default Certifications;
