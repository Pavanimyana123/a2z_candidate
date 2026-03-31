import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import Sidebar from "../Layout/Sidebar";
import Header from "../Layout/Header";
import "./AddDepartmentLevel.css";
import { BASE_URL } from '../../../ApiUrl';

const AddDepartmentLevel = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get id from URL params for edit mode
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [levels, setLevels] = useState([]);
  const [error, setError] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  
  const [formData, setFormData] = useState({
    duration_weeks: 12,
    prerequisites: '',
    learning_objectives: '',
    min_technical_knowledge: 0,
    min_field_execution: 0,
    min_documentation_quality: 0,
    min_ethics_independence: 0,
    min_communication: 0,
    min_overall_score: 0,
    required_competencies: '',
    strict_validation: false,
    grace_period_weeks: 4,
    department: 0,
    level: 0
  });

  // Check if we're in edit mode based on URL params
  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      fetchDepartmentLevelById(id);
    }
  }, [id]);

  // Fetch departments and levels on component mount
  useEffect(() => {
    fetchDepartments();
    fetchLevels();
  }, []);

  const fetchDepartmentLevelById = async (levelId) => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/admin/department-levels/${levelId}/`);
      const data = await response.json();
      
      if (response.ok && data.status && data.data) {
        const levelData = data.data;
        setFormData({
          duration_weeks: levelData.duration_weeks,
          prerequisites: levelData.prerequisites || '',
          learning_objectives: levelData.learning_objectives || '',
          min_technical_knowledge: levelData.min_technical_knowledge,
          min_field_execution: levelData.min_field_execution,
          min_documentation_quality: levelData.min_documentation_quality,
          min_ethics_independence: levelData.min_ethics_independence,
          min_communication: levelData.min_communication,
          min_overall_score: levelData.min_overall_score,
          required_competencies: levelData.required_competencies || '',
          strict_validation: levelData.strict_validation,
          grace_period_weeks: levelData.grace_period_weeks,
          department: levelData.department,
          level: levelData.level
        });
      } else {
        setError('Failed to fetch department level details');
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch department level details',
          confirmButtonColor: '#007bff'
        }).then(() => {
          navigate('/department-level');
        });
      }
    } catch (error) {
      console.error('Error fetching department level:', error);
      setError('Error connecting to server');
      Swal.fire({
        icon: 'error',
        title: 'Connection Error',
        text: 'Error connecting to server',
        confirmButtonColor: '#007bff'
      }).then(() => {
        navigate('/department-level');
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/admin/departments/`);
      const data = await response.json();
      
      if (data.status && data.data) {
        setDepartments(data.data);
      } else {
        setError('Failed to fetch departments');
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch departments',
          confirmButtonColor: '#007bff'
        });
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
      setError('Error connecting to server');
      Swal.fire({
        icon: 'error',
        title: 'Connection Error',
        text: 'Error connecting to server',
        confirmButtonColor: '#007bff'
      });
    }
  };

  const fetchLevels = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/admin/levels/`);
      const data = await response.json();
      
      if (data.status && data.data) {
        setLevels(data.data);
      } else {
        setError('Failed to fetch levels');
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch levels',
          confirmButtonColor: '#007bff'
        });
      }
    } catch (error) {
      console.error('Error fetching levels:', error);
      setError('Error connecting to server');
      Swal.fire({
        icon: 'error',
        title: 'Connection Error',
        text: 'Error connecting to server',
        confirmButtonColor: '#007bff'
      });
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : 
              type === 'number' ? parseInt(value) || 0 : 
              value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    // Validate required fields
    if (!formData.department || !formData.level) {
      setError('Please select both department and level');
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please select both department and level',
        confirmButtonColor: '#007bff'
      });
      setSubmitting(false);
      return;
    }

    // Prepare payload according to backend requirements
    const payload = {
      duration_weeks: formData.duration_weeks,
      prerequisites: formData.prerequisites || '',
      learning_objectives: formData.learning_objectives || '',
      min_technical_knowledge: formData.min_technical_knowledge,
      min_field_execution: formData.min_field_execution,
      min_documentation_quality: formData.min_documentation_quality,
      min_ethics_independence: formData.min_ethics_independence,
      min_communication: formData.min_communication,
      min_overall_score: formData.min_overall_score,
      required_competencies: formData.required_competencies || '',
      strict_validation: formData.strict_validation,
      grace_period_weeks: formData.grace_period_weeks,
      department: parseInt(formData.department),
      level: parseInt(formData.level)
    };

    try {
      let response;
      let successMessage;
      
      if (isEditMode) {
        // PUT request for update
        response = await fetch(`${BASE_URL}/api/admin/department-levels/${id}/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        });
        successMessage = 'Department Level updated successfully!';
      } else {
        // POST request for create
        response = await fetch(`${BASE_URL}/api/admin/department-levels/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        });
        successMessage = 'Department Level added successfully!';
      }

      const data = await response.json();
      
      if (response.ok && data.status) {
        // Success alert
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: successMessage,
          confirmButtonColor: '#007bff',
          timer: 2000,
          showConfirmButton: true
        }).then(() => {
          navigate('/department-level');
        });
      } else {
        // Error alert
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: data.message || (isEditMode ? 'Failed to update department level' : 'Failed to add department level'),
          confirmButtonColor: '#007bff'
        });
        setError(data.message || (isEditMode ? 'Failed to update department level' : 'Failed to add department level'));
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      Swal.fire({
        icon: 'error',
        title: 'Submission Error',
        text: 'Error connecting to server. Please try again.',
        confirmButtonColor: '#007bff'
      });
      setError('Error connecting to server');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    // Confirm before cancel
    Swal.fire({
      title: 'Are you sure?',
      text: "Any unsaved changes will be lost!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#007bff',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, leave',
      cancelButtonText: 'Stay'
    }).then((result) => {
      if (result.isConfirmed) {
        navigate('/department-level');
      }
    });
  };

  if (loading) {
    return (
      <div className="ta-layout-wrapper">
        <Sidebar />
        <div className="ta-main-wrapper">
          <Header />
          <div className="ta-content-area">
            <div className="loading-container">Loading...</div>
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
          <div className="add-dept-container">
            
            <div className="add-dept-header">
              <h2>{isEditMode ? 'Edit Department Level Configuration' : 'Add New Department Level Configuration'}</h2>
              <button 
                className="btn btn-secondary"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="add-dept-form">
              
              {/* Department and Level Selection */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="department">Department *</label>
                  <select
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                    disabled={isEditMode && submitting}
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name} ({dept.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="level">Level *</label>
                  <select
                    id="level"
                    name="level"
                    value={formData.level}
                    onChange={handleChange}
                    required
                    disabled={isEditMode && submitting}
                  >
                    <option value="">Select Level</option>
                    {levels.map(level => (
                      <option key={level.id} value={level.id}>
                        {level.name} ({level.code}) - Score Range: {level.min_score_required} - {level.max_score}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Duration and Grace Period */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="duration_weeks">Duration (Weeks) *</label>
                  <input
                    type="number"
                    id="duration_weeks"
                    name="duration_weeks"
                    value={formData.duration_weeks}
                    onChange={handleChange}
                    min="1"
                    max="52"
                    required
                    disabled={submitting}
                  />
                  <small>Number of weeks for this level</small>
                </div>

                <div className="form-group">
                  <label htmlFor="grace_period_weeks">Grace Period (Weeks)</label>
                  <input
                    type="number"
                    id="grace_period_weeks"
                    name="grace_period_weeks"
                    value={formData.grace_period_weeks}
                    onChange={handleChange}
                    min="0"
                    max="52"
                    disabled={submitting}
                  />
                  <small>Additional weeks allowed for completion</small>
                </div>
              </div>

              {/* Minimum Score Requirements */}
              <div className="form-section">
                <h3>Minimum Score Requirements</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="min_technical_knowledge">Technical Knowledge (0-100)</label>
                    <input
                      type="number"
                      id="min_technical_knowledge"
                      name="min_technical_knowledge"
                      value={formData.min_technical_knowledge}
                      onChange={handleChange}
                      min="0"
                      max="100"
                      step="1"
                      disabled={submitting}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="min_field_execution">Field Execution (0-100)</label>
                    <input
                      type="number"
                      id="min_field_execution"
                      name="min_field_execution"
                      value={formData.min_field_execution}
                      onChange={handleChange}
                      min="0"
                      max="100"
                      step="1"
                      disabled={submitting}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="min_documentation_quality">Documentation Quality (0-100)</label>
                    <input
                      type="number"
                      id="min_documentation_quality"
                      name="min_documentation_quality"
                      value={formData.min_documentation_quality}
                      onChange={handleChange}
                      min="0"
                      max="100"
                      step="1"
                      disabled={submitting}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="min_ethics_independence">Ethics & Independence (0-100)</label>
                    <input
                      type="number"
                      id="min_ethics_independence"
                      name="min_ethics_independence"
                      value={formData.min_ethics_independence}
                      onChange={handleChange}
                      min="0"
                      max="100"
                      step="1"
                      disabled={submitting}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="min_communication">Communication (0-100)</label>
                    <input
                      type="number"
                      id="min_communication"
                      name="min_communication"
                      value={formData.min_communication}
                      onChange={handleChange}
                      min="0"
                      max="100"
                      step="1"
                      disabled={submitting}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="min_overall_score">Overall Score (0-100)</label>
                    <input
                      type="number"
                      id="min_overall_score"
                      name="min_overall_score"
                      value={formData.min_overall_score}
                      onChange={handleChange}
                      min="0"
                      max="100"
                      step="1"
                      disabled={submitting}
                    />
                  </div>
                </div>
              </div>

              {/* Text Fields */}
              <div className="form-group">
                <label htmlFor="prerequisites">Prerequisites</label>
                <textarea
                  id="prerequisites"
                  name="prerequisites"
                  value={formData.prerequisites}
                  onChange={handleChange}
                  placeholder="List any prerequisites required for this level"
                  rows="3"
                  disabled={submitting}
                />
              </div>

              <div className="form-group">
                <label htmlFor="learning_objectives">Learning Objectives</label>
                <textarea
                  id="learning_objectives"
                  name="learning_objectives"
                  value={formData.learning_objectives}
                  onChange={handleChange}
                  placeholder="Describe the learning objectives for this level"
                  rows="3"
                  disabled={submitting}
                />
              </div>

              <div className="form-group">
                <label htmlFor="required_competencies">Required Competencies</label>
                <textarea
                  id="required_competencies"
                  name="required_competencies"
                  value={formData.required_competencies}
                  onChange={handleChange}
                  placeholder="List the required competencies for this level"
                  rows="3"
                  disabled={submitting}
                />
              </div>

              {/* Validation Checkbox */}
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="strict_validation"
                    checked={formData.strict_validation}
                    onChange={handleChange}
                    disabled={submitting}
                  />
                  Enable Strict Validation
                </label>
                <small>If enabled, all minimum score requirements must be met exactly</small>
              </div>

              {/* Form Actions */}
              <div className="form-actions">
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? 'Saving...' : (isEditMode ? 'Update Department Level' : 'Save Department Level')}
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={handleCancel}
                  disabled={submitting}
                >
                  Cancel
                </button>
              </div>

            </form>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AddDepartmentLevel;