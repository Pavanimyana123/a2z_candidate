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
  FaCheck
} from "react-icons/fa";
import { BASE_URL } from "../../../ApiUrl";
import "./CandidateMentorship.css";

const CandidateMentorship = () => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [yourMentor, setYourMentor] = useState(null);
  const [specializationsMap, setSpecializationsMap] = useState({});
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

  // Fetch specializations mapping (if needed)
  const fetchSpecializations = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/specializations/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      if (result.status && result.data) {
        const specMap = {};
        result.data.forEach(spec => {
          specMap[spec.id] = spec.name;
        });
        setSpecializationsMap(specMap);
      }
    } catch (err) {
      console.error('Error fetching specializations:', err);
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
        setMentors(result.data);
        
        // For demo purposes, assign first mentor as "Your Mentor"
        // In a real app, you'd fetch this based on candidate's assigned mentor
        if (result.data.length > 0) {
          setYourMentor(result.data[0]);
        }
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
    fetchSpecializations();
    fetchMentors();
  }, []);

  // Get specialization names from IDs
  const getSpecializations = (specializationIds) => {
    if (!specializationIds || !Array.isArray(specializationIds)) return [];
    return specializationIds.map(id => specializationsMap[id] || `Specialization ${id}`).filter(Boolean);
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

  if (loading) {
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

  if (error) {
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

  const levelBadge = yourMentor ? getLevelBadge(yourMentor.mentor_level) : null;

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

          {/* Your Mentor Section */}
          {yourMentor && (
            <div className="cm-card mb-4">
              <h5>Your Mentor</h5>
              <p className="cm-muted">Your assigned senior guide</p>

              <div className="cm-mentor-box">
                <div className="d-flex align-items-center gap-3">
                  <div className="cm-avatar">
                    {yourMentor.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>

                  <div>
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <h6 className="mb-0">{yourMentor.full_name}</h6>
                      {yourMentor.background_verified && (
                        <span className="cm-verified-badge" title="Background Verified">
                          <FaCheckCircle />
                        </span>
                      )}
                      {yourMentor.mentorship_certified && (
                        <span className="cm-certified-badge" title="Mentorship Certified">
                          <FaCertificate />
                        </span>
                      )}
                    </div>
                    
                    <p className="cm-muted mb-2">
                      <span 
                        className="cm-level-badge"
                        style={{ backgroundColor: levelBadge.bg, color: levelBadge.color }}
                      >
                        {levelBadge.text}
                      </span>
                      {yourMentor.current_company && (
                        <span className="cm-company ms-2">
                          <FaBuilding className="me-1" /> {yourMentor.current_company}
                        </span>
                      )}
                    </p>

                    {/* Specializations */}
                    <div className="cm-specializations">
                      {getSpecializations(yourMentor.specializations).map((spec, idx) => (
                        <span key={idx} className="cm-tag">{spec}</span>
                      ))}
                    </div>

                    {/* Contact Info */}
                    <div className="cm-contact-info mt-2">
                      {yourMentor.email && (
                        <span className="cm-contact-item">
                          <FaEnvelope /> {yourMentor.email}
                        </span>
                      )}
                      {yourMentor.phone_number && (
                        <span className="cm-contact-item">
                          <FaPhone /> {yourMentor.phone_number}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="d-flex gap-2">
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
                    <span className="cm-stat-value">{formatExperience(yourMentor.years_of_experience)}</span>
                  </div>
                </div>
                <div className="cm-stat-item">
                  <FaUsers className="cm-stat-icon" />
                  <div>
                    <span className="cm-stat-label">Trainees</span>
                    <span className="cm-stat-value">{yourMentor.current_trainees || 0} / {yourMentor.max_trainees || 0}</span>
                  </div>
                </div>
                <div className="cm-stat-item">
                  <FaStar className="cm-stat-icon" />
                  <div>
                    <span className="cm-stat-label">Mentor Level</span>
                    <span className="cm-stat-value">Level {yourMentor.mentor_level}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Milestones Section */}
          <div className="cm-card mb-4">
            <div className="d-flex justify-content-between">
              <div>
                <h5>Your Milestones</h5>
                <p className="cm-muted">Track your mentorship journey</p>
              </div>

              <div className="text-end">
                <h4>6/8</h4>
                <span className="cm-muted small">completed</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="cm-progress">
              <div className="cm-progress-fill" style={{ width: '75%' }} />
            </div>

            {/* Completed Items */}
            <Milestone title="Complete Safety Induction" date="Completed 20 Jun 2023" />
            <Milestone title="First Field Inspection" date="Completed 15 Jul 2023" />
            <Milestone title="Manufacturing Rotation" date="Completed 15 Oct 2023" />
            <Milestone title="Coating Rotation" date="Completed 16 Jan 2024" />
            <Milestone title="First Certification (API 510)" date="Completed 01 Aug 2023" />
            <Milestone title="Level 2 Promotion" date="Completed 17 Jan 2024" />

            {/* Pending */}
            <PendingMilestone index="7" title="Complete QA/QC Rotation" />
            <PendingMilestone index="8" title="Second Certification" />
          </div>

          {/* Available Mentors */}
          {mentors.length > 0 && (
            <div className="cm-card">
              <h5>Available Mentors</h5>
              <p className="cm-muted">
                Senior professionals you can connect with
              </p>

              <div className="row g-4 mt-2">
                {mentors.map((mentor) => {
                  const mentorLevelBadge = getLevelBadge(mentor.mentor_level);
                  const specializations = getSpecializations(mentor.specializations);
                  
                  return (
                    <MentorCard
                      key={mentor.id}
                      initials={mentor.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                      name={mentor.full_name}
                      role={mentorLevelBadge.text}
                      company={mentor.current_company}
                      specializations={specializations.slice(0, 2)} // Show first 2 specializations
                      level={`Level ${mentor.mentor_level}`}
                      experience={formatExperience(mentor.years_of_experience)}
                      mentees={`${mentor.current_trainees || 0} mentees`}
                      backgroundVerified={mentor.background_verified}
                      mentorshipCertified={mentor.mentorship_certified}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ================= SUB COMPONENTS ================= */

const Milestone = ({ title, date }) => (
  <div className="cm-milestone">
    <div className="d-flex align-items-center gap-3">
      <div className="cm-check">
        <FaCheckCircle />
      </div>

      <div>
        <strong>{title}</strong>
        <p className="cm-muted small">{date}</p>
      </div>
    </div>

    <span className="cm-approved">Approved</span>
  </div>
);

const PendingMilestone = ({ index, title }) => (
  <div className="cm-pending">
    <div className="cm-number">{index}</div>
    <strong>{title}</strong>
  </div>
);

const MentorCard = ({ 
  initials, 
  name, 
  role, 
  company,
  specializations, 
  level, 
  experience,
  mentees,
  backgroundVerified,
  mentorshipCertified
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

      {/* Specializations */}
      {specializations.length > 0 && (
        <div className="mt-2">
          {specializations.map((spec, idx) => (
            <span key={idx} className="cm-tag-light me-1">{spec}</span>
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

      <button className="btn cm-connect-btn w-100 mt-3">
        Connect
      </button>
    </div>
  </div>
);

export default CandidateMentorship;