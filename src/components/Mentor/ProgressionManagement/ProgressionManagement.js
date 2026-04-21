import React, { useState } from "react";
import MentorSidebar from "../Layout/MentorSidebar";
import Header from "../Layout/MentorHeader";
import {
  FaEye,
  FaEnvelope,
  FaPhone,
  FaUserGraduate,
  FaBuilding,
  FaLevelUpAlt
} from "react-icons/fa";
import Swal from "sweetalert2";

const MentorProgressionPage = () => {

  // ✅ Static Candidates
  const [candidates] = useState([
    {
      id: 1,
      full_name: "Rahul Sharma",
      email: "rahul@gmail.com",
      phone_number: "9876543210"
    },
    {
      id: 2,
      full_name: "Priya Reddy",
      email: "priya@gmail.com",
      phone_number: "9123456780"
    }
  ]);

  // ✅ Static Departments
  const [departments] = useState([
    { id: 1, name: "IT" },
    { id: 2, name: "HR" }
  ]);

  // ✅ Static Progression Data
  const [progressions] = useState([
    {
      id: 101,
      candidate: 1,
      department: 1,
      department_name: "IT",
      current_level_name: "Level 1",
      target_level_name: "Level 3",
      progress_percentage: 40
    },
    {
      id: 102,
      candidate: 2,
      department: 2,
      department_name: "HR",
      current_level_name: "Level 2",
      target_level_name: "Level 4",
      progress_percentage: 75
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");

  // ✅ Helper: get candidate
  const getCandidateDetails = (id) => {
    return candidates.find((c) => c.id === id);
  };

  // ✅ Filter
  const filteredProgressions = progressions.filter((item) => {
    const candidate = getCandidateDetails(item.candidate);
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      searchTerm === "" ||
      candidate?.full_name?.toLowerCase().includes(search) ||
      candidate?.email?.toLowerCase().includes(search);

    const matchesDepartment =
      departmentFilter === "all" ||
      String(item.department) === String(departmentFilter);

    return matchesSearch && matchesDepartment;
  });

  return (
    <div className="ta-layout-wrapper">
      <MentorSidebar />

      <div className="ta-main-wrapper">
        <Header />

        <div className="ta-content-area">
          <div className="container-fluid">

            {/* Header */}
            <div className="mb-4">
              <h4>Progression Management (Static)</h4>
              <p className="text-muted">
                Demo data for UI testing
              </p>
            </div>

            {/* Filters */}
            <div className="row mb-3">
              <div className="col-md-5">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search candidate..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="col-md-3">
                <select
                  className="form-select"
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                >
                  <option value="all">All Departments</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>Candidate</th>
                    <th>Contact</th>
                    <th>Department</th>
                    <th>Current Level</th>
                    <th>Target Level</th>
                    <th>Progress</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredProgressions.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center text-muted">
                        No data found
                      </td>
                    </tr>
                  ) : (
                    filteredProgressions.map((item) => {
                      const candidate = getCandidateDetails(item.candidate);

                      return (
                        <tr key={item.id}>
                          {/* Candidate */}
                          <td>
                            <div className="d-flex align-items-center">
                              <FaUserGraduate className="me-2" />
                              {candidate?.full_name}
                            </div>
                          </td>

                          {/* Contact */}
                          <td>
                            <div>
                              <div>
                                <FaEnvelope size={12} /> {candidate?.email}
                              </div>
                              <div>
                                <FaPhone size={12} /> {candidate?.phone_number}
                              </div>
                            </div>
                          </td>

                          {/* Department */}
                          <td>
                            <FaBuilding size={12} /> {item.department_name}
                          </td>

                          {/* Current Level */}
                          <td>
                            <FaLevelUpAlt size={12} /> {item.current_level_name}
                          </td>

                          {/* Target Level */}
                          <td>
                            <FaLevelUpAlt size={12} /> {item.target_level_name}
                          </td>

                          {/* Progress */}
                          <td style={{ width: "150px" }}>
                            <div className="progress">
                              <div
                                className="progress-bar"
                                style={{
                                  width: `${item.progress_percentage}%`
                                }}
                              >
                                {item.progress_percentage}%
                              </div>
                            </div>
                          </td>

                          {/* Action */}
                          <td>
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() =>
                                Swal.fire({
                                  title: "Progress Details",
                                  html: `
                                    <p><b>Candidate:</b> ${candidate?.full_name}</p>
                                    <p><b>Current Level:</b> ${item.current_level_name}</p>
                                    <p><b>Target Level:</b> ${item.target_level_name}</p>
                                    <p><b>Progress:</b> ${item.progress_percentage}%</p>
                                  `
                                })
                              }
                            >
                              <FaEye />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorProgressionPage;