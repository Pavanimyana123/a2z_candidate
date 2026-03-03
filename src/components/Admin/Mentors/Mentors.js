import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Layout/Sidebar";
import Header from "../Layout/Header";
import "./Mentors.css";
import { FaEllipsisH, FaCheckCircle, FaEdit, FaTrash } from "react-icons/fa";
import Swal from 'sweetalert2';
import { BASE_URL } from "../../../ApiUrl";

const Mentors = () => {
  const [mentors, setMentors] = useState([]);
  const [levels, setLevels] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  const navigate = useNavigate();

  // Fetch all data (mentors, levels, departments)
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      // Fetch mentors
      const mentorsResponse = await fetch(`${BASE_URL}/api/mentor/mentors/`);
      if (!mentorsResponse.ok) {
        throw new Error(`Failed to fetch mentors: ${mentorsResponse.status}`);
      }
      const mentorsResult = await mentorsResponse.json();
      
      // Fetch levels for reference
      const levelsResponse = await fetch(`${BASE_URL}/api/admin/levels/`);
      const levelsResult = levelsResponse.ok ? await levelsResponse.json() : { data: [] };
      
      // Fetch departments for reference
      const deptsResponse = await fetch(`${BASE_URL}/api/admin/departments/`);
      const deptsResult = deptsResponse.ok ? await deptsResponse.json() : { data: [] };
      
      if (mentorsResult.status && mentorsResult.data) {
        setMentors(mentorsResult.data);
      } else {
        throw new Error(mentorsResult.message || 'Failed to fetch mentors');
      }
      
      // Set levels and departments for reference
      if (levelsResult.data) {
        setLevels(levelsResult.data);
      }
      
      if (deptsResult.data) {
        setDepartments(deptsResult.data);
      }
      
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching data:', err);
      
      Swal.fire({
        icon: 'error',
        title: 'Failed to Load Data',
        text: err.message || 'An error occurred while fetching data',
        timer: 3000,
        showConfirmButton: true
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddMentor = () => {
    navigate('/add-mentor');
  };

  const handleEdit = (mentorId) => {
    navigate(`/add-mentor/${mentorId}`);
  };

  const handleDelete = async (mentorId, mentorName) => {
    try {
      const response = await fetch(`${BASE_URL}/api/mentor/mentors/${mentorId}/`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Refresh the mentors list
      await fetchAllData();
      
      // Show success message
      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: `${mentorName} has been deleted successfully.`,
        timer: 2000,
        showConfirmButton: false
      });
      
    } catch (err) {
      console.error('Error deleting mentor:', err);
      
      Swal.fire({
        icon: 'error',
        title: 'Delete Failed',
        text: 'Failed to delete mentor. Please try again.',
        timer: 3000,
        showConfirmButton: true
      });
    }
  };

  const confirmDelete = (mentor) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete ${mentor.full_name}. This action cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete(mentor.mentor_id, mentor.full_name);
      }
    });
  };

  // Get level name by ID
  const getLevelName = (levelId) => {
    const level = levels.find(l => l.level_id === levelId);
    return level ? `${level.name} (${level.number})` : 'Unknown Level';
  };

  // Get department names by IDs
  const getDepartmentNames = (deptIds) => {
    if (!deptIds || !Array.isArray(deptIds)) return 'No specializations';
    return deptIds.map(id => {
      const dept = departments.find(d => d.department_id === id);
      return dept ? `${dept.name} (${dept.code})` : null;
    }).filter(Boolean).join(', ') || 'No specializations';
  };

  // Calculate stats from actual data
  const totalMentors = mentors.length;
  const activeMentors = mentors.filter(m => m.mentorship_status === 'active').length;
  const totalTrainees = mentors.reduce((total, mentor) => {
    return total + (mentor.current_trainees || 0);
  }, 0);
  
  // Calculate average approval rate
  const avgApprovalRate = mentors.length > 0 
    ? Math.round(mentors.reduce((sum, mentor) => {
        const rate = mentor.background_verified && mentor.mentorship_certified ? 100 : 50;
        return sum + rate;
      }, 0) / mentors.length)
    : 0;

  // Filter mentors based on search
  const filteredMentors = mentors.filter(mentor => {
    const searchLower = searchTerm.toLowerCase();
    const departmentNames = getDepartmentNames(mentor.specializations).toLowerCase();
    
    return (
      mentor.full_name?.toLowerCase().includes(searchLower) ||
      departmentNames.includes(searchLower) ||
      mentor.current_company?.toLowerCase().includes(searchLower) ||
      mentor.email?.toLowerCase().includes(searchLower) ||
      getLevelName(mentor.mentor_level).toLowerCase().includes(searchLower)
    );
  });

  // Get initials from name
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 3);
  };

  return (
    <div className="ta-layout-wrapper">
      <Sidebar />

      <div className="ta-main-wrapper">
        <Header />

        <div className="ta-content-area">
          <div className="mm-wrapper">
            {/* Page Header */}
            <div className="mm-header">
              <div>
                <h2>Mentor Management</h2>
                <p>Manage mentors and their assigned candidates ({totalMentors} total)</p>
              </div>
              <button onClick={handleAddMentor} className="btn btn-primary mm-add-btn">
                Add Mentor
              </button>
            </div>

            {/* Loading and Error States */}
            {loading && (
              <div className="text-center p-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Loading mentors...</p>
              </div>
            )}

            {error && (
              <div className="alert alert-danger" role="alert">
                <h5>Error Loading Data</h5>
                <p>{error}</p>
                <button onClick={fetchAllData} className="btn btn-primary mt-2">
                  Retry
                </button>
              </div>
            )}

            {/* Stats - Only show when not loading and no error */}
            {!loading && !error && (
              <div className="row g-4 mt-1">
                <StatBox title="Total Mentors" value={totalMentors.toString()} />
                <StatBox title="Active Mentors" value={activeMentors.toString()} />
                <StatBox title="Total Trainees" value={totalTrainees.toString()} />
                <StatBox title="Avg Approval Rate" value={`${avgApprovalRate}%`} />
              </div>
            )}

            {/* Search - Only show when not loading and no error */}
            {!loading && !error && (
              <div className="mm-search-box mt-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search mentors by name, specialization, company, or level..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            )}

            {/* Mentor Cards */}
            {!loading && !error && (
              <div className="row g-4 mt-3">
                {filteredMentors.length > 0 ? (
                  filteredMentors.map((mentor) => (
                    <MentorCard 
                      key={mentor.mentor_id}
                      mentor={mentor}
                      initials={getInitials(mentor.full_name)}
                      levelName={getLevelName(mentor.mentor_level)}
                      departmentNames={getDepartmentNames(mentor.specializations)}
                      onEdit={handleEdit}
                      onDelete={confirmDelete}
                    />
                  ))
                ) : (
                  <div className="col-12 text-center py-5">
                    <p className="text-muted">No mentors found matching your search.</p>
                    {searchTerm && (
                      <button 
                        className="btn btn-outline-secondary mt-2"
                        onClick={() => setSearchTerm('')}
                      >
                        Clear Search
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* -------- Components -------- */

const StatBox = ({ title, value }) => (
  <div className="col-lg-3 col-md-6">
    <div className="mm-stat-card">
      <p>{title}</p>
      <h3>{value}</h3>
    </div>
  </div>
);

const MentorCard = ({ mentor, initials, levelName, departmentNames, onEdit, onDelete }) => {
  // Calculate approval rate based on background verification and certification
  const approvalRate = mentor.background_verified && mentor.mentorship_certified ? 100 : 50;
  
  // Determine status class
  const statusClass = mentor.mentorship_status === 'active' ? 'active' : 'inactive';
  
  // Calculate pending validations
  const pendingValidations = (mentor.max_trainees || 0) - (mentor.current_trainees || 0);

  return (
    <div className="col-lg-4">
      <div className="mm-mentor-card">
        <div className="mm-card-header">
          <div className="mm-avatar">{initials}</div>
          <div className="mm-mentor-info">
            <h5>{mentor.full_name}</h5>
            <span className="mentor-level-badge" title="Mentor Level">
              {levelName}
            </span>
            <small className="text-muted d-block mt-1">
              {mentor.current_company || 'No company'}
            </small>
          </div>
          <div className="mm-card-actions">
            <FaEdit 
              className="action-icon edit-icon" 
              onClick={() => onEdit(mentor.mentor_id)}
              title="Edit Mentor"
            />
            <FaTrash 
              className="action-icon delete-icon" 
              onClick={() => onDelete(mentor)}
              title="Delete Mentor"
            />
          </div>
        </div>

        <div className="mm-card-body">
          <div className="specialization-info mb-2">
            <small className="text-muted">Specializations:</small>
            <p className="specialization-text">{departmentNames}</p>
          </div>

          <div className="row">
            <div className="col-6">
              <div className="mm-metric">
                <span>Current Trainees</span>
                <strong>{mentor.current_trainees || 0}</strong>
              </div>
            </div>
            <div className="col-6">
              <div className="mm-metric">
                <span>Max Capacity</span>
                <strong>{mentor.max_trainees || 0}</strong>
              </div>
            </div>
          </div>

          <div className="row mt-2">
            <div className="col-6">
              <div className="mm-metric">
                <span>Experience</span>
                <strong>{parseFloat(mentor.years_of_experience || 0).toFixed(1)} yrs</strong>
              </div>
            </div>
            <div className="col-6">
              <div className="mm-metric">
                <span>Pending</span>
                <strong>{pendingValidations}</strong>
              </div>
            </div>
          </div>

          <div className="mt-3">
            <div className="d-flex justify-content-between mb-1">
              <span>Approval Rate</span>
              <strong>{approvalRate}%</strong>
            </div>
            <div className="progress mm-progress">
              <div
                className="progress-bar"
                style={{ width: `${approvalRate}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mm-card-footer">
          <span className={`mm-status ${statusClass}`}>
            {mentor.mentorship_status}
          </span>
          <div className="mm-verification-badges">
            {mentor.background_verified && (
              <span className="badge bg-success me-1" title="Background Verified">
                ✓ BG
              </span>
            )}
            {mentor.mentorship_certified && (
              <span className="badge bg-info" title="Mentorship Certified">
                ★ Certified
              </span>
            )}
          </div>
          <button className="btn btn-outline-primary btn-sm">
            <FaCheckCircle /> Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default Mentors;