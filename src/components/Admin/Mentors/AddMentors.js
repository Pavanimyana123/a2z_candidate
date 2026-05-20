import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../Layout/Sidebar";
import Header from "../Layout/Header";
import "./AddMentor.css";
import Swal from "sweetalert2";
import { BASE_URL } from "../../../ApiUrl";
import { FaPlus, FaTrash } from 'react-icons/fa';

const AddMentor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [error, setError] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);

  const [levels, setLevels] = useState([]);
  const [filteredLevels, setFilteredLevels] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  const [specializations, setSpecializations] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [certificateErrors, setCertificateErrors] = useState({});

  const [formData, setFormData] = useState({
    full_name: "",
    phone_number: "",
    email: "",
    password: "",
    current_company: "",
    years_of_experience: "",
    max_trainees: "",
    mentorship_status: "active",
  });

  const [errors, setErrors] = useState({});

  // Issuer Type options (matching backend)
  const issuerTypeOptions = [
    { value: 'Educational Institution', label: 'Educational Institution' },
    { value: 'Client Company', label: 'Client Company' },
    { value: 'A2Z Organization', label: 'A2Z Organization' },
    { value: 'Training Center', label: 'Training Center' },
    { value: 'Government Body', label: 'Government Body' },
    { value: 'Professional Body', label: 'Professional Body' },
    { value: 'Other', label: 'Other' },
  ];

  // Certification Type options (matching backend)
  const certificationTypeOptions = [
    { value: 'Educational', label: 'Educational' },
    { value: 'Training', label: 'Training' },
    { value: 'Experience', label: 'Experience' },
    { value: 'Other', label: 'Other' },
  ];

  // Education level options
  const educationLevelOptions = [
    { value: 'High School', label: 'High School' },
    { value: "Bachelor's", label: "Bachelor's Degree" },
    { value: "Master's", label: "Master's Degree" },
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

  // Helper function to create empty certification object
  const makeEmptyCert = () => ({
    id: Date.now() + Math.random(),
    selectedFile: null,
    existing_document: null,
    document_name: '',
    certification_type: '',
    certification_type_other: '',
    certification_name: '',
    issued_date: '',
    expiry_date: '',
    issuing_organization: '',
    issuer_type: '',
    issuer_type_other: '',
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

  useEffect(() => {
    fetchOptions();
  }, []);

  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      fetchMentorData();
    } else {
      initializeCertifications();
    }
  }, [id]);

  const initializeCertifications = () => {
    setCertifications([makeEmptyCert()]);
  };

  const fetchOptions = async () => {
    try {
      setLoadingOptions(true);

      const levelsResponse = await fetch(`${BASE_URL}/api/admin/levels/`);
      if (!levelsResponse.ok) throw new Error(`Failed to fetch levels: ${levelsResponse.status}`);
      const levelsData = await levelsResponse.json();

      const deptsResponse = await fetch(`${BASE_URL}/api/admin/departments/`);
      if (!deptsResponse.ok) throw new Error(`Failed to fetch departments: ${deptsResponse.status}`);
      const deptsData = await deptsResponse.json();

      const activeLevels = levelsData.data?.filter((level) => level.is_active) || [];
      const activeDepartments = deptsData.data?.filter((dept) => dept.is_active) || [];

      setLevels(activeLevels);
      setFilteredLevels(activeLevels.filter((level) => level.number > 3));
      setDepartments(activeDepartments);
    } catch (err) {
      console.error("Error fetching options:", err);
      setError(err.message);
      Swal.fire({
        icon: "error",
        title: "Failed to Load Options",
        text: err.message || "Could not load levels and departments",
        timer: 3000,
        showConfirmButton: true,
      });
    } finally {
      setLoadingOptions(false);
    }
  };

  const fetchMentorData = async () => {
    try {
      setFetchLoading(true);
      const response = await fetch(`${BASE_URL}/api/mentor/mentors/${id}/`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const result = await response.json();

      if (result.status && result.data) {
        const mentorData = result.data;

        setFormData({
          full_name: mentorData.full_name || "",
          phone_number: mentorData.phone_number || "",
          email: mentorData.email || "",
          password: "",
          current_company: mentorData.current_company || "",
          years_of_experience: mentorData.years_of_experience || "",
          max_trainees: mentorData.max_trainees || "",
          mentorship_status: mentorData.mentorship_status || "active",
        });

        if (mentorData.specializations && Array.isArray(mentorData.specializations)) {
          setSpecializations(mentorData.specializations.map(spec => ({
            department_id: spec.department,
            level_id: spec.level,
            years_of_experience_in_specialization: spec.years_of_experience_in_specialization,
            is_primary_specialization: spec.is_primary_specialization,
            max_trainees_for_specialization: spec.max_trainees_for_specialization
          })));
        }

        // Handle certifications with proper file handling
        if (mentorData.certifications && Array.isArray(mentorData.certifications)) {
          const existingCerts = mentorData.certifications.map(cert => ({
            id: cert.id,
            selectedFile: null,
            existing_document: cert.document || null,
            document_name: cert.document ? cert.document.split('/').pop() : '',
            certification_type: cert.certification_type || "",
            certification_type_other: cert.certification_type_other || "",
            certification_name: cert.certification_name || "",
            issued_date: cert.issued_date || "",
            expiry_date: cert.expiry_date || "",
            issuing_organization: cert.issuing_organization || "",
            issuer_type: cert.issuer_type || "",
            issuer_type_other: cert.issuer_type_other || "",
            education_level: cert.education_level || "",
            field_of_study: cert.field_of_study || "",
            grade_or_percentage: cert.grade_or_percentage || "",
            training_program_name: cert.training_program_name || "",
            training_duration: cert.training_duration || "",
            training_mode: cert.training_mode || "",
            job_role: cert.job_role || "",
            employment_type: cert.employment_type || "",
            work_responsibilities: cert.work_responsibilities || "",
            errors: {},
          }));
          setCertifications(existingCerts);
        } else {
          initializeCertifications();
        }
      } else {
        throw new Error(result.message || "Failed to fetch mentor data");
      }
    } catch (err) {
      setError(err.message);
      console.error("Error fetching mentor data:", err);
      Swal.fire({
        icon: "error",
        title: "Failed to Load Mentor",
        text: err.message || "An error occurred while loading mentor data",
        timer: 3000,
        showConfirmButton: true,
      });
    } finally {
      setFetchLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? (value === "" ? "" : Number(value)) : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const addSpecialization = () => {
    setSpecializations([
      ...specializations,
      {
        department_id: "",
        level_id: "",
        years_of_experience_in_specialization: "",
        is_primary_specialization: false,
        max_trainees_for_specialization: "",
      },
    ]);
  };

  const updateSpecialization = (index, field, value) => {
    const updated = [...specializations];
    updated[index][field] = value;
    setSpecializations(updated);
  };

  const removeSpecialization = (index) => {
    setSpecializations(specializations.filter((_, i) => i !== index));
  };

  // Certification functions - matching RegisterMentor
  const addCertificate = () => {
    setCertifications((prev) => [...prev, makeEmptyCert()]);
  };

  const removeCertificate = (index) => {
    if (certifications.length === 1) {
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
        setCertifications((prev) => prev.filter((_, i) => i !== index));
        const newCertErrors = { ...certificateErrors };
        delete newCertErrors[index];
        setCertificateErrors(newCertErrors);
      }
    });
  };

  const handleCertificateChange = (index, field, value) => {
    setCertifications((prev) =>
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
    
    if (file.type !== "application/pdf") {
      Swal.fire({ 
        icon: "error", 
        title: "Invalid File Type", 
        text: "Please upload only PDF files", 
        timer: 3000 
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({ 
        icon: "error", 
        title: "File Too Large", 
        text: "File size should not exceed 5MB", 
        timer: 3000 
      });
      return;
    }

    setCertifications((prev) =>
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

    certifications.forEach((cert, index) => {
      const errs = {};
      
      if (!cert.certification_type) {
        errs.certification_type = 'Certification type is required';
        isValid = false;
      } else if (cert.certification_type === 'Other' && !cert.certification_type_other?.trim()) {
        errs.certification_type_other = 'Please specify the certification type';
        isValid = false;
      }
      
      if (!cert.certification_name?.trim()) {
        errs.certification_name = 'Certification name is required';
        isValid = false;
      }
      
      if (!cert.issuer_type) {
        errs.issuer_type = 'Issuer type is required';
        isValid = false;
      }
      
      if (cert.issuer_type === 'Other' && !cert.issuer_type_other?.trim()) {
        errs.issuer_type_other = 'Please specify the issuer type';
        isValid = false;
      }
      
      if (!cert.issuing_organization?.trim()) {
        errs.issuing_organization = 'Issuing organization is required';
        isValid = false;
      }
      
      if (!cert.issued_date) {
        errs.issued_date = 'Issue date is required';
        isValid = false;
      }
      
      if (!cert.expiry_date) {
        errs.expiry_date = 'Expiry date is required';
        isValid = false;
      }
      
      if (cert.issued_date && cert.expiry_date) {
        if (new Date(cert.expiry_date) <= new Date(cert.issued_date)) {
          errs.expiry_date = 'Expiry date must be after issue date';
          isValid = false;
        }
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

    setCertifications((prev) =>
      prev.map((cert, i) => ({
        ...cert,
        errors: newCertErrors[i] || {},
      }))
    );

    return isValid;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.full_name?.trim()) {
      newErrors.full_name = "Full name is required";
    }

    if (!formData.phone_number?.trim()) {
      newErrors.phone_number = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone_number.replace(/\D/g, ""))) {
      newErrors.phone_number = "Please enter a valid 10-digit phone number";
    }

    if (!formData.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!isEditMode && !formData.password?.trim()) {
      newErrors.password = "Password is required for new mentors";
    }

    if (!formData.years_of_experience && formData.years_of_experience !== 0) {
      newErrors.years_of_experience = "Years of experience is required";
    } else if (formData.years_of_experience < 0 || formData.years_of_experience > 50) {
      newErrors.years_of_experience = "Years of experience must be between 0 and 50";
    }

    if (!formData.max_trainees) {
      newErrors.max_trainees = "Max trainees is required";
    } else if (formData.max_trainees < 1) {
      newErrors.max_trainees = "Max trainees must be at least 1";
    }

    if (specializations.length === 0) {
      newErrors.specializations = "At least one specialization is required";
    } else {
      let hasPrimary = false;
      specializations.forEach((spec, index) => {
        if (!spec.department_id) newErrors[`spec_dept_${index}`] = "Department is required";
        if (!spec.level_id) newErrors[`spec_level_${index}`] = "Level is required";
        if (!spec.years_of_experience_in_specialization) newErrors[`spec_years_${index}`] = "Years of experience is required";
        if (spec.is_primary_specialization) hasPrimary = true;
      });
      if (!hasPrimary) newErrors.primary_specialization = "One specialization must be marked as primary";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm() || !validateCertificates()) {
      Swal.fire({
        icon: "error",
        title: "Validation Failed",
        text: "Please check all required fields and try again.",
        showConfirmButton: true,
      });
      return;
    }

    setLoading(true);
    setError("");

    try {
      const mentorPayload = {
        full_name: formData.full_name,
        phone_number: formData.phone_number,
        email: formData.email,
        password: formData.password || undefined,
        current_company: formData.current_company || "",
        years_of_experience: parseFloat(formData.years_of_experience) || 0,
        max_trainees: parseInt(formData.max_trainees) || 5,
        mentorship_status: formData.mentorship_status || "active",
      };

      const specializationsData = specializations.map((spec) => ({
        department_id: parseInt(spec.department_id),
        level_id: parseInt(spec.level_id),
        years_of_experience_in_specialization: parseFloat(spec.years_of_experience_in_specialization || 0),
        is_primary_specialization: spec.is_primary_specialization || false,
        max_trainees_for_specialization: spec.max_trainees_for_specialization
          ? parseInt(spec.max_trainees_for_specialization)
          : 5,
      }));

      const certificationsData = certifications.map((cert) => ({
        certification_type: cert.certification_type,
        certification_type_other: cert.certification_type === 'Other' ? cert.certification_type_other : '',
        certification_name: cert.certification_name,
        issuer_type: cert.issuer_type,
        issuer_type_other: cert.issuer_type === 'Other' ? cert.issuer_type_other : '',
        issuing_organization: cert.issuing_organization,
        issued_date: cert.issued_date,
        expiry_date: cert.expiry_date,
        ...(cert.certification_type === 'Educational' && {
          education_level: cert.education_level,
          field_of_study: cert.field_of_study,
          grade_or_percentage: cert.grade_or_percentage,
        }),
        ...(cert.certification_type === 'Experience' && {
          job_role: cert.job_role,
          employment_type: cert.employment_type,
          work_responsibilities: cert.work_responsibilities,
        }),
        ...(cert.certification_type === 'Training' && {
          training_program_name: cert.training_program_name,
          training_duration: cert.training_duration,
          training_mode: cert.training_mode,
        }),
      }));

      const formDataToSend = new FormData();
      Object.entries(mentorPayload).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formDataToSend.append(key, value);
        }
      });

      formDataToSend.append('specializations_data', JSON.stringify(specializationsData));
      formDataToSend.append('certifications_data', JSON.stringify(certificationsData));

      certifications.forEach((cert, index) => {
        if (cert.selectedFile && cert.selectedFile instanceof File) {
          formDataToSend.append(`certification_document_${index}`, cert.selectedFile);
        }
      });

      const method = isEditMode ? 'PUT' : 'POST';
      const endpointPath = isEditMode
        ? `api/mentor/mentors/${id}/`
        : 'api/mentor/mentors/';
      const mentorUrl = new URL(endpointPath, BASE_URL).href;

      const mentorRes = await fetch(mentorUrl, {
        method,
        body: formDataToSend,
      });

      const mentorData = await mentorRes.json().catch(() => null);

      if (!mentorRes.ok) {
        if (mentorData?.errors) {
          const serverErrors = {};
          Object.keys(mentorData.errors).forEach((key) => {
            serverErrors[key] = Array.isArray(mentorData.errors[key])
              ? mentorData.errors[key][0]
              : mentorData.errors[key];
          });
          setErrors(serverErrors);
          throw new Error('Please check the form for errors');
        }
        throw new Error(
          mentorData?.message ||
            `Failed to ${isEditMode ? 'update' : 'create'} mentor`
        );
      }

      await Swal.fire({
        icon: "success",
        title: isEditMode ? "Updated!" : "Created!",
        html: `Mentor ${isEditMode ? 'updated' : 'created'} successfully.<br/>
               ${specializations.length} specialization(s) and ${certifications.length} certificate(s) saved.`,
        timer: 2000,
        showConfirmButton: false,
      });

      navigate("/mentor");
    } catch (err) {
      console.error("❌ ERROR:", err);
      setError(err.message);
      Swal.fire({
        icon: "error",
        title: isEditMode ? "Update Failed" : "Creation Failed",
        text: err.message,
        showConfirmButton: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => navigate("/mentor");

  const getLevelDisplay = (level) => `${level.name} (Level ${level.number})`;
  const getDepartmentDisplay = (dept) => `${dept.name} (${dept.code})`;

  if (fetchLoading || loadingOptions) {
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
                {fetchLoading ? "Loading mentor data..." : "Loading levels and departments..."}
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
          <div className="am-wrapper">
            <div className="am-header">
              <div>
                <h2>{isEditMode ? "Edit Mentor" : "Add New Mentor"}</h2>
                <p>{isEditMode ? "Update the mentor details below" : "Fill in the mentor details and add certifications below"}</p>
              </div>
            </div>

            {/* Info Alert for Level Restriction */}
            {!isEditMode && (
              <div className="alert alert-info" role="alert">
                <strong>Note:</strong> Only Level 4 and above (Mentor levels) are available for selection.
              </div>
            )}

            {error && (
              <div className="alert alert-danger alert-dismissible fade show" role="alert">
                <strong>Error:</strong> {error}
                <button type="button" className="btn-close" onClick={() => setError("")} aria-label="Close" />
              </div>
            )}

            <div className="am-form-container">
              <form onSubmit={handleSubmit}>
                {/* Personal Information Section */}
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      className={`form-control ${errors.full_name ? "is-invalid" : ""}`}
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      placeholder="Enter full name"
                      disabled={loading}
                    />
                    {errors.full_name && <div className="invalid-feedback">{errors.full_name}</div>}
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label">Phone Number *</label>
                    <input
                      type="tel"
                      className={`form-control ${errors.phone_number ? "is-invalid" : ""}`}
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleChange}
                      placeholder="Enter 10-digit phone number"
                      disabled={loading}
                      maxLength="10"
                    />
                    {errors.phone_number && <div className="invalid-feedback">{errors.phone_number}</div>}
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label">Email *</label>
                    <input
                      type="email"
                      className={`form-control ${errors.email ? "is-invalid" : ""}`}
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter email address"
                      disabled={loading}
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>

                  {!isEditMode && (
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Password *</label>
                      <input
                        type="password"
                        className={`form-control ${errors.password ? "is-invalid" : ""}`}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter password"
                        disabled={loading}
                      />
                      {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                    </div>
                  )}

                  <div className="col-md-4 mb-3">
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

                  <div className="col-md-4 mb-3">
                    <label className="form-label">Years of Experience *</label>
                    <input
                      type="number"
                      className={`form-control ${errors.years_of_experience ? "is-invalid" : ""}`}
                      name="years_of_experience"
                      value={formData.years_of_experience}
                      onChange={handleChange}
                      placeholder="Enter years of experience"
                      min="0"
                      max="50"
                      step="0.1"
                      disabled={loading}
                    />
                    {errors.years_of_experience && <div className="invalid-feedback">{errors.years_of_experience}</div>}
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label">Max Trainees *</label>
                    <input
                      type="number"
                      className={`form-control ${errors.max_trainees ? "is-invalid" : ""}`}
                      name="max_trainees"
                      value={formData.max_trainees}
                      onChange={handleChange}
                      placeholder="Maximum number of trainees"
                      min="1"
                      disabled={loading}
                    />
                    {errors.max_trainees && <div className="invalid-feedback">{errors.max_trainees}</div>}
                  </div>

                  {isEditMode && (
                    <div className="col-md-4 mb-3">
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
                        <option value="pending">Pending</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                  )}
                </div>

                {/* Specializations Section */}
                <div className="row mt-4">
                  <div className="col-12">
                    <h5 className="mb-3">Specializations *</h5>
                    {errors.specializations && <div className="alert alert-danger">{errors.specializations}</div>}
                    {errors.primary_specialization && <div className="alert alert-danger">{errors.primary_specialization}</div>}
                  </div>

                  {specializations.map((spec, index) => (
                    <div key={index} className="card mb-3 p-3">
                      <div className="row">
                        <div className="col-md-3 mb-2">
                          <label className="form-label">Department *</label>
                          <select
                            className={`form-select ${errors[`spec_dept_${index}`] ? "is-invalid" : ""}`}
                            value={spec.department_id}
                            onChange={(e) => updateSpecialization(index, "department_id", e.target.value)}
                            disabled={loading}
                          >
                            <option value="">Select Department</option>
                            {departments.map((dept) => (
                              <option key={dept.id} value={dept.id}>{getDepartmentDisplay(dept)}</option>
                            ))}
                          </select>
                          {errors[`spec_dept_${index}`] && <div className="invalid-feedback">{errors[`spec_dept_${index}`]}</div>}
                        </div>

                        <div className="col-md-3 mb-2">
                          <label className="form-label">Level *</label>
                          <select
                            className={`form-select ${errors[`spec_level_${index}`] ? "is-invalid" : ""}`}
                            value={spec.level_id}
                            onChange={(e) => updateSpecialization(index, "level_id", e.target.value)}
                            disabled={loading}
                          >
                            <option value="">Select Level</option>
                            {filteredLevels.map((level) => (
                              <option key={level.id} value={level.id}>{getLevelDisplay(level)}</option>
                            ))}
                          </select>
                          {errors[`spec_level_${index}`] && <div className="invalid-feedback">{errors[`spec_level_${index}`]}</div>}
                        </div>

                        <div className="col-md-2 mb-2">
                          <label className="form-label">Years Exp. *</label>
                          <input
                            type="number"
                            className={`form-control ${errors[`spec_years_${index}`] ? "is-invalid" : ""}`}
                            value={spec.years_of_experience_in_specialization}
                            onChange={(e) => updateSpecialization(index, "years_of_experience_in_specialization", e.target.value)}
                            placeholder="Years"
                            min="0"
                            step="0.5"
                            disabled={loading}
                          />
                          {errors[`spec_years_${index}`] && <div className="invalid-feedback">{errors[`spec_years_${index}`]}</div>}
                        </div>

                        <div className="col-md-2 mb-2">
                          <label className="form-label">Max Trainees</label>
                          <input
                            type="number"
                            className="form-control"
                            value={spec.max_trainees_for_specialization}
                            onChange={(e) => updateSpecialization(index, "max_trainees_for_specialization", e.target.value)}
                            placeholder="Optional"
                            min="1"
                            disabled={loading}
                          />
                        </div>

                        <div className="col-md-1 mb-2">
                          <label className="form-label">Primary</label>
                          <input
                            type="checkbox"
                            className="form-check-input d-block mt-2"
                            checked={spec.is_primary_specialization}
                            onChange={(e) => updateSpecialization(index, "is_primary_specialization", e.target.checked)}
                            disabled={loading}
                            style={{ width: "20px", height: "20px" }}
                          />
                        </div>

                        <div className="col-md-1 mb-2">
                          <label className="form-label">&nbsp;</label>
                          <button
                            type="button"
                            className="btn btn-danger btn-sm d-block"
                            onClick={() => removeSpecialization(index)}
                            disabled={loading}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="col-12 mb-3">
                    <button type="button" className="btn btn-secondary" onClick={addSpecialization} disabled={loading}>
                      + Add Specialization
                    </button>
                  </div>
                </div>

                {/* Certifications Section */}
                <div className="row mt-4">
                  <div className="col-12">
                    <h5 className="mb-3">Certifications</h5>
                    <p className="text-muted mb-3">Add professional certifications for this mentor</p>
                  </div>

                  {certifications.map((cert, index) => (
                    <div
                      key={cert.id}
                      className="card mb-3 p-3"
                      style={{ position: 'relative' }}
                    >
                      {/* Remove button */}
                      {certifications.length > 1 && (
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
                        <div className="col-md-3 mb-2">
                          <label className="form-label">
                            Certification Type <span className="text-danger">*</span>
                          </label>
                          <select
                            className={`form-select ${cert.errors?.certification_type ? "is-invalid" : ""}`}
                            value={cert.certification_type}
                            onChange={(e) => handleCertificateChange(index, "certification_type", e.target.value)}
                            disabled={loading}
                          >
                            <option value="">Select Certification Type</option>
                            {certificationTypeOptions.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                          {cert.errors?.certification_type && (
                            <div className="invalid-feedback">{cert.errors.certification_type}</div>
                          )}
                        </div>

                        {/* Other Certification Type Input */}
                        {cert.certification_type === 'Other' && (
                          <div className="col-md-3 mb-2">
                            <label className="form-label">
                              Please Specify <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className={`form-control ${cert.errors?.certification_type_other ? "is-invalid" : ""}`}
                              value={cert.certification_type_other || ""}
                              onChange={(e) => handleCertificateChange(index, "certification_type_other", e.target.value)}
                              placeholder="Enter custom certification type"
                              disabled={loading}
                            />
                            {cert.errors?.certification_type_other && (
                              <div className="invalid-feedback">{cert.errors.certification_type_other}</div>
                            )}
                          </div>
                        )}

                        {/* Certification Name */}
                        <div className="col-md-3 mb-2">
                          <label className="form-label">
                            Certification Name <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className={`form-control ${cert.errors?.certification_name ? "is-invalid" : ""}`}
                            value={cert.certification_name}
                            onChange={(e) => handleCertificateChange(index, "certification_name", e.target.value)}
                            placeholder="Enter certification name"
                            disabled={loading}
                          />
                          {cert.errors?.certification_name && (
                            <div className="invalid-feedback">{cert.errors.certification_name}</div>
                          )}
                        </div>

                        {/* Issuer Type */}
                        <div className="col-md-3 mb-2">
                          <label className="form-label">
                            Issuer Type <span className="text-danger">*</span>
                          </label>
                          <select
                            className={`form-select ${cert.errors?.issuer_type ? "is-invalid" : ""}`}
                            value={cert.issuer_type}
                            onChange={(e) => handleCertificateChange(index, "issuer_type", e.target.value)}
                            disabled={loading}
                          >
                            <option value="">Select Issuer Type</option>
                            {issuerTypeOptions.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                          {cert.errors?.issuer_type && (
                            <div className="invalid-feedback">{cert.errors.issuer_type}</div>
                          )}
                        </div>

                        {/* Other Issuer Type Input */}
                        {cert.issuer_type === 'Other' && (
                          <div className="col-md-3 mb-2">
                            <label className="form-label">
                              Please Specify <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className={`form-control ${cert.errors?.issuer_type_other ? "is-invalid" : ""}`}
                              value={cert.issuer_type_other || ""}
                              onChange={(e) => handleCertificateChange(index, "issuer_type_other", e.target.value)}
                              placeholder="Enter custom issuer type"
                              disabled={loading}
                            />
                            {cert.errors?.issuer_type_other && (
                              <div className="invalid-feedback">{cert.errors.issuer_type_other}</div>
                            )}
                          </div>
                        )}

                        {/* Issuing Organization */}
                        <div className="col-md-3 mb-2">
                          <label className="form-label">
                            Issuing Organization <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className={`form-control ${cert.errors?.issuing_organization ? "is-invalid" : ""}`}
                            value={cert.issuing_organization}
                            onChange={(e) => handleCertificateChange(index, "issuing_organization", e.target.value)}
                            placeholder="Enter issuing organization name"
                            disabled={loading}
                          />
                          {cert.errors?.issuing_organization && (
                            <div className="invalid-feedback">{cert.errors.issuing_organization}</div>
                          )}
                        </div>

                        {/* Type-specific fields */}
                        {cert.certification_type === 'Educational' && (
                          <>
                            <div className="col-md-3 mb-2">
                              <label className="form-label">Education Level</label>
                              <select
                                className="form-select"
                                value={cert.education_level}
                                onChange={(e) => handleCertificateChange(index, "education_level", e.target.value)}
                                disabled={loading}
                              >
                                <option value="">Select Education Level</option>
                                {educationLevelOptions.map((opt) => (
                                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                              </select>
                            </div>
                            
                            <div className="col-md-3 mb-2">
                              <label className="form-label">Field of Study</label>
                              <input
                                type="text"
                                className="form-control"
                                value={cert.field_of_study}
                                onChange={(e) => handleCertificateChange(index, "field_of_study", e.target.value)}
                                placeholder="e.g., Computer Science, Business"
                                disabled={loading}
                              />
                            </div>
                            
                            <div className="col-md-3 mb-2">
                              <label className="form-label">Grade/Percentage</label>
                              <input
                                type="text"
                                className="form-control"
                                value={cert.grade_or_percentage}
                                onChange={(e) => handleCertificateChange(index, "grade_or_percentage", e.target.value)}
                                placeholder="e.g., A+, 85%, 3.5 GPA"
                                disabled={loading}
                              />
                            </div>
                          </>
                        )}

                        {cert.certification_type === 'Experience' && (
                          <>
                            <div className="col-md-3 mb-2">
                              <label className="form-label">Job Role</label>
                              <input
                                type="text"
                                className="form-control"
                                value={cert.job_role}
                                onChange={(e) => handleCertificateChange(index, "job_role", e.target.value)}
                                placeholder="e.g., Senior Software Engineer"
                                disabled={loading}
                              />
                            </div>
                            
                            <div className="col-md-3 mb-2">
                              <label className="form-label">Employment Type</label>
                              <select
                                className="form-select"
                                value={cert.employment_type}
                                onChange={(e) => handleCertificateChange(index, "employment_type", e.target.value)}
                                disabled={loading}
                              >
                                <option value="">Select Employment Type</option>
                                {employmentTypeOptions.map((opt) => (
                                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                              </select>
                            </div>
                            
                            <div className="col-md-6 mb-2">
                              <label className="form-label">Work Responsibilities</label>
                              <textarea
                                className="form-control"
                                value={cert.work_responsibilities}
                                onChange={(e) => handleCertificateChange(index, "work_responsibilities", e.target.value)}
                                placeholder="Describe key responsibilities and achievements"
                                rows="3"
                                disabled={loading}
                              />
                            </div>
                          </>
                        )}

                        {cert.certification_type === 'Training' && (
                          <>
                            <div className="col-md-3 mb-2">
                              <label className="form-label">Training Program Name</label>
                              <input
                                type="text"
                                className="form-control"
                                value={cert.training_program_name}
                                onChange={(e) => handleCertificateChange(index, "training_program_name", e.target.value)}
                                placeholder="Enter training program name"
                                disabled={loading}
                              />
                            </div>
                            
                            <div className="col-md-3 mb-2">
                              <label className="form-label">Training Duration</label>
                              <input
                                type="text"
                                className="form-control"
                                value={cert.training_duration}
                                onChange={(e) => handleCertificateChange(index, "training_duration", e.target.value)}
                                placeholder="e.g., 40 hours, 3 months"
                                disabled={loading}
                              />
                            </div>
                            
                            <div className="col-md-3 mb-2">
                              <label className="form-label">Training Mode</label>
                              <select
                                className="form-select"
                                value={cert.training_mode}
                                onChange={(e) => handleCertificateChange(index, "training_mode", e.target.value)}
                                disabled={loading}
                              >
                                <option value="">Select Training Mode</option>
                                {trainingModeOptions.map((opt) => (
                                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                              </select>
                            </div>
                          </>
                        )}

                        {/* Issue Date */}
                        <div className="col-md-2 mb-2">
                          <label className="form-label">
                            Issued Date <span className="text-danger">*</span>
                          </label>
                          <input
                            type="date"
                            className={`form-control ${cert.errors?.issued_date ? "is-invalid" : ""}`}
                            value={cert.issued_date}
                            onChange={(e) => handleCertificateChange(index, "issued_date", e.target.value)}
                            disabled={loading}
                          />
                          {cert.errors?.issued_date && (
                            <div className="invalid-feedback">{cert.errors.issued_date}</div>
                          )}
                        </div>

                        {/* Expiry Date */}
                        <div className="col-md-2 mb-2">
                          <label className="form-label">
                            Expiry Date <span className="text-danger">*</span>
                          </label>
                          <input
                            type="date"
                            className={`form-control ${cert.errors?.expiry_date ? "is-invalid" : ""}`}
                            value={cert.expiry_date}
                            onChange={(e) => handleCertificateChange(index, "expiry_date", e.target.value)}
                            disabled={loading}
                          />
                          {cert.errors?.expiry_date && (
                            <div className="invalid-feedback">{cert.errors.expiry_date}</div>
                          )}
                        </div>

                        {/* Document Upload */}
                        <div className="col-md-4 mb-2">
                          <label className="form-label">
                            Certificate Document
                            {!isEditMode && !cert.existing_document && (
                              <span className="text-danger"> *</span>
                            )}
                            {isEditMode && (
                              <span className="text-muted small"> (optional — leave blank to keep existing)</span>
                            )}
                          </label>
                          <input
                            type="file"
                            className={`form-control ${cert.errors?.document ? "is-invalid" : ""}`}
                            onChange={(e) => handleCertificateFileChange(index, e.target.files[0])}
                            accept=".pdf"
                            disabled={loading}
                          />
                          {cert.errors?.document && (
                            <div className="invalid-feedback">{cert.errors.document}</div>
                          )}
                          {/* Show existing document link */}
                          {cert.existing_document && !cert.selectedFile && (
                            <small className="text-success d-block mt-1">
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
                            <small className="text-primary d-block mt-1">
                              New file selected: {cert.selectedFile.name}
                            </small>
                          )}
                          <small className="text-muted d-block mt-1">
                            Supported format: PDF only (max 5 MB)
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
                <div className="am-actions mt-4">
                  <button type="button" className="btn btn-outline-secondary me-2" onClick={handleCancel} disabled={loading}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                        {isEditMode ? "Updating..." : "Creating..."}
                      </>
                    ) : isEditMode ? "Update Mentor" : `Create Mentor with ${certifications.length} Certificate(s)`}
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