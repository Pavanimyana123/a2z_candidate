import React from "react";
import Sidebar from "../Layout/Sidebar";
import Header from "../Layout/Header";
import "./DepartmentManagement.css";
import { FaPlus, FaEdit, FaClock, FaUsers } from "react-icons/fa";

const DepartmentManagement = () => {
  return (
    <div className="ta-layout-wrapper">
      <Sidebar />

      <div className="ta-main-wrapper">
        <Header />

        <div className="ta-content-area">
          <div className="dm-wrapper">

            {/* Header */}
            <div className="dm-header">
              <div>
                <h2>Department Management</h2>
                <p>Configure department rotation requirements and settings</p>
              </div>

              <button className="btn btn-primary dm-add-btn">
                <FaPlus /> Add Department
              </button>
            </div>

            {/* Stats */}
            <div className="row g-4 mb-4">
              <StatBox title="Total Departments" value="6" />
              <StatBox title="Active Rotations" value="55" />
              <StatBox title="Total Required Hours" value="880h" />
              <StatBox title="Candidates in Rotation" value="209" />
            </div>

            {/* Department Cards */}
            <div className="row g-4">
              <DeptCard
                title="Manufacturing"
                desc="Core production processes, assembly lines, and manufacturing quality control procedures"
                min="4 weeks"
                hours="160h"
                rotations="12"
                candidates="45"
              />

              <DeptCard
                title="Coating"
                desc="Surface treatment, coating application, and finishing processes for marine equipment"
                min="3 weeks"
                hours="120h"
                rotations="8"
                candidates="32"
              />

              <DeptCard
                title="QA/QC"
                desc="Quality assurance and quality control processes, inspection methodologies, and standards compliance"
                min="4 weeks"
                hours="160h"
                rotations="10"
                candidates="38"
              />

              <DeptCard
                title="Testing"
                desc="Equipment testing, calibration procedures, and performance validation"
                min="3 weeks"
                hours="120h"
                rotations="6"
                candidates="24"
              />

              <DeptCard
                title="Dispatch & Logistics"
                desc="Shipping coordination, documentation, and logistics management for marine assets"
                min="2 weeks"
                hours="80h"
                rotations="4"
                candidates="18"
              />

              <DeptCard
                title="Marine Assets"
                desc="Vessel inspection, marine equipment surveys, and offshore asset management"
                min="6 weeks"
                hours="240h"
                rotations="15"
                candidates="52"
              />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------- Components ---------- */

const StatBox = ({ title, value }) => (
  <div className="col-lg-3 col-md-6">
    <div className="dm-stat-card">
      <p>{title}</p>
      <h3>{value}</h3>
    </div>
  </div>
);

const DeptCard = ({ title, desc, min, hours, rotations, candidates }) => (
  <div className="col-lg-4 col-md-6">
    <div className="dm-card">

      <div className="dm-card-header">
        <div className="dm-icon">🏢</div>
           <h5>{title}</h5>
        <FaEdit className="dm-edit" />
      </div>

      <p className="dm-desc">{desc}</p>

     <div className="dm-info">

  <div className="dm-item">
    <div className="dm-label">
      <FaClock />
      <span>Min Duration</span>
    </div>
    <strong>{min}</strong>
  </div>

  <div className="dm-item">
    <div className="dm-label">
      <FaClock />
      <span>Required Hours</span>
    </div>
    <strong>{hours}</strong>
  </div>

</div>


<div className="dm-info">

  <div className="dm-item">
    <div className="dm-label">
      <FaUsers />
      <span>Active Rotations</span>
    </div>
    <strong>{rotations}</strong>
  </div>

  <div className="dm-item">
    <div className="dm-label">
      <FaUsers />
      <span>Total Candidates</span>
    </div>
    <strong>{candidates}</strong>
  </div>

</div>


    </div>
  </div>
);

export default DepartmentManagement;
