import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../Layout/Sidebar";
import Header from "../Layout/Header";
import "./AddMentor.css";
import Swal from 'sweetalert2';

const AddMentor = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get ID from URL for edit mode
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [error, setError] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  
  const [formData, setFormData] = useState({
    full_name: "",
    phone_number: "",
    email: "",
    mentor_level: 3,
    specializations: "",
    current_company: "",
    years_of_experience: "",
    max_trainees: "",
    current_trainees: "",
    mentorship_status: "active",
    background_verified: true,
    mentorship_certified: true
  });

  const [errors, setErrors] = useState({});

  // Fetch mentor data if in edit mode
  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      fetchMentorData();
    }
  }, [id]);

  const fetchMentorData = async () => {
    try {
      setFetchLoading(true);
      const response = await fetch(`http://145.79.0.94:8000/mentors/${id}/`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.status && result.data) {
        const mentorData = result.data;
        setFormData({
          full_name: mentorData.full_name || "",
          phone_number: mentorData.phone_number || "",
          email: mentorData.email || "",
          mentor_level: mentorData.mentor_level || 3,
          specializations: mentorData.specializations || "",
          current_company: mentorData.current_company || "",
          years_of_experience: mentorData.years_of_experience || "",
          max_trainees: mentorData.max_trainees || "",
          current_trainees: mentorData.current_trainees || "",
          mentorship_status: mentorData.mentorship_status || "active",
          background_verified: mentorData.background_verified ?? true,
          mentorship_certified: mentorData.mentorship_certified ?? true
        });
        console.log("✅ Mentor data loaded for edit:", mentorData);
      } else {
        throw new Error(result.message || 'Failed to fetch mentor data');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching mentor data:', err);
      
      Swal.fire({
        icon: 'error',
        title: 'Failed to Load Mentor',
        text: err.message || 'An error occurred while loading mentor data',
        timer: 3000,
        showConfirmButton: true
      });
    } finally {
      setFetchLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? value : value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.full_name?.trim()) {
      newErrors.full_name = "Full name is required";
    }

    if (!formData.phone_number?.trim()) {
      newErrors.phone_number = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone_number.replace(/\D/g, ''))) {
      newErrors.phone_number = "Please enter a valid 10-digit phone number";
    }

    if (!formData.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.mentor_level || formData.mentor_level < 1 || formData.mentor_level > 5) {
      newErrors.mentor_level = "Mentor level must be between 1 and 5";
    }

    if (!formData.specializations?.trim()) {
      newErrors.specializations = "Specializations are required";
    }

    if (!formData.years_of_experience) {
      newErrors.years_of_experience = "Years of experience is required";
    } else if (formData.years_of_experience < 0 || formData.years_of_experience > 50) {
      newErrors.years_of_experience = "Years of experience must be between 0 and 50";
    }

    if (!formData.max_trainees || formData.max_trainees < 1) {
      newErrors.max_trainees = "Max trainees must be at least 1";
    }

    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Failed',
        text: 'Please check all required fields and try again.',
        timer: 3000,
        showConfirmButton: true
      });
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError("");

    // Prepare payload according to the required format
    const payload = {
      full_name: formData.full_name,
      phone_number: formData.phone_number,
      email: formData.email,
      mentor_level: parseInt(formData.mentor_level),
      specializations: formData.specializations,
      current_company: formData.current_company || "",
      years_of_experience: parseFloat(formData.years_of_experience) || 0,
      max_trainees: parseInt(formData.max_trainees) || 0,
      current_trainees: parseInt(formData.current_trainees) || 0,
      mentorship_status: formData.mentorship_status,
      background_verified: formData.background_verified,
      mentorship_certified: formData.mentorship_certified
    };

    const method = isEditMode ? 'PUT' : 'POST';
    const url = isEditMode 
      ? `http://145.79.0.94:8000/mentors/${id}/` 
      : 'http://145.79.0.94:8000/mentors/';

    console.log(`📦 ${isEditMode ? 'Updating' : 'Submitting'} mentor data:`, payload);
    console.log(`📍 API Endpoint: ${url}`);

    try {
      const response = await fetch(url, {
        method: method,
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      console.log(`📥 Response status: ${response.status}`);

      if (!response.ok) {
        let errorMessage = `Failed to ${isEditMode ? 'update' : 'create'} mentor`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || JSON.stringify(errorData);
        } catch (parseError) {
          const errorText = await response.text();
          errorMessage = errorText || `HTTP error ${response.status}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log(`✅ Mentor ${isEditMode ? 'updated' : 'created'} successfully:`, data);
      
      // Show success message
      await Swal.fire({
        icon: 'success',
        title: isEditMode ? 'Updated!' : 'Created!',
        text: `Mentor has been ${isEditMode ? 'updated' : 'created'} successfully.`,
        timer: 2000,
        showConfirmButton: false
      });
      
      // Navigate back to mentors list
      navigate('/mentor');
    } catch (err) {
      console.error(`❌ Error ${isEditMode ? 'updating' : 'creating'} mentor:`, err);
      
      // Handle specific error messages
      let errorMessage = err.message || `Failed to ${isEditMode ? 'update' : 'create'} mentor. Please try again.`;
      
      if (err.message.includes('Failed to fetch')) {
        errorMessage = 'Unable to connect to the server. Please check if the server is running and CORS is properly configured.';
      } else if (err.message.includes('duplicate key') || err.message.includes('already exists')) {
        errorMessage = 'A mentor with this email or phone number already exists.';
      }
      
      setError(errorMessage);
      
      Swal.fire({
        icon: 'error',
        title: isEditMode ? 'Update Failed' : 'Creation Failed',
        text: errorMessage,
        timer: 3000,
        showConfirmButton: true
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/mentor');
  };

  if (fetchLoading) {
    return (
      <div className="ta-layout-wrapper">
        <Sidebar />
        <div className="ta-main-wrapper">
          <Header />
          <div className="ta-content-area">
            <div className="text-center p-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Loading mentor data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ta-layout-wrapper">
      <Sidebar />
      
      <div className="ta-main-wrapper">
        <Header />
        
        <div className="ta-content-area">
          <div className="am-wrapper">
            {/* Header */}
            <div className="am-header">
              <div>
                <h2>{isEditMode ? 'Edit Mentor' : 'Add New Mentor'}</h2>
                <p>{isEditMode ? 'Update the mentor details below' : 'Fill in the mentor details below'}</p>
              </div>
              <button 
                className="btn btn-outline-secondary"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </button>
            </div>

            {/* Error Message - Optional, still show for additional context */}
            {error && (
              <div className="alert alert-danger alert-dismissible fade show" role="alert">
                <strong>Error:</strong> {error}
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setError('')}
                  aria-label="Close"
                ></button>
              </div>
            )}

            {/* Form */}
            <div className="am-form-container">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  {/* Full Name */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      className={`form-control ${errors.full_name ? 'is-invalid' : ''}`}
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      placeholder="Enter full name"
                      disabled={loading}
                    />
                    {errors.full_name && (
                      <div className="invalid-feedback">{errors.full_name}</div>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Phone Number *</label>
                    <input
                      type="tel"
                      className={`form-control ${errors.phone_number ? 'is-invalid' : ''}`}
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleChange}
                      placeholder="Enter 10-digit phone number"
                      disabled={loading}
                    />
                    {errors.phone_number && (
                      <div className="invalid-feedback">{errors.phone_number}</div>
                    )}
                  </div>

                  {/* Email */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Email *</label>
                    <input
                      type="email"
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter email address"
                      disabled={loading}
                    />
                    {errors.email && (
                      <div className="invalid-feedback">{errors.email}</div>
                    )}
                  </div>

                  {/* Mentor Level */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Mentor Level *</label>
                    <select
                      className={`form-select ${errors.mentor_level ? 'is-invalid' : ''}`}
                      name="mentor_level"
                      value={formData.mentor_level}
                      onChange={handleChange}
                      disabled={loading}
                    >
                      <option value="1">Level 1 - Junior Mentor</option>
                      <option value="2">Level 2 - Associate Mentor</option>
                      <option value="3">Level 3 - Senior Mentor</option>
                      <option value="4">Level 4 - Lead Mentor</option>
                      <option value="5">Level 5 - Principal Mentor</option>
                    </select>
                    {errors.mentor_level && (
                      <div className="invalid-feedback">{errors.mentor_level}</div>
                    )}
                  </div>

                  {/* Specializations */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Specializations *</label>
                    <input
                      type="text"
                      className={`form-control ${errors.specializations ? 'is-invalid' : ''}`}
                      name="specializations"
                      value={formData.specializations}
                      onChange={handleChange}
                      placeholder="e.g., Manufacturing, Quality Control, Testing"
                      disabled={loading}
                    />
                    {errors.specializations && (
                      <div className="invalid-feedback">{errors.specializations}</div>
                    )}
                  </div>

                  {/* Current Company */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Current Company</label>
                    <input
                      type="text"
                      className="form-control"
                      name="current_company"
                      value={formData.current_company}
                      onChange={handleChange}
                      placeholder="Enter current company"
                      disabled={loading}
                    />
                  </div>

                  {/* Years of Experience */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Years of Experience *</label>
                    <input
                      type="number"
                      className={`form-control ${errors.years_of_experience ? 'is-invalid' : ''}`}
                      name="years_of_experience"
                      value={formData.years_of_experience}
                      onChange={handleChange}
                      placeholder="Enter years of experience"
                      min="0"
                      max="50"
                      step="0.1"
                      disabled={loading}
                    />
                    {errors.years_of_experience && (
                      <div className="invalid-feedback">{errors.years_of_experience}</div>
                    )}
                  </div>

                  {/* Max Trainees */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Max Trainees *</label>
                    <input
                      type="number"
                      className={`form-control ${errors.max_trainees ? 'is-invalid' : ''}`}
                      name="max_trainees"
                      value={formData.max_trainees}
                      onChange={handleChange}
                      placeholder="Maximum number of trainees"
                      min="1"
                      disabled={loading}
                    />
                    {errors.max_trainees && (
                      <div className="invalid-feedback">{errors.max_trainees}</div>
                    )}
                  </div>

                  {/* Current Trainees */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Current Trainees</label>
                    <input
                      type="number"
                      className="form-control"
                      name="current_trainees"
                      value={formData.current_trainees}
                      onChange={handleChange}
                      placeholder="Current number of trainees"
                      min="0"
                      disabled={loading}
                    />
                  </div>

                  {/* Mentorship Status */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Mentorship Status</label>
                    <select
                      className="form-select"
                      name="mentorship_status"
                      value={formData.mentorship_status}
                      onChange={handleChange}
                      disabled={loading}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="on-leave">On Leave</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>
                </div>

                {/* Verification Status Section */}
                <div className="row mt-3">
                  <div className="col-12">
                    <h5 className="mb-3">Verification Status</h5>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        name="background_verified"
                        checked={formData.background_verified}
                        onChange={(e) => setFormData(prev => ({ ...prev, background_verified: e.target.checked }))}
                        disabled={loading}
                        id="backgroundVerified"
                      />
                      <label className="form-check-label" htmlFor="backgroundVerified">
                        Background Verified
                      </label>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        name="mentorship_certified"
                        checked={formData.mentorship_certified}
                        onChange={(e) => setFormData(prev => ({ ...prev, mentorship_certified: e.target.checked }))}
                        disabled={loading}
                        id="mentorshipCertified"
                      />
                      <label className="form-check-label" htmlFor="mentorshipCertified">
                        Mentorship Certified
                      </label>
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="am-actions mt-4">
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary me-2"
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        {isEditMode ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (isEditMode ? 'Update Mentor' : 'Add Mentor')}
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

export default AddMentor;