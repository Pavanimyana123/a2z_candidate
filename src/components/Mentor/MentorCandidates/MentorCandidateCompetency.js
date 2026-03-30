import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MentorSidebar from "../Layout/MentorSidebar";
import Header from "../Layout/MentorHeader";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaSpinner,
  FaStar,
  FaChartBar,
  FaFileAlt,
  FaCloudUploadAlt,
  FaLink,
  FaFilePdf,
  FaFileImage,
  FaFileWord,
  FaFileExcel,
  FaFilePowerpoint,
  FaFile,
  FaDownload,
  FaExternalLinkAlt,
  FaEye,
  FaArrowLeft,
  FaUserGraduate,
  FaBuilding,
  FaLevelUpAlt,
  FaUserFriends,
  FaBookOpen,
  FaCheck,
  FaTimes,
  FaUserCheck,
  FaUserTimes,
  FaEdit
} from "react-icons/fa";
import { BASE_URL } from "../../../ApiUrl";
import "./MentorCandidateCompetency.css";

const MentorCandidateCompetency = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [competencies, setCompetencies] = useState([]);
  const [filteredCompetencies, setFilteredCompetencies] = useState([]);
  const [levels, setLevels] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [mentorAssignments, setMentorAssignments] = useState([]);
  const [evidenceMap, setEvidenceMap] = useState({});
  const [loadingEvidence, setLoadingEvidence] = useState({});
  const [currentCompetency, setCurrentCompetency] = useState(null);
  const [currentLevelData, setCurrentLevelData] = useState(null);
  const [currentDepartmentData, setCurrentDepartmentData] = useState(null);
  const [error, setError] = useState(null);
  const [candidateInfo, setCandidateInfo] = useState(null);
  const [mentorInfo, setMentorInfo] = useState(null);
  const [digitalLogbookData, setDigitalLogbookData] = useState(null);
  
  // Get current mentor from localStorage
  useEffect(() => {
    try {
      const mentorUser = localStorage.getItem('mentor_user');
      if (mentorUser) {
        const parsed = JSON.parse(mentorUser);
        console.log('Mentor user from localStorage:', parsed);
        setMentorInfo(parsed);
      }
    } catch (error) {
      console.error('Error parsing mentor_user from localStorage:', error);
    }
  }, []);

  // Get candidate details from location state
  useEffect(() => {
    if (location.state) {
      setCandidateInfo({
        id: location.state.candidateId,
        name: location.state.candidateName,
        department: location.state.departmentName,
        level: location.state.levelName
      });
    }
  }, [location.state]);

  // Fetch digital logbook data
  const fetchDigitalLogbook = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/candidate/digital-logbook/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      if (result.status && result.data) {
        setDigitalLogbookData(result.data);
        console.log('Digital logbook data fetched:', result.data);
      }
    } catch (err) {
      console.error('Error fetching digital logbook:', err);
    }
  };

  useEffect(() => {
    fetchDigitalLogbook();
  }, []);

  // Handle assign marks navigation
  const handleAssignMarks = (competencyId) => {
    // Find the matching digital logbook entry
    const logbookEntry = digitalLogbookData?.find(entry => 
      entry.competency === parseInt(competencyId)
    );
    
    navigate(`/mentor-competency-review/${competencyId}`, {
      state: {
        action: 'approve',
        candidateInfo: candidateInfo,
        from: '/mentor-candidate-competency',
        competencyData: currentCompetency,
        logbookId: logbookEntry?.id
      }
    });
  };

  // Handle approve/reject navigation
  const handleApproveReject = (competencyId, action) => {
    // Find the matching digital logbook entry
    const logbookEntry = digitalLogbookData?.find(entry => 
      entry.competency === parseInt(competencyId)
    );
    
    navigate(`/mentor-competency-review/${competencyId}`, {
      state: {
        action: action,
        candidateInfo: candidateInfo,
        from: '/mentor-candidate-competency',
        competencyData: currentCompetency,
        logbookId: logbookEntry?.id
      }
    });
  };

  // Check if marks have been assigned (all scores are zero or competency is in draft)
  const hasMarksAssigned = (competency) => {
    if (!competency) return false;
    // If any score is greater than 0, marks have been assigned
    const hasAnyScore = competency.technical_knowledge > 0 ||
                        competency.field_execution > 0 ||
                        competency.documentation_quality > 0 ||
                        competency.ethics_independence > 0 ||
                        competency.communication > 0;
    
    // Also check if status is approved or rejected (finalized)
    const isFinalized = competency.status === 'approved' || competency.status === 'rejected';
    
    return hasAnyScore || isFinalized;
  };

  // Fetch evidence for a specific competency
  const fetchEvidenceForCompetency = async (competencyId) => {
    if (!competencyId) return;
    
    try {
      setLoadingEvidence(prev => ({ ...prev, [competencyId]: true }));
      
      const response = await fetch(`${BASE_URL}/api/candidate/competency-evidence/?competency=${competencyId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      
      if (result.status && result.data) {
        setEvidenceMap(prev => ({
          ...prev,
          [competencyId]: result.data
        }));
      }
    } catch (err) {
      console.error(`Error fetching evidence for competency ${competencyId}:`, err);
    } finally {
      setLoadingEvidence(prev => ({ ...prev, [competencyId]: false }));
    }
  };

  // Function to get department name from ID
  const getDepartmentName = (deptId) => {
    const department = departments.find(dept => dept.id === deptId);
    return department ? department.name : null;
  };

  // Filter competencies based on mentor assignments
  const filterCompetenciesByMentorAssignment = (allCompetencies, assignments, allDepartments) => {
    if (!assignments.length || !allCompetencies.length) return allCompetencies;

    // Create a map of candidate assignments
    const candidateAssignments = {};
    
    assignments.forEach(assignment => {
      const candidateId = assignment.candidate;
      const departmentName = assignment.department_name;
      
      // Store the department name for this candidate
      if (!candidateAssignments[candidateId]) {
        candidateAssignments[candidateId] = [];
      }
      candidateAssignments[candidateId].push(departmentName);
    });

    // Filter competencies: only keep those whose department name matches the candidate's assigned department
    const filtered = allCompetencies.filter(competency => {
      const competencyDepartmentName = getDepartmentName(competency.department);
      const candidateAssignmentsList = candidateAssignments[competency.candidate] || [];
      
      // Check if competency department name matches any of the candidate's assigned departments
      return candidateAssignmentsList.includes(competencyDepartmentName);
    });

    console.log('Filtered competencies:', filtered);
    console.log('Original competencies count:', allCompetencies.length);
    console.log('Filtered competencies count:', filtered.length);

    return filtered;
  };

  // Fetch competencies, levels, departments, and mentor assignments on component mount
  useEffect(() => {
    const fetchData = async () => {
      if (!candidateInfo?.id) return;

      try {
        setLoading(true);
        
        // Fetch mentor assignments
        const assignmentsResponse = await fetch(`${BASE_URL}/api/mentor/mentorship-assignments/`);
        if (!assignmentsResponse.ok) {
          throw new Error(`HTTP error! status: ${assignmentsResponse.status}`);
        }
        const assignmentsResult = await assignmentsResponse.json();
        
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

        if (assignmentsResult.status && assignmentsResult.data) {
          setMentorAssignments(assignmentsResult.data);
          console.log('Mentor assignments:', assignmentsResult.data);
        }

        if (competenciesResult.status && competenciesResult.data) {
          // First, filter competencies for this specific candidate
          const candidateCompetencies = competenciesResult.data.filter(
            comp => comp.candidate === parseInt(candidateInfo.id)
          );
          
          setCompetencies(candidateCompetencies);
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

    fetchData();
  }, [candidateInfo]);

  // Apply filtering after all data is loaded
  useEffect(() => {
    if (competencies.length > 0 && departments.length > 0 && mentorAssignments.length > 0) {
      const filtered = filterCompetenciesByMentorAssignment(competencies, mentorAssignments, departments);
      setFilteredCompetencies(filtered);
      
      // Set current competency to the first filtered competency (or highest level)
      if (filtered.length > 0) {
        // Sort by level to find the highest level competency
        const sortedCompetencies = [...filtered].sort((a, b) => b.level - a.level);
        setCurrentCompetency(sortedCompetencies[0]);
        
        // Fetch evidence for filtered competencies
        for (const comp of filtered) {
          fetchEvidenceForCompetency(comp.id);
        }
      } else {
        setCurrentCompetency(null);
      }
    } else if (competencies.length > 0 && departments.length > 0) {
      // If no mentor assignments, show all competencies (or handle as needed)
      setFilteredCompetencies(competencies);
      if (competencies.length > 0) {
        const sortedCompetencies = [...competencies].sort((a, b) => b.level - a.level);
        setCurrentCompetency(sortedCompetencies[0]);
        
        for (const comp of competencies) {
          fetchEvidenceForCompetency(comp.id);
        }
      }
    }
  }, [competencies, departments, mentorAssignments]);

  // Update current level data when competency or levels change
  useEffect(() => {
    if (currentCompetency && levels.length > 0) {
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

  const handleGoBack = () => {
    navigate('/mentor-candidates');
  };

  // Get level display name based on level number
  const getLevelDisplay = (levelNumber) => {
    const levelFromData = levels.find(l => l.number === levelNumber);
    if (levelFromData) {
      return {
        name: levelFromData.name,
        display: `Level ${levelNumber} - ${levelFromData.name}`
      };
    }
    
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

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get file icon based on file extension
  const getFileIcon = (filename) => {
    if (!filename) return <FaFile />;
    
    const ext = filename.split('.').pop().toLowerCase();
    
    switch(ext) {
      case 'pdf':
        return <FaFilePdf style={{ color: '#e74c3c' }} />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'svg':
        return <FaFileImage style={{ color: '#2ecc71' }} />;
      case 'doc':
      case 'docx':
        return <FaFileWord style={{ color: '#2980b9' }} />;
      case 'xls':
      case 'xlsx':
        return <FaFileExcel style={{ color: '#27ae60' }} />;
      case 'ppt':
      case 'pptx':
        return <FaFilePowerpoint style={{ color: '#e67e22' }} />;
      default:
        return <FaFile />;
    }
  };

  // Get verification status badge
  const getVerificationBadge = (status) => {
    switch(status) {
      case 'verified':
      case 'approved':
        return <span className="mcp-evidence-verified-badge"><FaCheckCircle /> Verified</span>;
      case 'rejected':
        return <span className="mcp-evidence-rejected-badge"><FaTimes /> Rejected</span>;
      default:
        return <span className="mcp-evidence-pending-badge"><FaSpinner /> Pending</span>;
    }
  };

  // Check if evidence can be verified (pending status)
  const canVerify = (status) => {
    return status !== 'approved' && status !== 'verified' && status !== 'rejected';
  };

  // Get evidence type icon
  const getEvidenceTypeIcon = (type) => {
    switch(type) {
      case 'certificate':
        return <FaFileAlt className="mcp-evidence-type-icon certificate" />;
      case 'work_sample':
        return <FaFileImage className="mcp-evidence-type-icon work-sample" />;
      case 'reference':
        return <FaUserFriends className="mcp-evidence-type-icon reference" />;
      case 'training':
        return <FaBookOpen className="mcp-evidence-type-icon training" />;
      default:
        return <FaFileAlt className="mcp-evidence-type-icon" />;
    }
  };

  // Get full document URL
  const getDocumentUrl = (documentName) => {
    if (!documentName) return '#';
    return `${BASE_URL}/media/evidence/${documentName}`;
  };

  if (loading) {
    return (
      <div className="ta-layout-wrapper">
        <MentorSidebar />
        <div className="ta-main-wrapper">
          <Header />
          <div className="ta-content-area">
            <div className="mcp-loading-container">
              <FaSpinner className="mcp-spinner" />
              <p>Loading candidate competency data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ta-layout-wrapper">
        <MentorSidebar />
        <div className="ta-main-wrapper">
          <Header />
          <div className="ta-content-area">
            <div className="mcp-error-container">
              <FaExclamationCircle className="mcp-error-icon" />
              <h3>Error Loading Data</h3>
              <p>{error}</p>
              <button onClick={handleGoBack} className="mcp-retry-btn">
                Go Back
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
  
  // Get evidence for current competency
  const evidence = currentCompetency ? evidenceMap[currentCompetency.id] || [] : [];
  const isLoadingEvidence = currentCompetency ? loadingEvidence[currentCompetency.id] : false;
  
  // Check if marks are assigned
  const marksAssigned = hasMarksAssigned(currentCompetency);

  return (
    <div className="ta-layout-wrapper">
      <MentorSidebar />

      <div className="ta-main-wrapper">
        <Header />

        <div className="ta-content-area">
          <div className="container-fluid mcp-wrapper">

            {/* Back Button and Candidate Info */}
            <div className="mcp-header-section">
              <button className="mcp-back-btn" onClick={handleGoBack}>
                <FaArrowLeft /> Back to Candidates
              </button>
              
              {candidateInfo && (
                <div className="mcp-candidate-info-card">
                  <div className="mcp-candidate-avatar">
                    <FaUserGraduate />
                  </div>
                  <div className="mcp-candidate-details">
                    <h4>{candidateInfo.name}</h4>
                    <div className="mcp-candidate-meta">
                      <span><FaBuilding /> {candidateInfo.department || 'N/A'}</span>
                      <span><FaLevelUpAlt /> {candidateInfo.level || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Page Header with Action Buttons */}
            <div className="mcp-page-header">
              <div>
                <h3 className="mcp-page-title">Candidate Competency Details</h3>
                <p className="mcp-page-subtitle">
                  View candidate's current competency level and evidence
                </p>
              </div>
              
              {/* Assign Marks Button - Show only if marks are not assigned */}
              {currentCompetency && !marksAssigned && filteredCompetencies.length > 0 && (
                <div className="mcp-header-actions">
                  <button
                    className="mcp-assign-marks-btn"
                    onClick={() => handleAssignMarks(currentCompetency.id)}
                  >
                    <FaEdit /> Assign Marks
                  </button>
                </div>
              )}
            </div>

            {/* ================================================= */}
            {/* CURRENT LEVEL SECTION */}
            {/* ================================================= */}
            <div className="mcp-section">
              <div className="mcp-current-card">
                <div className="mcp-current-left">
                  <span className="mcp-label">Current Level</span>
                  <h2>
                    {currentCompetency && filteredCompetencies.length > 0
                      ? levelDisplay.display
                      : "No Competency Found"}
                  </h2>
                  <p>
                    {currentCompetency && filteredCompetencies.length > 0
                      ? `${currentDepartmentData ? currentDepartmentData.name : ''}`
                      : "No valid competencies found for assigned department"}
                  </p>
                </div>

                <div className="mcp-current-level">
                  {filteredCompetencies.length > 0 ? currentLevelNumber : 0}
                </div>
              </div>
            </div>

            {/* ================================================= */}
            {/* CURRENT LEVEL DETAILS */}
            {/* ================================================= */}
            {currentCompetency && filteredCompetencies.length > 0 ? (
              <div className="mcp-section">
                <div className="mcp-current-level-details">
                  
                  {/* Competency Scores Section */}
                  <div className="mcp-scores-section">
                    <h6 className="mcp-section-subtitle">
                      <FaStar className="mcp-section-icon" /> Competency Scores
                    </h6>
                    {marksAssigned ? (
                      <div className="mcp-score-grid">
                        <div className="mcp-score-item">
                          <div className="mcp-score-label">
                            <FaChartBar className="mcp-score-icon" />
                            <span>Technical Knowledge</span>
                          </div>
                          <div className="mcp-score-value">
                            {currentCompetency.technical_knowledge || 0}
                          </div>
                        </div>
                        
                        <div className="mcp-score-item">
                          <div className="mcp-score-label">
                            <FaChartBar className="mcp-score-icon" />
                            <span>Field Execution</span>
                          </div>
                          <div className="mcp-score-value">
                            {currentCompetency.field_execution || 0}
                          </div>
                        </div>
                        
                        <div className="mcp-score-item">
                          <div className="mcp-score-label">
                            <FaChartBar className="mcp-score-icon" />
                            <span>Documentation Quality</span>
                          </div>
                          <div className="mcp-score-value">
                            {currentCompetency.documentation_quality || 0}
                          </div>
                        </div>
                        
                        <div className="mcp-score-item">
                          <div className="mcp-score-label">
                            <FaChartBar className="mcp-score-icon" />
                            <span>Ethics & Independence</span>
                          </div>
                          <div className="mcp-score-value">
                            {currentCompetency.ethics_independence || 0}
                          </div>
                        </div>
                        
                        <div className="mcp-score-item">
                          <div className="mcp-score-label">
                            <FaChartBar className="mcp-score-icon" />
                            <span>Communication</span>
                          </div>
                          <div className="mcp-score-value">
                            {currentCompetency.communication || 0}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="mcp-no-scores-message">
                        <FaEdit className="mcp-no-scores-icon" />
                        <p>Marks not assigned yet. Click the "Assign Marks" button to evaluate this competency.</p>
                      </div>
                    )}
                  </div>

                  {/* Evidence Section */}
                  <div className="mcp-evidence-section">
                    <div className="mcp-evidence-header">
                      <h6 className="mcp-section-subtitle">
                        <FaFileAlt className="mcp-section-icon" /> Evidence Details
                      </h6>
                      <span className={`mcp-status-badge ${currentCompetency.status || 'draft'}`}>
                        {currentCompetency.status || 'Draft'}
                      </span>
                    </div>

                    {/* Evidence List */}
                    <div className="mcp-evidence-list">
                      {isLoadingEvidence ? (
                        <div className="mcp-evidence-loading">
                          <FaSpinner className="mcp-spinner-small" />
                          <p>Loading evidence...</p>
                        </div>
                      ) : evidence.length > 0 ? (
                        <div className="mcp-evidence-items">
                          {evidence.map((item) => (
                            <div key={item.id} className="mcp-evidence-item">
                              <div className="mcp-evidence-item-header">
                                <div className="mcp-evidence-item-icon">
                                  {getEvidenceTypeIcon(item.evidence_type)}
                                </div>
                                <div className="mcp-evidence-item-title">
                                  <h6>{item.title}</h6>
                                  <span className="mcp-evidence-type">{item.evidence_type}</span>
                                </div>
                                <div className="mcp-evidence-verification">
                                  {getVerificationBadge(item.verification_status)}
                                </div>
                              </div>

                              <div className="mcp-evidence-item-description">
                                <p>{item.description || item.submission_notes}</p>
                              </div>

                              {/* Evidence Link */}
                              {item.evidence_link && (
                                <div className="mcp-evidence-link">
                                  <FaLink className="mcp-evidence-link-icon" />
                                  <a 
                                    href={item.evidence_link} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="mcp-evidence-link-text"
                                  >
                                    View External Link <FaExternalLinkAlt className="mcp-external-icon" />
                                  </a>
                                </div>
                              )}

                              {/* Documents */}
                              {item.evidence_documents && item.evidence_documents.length > 0 && (
                                <div className="mcp-evidence-documents">
                                  <div className="mcp-evidence-documents-title">
                                    <FaDownload /> Documents ({item.evidence_documents.length})
                                  </div>
                                  <div className="mcp-evidence-document-list">
                                    {item.evidence_documents.map((doc, idx) => (
                                      <div key={idx} className="mcp-evidence-document-item">
                                        {getFileIcon(doc)}
                                        <span className="mcp-evidence-document-name">{doc}</span>
                                        <a 
                                          href={getDocumentUrl(doc)} 
                                          target="_blank" 
                                          rel="noopener noreferrer"
                                          className="mcp-evidence-document-download"
                                          title="Download/View Document"
                                        >
                                          <FaEye />
                                        </a>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              <div className="mcp-evidence-item-meta">
                                <span className="mcp-evidence-submitted-by">
                                  Submitted by: {item.submitted_by || 'N/A'}
                                </span>
                                <span className="mcp-evidence-date">
                                  {formatDate(item.created_at)}
                                </span>
                              </div>

                              {/* Review Comments (if any) - Only display existing comments */}
                              {item.review_comments && (
                                <div className="mcp-evidence-review-comments">
                                  <strong>Review Comments:</strong>
                                  <p>{item.review_comments}</p>
                                </div>
                              )}

                              {/* Action Buttons for Evidence - Only show for pending evidence when marks not assigned yet */}
                              {canVerify(item.verification_status) && !marksAssigned && (
                                <div className="mcp-evidence-actions">
                                  <button
                                    className="mcp-verify-btn mcp-approve-btn"
                                    onClick={() => handleApproveReject(currentCompetency.id, 'approve')}
                                  >
                                    <FaCheck /> Approve
                                  </button>
                                  <button
                                    className="mcp-verify-btn mcp-reject-btn"
                                    onClick={() => handleApproveReject(currentCompetency.id, 'reject')}
                                  >
                                    <FaTimes /> Reject
                                  </button>
                                </div>
                              )}

                              {/* Show message if evidence is already verified */}
                              {!canVerify(item.verification_status) && (
                                <div className="mcp-evidence-verified-message">
                                  <FaCheckCircle /> This evidence has been {item.verification_status}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="mcp-evidence-placeholder">
                          <FaCloudUploadAlt className="mcp-evidence-placeholder-icon" />
                          <p>No evidence uploaded yet for this level.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Comments Section */}
                  {(currentCompetency.mentor_comments || currentCompetency.admin_comments) && (
                    <div className="mcp-comments-section">
                      <h6 className="mcp-section-subtitle">Comments</h6>
                      {currentCompetency.mentor_comments && (
                        <div className="mcp-comment">
                          <strong>Mentor Comments:</strong>
                          <p>{currentCompetency.mentor_comments}</p>
                        </div>
                      )}
                      {currentCompetency.admin_comments && (
                        <div className="mcp-comment">
                          <strong>Admin Comments:</strong>
                          <p>{currentCompetency.admin_comments}</p>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="mcp-meta-info">
                    <small>Last Updated: {new Date(currentCompetency.updated_at).toLocaleDateString()}</small>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mcp-no-competency">
                <FaExclamationCircle className="mcp-no-competency-icon" />
                <h4>No Competency Found</h4>
                <p>This candidate doesn't have any competency records for their assigned department.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorCandidateCompetency;