import React from "react";
import Sidebar from "../Layout/Sidebar";
import Header from "../Layout/Header";
import "./Reports.css";
import { FaUsers, FaChartLine, FaClock, FaBuilding } from "react-icons/fa";

const ReportsAnalytics = () => {
  return (
    <div className="ta-layout-wrapper">
      <Sidebar />

      <div className="ta-main-wrapper">
        <Header />

        <div className="ta-content-area">
          <div className="ra-wrapper">

            {/* ================= HEADER ================= */}
            <div className="ra-header d-flex justify-content-between align-items-center">
              <div>
                <h2>Reports & Analytics</h2>
                <p>Training program insights and performance metrics</p>
              </div>

              <div className="d-flex gap-2">
                <button className="btn btn-outline-secondary">Last 6 months</button>
                <button className="btn btn-outline-primary">Export</button>
              </div>
            </div>

            {/* ================= TOP STATS ================= */}
            <div className="row g-4 mt-2">
              <RaStat title="Total Candidates" value="262" icon={<FaUsers />} blue />
              <RaStat title="Promotions (6mo)" value="89" icon={<FaChartLine />} green />
              <RaStat title="Avg Exposure Hours" value="342h" icon={<FaClock />} orange />
              <RaStat title="Dept Completion Rate" value="80%" icon={<FaBuilding />} sky />
            </div>

            {/* ================= CHART SECTION ================= */}
            <div className="row g-4 mt-3">

              {/* DONUT */}
              <div className="col-lg-6">
                <div className="ra-card">
                  <h5>Candidate Distribution by Level</h5>
                  <p className="text-muted">
                    Current level breakdown across all candidates
                  </p>

                  <div className="ra-donut-wrapper">
                    <div className="ra-donut">
                      <div className="slice l0" />
                      <div className="slice l1" />
                      <div className="slice l2" />
                      <div className="slice l3" />
                      <div className="slice l4" />
                    </div>

                    <div className="ra-donut-labels">
                      <span className="l1">Level 1: 82</span>
                      <span className="l2">Level 2: 64</span>
                      <span className="l3">Level 3: 38</span>
                      <span className="l4">Level 4: 21</span>
                      <span className="l0">Level 0: 45</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* BARS */}
              <div className="col-lg-6">
                <div className="ra-card">
                  <h5>Department Completion Rates</h5>
                  <p className="text-muted">
                    Average rotation completion by department
                  </p>

                  <RaBar label="Manufacturing" value={78} />
                  <RaBar label="Coating" value={85} />
                  <RaBar label="QA/QC" value={72} />
                  <RaBar label="Testing" value={88} />
                  <RaBar label="Dispatch" value={92} />
                  <RaBar label="Marine" value={65} />
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

const RaStat = ({ title, value, icon, blue, green, orange, sky }) => (
  <div className="col-lg-3 col-md-6">
    <div className={`ra-stat ${blue ? "blue" : ""} ${green ? "green" : ""} ${orange ? "orange" : ""} ${sky ? "sky" : ""}`}>
      <div>
        <p>{title}</p>
        <h3>{value}</h3>
      </div>
      <div className="ra-stat-icon">{icon}</div>
    </div>
  </div>
);

const RaBar = ({ label, value }) => (
  <div className="ra-bar-row">
    <span>{label}</span>
    <div className="ra-bar">
      <div className="ra-bar-fill" style={{ width: `${value}%` }} />
    </div>
    <strong>{value}%</strong>
  </div>
);

export default ReportsAnalytics;
