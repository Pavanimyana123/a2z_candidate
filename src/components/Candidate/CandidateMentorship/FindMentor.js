import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CandidateSidebar from '../Layout/CandidateSidebar';
import Header from '../Layout/CandidateHeader';
import { FaSpinner, FaUserGraduate, FaUserTie, FaBuilding, FaLevelUpAlt } from 'react-icons/fa';
import "./FindMentor.css";
import Swal from 'sweetalert2';
import { BASE_URL } from "../../../ApiUrl";

const MentorRequestForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [mentors, setMentors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [levels, setLevels] = useState([]);
  const [candidateData, setCandidateData] = useState(null);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    mentor_status: 'requested',
    responded_at: '',
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    status: 'active',
    current_progress: 0,
    completion_percentage: 0,
    mentor: '',
    candidate: '',
    department: '',
    target_level: ''
  });

  // Get candidate data from localStorage
  useEffect(() => {
    const getCandidateData = () => {
      try {
        const candidateUser = localStorage.getItem('candidate_user');
        if (candidateUser) {
          const parsed = JSON.parse(candidateUser);
          console.log('Candidate data from localStorage:', parsed);
          setCandidateData(parsed);
          
          // Set candidate ID in form
          setFormData(prev => ({
            ...prev,
            candidate: parsed.user_id || ''
          }));
        } else {
          console.error('No candidate data found in localStorage');
          Swal.fire({
            icon: 'error',
            title: 'Authentication Error',
            text: 'Please login as a candidate to continue.',
            timer: 3000,
            showConfirmButton: true
          }).then(() => {
            navigate('/login');
          });
        }
      } catch (error) {
        console.error('Error parsing candidate data:', error);
      }
    };

    getCandidateData();
  }, [navigate]);

  // Fetch mentors on component mount
  useEffect(() => {
    fetchMentors();
    fetchDepartments();
    fetchLevels();
  }, []);

  const fetchMentors = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/api/mentor/mentors/`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.status && result.data) {
        // Filter active mentors
        const activeMentors = result.data.filter(mentor => mentor.mentorship_status === 'active');
        setMentors(activeMentors);
        console.log('✅ Mentors fetched successfully:', activeMentors);
      } else {
        throw new Error(result.message || 'Failed to fetch mentors');
      }
    } catch (err) {
      console.error('Error fetching mentors:', err);
      Swal.fire({
        icon: 'error',
        title: 'Failed to Load Mentors',
        text: err.message || 'An error occurred while loading mentors',
        timer: 3000,
        showConfirmButton: true
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/admin/departments/`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.status && result.data) {
        const activeDepartments = result.data.filter(dept => dept.is_active);
        setDepartments(activeDepartments);
        console.log('✅ Departments fetched successfully:', activeDepartments);
      }
    } catch (err) {
      console.error('Error fetching departments:', err);
      Swal.fire({
        icon: 'error',
        title: 'Failed to Load Departments',
        text: err.message || 'An error occurred while loading departments',
        timer: 3000,
        showConfirmButton: true
      });
    }
  };

  const fetchLevels = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/admin/levels/`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.status && result.data) {
        const activeLevels = result.data.filter(level => level.is_active);
        setLevels(activeLevels);
        console.log('✅ Levels fetched successfully:', activeLevels);
      }
    } catch (err) {
      console.error('Error fetching levels:', err);
      Swal.fire({
        icon: 'error',
        title: 'Failed to Load Levels',
        text: err.message || 'An error occurred while loading levels',
        timer: 3000,
        showConfirmButton: true
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.mentor) {
      newErrors.mentor = "Please select a mentor";
    }

    if (!formData.department) {
      newErrors.department = "Please select a department";
    }

    if (!formData.target_level) {
      newErrors.target_level = "Please select a target level";
    }

    if (!formData.start_date) {
      newErrors.start_date = "Start date is required";
    }

    if (formData.end_date && new Date(formData.end_date) < new Date(formData.start_date)) {
      newErrors.end_date = "End date cannot be before start date";
    }

    if (formData.current_progress < 0 || formData.current_progress > 100) {
      newErrors.current_progress = "Progress must be between 0 and 100";
    }

    if (formData.completion_percentage < 0 || formData.completion_percentage > 100) {
      newErrors.completion_percentage = "Completion percentage must be between 0 and 100";
    }

    const isValid = Object.keys(newErrors).length === 0;
    console.log('Validation result:', isValid ? 'PASSED' : 'FAILED', newErrors);
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Failed',
        text: 'Please check all required fields and try again.',
        timer: 3000,
        showConfirmButton: true
      });
      return;
    }

    setSubmitting(true);

    // Prepare payload
    const payload = {
      mentor_status: formData.mentor_status,
      start_date: formData.start_date,
      status: formData.status,
      current_progress: parseInt(formData.current_progress) || 0,
      completion_percentage: parseInt(formData.completion_percentage) || 0,
      mentor: parseInt(formData.mentor),
      candidate: parseInt(formData.candidate),
      department: parseInt(formData.department),
      target_level: parseInt(formData.target_level)
    };

    // Add optional fields if they have values
    if (formData.end_date) {
      payload.end_date = formData.end_date;
    }

    if (formData.mentor_status === 'accepted' && formData.responded_at) {
      payload.responded_at = formData.responded_at;
    }

    console.log('📦 Submitting payload:', payload);

    try {
      const response = await fetch(`${BASE_URL}/api/mentor/mentorship-requests/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const responseData = await response.json().catch(() => null);

      if (!response.ok) {
        if (responseData && responseData.errors) {
          const serverErrors = {};
          Object.keys(responseData.errors).forEach(key => {
            serverErrors[key] = Array.isArray(responseData.errors[key]) 
              ? responseData.errors[key][0] 
              : responseData.errors[key];
          });
          setErrors(serverErrors);
          throw new Error('Please check the form for errors');
        }
        throw new Error(responseData?.message || 'Failed to create mentorship request');
      }

      await Swal.fire({
        icon: 'success',
        title: 'Request Sent!',
        text: 'Your mentorship request has been sent successfully.',
        timer: 2000,
        showConfirmButton: false
      });
      
      navigate('/candidate-mentorship');
    } catch (err) {
      console.error('❌ Error submitting request:', err);
      
      Swal.fire({
        icon: 'error',
        title: 'Submission Failed',
        text: err.message || 'Failed to submit mentorship request. Please try again.',
        timer: 3000,
        showConfirmButton: true
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/candidate-mentorship');
  };

  // Get mentor status label and description
  const getMentorStatusDetails = (status) => {
    switch(status) {
      case 'requested':
        return {
          label: 'Requested',
          description: 'Pending Mentor Response',
          color: '#f59e0b'
        };
      case 'accepted':
        return {
          label: 'Accepted',
          description: 'Mentorship Active',
          color: '#10b981'
        };
      case 'rejected':
        return {
          label: 'Rejected',
          description: 'Mentor Declined',
          color: '#ef4444'
        };
      default:
        return {
          label: 'Requested',
          description: 'Pending Mentor Response',
          color: '#f59e0b'
        };
    }
  };

  // Get level display
  const getLevelDisplay = (level) => {
    return `${level.name} (Level ${level.number})`;
  };

  // Get mentor display
  const getMentorDisplay = (mentor) => {
    return `${mentor.full_name} ${mentor.current_company ? `- ${mentor.current_company}` : ''} (Level ${mentor.mentor_level})`;
  };

  return (
    <div className="ta-layout-wrapper">
      <CandidateSidebar />
      
      <div className="ta-main-wrapper">
        <Header />
        
        <div className="ta-content-area">
          <div className="mrf-wrapper">
            {/* Header */}
            <div className="mrf-header">
              <div>
                <h2>Request Mentorship</h2>
                <p>Fill in the details to request a mentor</p>
              </div>
            </div>

            {/* Candidate Info Card */}
            {candidateData && (
              <div className="mrf-candidate-card">
                <div className="mrf-candidate-avatar">
                  {candidateData.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div className="mrf-candidate-details">
                  <h5>{candidateData.full_name}</h5>
                  <p>{candidateData.email} | {candidateData.phone_number}</p>
                  <span className="mrf-candidate-badge">Candidate ID: {candidateData.user_id}</span>
                </div>
              </div>
            )}

            {/* Form */}
            <div className="mrf-form-container">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  {/* Mentor Status */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      <FaUserTie className="me-2" />
                      Mentor Status *
                    </label>
                    <select
                      className="form-select"
                      name="mentor_status"
                      value={formData.mentor_status}
                      onChange={handleChange}
                      disabled={submitting}
                    >
                      <option value="requested">Requested - Pending Mentor Response</option>
                      <option value="accepted">Accepted - Mentorship Active</option>
                      <option value="rejected">Rejected - Mentor Declined</option>
                    </select>
                    <small className="text-muted">
                      {getMentorStatusDetails(formData.mentor_status).description}
                    </small>
                  </div>

                  {/* Mentor Selection */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      <FaUserGraduate className="me-2" />
                      Select Mentor *
                    </label>
                    <select
                      className={`form-select ${errors.mentor ? 'is-invalid' : ''}`}
                      name="mentor"
                      value={formData.mentor}
                      onChange={handleChange}
                      disabled={submitting || loading || mentors.length === 0}
                    >
                      <option value="">-- Select Mentor --</option>
                      {mentors.map((mentor) => (
                        <option key={mentor.id} value={mentor.id}>
                          {getMentorDisplay(mentor)}
                        </option>
                      ))}
                    </select>
                    {errors.mentor && (
                      <div className="invalid-feedback">{errors.mentor}</div>
                    )}
                    {mentors.length === 0 && !loading && (
                      <small className="text-warning">No active mentors available</small>
                    )}
                  </div>

                  {/* Department */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      <FaBuilding className="me-2" />
                      Department *
                    </label>
                    <select
                      className={`form-select ${errors.department ? 'is-invalid' : ''}`}
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      disabled={submitting || departments.length === 0}
                    >
                      <option value="">-- Select Department --</option>
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name} ({dept.code})
                        </option>
                      ))}
                    </select>
                    {errors.department && (
                      <div className="invalid-feedback">{errors.department}</div>
                    )}
                  </div>

                  {/* Target Level */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      <FaLevelUpAlt className="me-2" />
                      Target Level *
                    </label>
                    <select
                      className={`form-select ${errors.target_level ? 'is-invalid' : ''}`}
                      name="target_level"
                      value={formData.target_level}
                      onChange={handleChange}
                      disabled={submitting || levels.length === 0}
                    >
                      <option value="">-- Select Target Level --</option>
                      {levels.map((level) => (
                        <option key={level.id} value={level.id}>
                          {getLevelDisplay(level)}
                        </option>
                      ))}
                    </select>
                    {errors.target_level && (
                      <div className="invalid-feedback">{errors.target_level}</div>
                    )}
                  </div>

                  {/* Start Date */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Start Date *</label>
                    <input
                      type="date"
                      className={`form-control ${errors.start_date ? 'is-invalid' : ''}`}
                      name="start_date"
                      value={formData.start_date}
                      onChange={handleChange}
                      disabled={submitting}
                    />
                    {errors.start_date && (
                      <div className="invalid-feedback">{errors.start_date}</div>
                    )}
                  </div>

                  {/* End Date */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">End Date (Optional)</label>
                    <input
                      type="date"
                      className={`form-control ${errors.end_date ? 'is-invalid' : ''}`}
                      name="end_date"
                      value={formData.end_date}
                      onChange={handleChange}
                      min={formData.start_date}
                      disabled={submitting}
                    />
                    {errors.end_date && (
                      <div className="invalid-feedback">{errors.end_date}</div>
                    )}
                  </div>

                  {/* Status */}
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Mentorship Status</label>
                    <select
                      className="form-select"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      disabled={submitting}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="completed">Completed</option>
                      <option value="on_hold">On Hold</option>
                    </select>
                  </div>

                  {/* Current Progress */}
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Current Progress (0-100)</label>
                    <input
                      type="number"
                      className={`form-control ${errors.current_progress ? 'is-invalid' : ''}`}
                      name="current_progress"
                      value={formData.current_progress}
                      onChange={handleChange}
                      min="0"
                      max="100"
                      step="1"
                      placeholder="Enter progress value"
                      disabled={submitting}
                    />
                    {errors.current_progress && (
                      <div className="invalid-feedback">{errors.current_progress}</div>
                    )}
                  </div>

                  {/* Completion Percentage */}
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Completion Percentage</label>
                    <input
                      type="number"
                      className={`form-control ${errors.completion_percentage ? 'is-invalid' : ''}`}
                      name="completion_percentage"
                      value={formData.completion_percentage}
                      onChange={handleChange}
                      min="0"
                      max="100"
                      step="1"
                      placeholder="Enter completion percentage"
                      disabled={submitting}
                    />
                    {errors.completion_percentage && (
                      <div className="invalid-feedback">{errors.completion_percentage}</div>
                    )}
                  </div>

                  {/* Responded At (Hidden by default, shown when status is accepted) */}
                  {formData.mentor_status === 'accepted' && (
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Response Date & Time</label>
                      <input
                        type="datetime-local"
                        className="form-control"
                        name="responded_at"
                        value={formData.responded_at}
                        onChange={handleChange}
                        disabled={submitting}
                      />
                    </div>
                  )}
                </div>

                {/* Form Actions */}
                <div className="mrf-actions">
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary me-2"
                    onClick={handleCancel}
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn mrf-primary-btn"
                    disabled={submitting || loading}
                  >
                    {submitting ? (
                      <>
                        <FaSpinner className="mrf-spinner me-2" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Request'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorRequestForm;