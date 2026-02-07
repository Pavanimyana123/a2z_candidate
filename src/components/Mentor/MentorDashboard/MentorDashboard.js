import React from "react";
import MentorSidebar from "../Layout/MentorSidebar";
import Header from "../Layout/MentorHeader";
import "./MentorDashboard.css";

const MentorDashboardPage = () => {
  return (
    <div className="ta-layout-wrapper">

      {/* Sidebar */}
      <MentorSidebar />

      {/* Main Area */}
      <div className="ta-main-wrapper">

        {/* Header */}
        <Header />

        {/* Dashboard Content */}
        <div className="ta-content-area">
          <div className="ta-dashboard">

            {/* Heading */}
            <div className="ta-dashboard-header mb-4">
              <h4 className="fw-semibold">Mentor Dashboard</h4>
              <p className="text-muted mb-0">
                Welcome back, Suresh. Here's your supervision overview.
              </p>
            </div>

            {/* Stat Cards */}
            <div className="row g-3 mb-4">

              <div className="col-md-3">
                <div className="ta-stat-card">
                  <div>
                    <p className="ta-stat-title">Total Candidates</p>
                    <h3>6</h3>
                    <small className="text-muted">Under supervision</small>
                  </div>
                  <div className="ta-stat-icon ta-blue-bg">👥</div>
                </div>
              </div>

              <div className="col-md-3">
                <div className="ta-stat-card">
                  <div>
                    <p className="ta-stat-title">Pending Logbooks</p>
                    <h3>8</h3>
                    <small className="text-muted">Awaiting approval</small>
                  </div>
                  <div className="ta-stat-icon ta-yellow-bg">📘</div>
                </div>
              </div>

              <div className="col-md-3">
                <div className="ta-stat-card">
                  <div>
                    <p className="ta-stat-title">Evidence Reviews</p>
                    <h3>12</h3>
                    <small className="text-muted">Need attention</small>
                  </div>
                  <div className="ta-stat-icon ta-grey-bg">📋</div>
                </div>
              </div>

              <div className="col-md-3">
                <div className="ta-stat-card">
                  <div>
                    <p className="ta-stat-title">Promotion Ready</p>
                    <h3>3</h3>
                    <small className="text-muted">Eligible candidates</small>
                  </div>
                  <div className="ta-stat-icon ta-green-bg">🏅</div>
                </div>
              </div>

            </div>

            {/* Bottom Section */}
            <div className="row g-3">

              {/* Recent Candidates */}
              <div className="col-lg-8">
                <div className="ta-card">

                  <div className="ta-card-header">
                    <h6 className="mb-0">Recent Candidates</h6>
                    <span className="ta-view-all">View all →</span>
                  </div>

                  <table className="table ta-table align-middle">
                    <thead>
                      <tr>
                        <th>CANDIDATE</th>
                        <th>LEVEL</th>
                        <th>HOURS</th>
                        <th>STATUS</th>
                      </tr>
                    </thead>

                    <tbody>
                      <tr>
                        <td>
                          <div className="ta-candidate">
                            <div className="ta-candidate-avatar">PS</div>
                            Priya Sharma
                          </div>
                        </td>
                        <td><span className="ta-badge-level">Level 2</span></td>
                        <td>456h</td>
                        <td><span className="ta-status ta-status-green">Compliant</span></td>
                      </tr>

                      <tr>
                        <td>
                          <div className="ta-candidate">
                            <div className="ta-candidate-avatar">AP</div>
                            Arjun Patel
                          </div>
                        </td>
                        <td><span className="ta-badge-level">Level 1</span></td>
                        <td>234h</td>
                        <td><span className="ta-status ta-status-green">Compliant</span></td>
                      </tr>

                      <tr>
                        <td>
                          <div className="ta-candidate">
                            <div className="ta-candidate-avatar">AR</div>
                            Ananya Reddy
                          </div>
                        </td>
                        <td><span className="ta-badge-level">Level 3</span></td>
                        <td>678h</td>
                        <td><span className="ta-status ta-status-orange">At Risk</span></td>
                      </tr>

                      <tr>
                        <td>
                          <div className="ta-candidate">
                            <div className="ta-candidate-avatar">VS</div>
                            Vikram Singh
                          </div>
                        </td>
                        <td><span className="ta-badge-level">Level 0</span></td>
                        <td>89h</td>
                        <td><span className="ta-status ta-status-green">Compliant</span></td>
                      </tr>

                    </tbody>
                  </table>

                </div>
              </div>

              {/* Compliance Alerts */}
              <div className="col-lg-4">
                <div className="ta-card">
                  <h6 className="mb-3">Compliance Alerts</h6>

                  <div className="ta-alert ta-alert-danger">
                    Kavitha Nair - Medical certificate expired 3 days ago
                  </div>

                  <div className="ta-alert ta-alert-warning">
                    Ananya Reddy - PPE certification expiring in 7 days
                  </div>

                  <div className="ta-alert ta-alert-info">
                    Priya Sharma eligible for Level 3 promotion review
                  </div>

                </div>
              </div>

            </div>


            {/* Exposure + Quick Actions Section */}
<div className="row g-3 mt-1">

  {/* Exposure Hours Summary */}
  <div className="col-lg-8">
    <div className="ta-card">

      <h6 className="mb-3">Exposure Hours Summary</h6>

      {/* Bar Chart */}
      <div className="ta-chart-wrapper">

  <div className="ta-chart-bars">

    {[
      { day: "Mon", value: 80 },
      { day: "Tue", value: 70 },
      { day: "Wed", value: 90 },
      { day: "Thu", value: 65 },
      { day: "Fri", value: 60 },
      { day: "Sat", value: 25 },
      { day: "Sun", value: 20 }
    ].map((item, index) => (
      <div key={index} className="ta-bar-container">
        <div
          className="ta-bar"
          style={{ height: `${item.value}%` }}
        />
        <span>{item.day}</span>
      </div>
    ))}

  </div>

</div>


      {/* Summary Stats */}
      <div className="ta-exposure-stats">
        <div>
          <h4>24h</h4>
          <p>Today</p>
        </div>

        <div>
          <h4>156h</h4>
          <p>This Week</p>
        </div>

        <div>
          <h4>624h</h4>
          <p>This Month</p>
        </div>
      </div>

    </div>
  </div>


  {/* Quick Actions */}
  <div className="col-lg-4">
    <div className="ta-card">

      <h6 className="mb-3">Quick Actions</h6>

      <button className="ta-quick-btn">
        📘 Review Logbook Entries
      </button>

      <button className="ta-quick-btn">
        📄 Review Evidence
      </button>

      <button className="ta-quick-btn">
        ⏱ Check Compliance Status
      </button>

    </div>
  </div>

</div>


          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorDashboardPage;
