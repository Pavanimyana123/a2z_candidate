import React from "react";
import CandidateSidebar from "../Layout/CandidateSidebar";
import Header from "../Layout/CandidateHeader";
import {
  FaClock,
  FaCheckCircle,
  FaCamera,
  FaPlus,
  FaSearch,
  FaEllipsisV,
  FaMapMarkerAlt,
  FaShip,
  FaCalendarAlt
} from "react-icons/fa";
import "./CandidateDigitalLogBox.css";

const CandidateDigitalLogbook = () => {
  return (
    <div className="ta-layout-wrapper">
      <CandidateSidebar />

      <div className="ta-main-wrapper">
        <Header />

        <div className="ta-content-area">
          <div className="container-fluid cdl-wrapper">

            {/* ================= HEADER ================= */}
            <div className="d-flex justify-content-between align-items-start mb-4">
              <div>
                <h3 className="cdl-title">Digital Logbook</h3>
                <p className="cdl-subtitle">
                  Record and track your field activities and evidence
                </p>
              </div>

              <button className="btn cdl-primary-btn">
                <FaPlus /> New Entry
              </button>
            </div>

            {/* ================= STATS ================= */}
            <div className="row g-4 mb-4">
              <StatCard icon={<FaClock />} value="58h" label="Total Hours" />
              <StatCard icon={<FaCheckCircle />} value="44h" label="Validated" success />
              <StatCard icon={<FaClock />} value="1" label="Pending Review" warning />
              <StatCard icon={<FaCamera />} value="10" label="Evidence Photos" info />
            </div>

            {/* ================= SEARCH & FILTER ================= */}
            <div className="row g-3 mb-4">
              <div className="col-lg-9">
                <div className="cdl-search">
                  <FaSearch />
                  <input placeholder="Search entries..." />
                </div>
              </div>
              <div className="col-lg-3">
                <select className="form-select cdl-filter">
                  <option>All Entries</option>
                  <option>Validated</option>
                  <option>Pending</option>
                </select>
              </div>
            </div>

            {/* ================= LOG ENTRIES ================= */}
            <LogEntry
              title="FPSO Harmony"
              status="validated"
              hours="8h"
              desc="Hull structural inspection - Phase 2. Conducted visual examination of hull plating and structural members in cargo tanks 1-4. Identified minor coating breakdown in tank 2."
              location="Jurong Shipyard"
              asset="Floating Production"
              dates="15 Jan 2024 - 15 Jan 2024"
              photos="3"
            />

            <LogEntry
              title="Platform Bravo"
              status="pending"
              hours="14h"
              desc="Coating inspection - Upper deck areas. Assessed coating condition on main deck, helideck, and process equipment supports."
              location="Singapore Offshore"
              asset="Fixed Platform"
              dates="12 Jan 2024 - 13 Jan 2024"
              photos="2"
            />

            <LogEntry
              title="Drilling Rig Delta"
              status="validated"
              hours="24h"
              desc="NDT examination - Leg structure including spud cans and leg-to-hull interface. MPI and UT thickness measurements performed."
              location="Batam Yard"
              asset="Jack-up Rig"
              dates="08 Jan 2024 - 10 Jan 2024"
              photos="1"
            />

            <LogEntry
              title="FSO Unity"
              status="validated"
              hours="12h"
              desc="Mooring system inspection including chain locker and fairlead examination. Documented chain wear patterns."
              location="Sembcorp Yard"
              asset="Floating Storage"
              dates="05 Jan 2024 - 06 Jan 2024"
              photos="4"
            />

          </div>
        </div>
      </div>
    </div>
  );
};

/* ================= SUB COMPONENTS ================= */

const StatCard = ({ icon, value, label, success, warning, info }) => (
  <div className="col-xl-3 col-md-6">
    <div className="cdl-stat-card">
      <div className={`cdl-stat-icon ${success ? "ok" : warning ? "warn" : info ? "info" : ""}`}>
        {icon}
      </div>
      <h3>{value}</h3>
      <p>{label}</p>
    </div>
  </div>
);

const LogEntry = ({ title, status, hours, desc, location, asset, dates, photos }) => (
  <div className="cdl-log-card">
    <div className="d-flex justify-content-between align-items-start">
      <div>
        <div className="d-flex align-items-center gap-2 mb-2">
          <h5 className="mb-0">{title}</h5>
          <span className={`cdl-badge ${status}`}>
            {status === "validated" ? "Validated" : "Pending"}
          </span>
        </div>
        <p className="cdl-desc">{desc}</p>

        <div className="cdl-meta">
          <span><FaMapMarkerAlt /> {location}</span>
          <span><FaShip /> {asset}</span>
          <span><FaCalendarAlt /> {dates}</span>
          <span><FaCamera /> {photos} photos</span>
        </div>
      </div>

      <div className="text-end">
        <h4>{hours}</h4>
        <span className="cdl-muted">exposure</span>
        <button className="cdl-menu">
          <FaEllipsisV />
        </button>
      </div>
    </div>
  </div>
);

export default CandidateDigitalLogbook;
