import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { BASE_URL } from "../../../ApiUrl";
import "./Register.css";

const RegisterMentor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [error, setError] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);

  // State for dropdown options
  const [levels, setLevels] = useState([]);
  const [filteredLevels, setFilteredLevels] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  // New states for specializations and certifications
  const [specializations, setSpecializations] = useState([]);
  const [certifications, setCertifications] = useState([]);

  const [formData, setFormData] = useState({
    full_name: "",
    phone_number: "",
    email: "",
    password: "",
    current_company: "",
    years_of_experience: "",
    max_trainees: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchOptions();
  }, []);

  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      fetchMentorData();
    }
  }, [id]);

  const fetchOptions = async () => {
    try {
      setLoadingOptions(true);

      const levelsResponse = await fetch(`${BASE_URL}/api/admin/levels/`);
      if (!levelsResponse.ok) {
        throw new Error(`Failed to fetch levels: ${levelsResponse.status}`);
      }
      const levelsData = await levelsResponse.json();

      const deptsResponse = await fetch(`${BASE_URL}/api/admin/departments/`);
      if (!deptsResponse.ok) {
        throw new Error(`Failed to fetch departments: ${deptsResponse.status}`);
      }
      const deptsData = await deptsResponse.json();

      const activeLevels = levelsData.data?.filter((level) => level.is_active) || [];
      const activeDepartments = deptsData.data?.filter((dept) => dept.is_active) || [];

      setLevels(activeLevels);
      
      // Filter levels to only show levels with number greater than 3 (Level 4 and above)
      const filtered = activeLevels.filter(level => level.number > 3);
      setFilteredLevels(filtered);
      
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
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

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
        });

        // Handle specializations
        if (mentorData.specializations && Array.isArray(mentorData.specializations)) {
          setSpecializations(mentorData.specializations.map(spec => ({
            department_id: spec.department,
            level_id: spec.level,
            years_of_experience_in_specialization: spec.years_of_experience_in_specialization,
            is_primary_specialization: spec.is_primary_specialization,
            max_trainees_for_specialization: spec.max_trainees_for_specialization
          })));
        } else if (mentorData.specializations && typeof mentorData.specializations[0] === 'number') {
          // Handle old format (array of IDs)
          const oldSpecs = mentorData.specializations.map(deptId => ({
            department_id: deptId,
            level_id: "",
            years_of_experience_in_specialization: "",
            is_primary_specialization: false,
            max_trainees_for_specialization: ""
          }));
          setSpecializations(oldSpecs);
        }

        // Handle certifications
        if (mentorData.certifications && Array.isArray(mentorData.certifications)) {
          setCertifications(mentorData.certifications.map(cert => ({
            certification_type: cert.certification_type || "",
            certification_name: cert.certification_name || "",
            document: null,
            document_url: cert.document_url || "",
            issued_date: cert.issued_date || "",
            expiry_date: cert.expiry_date || "",
            issuing_organization: cert.issuing_organization || "",
            issuer_type: cert.issuer_type || "",
            other_issuer_type: cert.other_issuer_type || "",
            other_certification_type: cert.other_certification_type || "",
            keep_existing_document: true,
            existing_document: cert.document
          })));
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

  // Specialization functions
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

  // Certification functions
  const addCertification = () => {
    setCertifications([
      ...certifications,
      {
        certification_type: "",
        certification_name: "",
        document: null,
        document_url: "",
        issued_date: "",
        expiry_date: "",
        issuing_organization: "",
        issuer_type: "",
        other_issuer_type: "",
        other_certification_type: "",
        keep_existing_document: false,
        existing_document: null,
      },
    ]);
  };

  const updateCertification = (index, field, value) => {
    const updated = [...certifications];
    updated[index][field] = value;
    setCertifications(updated);
  };

  const handleCertificationFile = (index, file) => {
    if (!file) return;

    if (file.type !== "application/pdf") {
      Swal.fire({ icon: "error", title: "Invalid File Type", text: "Please upload only PDF files", timer: 3000 });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({ icon: "error", title: "File Too Large", text: "File size should not exceed 5MB", timer: 3000 });
      return;
    }

    const updated = [...certifications];
    updated[index].document = file;
    updated[index].document_url = "";
    updated[index].keep_existing_document = false;
    setCertifications(updated);
  };

  const removeCertification = (index) => {
    setCertifications(certifications.filter((_, i) => i !== index));
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

    if (Object.keys(newErrors).length > 0) {
      Swal.fire({
        icon: "error",
        title: "Validation Failed",
        text: "Please check all required fields and try again.",
        timer: 3000,
        showConfirmButton: true,
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      // ✅ Prepare Specializations
      const specializationsData = specializations.map((spec) => ({
        department_id: parseInt(spec.department_id),
        level_id: parseInt(spec.level_id),
        years_of_experience_in_specialization: parseFloat(
          spec.years_of_experience_in_specialization || 0
        ),
        is_primary_specialization: spec.is_primary_specialization || false,
        max_trainees_for_specialization: spec.max_trainees_for_specialization
          ? parseInt(spec.max_trainees_for_specialization)
          : 5,
      }));

      // ✅ Prepare Certifications
      const certificationsData = certifications.map((cert) => ({
        certification_type: cert.certification_type || "",
        certification_name: cert.certification_name || "",
        issued_date: cert.issued_date || null,
        expiry_date: cert.expiry_date || null,
        issuing_organization: cert.issuing_organization || "",
        issuer_type: cert.issuer_type || "",
        other_issuer_type: cert.issuer_type === "other" ? cert.other_issuer_type : "",
        other_certification_type: cert.certification_type === "other" ? cert.other_certification_type : "",

        // ⚠️ If backend expects file upload, this must be FormData (not JSON)
        document: cert.document
          ? cert.document.name   // (temporary: sending file name)
          : cert.document_url || null,

        keep_existing_document:
          cert.keep_existing_document && cert.existing_document ? true : false,
      }));

      // ✅ FINAL PAYLOAD (FIXED KEYS)
      const payload = {
        full_name: formData.full_name,
        phone_number: formData.phone_number,
        email: formData.email,
        password: formData.password || undefined,
        current_company: formData.current_company || "",
        years_of_experience: parseFloat(formData.years_of_experience) || 0,
        max_trainees: parseInt(formData.max_trainees) || 5,
        mentorship_status: "pending",

        // ✅ FIXED FIELD NAMES
        specializations_data: specializationsData,
        certifications_data: certificationsData,
      };

      // ✅ DEBUG
      console.log("🚀 FINAL PAYLOAD:", JSON.stringify(payload, null, 2));

      const url = isEditMode
        ? `${BASE_URL}/api/mentor/mentors/${id}/`
        : `${BASE_URL}/api/mentor/mentors/`;

      const response = await fetch(url, {
        method: isEditMode ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      console.log("📥 RESPONSE:", responseData);

      if (!response.ok) {
        throw new Error(responseData?.message || "Request failed");
      }

      await Swal.fire({
        icon: "success",
        title: isEditMode ? "Updated!" : "Created!",
        text: "Mentor saved successfully",
        timer: 2000,
        showConfirmButton: false,
      });

      navigate("/");
    } catch (err) {
      console.error("❌ ERROR:", err);

      Swal.fire({
        icon: "error",
        title: "Save Failed",
        text: err.message,
      });

      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  const handleCancel = () => {
    navigate("/");
  };

  const getLevelDisplay = (level) => `${level.name} (Level ${level.number})`;
  const getDepartmentDisplay = (dept) => `${dept.name} (${dept.code})`;

  if (fetchLoading || loadingOptions) {
    return (
      <div className="register-mentor-page">
        <div className="register-mentor-loading">
          <div className="register-mentor-loading__spinner"></div>
          <p className="register-mentor-loading__text">
            {fetchLoading
              ? "Loading mentor data..."
              : "Loading levels and departments..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="register-mentor-page">
      <div className="register-mentor-wrapper">
        {/* Header with Back Button */}
        <div className="register-mentor-header">
          <button 
            type="button" 
            className="register-mentor-header__back-btn" 
            onClick={handleBack}
            title="Go back to home"
          >
            ←
          </button>
          <div className="register-mentor-header__title-wrapper">
            <h2 className="register-mentor-header__title">
              {isEditMode ? "Edit Mentor" : "Add New Mentor"}
            </h2>
            <p className="register-mentor-header__subtitle">
              {isEditMode
                ? "Update the mentor details below"
                : "Fill in the mentor details below"}
            </p>
          </div>
        </div>

        {/* Info Alert for Level Restriction - Only show for new mentors */}
        {!isEditMode && (
          <div className="register-mentor-alert register-mentor-alert--info" role="alert">
            <span className="register-mentor-alert__message">
              <strong>Note:</strong> Only Level 4 and above (Mentor levels) are available for selection.
            </span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="register-mentor-alert register-mentor-alert--error" role="alert">
            <span className="register-mentor-alert__message">
              <strong>Error:</strong> {error}
            </span>
            <button
              type="button"
              className="register-mentor-alert__close-btn"
              onClick={() => setError("")}
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        )}

        {/* Form */}
        <form className="register-mentor-form" onSubmit={handleSubmit}>
          {/* Personal Information Section */}
          <div className="register-mentor-section">
            <h3 className="register-mentor-section__title">
              <span className="register-mentor-section__title-icon">👤</span>
              Personal Information
            </h3>
            <div className="register-mentor-form__row">
              <div className="register-mentor-form__col-full">
                <div className="register-mentor-form__field-group">
                  <label className="register-mentor-form__label">
                    Full Name <span className="register-mentor-form__required">*</span>
                  </label>
                  <input
                    type="text"
                    className={`register-mentor-form__input ${errors.full_name ? "register-mentor-form__input--error" : ""}`}
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    disabled={loading}
                  />
                  {errors.full_name && (
                    <span className="register-mentor-form__error-text">{errors.full_name}</span>
                  )}
                </div>
              </div>

              <div className="register-mentor-form__col-half">
                <div className="register-mentor-form__field-group">
                  <label className="register-mentor-form__label">
                    Phone Number <span className="register-mentor-form__required">*</span>
                  </label>
                  <input
                    type="tel"
                    className={`register-mentor-form__input ${errors.phone_number ? "register-mentor-form__input--error" : ""}`}
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    placeholder="Enter 10-digit phone number"
                    disabled={loading}
                    maxLength="10"
                  />
                  {errors.phone_number && (
                    <span className="register-mentor-form__error-text">{errors.phone_number}</span>
                  )}
                </div>
              </div>

              <div className="register-mentor-form__col-half">
                <div className="register-mentor-form__field-group">
                  <label className="register-mentor-form__label">
                    Email <span className="register-mentor-form__required">*</span>
                  </label>
                  <input
                    type="email"
                    className={`register-mentor-form__input ${errors.email ? "register-mentor-form__input--error" : ""}`}
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    disabled={loading}
                  />
                  {errors.email && (
                    <span className="register-mentor-form__error-text">{errors.email}</span>
                  )}
                </div>
              </div>

              {!isEditMode && (
                <div className="register-mentor-form__col-half">
                  <div className="register-mentor-form__field-group">
                    <label className="register-mentor-form__label">
                      Password <span className="register-mentor-form__required">*</span>
                    </label>
                    <input
                      type="password"
                      className={`register-mentor-form__input ${errors.password ? "register-mentor-form__input--error" : ""}`}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter password"
                      disabled={loading}
                    />
                    {errors.password && (
                      <span className="register-mentor-form__error-text">{errors.password}</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Professional Information Section */}
          <div className="register-mentor-section">
            <h3 className="register-mentor-section__title">
              <span className="register-mentor-section__title-icon">💼</span>
              Professional Information
            </h3>
            <div className="register-mentor-form__row">
              <div className="register-mentor-form__col-half">
                <div className="register-mentor-form__field-group">
                  <label className="register-mentor-form__label">
                    Current Company
                  </label>
                  <input
                    type="text"
                    className="register-mentor-form__input"
                    name="current_company"
                    value={formData.current_company}
                    onChange={handleChange}
                    placeholder="Enter current company"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="register-mentor-form__col-half">
                <div className="register-mentor-form__field-group">
                  <label className="register-mentor-form__label">
                    Years of Experience <span className="register-mentor-form__required">*</span>
                  </label>
                  <input
                    type="number"
                    className={`register-mentor-form__input ${errors.years_of_experience ? "register-mentor-form__input--error" : ""}`}
                    name="years_of_experience"
                    value={formData.years_of_experience}
                    onChange={handleChange}
                    placeholder="Enter years of experience"
                    min="0"
                    max="50"
                    step="0.1"
                    disabled={loading}
                  />
                  {errors.years_of_experience && (
                    <span className="register-mentor-form__error-text">{errors.years_of_experience}</span>
                  )}
                </div>
              </div>

              <div className="register-mentor-form__col-half">
                <div className="register-mentor-form__field-group">
                  <label className="register-mentor-form__label">
                    Max Trainees <span className="register-mentor-form__required">*</span>
                  </label>
                  <input
                    type="number"
                    className={`register-mentor-form__input ${errors.max_trainees ? "register-mentor-form__input--error" : ""}`}
                    name="max_trainees"
                    value={formData.max_trainees}
                    onChange={handleChange}
                    placeholder="Maximum number of trainees"
                    min="1"
                    disabled={loading}
                  />
                  {errors.max_trainees && (
                    <span className="register-mentor-form__error-text">{errors.max_trainees}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Specializations Section */}
          <div className="register-mentor-section">
            <h3 className="register-mentor-section__title">
              <span className="register-mentor-section__title-icon">🔧</span>
              Specializations
            </h3>
            {errors.specializations && (
              <div className="register-mentor-alert register-mentor-alert--error" role="alert">
                <span className="register-mentor-alert__message">{errors.specializations}</span>
              </div>
            )}
            {errors.primary_specialization && (
              <div className="register-mentor-alert register-mentor-alert--error" role="alert">
                <span className="register-mentor-alert__message">{errors.primary_specialization}</span>
              </div>
            )}

            {specializations.map((spec, index) => (
              <div key={index} className="register-mentor-specialization-card">
                <div className="register-mentor-form__row">
                  <div className="register-mentor-form__col-third">
                    <div className="register-mentor-form__field-group">
                      <label className="register-mentor-form__label">
                        Department <span className="register-mentor-form__required">*</span>
                      </label>
                      <select
                        className={`register-mentor-form__select ${errors[`spec_dept_${index}`] ? "register-mentor-form__select--error" : ""}`}
                        value={spec.department_id}
                        onChange={(e) => updateSpecialization(index, "department_id", e.target.value)}
                        disabled={loading}
                      >
                        <option value="">Select Department</option>
                        {departments.map((dept) => (
                          <option key={dept.id} value={dept.id}>{getDepartmentDisplay(dept)}</option>
                        ))}
                      </select>
                      {errors[`spec_dept_${index}`] && (
                        <span className="register-mentor-form__error-text">{errors[`spec_dept_${index}`]}</span>
                      )}
                    </div>
                  </div>

                  <div className="register-mentor-form__col-third">
                    <div className="register-mentor-form__field-group">
                      <label className="register-mentor-form__label">
                        Mentor Level <span className="register-mentor-form__required">*</span>
                      </label>
                      <select
                        className={`register-mentor-form__select ${errors[`spec_level_${index}`] ? "register-mentor-form__select--error" : ""}`}
                        value={spec.level_id}
                        onChange={(e) => updateSpecialization(index, "level_id", e.target.value)}
                        disabled={loading}
                      >
                        <option value="">Select Level</option>
                        {filteredLevels.map((level) => (
                          <option key={level.id} value={level.id}>{getLevelDisplay(level)}</option>
                        ))}
                      </select>
                      {errors[`spec_level_${index}`] && (
                        <span className="register-mentor-form__error-text">{errors[`spec_level_${index}`]}</span>
                      )}
                    </div>
                  </div>

                  <div className="register-mentor-form__col-third">
                    <div className="register-mentor-form__field-group">
                      <label className="register-mentor-form__label">
                        Years Exp. in Specialization <span className="register-mentor-form__required">*</span>
                      </label>
                      <input
                        type="number"
                        className={`register-mentor-form__input ${errors[`spec_years_${index}`] ? "register-mentor-form__input--error" : ""}`}
                        value={spec.years_of_experience_in_specialization}
                        onChange={(e) => updateSpecialization(index, "years_of_experience_in_specialization", e.target.value)}
                        placeholder="Years of experience"
                        min="0"
                        step="0.5"
                        disabled={loading}
                      />
                      {errors[`spec_years_${index}`] && (
                        <span className="register-mentor-form__error-text">{errors[`spec_years_${index}`]}</span>
                      )}
                    </div>
                  </div>

                  <div className="register-mentor-form__col-fourth">
                    <div className="register-mentor-form__field-group">
                      <label className="register-mentor-form__label">
                        Max Trainees
                      </label>
                      <input
                        type="number"
                        className="register-mentor-form__input"
                        value={spec.max_trainees_for_specialization}
                        onChange={(e) => updateSpecialization(index, "max_trainees_for_specialization", e.target.value)}
                        placeholder="Optional"
                        min="1"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="register-mentor-form__col-fourth">
                    <div className="register-mentor-form__field-group">
                      <label className="register-mentor-form__label">Primary</label>
                      <input
                        type="checkbox"
                        className="register-mentor-form__checkbox"
                        checked={spec.is_primary_specialization}
                        onChange={(e) => updateSpecialization(index, "is_primary_specialization", e.target.checked)}
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="register-mentor-form__col-fourth">
                    <div className="register-mentor-form__field-group">
                      <label className="register-mentor-form__label">&nbsp;</label>
                      <button
                        type="button"
                        className="register-mentor-form__btn register-mentor-form__btn--danger register-mentor-form__btn--small"
                        onClick={() => removeSpecialization(index)}
                        disabled={loading}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="register-mentor-form__row">
              <div className="register-mentor-form__col-full">
                <button
                  type="button"
                  className="register-mentor-form__btn register-mentor-form__btn--secondary"
                  onClick={addSpecialization}
                  disabled={loading}
                >
                  + Add Specialization
                </button>
              </div>
            </div>
          </div>

          {/* Certifications Section */}
          <div className="register-mentor-section">
            <h3 className="register-mentor-section__title">
              <span className="register-mentor-section__title-icon">📜</span>
              Certifications
            </h3>

            {certifications.map((cert, index) => (
              <div key={index} className="register-mentor-certification-card">
                <div className="register-mentor-form__row">
                  <div className="register-mentor-form__col-half">
                    <div className="register-mentor-form__field-group">
                      <label className="register-mentor-form__label">Certification Type</label>
                      <select
                        className="register-mentor-form__select"
                        value={cert.certification_type}
                        onChange={(e) => updateCertification(index, "certification_type", e.target.value)}
                        disabled={loading}
                      >
                        <option value="">Select Type</option>
                        <option value="background_check">Background Check</option>
                        <option value="mentorship_program">Mentorship Program</option>
                        <option value="technical_certification">Technical Certification</option>
                        <option value="industry_certification">Industry Certification</option>
                        <option value="safety_training">Safety Training</option>
                        <option value="compliance_training">Compliance Training</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  {/* Show other certification type input when "other" is selected */}
                  {cert.certification_type === "other" && (
                    <div className="register-mentor-form__col-half">
                      <div className="register-mentor-form__field-group">
                        <label className="register-mentor-form__label">Specify Certification Type</label>
                        <input
                          type="text"
                          className="register-mentor-form__input"
                          value={cert.other_certification_type || ""}
                          onChange={(e) => updateCertification(index, "other_certification_type", e.target.value)}
                          placeholder="Please specify certification type"
                          disabled={loading}
                        />
                      </div>
                    </div>
                  )}

                  <div className="register-mentor-form__col-half">
                    <div className="register-mentor-form__field-group">
                      <label className="register-mentor-form__label">Certification Name</label>
                      <input
                        type="text"
                        className="register-mentor-form__input"
                        value={cert.certification_name}
                        onChange={(e) => updateCertification(index, "certification_name", e.target.value)}
                        placeholder="Certification name"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="register-mentor-form__col-third">
                    <div className="register-mentor-form__field-group">
                      <label className="register-mentor-form__label">Issued Date</label>
                      <input
                        type="date"
                        className="register-mentor-form__input"
                        value={cert.issued_date}
                        onChange={(e) => updateCertification(index, "issued_date", e.target.value)}
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="register-mentor-form__col-third">
                    <div className="register-mentor-form__field-group">
                      <label className="register-mentor-form__label">Expiry Date</label>
                      <input
                        type="date"
                        className="register-mentor-form__input"
                        value={cert.expiry_date}
                        onChange={(e) => updateCertification(index, "expiry_date", e.target.value)}
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="register-mentor-form__col-third">
                    <div className="register-mentor-form__field-group">
                      <label className="register-mentor-form__label">
                        Issuer Type <span className="register-mentor-form__required">*</span>
                      </label>
                      <select
                        className="register-mentor-form__select"
                        value={cert.issuer_type}
                        onChange={(e) => updateCertification(index, "issuer_type", e.target.value)}
                        disabled={loading}
                      >
                        <option value="">Select Issuer Type</option>
                        <option value="government">Government</option>
                        <option value="private_organization">Private Organization</option>
                        <option value="educational_institution">Educational Institution</option>
                        <option value="professional_body">Professional Body</option>
                        <option value="corporate">Corporate</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  {/* Show other issuer type input when "other" is selected */}
                  {cert.issuer_type === "other" && (
                    <div className="register-mentor-form__col-third">
                      <div className="register-mentor-form__field-group">
                        <label className="register-mentor-form__label">Specify Issuer Type</label>
                        <input
                          type="text"
                          className="register-mentor-form__input"
                          value={cert.other_issuer_type || ""}
                          onChange={(e) => updateCertification(index, "other_issuer_type", e.target.value)}
                          placeholder="Please specify issuer type"
                          disabled={loading}
                        />
                      </div>
                    </div>
                  )}

                  <div className="register-mentor-form__col-half">
                    <div className="register-mentor-form__field-group">
                      <label className="register-mentor-form__label">Issuing Organization</label>
                      <input
                        type="text"
                        className="register-mentor-form__input"
                        value={cert.issuing_organization}
                        onChange={(e) => updateCertification(index, "issuing_organization", e.target.value)}
                        placeholder="Organization"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="register-mentor-form__col-half">
                    <div className="register-mentor-form__field-group">
                      <label className="register-mentor-form__label">Document URL</label>
                      <input
                        type="url"
                        className="register-mentor-form__input"
                        value={cert.document_url || ""}
                        onChange={(e) => updateCertification(index, "document_url", e.target.value)}
                        placeholder="https://example.com/document.pdf"
                        disabled={loading || !!cert.document}
                      />
                      {cert.document_url && !cert.document && (
                        <small className="register-mentor-form__help-text">✓ Document URL provided</small>
                      )}
                    </div>
                  </div>

                  <div className="register-mentor-form__col-half">
                    <div className="register-mentor-form__field-group">
                      <label className="register-mentor-form__label">Upload PDF Document</label>
                      <input
                        type="file"
                        className="register-mentor-form__input"
                        accept=".pdf"
                        onChange={(e) => handleCertificationFile(index, e.target.files[0])}
                        disabled={loading}
                      />
                      {cert.document && (
                        <small className="register-mentor-form__help-text register-mentor-form__help-text--success">
                          ✓ File selected: {cert.document.name}
                        </small>
                      )}
                      {!cert.document && cert.existing_document && (
                        <small className="register-mentor-form__help-text">
                          📄 Existing document available
                        </small>
                      )}
                      <small className="register-mentor-form__help-text">Max 5MB, PDF only</small>
                    </div>
                  </div>

                  <div className="register-mentor-form__col-full">
                    <button
                      type="button"
                      className="register-mentor-form__btn register-mentor-form__btn--danger register-mentor-form__btn--small"
                      onClick={() => removeCertification(index)}
                      disabled={loading}
                    >
                      Remove Certification
                    </button>
                  </div>
                </div>
                {/* Add gap between certification cards */}
                {index < certifications.length - 1 && <div style={{ marginBottom: "20px" }}></div>}
              </div>
            ))}

            <div className="register-mentor-form__row">
              <div className="register-mentor-form__col-full">
                <button
                  type="button"
                  className="register-mentor-form__btn register-mentor-form__btn--secondary"
                  onClick={addCertification}
                  disabled={loading}
                >
                  + Add Certification
                </button>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="register-mentor-form__actions">
            <button
              type="button"
              className="register-mentor-form__btn register-mentor-form__btn--outline"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="register-mentor-form__btn register-mentor-form__btn--primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="register-mentor-form__btn-spinner"></span>
                  {isEditMode ? "Updating..." : "Creating..."}
                </>
              ) : isEditMode ? (
                "Update Mentor"
              ) : (
                "Add Mentor"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterMentor;