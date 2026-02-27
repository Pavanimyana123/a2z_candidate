import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../Layout/Sidebar';
import Header from '../Layout/Header';
import "./AddCandidate.css";
import Swal from 'sweetalert2';
import { BASE_URL } from "../../../ApiUrl";

const AddCandidate = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get ID from URL for edit mode
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);

  const [formData, setFormData] = useState({
    full_name: '',
    date_of_birth: '',
    gender: 'M',
    phone_number: '',
    email: '',
    address: '',
    city: '',
    state: '',
    country: '',
    pincode: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    current_level: 0,
    blood_group: '',
    medical_expiry_date: '',
  });

  // Fetch candidate data if in edit mode
  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      fetchCandidateData();
    }
  }, [id]);

  const fetchCandidateData = async () => {
    try {
      setFetchLoading(true);
      const response = await fetch(`${BASE_URL}/candidates/${id}/`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.status && result.data) {
        const candidateData = result.data;
        // Format dates for input fields (YYYY-MM-DD)
        const formattedData = {
          ...candidateData,
          date_of_birth: candidateData.date_of_birth ? candidateData.date_of_birth.split('T')[0] : '',
          medical_expiry_date: candidateData.medical_expiry_date ? candidateData.medical_expiry_date.split('T')[0] : '',
        };
        setFormData(formattedData);
        console.log('✅ Candidate data loaded for edit:', formattedData);
      } else {
        throw new Error(result.message || 'Failed to fetch candidate data');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching candidate data:', err);
      
      Swal.fire({
        icon: 'error',
        title: 'Failed to Load Candidate',
        text: err.message || 'An error occurred while loading candidate data',
        timer: 3000,
        showConfirmButton: true
      });
    } finally {
      setFetchLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    console.log(`Field changed - ${name}:`, value);
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || '' : value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      console.log(`Clearing error for field: ${name}`);
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    console.log('Starting form validation...');
    console.log('Current form data:', formData);
    
    const newErrors = {};

    if (!formData.full_name?.trim()) {
      newErrors.full_name = "Full name is required";
      console.log('Validation failed: Full name is empty');
    }

    if (!formData.date_of_birth) {
      newErrors.date_of_birth = "Date of birth is required";
      console.log('Validation failed: Date of birth is empty');
    }

    if (!formData.phone_number?.trim()) {
      newErrors.phone_number = "Phone number is required";
      console.log('Validation failed: Phone number is empty');
    } else if (!/^\d{10}$/.test(formData.phone_number.replace(/\D/g, ''))) {
      newErrors.phone_number = "Please enter a valid 10-digit phone number";
      console.log('Validation failed: Invalid phone number format');
    }

    if (!formData.email?.trim()) {
      newErrors.email = "Email is required";
      console.log('Validation failed: Email is empty');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      console.log('Validation failed: Invalid email format');
    }

    if (!formData.address?.trim()) {
      newErrors.address = "Address is required";
      console.log('Validation failed: Address is empty');
    }

    if (!formData.city?.trim()) {
      newErrors.city = "City is required";
      console.log('Validation failed: City is empty');
    }

    if (!formData.state?.trim()) {
      newErrors.state = "State is required";
      console.log('Validation failed: State is empty');
    }

    if (!formData.country?.trim()) {
      newErrors.country = "Country is required";
      console.log('Validation failed: Country is empty');
    }

    if (!formData.pincode?.trim()) {
      newErrors.pincode = "Pincode is required";
      console.log('Validation failed: Pincode is empty');
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Please enter a valid 6-digit pincode";
      console.log('Validation failed: Invalid pincode format');
    }

    if (!formData.emergency_contact_name?.trim()) {
      newErrors.emergency_contact_name = "Emergency contact name is required";
      console.log('Validation failed: Emergency contact name is empty');
    }

    if (!formData.emergency_contact_phone?.trim()) {
      newErrors.emergency_contact_phone = "Emergency contact phone is required";
      console.log('Validation failed: Emergency contact phone is empty');
    } else if (!/^\d{10}$/.test(formData.emergency_contact_phone.replace(/\D/g, ''))) {
      newErrors.emergency_contact_phone = "Please enter a valid 10-digit phone number";
      console.log('Validation failed: Invalid emergency contact phone format');
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
    console.log(isEditMode ? 'EDIT FORM SUBMISSION STARTED' : 'CREATE FORM SUBMISSION STARTED');
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
    setError('');

    // Prepare payload
    const payload = {
      ...formData,
      safety_induction_status: true, // Always set to true for new candidates
    };

    // Remove any undefined or null values
    Object.keys(payload).forEach(key => {
      if (payload[key] === undefined || payload[key] === null) {
        delete payload[key];
      }
    });

    console.log('📦 Payload prepared for submission:');
    console.log(JSON.stringify(payload, null, 2));
    
    const method = isEditMode ? 'PUT' : 'POST';
    const url = isEditMode 
      ? `${BASE_URL}/candidates/${id}/` 
      : `${BASE_URL}/candidates/`;
    
    console.log(`📍 API Endpoint: ${url}`);
    console.log(`📤 Sending ${method} request...`);

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      console.log(`📥 Response received - Status: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Server returned error:', errorData);
        throw new Error(errorData.message || `Failed to ${isEditMode ? 'update' : 'create'} candidate`);
      }

      const data = await response.json();
      console.log(`✅ Candidate ${isEditMode ? 'updated' : 'created'} successfully!`);
      console.log('📋 Server response:', data);
      
      // Show success message
      await Swal.fire({
        icon: 'success',
        title: isEditMode ? 'Updated!' : 'Created!',
        text: `Candidate has been ${isEditMode ? 'updated' : 'created'} successfully.`,
        timer: 2000,
        showConfirmButton: false
      });
      
      console.log('🔄 Navigating back to candidates list...');
      navigate('/candidate');
    } catch (err) {
      console.error(`❌ Error ${isEditMode ? 'updating' : 'creating'} candidate:`);
      console.error('Error name:', err.name);
      console.error('Error message:', err.message);
      console.error('Full error object:', err);
      
      setError(err.message || `Failed to ${isEditMode ? 'update' : 'create'} candidate. Please try again.`);
      
      Swal.fire({
        icon: 'error',
        title: isEditMode ? 'Update Failed' : 'Creation Failed',
        text: err.message || `Failed to ${isEditMode ? 'update' : 'create'} candidate. Please try again.`,
        timer: 3000,
        showConfirmButton: true
      });
    } finally {
      console.log(`🏁 Form submission process completed.`);
      console.log('='.repeat(50));
      setLoading(false);
    }
  };

  const handleCancel = () => {
    console.log('Cancel button clicked - navigating back to candidates list');
    navigate('/candidate');
  };

  // Log component mount
  useEffect(() => {
    console.log(`📝 ${isEditMode ? 'EditCandidate' : 'AddCandidate'} component mounted`);
    console.log('Initial form state:', formData);
    
    return () => {
      console.log(`📝 ${isEditMode ? 'EditCandidate' : 'AddCandidate'} component unmounted`);
    };
  }, [isEditMode]);

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
              <p className="mt-2">Loading candidate data...</p>
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
          <div className="ac-wrapper">
            {/* Header */}
            <div className="ac-header">
              <div>
                <h2>{isEditMode ? 'Edit Candidate' : 'Add New Candidate'}</h2>
                <p>{isEditMode ? 'Update the candidate details below' : 'Fill in the candidate details below'}</p>
              </div>
              <button 
                className="btn btn-outline-secondary"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </button>
            </div>

            {/* Error Message */}
            {error && <div className="ac-error">{error}</div>}

            {/* Form */}
            <div className="ac-form-container">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  {/* Full Name */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      className={`form-control ${errors.full_name ? 'is-invalid' : ''}`}
                      name="full_name"
                      value={formData.full_name || ''}
                      onChange={handleChange}
                      placeholder="Enter full name"
                    />
                    {errors.full_name && (
                      <div className="invalid-feedback">{errors.full_name}</div>
                    )}
                  </div>

                  {/* Date of Birth */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Date of Birth *</label>
                    <input
                      type="date"
                      className={`form-control ${errors.date_of_birth ? 'is-invalid' : ''}`}
                      name="date_of_birth"
                      value={formData.date_of_birth || ''}
                      onChange={handleChange}
                    />
                    {errors.date_of_birth && (
                      <div className="invalid-feedback">{errors.date_of_birth}</div>
                    )}
                  </div>

                  {/* Gender */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Gender *</label>
                    <select
                      className={`form-select ${errors.gender ? 'is-invalid' : ''}`}
                      name="gender"
                      value={formData.gender || 'M'}
                      onChange={handleChange}
                    >
                      <option value="M">Male</option>
                      <option value="F">Female</option>
                      <option value="O">Other</option>
                    </select>
                  </div>

                  {/* Phone Number */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Phone Number *</label>
                    <input
                      type="tel"
                      className={`form-control ${errors.phone_number ? 'is-invalid' : ''}`}
                      name="phone_number"
                      value={formData.phone_number || ''}
                      onChange={handleChange}
                      placeholder="Enter 10-digit phone number"
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
                      value={formData.email || ''}
                      onChange={handleChange}
                      placeholder="Enter email address"
                    />
                    {errors.email && (
                      <div className="invalid-feedback">{errors.email}</div>
                    )}
                  </div>

                  {/* Address */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Address *</label>
                    <input
                      type="text"
                      className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                      name="address"
                      value={formData.address || ''}
                      onChange={handleChange}
                      placeholder="Enter address"
                    />
                    {errors.address && (
                      <div className="invalid-feedback">{errors.address}</div>
                    )}
                  </div>

                  {/* City */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">City *</label>
                    <input
                      type="text"
                      className={`form-control ${errors.city ? 'is-invalid' : ''}`}
                      name="city"
                      value={formData.city || ''}
                      onChange={handleChange}
                      placeholder="Enter city"
                    />
                    {errors.city && (
                      <div className="invalid-feedback">{errors.city}</div>
                    )}
                  </div>

                  {/* State */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">State *</label>
                    <input
                      type="text"
                      className={`form-control ${errors.state ? 'is-invalid' : ''}`}
                      name="state"
                      value={formData.state || ''}
                      onChange={handleChange}
                      placeholder="Enter state"
                    />
                    {errors.state && (
                      <div className="invalid-feedback">{errors.state}</div>
                    )}
                  </div>

                  {/* Country */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Country *</label>
                    <input
                      type="text"
                      className={`form-control ${errors.country ? 'is-invalid' : ''}`}
                      name="country"
                      value={formData.country || ''}
                      onChange={handleChange}
                      placeholder="Enter country"
                    />
                    {errors.country && (
                      <div className="invalid-feedback">{errors.country}</div>
                    )}
                  </div>

                  {/* Pincode */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Pincode *</label>
                    <input
                      type="text"
                      className={`form-control ${errors.pincode ? 'is-invalid' : ''}`}
                      name="pincode"
                      value={formData.pincode || ''}
                      onChange={handleChange}
                      placeholder="Enter 6-digit pincode"
                      maxLength="6"
                    />
                    {errors.pincode && (
                      <div className="invalid-feedback">{errors.pincode}</div>
                    )}
                  </div>

                  {/* Emergency Contact Name */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Emergency Contact Name *</label>
                    <input
                      type="text"
                      className={`form-control ${errors.emergency_contact_name ? 'is-invalid' : ''}`}
                      name="emergency_contact_name"
                      value={formData.emergency_contact_name || ''}
                      onChange={handleChange}
                      placeholder="Enter emergency contact name"
                    />
                    {errors.emergency_contact_name && (
                      <div className="invalid-feedback">{errors.emergency_contact_name}</div>
                    )}
                  </div>

                  {/* Emergency Contact Phone */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Emergency Contact Phone *</label>
                    <input
                      type="tel"
                      className={`form-control ${errors.emergency_contact_phone ? 'is-invalid' : ''}`}
                      name="emergency_contact_phone"
                      value={formData.emergency_contact_phone || ''}
                      onChange={handleChange}
                      placeholder="Enter emergency contact phone"
                    />
                    {errors.emergency_contact_phone && (
                      <div className="invalid-feedback">{errors.emergency_contact_phone}</div>
                    )}
                  </div>

                  {/* Current Level */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Current Level *</label>
                    <input
                      type="number"
                      className={`form-control ${errors.current_level ? 'is-invalid' : ''}`}
                      name="current_level"
                      value={formData.current_level || 0}
                      onChange={handleChange}
                      placeholder="Enter current level"
                      min="0"
                    />
                    {errors.current_level && (
                      <div className="invalid-feedback">{errors.current_level}</div>
                    )}
                  </div>

                  {/* Blood Group */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Blood Group</label>
                    <select
                      className="form-select"
                      name="blood_group"
                      value={formData.blood_group || ''}
                      onChange={handleChange}
                    >
                      <option value="">Select Blood Group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>

                  {/* Medical Expiry Date */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Medical Expiry Date</label>
                    <input
                      type="date"
                      className="form-control"
                      name="medical_expiry_date"
                      value={formData.medical_expiry_date || ''}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Note */}
                <div className="ac-note mb-4">
                  <small className="text-muted">
                    Note: Safety induction status is automatically set to "true".
                  </small>
                </div>

                {/* Form Actions */}
                <div className="ac-actions">
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
                    {loading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Candidate' : 'Add Candidate')}
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

export default AddCandidate;