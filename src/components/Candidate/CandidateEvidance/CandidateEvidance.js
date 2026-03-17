import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CandidateSidebar from '../Layout/CandidateSidebar';
import Header from '../Layout/CandidateHeader';
import { FaSpinner, FaCloudUploadAlt, FaArrowLeft, FaLink } from 'react-icons/fa';
import { BASE_URL } from '../../../ApiUrl';
import Swal from 'sweetalert2';
import './CandidateEvidance.css';

const AddEvidence = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  const levelNumber = queryParams.get('level');
  const competencyId = queryParams.get('competencyId');
  const levelName = queryParams.get('levelName');

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [submittedBy, setSubmittedBy] = useState('');

  // Get candidate information from localStorage
  useEffect(() => {
    try {
      const candidateUser = localStorage.getItem('candidate_user');
      if (candidateUser) {
        const parsed = JSON.parse(candidateUser);
        setSubmittedBy(parsed.full_name || parsed.email || 'Candidate');
      }
    } catch (error) {
      console.error('Error parsing candidate_user from localStorage:', error);
    }
  }, []);

  const [evidenceData, setEvidenceData] = useState({
    evidence_type: 'document',
    title: '',
    description: '',
    evidence_link: '',
    competency: competencyId ? parseInt(competencyId) : '', // Parse as integer from URL
  });

  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setEvidenceData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate file sizes (5MB max)
    const validFiles = files.filter(file => file.size <= 5 * 1024 * 1024);
    const invalidFiles = files.filter(file => file.size > 5 * 1024 * 1024);
    
    if (invalidFiles.length > 0) {
      Swal.fire({
        icon: 'warning',
        title: 'File Size Warning',
        text: `${invalidFiles.length} file(s) exceed 5MB and will not be uploaded.`,
        timer: 3000,
        showConfirmButton: true
      });
    }
    
    setSelectedFiles(validFiles);
    
    // Clear file error if any
    if (errors.evidence_documents) {
      setErrors(prev => ({ ...prev, evidence_documents: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!evidenceData.title?.trim()) {
      newErrors.title = "Title is required";
    }

    if (!evidenceData.description?.trim()) {
      newErrors.description = "Description is required";
    }

    if (!evidenceData.evidence_type) {
      newErrors.evidence_type = "Evidence type is required";
    }

    if (!evidenceData.competency) {
      newErrors.competency = "Competency is required";
    }

    // Validate based on evidence type
    if (evidenceData.evidence_type === 'link') {
      if (!evidenceData.evidence_link?.trim()) {
        newErrors.evidence_link = "Link is required for external link evidence";
      } else if (!isValidUrl(evidenceData.evidence_link)) {
        newErrors.evidence_link = "Please enter a valid URL";
      }
    } else {
      if (selectedFiles.length === 0) {
        newErrors.evidence_documents = "At least one file is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
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

    setLoading(true);

    try {
      // Create FormData
      const formData = new FormData();
      
      // Add all text fields
      formData.append('evidence_type', evidenceData.evidence_type);
      formData.append('title', evidenceData.title);
      formData.append('description', evidenceData.description);
      formData.append('evidence_link', evidenceData.evidence_link || '');
      formData.append('verification_status', 'pending');
      formData.append('submitted_by', submittedBy || 'Candidate');
      formData.append('submission_notes', evidenceData.description);
      formData.append('competency', evidenceData.competency);
      formData.append('reviewed_by', '');
      formData.append('review_comments', '');
      
      // Add files - the backend should handle these and store paths in evidence_documents JSONField
      if (selectedFiles.length > 0) {
  // Convert file names (or uploaded URLs) into JSON array
  const fileList = selectedFiles.map(file => file.name); // OR URLs from upload API
  
  formData.append('evidence_documents', JSON.stringify(fileList));
} else {
  formData.append('evidence_documents', JSON.stringify([]));
}

      // Log FormData contents for debugging
      console.log('📦 Submitting FormData:');
      for (let pair of formData.entries()) {
        if (pair[0] === 'evidence_documents') {
          console.log(pair[0], pair[1].name, pair[1].size);
        } else {
          console.log(pair[0], pair[1]);
        }
      }

      const response = await fetch(`${BASE_URL}/api/candidate/competency-evidence/`, {
        method: 'POST',
        body: formData
        // Do NOT set Content-Type header - browser will set it automatically
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Server error response:', errorData);
        
        if (errorData.data) {
          setErrors(prev => ({
            ...prev,
            ...errorData.data
          }));
        }
        
        throw new Error(errorData.message || 'Failed to upload evidence');
      }

      const result = await response.json();
      
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Evidence uploaded successfully.',
        timer: 2000,
        showConfirmButton: false
      });
      
      navigate('/candidate-competency');
      
    } catch (err) {
      console.error('Error uploading evidence:', err);
      
      Swal.fire({
        icon: 'error',
        title: 'Upload Failed',
        text: err.message || 'Failed to upload evidence. Please try again.',
        timer: 3000,
        showConfirmButton: true
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/candidate-competency');
  };

  return (
    <div className="ta-layout-wrapper">
      <CandidateSidebar />
      
      <div className="ta-main-wrapper">
        <Header />
        
        <div className="ta-content-area">
          <div className="aev-wrapper">
            {/* Header */}
            <div className="aev-header">
              <button className="aev-back-btn" onClick={handleCancel}>
                <FaArrowLeft /> Back to Competency
              </button>
              <div>
                <h2>Add Evidence</h2>
                <p>
                  {levelName 
                    ? `Upload evidence for ${levelName}` 
                    : 'Upload supporting documents, certificates, or other evidence'}
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="aev-form-container">
              <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="row">
                  {/* Evidence Type */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Evidence Type *</label>
                    <select
                      className={`form-select ${errors.evidence_type ? 'is-invalid' : ''}`}
                      name="evidence_type"
                      value={evidenceData.evidence_type}
                      onChange={handleChange}
                      disabled={loading}
                    >
                      <option value="document">Document Upload</option>
                      <option value="link">External Link</option>
                      <option value="project">Project Work</option>
                      <option value="assessment">Assessment Result</option>
                      <option value="certificate">Certificate</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.evidence_type && (
                      <div className="invalid-feedback">{errors.evidence_type}</div>
                    )}
                  </div>

                  {/* Title */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Title *</label>
                    <input
                      type="text"
                      className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                      name="title"
                      value={evidenceData.title}
                      onChange={handleChange}
                      placeholder="Enter evidence title"
                      disabled={loading}
                    />
                    {errors.title && (
                      <div className="invalid-feedback">{errors.title}</div>
                    )}
                  </div>

                  {/* Description */}
                  <div className="col-md-12 mb-3">
                    <label className="form-label">Description *</label>
                    <textarea
                      className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                      name="description"
                      value={evidenceData.description}
                      onChange={handleChange}
                      placeholder="Enter detailed description of the evidence"
                      rows="3"
                      disabled={loading}
                    />
                    {errors.description && (
                      <div className="invalid-feedback">{errors.description}</div>
                    )}
                  </div>

                  {/* Competency Display */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Competency *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={levelName ? `${levelName} (ID: ${evidenceData.competency})` : `Competency ID: ${evidenceData.competency}`}
                      readOnly
                      disabled
                    />
                    <small className="text-muted">This competency is automatically assigned from the level you selected</small>
                  </div>

                  {/* Link Field */}
                  <div className="col-md-12 mb-3">
                    <label className="form-label">
                      Evidence Link 
                      {evidenceData.evidence_type === 'link' && <span className="text-danger"> *</span>}
                    </label>
                    <div className="aev-link-input">
                      <FaLink className="aev-link-icon" />
                      <input
                        type="url"
                        className={`form-control ${errors.evidence_link ? 'is-invalid' : ''}`}
                        name="evidence_link"
                        value={evidenceData.evidence_link}
                        onChange={handleChange}
                        placeholder="https://example.com/document"
                        disabled={loading}
                      />
                    </div>
                    {errors.evidence_link && (
                      <div className="invalid-feedback">{errors.evidence_link}</div>
                    )}
                    <small className="text-muted">
                      {evidenceData.evidence_type === 'link' 
                        ? 'Required: Enter the URL where the evidence is hosted'
                        : 'Optional: Enter a URL if your evidence is hosted online'}
                    </small>
                  </div>

                  {/* File Upload Field */}
                  <div className="col-md-12 mb-3">
                    <label className="form-label">
                      Upload Documents
                      {evidenceData.evidence_type !== 'link' && <span className="text-danger"> *</span>}
                    </label>
                    <div className="aev-file-upload">
                      <input
                        type="file"
                        className="form-control"
                        name="evidence_documents"
                        onChange={handleFileChange}
                        disabled={loading}
                        id="file-upload"
                        multiple
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      />
                      <label htmlFor="file-upload" className="aev-file-label">
                        <FaCloudUploadAlt /> Choose Files
                      </label>
                    </div>
                    
                    {selectedFiles.length > 0 && (
                      <div className="aev-selected-files">
                        <strong>Selected Files ({selectedFiles.length}):</strong>
                        <ul>
                          {selectedFiles.map((file, index) => (
                            <li key={index}>
                              {file.name} ({(file.size / 1024).toFixed(2)} KB)
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {errors.evidence_documents && (
                      <div className="invalid-feedback d-block">{errors.evidence_documents}</div>
                    )}
                    
                    <small className="text-muted">
                      {evidenceData.evidence_type !== 'link'
                        ? 'Required: Supported formats: PDF, DOC, DOCX, JPG, PNG (Max 5MB per file)'
                        : 'Optional: Upload files if you have them'}
                    </small>
                  </div>

                  {/* Display Info */}
                  <div className="col-md-12 mb-3">
                    <div className="aev-info-box">
                      <p><strong>Level:</strong> {levelName || 'N/A'}</p>
                      <p><strong>Competency ID:</strong> {evidenceData.competency || 'N/A'}</p>
                      <p><strong>Submitted by:</strong> {submittedBy || 'Candidate'}</p>
                      <p><strong>Status:</strong> Pending Review</p>
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="aev-actions">
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
                    {loading ? (
                      <>
                        <FaSpinner className="aev-spinner" /> Submitting...
                      </>
                    ) : 'Submit Evidence'}
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

export default AddEvidence;