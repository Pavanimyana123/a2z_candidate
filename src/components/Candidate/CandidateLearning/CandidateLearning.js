import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CandidateSidebar from "../Layout/CandidateSidebar";
import Header from "../Layout/CandidateHeader";
import {
  FaFilter,
  FaPlay,
  FaCheckCircle,
  FaClock,
  FaBook,
  FaHourglassHalf
} from "react-icons/fa";
import "./CandidateLearning.css";
import Swal from 'sweetalert2';
import { BASE_URL } from "../../../ApiUrl";

const CandidateLearningDashboard = () => {
  const [assignedModules, setAssignedModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredModules, setFilteredModules] = useState([]);
  const [selectedType, setSelectedType] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [candidate, setCandidate] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("candidate_user");

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        const actualId = parsedUser.user_id || parsedUser.id || parsedUser.pk;
        setCandidate({ ...parsedUser, id: actualId });
        fetchAssignedModules(actualId);
      } catch (err) {
        console.error("Error parsing candidate data:", err);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    filterModules();
  }, [assignedModules, selectedType]);

  const fetchAssignedModules = async (candidateId) => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/api/mentor/candidate-assigned-modules/?candidate_id=${candidateId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.status && result.data) {
        setAssignedModules(result.data);
        setFilteredModules(result.data);
      } else {
        throw new Error(result.message || 'Failed to fetch assigned modules');
      }
      
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching modules:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterModules = () => {
    if (selectedType === "All") {
      setFilteredModules(assignedModules);
    } else {
      const filtered = assignedModules.filter(item => 
        item.module_details?.module_type === selectedType
      );
      setFilteredModules(filtered);
    }
  };

  const updateModuleAssignmentStatus = async (assignmentId, action) => {
    try {
      const response = await fetch(`${BASE_URL}/api/mentor/module-assignments/${assignmentId}/status/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action })
      });

      if (!response.ok) {
        throw new Error(`Status update failed: ${response.status}`);
      }

      const result = await response.json();
      if (result.status) {
        setAssignedModules(prev => prev.map(item => (
          item.id === assignmentId ? { ...item, status: action === 'start' ? 'in_progress' : item.status } : item
        )));
        return true;
      }

      console.error('Status update error:', result);
      return false;
    } catch (err) {
      console.error('Error updating module assignment status:', err);
      return false;
    }
  };

  const handleModuleStart = async (item) => {
    const updated = await updateModuleAssignmentStatus(item.id, 'start');
    if (updated) {
      navigate(`/candidate-learning/module/${item.module_details?.id}`);
    }
  };

  // Helper functions
  const getModuleTypeDisplay = (type) => {
    const types = {
      'orientation': 'Orientation',
      'safety': 'Safety',
      'technical': 'Technical',
      'standard': 'Standards & Codes',
      'casestudy': 'Case Study',
      'assessment': 'Assessment'
    };
    return types[type] || type || 'General';
  };

  const getModuleTypeColor = (type) => {
    const colors = {
      'orientation': '#4299e1',
      'safety': '#f56565',
      'technical': '#9f7aea',
      'standard': '#48bb78',
      'casestudy': '#ed8936',
      'assessment': '#667eea'
    };
    return colors[type] || '#718096';
  };

  const calculateStats = () => {
    const total = assignedModules.length;
    const completed = assignedModules.filter(m => m.status === 'completed').length;
    const inProgress = assignedModules.filter(m => m.status === 'in_progress').length;
    
    const totalHours = assignedModules.reduce((acc, item) => {
      return acc + (parseFloat(item.module_details?.duration_hours) || 0);
    }, 0);
    
    return {
      total,
      completed,
      inProgress,
      totalHours: totalHours.toFixed(1)
    };
  };

  const stats = calculateStats();
  const moduleTypes = ["All", ...new Set(assignedModules.map(m => m.module_details?.module_type).filter(Boolean))];
  const continueModules = assignedModules.filter(m => m.status === 'in_progress' || (m.completion_percentage > 0 && m.status !== 'completed')).slice(0, 2);

  if (loading) {
    return (
      <div className="cld-layout-wrapper">
        <CandidateSidebar />
        <div className="cld-main-wrapper">
          <Header />
          <div className="cld-content-area">
            <div className="text-center p-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Loading learning modules...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cld-layout-wrapper">
        <CandidateSidebar />
        <div className="cld-main-wrapper">
          <Header />
          <div className="cld-content-area">
            <div className="text-center p-5">
              <div className="alert alert-danger">
                <h5>Error Loading Modules</h5>
                <p>{error}</p>
                <button 
                  className="btn btn-primary mt-3"
                  onClick={() => fetchAssignedModules(candidate?.id || candidate?.pk)}
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cld-layout-wrapper">
      {/* Sidebar */}
      <CandidateSidebar />

      {/* Main Content */}
      <div className="cld-main-wrapper">
        <Header />

        <div className="cld-content-area">
          <div className="container-fluid">
            {/* ================= PAGE HEADER ================= */}
            <div className="cld-header">
              <div>
                <h2>Learning & Upskilling</h2>
                <p className="cld-muted">
                  {assignedModules.length} modules assigned • Develop your competencies with structured training
                </p>
              </div>

              <button 
                className="btn cld-filter-btn"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FaFilter /> Filter Modules
              </button>
            </div>

            {/* Filter Bar */}
            {showFilters && (
              <div className="cld-filter-bar mb-4">
                <div className="d-flex gap-2 flex-wrap">
                  {moduleTypes.map(type => (
                    <button
                      key={type}
                      className={`cld-type-filter ${selectedType === type ? 'active' : ''}`}
                      onClick={() => setSelectedType(type)}
                    >
                      {type === 'All' ? 'All Types' : getModuleTypeDisplay(type)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ================= STATS ================= */}
            <div className="row g-4 mb-4">
              <StatCard 
                icon={<FaCheckCircle />} 
                value={stats.completed.toString()} 
                label="Completed" 
                color="#2d8b85"
              />
              <StatCard 
                icon={<FaClock />} 
                value={stats.inProgress.toString()} 
                label="In Progress" 
                color="#1f3a5f"
              />
              <StatCard 
                icon={<FaHourglassHalf />} 
                value={`${stats.totalHours}h`} 
                label="Total Time" 
                color="#9f7aea"
              />
              <StatCard 
                icon={<FaBook />} 
                value={stats.total.toString()} 
                label="Total Assigned" 
                color="#ed8936"
              />
            </div>

            {/* ================= CONTINUE LEARNING SECTION ================= */}
            {continueModules.length > 0 && (
              <div className="cld-card mb-4">
                <div className="mb-3">
                  <h4>Continue Learning</h4>
                  <p className="cld-muted">Pick up where you left off</p>
                </div>

                <div className="row g-4">
                  {continueModules.map((item) => (
                    <ContinueCard
                      key={item.id}
                      title={item.module_details?.title}
                      desc={item.module_details?.description}
                      hours={`${item.module_details?.duration_hours} hours`}
                      type={item.module_details?.module_type}
                      typeDisplay={getModuleTypeDisplay(item.module_details?.module_type)}
                      typeColor={getModuleTypeColor(item.module_details?.module_type)}
                      progress={item.completion_percentage}
                      onContinue={() => navigate(`/candidate-learning/module/${item.module_details?.id}`)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* ================= ALL LEARNING MODULES ================= */}
            <div className="cld-card mb-4">
              <div className="mb-3">
                <h4>Your Learning Modules</h4>
                <p className="cld-muted">
                  {filteredModules.length} modules assigned • Browse your training content
                </p>
              </div>

              {filteredModules.length > 0 ? (
                filteredModules.map((item) => (
                  <ModuleRow
                    key={item.id}
                    id={item.module_details?.id}
                    title={item.module_details?.title}
                    type={item.module_details?.module_type}
                    typeDisplay={getModuleTypeDisplay(item.module_details?.module_type)}
                    typeColor={getModuleTypeColor(item.module_details?.module_type)}
                    hours={`${item.module_details?.duration_hours} hours`}
                    description={item.module_details?.description}
                    hasAssessment={item.module_details?.has_assessment}
                    isMandatory={item.module_details?.is_mandatory}
                    passingScore={item.module_details?.passing_score}
                    completed={item.status === 'completed'}
                    progress={item.completion_percentage}
                    status={item.status}
                    onStart={() => handleModuleStart(item)}
                    onView={() => navigate(`/candidate-learning/module/${item.module_details?.id}`)}
                  />
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="cld-muted">No modules assigned yet.</p>
                </div>
              )}
            </div>

            {/* ================= SKILL MATRIX ================= */}
            {/* <div className="cld-card">
              <div className="mb-3">
                <h4>Your Skill Matrix</h4>
                <p className="cld-muted">Competency levels by module type</p>
              </div>

              <div className="row g-4">
                {moduleTypes.filter(t => t !== 'All').map(type => (
                  <SkillBar 
                    key={type}
                    title={getModuleTypeDisplay(type)}
                    value={30 + Math.floor(Math.random() * 50)} // Simulate skill levels
                    color={getModuleTypeColor(type)}
                  />
                ))}
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ================= SUB COMPONENTS ================= */

const StatCard = ({ icon, value, label, color }) => (
  <div className="col-lg-3 col-md-6">
    <div className="cld-stat-card">
      <div className="cld-stat-icon" style={{ color: color }}>{icon}</div>
      <h3 style={{ color: color }}>{value}</h3>
      <p>{label}</p>
    </div>
  </div>
);

const ContinueCard = ({ title, desc, hours, type, typeDisplay, typeColor, progress, onContinue }) => (
  <div className="col-lg-6">
    <div className="cld-continue-card" onClick={onContinue} style={{ cursor: 'pointer' }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <span style={{ color: '#6c7a89', fontWeight: '500' }}>{hours}</span>
      </div>

      <h5>{title}</h5>
      <p>{desc && desc.length > 100 ? desc.substring(0, 100) + '...' : desc || 'No description available'}</p>

      <div className="cld-progress">
        <div style={{ width: `${progress}%`, backgroundColor: typeColor }} />
      </div>

      <button className="btn cld-primary-btn" style={{ backgroundColor: typeColor }} onClick={(e) => { e.stopPropagation(); onContinue(); }}>
        <FaPlay /> Continue
      </button>
    </div>
  </div>
);

const ModuleRow = ({ 
  id,
  title, 
  type, 
  typeDisplay, 
  typeColor, 
  hours, 
  description, 
  hasAssessment, 
  isMandatory, 
  passingScore,
  completed, 
  progress, 
  status,
  onStart,
  onView
}) => (
  <div className="cld-module-row" onClick={onView} style={{ cursor: 'pointer' }}>
    <div className="cld-module-left">
      {completed ? (
        <FaCheckCircle className="cld-green" style={{ color: '#2d8b85' }} />
      ) : progress ? (
        <FaClock style={{ color: typeColor }} />
      ) : (
        <FaClock style={{ color: '#a0aec0' }} />
      )}

      <div>
        <div className="d-flex align-items-center gap-2 mb-1">
          <h6 className="mb-0">{title}</h6>
          {isMandatory && (
            <span className="cld-badge mandatory" style={{ fontSize: '10px' }}>Required</span>
          )}
          {hasAssessment && (
            <span className="cld-badge assessment" style={{ fontSize: '10px' }}>
              Assessment {passingScore && `(${passingScore}%)`}
            </span>
          )}
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className="cld-badge small" style={{ 
            backgroundColor: `${typeColor}20`, 
            color: typeColor,
            border: `1px solid ${typeColor}40`
          }}>
            {typeDisplay}
          </span>
          {description && (
            <small className="text-muted" style={{ fontSize: '12px' }}>
              {description.length > 50 ? description.substring(0, 50) + '...' : description}
            </small>
          )}
        </div>
      </div>
    </div>

    <div className="cld-module-right">
      {progress > 0 && (
        <div className="cld-mini-progress">
          <div style={{ width: `${progress}%`, backgroundColor: typeColor }} />
          <span style={{ color: typeColor }}>{progress}%</span>
        </div>
      )}

      <span style={{ color: '#6c7a89', minWidth: '60px' }}>{hours}</span>

      {completed ? (
        <button className="btn btn-light" style={{ minWidth: '90px' }} onClick={(e) => { e.stopPropagation(); onView(); }}>
          Review
        </button>
      ) : status === 'in_progress' ? (
        <button className="btn cld-primary-btn" style={{ minWidth: '90px', backgroundColor: typeColor }} onClick={(e) => { e.stopPropagation(); onView(); }}>
          <FaPlay style={{ fontSize: '12px' }} /> Resume
        </button>
      ) : progress > 0 ? (
        <button className="btn cld-primary-btn" style={{ minWidth: '90px', backgroundColor: typeColor }} onClick={(e) => { e.stopPropagation(); onView(); }}>
          <FaPlay style={{ fontSize: '12px' }} /> Continue
        </button>
      ) : (
        <button className="btn cld-primary-btn" style={{ minWidth: '90px', backgroundColor: typeColor }} onClick={(e) => { e.stopPropagation(); onStart(); }}>
          Start
        </button>
      )}
    </div>
  </div>
);

// const SkillBar = ({ title, value, color }) => (
//   <div className="col-lg-4 col-md-6">
//     <div className="cld-skill-box">
//       <div className="d-flex justify-content-between align-items-center mb-2">
//         <span>{title}</span>
//         <strong style={{ color: color }}>{value}%</strong>
//       </div>
//       <div className="cld-progress">
//         <div style={{ width: `${value}%`, backgroundColor: color }} />
//       </div>
//     </div>
//   </div>
// );

export default CandidateLearningDashboard;