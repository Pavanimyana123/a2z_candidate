import React, { useState, useEffect } from "react";
import MentorSidebar from "../Layout/MentorSidebar";
import Header from "../Layout/MentorHeader";
import "./LearningModule.css";
import { FaBook, FaUserGraduate, FaPlus, FaCheck, FaTimes, FaSearch, FaFilter } from "react-icons/fa";
import Swal from "sweetalert2";
import { BASE_URL } from "../../../ApiUrl";

const LearningModule = () => {
  const [candidates, setCandidates] = useState([]);
  const [modules, setModules] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [mentor, setMentor] = useState(null);
  
  // Modal states
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [selectedModule, setSelectedModule] = useState("");

  useEffect(() => {
    const storedMentor = localStorage.getItem("mentor_user");
    
    if (storedMentor) {
      try {
        const parsedMentor = JSON.parse(storedMentor);
        const actualId = parsedMentor.user_id || parsedMentor.id || parsedMentor.pk;
        const mentorData = { ...parsedMentor, id: actualId };
        setMentor(mentorData);
        fetchInitialData(mentorData);
      } catch (error) {
        console.error("Error parsing mentor data:", error);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const fetchInitialData = async (mentorData) => {
    try {
      setLoading(true);
      
      const mentorId = mentorData?.id || mentorData?.pk || "";
      const mentorName = mentorData?.full_name || "";

      // Use either ID or Name to fetch candidates
      const candUrl = mentorId 
        ? `${BASE_URL}/api/mentor/mentor-candidates/?mentor_id=${mentorId}`
        : `${BASE_URL}/api/mentor/mentor-candidates/?mentor_name=${encodeURIComponent(mentorName)}`;

      const [candRes, modRes, moduleAssignRes] = await Promise.all([
        fetch(candUrl),
        fetch(`${BASE_URL}/api/mentor/learning-modules/`),
        fetch(`${BASE_URL}/api/mentor/module-assignments/?mentor_name=${encodeURIComponent(mentorName)}`)
      ]);

      const candData = await candRes.json();
      const modData = await modRes.json();
      const moduleAssignData = await moduleAssignRes.json();

      if (candData.status && candData.data) {
        setCandidates(candData.data);
      }

      if (modData.status) setModules(modData.data);
      
      if (moduleAssignData.status) {
        setAssignments(moduleAssignData.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      Swal.fire("Error", "Failed to load candidate data", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAssignModule = async (e) => {
    e.preventDefault();
    if (!selectedModule || !selectedCandidate || !mentor) return;

    try {
      const mentorId = mentor.id || mentor.pk;
      const response = await fetch(`${BASE_URL}/api/mentor/module-assignments/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidate: selectedCandidate.id,
          module: selectedModule,
          mentor: mentorId,
          status: "assigned"
        })
      });

      const result = await response.json();
      if (result.status) {
        Swal.fire("Success", "Module assigned successfully", "success");
        setShowAssignModal(false);
        fetchInitialData(mentor);
      } else {
        throw new Error(result.message || "Failed to assign module");
      }
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  const openAssignModal = (candidate) => {
    setSelectedCandidate(candidate);
    setShowAssignModal(true);
  };

  const filteredCandidates = candidates.filter(c => 
    c.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="ta-layout-wrapper">
      <MentorSidebar />
      <div className="ta-main-wrapper">
        <Header />
        <div className="ta-content-area">
          <div className="lm-container">
            <div className="lm-header mb-4">
              <div>
                <h4 className="fw-semibold">Learning Module Assignment</h4>
                <p className="text-muted">Assign learning modules to your candidates and track progress.</p>
              </div>
            </div>

            <div className="row g-4">
              {/* Candidates List */}
              <div className="col-lg-12">
                <div className="ta-card">
                  <div className="ta-card-header d-flex justify-content-between align-items-center">
                    <h6 className="mb-0">Your Candidates</h6>
                    <div className="lm-search">
                      <FaSearch />
                      <input 
                        type="text" 
                        placeholder="Search candidates..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="table-responsive">
                    <table className="table ta-table align-middle">
                      <thead>
                        <tr>
                          <th>Candidate</th>
                          <th>Department</th>
                          <th>Current Level</th>
                          <th>Assigned Modules</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading ? (
                          <tr><td colSpan="5" className="text-center">Loading...</td></tr>
                        ) : filteredCandidates.map(candidate => (
                          <tr key={candidate.id}>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="ta-avatar me-2">
                                  {candidate.full_name.charAt(0)}
                                </div>
                                {candidate.full_name}
                              </div>
                            </td>
                            <td>{candidate.department_name || "N/A"}</td>
                            <td><span className="ta-badge-level">{candidate.current_level_name || "L0"}</span></td>
                            <td>
                              {assignments.filter(a => a.candidate === candidate.id).length} Modules
                            </td>
                            <td>
                              <button 
                                className="btn btn-sm btn-primary"
                                onClick={() => openAssignModal(candidate)}
                              >
                                <FaPlus className="me-1" /> Assign Module
                              </button>
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
        </div>
      </div>

      {/* Assign Modal */}
      {showAssignModal && (
        <div className="modal fade show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Assign Module to {selectedCandidate?.full_name}</h5>
                <button type="button" className="btn-close" onClick={() => setShowAssignModal(false)}></button>
              </div>
              <form onSubmit={handleAssignModule}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Select Learning Module</label>
                    <select 
                      className="form-select" 
                      required 
                      value={selectedModule}
                      onChange={(e) => setSelectedModule(e.target.value)}
                    >
                      <option value="">Choose a module...</option>
                      {modules.map(mod => (
                        <option key={mod.id} value={mod.id}>
                          {mod.title} ({mod.department_name} - {mod.level_name})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowAssignModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Confirm Assignment</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningModule;