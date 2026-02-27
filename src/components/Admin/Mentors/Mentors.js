import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Layout/Sidebar";
import Header from "../Layout/Header";
import "./Mentors.css";
import { FaEllipsisH, FaCheckCircle, FaEdit, FaTrash } from "react-icons/fa";
import Swal from 'sweetalert2';

const Mentors = () => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  const navigate = useNavigate();

  // Fetch mentors data
  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://145.79.0.94:8000/mentors/');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.status && result.data) {
        setMentors(result.data);
      } else {
        throw new Error(result.message || 'Failed to fetch mentors');
      }
      
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching mentors:', err);
      
      Swal.fire({
        icon: 'error',
        title: 'Failed to Load Mentors',
        text: err.message || 'An error occurred while fetching mentors',
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
      const response = await fetch(`http://145.79.0.94:8000/mentors/${mentorId}/`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Refresh the mentors list
      await fetchMentors();
      
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
    return (
      mentor.full_name.toLowerCase().includes(searchLower) ||
      mentor.specializations?.toLowerCase().includes(searchLower) ||
      mentor.current_company?.toLowerCase().includes(searchLower) ||
      mentor.email?.toLowerCase().includes(searchLower)
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
              <div className="mm-loading">
                <p>Loading mentors...</p>
              </div>
            )}

            {error && (
              <div className="mm-error">
                <p>Error: {error}</p>
                <button onClick={fetchMentors} className="btn btn-secondary">
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

            {/* Search */}
            <div className="mm-search-box mt-4">
              <input
                type="text"
                className="form-control"
                placeholder="Search mentors by name, specialization, or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Mentor Cards */}
            {!loading && !error && (
              <div className="row g-4 mt-3">
                {filteredMentors.length > 0 ? (
                  filteredMentors.map((mentor) => (
                    <MentorCard 
                      key={mentor.mentor_id}
                      mentor={mentor}
                      initials={getInitials(mentor.full_name)}
                      onEdit={handleEdit}
                      onDelete={confirmDelete}
                    />
                  ))
                ) : (
                  <div className="col-12 text-center">
                    <p className="mm-no-results">No mentors found matching your search.</p>
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

const MentorCard = ({ mentor, initials, onEdit, onDelete }) => {
  // Calculate approval rate based on background verification and certification
  const approvalRate = mentor.background_verified && mentor.mentorship_certified ? 100 : 50;
  
  // Determine status class
  const statusClass = mentor.mentorship_status === 'active' ? 'active' : 'inactive';
  
  // Format department/specialization
  const department = mentor.specializations || 'No specialization';
  
  // Calculate pending validations
  const pendingValidations = (mentor.max_trainees || 0) - (mentor.current_trainees || 0);

  return (
    <div className="col-lg-4">
      <div className="mm-mentor-card">
        <div className="mm-card-header">
          <div className="mm-avatar">{initials}</div>
          <div className="mm-mentor-info">
            <h5>{mentor.full_name}</h5>
            <span>{department}</span>
            <small className="text-muted">{mentor.current_company || 'No company'}</small>
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
            {/* <FaEllipsisH className="action-icon more-icon" /> */}
          </div>
        </div>

        <div className="mm-card-body">
          <div className="mm-metric">
            <span>Current Trainees</span>
            <strong>{mentor.current_trainees || 0}</strong>
          </div>
          <div className="mm-metric">
            <span>Max Capacity</span>
            <strong>{mentor.max_trainees || 0}</strong>
          </div>
          
          <div className="mm-metric">
            <span>Years Experience</span>
            <strong>{parseFloat(mentor.years_of_experience || 0).toFixed(1)} years</strong>
          </div>

          <div className="mm-progress-wrap">
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