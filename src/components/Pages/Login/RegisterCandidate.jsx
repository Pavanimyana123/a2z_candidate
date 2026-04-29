import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import "./Register.css";
import Swal from 'sweetalert2';
import { BASE_URL } from "../../../ApiUrl";

const RegisterCandidate = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [levelsLoading, setLevelsLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [levels, setLevels] = useState([]);

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
    current_level: '',
    blood_group: '',
    medical_expiry_date: '',
  });

  useEffect(() => {
    fetchLevels();
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
        const activeLevels = result.data.filter(level => level.is_active);
        setLevels(activeLevels);
        console.log('✅ Levels fetched successfully:', activeLevels);
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

  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      fetchCandidateData();
    }
  }, [id]);

  const fetchCandidateData = async () => {
    try {
      setFetchLoading(true);
      const response = await fetch(`${BASE_URL}/api/candidate/candidates/${id}/`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.status && result.data) {
        const candidateData = result.data;
        const formattedData = {
          full_name: candidateData.full_name || '',
          date_of_birth: candidateData.date_of_birth ? candidateData.date_of_birth.split('T')[0] : '',
          gender: candidateData.gender || 'M',
          phone_number: candidateData.phone_number || '',
          email: candidateData.email || '',
          address: candidateData.address || '',
          city: candidateData.city || '',
          state: candidateData.state || '',
          country: candidateData.country || '',
          pincode: candidateData.pincode || '',
          emergency_contact_name: candidateData.emergency_contact_name || '',
          emergency_contact_phone: candidateData.emergency_contact_phone || '',
          current_level: candidateData.current_level ? parseInt(candidateData.current_level) : '',
          blood_group: candidateData.blood_group || '',
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
    
    if (name === "current_level") {
      setFormData(prev => ({
        ...prev,
        [name]: value ? parseInt(value) : ""
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const clearCurrentLevel = () => {
    setFormData(prev => ({
      ...prev,
      current_level: ""
    }));
  };

  const getLevelDisplay = (level) => {
    return `${level.name} (Level ${level.number})`;
  };

  const validateForm = () => {
    console.log('Starting form validation...');
    console.log('Current form data:', formData);
    
    const newErrors = {};

    if (!formData.full_name?.trim()) {
      newErrors.full_name = "Full name is required";
    }

    if (!formData.date_of_birth) {
      newErrors.date_of_birth = "Date of birth is required";
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

    if (!formData.address?.trim()) {
      newErrors.address = "Address is required";
    }

    if (!formData.city?.trim()) {
      newErrors.city = "City is required";
    }

    if (!formData.state?.trim()) {
      newErrors.state = "State is required";
    }

    if (!formData.country?.trim()) {
      newErrors.country = "Country is required";
    }

    if (!formData.pincode?.trim()) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Please enter a valid 6-digit pincode";
    }

    if (!formData.emergency_contact_name?.trim()) {
      newErrors.emergency_contact_name = "Emergency contact name is required";
    }

    if (!formData.emergency_contact_phone?.trim()) {
      newErrors.emergency_contact_phone = "Emergency contact phone is required";
    } else if (!/^\d{10}$/.test(formData.emergency_contact_phone.replace(/\D/g, ''))) {
      newErrors.emergency_contact_phone = "Please enter a valid 10-digit phone number";
    }

    if (!formData.current_level && formData.current_level !== 0) {
      newErrors.current_level = "Current level is required";
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

    const payload = {
      full_name: formData.full_name,
      date_of_birth: formData.date_of_birth,
      gender: formData.gender,
      phone_number: formData.phone_number,
      email: formData.email,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      country: formData.country,
      pincode: formData.pincode,
      emergency_contact_name: formData.emergency_contact_name,
      emergency_contact_phone: formData.emergency_contact_phone,
      blood_group: formData.blood_group || '',
      medical_expiry_date: formData.medical_expiry_date || '',
      safety_induction_status: true,
      current_level: formData.current_level ? parseInt(formData.current_level) : null
    };

    Object.keys(payload).forEach(key => {
      if (payload[key] === undefined || payload[key] === null || payload[key] === '') {
        delete payload[key];
      }
    });

    console.log('📦 Payload:', payload);
    
    const method = isEditMode ? 'PUT' : 'POST';
    const url = isEditMode 
      ? `${BASE_URL}/api/candidate/candidates/${id}/` 
      : `${BASE_URL}/api/candidate/candidates/`;

    try {
      const response = await fetch(url, {
        method: method,
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
        throw new Error(responseData?.message || `Failed to ${isEditMode ? 'update' : 'create'} candidate`);
      }

      await Swal.fire({
        icon: 'success',
        title: isEditMode ? 'Updated!' : 'Created!',
        text: `Candidate has been ${isEditMode ? 'updated' : 'created'} successfully.`,
        timer: 2000,
        showConfirmButton: false
      });
      
      navigate('/');
    } catch (err) {
      console.error(`❌ Error:`, err);
      setError(err.message || `Failed to ${isEditMode ? 'update' : 'create'} candidate.`);
      
      Swal.fire({
        icon: 'error',
        title: isEditMode ? 'Update Failed' : 'Creation Failed',
        text: err.message || `Failed to ${isEditMode ? 'update' : 'create'} candidate.`,
        timer: 3000,
        showConfirmButton: true
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  const handleCancel = () => {
    navigate('/candidate');
  };

  if (fetchLoading || levelsLoading) {
    return (
      <div className="register-candidate-page">
        <div className="register-candidate-loading">
          <div className="register-candidate-loading__spinner"></div>
          <p className="register-candidate-loading__text">
            {fetchLoading ? 'Loading candidate data...' : 'Loading levels...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="register-candidate-page">
      <div className="register-candidate-wrapper">
        {/* Header with Back Button */}
        <div className="register-candidate-header">
          <button 
            type="button" 
            className="register-candidate-header__back-btn" 
            onClick={handleBack}
            title="Go back to home"
          >
            ←
          </button>
          <div className="register-candidate-header__title-wrapper">
            <h2 className="register-candidate-header__title">
              {isEditMode ? 'Edit Candidate' : 'Add New Candidate'}
            </h2>
            <p className="register-candidate-header__subtitle">
              {isEditMode ? 'Update the candidate details below' : 'Fill in the candidate details below'}
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="register-candidate-alert register-candidate-alert--error" role="alert">
            <span className="register-candidate-alert__message">
              <strong>Error:</strong> {error}
            </span>
            <button
              type="button"
              className="register-candidate-alert__close-btn"
              onClick={() => setError('')}
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        )}

        {/* Form */}
        <form className="register-candidate-form" onSubmit={handleSubmit}>
          {/* Personal Information Section */}
          <div className="register-candidate-section">
            <h3 className="register-candidate-section__title">
              <span className="register-candidate-section__title-icon">👤</span>
              Personal Information
            </h3>
            <div className="register-candidate-form__row">
              {/* Full Name */}
              <div className="register-candidate-form__col-full">
                <div className="register-candidate-form__field-group">
                  <label className="register-candidate-form__label">
                    Full Name <span className="register-candidate-form__required">*</span>
                  </label>
                  <input                    type="text"
                    className={`register-candidate-form__input ${errors.full_name ? 'register-candidate-form__input--error' : ''}`}
                    name="full_name"
                    value={formData.full_name || ''}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    disabled={loading}
                  />
                  {errors.full_name && (
                    <span className="register-candidate-form__error-text">{errors.full_name}</span>
                  )}
                </div>
              </div>

              {/* Date of Birth, Gender, Blood Group */}
              <div className="register-candidate-form__col-third">
                <div className="register-candidate-form__field-group">
                  <label className="register-candidate-form__label">
                    Date of Birth <span className="register-candidate-form__required">*</span>
                  </label>
                  <input
                    type="date"
                    className={`register-candidate-form__input ${errors.date_of_birth ? 'register-candidate-form__input--error' : ''}`}
                    name="date_of_birth"
                    value={formData.date_of_birth || ''}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  {errors.date_of_birth && (
                    <span className="register-candidate-form__error-text">{errors.date_of_birth}</span>
                  )}
                </div>
              </div>

              <div className="register-candidate-form__col-third">
                <div className="register-candidate-form__field-group">
                  <label className="register-candidate-form__label">
                    Gender <span className="register-candidate-form__required">*</span>
                  </label>
                  <select
                    className={`register-candidate-form__select ${errors.gender ? 'register-candidate-form__select--error' : ''}`}
                    name="gender"
                    value={formData.gender || 'M'}
                    onChange={handleChange}
                    disabled={loading}
                  >
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                    <option value="O">Other</option>
                  </select>
                  {errors.gender && (
                    <span className="register-candidate-form__error-text">{errors.gender}</span>
                  )}
                </div>
              </div>

              <div className="register-candidate-form__col-third">
                <div className="register-candidate-form__field-group">
                  <label className="register-candidate-form__label">Blood Group</label>
                  <select
                    className="register-candidate-form__select"
                    name="blood_group"
                    value={formData.blood_group || ''}
                    onChange={handleChange}
                    disabled={loading}
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
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="register-candidate-section">
            <h3 className="register-candidate-section__title">
              <span className="register-candidate-section__title-icon">📞</span>
              Contact Information
            </h3>
            <div className="register-candidate-form__row">
              {/* Phone Number and Email */}
              <div className="register-candidate-form__col-half">
                <div className="register-candidate-form__field-group">
                  <label className="register-candidate-form__label">
                    Phone Number <span className="register-candidate-form__required">*</span>
                  </label>
                  <input
                    type="tel"
                    className={`register-candidate-form__input ${errors.phone_number ? 'register-candidate-form__input--error' : ''}`}
                    name="phone_number"
                    value={formData.phone_number || ''}
                    onChange={handleChange}
                    placeholder="Enter 10-digit phone number"
                    maxLength="10"
                    disabled={loading}
                  />
                  {errors.phone_number && (
                    <span className="register-candidate-form__error-text">{errors.phone_number}</span>
                  )}
                </div>
              </div>

              <div className="register-candidate-form__col-half">
                <div className="register-candidate-form__field-group">
                  <label className="register-candidate-form__label">
                    Email <span className="register-candidate-form__required">*</span>
                  </label>
                  <input
                    type="email"
                    className={`register-candidate-form__input ${errors.email ? 'register-candidate-form__input--error' : ''}`}
                    name="email"
                    value={formData.email || ''}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    disabled={loading}
                  />
                  {errors.email && (
                    <span className="register-candidate-form__error-text">{errors.email}</span>
                  )}
                </div>
              </div>

              {/* Address - Full Width */}
              <div className="register-candidate-form__col-full">
                <div className="register-candidate-form__field-group">
                  <label className="register-candidate-form__label">
                    Address <span className="register-candidate-form__required">*</span>
                  </label>
                  <input
                    type="text"
                    className={`register-candidate-form__input ${errors.address ? 'register-candidate-form__input--error' : ''}`}
                    name="address"
                    value={formData.address || ''}
                    onChange={handleChange}
                    placeholder="Enter full address"
                    disabled={loading}
                  />
                  {errors.address && (
                    <span className="register-candidate-form__error-text">{errors.address}</span>
                  )}
                </div>
              </div>

              {/* City, State, Country */}
              <div className="register-candidate-form__col-third">
                <div className="register-candidate-form__field-group">
                  <label className="register-candidate-form__label">
                    City <span className="register-candidate-form__required">*</span>
                  </label>
                  <input
                    type="text"
                    className={`register-candidate-form__input ${errors.city ? 'register-candidate-form__input--error' : ''}`}
                    name="city"
                    value={formData.city || ''}
                    onChange={handleChange}
                    placeholder="Enter city"
                    disabled={loading}
                  />
                  {errors.city && (
                    <span className="register-candidate-form__error-text">{errors.city}</span>
                  )}
                </div>
              </div>

              <div className="register-candidate-form__col-third">
                <div className="register-candidate-form__field-group">
                  <label className="register-candidate-form__label">
                    State <span className="register-candidate-form__required">*</span>
                  </label>
                  <input
                    type="text"
                    className={`register-candidate-form__input ${errors.state ? 'register-candidate-form__input--error' : ''}`}
                    name="state"
                    value={formData.state || ''}
                    onChange={handleChange}
                    placeholder="Enter state"
                    disabled={loading}
                  />
                  {errors.state && (
                    <span className="register-candidate-form__error-text">{errors.state}</span>
                  )}
                </div>
              </div>

              <div className="register-candidate-form__col-third">
                <div className="register-candidate-form__field-group">
                  <label className="register-candidate-form__label">
                    Country <span className="register-candidate-form__required">*</span>
                  </label>
                  <input
                    type="text"
                    className={`register-candidate-form__input ${errors.country ? 'register-candidate-form__input--error' : ''}`}
                    name="country"
                    value={formData.country || ''}
                    onChange={handleChange}
                    placeholder="Enter country"
                    disabled={loading}
                  />
                  {errors.country && (
                    <span className="register-candidate-form__error-text">{errors.country}</span>
                  )}
                </div>
              </div>

              {/* Pincode */}
              <div className="register-candidate-form__col-half">
                <div className="register-candidate-form__field-group">
                  <label className="register-candidate-form__label">
                    Pincode <span className="register-candidate-form__required">*</span>
                  </label>
                  <input
                    type="text"
                    className={`register-candidate-form__input ${errors.pincode ? 'register-candidate-form__input--error' : ''}`}
                    name="pincode"
                    value={formData.pincode || ''}
                    onChange={handleChange}
                    placeholder="Enter 6-digit pincode"
                    maxLength="6"
                    disabled={loading}
                  />
                  {errors.pincode && (
                    <span className="register-candidate-form__error-text">{errors.pincode}</span>
                  )}
                </div>
              </div>

              {/* Medical Expiry Date */}
              <div className="register-candidate-form__col-half">
                <div className="register-candidate-form__field-group">
                  <label className="register-candidate-form__label">Medical Expiry Date</label>
                  <input
                    type="date"
                    className="register-candidate-form__input"
                    name="medical_expiry_date"
                    value={formData.medical_expiry_date || ''}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Contact Section */}
          <div className="register-candidate-section">
            <h3 className="register-candidate-section__title">
              <span className="register-candidate-section__title-icon">🆘</span>
              Emergency Contact
            </h3>
            <div className="register-candidate-form__row">
              <div className="register-candidate-form__col-half">
                <div className="register-candidate-form__field-group">
                  <label className="register-candidate-form__label">
                    Emergency Contact Name <span className="register-candidate-form__required">*</span>
                  </label>
                  <input
                    type="text"
                    className={`register-candidate-form__input ${errors.emergency_contact_name ? 'register-candidate-form__input--error' : ''}`}
                    name="emergency_contact_name"
                    value={formData.emergency_contact_name || ''}
                    onChange={handleChange}
                    placeholder="Enter emergency contact name"
                    disabled={loading}
                  />
                  {errors.emergency_contact_name && (
                    <span className="register-candidate-form__error-text">{errors.emergency_contact_name}</span>
                  )}
                </div>
              </div>

              <div className="register-candidate-form__col-half">
                <div className="register-candidate-form__field-group">
                  <label className="register-candidate-form__label">
                    Emergency Contact Phone <span className="register-candidate-form__required">*</span>
                  </label>
                  <input
                    type="tel"
                    className={`register-candidate-form__input ${errors.emergency_contact_phone ? 'register-candidate-form__input--error' : ''}`}
                    name="emergency_contact_phone"
                    value={formData.emergency_contact_phone || ''}
                    onChange={handleChange}
                    placeholder="Enter emergency contact phone"
                    maxLength="10"
                    disabled={loading}
                  />
                  {errors.emergency_contact_phone && (
                    <span className="register-candidate-form__error-text">{errors.emergency_contact_phone}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Training Information Section */}
          <div className="register-candidate-section">
            <h3 className="register-candidate-section__title">
              <span className="register-candidate-section__title-icon">📚</span>
              Training Information
            </h3>
            <div className="register-candidate-form__row">
              {/* Current Level */}
              <div className="register-candidate-form__col-half">
                <div className="register-candidate-form__field-group">
                  <label className="register-candidate-form__label">
                    Current Level <span className="register-candidate-form__required">*</span>
                  </label>
                  <div className="register-candidate-form__select-wrapper">
                    <select
                      className={`register-candidate-form__select ${errors.current_level ? 'register-candidate-form__select--error' : ''} ${formData.current_level ? 'register-candidate-form__select--has-value' : ''}`}
                      name="current_level"
                      value={formData.current_level || ''}
                      onChange={handleChange}
                      disabled={loading || levelsLoading || levels.length === 0}
                    >
                      <option value="">-- Select Level --</option>
                      {levels.map((level) => (
                        <option key={level.id} value={level.id}>
                          {getLevelDisplay(level)}
                        </option>
                      ))}
                    </select>
                    {formData.current_level && (
                      <button
                        type="button"
                        className="register-candidate-form__clear-btn"
                        onClick={clearCurrentLevel}
                        title="Clear selection"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  {errors.current_level && (
                    <span className="register-candidate-form__error-text">{errors.current_level}</span>
                  )}
                  {levels.length === 0 && !levelsLoading && (
                    <small className="register-candidate-form__warning-text">No active levels available</small>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="register-candidate-form__actions">
            <button
              type="button"
              className="register-candidate-form__btn register-candidate-form__btn--outline"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="register-candidate-form__btn register-candidate-form__btn--primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="register-candidate-form__btn-spinner"></span>
                  {isEditMode ? 'Updating...' : 'Creating...'}
                </>
              ) : (isEditMode ? 'Update Candidate' : 'Add Candidate')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterCandidate;