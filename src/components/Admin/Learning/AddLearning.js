import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../Layout/Sidebar';
import Header from '../Layout/Header';
import "./AddLearning.css";
import Swal from 'sweetalert2';
import { BASE_URL } from "../../../ApiUrl";

const AddLearning = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [levelsLoading, setLevelsLoading] = useState(false);
  const [departmentsLoading, setDepartmentsLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  
  // State for dropdown data
  const [levels, setLevels] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    module_type: 'orientation',
    target_level: '', // This will store level_id (integer)
    target_department: '', // This will store department_id (integer)
    content: '',
    video_links: '',
    document_links: '',
    duration_hours: '',
    has_assessment: true,
    passing_score: '',
    assessment_questions: '',
    is_active: true,
    is_mandatory: true
  });

  // Fetch levels and departments on component mount
  useEffect(() => {
    fetchLevels();
    fetchDepartments();
  }, []);

  const fetchLevels = async () => {
    try {
      setLevelsLoading(true);
      const response = await fetch(`${BASE_URL}/api/admin/levels/`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.status && result.data) {
        setLevels(result.data);
        console.log('✅ Levels fetched successfully:', result.data);
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
    } finally {
      setLevelsLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      setDepartmentsLoading(true);
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
      setDepartmentsLoading(false);
    }
  };

  // Fetch learning module data if in edit mode
  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      fetchLearningModule();
    }
  }, [id]);

  const fetchLearningModule = async () => {
    try {
      setFetchLoading(true);
      const response = await fetch(`${BASE_URL}/api/candidate/learning-modules/${id}/`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.status && result.data) {
        const moduleData = result.data;
        setFormData({
          title: moduleData.title || '',
          description: moduleData.description || '',
          module_type: moduleData.module_type || 'orientation',
          target_level: moduleData.target_level?.toString() || '', // Convert to string for select
          target_department: moduleData.target_department?.toString() || '', // Convert to string for select
          content: moduleData.content || '',
          video_links: moduleData.video_links || '',
          document_links: moduleData.document_links || '',
          duration_hours: moduleData.duration_hours || '',
          has_assessment: moduleData.has_assessment !== undefined ? moduleData.has_assessment : true,
          passing_score: moduleData.passing_score || '',
          assessment_questions: moduleData.assessment_questions || '',
          is_active: moduleData.is_active !== undefined ? moduleData.is_active : true,
          is_mandatory: moduleData.is_mandatory !== undefined ? moduleData.is_mandatory : true
        });
        console.log('✅ Learning module loaded for edit:', moduleData);
      } else {
        throw new Error(result.message || 'Failed to fetch learning module');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching learning module:', err);
      
      Swal.fire({
        icon: 'error',
        title: 'Failed to Load Learning Module',
        text: err.message || 'An error occurred while loading learning module',
        timer: 3000,
        showConfirmButton: true
      });
    } finally {
      setFetchLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title?.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.description?.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.module_type) {
      newErrors.module_type = "Module type is required";
    }

    if (!formData.target_level) {
      newErrors.target_level = "Target level is required";
    }

    if (!formData.target_department) {
      newErrors.target_department = "Target department is required";
    }

    if (!formData.content?.trim()) {
      newErrors.content = "Content is required";
    }

    if (!formData.duration_hours) {
      newErrors.duration_hours = "Duration is required";
    } else if (isNaN(formData.duration_hours) || parseFloat(formData.duration_hours) <= 0) {
      newErrors.duration_hours = "Please enter a valid duration";
    }

    if (formData.has_assessment) {
      if (!formData.passing_score) {
        newErrors.passing_score = "Passing score is required when assessment is enabled";
      } else if (isNaN(formData.passing_score) || parseInt(formData.passing_score) < 0) {
        newErrors.passing_score = "Please enter a valid passing score";
      }

      if (!formData.assessment_questions?.trim()) {
        newErrors.assessment_questions = "Assessment questions are required when assessment is enabled";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('='.repeat(50));
    console.log(isEditMode ? 'EDIT FORM SUBMISSION STARTED' : 'CREATE FORM SUBMISSION STARTED');
    
    if (!validateForm()) {
      console.log('❌ Form validation failed');
      Swal.fire({
        icon: 'error',
        title: 'Validation Failed',
        text: 'Please check all required fields and try again.',
        timer: 3000,
        showConfirmButton: true
      });
      return;
    }

    setLoading(true);
    setError('');

    // Prepare payload with integer IDs for level and department
    const payload = {
      title: formData.title,
      description: formData.description,
      module_type: formData.module_type,
      target_level: parseInt(formData.target_level), // Convert to integer
      target_department: parseInt(formData.target_department), // Convert to integer
      content: formData.content,
      video_links: formData.video_links || '',
      document_links: formData.document_links || '',
      duration_hours: parseFloat(formData.duration_hours).toFixed(1), // Format as string with 1 decimal
      has_assessment: formData.has_assessment,
      passing_score: formData.has_assessment ? parseInt(formData.passing_score) : 0,
      assessment_questions: formData.has_assessment ? formData.assessment_questions : '',
      is_active: true, // Always true as per requirement
      is_mandatory: true // Always true as per requirement
    };

    console.log('📦 Payload:', payload);

    const method = isEditMode ? 'PUT' : 'POST';
    const url = isEditMode 
      ? `${BASE_URL}/api/candidate/learning-modules/${id}/` 
      : `${BASE_URL}/api/candidate/learning-modules/`;

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const responseData = await response.json();
      console.log('📥 Response:', responseData);

      if (!response.ok) {
        throw new Error(responseData.message || `Failed to ${isEditMode ? 'update' : 'create'} learning module`);
      }

      console.log(`✅ Learning module ${isEditMode ? 'updated' : 'created'} successfully!`);
      
      await Swal.fire({
        icon: 'success',
        title: isEditMode ? 'Updated!' : 'Created!',
        text: `Learning module has been ${isEditMode ? 'updated' : 'created'} successfully.`,
        timer: 2000,
        showConfirmButton: false
      });
      
      navigate('/learning');
    } catch (err) {
      console.error(`❌ Error:`, err);
      setError(err.message || `Failed to ${isEditMode ? 'update' : 'create'} learning module.`);
      
      Swal.fire({
        icon: 'error',
        title: isEditMode ? 'Update Failed' : 'Creation Failed',
        text: err.message || `Failed to ${isEditMode ? 'update' : 'create'} learning module.`,
        timer: 3000,
        showConfirmButton: true
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/learning');
  };

  // Helper function to get level display name for selected value
  const getSelectedLevelDisplay = () => {
    const level = levels.find(l => l.id === parseInt(formData.target_level));
    return level ? `${level.name} (Level ${level.number})` : '';
  };

  // Helper function to get department display name for selected value
  const getSelectedDepartmentDisplay = () => {
    const dept = departments.find(d => d.id === parseInt(formData.target_department));
    return dept ? `${dept.name} (${dept.code})` : '';
  };

  if (fetchLoading || levelsLoading || departmentsLoading) {
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
              <p className="mt-2">
                {fetchLoading ? 'Loading learning module...' : 
                 levelsLoading ? 'Loading levels...' : 'Loading departments...'}
              </p>
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
          <div className="al-wrapper">
            {/* Header */}
            <div className="al-header">
              <div>
                <h2>{isEditMode ? 'Edit Learning Module' : 'Add New Learning Module'}</h2>
                <p>{isEditMode ? 'Update the learning module details below' : 'Fill in the learning module details below'}</p>
              </div>
            </div>

            {/* Error Message */}
            {error && <div className="al-error">{error}</div>}

            {/* Form */}
            <div className="al-form-container">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  {/* Basic Information Section */}
                  <div className="col-12">
                    <h5 className="al-section-title">Basic Information</h5>
                  </div>

                  {/* Title */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Title *</label>
                    <input
                      type="text"
                      className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Enter module title"
                    />
                    {errors.title && (
                      <div className="invalid-feedback">{errors.title}</div>
                    )}
                  </div>

                  {/* Module Type */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Module Type *</label>
                    <select
                      className={`form-select ${errors.module_type ? 'is-invalid' : ''}`}
                      name="module_type"
                      value={formData.module_type}
                      onChange={handleChange}
                    >
                      <option value="orientation">Orientation</option>
                      <option value="safety">Safety</option>
                      <option value="technical">Technical</option>
                      <option value="standard">Standards & Codes</option>
                      <option value="casestudy">Case Study</option>
                      <option value="assessment">Assessment</option>
                    </select>
                    {errors.module_type && (
                      <div className="invalid-feedback">{errors.module_type}</div>
                    )}
                  </div>

                  {/* Target Level - Using id as value */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Target Level *</label>
                    <select
                      className={`form-select ${errors.target_level ? 'is-invalid' : ''}`}
                      name="target_level"
                      value={formData.target_level}
                      onChange={handleChange}
                    >
                      <option value="">Select Level</option>
                      {levels.map((level) => (
                        <option key={level.id} value={level.id}>
                          {level.name} (Level {level.number}) - {level.code}
                        </option>
                      ))}
                    </select>
                    {errors.target_level && (
                      <div className="invalid-feedback">{errors.target_level}</div>
                    )}
                    {/* {formData.target_level && (
                      <small className="text-muted d-block mt-1">
                        Selected: {getSelectedLevelDisplay()}
                      </small>
                    )} */}
                  </div>

                  {/* Target Department - Using id as value */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Target Department *</label>
                    <select
                      className={`form-select ${errors.target_department ? 'is-invalid' : ''}`}
                      name="target_department"
                      value={formData.target_department}
                      onChange={handleChange}
                    >
                      <option value="">Select Department</option>
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name} ({dept.code})
                        </option>
                      ))}
                    </select>
                    {errors.target_department && (
                      <div className="invalid-feedback">{errors.target_department}</div>
                    )}
                    {/* {formData.target_department && (
                      <small className="text-muted d-block mt-1">
                        Selected: {getSelectedDepartmentDisplay()}
                      </small>
                    )} */}
                  </div>

                  {/* Description */}
                  <div className="col-12 mb-3">
                    <label className="form-label">Description *</label>
                    <textarea
                      className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="3"
                      placeholder="Enter detailed description"
                    />
                    {errors.description && (
                      <div className="invalid-feedback">{errors.description}</div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="col-12 mb-3">
                    <label className="form-label">Content *</label>
                    <textarea
                      className={`form-control ${errors.content ? 'is-invalid' : ''}`}
                      name="content"
                      value={formData.content}
                      onChange={handleChange}
                      rows="5"
                      placeholder="Enter module content"
                    />
                    {errors.content && (
                      <div className="invalid-feedback">{errors.content}</div>
                    )}
                  </div>

                  {/* Video Links */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Video Links</label>
                    <input
                      type="text"
                      className="form-control"
                      name="video_links"
                      value={formData.video_links}
                      onChange={handleChange}
                      placeholder="Enter YouTube/Vimeo links (comma separated)"
                    />
                  </div>

                  {/* Document Links */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Document Links</label>
                    <input
                      type="text"
                      className="form-control"
                      name="document_links"
                      value={formData.document_links}
                      onChange={handleChange}
                      placeholder="Enter document URLs (comma separated)"
                    />
                  </div>

                  {/* Duration Hours */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Duration (hours) *</label>
                    <input
                      type="number"
                      step="0.1"
                      className={`form-control ${errors.duration_hours ? 'is-invalid' : ''}`}
                      name="duration_hours"
                      value={formData.duration_hours}
                      onChange={handleChange}
                      placeholder="e.g., 4.5"
                      min="0.1"
                    />
                    {errors.duration_hours && (
                      <div className="invalid-feedback">{errors.duration_hours}</div>
                    )}
                  </div>

                  {/* Assessment Settings Section */}
                  <div className="col-12 mt-4">
                    <h5 className="al-section-title">Assessment Settings</h5>
                  </div>

                  {/* Has Assessment - Checkbox */}
                  <div className="col-md-12 mb-3">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        name="has_assessment"
                        id="has_assessment"
                        checked={formData.has_assessment}
                        onChange={handleChange}
                      />
                      <label className="form-check-label" htmlFor="has_assessment">
                        Include Assessment
                      </label>
                    </div>
                  </div>

                  {/* Conditional Assessment Fields */}
                  {formData.has_assessment && (
                    <>
                      {/* Passing Score */}
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Passing Score (%) *</label>
                        <input
                          type="number"
                          className={`form-control ${errors.passing_score ? 'is-invalid' : ''}`}
                          name="passing_score"
                          value={formData.passing_score}
                          onChange={handleChange}
                          placeholder="e.g., 70"
                          min="0"
                        />
                        {errors.passing_score && (
                          <div className="invalid-feedback">{errors.passing_score}</div>
                        )}
                      </div>

                      {/* Assessment Questions */}
                      <div className="col-12 mb-3">
                        <label className="form-label">Assessment Questions *</label>
                        <textarea
                          className={`form-control ${errors.assessment_questions ? 'is-invalid' : ''}`}
                          name="assessment_questions"
                          value={formData.assessment_questions}
                          onChange={handleChange}
                          rows="4"
                          placeholder="Enter assessment questions"
                        />
                        {errors.assessment_questions && (
                          <div className="invalid-feedback">{errors.assessment_questions}</div>
                        )}
                      </div>
                    </>
                  )}

                  {/* Note about fixed values */}
                  <div className="col-12 mt-3">
                    <div className="al-note">
                      <small className="text-muted">
                        <strong>Note:</strong> This module will be created with:
                        <ul className="mt-1 mb-0">
                          <li>Active status: <strong>True</strong></li>
                          <li>Mandatory: <strong>True</strong></li>
                        </ul>
                      </small>
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="al-actions">
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary"
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
                    {loading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Module' : 'Add Module')}
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

export default AddLearning;