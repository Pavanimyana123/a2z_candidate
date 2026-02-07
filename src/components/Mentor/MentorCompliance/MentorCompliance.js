import React from "react";
import MentorSidebar from "../Layout/MentorSidebar";
import Header from "../Layout/MentorHeader";
import "./MentorCompliance.css";

const MentorCompliancePage = () => {

  const candidates = [
    {
      initials: "PS",
      name: "Priya Sharma",
      induction: "Valid",
      ppe: "Valid",
      medical: "Valid",
      incidents: 0,
      status: "Compliant",
    },
    {
      initials: "AP",
      name: "Arjun Patel",
      induction: "Expired",
      ppe: "Expired",
      medical: "Expired",
      incidents: 0,
      status: "Compliant",
    },
    {
      initials: "AR",
      name: "Ananya Reddy",
      induction: "Valid",
      ppe: "Valid",
      medical: "Valid",
      incidents: 0,
      status: "At Risk",
    },
    {
      initials: "VS",
      name: "Vikram Singh",
      induction: "Expired",
      ppe: "Expired",
      medical: "Expired",
      incidents: 0,
      status: "Compliant",
    },
  ];

  const renderBadge = (value) => (
    <span className={`tc-badge ${value === "Valid" ? "tc-valid" : "tc-expired"}`}>
      {value}
    </span>
  );

  return (
    <div className="tc-layout-wrapper">

      <MentorSidebar />

      <div className="tc-main-wrapper">

        <Header />

        <div className="tc-content-area">

          {/* Title */}
          <div className="tc-page-header">
            <h4>Compliance</h4>
            <p>Monitor safety certifications and compliance status</p>
          </div>

          {/* Stat Cards */}
          <div className="row g-4 tc-stat-row">

            <div className="col-md-3">
              <div className="tc-stat-card">
                <div className="tc-stat-icon tc-icon-green">✓</div>
                <div>
                  <h3 className="tc-green">4</h3>
                  <p>Fully Compliant</p>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="tc-stat-card">
                <div className="tc-stat-icon tc-icon-yellow">⚠</div>
                <div>
                  <h3 className="tc-yellow">1</h3>
                  <p>At Risk</p>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="tc-stat-card">
                <div className="tc-stat-icon tc-icon-red">✕</div>
                <div>
                  <h3 className="tc-red">1</h3>
                  <p>Non-Compliant</p>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="tc-stat-card">
                <div className="tc-stat-icon tc-icon-blue">!</div>
                <div>
                  <h3 className="tc-blue">3</h3>
                  <p>Expiring Soon</p>
                </div>
              </div>
            </div>

          </div>

          {/* Table */}
          <div className="tc-table-card">

            <div className="tc-table-header">
              Compliance Overview
            </div>

            <table className="table tc-table align-middle mb-0">
              <thead>
                <tr>
                  <th>CANDIDATE</th>
                  <th>SAFETY INDUCTION</th>
                  <th>PPE</th>
                  <th>MEDICAL</th>
                  <th>INCIDENTS</th>
                  <th>STATUS</th>
                </tr>
              </thead>

              <tbody>
                {candidates.map((item, i) => (
                  <tr key={i}>

                    <td>
                      <div className="tc-candidate">
                        <div className="tc-avatar">{item.initials}</div>
                        {item.name}
                      </div>
                    </td>

                    <td>{renderBadge(item.induction)}</td>
                    <td>{renderBadge(item.ppe)}</td>
                    <td>{renderBadge(item.medical)}</td>

                    <td className="tc-incidents">
                      {item.incidents} records
                    </td>

                    <td>
                      <span className={`tc-status 
                        ${item.status === "Compliant" ? "tc-status-green" : "tc-status-yellow"}`}>
                        {item.status}
                      </span>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>

          </div>

        </div>
      </div>
    </div>
  );
};

export default MentorCompliancePage;
