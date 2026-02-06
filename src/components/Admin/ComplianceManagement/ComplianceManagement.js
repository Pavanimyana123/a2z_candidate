import React from "react";
import Sidebar from "../Layout/Sidebar";
import Header from "../Layout/Header";
import "./ComplianceManagement.css";
import {
  FaShieldAlt,
  FaHeartbeat,
  FaExclamationTriangle,
  FaBalanceScale,
  FaCog,
} from "react-icons/fa";

const ComplianceManagement = () => {
  return (
    <div className="ta-layout-wrapper">
      <Sidebar />

      <div className="ta-main-wrapper">
        <Header />

        <div className="ta-content-area compliance-page">
          {/* PAGE HEADER */}
          <div className="compliance-header">
            <div>
              <h2>Compliance Management</h2>
              <p>Configure compliance rules and track violations</p>
            </div>

            <button className="btn btn-primary compliance-config-btn">
              <FaCog /> Configure Rules
            </button>
          </div>

          {/* ===== FIRST IMAGE : SUMMARY CARDS ===== */}
          <div className="row g-4">
            <SummaryCard
              title="Safety Induction"
              value="8"
              icon={<FaShieldAlt />}
            />
            <SummaryCard
              title="Medical Validity"
              value="5"
              icon={<FaHeartbeat />}
            />
            <SummaryCard
              title="Incident Tracking"
              value="2"
              icon={<FaExclamationTriangle />}
            />
            <SummaryCard
              title="Ethics Violations"
              value="1"
              icon={<FaBalanceScale />}
            />
          </div>

          {/* ===== SECOND IMAGE : RULE CONFIGURATION ===== */}
          <div className="row g-4 mt-1">
            <RuleCard
              title="Safety Induction"
              icon={<FaShieldAlt />}
              rows={[
                ["Validity Period", "12", "months"],
                ["Renewal Warning", "30", "days before"],
                ["Grace Period", "7", "days"],
              ]}
            />

            <RuleCard
              title="Medical Validity"
              icon={<FaHeartbeat />}
              rows={[
                ["Certificate Validity", "24", "months"],
                ["Renewal Warning", "60", "days before"],
                ["Mandatory Check Interval", "6", "months"],
              ]}
            />

            <RuleCard
              title="Incident Tracking"
              icon={<FaExclamationTriangle />}
              rows={[
                ["Report Deadline", "24", "hours"],
                ["Investigation Period", "7", "days"],
                ["Review Cycle", "30", "days"],
              ]}
            />

            <RuleCard
              title="Ethics Violations"
              icon={<FaBalanceScale />}
              rows={[
                ["Review Period", "14", "days"],
                ["Appeal Window", "30", "days"],
                ["Record Retention", "5", "years"],
              ]}
            />
          </div>

          {/* ===== RECENT INCIDENTS TABLE ===== */}
          <div className="compliance-card mt-4">
            <h4>Recent Incidents</h4>
            <p className="subtext">Track and manage compliance incidents</p>

            <table className="table compliance-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Candidate</th>
                  <th>Date</th>
                  <th>Severity</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <IncidentRow
                  type="Safety Violation"
                  name="John Smith"
                  date="2024-01-28"
                  severity="medium"
                  status="investigating"
                />
                <IncidentRow
                  type="Medical Expiry"
                  name="Sarah Johnson"
                  date="2024-01-25"
                  severity="high"
                  status="open"
                />
                <IncidentRow
                  type="Documentation Issue"
                  name="Mike Chen"
                  date="2024-01-20"
                  severity="low"
                  status="resolved"
                />
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------- SUB COMPONENTS ---------- */

const SummaryCard = ({ title, value, icon }) => (
  <div className="col-lg-3 col-md-6">
    <div className="compliance-card summary-card">
      <div className="summary-icon">{icon}</div>
      <div>
        <p>{title}</p>
        <h3>{value}</h3>
        <span>Active Alerts</span>
      </div>
    </div>
  </div>
);

const RuleCard = ({ title, icon, rows }) => (
  <div className="col-lg-6">
    <div className="compliance-card rule-card">
      <div className="rule-header">
        <div className="rule-icon">{icon}</div>
        <div>
          <h5>{title}</h5>
          <p>Configure validity and threshold rules</p>
        </div>
      </div>

      {rows.map(([label, value, unit]) => (
        <div className="rule-row" key={label}>
          <span>{label}</span>
          <div className="rule-input">
            <strong>{value}</strong>
            <small>{unit}</small>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const IncidentRow = ({ type, name, date, severity, status }) => (
  <tr>
    <td>{type}</td>
    <td>{name}</td>
    <td>{date}</td>
    <td>
      <span className={`pill severity ${severity}`}>{severity}</span>
    </td>
    <td>
      <span className={`pill status ${status}`}>{status}</span>
    </td>
    <td>
      <button className="btn btn-outline-primary btn-sm">View</button>
    </td>
  </tr>
);

export default ComplianceManagement;
