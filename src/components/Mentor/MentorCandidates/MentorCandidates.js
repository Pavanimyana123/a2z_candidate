import React from "react";
import MentorSidebar from "../Layout/MentorSidebar";
import Header from "../Layout/MentorHeader";
import "./MentorCandidates.css";

const MentorCandidatesPage = () => {

  const candidates = [
    {
      name: "Priya Sharma",
      initials: "PS",
      level: "Level 2",
      department: "Hull Inspection",
      hours: "456h",
      status: "Compliant",
      promotion: "Eligible"
    },
    {
      name: "Arjun Patel",
      initials: "AP",
      level: "Level 1",
      department: "Machinery Survey",
      hours: "234h",
      status: "Compliant",
      promotion: "-"
    },
    {
      name: "Ananya Reddy",
      initials: "AR",
      level: "Level 3",
      department: "Safety Equipment",
      hours: "678h",
      status: "At Risk",
      promotion: "Eligible"
    },
    {
      name: "Vikram Singh",
      initials: "VS",
      level: "Level 0",
      department: "Electrical Systems",
      hours: "89h",
      status: "Compliant",
      promotion: "-"
    }
  ];

  return (
    <div className="ta-layout-wrapper">

      {/* Sidebar */}
      <MentorSidebar />

      {/* Main */}
      <div className="ta-main-wrapper">

        <Header />

        <div className="ta-content-area">
          <div className="ta-candidates-page">

            {/* Page Header */}
            <div className="mb-4">
              <h4 className="fw-semibold">Candidates</h4>
              <p className="text-muted">
                Manage and monitor all candidates under your supervision
              </p>
            </div>

            {/* Filters */}
            <div className="ta-candidates-filters mb-4 d-flex gap-3">

              <input
                type="text"
                className="form-control ta-candidates-search"
                placeholder="Search candidates..."
              />

              <select className="form-select ta-candidates-select">
                <option>All Levels</option>
              </select>

              <select className="form-select ta-candidates-select">
                <option>All Status</option>
              </select>

              <button className="btn ta-candidates-export ms-auto">
                ⬇ Export
              </button>

            </div>

            {/* Stat Cards */}
            <div className="row g-3 mb-4">

              <div className="col-md-3">
                <div className="ta-candidates-stat">
                  <h3>6</h3>
                  <p>Total Candidates</p>
                </div>
              </div>

              <div className="col-md-3">
                <div className="ta-candidates-stat ta-stat-green">
                  <h3>4</h3>
                  <p>Compliant</p>
                </div>
              </div>

              <div className="col-md-3">
                <div className="ta-candidates-stat ta-stat-orange">
                  <h3>1</h3>
                  <p>At Risk</p>
                </div>
              </div>

              <div className="col-md-3">
                <div className="ta-candidates-stat ta-stat-blue">
                  <h3>3</h3>
                  <p>Promotion Ready</p>
                </div>
              </div>

            </div>

            {/* Candidates Table */}
            <div className="ta-candidates-table-card">

              <table className="table align-middle mb-0">
                <thead>
                  <tr>
                    <th>CANDIDATE</th>
                    <th>LEVEL</th>
                    <th>DEPARTMENT</th>
                    <th>HOURS</th>
                    <th>STATUS</th>
                    <th>PROMOTION</th>
                  </tr>
                </thead>

                <tbody>
                  {candidates.map((item, index) => (
                    <tr key={index}>

                      {/* Candidate */}
                      <td>
                        <div className="ta-candidate-cell">
                          <div className="ta-candidate-avatar">
                            {item.initials}
                          </div>
                          {item.name}
                        </div>
                      </td>

                      {/* Level */}
                      <td>
                        <span className="ta-badge-level">
                          {item.level}
                        </span>
                      </td>

                      {/* Department */}
                      <td>{item.department}</td>

                      {/* Hours */}
                      <td className="fw-semibold">{item.hours}</td>

                      {/* Status */}
                      <td>
                        <span
                          className={
                            item.status === "Compliant"
                              ? "ta-status ta-status-green"
                              : "ta-status ta-status-orange"
                          }
                        >
                          {item.status}
                        </span>
                      </td>

                      {/* Promotion */}
                      <td>
                        {item.promotion === "Eligible" ? (
                          <span className="ta-status ta-status-green">
                            Eligible
                          </span>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>

                    </tr>
                  ))}
                </tbody>

              </table>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorCandidatesPage;
