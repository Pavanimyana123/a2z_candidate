import React from "react";
import Sidebar from "../Layout/Sidebar";
import Header from "../Layout/Header";
import "./Candidates.css";
import { FaSearch, FaFilter, FaEllipsisH } from "react-icons/fa";

const Candidates = () => {
  return (
    <div className="ta-layout-wrapper">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Area */}
      <div className="ta-main-wrapper">
        {/* Header */}
        <Header />

        {/* Content */}
        <div className="ta-content-area">
          <div className="candidates-wrapper">

            {/* Page Header */}
            <div className="candidates-header">
              <div>
                <h2>Candidate Management</h2>
                <p>View and manage all training candidates</p>
              </div>

              <button className="btn btn-primary candidates-add-btn">
                Add Candidate
              </button>
            </div>

            {/* Filters */}
            {/* Filters */}
<div className="candidates-filters-box">
  <div className="candidates-filters">

    <div className="candidates-search">
      <FaSearch />
      <input type="text" placeholder="Search candidates..." />
    </div>

    <select className="candidates-select">
      <option>All Levels</option>
    </select>

    <select className="candidates-select">
      <option>All Status</option>
    </select>

    <button className="candidates-filter-btn">
      <FaFilter />
    </button>

  </div>
</div>


            {/* Table */}
            <div className="candidates-table-wrapper">
              <table className="table candidates-table">
                <thead>
                  <tr>
                    <th>Candidate Name</th>
                    <th>Level</th>
                    <th>Assigned Mentor</th>
                    <th>Department</th>
                    <th>Exposure Hours</th>
                    <th>Compliance</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  <CandidateRow
                    name="John Smith"
                    level="3"
                    mentor="Dr. James Wilson"
                    dept="Manufacturing"
                    hours="420h"
                    compliance="compliant"
                    status="active"
                  />

                  <CandidateRow
                    name="Sarah Johnson"
                    level="2"
                    mentor="Dr. Emily Brown"
                    dept="QA/QC"
                    hours="280h"
                    compliance="pending"
                    status="active"
                  />

                  <CandidateRow
                    name="Mike Chen"
                    level="0"
                    mentor="Dr. Robert Lee"
                    dept="Coating"
                    hours="45h"
                    compliance="compliant"
                    status="active"
                  />

                  <CandidateRow
                    name="Emily Davis"
                    level="4"
                    mentor="Dr. James Wilson"
                    dept="Testing"
                    hours="680h"
                    compliance="compliant"
                    status="active"
                  />

                  <CandidateRow
                    name="David Brown"
                    level="1"
                    mentor="Dr. Sarah Miller"
                    dept="Dispatch & Logistics"
                    hours="120h"
                    compliance="noncompliant"
                    status="blocked"
                  />
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

/* ---- Row Component ---- */

const CandidateRow = ({ name, level, mentor, dept, hours, compliance, status }) => (
  <tr>
    <td className="candidates-name">{name}</td>

    <td>
      <span className="candidates-level">{level}</span>
    </td>

    <td>{mentor}</td>
    <td>{dept}</td>
    <td>{hours}</td>

    <td>
      <span className={`candidates-pill ${compliance}`}>
        {compliance === "noncompliant"
          ? "Non-Compliant"
          : compliance.charAt(0).toUpperCase() + compliance.slice(1)}
      </span>
    </td>

    <td>
      <span className={`candidates-pill ${status}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    </td>

    <td>
      <FaEllipsisH className="candidates-action-icon" />
    </td>
  </tr>
);

export default Candidates;
