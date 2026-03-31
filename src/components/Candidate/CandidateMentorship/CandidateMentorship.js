import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CandidateSidebar from "../Layout/CandidateSidebar";
import Header from "../Layout/CandidateHeader";
import { 
  FaUsers, 
  FaCommentDots, 
  FaCalendarAlt, 
  FaCheckCircle,
  FaSpinner,
  FaExclamationCircle,
  FaEnvelope,
  FaPhone,
  FaBuilding,
  FaUserTie,
  FaStar,
  FaCertificate,
  FaCheck,
  FaUserCheck
} from "react-icons/fa";
import { BASE_URL } from "../../../ApiUrl";
import "./CandidateMentorship.css";

const CandidateMentorship = () => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [yourMentor, setYourMentor] = useState(null);
  const [yourMentorDetails, setYourMentorDetails] = useState(null);
  const [departmentsMap, setDepartmentsMap] = useState({});
  const [levelsMap, setLevelsMap] = useState({});
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedTargetLevel, setSelectedTargetLevel] = useState("");
  const [assignedMentors, setAssignedMentors] = useState([]);
  const [assignedDepartments, setAssignedDepartments] = useState(new Set());
  const [connectedMentorIds, setConnectedMentorIds] = useState(new Set());
  const navigate = useNavigate();

  // Get candidate user ID from localStorage
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

  // Fetch complete mentor details
  const fetchMentorDetails = async (mentorId) => {
    try {
      const response = await fetch(`${BASE_URL}/api/mentor/mentors/${mentorId}/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      if (result.status && result.data) {
        return result.data;
      }
    } catch (err) {
      console.error('Error fetching mentor details:', err);
    }
    return null;
  };

  // Fetch mentorship assignments
  const fetchMentorshipAssignments = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/mentor/mentorship-assignments/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      
      if (result.status && result.data) {
        // Filter assignments for current candidate
        const candidateAssignments = result.data.filter(
          assignment => assignment.candidate.toString() === candidateId
        );
        setAssignedMentors(candidateAssignments);
        
        // Extract unique department names from assignments
        const deptSet = new Set();
        const mentorIdSet = new Set();
        candidateAssignments.forEach(assignment => {
          if (assignment.department_name) {
            deptSet.add(assignment.department_name);
          }
          if (assignment.mentor) {
            mentorIdSet.add(assignment.mentor);
          }
        });
        setAssignedDepartments(deptSet);
        setConnectedMentorIds(mentorIdSet);
        
        // If there are assignments, set the first one as "Your Mentor" and fetch details
        if (candidateAssignments.length > 0) {
          const firstAssignment = candidateAssignments[0];
          setYourMentor(firstAssignment);
          
          // Fetch complete mentor details
          const mentorDetails = await fetchMentorDetails(firstAssignment.mentor);
          if (mentorDetails) {
            setYourMentorDetails(mentorDetails);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching mentorship assignments:', err);
    }
  };

  // Fetch departments mapping
  const fetchDepartments = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/admin/departments/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      if (result.status && result.data) {
        const deptMap = {};
        result.data.forEach(dept => {
          deptMap[dept.id] = dept.name;
        });
        setDepartmentsMap(deptMap);
      }
    } catch (err) {
      console.error('Error fetching departments:', err);
    }
  };

  // Fetch levels mapping
  const fetchLevels = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/admin/levels/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      if (result.status && result.data) {
        const levelMap = {};
        result.data.forEach(level => {
          levelMap[level.id] = level;
        });
        setLevelsMap(levelMap);
      }
    } catch (err) {
      console.error('Error fetching levels:', err);
    }
  };

  // Fetch mentors from API
  const fetchMentors = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${BASE_URL}/api/mentor/mentors/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      
      if (result.status && result.data) {
        // Filter mentors to only show those whose department matches assigned department
        let filteredMentors = result.data;
        
        if (assignedDepartments.size > 0) {
          // Filter mentors who have specializations matching assigned departments
          filteredMentors = result.data.filter(mentor => {
            if (mentor.specializations && Array.isArray(mentor.specializations)) {
              // Check if any of mentor's specializations match assigned departments
              return mentor.specializations.some(specId => {
                const deptName = departmentsMap[specId];
                return deptName && assignedDepartments.has(deptName);
              });
            }
            return false;
          });
        }
        
        setMentors(filteredMentors);
      } else {
        throw new Error(result.message || 'Failed to fetch mentors');
      }
    } catch (err) {
      console.error('Error fetching mentors:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchDepartments();
      await fetchLevels();
      await fetchMentorshipAssignments();
    };
    loadData();
  }, []);

  useEffect(() => {
    if (Object.keys(departmentsMap).length > 0) {
      fetchMentors();
    }
  }, [assignedDepartments, departmentsMap]);

  // Handle Connect button click
  const handleConnect = (mentor) => {
    // Get the first department from mentor's specializations or use selected department
    const mentorDepartment = mentor.specializations && mentor.specializations.length > 0 
      ? mentor.specializations[0] 
      : selectedDepartment || "";
    
    // Get target level (use mentor's level or selected target level)
    const targetLevel = mentor.mentor_level || selectedTargetLevel || "";

    // Navigate to form with mentor data
    navigate('/find-mentor', {
      state: {
        selectedMentor: {
          id: mentor.id,
          name: mentor.full_name,
          department: mentorDepartment,
          target_level: targetLevel,
          status: 'active',
          mentor_status: 'requested'
        },
        candidateId: candidateId
      }
    });
  };

  // Get department names from IDs
  const getDepartments = (departmentIds) => {
    if (!departmentIds || !Array.isArray(departmentIds)) return [];
    return departmentIds.map(id => departmentsMap[id] || `Department ${id}`).filter(Boolean);
  };

  // Check if mentor is already connected
  const isMentorConnected = (mentorId) => {
    return connectedMentorIds.has(mentorId);
  };

  // Get level badge color
  const getLevelBadge = (level) => {
    switch(level) {
      case 1: return { bg: '#e6f7ff', color: '#0077b6', text: 'Junior Mentor' };
      case 2: return { bg: '#f0f7e6', color: '#2e7d32', text: 'Senior Mentor' };
      case 3: return { bg: '#fff3e0', color: '#ed6c02', text: 'Lead Mentor' };
      case 4: return { bg: '#f3e5f5', color: '#7b1fa2', text: 'Principal Mentor' };
      case 5: return { bg: '#fbe9e7', color: '#d84315', text: 'Executive Mentor' };
      default: return { bg: '#e6eaf0', color: '#5f6b7a', text: `Level ${level}` };
    }
  };

  // Format experience
  const formatExperience = (years) => {
    if (!years) return 'N/A';
    const exp = parseFloat(years);
    if (exp === 1) return '1 year';
    if (exp < 1) return `${exp * 12} months`;
    return `${exp} years`;
  };

  if (loading && assignedDepartments.size === 0) {
    return (
      <div className="cm-layout-wrapper">
        <CandidateSidebar />
        <div className="cm-main-wrapper">
          <Header />
          <div className="cm-content-area">
            <div className="cm-loading-container">
              <FaSpinner className="cm-spinner" />
              <p>Loading mentors...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && assignedDepartments.size === 0) {
    return (
      <div className="cm-layout-wrapper">
        <CandidateSidebar />
        <div className="cm-main-wrapper">
          <Header />
          <div className="cm-content-area">
            <div className="cm-error-container">
              <FaExclamationCircle className="cm-error-icon" />
              <h3>Error Loading Mentors</h3>
              <p>{error}</p>
              <button onClick={fetchMentors} className="cm-retry-btn">
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const levelBadge = yourMentorDetails ? getLevelBadge(yourMentorDetails.mentor_level) : null;

  return (
    <div className="cm-layout-wrapper">
      <CandidateSidebar />

      <div className="cm-main-wrapper">
        <Header />

        <div className="cm-content-area container-fluid">

          {/* Page Header */}
          <div className="d-flex justify-content-between align-items-start mb-4">
            <div>
              <h3 className="cm-title">Mentorship</h3>
              <p className="cm-sub">Connect with experienced professionals</p>
            </div>

            <button 
              className="btn cm-primary-btn"
              onClick={() => navigate('/find-mentor')}
            >
              <FaUsers className="me-2" />
              Find a Mentor
            </button>
          </div>

          {/* Your Mentor Section - Now with complete details */}
          {yourMentor && yourMentorDetails && (
            <div className="cm-card mb-4">
              <h5>Your Mentor</h5>
              <p className="cm-muted">Your assigned senior guide</p>

              <div className="cm-mentor-box">
                <div className="d-flex align-items-start gap-3">
                  <div className="cm-avatar">
                    {yourMentorDetails.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'NA'}
                  </div>

                  <div className="flex-grow-1">
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <h6 className="mb-0">{yourMentorDetails.full_name}</h6>
                      {yourMentorDetails.background_verified && (
                        <span className="cm-verified-badge" title="Background Verified">
                          <FaCheckCircle />
                        </span>
                      )}
                      {yourMentorDetails.mentorship_certified && (
                        <span className="cm-certified-badge" title="Mentorship Certified">
                          <FaCertificate />
                        </span>
                      )}
                    </div>
                    
                    <p className="cm-muted mb-2">
                      <span 
                        className="cm-level-badge"
                        style={{ backgroundColor: levelBadge?.bg, color: levelBadge?.color }}
                      >
                        {levelBadge?.text}
                      </span>
                      {yourMentorDetails.current_company && (
                        <span className="cm-company ms-2">
                          <FaBuilding className="me-1" /> {yourMentorDetails.current_company}
                        </span>
                      )}
                    </p>

                    {/* Department Badge */}
                    <div className="mb-2">
                      <span className="cm-department-badge">
                        {yourMentor.department_name}
                      </span>
                      <span className="cm-target-level ms-2">
                        Target: {yourMentor.target_level_name}
                      </span>
                    </div>

                    {/* Specializations/Departments */}
                    {yourMentorDetails.specializations && yourMentorDetails.specializations.length > 0 && (
                      <div className="cm-specializations mb-2">
                        {getDepartments(yourMentorDetails.specializations).slice(0, 2).map((dept, idx) => (
                          <span key={idx} className="cm-tag me-1">{dept}</span>
                        ))}
                      </div>
                    )}

                    {/* Contact Info */}
                    <div className="cm-contact-info mb-2">
                      {yourMentorDetails.email && (
                        <span className="cm-contact-item">
                          <FaEnvelope /> {yourMentorDetails.email}
                        </span>
                      )}
                      {yourMentorDetails.phone_number && (
                        <span className="cm-contact-item ms-3">
                          <FaPhone /> {yourMentorDetails.phone_number}
                        </span>
                      )}
                    </div>

                    {/* Progress */}
                    {/* <div className="cm-progress-info mt-2">
                      <div className="d-flex justify-content-between mb-1">
                        <small>Progress</small>
                        <small>{yourMentor.completion_percentage || 0}%</small>
                      </div>
                      <div className="cm-progress-bar">
                        <div 
                          className="cm-progress-fill" 
                          style={{ width: `${yourMentor.completion_percentage || 0}%` }}
                        ></div>
                      </div>
                    </div> */}
                  </div>
                </div>

                <div className="d-flex gap-2 mt-3">
                  <button className="btn cm-outline-btn">
                    <FaCommentDots className="me-2" />
                    Message
                  </button>

                  <button className="btn cm-outline-btn">
                    <FaCalendarAlt className="me-2" />
                    Schedule
                  </button>
                </div>
              </div>

              {/* Mentor Stats */}
              <div className="cm-mentor-stats mt-3">
                <div className="cm-stat-item">
                  <FaUserTie className="cm-stat-icon" />
                  <div>
                    <span className="cm-stat-label">Experience</span>
                    <span className="cm-stat-value">{formatExperience(yourMentorDetails.years_of_experience)}</span>
                  </div>
                </div>
                <div className="cm-stat-item">
                  <FaUsers className="cm-stat-icon" />
                  <div>
                    <span className="cm-stat-label">Trainees</span>
                    <span className="cm-stat-value">{yourMentorDetails.current_trainees || 0} / {yourMentorDetails.max_trainees || 0}</span>
                  </div>
                </div>
                <div className="cm-stat-item">
                  <FaStar className="cm-stat-icon" />
                  <div>
                    <span className="cm-stat-label">Mentor Level</span>
                    <span className="cm-stat-value">Level {yourMentorDetails.mentor_level}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Available Mentors - Only show those from assigned departments */}
          {mentors.length > 0 && assignedDepartments.size > 0 && (
            <div className="cm-card">
              <h5>Available Mentors</h5>
              <p className="cm-muted">
                Senior professionals from {Array.from(assignedDepartments).join(', ')} department
              </p>

              <div className="row g-4 mt-2">
                {mentors.map((mentor) => {
                  const mentorLevelBadge = getLevelBadge(mentor.mentor_level);
                  const departments = getDepartments(mentor.specializations);
                  const isConnected = isMentorConnected(mentor.id);
                  
                  // Don't show the current mentor in available mentors list
                  if (yourMentor && mentor.id === yourMentor.mentor) {
                    return null;
                  }
                  
                  return (
                    <MentorCard
                      key={mentor.id}
                      mentor={mentor}
                      initials={mentor.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                      name={mentor.full_name}
                      role={mentorLevelBadge.text}
                      company={mentor.current_company}
                      departments={departments.slice(0, 2)}
                      level={`Level ${mentor.mentor_level}`}
                      experience={formatExperience(mentor.years_of_experience)}
                      mentees={`${mentor.current_trainees || 0} mentees`}
                      backgroundVerified={mentor.background_verified}
                      mentorshipCertified={mentor.mentorship_certified}
                      isConnected={isConnected}
                      onConnect={() => handleConnect(mentor)}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* No mentors available message */}
          {mentors.length === 0 && assignedDepartments.size > 0 && (
            <div className="cm-card text-center py-5">
              <FaUsers className="cm-empty-icon" />
              <h5>No Available Mentors</h5>
              <p className="cm-muted">
                No mentors are currently available in your assigned departments.
                Please check back later.
              </p>
            </div>
          )}

          {/* No assignment message */}
          {assignedDepartments.size === 0 && (
            <div className="cm-card text-center py-5">
              <FaExclamationCircle className="cm-empty-icon" />
              <h5>No Mentor Assigned</h5>
              <p className="cm-muted">
                You don't have any mentor assigned yet. Please contact your administrator.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ================= SUB COMPONENTS ================= */

const MentorCard = ({ 
  mentor,
  initials, 
  name, 
  role, 
  company,
  departments, 
  level, 
  experience,
  mentees,
  backgroundVerified,
  mentorshipCertified,
  isConnected,
  onConnect
}) => (
  <div className="col-lg-4 col-md-6">
    <div className="cm-mentor-card">
      <div className="d-flex justify-content-between align-items-start">
        <div className="d-flex gap-3">
          <div className="cm-avatar-light">{initials}</div>
          <div>
            <div className="d-flex align-items-center gap-1">
              <h6 className="mb-1">{name}</h6>
              {backgroundVerified && (
                <FaCheckCircle className="cm-verified-icon" title="Background Verified" />
              )}
              {mentorshipCertified && (
                <FaCertificate className="cm-certified-icon" title="Mentorship Certified" />
              )}
            </div>
            <p className="cm-muted small mb-1">{role}</p>
            {company && (
              <p className="cm-muted small mb-0">
                <FaBuilding className="me-1" /> {company}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Departments */}
      {departments.length > 0 && (
        <div className="mt-2">
          {departments.map((dept, idx) => (
            <span key={idx} className="cm-tag-light me-1">{dept}</span>
          ))}
        </div>
      )}

      <div className="d-flex justify-content-between mt-3">
        <div>
          <span className="cm-muted small">Level</span>
          <br />
          <span className="cm-stat-small">{level}</span>
        </div>
        <div>
          <span className="cm-muted small">Exp</span>
          <br />
          <span className="cm-stat-small">{experience}</span>
        </div>
        <div>
          <span className="cm-muted small">Mentees</span>
          <br />
          <span className="cm-stat-small">{mentees}</span>
        </div>
      </div>

      <button 
        className={`btn ${isConnected ? 'cm-connected-btn' : 'cm-connect-btn'} w-100 mt-3`}
        onClick={onConnect}
        disabled={isConnected}
      >
        {isConnected ? (
          <>
            <FaCheck className="me-2" />
            Connected
          </>
        ) : (
          'Connect'
        )}
      </button>
    </div>
  </div>
);

export default CandidateMentorship;