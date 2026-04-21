// AddCertificate.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CandidateSidebar from '../Layout/CandidateSidebar';
import Header from '../Layout/CandidateHeader';
import "./AddCandidateCertificate.css";
import Swal from 'sweetalert2';
import { BASE_URL } from "../../../ApiUrl";

const AddCertificate = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get ID from URL params for edit mode
  const isEditMode = !!id;
  
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  
  // State for dropdown data
  const [certificationCategories, setCertificationCategories] = useState([]);
  const [competencies, setCompetencies] = useState([]);
  const [selectedCertification, setSelectedCertification] = useState('');
  const [selectedCompetency, setSelectedCompetency] = useState('');
  
  // State for selected file
  const [selectedFile, setSelectedFile] = useState(null);
  const [existingDocument, setExistingDocument] = useState(null);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);
  
  // Issuer type options - Exact values as shown in the image
  const issuerTypeOptions = [
    { value: 'Educational Institution', label: 'Educational Institution' },
    { value: 'Client Company', label: 'Client Company' },
    { value: 'A2Z Organization', label: 'A2Z Organization' },
    { value: 'Training Center', label: 'Training Center' },
    { value: 'Government Body', label: 'Government Body' },
    { value: 'Professional Body', label: 'Professional Body' },
    { value: 'Other', label: 'Other' }
  ];
  
  // Get candidate data from localStorage
  const getCandidateData = () => {
    const candidateData = localStorage.getItem('candidate_user');
    if (candidateData) {
      try {
        return JSON.parse(candidateData);
      } catch (e) {
        console.error('Error parsing candidate data:', e);
        return null;
      }
    }
    return null;
  };

  const candidateData = getCandidateData();
  const candidateId = candidateData?.user_id || null;

  const [formData, setFormData] = useState({
    // Issuer fields
    issuer_type: '',
    issuer_name: '',
    issuer_email: '',
    issuer_phone: '',
    issuer_website: '',
    issuer_address: '',
    issuer_city: '',
    issuer_state: '',
    issuer_country: '',
    issuer_postal_code: '',
    issuer_description: '',
    issuer_accreditation_number: '',
    
    // Certificate fields
    issue_date: '',
    expiry_date: '',
    certificate_number: '',
    issuing_authority: '',
    document: null,
    is_approved: true,
    approved_at: new Date().toISOString(),
    approval_remarks: '',
    status: 'pending',
    candidate: candidateId,
    certification: '',
    competency: '',
    approved_by_mentor: null
  });

  // Fetch certification categories and competencies on component mount
  useEffect(() => {
    fetchCertificationCategories();
    fetchCompetencies();
  }, []);

  // After certificationCategories and competencies are loaded, fetch edit data if in edit mode
  useEffect(() => {
    if (isEditMode && id && certificationCategories.length > 0 && competencies.length > 0 && !initialDataLoaded) {
      fetchCertificationData(id);
    }
  }, [isEditMode, id, certificationCategories, competencies, initialDataLoaded]);

  // Fetch certification data for edit mode
  const fetchCertificationData = async (certificateId) => {
    setFetchLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/candidate/certifications/${certificateId}/`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch certification data');
      }
      
      const result = await response.json();
      
      if (result.status && result.data) {
        const certificateData = result.data;
        
        console.log('Certificate data loaded:', certificateData);
        
        // Set selected certification
        if (certificateData.certification) {
          setSelectedCertification(certificateData.certification.toString());
        }
        
        // Set selected competency
        if (certificateData.competency) {
          setSelectedCompetency(certificateData.competency.toString());
        }
        
        // Format dates for input fields (YYYY-MM-DD)
        const formatDateForInput = (dateString) => {
          if (!dateString) return '';
          const date = new Date(dateString);
          return date.toISOString().split('T')[0];
        };
        
        setFormData({
          // Issuer fields
          issuer_type: certificateData.issuer_type || '',
          issuer_name: certificateData.issuer_name || '',
          issuer_email: certificateData.issuer_email || '',
          issuer_phone: certificateData.issuer_phone || '',
          issuer_website: certificateData.issuer_website || '',
          issuer_address: certificateData.issuer_address || '',
          issuer_city: certificateData.issuer_city || '',
          issuer_state: certificateData.issuer_state || '',
          issuer_country: certificateData.issuer_country || '',
          issuer_postal_code: certificateData.issuer_postal_code || '',
          issuer_description: certificateData.issuer_description || '',
          issuer_accreditation_number: certificateData.issuer_accreditation_number || '',
          
          // Certificate fields
          issue_date: formatDateForInput(certificateData.issue_date),
          expiry_date: formatDateForInput(certificateData.expiry_date),
          certificate_number: certificateData.certificate_number || '',
          issuing_authority: certificateData.issuing_authority || '',
          document: null,
          is_approved: certificateData.is_approved !== undefined ? certificateData.is_approved : true,
          approved_at: certificateData.approved_at || new Date().toISOString(),
          approval_remarks: certificateData.approval_remarks || '',
          status: certificateData.status || 'pending',
          candidate: candidateId,
          certification: certificateData.certification || '',
          competency: certificateData.competency || '',
          approved_by_mentor: certificateData.approved_by_mentor || null
        });
        
        // Store existing document info
        if (certificateData.document) {
          setExistingDocument(certificateData.document);
        }
        
        setInitialDataLoaded(true);
      }
    } catch (err) {
      console.error('Error fetching certification data:', err);
      Swal.fire({
        icon: 'error',
        title: 'Failed to Load Data',
        text: err.message || 'Could not load certification data',
        showConfirmButton: true
      }).then(() => {
        navigate('/candidate-certificate');
      });
    } finally {
      setFetchLoading(false);
    }
  };

  // Fetch certification categories
  const fetchCertificationCategories = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/admin/certification-categories/`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.status && result.data) {
        setCertificationCategories(result.data);
        console.log('✅ Certification categories loaded:', result.data);
      }
    } catch (err) {
      console.error('Error fetching certification categories:', err);
      Swal.fire({
        icon: 'error',
        title: 'Failed to Load Certifications',
        text: err.message || 'An error occurred while loading certifications',
        showConfirmButton: true
      });
    }
  };

  // Fetch competencies
  const fetchCompetencies = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/candidate/competencies/`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.status && result.data) {
        setCompetencies(result.data);
        console.log('✅ Competencies loaded:', result.data);
      }
    } catch (err) {
      console.error('Error fetching competencies:', err);
      Swal.fire({
        icon: 'error',
        title: 'Failed to Load Competencies',
        text: err.message || 'An error occurred while loading competencies',
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Clear document error if any
      if (errors.document) {
        setErrors(prev => ({ ...prev, document: '' }));
      }
    }
  };

  const handleCertificationChange = (e) => {
    const certificationId = e.target.value;
    setSelectedCertification(certificationId);
    setFormData(prev => ({ ...prev, certification: parseInt(certificationId) }));
  };

  const handleCompetencyChange = (e) => {
    const competencyId = e.target.value;
    setSelectedCompetency(competencyId);
    setFormData(prev => ({ ...prev, competency: parseInt(competencyId) }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Issuer validation
    if (!formData.issuer_type) {
      newErrors.issuer_type = "Issuer type is required";
    }
    if (!formData.issuer_name?.trim()) {
      newErrors.issuer_name = "Issuer name is required";
    }
    if (formData.issuer_email && !/^\S+@\S+\.\S+$/.test(formData.issuer_email)) {
      newErrors.issuer_email = "Please enter a valid email address";
    }
    if (formData.issuer_website && !/^https?:\/\/.*/.test(formData.issuer_website)) {
      newErrors.issuer_website = "Please enter a valid URL starting with http:// or https://";
    }

    // Certificate validation
    if (!formData.issue_date) {
      newErrors.issue_date = "Issue date is required";
    }

    if (!formData.expiry_date) {
      newErrors.expiry_date = "Expiry date is required";
    }

    // Validate that expiry date is after issue date
    if (formData.issue_date && formData.expiry_date) {
      const issueDate = new Date(formData.issue_date);
      const expiryDate = new Date(formData.expiry_date);
      
      if (expiryDate <= issueDate) {
        newErrors.expiry_date = "Expiry date must be after issue date";
      }
    }

    if (!formData.certificate_number?.trim()) {
      newErrors.certificate_number = "Certificate number is required";
    }

    if (!formData.issuing_authority?.trim()) {
      newErrors.issuing_authority = "Issuing authority is required";
    }

    if (!selectedCertification) {
      newErrors.certification = "Please select a certification";
    }

    if (!selectedCompetency) {
      newErrors.competency = "Please select a competency";
    }

    // Only require document for new entries, not for edits
    if (!isEditMode && !selectedFile) {
      newErrors.document = "Please select a document to upload";
    }

    if (!candidateId) {
      newErrors.candidate = "Candidate information not found";
    }

    const isValid = Object.keys(newErrors).length === 0;
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

    setLoading(true);
    setError('');

    try {
      let response;
      let url;
      let method;
      let requestBody;

      if (isEditMode) {
        // EDIT MODE - Use PUT request with JSON
        url = `${BASE_URL}/api/candidate/certifications/${id}/`;
        method = 'PUT';
        
        requestBody = {
          // Issuer fields
          issuer_type: formData.issuer_type,
          issuer_name: formData.issuer_name,
          issuer_email: formData.issuer_email,
          issuer_phone: formData.issuer_phone,
          issuer_website: formData.issuer_website,
          issuer_address: formData.issuer_address,
          issuer_city: formData.issuer_city,
          issuer_state: formData.issuer_state,
          issuer_country: formData.issuer_country,
          issuer_postal_code: formData.issuer_postal_code,
          issuer_description: formData.issuer_description,
          issuer_accreditation_number: formData.issuer_accreditation_number,
          
          // Certificate fields
          issue_date: formData.issue_date,
          expiry_date: formData.expiry_date,
          certificate_number: formData.certificate_number,
          issuing_authority: formData.issuing_authority,
          is_approved: formData.is_approved,
          approved_at: formData.approved_at,
          approval_remarks: formData.approval_remarks,
          status: formData.status,
          candidate: parseInt(candidateId),
          certification: parseInt(formData.certification),
          competency: parseInt(formData.competency),
        };

        if (formData.approved_by_mentor !== null && formData.approved_by_mentor !== '') {
          requestBody.approved_by_mentor = formData.approved_by_mentor;
        }

        console.log('Updating with data:', requestBody);

        response = await fetch(url, {
          method: method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });
      } else {
        // ADD MODE - Use POST request with FormData
        url = `${BASE_URL}/api/candidate/certifications/`;
        method = 'POST';
        
        const formDataToSend = new FormData();
        
        // Issuer fields
        formDataToSend.append('issuer_type', formData.issuer_type);
        formDataToSend.append('issuer_name', formData.issuer_name);
        formDataToSend.append('issuer_email', formData.issuer_email);
        formDataToSend.append('issuer_phone', formData.issuer_phone);
        formDataToSend.append('issuer_website', formData.issuer_website);
        formDataToSend.append('issuer_address', formData.issuer_address);
        formDataToSend.append('issuer_city', formData.issuer_city);
        formDataToSend.append('issuer_state', formData.issuer_state);
        formDataToSend.append('issuer_country', formData.issuer_country);
        formDataToSend.append('issuer_postal_code', formData.issuer_postal_code);
        formDataToSend.append('issuer_description', formData.issuer_description || '');
        formDataToSend.append('issuer_accreditation_number', formData.issuer_accreditation_number || '');
        
        // Certificate fields
        formDataToSend.append('issue_date', formData.issue_date);
        formDataToSend.append('expiry_date', formData.expiry_date);
        formDataToSend.append('certificate_number', formData.certificate_number);
        formDataToSend.append('issuing_authority', formData.issuing_authority);
        formDataToSend.append('is_approved', formData.is_approved);
        formDataToSend.append('approved_at', formData.approved_at);
        formDataToSend.append('approval_remarks', formData.approval_remarks || '');
        formDataToSend.append('status', formData.status);
        formDataToSend.append('candidate', parseInt(candidateId));
        formDataToSend.append('certification', parseInt(formData.certification));
        formDataToSend.append('competency', parseInt(formData.competency));
        
        if (formData.approved_by_mentor !== null && formData.approved_by_mentor !== '') {
          formDataToSend.append('approved_by_mentor', formData.approved_by_mentor);
        }
        
        if (selectedFile) {
          formDataToSend.append('document', selectedFile);
        }

        console.log('Submitting FormData:');
        for (let pair of formDataToSend.entries()) {
          console.log(pair[0] + ': ' + (pair[0] === 'document' ? pair[1].name : pair[1]));
        }
        
        requestBody = formDataToSend;
        
        response = await fetch(url, {
          method: method,
          body: requestBody,
        });
      }

      const responseData = await response.json();

      if (!response.ok) {
        // Handle validation errors from backend
        if (responseData.data) {
          const backendErrors = responseData.data;
          const newErrors = {};
          
          // Map backend errors to form fields
          Object.keys(backendErrors).forEach(key => {
            if (backendErrors[key] && backendErrors[key].length > 0) {
              newErrors[key] = backendErrors[key][0];
            }
          });
          
          setErrors(newErrors);
          throw new Error(responseData.message || 'Please fix the validation errors');
        }
        throw new Error(responseData.message || `Failed to ${isEditMode ? 'update' : 'add'} certification`);
      }

      await Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: `Certification has been ${isEditMode ? 'updated' : 'added'} successfully.`,
        timer: 2000,
        showConfirmButton: false
      });
      
      navigate('/candidate-certificate');
    } catch (err) {
      setError(err.message || `Failed to ${isEditMode ? 'update' : 'add'} certification. Please try again.`);
      
      Swal.fire({
        icon: 'error',
        title: `${isEditMode ? 'Update' : 'Submission'} Failed`,
        text: err.message || `Failed to ${isEditMode ? 'update' : 'add'} certification. Please try again.`,
        timer: 3000,
        showConfirmButton: true
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/candidate-certificate');
  };

  if (fetchLoading) {
    return (
      <div className="ccert-layout-wrapper">
        <CandidateSidebar />
        <div className="ccert-main-wrapper">
          <Header />
          <div className="ccert-content-area">
            <div className="text-center p-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Loading certification data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ccert-layout-wrapper">
      <CandidateSidebar />
      
      <div className="ccert-main-wrapper">
        <Header />
        
        <div className="ccert-content-area">
          <div className="cert-add-wrapper">
            {/* Header */}
            <div className="cert-add-header">
              <div>
                <h2>{isEditMode ? 'Edit Certification' : 'Add Certification'}</h2>
                <p>
                  {isEditMode 
                    ? 'Update your professional certification details' 
                    : 'Upload your professional certification and fill in the details below'}
                </p>
              </div>
            </div>

            {/* Error Message */}
            {error && <div className="cert-add-error alert alert-danger">{error}</div>}

            {/* Form */}
            <div className="cert-add-form-container">
              <form onSubmit={handleSubmit} encType={isEditMode ? '' : 'multipart/form-data'}>
                
                {/* Issuer Information Section */}
                <div className="form-section">
                  <h4 className="section-title">Issuer Information</h4>
                  <p className="section-subtitle">Details about the organization that issued this certification</p>
                  
                  <div className="row">
                    {/* Issuer Type */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Issuer Type *</label>
                      <select
                        className={`form-control ${errors.issuer_type ? 'is-invalid' : ''}`}
                        name="issuer_type"
                        value={formData.issuer_type || ''}
                        onChange={handleChange}
                        disabled={loading}
                      >
                        <option value="">Select Issuer Type</option>
                        {issuerTypeOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {errors.issuer_type && (
                        <div className="invalid-feedback">{errors.issuer_type}</div>
                      )}
                    </div>

                    {/* Issuer Name */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Issuer Name *</label>
                      <input
                        type="text"
                        className={`form-control ${errors.issuer_name ? 'is-invalid' : ''}`}
                        name="issuer_name"
                        value={formData.issuer_name || ''}
                        onChange={handleChange}
                        placeholder="Enter organization name"
                        disabled={loading}
                      />
                      {errors.issuer_name && (
                        <div className="invalid-feedback">{errors.issuer_name}</div>
                      )}
                    </div>

                    {/* Issuer Email */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Issuer Email</label>
                      <input
                        type="email"
                        className={`form-control ${errors.issuer_email ? 'is-invalid' : ''}`}
                        name="issuer_email"
                        value={formData.issuer_email || ''}
                        onChange={handleChange}
                        placeholder="contact@organization.com"
                        disabled={loading}
                      />
                      {errors.issuer_email && (
                        <div className="invalid-feedback">{errors.issuer_email}</div>
                      )}
                    </div>

                    {/* Issuer Phone */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Issuer Phone</label>
                      <input
                        type="tel"
                        className={`form-control ${errors.issuer_phone ? 'is-invalid' : ''}`}
                        name="issuer_phone"
                        value={formData.issuer_phone || ''}
                        onChange={handleChange}
                        placeholder="+1 (234) 567-8900"
                        disabled={loading}
                      />
                      {errors.issuer_phone && (
                        <div className="invalid-feedback">{errors.issuer_phone}</div>
                      )}
                    </div>

                    {/* Issuer Website */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Issuer Website</label>
                      <input
                        type="url"
                        className={`form-control ${errors.issuer_website ? 'is-invalid' : ''}`}
                        name="issuer_website"
                        value={formData.issuer_website || ''}
                        onChange={handleChange}
                        placeholder="https://www.organization.com"
                        disabled={loading}
                      />
                      {errors.issuer_website && (
                        <div className="invalid-feedback">{errors.issuer_website}</div>
                      )}
                    </div>

                    {/* Issuer Accreditation Number */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Accreditation Number</label>
                      <input
                        type="text"
                        className={`form-control ${errors.issuer_accreditation_number ? 'is-invalid' : ''}`}
                        name="issuer_accreditation_number"
                        value={formData.issuer_accreditation_number || ''}
                        onChange={handleChange}
                        placeholder="Enter accreditation number (if applicable)"
                        disabled={loading}
                      />
                      {errors.issuer_accreditation_number && (
                        <div className="invalid-feedback">{errors.issuer_accreditation_number}</div>
                      )}
                    </div>

                    {/* Issuer Address */}
                    <div className="col-12 mb-3">
                      <label className="form-label">Street Address</label>
                      <input
                        type="text"
                        className={`form-control ${errors.issuer_address ? 'is-invalid' : ''}`}
                        name="issuer_address"
                        value={formData.issuer_address || ''}
                        onChange={handleChange}
                        placeholder="Street address"
                        disabled={loading}
                      />
                      {errors.issuer_address && (
                        <div className="invalid-feedback">{errors.issuer_address}</div>
                      )}
                    </div>

                    {/* Issuer City */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label">City</label>
                      <input
                        type="text"
                        className={`form-control ${errors.issuer_city ? 'is-invalid' : ''}`}
                        name="issuer_city"
                        value={formData.issuer_city || ''}
                        onChange={handleChange}
                        placeholder="City"
                        disabled={loading}
                      />
                      {errors.issuer_city && (
                        <div className="invalid-feedback">{errors.issuer_city}</div>
                      )}
                    </div>

                    {/* Issuer State */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label">State/Province</label>
                      <input
                        type="text"
                        className={`form-control ${errors.issuer_state ? 'is-invalid' : ''}`}
                        name="issuer_state"
                        value={formData.issuer_state || ''}
                        onChange={handleChange}
                        placeholder="State/Province"
                        disabled={loading}
                      />
                      {errors.issuer_state && (
                        <div className="invalid-feedback">{errors.issuer_state}</div>
                      )}
                    </div>

                    {/* Issuer Country */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Country</label>
                      <input
                        type="text"
                        className={`form-control ${errors.issuer_country ? 'is-invalid' : ''}`}
                        name="issuer_country"
                        value={formData.issuer_country || ''}
                        onChange={handleChange}
                        placeholder="Country"
                        disabled={loading}
                      />
                      {errors.issuer_country && (
                        <div className="invalid-feedback">{errors.issuer_country}</div>
                      )}
                    </div>

                    {/* Issuer Postal Code */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Postal Code</label>
                      <input
                        type="text"
                        className={`form-control ${errors.issuer_postal_code ? 'is-invalid' : ''}`}
                        name="issuer_postal_code"
                        value={formData.issuer_postal_code || ''}
                        onChange={handleChange}
                        placeholder="Postal/ZIP code"
                        disabled={loading}
                      />
                      {errors.issuer_postal_code && (
                        <div className="invalid-feedback">{errors.issuer_postal_code}</div>
                      )}
                    </div>

                    {/* Issuer Description */}
                    <div className="col-12 mb-3">
                      <label className="form-label">Issuer Description</label>
                      <textarea
                        className={`form-control ${errors.issuer_description ? 'is-invalid' : ''}`}
                        name="issuer_description"
                        value={formData.issuer_description || ''}
                        onChange={handleChange}
                        rows="3"
                        placeholder="Brief description of the issuing organization"
                        disabled={loading}
                      />
                      {errors.issuer_description && (
                        <div className="invalid-feedback">{errors.issuer_description}</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Certificate Information Section */}
                <div className="form-section mt-4">
                  <h4 className="section-title">Certificate Information</h4>
                  <p className="section-subtitle">Details about the certification being submitted</p>
                  
                  <div className="row">
                    {/* Certification Dropdown */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Certification *</label>
                      <select
                        className={`form-control ${errors.certification ? 'is-invalid' : ''}`}
                        value={selectedCertification}
                        onChange={handleCertificationChange}
                        disabled={loading || fetchLoading}
                      >
                        <option value="">Select Certification</option>
                        {certificationCategories.map(cert => (
                          <option key={cert.id} value={cert.id}>
                            {cert.name}
                          </option>
                        ))}
                      </select>
                      {errors.certification && (
                        <div className="invalid-feedback">{errors.certification}</div>
                      )}
                      {certificationCategories.length === 0 && !fetchLoading && (
                        <small className="text-muted">No certifications available</small>
                      )}
                    </div>

                    {/* Competency Dropdown */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Competency *</label>
                      <select
                        className={`form-control ${errors.competency ? 'is-invalid' : ''}`}
                        value={selectedCompetency}
                        onChange={handleCompetencyChange}
                        disabled={loading || fetchLoading}
                      >
                        <option value="">Select Competency</option>
                        {competencies.map(comp => (
                          <option key={comp.id} value={comp.id}>
                            {comp.competency_name}
                          </option>
                        ))}
                      </select>
                      {errors.competency && (
                        <div className="invalid-feedback">{errors.competency}</div>
                      )}
                      {competencies.length === 0 && !fetchLoading && (
                        <small className="text-muted">No competencies available</small>
                      )}
                    </div>

                    {/* Certificate Number */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Certificate Number *</label>
                      <input
                        type="text"
                        className={`form-control ${errors.certificate_number ? 'is-invalid' : ''}`}
                        name="certificate_number"
                        value={formData.certificate_number || ''}
                        onChange={handleChange}
                        placeholder="Enter certificate number"
                        disabled={loading}
                      />
                      {errors.certificate_number && (
                        <div className="invalid-feedback">{errors.certificate_number}</div>
                      )}
                    </div>

                    {/* Issuing Authority */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Issuing Authority *</label>
                      <input
                        type="text"
                        className={`form-control ${errors.issuing_authority ? 'is-invalid' : ''}`}
                        name="issuing_authority"
                        value={formData.issuing_authority || ''}
                        onChange={handleChange}
                        placeholder="Enter issuing authority (e.g., API, NACE, TWI, etc.)"
                        disabled={loading}
                      />
                      {errors.issuing_authority && (
                        <div className="invalid-feedback">{errors.issuing_authority}</div>
                      )}
                    </div>

                    {/* Issue Date */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Issue Date *</label>
                      <input
                        type="date"
                        className={`form-control ${errors.issue_date ? 'is-invalid' : ''}`}
                        name="issue_date"
                        value={formData.issue_date || ''}
                        onChange={handleChange}
                        disabled={loading}
                      />
                      {errors.issue_date && (
                        <div className="invalid-feedback">{errors.issue_date}</div>
                      )}
                    </div>

                    {/* Expiry Date */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Expiry Date *</label>
                      <input
                        type="date"
                        className={`form-control ${errors.expiry_date ? 'is-invalid' : ''}`}
                        name="expiry_date"
                        value={formData.expiry_date || ''}
                        onChange={handleChange}
                        disabled={loading}
                      />
                      {errors.expiry_date && (
                        <div className="invalid-feedback">{errors.expiry_date}</div>
                      )}
                    </div>

                    {/* Document Upload */}
                    <div className="col-12 mb-3">
                      <label className="form-label">{isEditMode ? 'Update Document (Optional)' : 'Certificate Document *'}</label>
                      <input
                        type="file"
                        className={`form-control ${errors.document ? 'is-invalid' : ''}`}
                        onChange={handleFileChange}
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        disabled={loading}
                      />
                      {errors.document && (
                        <div className="invalid-feedback">{errors.document}</div>
                      )}
                      <small className="text-muted">
                        Supported formats: PDF, JPG, JPEG, PNG, DOC, DOCX (Max size: 5MB)
                        {isEditMode && existingDocument && (
                          <span className="d-block mt-1 text-success">
                            Current document: {existingDocument.split('/').pop()}
                          </span>
                        )}
                      </small>
                    </div>
                  </div>
                </div>

                {/* Note */}
                <div className="cert-add-note mb-4">
                  <small className="text-muted">
                    Note: Fields marked with * are required. Please ensure all information is accurate.
                    The certificate will be reviewed by the mentor for approval.
                  </small>
                </div>

                {/* Form Actions */}
                <div className="cert-add-actions">
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
                    {loading ? (isEditMode ? 'Updating...' : 'Submitting...') : (isEditMode ? 'Update Certification' : 'Submit Certification')}
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

export default AddCertificate;