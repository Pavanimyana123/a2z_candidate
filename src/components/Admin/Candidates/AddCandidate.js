import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../Layout/Sidebar';
import Header from '../Layout/Header';
import "./AddCandidate.css";
import Swal from 'sweetalert2';
import { BASE_URL } from "../../../ApiUrl";
import { FaPlus, FaTrash } from 'react-icons/fa';

const AddCandidate = () => {
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

  // Certification Type options
  const certificationTypeOptions = [
    { value: 'Educational', label: 'Educational' },
    { value: 'Training', label: 'Training' },
    { value: 'Experience', label: 'Experience' },
    { value: 'Other', label: 'Other' },
  ];

  // Education level options
  const educationLevelOptions = [
    { value: 'High School', label: 'High School' },
    { value: 'Bachelor\'s', label: 'Bachelor\'s Degree' },
    { value: 'Master\'s', label: 'Master\'s Degree' },
    { value: 'Doctorate', label: 'Doctorate (PhD)' },
    { value: 'Diploma', label: 'Diploma' },
    { value: 'Certificate', label: 'Certificate' },
    { value: 'Associate', label: 'Associate Degree' },
    { value: 'Other', label: 'Other' },
  ];

  // Training mode options
  const trainingModeOptions = [
    { value: 'online', label: 'Online' },
    { value: 'offline', label: 'Offline (In-person)' },
    { value: 'hybrid', label: 'Hybrid (Mixed)' },
  ];

  // Employment type options
  const employmentTypeOptions = [
    { value: 'full_time', label: 'Full Time' },
    { value: 'part_time', label: 'Part Time' },
    { value: 'contract', label: 'Contract' },
    { value: 'freelance', label: 'Freelance' },
    { value: 'internship', label: 'Internship' },
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
    candidate_status: 'pending',
  });

  const [professionalInfo, setProfessionalInfo] = useState({
    highest_qualification: '',
    specialization: '',
    college_university: '',
    graduation_year: '',
    current_role: '',
    experience_years: '0',
    current_company: '',
    industry: '',
    join_date: '',
    certifications: '',
    iso_certifications: '',
  });

  // Helper function to create empty certificate object
  const makeEmptyCert = () => ({
    id: Date.now() + Math.random(),
    selectedFile: null,
    existing_document: null,
    document_name: '',
    certification: null,
    certification_type: '',
    certification_type_other: '',
    issuer_type: '',
    issuer_type_other: '',
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
    issue_date: '',
    expiry_date: '',
    certificate_number: '',
    issuing_authority: '',
    education_level: '',
    field_of_study: '',
    grade_or_percentage: '',
    training_program_name: '',
    training_duration: '',
    training_mode: '',
    job_role: '',
    employment_type: '',
    work_responsibilities: '',
    errors: {},
  });

  const initializeCertificates = () => {
    setCertificates([makeEmptyCert()]);
  };

  // Fetch candidate data if in edit mode
  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      fetchCandidateData();
    } else {
      initializeCertificates();
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
        
        setFormData({
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
          blood_group: candidateData.blood_group || '',
          medical_expiry_date: candidateData.medical_expiry_date ? candidateData.medical_expiry_date.split('T')[0] : '',
          safety_induction_status: candidateData.safety_induction_status || true,
          candidate_status: candidateData.candidate_status || 'pending',
        });

        setProfessionalInfo({
          highest_qualification: candidateData.professional_info?.highest_qualification || '',
          specialization: candidateData.professional_info?.specialization || '',
          college_university: candidateData.professional_info?.college_university || '',
          graduation_year: candidateData.professional_info?.graduation_year || '',
          current_role: candidateData.professional_info?.current_role || '',
          experience_years: candidateData.professional_info?.experience_years?.toString() || '0',
          current_company: candidateData.professional_info?.current_company || '',
          industry: candidateData.professional_info?.industry || '',
          join_date: candidateData.professional_info?.join_date || '',
          certifications: candidateData.professional_info?.certifications || '',
          iso_certifications: candidateData.professional_info?.iso_certifications || '',
        });

        await fetchCandidateCertifications(id);
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
          certification: cert.certification || null,
          certification_type: cert.certification_type || '',
          certification_type_other: cert.certification_type_other || '',
          issuer_type: cert.issuer_type || '',
          issuer_type_other: cert.issuer_type_other || '',
          issuer_name: cert.issuer_name || '',
          issuer_email: cert.issuer_email || '',
          issuer_phone: cert.issuer_phone || '',
          issuer_website: cert.issuer_website || '',
          issuer_address: cert.issuer_address || '',
          issuer_city: cert.issuer_city || '',
          issuer_state: cert.issuer_state || '',
          issuer_country: cert.issuer_country || '',
          issuer_postal_code: cert.issuer_postal_code || '',
          issuer_description: cert.issuer_description || '',
          issuer_accreditation_number: cert.issuer_accreditation_number || '',
          issue_date: cert.issue_date || '',
          expiry_date: cert.expiry_date || '',
          certificate_number: cert.certificate_number || '',
          issuing_authority: cert.issuing_authority || '',
          education_level: cert.education_level || '',
          field_of_study: cert.field_of_study || '',
          grade_or_percentage: cert.grade_or_percentage || '',
          training_program_name: cert.training_program_name || '',
          training_duration: cert.training_duration || '',
          training_mode: cert.training_mode || '',
          job_role: cert.job_role || '',
          employment_type: cert.employment_type || '',
          work_responsibilities: cert.work_responsibilities || '',
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleProfessionalInfoChange = (e) => {
    const { name, value } = e.target;
    setProfessionalInfo(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Certificate handlers
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

  const handleCertificateFileChange = (index, file) => {
    if (!file) return;
    
    // Validate file type (accept more formats for admin)
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      Swal.fire({ 
        icon: "error", 
        title: "Invalid File Type", 
        text: "Please upload PDF, JPG, JPEG, PNG, DOC, or DOCX files", 
        timer: 3000 
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      Swal.fire({ 
        icon: "error", 
        title: "File Too Large", 
        text: "File size should not exceed 10MB", 
        timer: 3000 
      });
      return;
    }

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

  // Validation functions
  const validateCertificates = () => {
    let isValid = true;
    const newCertErrors = {};

    certificates.forEach((cert, index) => {
      const errs = {};
      
      if (!cert.certification_type) {
        errs.certification_type = 'Certification type is required';
        isValid = false;
      } else if (cert.certification_type === 'Other' && !cert.certification_type_other?.trim()) {
        errs.certification_type_other = 'Please specify the certification type';
        isValid = false;
      }
      
      if (cert.certification_type === 'Educational') {
        if (!cert.education_level) {
          errs.education_level = 'Education level is required';
          isValid = false;
        }
        if (!cert.field_of_study) {
          errs.field_of_study = 'Field of study is required';
          isValid = false;
        }
      } else if (cert.certification_type === 'Training') {
        if (!cert.training_program_name) {
          errs.training_program_name = 'Training program name is required';
          isValid = false;
        }
        if (!cert.training_duration) {
          errs.training_duration = 'Training duration is required';
          isValid = false;
        }
        if (!cert.training_mode) {
          errs.training_mode = 'Training mode is required';
          isValid = false;
        }
      } else if (cert.certification_type === 'Experience') {
        if (!cert.job_role) {
          errs.job_role = 'Job role is required';
          isValid = false;
        }
        if (!cert.employment_type) {
          errs.employment_type = 'Employment type is required';
          isValid = false;
        }
      }
      
      if (!cert.issuer_type) {
        errs.issuer_type = 'Issuer type is required';
        isValid = false;
      }
      
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

      if (!isEditMode && !cert.selectedFile && !cert.existing_document) {
        errs.document = 'Certificate document is required';
        isValid = false;
      }

      if (Object.keys(errs).length > 0) {
        newCertErrors[index] = errs;
      }
    });

    setCertificateErrors(newCertErrors);

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

    if (!formData.full_name?.trim()) newErrors.full_name = "Full name is required";
    if (!formData.date_of_birth) newErrors.date_of_birth = "Date of birth is required";

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

    if (!formData.address?.trim()) newErrors.address = "Address is required";
    if (!formData.city?.trim()) newErrors.city = "City is required";
    if (!formData.state?.trim()) newErrors.state = "State is required";
    if (!formData.country?.trim()) newErrors.country = "Country is required";

    if (!formData.pincode?.trim()) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Please enter a valid 6-digit pincode";
    }

    if (!formData.emergency_contact_name?.trim())
      newErrors.emergency_contact_name = "Emergency contact name is required";

    if (!formData.emergency_contact_phone?.trim()) {
      newErrors.emergency_contact_phone = "Emergency contact phone is required";
    } else if (!/^\d{10}$/.test(formData.emergency_contact_phone.replace(/\D/g, ''))) {
      newErrors.emergency_contact_phone = "Please enter a valid 10-digit phone number";
    }

    if (!professionalInfo.highest_qualification?.trim()) {
      newErrors.highest_qualification = "Highest qualification is required";
    }
    if (!professionalInfo.current_role?.trim()) {
      newErrors.current_role = "Current role is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit handler
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

      const requestData = new FormData();
      Object.entries(candidatePayload).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          requestData.append(key, value);
        }
      });

      requestData.append('professional_info', JSON.stringify(professionalInfo));

      const certificationsPayload = certificates.map((cert) => ({
        certification: cert.certification,
        certification_type: cert.certification_type,
        certification_type_other: cert.certification_type_other,
        issuer_type: cert.issuer_type,
        issuer_type_other: cert.issuer_type_other,
        issuer_name: cert.issuer_name,
        issuer_email: cert.issuer_email,
        issuer_phone: cert.issuer_phone,
        issuer_website: cert.issuer_website,
        issuer_address: cert.issuer_address,
        issuer_city: cert.issuer_city,
        issuer_state: cert.issuer_state,
        issuer_country: cert.issuer_country,
        issuer_postal_code: cert.issuer_postal_code,
        issuer_description: cert.issuer_description,
        issuer_accreditation_number: cert.issuer_accreditation_number,
        issue_date: cert.issue_date,
        expiry_date: cert.expiry_date,
        certificate_number: cert.certificate_number,
        issuing_authority: cert.issuing_authority || cert.issuer_name,
        status: 'approved',
        is_approved: true,
        education_level: cert.education_level,
        field_of_study: cert.field_of_study,
        grade_or_percentage: cert.grade_or_percentage,
        training_program_name: cert.training_program_name,
        training_duration: cert.training_duration,
        training_mode: cert.training_mode,
        job_role: cert.job_role,
        employment_type: cert.employment_type,
        work_responsibilities: cert.work_responsibilities,
      }));

      requestData.append('certifications', JSON.stringify(certificationsPayload));

      certificates.forEach((cert, index) => {
        if (cert.selectedFile) {
          requestData.append(`document_${index}`, cert.selectedFile);
        }
      });

      const method = isEditMode ? 'PUT' : 'POST';
      const url = isEditMode 
        ? `${BASE_URL}/api/candidate/candidates/${id}/` 
        : `${BASE_URL}/api/candidate/candidates/`;

      const response = await fetch(url, {
        method,
        body: requestData,
      });

      const responseData = await response.json().catch(() => null);

      if (!response.ok) {
        if (responseData?.errors) {
          const serverErrors = {};
          Object.keys(responseData.errors).forEach((key) => {
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
        html: `Candidate ${isEditMode ? 'updated' : 'created'} successfully.<br/>${certificates.length} certificate(s) included.`,
        timer: 2000,
        showConfirmButton: false
      });
      
      navigate('/candidate');
    } catch (err) {
      console.error(`❌ Error:`, err);
      setError(err.message || `Failed to ${isEditMode ? 'update' : 'create'} candidate.`);
      
      Swal.fire({
        icon: 'error',
        title: isEditMode ? 'Update Failed' : 'Creation Failed',
        text: err.message || `Failed to ${isEditMode ? 'update' : 'create'} candidate.`,
        showConfirmButton: true
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/candidate');
  };

  // Render type-specific fields
  const renderTypeSpecificFields = (cert, index) => {
    if (cert.certification_type === 'Educational') {
      return (
        <>
          <div className="col-md-4 mb-2">
            <label className="form-label">
              Education Level <span className="text-danger">*</span>
            </label>
            <select
              className={`form-select ${cert.errors.education_level ? 'is-invalid' : ''}`}
              value={cert.education_level}
              onChange={(e) => handleCertificateChange(index, 'education_level', e.target.value)}
              disabled={loading}
            >
              <option value="">Select Education Level</option>
              {educationLevelOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            {cert.errors.education_level && (
              <div className="invalid-feedback">{cert.errors.education_level}</div>
            )}
          </div>
          
          <div className="col-md-4 mb-2">
            <label className="form-label">
              Field of Study <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className={`form-control ${cert.errors.field_of_study ? 'is-invalid' : ''}`}
              value={cert.field_of_study}
              onChange={(e) => handleCertificateChange(index, 'field_of_study', e.target.value)}
              placeholder="e.g., Computer Science, Business Administration"
              disabled={loading}
            />
            {cert.errors.field_of_study && (
              <div className="invalid-feedback">{cert.errors.field_of_study}</div>
            )}
          </div>
          
          <div className="col-md-4 mb-2">
            <label className="form-label">Grade/Percentage</label>
            <input
              type="text"
              className="form-control"
              value={cert.grade_or_percentage}
              onChange={(e) => handleCertificateChange(index, 'grade_or_percentage', e.target.value)}
              placeholder="e.g., A+, 85%, 3.5 GPA"
              disabled={loading}
            />
          </div>
        </>
      );
    }
    
    if (cert.certification_type === 'Training') {
      return (
        <>
          <div className="col-md-4 mb-2">
            <label className="form-label">
              Training Program Name <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className={`form-control ${cert.errors.training_program_name ? 'is-invalid' : ''}`}
              value={cert.training_program_name}
              onChange={(e) => handleCertificateChange(index, 'training_program_name', e.target.value)}
              placeholder="Enter training program name"
              disabled={loading}
            />
            {cert.errors.training_program_name && (
              <div className="invalid-feedback">{cert.errors.training_program_name}</div>
            )}
          </div>
          
          <div className="col-md-4 mb-2">
            <label className="form-label">
              Training Duration <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className={`form-control ${cert.errors.training_duration ? 'is-invalid' : ''}`}
              value={cert.training_duration}
              onChange={(e) => handleCertificateChange(index, 'training_duration', e.target.value)}
              placeholder="e.g., 40 hours, 3 months, 2 weeks"
              disabled={loading}
            />
            {cert.errors.training_duration && (
              <div className="invalid-feedback">{cert.errors.training_duration}</div>
            )}
          </div>
          
          <div className="col-md-4 mb-2">
            <label className="form-label">
              Training Mode <span className="text-danger">*</span>
            </label>
            <select
              className={`form-select ${cert.errors.training_mode ? 'is-invalid' : ''}`}
              value={cert.training_mode}
              onChange={(e) => handleCertificateChange(index, 'training_mode', e.target.value)}
              disabled={loading}
            >
              <option value="">Select Training Mode</option>
              {trainingModeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            {cert.errors.training_mode && (
              <div className="invalid-feedback">{cert.errors.training_mode}</div>
            )}
          </div>
        </>
      );
    }
    
    if (cert.certification_type === 'Experience') {
      return (
        <>
          <div className="col-md-4 mb-2">
            <label className="form-label">
              Job Role <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className={`form-control ${cert.errors.job_role ? 'is-invalid' : ''}`}
              value={cert.job_role}
              onChange={(e) => handleCertificateChange(index, 'job_role', e.target.value)}
              placeholder="e.g., Senior Software Engineer, Project Manager"
              disabled={loading}
            />
            {cert.errors.job_role && (
              <div className="invalid-feedback">{cert.errors.job_role}</div>
            )}
          </div>
          
          <div className="col-md-4 mb-2">
            <label className="form-label">
              Employment Type <span className="text-danger">*</span>
            </label>
            <select
              className={`form-select ${cert.errors.employment_type ? 'is-invalid' : ''}`}
              value={cert.employment_type}
              onChange={(e) => handleCertificateChange(index, 'employment_type', e.target.value)}
              disabled={loading}
            >
              <option value="">Select Employment Type</option>
              {employmentTypeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            {cert.errors.employment_type && (
              <div className="invalid-feedback">{cert.errors.employment_type}</div>
            )}
          </div>
          
          <div className="col-md-12 mb-2">
            <label className="form-label">Work Responsibilities</label>
            <textarea
              className="form-control"
              value={cert.work_responsibilities}
              onChange={(e) => handleCertificateChange(index, 'work_responsibilities', e.target.value)}
              placeholder="Describe key responsibilities and achievements in this role"
              rows="3"
              disabled={loading}
            />
          </div>
        </>
      );
    }
    
    return null;
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
                <p>{isEditMode ? 'Update the candidate details below' : 'Fill in the candidate details and add certifications below'}</p>
              </div>
            </div>

            {/* Error Message */}
            {error && <div className="ac-error alert alert-danger">{error}</div>}

            {/* Form */}
            <div className="ac-form-container">
              <form onSubmit={handleSubmit}>
                {/* Personal Information Section */}
                <div className="row">
                  <div className="col-12">
                    <h5 className="mb-3">Personal Information</h5>
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      className={`form-control ${errors.full_name ? 'is-invalid' : ''}`}
                      name="full_name"
                      value={formData.full_name || ''}
                      onChange={handleChange}
                      placeholder="Enter full name"
                      disabled={loading}
                    />
                    {errors.full_name && (
                      <div className="invalid-feedback">{errors.full_name}</div>
                    )}
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label">Date of Birth *</label>
                    <input
                      type="date"
                      className={`form-control ${errors.date_of_birth ? 'is-invalid' : ''}`}
                      name="date_of_birth"
                      value={formData.date_of_birth || ''}
                      onChange={handleChange}
                      disabled={loading}
                    />
                    {errors.date_of_birth && (
                      <div className="invalid-feedback">{errors.date_of_birth}</div>
                    )}
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label">Gender *</label>
                    <select
                      className={`form-select ${errors.gender ? 'is-invalid' : ''}`}
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
                      <div className="invalid-feedback">{errors.gender}</div>
                    )}
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label">Blood Group</label>
                    <select
                      className="form-select"
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

                  <div className="col-md-4 mb-3">
                    <label className="form-label">Medical Expiry Date</label>
                    <input
                      type="date"
                      className="form-control"
                      name="medical_expiry_date"
                      value={formData.medical_expiry_date || ''}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Contact Information Section */}
                <div className="row mt-4">
                  <div className="col-12">
                    <h5 className="mb-3">Contact Information</h5>
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label">Phone Number *</label>
                    <input
                      type="tel"
                      className={`form-control ${errors.phone_number ? 'is-invalid' : ''}`}
                      name="phone_number"
                      value={formData.phone_number || ''}
                      onChange={handleChange}
                      placeholder="Enter 10-digit phone number"
                      maxLength="10"
                      disabled={loading}
                    />
                    {errors.phone_number && (
                      <div className="invalid-feedback">{errors.phone_number}</div>
                    )}
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label">Email *</label>
                    <input
                      type="email"
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      name="email"
                      value={formData.email || ''}
                      onChange={handleChange}
                      placeholder="Enter email address"
                      disabled={loading}
                    />
                    {errors.email && (
                      <div className="invalid-feedback">{errors.email}</div>
                    )}
                  </div>

                  <div className="col-md-12 mb-3">
                    <label className="form-label">Address *</label>
                    <input
                      type="text"
                      className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                      name="address"
                      value={formData.address || ''}
                      onChange={handleChange}
                      placeholder="Enter address"
                      disabled={loading}
                    />
                    {errors.address && (
                      <div className="invalid-feedback">{errors.address}</div>
                    )}
                  </div>

                  <div className="col-md-3 mb-3">
                    <label className="form-label">City *</label>
                    <input
                      type="text"
                      className={`form-control ${errors.city ? 'is-invalid' : ''}`}
                      name="city"
                      value={formData.city || ''}
                      onChange={handleChange}
                      placeholder="Enter city"
                      disabled={loading}
                    />
                    {errors.city && (
                      <div className="invalid-feedback">{errors.city}</div>
                    )}
                  </div>

                  <div className="col-md-3 mb-3">
                    <label className="form-label">State *</label>
                    <input
                      type="text"
                      className={`form-control ${errors.state ? 'is-invalid' : ''}`}
                      name="state"
                      value={formData.state || ''}
                      onChange={handleChange}
                      placeholder="Enter state"
                      disabled={loading}
                    />
                    {errors.state && (
                      <div className="invalid-feedback">{errors.state}</div>
                    )}
                  </div>

                  <div className="col-md-3 mb-3">
                    <label className="form-label">Country *</label>
                    <input
                      type="text"
                      className={`form-control ${errors.country ? 'is-invalid' : ''}`}
                      name="country"
                      value={formData.country || ''}
                      onChange={handleChange}
                      placeholder="Enter country"
                      disabled={loading}
                    />
                    {errors.country && (
                      <div className="invalid-feedback">{errors.country}</div>
                    )}
                  </div>

                  <div className="col-md-3 mb-3">
                    <label className="form-label">Pincode *</label>
                    <input
                      type="text"
                      className={`form-control ${errors.pincode ? 'is-invalid' : ''}`}
                      name="pincode"
                      value={formData.pincode || ''}
                      onChange={handleChange}
                      placeholder="Enter 6-digit pincode"
                      maxLength="6"
                      disabled={loading}
                    />
                    {errors.pincode && (
                      <div className="invalid-feedback">{errors.pincode}</div>
                    )}
                  </div>
                </div>

                {/* Emergency Contact Section */}
                <div className="row mt-4">
                  <div className="col-12">
                    <h5 className="mb-3">Emergency Contact</h5>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Emergency Contact Name *</label>
                    <input
                      type="text"
                      className={`form-control ${errors.emergency_contact_name ? 'is-invalid' : ''}`}
                      name="emergency_contact_name"
                      value={formData.emergency_contact_name || ''}
                      onChange={handleChange}
                      placeholder="Enter emergency contact name"
                      disabled={loading}
                    />
                    {errors.emergency_contact_name && (
                      <div className="invalid-feedback">{errors.emergency_contact_name}</div>
                    )}
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Emergency Contact Phone *</label>
                    <input
                      type="tel"
                      className={`form-control ${errors.emergency_contact_phone ? 'is-invalid' : ''}`}
                      name="emergency_contact_phone"
                      value={formData.emergency_contact_phone || ''}
                      onChange={handleChange}
                      placeholder="Enter emergency contact phone"
                      maxLength="10"
                      disabled={loading}
                    />
                    {errors.emergency_contact_phone && (
                      <div className="invalid-feedback">{errors.emergency_contact_phone}</div>
                    )}
                  </div>
                </div>

                {/* Professional Information Section */}
                <div className="row mt-4">
                  <div className="col-12">
                    <h5 className="mb-3">Professional Information</h5>
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label">
                      Highest Qualification <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.highest_qualification ? 'is-invalid' : ''}`}
                      name="highest_qualification"
                      value={professionalInfo.highest_qualification}
                      onChange={handleProfessionalInfoChange}
                      placeholder="Enter highest qualification"
                      disabled={loading}
                    />
                    {errors.highest_qualification && (
                      <div className="invalid-feedback">{errors.highest_qualification}</div>
                    )}
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label">Specialization</label>
                    <input
                      type="text"
                      className="form-control"
                      name="specialization"
                      value={professionalInfo.specialization}
                      onChange={handleProfessionalInfoChange}
                      placeholder="Enter specialization"
                      disabled={loading}
                    />
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label">College / University</label>
                    <input
                      type="text"
                      className="form-control"
                      name="college_university"
                      value={professionalInfo.college_university}
                      onChange={handleProfessionalInfoChange}
                      placeholder="Enter college or university"
                      disabled={loading}
                    />
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label">Graduation Year</label>
                    <input
                      type="number"
                      className="form-control"
                      name="graduation_year"
                      value={professionalInfo.graduation_year}
                      onChange={handleProfessionalInfoChange}
                      placeholder="Enter graduation year"
                      disabled={loading}
                    />
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label">
                      Current Role <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.current_role ? 'is-invalid' : ''}`}
                      name="current_role"
                      value={professionalInfo.current_role}
                      onChange={handleProfessionalInfoChange}
                      placeholder="Enter current role"
                      disabled={loading}
                    />
                    {errors.current_role && (
                      <div className="invalid-feedback">{errors.current_role}</div>
                    )}
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label">Experience Years</label>
                    <input
                      type="number"
                      className="form-control"
                      name="experience_years"
                      value={professionalInfo.experience_years}
                      onChange={handleProfessionalInfoChange}
                      placeholder="Years of experience"
                      step="0.5"
                      min="0"
                      disabled={loading}
                    />
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label">Current Company</label>
                    <input
                      type="text"
                      className="form-control"
                      name="current_company"
                      value={professionalInfo.current_company}
                      onChange={handleProfessionalInfoChange}
                      placeholder="Enter current company"
                      disabled={loading}
                    />
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label">Industry</label>
                    <input
                      type="text"
                      className="form-control"
                      name="industry"
                      value={professionalInfo.industry}
                      onChange={handleProfessionalInfoChange}
                      placeholder="Enter industry"
                      disabled={loading}
                    />
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label">Join Date</label>
                    <input
                      type="date"
                      className="form-control"
                      name="join_date"
                      value={professionalInfo.join_date}
                      onChange={handleProfessionalInfoChange}
                      disabled={loading}
                    />
                  </div>

                  {/* Candidate Status - Only show in edit mode */}
                  {isEditMode && (
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Candidate Status</label>
                      <select
                        className="form-select"
                        name="candidate_status"
                        value={formData.candidate_status || 'pending'}
                        onChange={handleChange}
                        disabled={loading}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="pending">Pending</option>
                      </select>
                    </div>
                  )}
                </div>

                {/* Certifications Section */}
                <div className="row mt-4">
                  <div className="col-12">
                    <h5 className="mb-3">Certifications</h5>
                    <p className="text-muted mb-3">Add professional certifications for this candidate</p>
                  </div>

                  {certificates.map((cert, index) => (
                    <div
                      key={cert.id}
                      className="card mb-3 p-3"
                      style={{ position: 'relative' }}
                    >
                      {/* Remove button */}
                      {certificates.length > 1 && (
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => removeCertificate(index)}
                          style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                          }}
                          disabled={loading}
                        >
                          <FaTrash /> Remove
                        </button>
                      )}

                      <h5 style={{ marginBottom: '15px', color: '#333' }}>
                        Certificate #{index + 1}
                      </h5>

                      <div className="row">
                        {/* Certification Type */}
                        <div className="col-md-4 mb-2">
                          <label className="form-label">
                            Certification Type <span className="text-danger">*</span>
                          </label>
                          <select
                            className={`form-select ${cert.errors.certification_type ? 'is-invalid' : ''}`}
                            value={cert.certification_type}
                            onChange={(e) => handleCertificateChange(index, 'certification_type', e.target.value)}
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
                            <div className="invalid-feedback">{cert.errors.certification_type}</div>
                          )}
                        </div>

                        {/* Conditional Other Certification Type Input */}
                        {cert.certification_type === 'Other' && (
                          <div className="col-md-4 mb-2">
                            <label className="form-label">
                              Please Specify <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className={`form-control ${cert.errors.certification_type_other ? 'is-invalid' : ''}`}
                              value={cert.certification_type_other || ''}
                              onChange={(e) => handleCertificateChange(index, 'certification_type_other', e.target.value)}
                              placeholder="Enter custom certification type"
                              disabled={loading}
                            />
                            {cert.errors.certification_type_other && (
                              <div className="invalid-feedback">{cert.errors.certification_type_other}</div>
                            )}
                          </div>
                        )}

                        {/* Type-specific fields */}
                        {renderTypeSpecificFields(cert, index)}

                        {/* Issuer Type */}
                        <div className="col-md-4 mb-2">
                          <label className="form-label">
                            Issuer Type <span className="text-danger">*</span>
                          </label>
                          <select
                            className={`form-select ${cert.errors.issuer_type ? 'is-invalid' : ''}`}
                            value={cert.issuer_type}
                            onChange={(e) => handleCertificateChange(index, 'issuer_type', e.target.value)}
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
                            <div className="invalid-feedback">{cert.errors.issuer_type}</div>
                          )}
                        </div>

                        {/* Conditional Other Issuer Type Input */}
                        {cert.issuer_type === 'Other' && (
                          <div className="col-md-4 mb-2">
                            <label className="form-label">
                              Please Specify <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className={`form-control ${cert.errors.issuer_type_other ? 'is-invalid' : ''}`}
                              value={cert.issuer_type_other || ''}
                              onChange={(e) => handleCertificateChange(index, 'issuer_type_other', e.target.value)}
                              placeholder="Enter custom issuer type"
                              disabled={loading}
                            />
                            {cert.errors.issuer_type_other && (
                              <div className="invalid-feedback">{cert.errors.issuer_type_other}</div>
                            )}
                          </div>
                        )}

                        {/* Issuer Name */}
                        <div className="col-md-4 mb-2">
                          <label className="form-label">
                            Issuer Name <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className={`form-control ${cert.errors.issuer_name ? 'is-invalid' : ''}`}
                            value={cert.issuer_name}
                            onChange={(e) => handleCertificateChange(index, 'issuer_name', e.target.value)}
                            placeholder="Enter issuer name"
                            disabled={loading}
                          />
                          {cert.errors.issuer_name && (
                            <div className="invalid-feedback">{cert.errors.issuer_name}</div>
                          )}
                        </div>

                        {/* Issuer Contact Information */}
                        <div className="col-12 mt-2 mb-2">
                          <h6>Issuer Contact Information</h6>
                        </div>

                        <div className="col-md-4 mb-2">
                          <label className="form-label">Issuer Email</label>
                          <input
                            type="email"
                            className="form-control"
                            value={cert.issuer_email}
                            onChange={(e) => handleCertificateChange(index, 'issuer_email', e.target.value)}
                            placeholder="issuer@example.com"
                            disabled={loading}
                          />
                        </div>

                        <div className="col-md-4 mb-2">
                          <label className="form-label">Issuer Phone</label>
                          <input
                            type="tel"
                            className="form-control"
                            value={cert.issuer_phone}
                            onChange={(e) => handleCertificateChange(index, 'issuer_phone', e.target.value)}
                            placeholder="Contact phone number"
                            disabled={loading}
                          />
                        </div>

                        <div className="col-md-4 mb-2">
                          <label className="form-label">Issuer Website</label>
                          <input
                            type="url"
                            className="form-control"
                            value={cert.issuer_website}
                            onChange={(e) => handleCertificateChange(index, 'issuer_website', e.target.value)}
                            placeholder="https://example.com"
                            disabled={loading}
                          />
                        </div>

                        <div className="col-md-12 mb-2">
                          <label className="form-label">Issuer Address</label>
                          <input
                            type="text"
                            className="form-control"
                            value={cert.issuer_address}
                            onChange={(e) => handleCertificateChange(index, 'issuer_address', e.target.value)}
                            placeholder="Street address"
                            disabled={loading}
                          />
                        </div>

                        <div className="col-md-3 mb-2">
                          <label className="form-label">City</label>
                          <input
                            type="text"
                            className="form-control"
                            value={cert.issuer_city}
                            onChange={(e) => handleCertificateChange(index, 'issuer_city', e.target.value)}
                            placeholder="City"
                            disabled={loading}
                          />
                        </div>

                        <div className="col-md-3 mb-2">
                          <label className="form-label">State</label>
                          <input
                            type="text"
                            className="form-control"
                            value={cert.issuer_state}
                            onChange={(e) => handleCertificateChange(index, 'issuer_state', e.target.value)}
                            placeholder="State/Province"
                            disabled={loading}
                          />
                        </div>

                        <div className="col-md-3 mb-2">
                          <label className="form-label">Country</label>
                          <input
                            type="text"
                            className="form-control"
                            value={cert.issuer_country}
                            onChange={(e) => handleCertificateChange(index, 'issuer_country', e.target.value)}
                            placeholder="Country"
                            disabled={loading}
                          />
                        </div>

                        <div className="col-md-3 mb-2">
                          <label className="form-label">Postal Code</label>
                          <input
                            type="text"
                            className="form-control"
                            value={cert.issuer_postal_code}
                            onChange={(e) => handleCertificateChange(index, 'issuer_postal_code', e.target.value)}
                            placeholder="Postal/Zip code"
                            disabled={loading}
                          />
                        </div>

                        <div className="col-md-12 mb-2">
                          <label className="form-label">Issuer Description</label>
                          <textarea
                            className="form-control"
                            value={cert.issuer_description}
                            onChange={(e) => handleCertificateChange(index, 'issuer_description', e.target.value)}
                            placeholder="Brief description of the issuing organization"
                            rows="2"
                            disabled={loading}
                          />
                        </div>

                        <div className="col-md-6 mb-2">
                          <label className="form-label">Accreditation Number</label>
                          <input
                            type="text"
                            className="form-control"
                            value={cert.issuer_accreditation_number}
                            onChange={(e) => handleCertificateChange(index, 'issuer_accreditation_number', e.target.value)}
                            placeholder="Accreditation/Registration number"
                            disabled={loading}
                          />
                        </div>

                        {/* Issue Date */}
                        <div className="col-md-3 mb-2">
                          <label className="form-label">
                            Issue Date <span className="text-danger">*</span>
                          </label>
                          <input
                            type="date"
                            className={`form-control ${cert.errors.issue_date ? 'is-invalid' : ''}`}
                            value={cert.issue_date}
                            onChange={(e) => handleCertificateChange(index, 'issue_date', e.target.value)}
                            disabled={loading}
                          />
                          {cert.errors.issue_date && (
                            <div className="invalid-feedback">{cert.errors.issue_date}</div>
                          )}
                        </div>

                        {/* Expiry Date */}
                        <div className="col-md-3 mb-2">
                          <label className="form-label">
                            Expiry Date <span className="text-danger">*</span>
                          </label>
                          <input
                            type="date"
                            className={`form-control ${cert.errors.expiry_date ? 'is-invalid' : ''}`}
                            value={cert.expiry_date}
                            onChange={(e) => handleCertificateChange(index, 'expiry_date', e.target.value)}
                            disabled={loading}
                          />
                          {cert.errors.expiry_date && (
                            <div className="invalid-feedback">{cert.errors.expiry_date}</div>
                          )}
                        </div>

                        {/* Certificate Number */}
                        <div className="col-md-6 mb-2">
                          <label className="form-label">
                            Certificate Number <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className={`form-control ${cert.errors.certificate_number ? 'is-invalid' : ''}`}
                            value={cert.certificate_number}
                            onChange={(e) => handleCertificateChange(index, 'certificate_number', e.target.value)}
                            placeholder="Enter certificate number"
                            disabled={loading}
                          />
                          {cert.errors.certificate_number && (
                            <div className="invalid-feedback">{cert.errors.certificate_number}</div>
                          )}
                        </div>

                        {/* Issuing Authority */}
                        <div className="col-md-6 mb-2">
                          <label className="form-label">Issuing Authority</label>
                          <input
                            type="text"
                            className="form-control"
                            value={cert.issuing_authority}
                            onChange={(e) => handleCertificateChange(index, 'issuing_authority', e.target.value)}
                            placeholder="Enter issuing authority (if different from issuer)"
                            disabled={loading}
                          />
                          <small className="text-muted">Leave blank to use issuer name</small>
                        </div>

                        {/* Document Upload */}
                        <div className="col-md-12 mb-2">
                          <label className="form-label">
                            Certificate Document
                            {!isEditMode && !cert.existing_document && (
                              <span className="text-danger"> *</span>
                            )}
                            {isEditMode && (
                              <span className="text-muted"> (optional — leave blank to keep existing)</span>
                            )}
                          </label>
                          <input
                            type="file"
                            className={`form-control ${cert.errors.document ? 'is-invalid' : ''}`}
                            onChange={(e) => handleCertificateFileChange(index, e.target.files[0])}
                            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                            disabled={loading}
                          />
                          {cert.errors.document && (
                            <div className="invalid-feedback">{cert.errors.document}</div>
                          )}
                          {cert.existing_document && !cert.selectedFile && (
                            <small className="text-success d-block mt-1">
                              ✓ Current document:{' '}
                              <a href={cert.existing_document} target="_blank" rel="noopener noreferrer">
                                {cert.document_name || 'View file'}
                              </a>
                            </small>
                          )}
                          {cert.selectedFile && (
                            <small className="text-primary d-block mt-1">
                              New file selected: {cert.selectedFile.name}
                            </small>
                          )}
                          <small className="text-muted d-block mt-1">
                            Supported formats: PDF, JPG, JPEG, PNG, DOC, DOCX (max 10 MB)
                          </small>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Add Another Certificate — only in create mode */}
                  {!isEditMode && (
                    <div className="col-12 mb-3 text-center">
                      <button
                        type="button"
                        className="btn btn-success"
                        onClick={addCertificate}
                        disabled={loading}
                      >
                        <FaPlus className="me-2" /> Add Another Certificate
                      </button>
                    </div>
                  )}
                </div>

                {/* Form Actions */}
                <div className="ac-actions mt-4">
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
                    ) : (isEditMode ? 'Update Candidate' : `Create Candidate with ${certificates.length} Certificate(s)`)}
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