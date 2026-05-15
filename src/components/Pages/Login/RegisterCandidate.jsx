import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import "./Register.css";
import Swal from 'sweetalert2';
import { BASE_URL } from "../../../ApiUrl";
import { FaPlus, FaTrash } from 'react-icons/fa';

const RegisterCandidate = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);

  // State for certificates
  const [certificates, setCertificates] = useState([]);
  const [certificateErrors, setCertificateErrors] = useState({});

  // Issuer type options
  const issuerTypeOptions = [
    { value: 'Educational Institution', label: 'Educational Institution' },
    { value: 'Client Company', label: 'Client Company' },
    { value: 'A2Z Organization', label: 'A2Z Organization' },
    { value: 'Training Center', label: 'Training Center' },
    { value: 'Government Body', label: 'Government Body' },
    { value: 'Professional Body', label: 'Professional Body' },
    { value: 'Other', label: 'Other' },
  ];

  // Certification Type options (from backend Certification_Types)
  const certificationTypeOptions = [
    { value: 'Educational', label: 'Educational' },
    { value: 'Training', label: 'Training' },
    { value: 'Experience', label: 'Experience' },
    { value: 'Other', label: 'Other' },
  ];

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
    blood_group: '',
    medical_expiry_date: '',
    safety_induction_status: true,
  });

  // ─── Lifecycle ───────────────────────────────────────────────────────────────

  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      fetchCandidateData();
    } else {
      initializeCertificates();
    }
  }, [id]);

  // ─── Helpers ─────────────────────────────────────────────────────────────────

  const makeEmptyCert = () => ({
    id: Date.now() + Math.random(), // unique key
    // stored as the actual File object (or null)
    selectedFile: null,
    // existing remote document URL (edit mode)
    existing_document: null,
    document_name: '',
    // form fields
    certification_type: '',
    certification_type_other: '',
    issuer_type: '',
    issuer_type_other: '',
    issuer_name: '',
    issue_date: '',
    expiry_date: '',
    certificate_number: '',
    issuing_authority: '',
    errors: {},
  });

  const initializeCertificates = () => {
    setCertificates([makeEmptyCert()]);
  };

  // ─── API Calls ────────────────────────────────────────────────────────────────

  const fetchCandidateData = async () => {
    try {
      setFetchLoading(true);
      const response = await fetch(`${BASE_URL}/api/candidate/candidates/${id}/`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();

      if (result.status && result.data) {
        const d = result.data;
        setFormData({
          full_name: d.full_name || '',
          date_of_birth: d.date_of_birth ? d.date_of_birth.split('T')[0] : '',
          gender: d.gender || 'M',
          phone_number: d.phone_number || '',
          email: d.email || '',
          address: d.address || '',
          city: d.city || '',
          state: d.state || '',
          country: d.country || '',
          pincode: d.pincode || '',
          emergency_contact_name: d.emergency_contact_name || '',
          emergency_contact_phone: d.emergency_contact_phone || '',
          blood_group: d.blood_group || '',
          medical_expiry_date: d.medical_expiry_date
            ? d.medical_expiry_date.split('T')[0]
            : '',
          safety_induction_status: d.safety_induction_status || true,
        });

        await fetchCandidateCertifications(id);
      } else {
        throw new Error(result.message || 'Failed to fetch candidate data');
      }
    } catch (err) {
      setError(err.message);
      Swal.fire({
        icon: 'error',
        title: 'Failed to Load Candidate',
        text: err.message || 'An error occurred while loading candidate data',
        showConfirmButton: true,
      });
    } finally {
      setFetchLoading(false);
    }
  };

  const fetchCandidateCertifications = async (candidateId) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/candidate/certifications/?candidate=${candidateId}`
      );
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();

      if (result.status && result.data && result.data.length > 0) {
        const existingCerts = result.data.map((cert) => ({
          id: cert.id,
          selectedFile: null,
          existing_document: cert.document || null,
          document_name: cert.document ? cert.document.split('/').pop() : '',
          certification_type: cert.certification_type || '',
          certification_type_other: cert.certification_type_other || '',
          issuer_type: cert.issuer_type || '',
          issuer_type_other: cert.issuer_type_other || '',
          issuer_name: cert.issuer_name || '',
          issue_date: cert.issue_date || '',
          expiry_date: cert.expiry_date || '',
          certificate_number: cert.certificate_number || '',
          issuing_authority: cert.issuing_authority || '',
          errors: {},
        }));
        setCertificates(existingCerts);
      } else {
        initializeCertificates();
      }
    } catch (err) {
      console.error('Error fetching candidate certifications:', err);
      initializeCertificates();
    }
  };

  // ─── Form Handlers ────────────────────────────────────────────────────────────

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // ─── Certificate Handlers ─────────────────────────────────────────────────────

  const addCertificate = () => {
    setCertificates((prev) => [...prev, makeEmptyCert()]);
  };

  const removeCertificate = (index) => {
    if (certificates.length === 1) {
      Swal.fire({
        icon: 'warning',
        title: 'Cannot Remove',
        text: 'You must have at least one certificate entry',
        confirmButtonText: 'OK',
      });
      return;
    }

    Swal.fire({
      title: 'Remove Certificate?',
      text: 'Are you sure you want to remove this certificate?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, remove it!',
    }).then((result) => {
      if (result.isConfirmed) {
        setCertificates((prev) => prev.filter((_, i) => i !== index));
        const newCertErrors = { ...certificateErrors };
        delete newCertErrors[index];
        setCertificateErrors(newCertErrors);
      }
    });
  };

  const handleCertificateChange = (index, field, value) => {
    setCertificates((prev) =>
      prev.map((cert, i) => {
        if (i !== index) return cert;
        return {
          ...cert,
          [field]: value,
          errors: { ...cert.errors, [field]: '' },
        };
      })
    );
  };

  /**
   * Store the raw File object — no base64 conversion.
   * The file will be appended directly to FormData on submit.
   */
  const handleCertificateFileChange = (index, file) => {
    if (!file) return;
    setCertificates((prev) =>
      prev.map((cert, i) => {
        if (i !== index) return cert;
        return {
          ...cert,
          selectedFile: file,
          document_name: file.name,
          errors: { ...cert.errors, document: '' },
        };
      })
    );
  };

  // ─── Validation ───────────────────────────────────────────────────────────────

  const validateCertificates = () => {
    let isValid = true;
    const newCertErrors = {};

    certificates.forEach((cert, index) => {
      const errs = {};
      
      // Validate certification_type_other if certification_type is "Other"
      if (!cert.certification_type) {
        errs.certification_type = 'Certification type is required';
        isValid = false;
      } else if (cert.certification_type === 'Other' && !cert.certification_type_other?.trim()) {
        errs.certification_type_other = 'Please specify the certification type';
        isValid = false;
      }
      
      if (!cert.issuer_type) {
        errs.issuer_type = 'Issuer type is required';
        isValid = false;
      }
      
      // Validate issuer_type_other if issuer_type is "Other"
      if (cert.issuer_type === 'Other' && !cert.issuer_type_other?.trim()) {
        errs.issuer_type_other = 'Please specify the issuer type';
        isValid = false;
      }
      
      if (!cert.issuer_name?.trim()) {
        errs.issuer_name = 'Issuer name is required';
        isValid = false;
      }
      if (!cert.issue_date) {
        errs.issue_date = 'Issue date is required';
        isValid = false;
      }
      if (!cert.expiry_date) {
        errs.expiry_date = 'Expiry date is required';
        isValid = false;
      }
      if (cert.issue_date && cert.expiry_date) {
        if (new Date(cert.expiry_date) <= new Date(cert.issue_date)) {
          errs.expiry_date = 'Expiry date must be after issue date';
          isValid = false;
        }
      }
      if (!cert.certificate_number?.trim()) {
        errs.certificate_number = 'Certificate number is required';
        isValid = false;
      }
      if (!cert.issuing_authority?.trim()) {
        errs.issuing_authority = 'Issuing authority is required';
        isValid = false;
      }
      // Require a document only when creating a brand-new cert (no existing doc, no new file)
      if (!isEditMode && !cert.selectedFile && !cert.existing_document) {
        errs.document = 'Certificate document is required';
        isValid = false;
      }

      if (Object.keys(errs).length > 0) {
        newCertErrors[index] = errs;
      }
    });

    setCertificateErrors(newCertErrors);

    // Bubble errors into each cert's own error map for inline display
    setCertificates((prev) =>
      prev.map((cert, i) => ({
        ...cert,
        errors: newCertErrors[i] || {},
      }))
    );

    return isValid;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.full_name?.trim()) newErrors.full_name = 'Full name is required';
    if (!formData.date_of_birth) newErrors.date_of_birth = 'Date of birth is required';
    if (!formData.phone_number?.trim()) {
      newErrors.phone_number = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone_number.replace(/\D/g, ''))) {
      newErrors.phone_number = 'Please enter a valid 10-digit phone number';
    }
    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.address?.trim()) newErrors.address = 'Address is required';
    if (!formData.city?.trim()) newErrors.city = 'City is required';
    if (!formData.state?.trim()) newErrors.state = 'State is required';
    if (!formData.country?.trim()) newErrors.country = 'Country is required';
    if (!formData.pincode?.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Please enter a valid 6-digit pincode';
    }
    if (!formData.emergency_contact_name?.trim())
      newErrors.emergency_contact_name = 'Emergency contact name is required';
    if (!formData.emergency_contact_phone?.trim()) {
      newErrors.emergency_contact_phone = 'Emergency contact phone is required';
    } else if (
      !/^\d{10}$/.test(formData.emergency_contact_phone.replace(/\D/g, ''))
    ) {
      newErrors.emergency_contact_phone =
        'Please enter a valid 10-digit phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ─── Submit ───────────────────────────────────────────────────────────────────

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm() || !validateCertificates()) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Failed',
        text: 'Please check all required fields and try again.',
        showConfirmButton: true,
      });
      return;
    }

    setLoading(true);
    setError('');

    try {
      // ─── STEP 1: Build candidate JSON payload (no files) ───────────────────
      const candidatePayload = {
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
        safety_induction_status: formData.safety_induction_status,
      };

      console.log('📦 Candidate Payload (JSON):', JSON.stringify(candidatePayload, null, 2));

      // ─── STEP 2: Build certificate preview objects for the console ──────────
      const certPayloadPreview = certificates.map((cert, index) => ({
        [`certificate_${index + 1}`]: {
          candidate: '<<will be filled after candidate creation>>',
          certification_type: cert.certification_type,
          certification_type_other: cert.certification_type === 'Other' ? cert.certification_type_other : '',
          issuer_type: cert.issuer_type,
          issuer_type_other: cert.issuer_type === 'Other' ? cert.issuer_type_other : '',
          issuer_name: cert.issuer_name,
          issue_date: cert.issue_date,
          expiry_date: cert.expiry_date,
          certificate_number: cert.certificate_number,
          issuing_authority: cert.issuing_authority,
          document: cert.selectedFile
            ? { name: cert.selectedFile.name, size: cert.selectedFile.size, type: cert.selectedFile.type }
            : cert.existing_document || null,
        },
      }));

      console.log('📜 Certificates Payload (multipart — file info shown as object):',
        JSON.stringify(certPayloadPreview, null, 2)
      );

      // ─── STEP 3: POST candidate (JSON) ─────────────────────────────────────
      const method = isEditMode ? 'PUT' : 'POST';
      const candUrl = isEditMode
        ? `${BASE_URL}/api/candidate/candidates/${id}/`
        : `${BASE_URL}/api/candidate/candidates/`;

      const candidateRes = await fetch(candUrl, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(candidatePayload),
      });

      const candidateData = await candidateRes.json().catch(() => null);

      if (!candidateRes.ok) {
        if (candidateData?.errors) {
          const serverErrors = {};
          Object.keys(candidateData.errors).forEach((key) => {
            serverErrors[key] = Array.isArray(candidateData.errors[key])
              ? candidateData.errors[key][0]
              : candidateData.errors[key];
          });
          setErrors(serverErrors);
          throw new Error('Please check the form for errors');
        }
        throw new Error(
          candidateData?.message ||
            `Failed to ${isEditMode ? 'update' : 'create'} candidate`
        );
      }

      // Grab the real candidate ID from the response
      const candidateId = candidateData?.data?.id || id;
      console.log('✅ Candidate saved. ID:', candidateId);

      // ─── STEP 4: POST each certificate as multipart/form-data ──────────────
      const certUrl = `${BASE_URL}/api/candidate/certifications/`;
      const failures = [];

      for (let index = 0; index < certificates.length; index++) {
        const cert = certificates[index];

        const formDataCert = new FormData();
        formDataCert.append('candidate', candidateId);
        formDataCert.append('certification_type', cert.certification_type);
        
        // Only append certification_type_other if "Other" is selected
        if (cert.certification_type === 'Other' && cert.certification_type_other) {
          formDataCert.append('certification_type_other', cert.certification_type_other);
        }
        
        formDataCert.append('issuer_type', cert.issuer_type);
        
        // Only append issuer_type_other if "Other" is selected
        if (cert.issuer_type === 'Other' && cert.issuer_type_other) {
          formDataCert.append('issuer_type_other', cert.issuer_type_other);
        }
        
        formDataCert.append('issuer_name', cert.issuer_name);
        formDataCert.append('issue_date', cert.issue_date);
        formDataCert.append('expiry_date', cert.expiry_date);
        formDataCert.append('certificate_number', cert.certificate_number);
        formDataCert.append('issuing_authority', cert.issuing_authority);
        formDataCert.append('status', 'pending');
        formDataCert.append('is_approved', false);

        if (cert.selectedFile) {
          formDataCert.append('document', cert.selectedFile);
        }

        // ── Console log each cert FormData as readable object ────────────────
        const certLog = {};
        formDataCert.forEach((val, key) => {
          certLog[key] = val instanceof File
            ? { name: val.name, size: val.size, type: val.type }
            : val;
        });
        console.log(`📤 Certificate #${index + 1} FormData:`, JSON.stringify(certLog, null, 2));

        try {
          const certRes = await fetch(certUrl, {
            method: 'POST',
            body: formDataCert,
          });

          const certData = await certRes.json().catch(() => null);
          console.log(`✅ Certificate #${index + 1} response:`, certData);

          if (!certRes.ok) {
            failures.push({
              index: index + 1,
              error: certData?.message || certData?.detail || 'Unknown error',
            });
          }
        } catch (certErr) {
          failures.push({ index: index + 1, error: certErr.message });
        }
      }

      if (failures.length > 0) {
        const msg = failures.map((f) => `• Certificate ${f.index}: ${f.error}`).join('\n');
        throw new Error(`Candidate saved but some certificates failed:\n${msg}`);
      }

      await Swal.fire({
        icon: 'success',
        title: isEditMode ? 'Updated!' : 'Created!',
        html: `Candidate ${isEditMode ? 'updated' : 'created'} successfully.<br/>${certificates.length} certificate(s) included.`,
        timer: 2000,
        showConfirmButton: false,
      });

      navigate('/');

    } catch (err) {
      console.error('❌ Error:', err);
      setError(err.message || `Failed to ${isEditMode ? 'update' : 'create'} candidate.`);
      Swal.fire({
        icon: 'error',
        title: isEditMode ? 'Update Failed' : 'Creation Failed',
        text: err.message || `Failed to ${isEditMode ? 'update' : 'create'} candidate.`,
        showConfirmButton: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // ─── Navigation ───────────────────────────────────────────────────────────────

  const handleBack = () => navigate('/');
  const handleCancel = () => navigate('/candidate');

  // ─── Loading State ────────────────────────────────────────────────────────────

  if (fetchLoading) {
    return (
      <div className="register-candidate-page">
        <div className="register-candidate-loading">
          <div className="register-candidate-loading__spinner"></div>
          <p className="register-candidate-loading__text">Loading candidate data...</p>
        </div>
      </div>
    );
  }

  // ─── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="register-candidate-page">
      <div className="register-candidate-wrapper">

        {/* ── Header ── */}
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
              {isEditMode
                ? 'Update the candidate details below'
                : 'Fill in the candidate details and add certifications below'}
            </p>
          </div>
        </div>

        {/* ── Global Error ── */}
        {error && (
          <div
            className="register-candidate-alert register-candidate-alert--error"
            role="alert"
          >
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

        {/* ── Form ── */}
        <form className="register-candidate-form" onSubmit={handleSubmit}>

          {/* Personal Information */}
          <div className="register-candidate-section">
            <h3 className="register-candidate-section__title">
              <span className="register-candidate-section__title-icon">👤</span>
              Personal Information
            </h3>
            <div className="register-candidate-form__row">

              <div className="register-candidate-form__col-full">
                <div className="register-candidate-form__field-group">
                  <label className="register-candidate-form__label">
                    Full Name <span className="register-candidate-form__required">*</span>
                  </label>
                  <input
                    type="text"
                    className={`register-candidate-form__input ${errors.full_name ? 'register-candidate-form__input--error' : ''}`}
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    disabled={loading}
                  />
                  {errors.full_name && (
                    <span className="register-candidate-form__error-text">{errors.full_name}</span>
                  )}
                </div>
              </div>

              <div className="register-candidate-form__col-third">
                <div className="register-candidate-form__field-group">
                  <label className="register-candidate-form__label">
                    Date of Birth <span className="register-candidate-form__required">*</span>
                  </label>
                  <input
                    type="date"
                    className={`register-candidate-form__input ${errors.date_of_birth ? 'register-candidate-form__input--error' : ''}`}
                    name="date_of_birth"
                    value={formData.date_of_birth}
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
                    value={formData.gender}
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
                    value={formData.blood_group}
                    onChange={handleChange}
                    disabled={loading}
                  >
                    <option value="">Select Blood Group</option>
                    {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
              </div>

            </div>
          </div>

          {/* Contact Information */}
          <div className="register-candidate-section">
            <h3 className="register-candidate-section__title">
              <span className="register-candidate-section__title-icon">📞</span>
              Contact Information
            </h3>
            <div className="register-candidate-form__row">

              <div className="register-candidate-form__col-half">
                <div className="register-candidate-form__field-group">
                  <label className="register-candidate-form__label">
                    Phone Number <span className="register-candidate-form__required">*</span>
                  </label>
                  <input
                    type="tel"
                    className={`register-candidate-form__input ${errors.phone_number ? 'register-candidate-form__input--error' : ''}`}
                    name="phone_number"
                    value={formData.phone_number}
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
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    disabled={loading}
                  />
                  {errors.email && (
                    <span className="register-candidate-form__error-text">{errors.email}</span>
                  )}
                </div>
              </div>

              <div className="register-candidate-form__col-full">
                <div className="register-candidate-form__field-group">
                  <label className="register-candidate-form__label">
                    Address <span className="register-candidate-form__required">*</span>
                  </label>
                  <input
                    type="text"
                    className={`register-candidate-form__input ${errors.address ? 'register-candidate-form__input--error' : ''}`}
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter full address"
                    disabled={loading}
                  />
                  {errors.address && (
                    <span className="register-candidate-form__error-text">{errors.address}</span>
                  )}
                </div>
              </div>

              <div className="register-candidate-form__col-third">
                <div className="register-candidate-form__field-group">
                  <label className="register-candidate-form__label">
                    City <span className="register-candidate-form__required">*</span>
                  </label>
                  <input
                    type="text"
                    className={`register-candidate-form__input ${errors.city ? 'register-candidate-form__input--error' : ''}`}
                    name="city"
                    value={formData.city}
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
                    value={formData.state}
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
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="Enter country"
                    disabled={loading}
                  />
                  {errors.country && (
                    <span className="register-candidate-form__error-text">{errors.country}</span>
                  )}
                </div>
              </div>

              <div className="register-candidate-form__col-half">
                <div className="register-candidate-form__field-group">
                  <label className="register-candidate-form__label">
                    Pincode <span className="register-candidate-form__required">*</span>
                  </label>
                  <input
                    type="text"
                    className={`register-candidate-form__input ${errors.pincode ? 'register-candidate-form__input--error' : ''}`}
                    name="pincode"
                    value={formData.pincode}
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

              <div className="register-candidate-form__col-half">
                <div className="register-candidate-form__field-group">
                  <label className="register-candidate-form__label">Medical Expiry Date</label>
                  <input
                    type="date"
                    className="register-candidate-form__input"
                    name="medical_expiry_date"
                    value={formData.medical_expiry_date}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
              </div>

            </div>
          </div>

          {/* Emergency Contact */}
          <div className="register-candidate-section">
            <h3 className="register-candidate-section__title">
              <span className="register-candidate-section__title-icon">🆘</span>
              Emergency Contact
            </h3>
            <div className="register-candidate-form__row">

              <div className="register-candidate-form__col-half">
                <div className="register-candidate-form__field-group">
                  <label className="register-candidate-form__label">
                    Emergency Contact Name{' '}
                    <span className="register-candidate-form__required">*</span>
                  </label>
                  <input
                    type="text"
                    className={`register-candidate-form__input ${errors.emergency_contact_name ? 'register-candidate-form__input--error' : ''}`}
                    name="emergency_contact_name"
                    value={formData.emergency_contact_name}
                    onChange={handleChange}
                    placeholder="Enter emergency contact name"
                    disabled={loading}
                  />
                  {errors.emergency_contact_name && (
                    <span className="register-candidate-form__error-text">
                      {errors.emergency_contact_name}
                    </span>
                  )}
                </div>
              </div>

              <div className="register-candidate-form__col-half">
                <div className="register-candidate-form__field-group">
                  <label className="register-candidate-form__label">
                    Emergency Contact Phone{' '}
                    <span className="register-candidate-form__required">*</span>
                  </label>
                  <input
                    type="tel"
                    className={`register-candidate-form__input ${errors.emergency_contact_phone ? 'register-candidate-form__input--error' : ''}`}
                    name="emergency_contact_phone"
                    value={formData.emergency_contact_phone}
                    onChange={handleChange}
                    placeholder="Enter emergency contact phone"
                    maxLength="10"
                    disabled={loading}
                  />
                  {errors.emergency_contact_phone && (
                    <span className="register-candidate-form__error-text">
                      {errors.emergency_contact_phone}
                    </span>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* Certifications */}
          <div className="register-candidate-section">
            <h3 className="register-candidate-section__title">
              <span className="register-candidate-section__title-icon">📜</span>
              Certifications
            </h3>
            <p className="register-candidate-section__subtitle">
              Add professional certifications for this candidate
            </p>

            {certificates.map((cert, index) => (
              <div
                key={cert.id}
                className="certificate-entry"
                style={{
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  padding: '20px',
                  marginBottom: '20px',
                  position: 'relative',
                  backgroundColor: '#f9f9f9',
                }}
              >
                {/* Remove button */}
                {certificates.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeCertificate(index)}
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      background: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      padding: '5px 10px',
                      cursor: 'pointer',
                      fontSize: '12px',
                    }}
                  >
                    <FaTrash /> Remove
                  </button>
                )}

                <h4 style={{ marginBottom: '15px', color: '#333' }}>
                  Certificate #{index + 1}
                </h4>

                <div className="register-candidate-form__row">

                  {/* Certification Type */}
                  <div className="register-candidate-form__col-half">
                    <div className="register-candidate-form__field-group">
                      <label className="register-candidate-form__label">
                        Certification Type{' '}
                        <span className="register-candidate-form__required">*</span>
                      </label>
                      <select
                        className={`register-candidate-form__select ${cert.errors.certification_type ? 'register-candidate-form__select--error' : ''}`}
                        value={cert.certification_type}
                        onChange={(e) =>
                          handleCertificateChange(index, 'certification_type', e.target.value)
                        }
                        disabled={loading}
                      >
                        <option value="">Select Certification Type</option>
                        {certificationTypeOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      {cert.errors.certification_type && (
                        <span className="register-candidate-form__error-text">
                          {cert.errors.certification_type}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Conditional Other Certification Type Input */}
                  {cert.certification_type === 'Other' && (
                    <div className="register-candidate-form__col-half">
                      <div className="register-candidate-form__field-group">
                        <label className="register-candidate-form__label">
                          Please Specify Certification Type{' '}
                          <span className="register-candidate-form__required">*</span>
                        </label>
                        <input
                          type="text"
                          className={`register-candidate-form__input ${cert.errors.certification_type_other ? 'register-candidate-form__input--error' : ''}`}
                          value={cert.certification_type_other || ''}
                          onChange={(e) =>
                            handleCertificateChange(index, 'certification_type_other', e.target.value)
                          }
                          placeholder="Enter custom certification type (e.g., Professional, Academic)"
                          disabled={loading}
                        />
                        {cert.errors.certification_type_other && (
                          <span className="register-candidate-form__error-text">
                            {cert.errors.certification_type_other}
                          </span>
                        )}
                        <small style={{ color: '#6c757d', display: 'block', marginTop: '5px' }}>
                          Please specify the type of certification
                        </small>
                      </div>
                    </div>
                  )}

                  {/* Issuer Type */}
                  <div className="register-candidate-form__col-half">
                    <div className="register-candidate-form__field-group">
                      <label className="register-candidate-form__label">
                        Issuer Type{' '}
                        <span className="register-candidate-form__required">*</span>
                      </label>
                      <select
                        className={`register-candidate-form__select ${cert.errors.issuer_type ? 'register-candidate-form__select--error' : ''}`}
                        value={cert.issuer_type}
                        onChange={(e) =>
                          handleCertificateChange(index, 'issuer_type', e.target.value)
                        }
                        disabled={loading}
                      >
                        <option value="">Select Issuer Type</option>
                        {issuerTypeOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      {cert.errors.issuer_type && (
                        <span className="register-candidate-form__error-text">
                          {cert.errors.issuer_type}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Conditional Other Issuer Type Input */}
                  {cert.issuer_type === 'Other' && (
                    <div className="register-candidate-form__col-half">
                      <div className="register-candidate-form__field-group">
                        <label className="register-candidate-form__label">
                          Please Specify Issuer Type{' '}
                          <span className="register-candidate-form__required">*</span>
                        </label>
                        <input
                          type="text"
                          className={`register-candidate-form__input ${cert.errors.issuer_type_other ? 'register-candidate-form__input--error' : ''}`}
                          value={cert.issuer_type_other || ''}
                          onChange={(e) =>
                            handleCertificateChange(index, 'issuer_type_other', e.target.value)
                          }
                          placeholder="Enter custom issuer type (e.g., Non-profit Organization)"
                          disabled={loading}
                        />
                        {cert.errors.issuer_type_other && (
                          <span className="register-candidate-form__error-text">
                            {cert.errors.issuer_type_other}
                          </span>
                        )}
                        <small style={{ color: '#6c757d', display: 'block', marginTop: '5px' }}>
                          Please specify the type of issuing organization
                        </small>
                      </div>
                    </div>
                  )}

                  {/* Issuer Name */}
                  <div className="register-candidate-form__col-half">
                    <div className="register-candidate-form__field-group">
                      <label className="register-candidate-form__label">
                        Issuer Name{' '}
                        <span className="register-candidate-form__required">*</span>
                      </label>
                      <input
                        type="text"
                        className={`register-candidate-form__input ${cert.errors.issuer_name ? 'register-candidate-form__input--error' : ''}`}
                        value={cert.issuer_name}
                        onChange={(e) =>
                          handleCertificateChange(index, 'issuer_name', e.target.value)
                        }
                        placeholder="Enter issuer name"
                        disabled={loading}
                      />
                      {cert.errors.issuer_name && (
                        <span className="register-candidate-form__error-text">
                          {cert.errors.issuer_name}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Issue Date */}
                  <div className="register-candidate-form__col-half">
                    <div className="register-candidate-form__field-group">
                      <label className="register-candidate-form__label">
                        Issue Date{' '}
                        <span className="register-candidate-form__required">*</span>
                      </label>
                      <input
                        type="date"
                        className={`register-candidate-form__input ${cert.errors.issue_date ? 'register-candidate-form__input--error' : ''}`}
                        value={cert.issue_date}
                        onChange={(e) =>
                          handleCertificateChange(index, 'issue_date', e.target.value)
                        }
                        disabled={loading}
                      />
                      {cert.errors.issue_date && (
                        <span className="register-candidate-form__error-text">
                          {cert.errors.issue_date}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Expiry Date */}
                  <div className="register-candidate-form__col-half">
                    <div className="register-candidate-form__field-group">
                      <label className="register-candidate-form__label">
                        Expiry Date{' '}
                        <span className="register-candidate-form__required">*</span>
                      </label>
                      <input
                        type="date"
                        className={`register-candidate-form__input ${cert.errors.expiry_date ? 'register-candidate-form__input--error' : ''}`}
                        value={cert.expiry_date}
                        onChange={(e) =>
                          handleCertificateChange(index, 'expiry_date', e.target.value)
                        }
                        disabled={loading}
                      />
                      {cert.errors.expiry_date && (
                        <span className="register-candidate-form__error-text">
                          {cert.errors.expiry_date}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Certificate Number */}
                  <div className="register-candidate-form__col-half">
                    <div className="register-candidate-form__field-group">
                      <label className="register-candidate-form__label">
                        Certificate Number{' '}
                        <span className="register-candidate-form__required">*</span>
                      </label>
                      <input
                        type="text"
                        className={`register-candidate-form__input ${cert.errors.certificate_number ? 'register-candidate-form__input--error' : ''}`}
                        value={cert.certificate_number}
                        onChange={(e) =>
                          handleCertificateChange(index, 'certificate_number', e.target.value)
                        }
                        placeholder="Enter certificate number"
                        disabled={loading}
                      />
                      {cert.errors.certificate_number && (
                        <span className="register-candidate-form__error-text">
                          {cert.errors.certificate_number}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Issuing Authority */}
                  <div className="register-candidate-form__col-half">
                    <div className="register-candidate-form__field-group">
                      <label className="register-candidate-form__label">
                        Issuing Authority{' '}
                        <span className="register-candidate-form__required">*</span>
                      </label>
                      <input
                        type="text"
                        className={`register-candidate-form__input ${cert.errors.issuing_authority ? 'register-candidate-form__input--error' : ''}`}
                        value={cert.issuing_authority}
                        onChange={(e) =>
                          handleCertificateChange(index, 'issuing_authority', e.target.value)
                        }
                        placeholder="Enter issuing authority"
                        disabled={loading}
                      />
                      {cert.errors.issuing_authority && (
                        <span className="register-candidate-form__error-text">
                          {cert.errors.issuing_authority}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Document Upload */}
                  <div className="register-candidate-form__col-full">
                    <div className="register-candidate-form__field-group">
                      <label className="register-candidate-form__label">
                        Certificate Document{' '}
                        {!isEditMode && !cert.existing_document && (
                          <span className="register-candidate-form__required">*</span>
                        )}
                        {isEditMode && (
                          <span style={{ color: '#6c757d', fontSize: '13px' }}>
                            {' '}(optional — leave blank to keep existing)
                          </span>
                        )}
                      </label>
                      <input
                        type="file"
                        className={`register-candidate-form__input ${cert.errors.document ? 'register-candidate-form__input--error' : ''}`}
                        onChange={(e) =>
                          handleCertificateFileChange(index, e.target.files[0])
                        }
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        disabled={loading}
                      />
                      {cert.errors.document && (
                        <span className="register-candidate-form__error-text">
                          {cert.errors.document}
                        </span>
                      )}
                      {/* Show existing document link */}
                      {cert.existing_document && !cert.selectedFile && (
                        <small style={{ color: '#28a745', display: 'block', marginTop: '5px' }}>
                          ✓ Current document:{' '}
                          <a
                            href={cert.existing_document}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {cert.document_name || 'View file'}
                          </a>
                        </small>
                      )}
                      {/* Show newly selected file name */}
                      {cert.selectedFile && (
                        <small style={{ color: '#007bff', display: 'block', marginTop: '5px' }}>
                          New file selected: {cert.selectedFile.name}
                        </small>
                      )}
                      <small style={{ color: '#6c757d', display: 'block', marginTop: '5px' }}>
                        Supported formats: PDF, JPG, JPEG, PNG, DOC, DOCX (max 10 MB)
                      </small>
                    </div>
                  </div>

                </div>
              </div>
            ))}

            {/* Add Another Certificate — only in create mode */}
            {!isEditMode && (
              <div style={{ textAlign: 'center', marginTop: '15px' }}>
                <button
                  type="button"
                  onClick={addCertificate}
                  style={{
                    background: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    padding: '10px 20px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                  disabled={loading}
                >
                  <FaPlus /> Add Another Certificate
                </button>
              </div>
            )}
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
              ) : isEditMode ? (
                'Update Candidate'
              ) : (
                `Create Candidate with ${certificates.length} Certificate(s)`
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default RegisterCandidate;