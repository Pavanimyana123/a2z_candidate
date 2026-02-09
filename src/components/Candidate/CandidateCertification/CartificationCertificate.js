import React from "react";
import CandidateSidebar from "../Layout/CandidateSidebar";
import Header from "../Layout/CandidateHeader";
import {
  FaFilter,
  FaPlus,
  FaDownload,
  FaExternalLinkAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaCalendarAlt
} from "react-icons/fa";

import "./CandidateCertificate.css";

const CandidateCertifications = () => {
  return (
    <div className="ccert-layout-wrapper">

      {/* Sidebar */}
      <CandidateSidebar />

      {/* Main */}
      <div className="ccert-main-wrapper">
        <Header />

        <div className="ccert-content-area container-fluid">

          {/* ================= PAGE HEADER ================= */}
          <div className="d-flex justify-content-between align-items-start mb-4">
            <div>
              <h3 className="ccert-title">Certifications</h3>
              <p className="ccert-sub">
                Manage your professional certifications and credentials
              </p>
            </div>

            <div className="d-flex gap-2">
              <button className="btn ccert-btn-outline">
                <FaFilter className="me-2" /> Filter
              </button>

              <button className="btn ccert-btn-primary">
                <FaPlus className="me-2" /> Add Certification
              </button>
            </div>
          </div>

          {/* ================= STATS ================= */}
          <div className="row g-4 mb-4">

            <StatCard
              icon={<FaCheckCircle />}
              value="2"
              label="Active Certifications"
              type="success"
            />

            <StatCard
              icon={<FaExclamationTriangle />}
              value="1"
              label="Expiring Soon"
              type="warning"
            />

            <StatCard
              icon={<FaCalendarAlt />}
              value="Mar 15"
              label="Next Renewal"
            />

          </div>

          {/* ================= FIRST IMAGE SECTION ================= */}
          <div className="ccert-card">
            <div className="mb-4">
              <h5 className="mb-1">Your Certifications</h5>
              <p className="ccert-muted">All your professional credentials</p>
            </div>

            {/* Card 1 */}
            <CertificationCard
              status="valid"
              title="API 510 Pressure Vessel Inspector"
              org="American Petroleum Institute"
              tag="Pressure Equipment"
              code="API-510-2023-78542"
              issued="01 Aug 2023"
              expiry="01 Aug 2026"
              remaining="173 days remaining"
            />

              <CertificationCard
              status="expired"
              title="CSWIP 3.1 Welding Inspector"
              org="TWI Certification Ltd"
              tag="Welding"
              code="CSWIP-3.1-2023-12847"
              issued="15 Mar 2023"
              expiry="15 Mar 2024"
              remaining="Expired"
            />

            <CertificationCard
              status="valid"
              title="NACE CIP Level 1"
              org="NACE International"
              tag="Coating"
              code="NACE-CIP1-2023-45621"
              issued="20 Jun 2023"
              expiry="20 Jun 2026"
              remaining="131 days remaining"
            />

          </div>


          {/* ================= RECOMMENDED CERTIFICATIONS ================= */}
<div className="ccert-card mt-4">

  <div className="mb-4">
    <h5 className="mb-1">Recommended Certifications</h5>
    <p className="ccert-muted">
      Based on your career progression
    </p>
  </div>

  <div className="row g-4">

    <RecommendedCard
      title="API 570 Piping Inspector"
      exam="March 2024"
      level="high"
    />

    <RecommendedCard
      title="CSWIP 3.2 Senior Welding Inspector"
      exam="April 2024"
      level="medium"
    />

    <RecommendedCard
      title="ASNT NDT Level II (UT)"
      exam="February 2024"
      level="high"
    />

    <RecommendedCard
      title="NACE CIP Level 2"
      exam="May 2024"
      level="medium"
    />

  </div>

</div>


        </div>
      </div>
    </div>
  );
};


/* ================= STAT CARD ================= */

const StatCard = ({ icon, value, label, type }) => (
  <div className="col-lg-4">
    <div className="ccert-stat-card">

      <div className={`ccert-stat-icon ${type}`}>
        {icon}
      </div>

      <div>
        <h4>{value}</h4>
        <p className="ccert-muted mb-0">{label}</p>
      </div>

    </div>
  </div>
);


/* ================= CERTIFICATION CARD ================= */

const CertificationCard = ({
  status,
  title,
  org,
  tag,
  code,
  issued,
  expiry,
  remaining
}) => (
  <div className={`ccert-cert-card ${status}`}>

    <div className="d-flex justify-content-between">

      <div className="d-flex gap-3">

        <div className="ccert-cert-icon">
          {status === "valid"
            ? <FaCheckCircle />
            : <FaExclamationTriangle />}
        </div>

        <div>
          <h6 className="mb-1">{title}</h6>
          <p className="ccert-muted mb-2">{org}</p>

          <div className="d-flex gap-2 align-items-center">
            <span className="ccert-tag">{tag}</span>
            <span className="ccert-code">{code}</span>
          </div>
        </div>

      </div>

      {/* Buttons */}
      <div className="d-flex gap-2">
        <button className="btn ccert-btn-outline">
          <FaDownload className="me-2" /> Certificate
        </button>

        <button className="btn ccert-btn-outline">
          <FaExternalLinkAlt className="me-2" /> Verify
        </button>
      </div>

    </div>

    {/* Dates */}
    <div className="row mt-3">

      <div className="col-md-4">
        <p className="ccert-muted small">Issue Date</p>
        <strong>{issued}</strong>
      </div>

      <div className="col-md-4">
        <p className="ccert-muted small">Expiry Date</p>
        <strong>{expiry}</strong>
      </div>

      <div className="col-md-4">
        <p className="ccert-muted small">Status</p>
        <strong className={status === "valid" ? "ccert-green" : "ccert-orange"}>
          {remaining}
        </strong>
      </div>

    </div>

    {/* Progress */}
    <div className="ccert-progress">
      <div className={`ccert-progress-fill ${status}`} />
    </div>

  </div>
);



const RecommendedCard = ({ title, exam, level }) => (
  <div className="col-md-6">
    <div className="ccert-recommend-card">

      <div className="d-flex justify-content-between mb-2">
        <h6 className="mb-0">{title}</h6>

        <span
          className={`ccert-badge ${
            level === "high" ? "high" : "medium"
          }`}
        >
          {level === "high" ? "High relevance" : "Medium relevance"}
        </span>
      </div>

      <p className="ccert-muted mb-3">
        Next exam: {exam}
      </p>

      <button className="btn ccert-recommend-btn w-100">
        Learn More
      </button>

    </div>
  </div>
);



export default CandidateCertifications;
