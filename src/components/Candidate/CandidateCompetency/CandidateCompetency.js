import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CandidateSidebar from "../Layout/CandidateSidebar";
import Header from "../Layout/CandidateHeader";
import {
  FaCheckCircle,
  FaLock,
  FaChevronRight,
  FaExclamationCircle,
  FaUpload,
  FaUserFriends,
  FaBookOpen,
  FaPlusCircle,
  FaSpinner
} from "react-icons/fa";
import { BASE_URL } from "../../../ApiUrl";
import "./CandidateCompetency.css";

const CandidateCompetencyProgression = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [competencies, setCompetencies] = useState([]);
  const [levels, setLevels] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [currentCompetency, setCurrentCompetency] = useState(null);
  const [currentLevelData, setCurrentLevelData] = useState(null);
  const [currentDepartmentData, setCurrentDepartmentData] = useState(null);
  const [error, setError] = useState(null);

  // Get candidate user_id from localStorage
  const getCandidateId = () => {
    try {
      const candidateUser = localStorage.getItem('candidate_user');
      if (candidateUser) {
        const parsed = JSON.parse(candidateUser);
        return parsed.user_id || '';
      }
    } catch (error) {
      console.error('Error parsing candidate_user from localStorage:', error);
    }
    return '';
  };

  const candidateId = getCandidateId();

  // Fetch competencies, levels, and departments on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch competencies
        const competenciesResponse = await fetch(`${BASE_URL}/api/candidate/competencies/`);
        if (!competenciesResponse.ok) {
          throw new Error(`HTTP error! status: ${competenciesResponse.status}`);
        }
        const competenciesResult = await competenciesResponse.json();
        
        // Fetch levels
        const levelsResponse = await fetch(`${BASE_URL}/api/admin/levels/`);
        if (!levelsResponse.ok) {
          throw new Error(`HTTP error! status: ${levelsResponse.status}`);
        }
        const levelsResult = await levelsResponse.json();

        // Fetch departments
        const departmentsResponse = await fetch(`${BASE_URL}/api/admin/departments/`);
        if (!departmentsResponse.ok) {
          throw new Error(`HTTP error! status: ${departmentsResponse.status}`);
        }
        const departmentsResult = await departmentsResponse.json();

        if (competenciesResult.status && competenciesResult.data) {
          setCompetencies(competenciesResult.data);
          
          // Find competency for current candidate
          const userCompetency = competenciesResult.data.find(
            comp => comp.candidate === parseInt(candidateId) || comp.candidate === candidateId
          );
          
          if (userCompetency) {
            setCurrentCompetency(userCompetency);
          }
        }

        if (levelsResult.status && levelsResult.data) {
          setLevels(levelsResult.data);
        }

        if (departmentsResult.status && departmentsResult.data) {
          setDepartments(departmentsResult.data);
        }

      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (candidateId) {
      fetchData();
    }
  }, [candidateId]);

  // Update current level data when competency or levels change
  useEffect(() => {
    if (currentCompetency && levels.length > 0) {
      // Find level by ID (not level_id)
      const levelInfo = levels.find(level => level.id === currentCompetency.level);
      if (levelInfo) {
        setCurrentLevelData(levelInfo);
      }
    }
  }, [currentCompetency, levels]);

  // Update current department data when competency or departments change
  useEffect(() => {
    if (currentCompetency && departments.length > 0) {
      const deptInfo = departments.find(dept => dept.id === currentCompetency.department);
      if (deptInfo) {
        setCurrentDepartmentData(deptInfo);
      }
    }
  }, [currentCompetency, departments]);

  const handleAddCompetence = () => {
    navigate('/add-competence');
  };

  // Get level display name based on level number from the levels API
  const getLevelDisplay = (levelNumber) => {
    // Find the level with this number from the levels data
    const levelFromData = levels.find(l => l.number === levelNumber);
    if (levelFromData) {
      return {
        name: levelFromData.name,
        display: `Level ${levelNumber} - ${levelFromData.name}`
      };
    }
    
    // Fallback mapping if not found in API data
    const levelMap = {
      0: { name: "Trainee", display: "Level 0 - Trainee" },
      1: { name: "Junior Surveyor", display: "Level 1 - Junior Surveyor" },
      2: { name: "Associate Surveyor", display: "Level 2 - Associate Surveyor" },
      3: { name: "Surveyor", display: "Level 3 - Surveyor" },
      4: { name: "Senior Surveyor", display: "Level 4 - Senior Surveyor" },
      5: { name: "Principal Surveyor", display: "Level 5 - Principal Surveyor" }
    };
    return levelMap[levelNumber] || { name: "Unknown", display: `Level ${levelNumber}` };
  };

  // Get department name from department ID
  const getDepartmentName = (deptId) => {
    const dept = departments.find(d => d.id === deptId);
    return dept ? dept.name : "Unknown Department";
  };

  if (loading) {
    return (
      <div className="ta-layout-wrapper">
        <CandidateSidebar />
        <div className="ta-main-wrapper">
          <Header />
          <div className="ta-content-area">
            <div className="cp-loading-container">
              <FaSpinner className="cp-spinner" />
              <p>Loading your competency data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ta-layout-wrapper">
        <CandidateSidebar />
        <div className="ta-main-wrapper">
          <Header />
          <div className="ta-content-area">
            <div className="cp-error-container">
              <FaExclamationCircle className="cp-error-icon" />
              <h3>Error Loading Data</h3>
              <p>{error}</p>
              <button onClick={() => window.location.reload()} className="cp-retry-btn">
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const levelDisplay = currentLevelData 
    ? getLevelDisplay(currentLevelData.number)
    : { name: "Not Started", display: "No Competency Found" };

  const currentLevelNumber = currentLevelData?.number ?? 0;
  const nextLevelNumber = currentLevelNumber + 1;
  const nextLevelDisplay = getLevelDisplay(nextLevelNumber);

  return (
    <div className="ta-layout-wrapper">
      <CandidateSidebar />

      <div className="ta-main-wrapper">
        <Header />

        <div className="ta-content-area">
          <div className="container-fluid cp-wrapper">

            {/* Page Header with Add Competence Button */}
            <div className="cp-page-header">
              <div>
                <h3 className="cp-page-title">Competency Progression</h3>
                <p className="cp-page-subtitle">
                  Track your journey through different competency levels
                </p>
              </div>
              <button 
                className="cp-add-competence-btn"
                onClick={handleAddCompetence}
              >
                <FaPlusCircle className="cp-add-competence-icon" />
                Add Competence
              </button>
            </div>

            {/* ================================================= */}
            {/* CURRENT LEVEL SECTION */}
            {/* ================================================= */}
            <div className="cp-section">
              <div className="cp-current-card">
                <div className="cp-current-left">
                  <span className="cp-label">Current Level</span>
                  <h2>
                    {currentCompetency 
                      ? levelDisplay.display
                      : "No Competency Found"}
                  </h2>
                  <p>
                    {currentCompetency 
                      ? `${currentDepartmentData ? currentDepartmentData.name : ''}`
                      : "Add your first competency to get started"}
                  </p>
                </div>

                <div className="cp-current-level">
                  {currentLevelNumber}
                </div>
              </div>

              {currentCompetency && (
                <div className="cp-unlock-box">
                  <h6>Current Level Unlocks</h6>
                  <div className="cp-unlocks">
                    {currentLevelNumber >= 0 && (
                      <span className="cp-pill">
                        <FaCheckCircle /> Basic training completion
                      </span>
                    )}
                    {currentLevelNumber >= 1 && (
                      <span className="cp-pill">
                        <FaCheckCircle /> Independent inspection work
                      </span>
                    )}
                    {currentLevelNumber >= 2 && (
                      <span className="cp-pill">
                        <FaCheckCircle /> Certification sponsorship
                      </span>
                    )}
                    {currentLevelNumber >= 3 && (
                      <span className="cp-pill">
                        <FaCheckCircle /> Lead inspector role
                      </span>
                    )}
                    {currentLevelNumber >= 4 && (
                      <span className="cp-pill">
                        <FaCheckCircle /> Team leadership
                      </span>
                    )}
                    {currentLevelNumber >= 5 && (
                      <span className="cp-pill">
                        <FaCheckCircle /> Full authority & governance
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* ================================================= */}
            {/* PROGRESS TO NEXT LEVEL */}
            {/* ================================================= */}
            {/* {currentCompetency && currentLevelNumber < 5 && (
              <div className="cp-section">
                <div className="cp-progress-card">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h4>Progress to {nextLevelDisplay.display}</h4>
                      <p className="cp-muted">{nextLevelDisplay.name}</p>
                    </div>

                    <div className="text-end">
                      <h3>0%</h3>
                      <span className="cp-muted">0/5 requirements</span>
                    </div>
                  </div>

                  <div className="cp-progress-bar">
                    <div className="cp-progress-fill" style={{ width: "0%" }} />
                  </div>

                  <div className="cp-req-list mt-4">
                    <Requirement
                      label="Complete all department rotations"
                      status="pending"
                      value="0/6"
                    />
                    <Requirement
                      label="Log required exposure hours"
                      status="pending"
                      value="0h"
                    />
                    <Requirement
                      label="Pass level assessment"
                      status="pending"
                      value="Not taken"
                    />
                    <Requirement
                      label="Obtain required certifications"
                      status="pending"
                      value="0/3"
                    />
                    <Requirement
                      label="Achieve minimum score"
                      status="pending"
                      value={`0/${currentLevelData?.min_score_required || 0}`}
                    />
                  </div>

                  <div className="cp-unlock-next">
                    <h6>What you'll unlock at {nextLevelDisplay.display}</h6>
                    <div className="cp-unlocks">
                      {nextLevelNumber === 1 && (
                        <>
                          <span className="cp-pill lock">
                            <FaLock /> Basic inspection work
                          </span>
                          <span className="cp-pill lock">
                            <FaLock /> Training completion
                          </span>
                        </>
                      )}
                      {nextLevelNumber === 2 && (
                        <>
                          <span className="cp-pill lock">
                            <FaLock /> Independent inspection work
                          </span>
                          <span className="cp-pill lock">
                            <FaLock /> Certification sponsorship
                          </span>
                        </>
                      )}
                      {nextLevelNumber === 3 && (
                        <>
                          <span className="cp-pill lock">
                            <FaLock /> Lead inspector role
                          </span>
                          <span className="cp-pill lock">
                            <FaLock /> SIT mentorship eligibility
                          </span>
                        </>
                      )}
                      {nextLevelNumber === 4 && (
                        <>
                          <span className="cp-pill lock">
                            <FaLock /> Senior leadership role
                          </span>
                          <span className="cp-pill lock">
                            <FaLock /> Team management
                          </span>
                        </>
                      )}
                      {nextLevelNumber === 5 && (
                        <>
                          <span className="cp-pill lock">
                            <FaLock /> Full authority
                          </span>
                          <span className="cp-pill lock">
                            <FaLock /> Governance role
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )} */}

            {/* ================================================= */}
            {/* COMPLETE JOURNEY OVERVIEW */}
            {/* ================================================= */}
            <div className="cp-section">
              <h4>Complete Journey Overview</h4>
              <p className="cp-muted">
                All levels from Trainee to Principal Surveyor
              </p>

              <JourneyItem
                level="0"
                title="Level 0 - Trainee"
                role="Trainee"
                done={currentLevelNumber > 0}
                current={currentLevelNumber === 0}
              />
              <JourneyItem
                level="1"
                title="Level 1 - Junior Surveyor"
                role="Junior Surveyor"
                done={currentLevelNumber > 1}
                current={currentLevelNumber === 1}
              />
              <JourneyItem
                level="2"
                title="Level 2 - Associate Surveyor"
                role="Associate Surveyor"
                done={currentLevelNumber > 2}
                current={currentLevelNumber === 2}
              />
              <JourneyItem
                level="3"
                title="Level 3 - Surveyor"
                role="Surveyor"
                done={currentLevelNumber > 3}
                current={currentLevelNumber === 3}
                locked={currentLevelNumber < 3}
              />
              <JourneyItem
                level="4"
                title="Level 4 - Senior Surveyor"
                role="Senior Surveyor / Lead"
                done={currentLevelNumber > 4}
                current={currentLevelNumber === 4}
                locked={currentLevelNumber < 4}
              />
              <JourneyItem
                level="5"
                title="Level 5 - Principal Surveyor"
                role="Principal / Authority"
                done={currentLevelNumber > 5}
                current={currentLevelNumber === 5}
                locked={currentLevelNumber < 5}
              />
            </div>

            {/* ================================================= */}
            {/* ACTION CARDS */}
            {/* ================================================= */}
            <div className="cp-section">
              <div className="cp-action-cards-wrapper">
                <div className="cp-action-card">
                  <div className="cp-action-icon">
                    <FaBookOpen className="cp-action-icon-inner" />
                  </div>
                  <div className="cp-action-content">
                    <h5 className="cp-action-title">Complete Training</h5>
                    <p className="cp-action-subtitle">3 modules pending</p>
                  </div>
                  <div className="cp-action-badge">
                    <span className="cp-action-badge-text">Resume</span>
                    <FaChevronRight className="cp-action-badge-arrow" />
                  </div>
                </div>

                <div className="cp-action-card">
                  <div className="cp-action-icon">
                    <FaUpload className="cp-action-icon-inner" />
                  </div>
                  <div className="cp-action-content">
                    <h5 className="cp-action-title">Add Certification</h5>
                    <p className="cp-action-subtitle">Upload credentials</p>
                  </div>
                  <div className="cp-action-badge">
                    <span className="cp-action-badge-text">Upload</span>
                    <FaChevronRight className="cp-action-badge-arrow" />
                  </div>
                </div>

                <div className="cp-action-card">
                  <div className="cp-action-icon">
                    <FaUserFriends className="cp-action-icon-inner" />
                  </div>
                  <div className="cp-action-content">
                    <h5 className="cp-action-title">Find a Mentor</h5>
                    <p className="cp-action-subtitle">Connect with seniors</p>
                  </div>
                  <div className="cp-action-badge">
                    <span className="cp-action-badge-text">Connect</span>
                    <FaChevronRight className="cp-action-badge-arrow" />
                  </div>
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

const Requirement = ({ label, status, value }) => (
  <div className={`cp-req ${status}`}>
    <div className="d-flex align-items-center gap-2">
      {status === "done" ? (
        <FaCheckCircle className="cp-ok" />
      ) : status === "partial" ? (
        <FaExclamationCircle className="cp-warn" />
      ) : (
        <FaExclamationCircle className="cp-pending" />
      )}
      <strong>{label}</strong>
    </div>
    <span className="cp-req-value">{value}</span>
  </div>
);

const JourneyItem = ({ level, title, role, done, current, locked }) => (
  <div className={`cp-journey ${done ? "done" : current ? "current" : locked ? "locked" : ""}`}>
    <div className="cp-journey-left">
      <div className="cp-journey-badge">
        {done ? <FaCheckCircle /> : locked ? <FaLock /> : level}
      </div>
      <div>
        <strong>{title}</strong>
        <p className="cp-muted mb-0">{role}</p>
      </div>
    </div>

    <div className="cp-journey-right">
      {current && <span className="cp-current-tag">Current</span>}
      {!locked && !done && !current && <FaChevronRight />}
    </div>
  </div>
);

export default CandidateCompetencyProgression;