// CompetenceForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Layout/CandidateSidebar';
import Header from '../Layout/CandidateHeader';
import "./AddCandidateCompetency.css";
import Swal from 'sweetalert2';
import { BASE_URL } from "../../../ApiUrl";

const CompetenceForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [levels, setLevels] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [errors, setErrors] = useState({});

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

  const [formData, setFormData] = useState({
    competency_name: '',
    candidate: getCandidateId(), // Auto-filled from localStorage (hidden)
    department: '',
    level: ''
  });

  // Fetch departments on component mount
  useEffect(() => {
    fetchDepartments();
    fetchLevels();
  }, []);

  const fetchDepartments = async () => {
    try {
      setFetchLoading(true);
      const response = await fetch(`${BASE_URL}/api/admin/departments/`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.status && result.data) {
        setDepartments(result.data);
        console.log('✅ Departments fetched successfully:', result.data);
      } else {
        throw new Error(result.message || 'Failed to fetch departments');
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
    } finally {
      setFetchLoading(false);
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
        // Filter active levels
        const activeLevels = result.data.filter(level => level.is_active);
        setLevels(activeLevels);
        console.log('✅ Levels fetched successfully:', activeLevels);
        
        // Find and set default level (level with number 0 - Trainee)
        const defaultLevel = activeLevels.find(level => level.number === 0);
        if (defaultLevel) {
          setFormData(prev => ({
            ...prev,
            level: defaultLevel.id // Store the ID, not the display text
          }));
          console.log('✅ Default level set:', defaultLevel.name, 'with ID:', defaultLevel.id);
        }
      } else {
        throw new Error(result.message || 'Failed to fetch levels');
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
    
    // For department and level, we want to store the ID as integer
    // The value from select is already the ID (since we set value={dept.id})
    let processedValue = value;
    
    // If it's department or level, convert to integer
    if (name === 'department' || name === 'level') {
      processedValue = value ? parseInt(value) : '';
    }
    
    console.log(`Field changed - ${name}:`, processedValue);
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));

    // Update competency_name when department or level changes
    if (name === 'department' || name === 'level') {
      // Get the current values (using the updated value for the changed field)
      const currentDeptId = name === 'department' ? processedValue : formData.department;
      const currentLevelId = name === 'level' ? processedValue : formData.level;
      
      updateCompetencyName(currentDeptId, currentLevelId);
    }
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const updateCompetencyName = (deptId, levelId) => {
    // Only proceed if both IDs are valid numbers
    if (!deptId || !levelId) return;
    
    // Find department by id
    const selectedDept = departments.find(d => d.id === deptId);
    // Find level by id
    const selectedLevel = levels.find(l => l.id === levelId);
    
    if (selectedDept && selectedLevel) {
      const competencyName = `${selectedLevel.name} - ${selectedDept.name}`;
      setFormData(prev => ({
        ...prev,
        competency_name: competencyName
      }));
      console.log('✅ Competency name generated:', competencyName);
    }
  };

  const validateForm = () => {
    console.log('Starting form validation...');
    console.log('Current form data:', formData);
    
    const newErrors = {};

    if (!formData.competency_name?.trim()) {
      newErrors.competency_name = "Competency name is required";
      console.log('Validation failed: Competency name is empty');
    }

    if (!formData.candidate) {
      newErrors.candidate = "Candidate ID is required";
      console.log('Validation failed: Candidate ID is empty');
    }

    if (!formData.department) {
      newErrors.department = "Department is required";
      console.log('Validation failed: Department is empty');
    }

    if (!formData.level) {
      newErrors.level = "Level is required";
      console.log('Validation failed: Level is empty');
    }

    const isValid = Object.keys(newErrors).length === 0;
    console.log('Validation result:', isValid ? 'PASSED' : 'FAILED');
    if (!isValid) {
      console.log('Validation errors:', newErrors);
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('='.repeat(50));
    console.log('COMPETENCE FORM SUBMISSION STARTED');
    console.log('='.repeat(50));
    
    console.log('Validating form...');
    if (!validateForm()) {
      console.log('❌ Form validation failed. Submission aborted.');
      
      Swal.fire({
        icon: 'error',
        title: 'Validation Failed',
        text: 'Please check all required fields and try again.',
        timer: 3000,
        showConfirmButton: true
      });
      return;
    }

    console.log('✅ Form validation passed. Preparing payload...');
    setLoading(true);

    // Prepare payload with proper integer IDs
    const payload = {
      competency_name: formData.competency_name,
      candidate: parseInt(formData.candidate), // Ensure integer
      department: parseInt(formData.department), // Ensure integer
      level: parseInt(formData.level) // Ensure integer
    };

    console.log('📦 Payload prepared for submission:');
    console.log(JSON.stringify(payload, null, 2));
    
    const url = `${BASE_URL}/api/candidate/competencies/`;
    
    console.log(`📍 API Endpoint: ${url}`);
    console.log(`📤 Sending POST request...`);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      console.log(`📥 Response received - Status: ${response.status} ${response.statusText}`);

      const responseData = await response.json().catch(() => null);

      if (!response.ok) {
        console.error('❌ Server returned error:', responseData);
        
        // Handle field-specific validation errors from server
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
        
        throw new Error(responseData?.message || 'Failed to create competence');
      }

      console.log('✅ Competence created successfully!');
      console.log('📋 Server response:', responseData);
      
      // Show success message
      await Swal.fire({
        icon: 'success',
        title: 'Created!',
        text: 'Competence has been created successfully.',
        timer: 2000,
        showConfirmButton: false
      });
      
      console.log('🔄 Navigating back...');
      navigate(-1); // Go back to previous page
    } catch (err) {
      console.error('❌ Error creating competence:');
      console.error('Error name:', err.name);
      console.error('Error message:', err.message);
      console.error('Full error object:', err);
      
      Swal.fire({
        icon: 'error',
        title: 'Creation Failed',
        text: err.message || 'Failed to create competence. Please try again.',
        timer: 3000,
        showConfirmButton: true
      });
    } finally {
      console.log('🏁 Form submission process completed.');
      console.log('='.repeat(50));
      setLoading(false);
    }
  };

  const handleCancel = () => {
    console.log('Cancel button clicked - navigating back');
    navigate(-1);
  };

  // Get department display name with code
  const getDepartmentDisplay = (dept) => {
    return `${dept.name} (${dept.code})`;
  };

  // Get level display name with number
  const getLevelDisplay = (level) => {
    return `${level.name} (Level ${level.number})`;
  };

  // Helper to get current department name for display
  const getCurrentDepartmentName = () => {
    if (!formData.department) return '';
    const dept = departments.find(d => d.id === formData.department);
    return dept ? getDepartmentDisplay(dept) : '';
  };

  // Helper to get current level name for display
  const getCurrentLevelName = () => {
    if (!formData.level) return '';
    const level = levels.find(l => l.id === formData.level);
    return level ? getLevelDisplay(level) : '';
  };

  if (fetchLoading) {
    return (
      <div className="ta-layout-wrapper">
        <Sidebar />
        <div className="ta-main-wrapper">
          <Header />
          <div className="ta-content-area">
            <div className="competence-loading-container">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="competence-loading-text">Loading departments...</p>
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
          <div className="competence-form-wrapper">
            {/* Header */}
            <div className="competence-form-header">
              <div>
                <h2 className="competence-form-title">Add New Competence</h2>
                <p className="competence-form-subtitle">Fill in the competence details below</p>
              </div>
              <button 
                className="competence-cancel-btn"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </button>
            </div>

            {/* Form */}
            <div className="competence-form-container">
              <form onSubmit={handleSubmit} className="competence-form">
                {/* Hidden Candidate ID field - sent in payload but not shown */}
                <input
                  type="hidden"
                  name="candidate"
                  value={formData.candidate}
                />

                {/* First Row - Competency Name (Full Width) */}
                <div className="competence-form-row">
                  <div className="competence-form-group competence-full-width">
                    <label className="competence-form-label">
                      Competency Name <span className="competence-required-star">*</span>
                    </label>
                    <input
                      type="text"
                      className={`competence-form-input ${errors.competency_name ? 'competence-input-error' : ''}`}
                      name="competency_name"
                      value={formData.competency_name || ''}
                      onChange={handleChange}
                      placeholder="Auto-generated from Department and Level"
                      readOnly
                    />
                    {errors.competency_name && (
                      <div className="competence-error-message">{errors.competency_name}</div>
                    )}
                    <small className="competence-field-hint">
                      This field is auto-generated based on selected Department and Level
                    </small>
                  </div>
                </div>

                {/* Second Row - Department and Level (Two Columns) */}
                <div className="competence-form-row">
                  {/* Department Dropdown - Fixed: using id */}
                  <div className="competence-form-group competence-half-width">
                    <label className="competence-form-label">
                      Department <span className="competence-required-star">*</span>
                    </label>
                    <select
                      className={`competence-form-select ${errors.department ? 'competence-input-error' : ''}`}
                      name="department"
                      value={formData.department || ''}
                      onChange={handleChange}
                    >
                      <option value="">Select Department</option>
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {getDepartmentDisplay(dept)}
                        </option>
                      ))}
                    </select>
                    {errors.department && (
                      <div className="competence-error-message">{errors.department}</div>
                    )}
                    {departments.length === 0 && (
                      <small className="text-warning">No departments available</small>
                    )}
                    {formData.department && (
                      <small className="text-success d-block mt-1">
                        Selected: {getCurrentDepartmentName()}
                      </small>
                    )}
                  </div>

                  {/* Level Dropdown - Fixed: using id */}
                  <div className="competence-form-group competence-half-width">
                    <label className="competence-form-label">
                      Level <span className="competence-required-star">*</span>
                    </label>
                    <select
                      className={`competence-form-select ${errors.level ? 'competence-input-error' : ''}`}
                      name="level"
                      value={formData.level || ''}
                      onChange={handleChange}
                    >
                      <option value="">Select Level</option>
                      {levels.map((level) => (
                        <option key={level.id} value={level.id}>
                          {getLevelDisplay(level)}
                        </option>
                      ))}
                    </select>
                    {errors.level && (
                      <div className="competence-error-message">{errors.level}</div>
                    )}
                    <small className="competence-field-hint">
                      Default: Level 0 (Trainee)
                    </small>
                    {levels.length === 0 && (
                      <small className="text-warning">No levels available</small>
                    )}
                    {formData.level && (
                      <small className="text-success d-block mt-1">
                        Selected: {getCurrentLevelName()}
                      </small>
                    )}
                  </div>
                </div>

                {/* Form Actions */}
                <div className="competence-form-actions">
                  <button 
                    type="button" 
                    className="competence-secondary-btn"
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="competence-primary-btn"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="competence-spinner" aria-hidden="true"></span>
                        Creating...
                      </>
                    ) : 'Add Competence'}
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

export default CompetenceForm;