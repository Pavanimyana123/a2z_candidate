import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { BASE_URL } from "../../../ApiUrl";
import "./Register.css"

const RegisterMentor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [error, setError] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);

  // State for dropdown options
  const [levels, setLevels] = useState([]);
  const [filteredLevels, setFilteredLevels] = useState([]); // New state for filtered levels (level > 3)
  const [departments, setDepartments] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  const [formData, setFormData] = useState({
    full_name: "",
    phone_number: "",
    email: "",
    mentor_level: "",
    specializations: [],
    current_company: "",
    years_of_experience: "",
    max_trainees: "",
    current_trainees: "",
    background_verified: true,
    mentorship_certified: true,
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
      console.log("✅ Levels fetched:", levelsData);

      const deptsResponse = await fetch(`${BASE_URL}/api/admin/departments/`);
      if (!deptsResponse.ok) {
        throw new Error(`Failed to fetch departments: ${deptsResponse.status}`);
      }
      const deptsData = await deptsResponse.json();
      console.log("✅ Departments fetched:", deptsData);

      const activeLevels = levelsData.data?.filter((level) => level.is_active) || [];
      const activeDepartments = deptsData.data?.filter((dept) => dept.is_active) || [];

      setLevels(activeLevels);
      
      // Filter levels to only show levels with number greater than 3 (Level 4 and above)
      const filtered = activeLevels.filter(level => level.number > 3);
      setFilteredLevels(filtered);
      console.log("✅ Filtered levels (number > 3):", filtered);
      
      setDepartments(activeDepartments);
    } catch (err) {
      console.error("❌ Error fetching options:", err);
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
          mentor_level: mentorData.mentor_level ? parseInt(mentorData.mentor_level) : "",
          specializations: Array.isArray(mentorData.specializations) 
            ? mentorData.specializations.map(id => parseInt(id)) 
            : [],
          current_company: mentorData.current_company || "",
          years_of_experience: mentorData.years_of_experience || "",
          max_trainees: mentorData.max_trainees || "",
          current_trainees: mentorData.current_trainees || "",
          background_verified: mentorData.background_verified ?? true,
          mentorship_certified: mentorData.mentorship_certified ?? true,
        });
        console.log("✅ Mentor data loaded for edit:", mentorData);
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
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else if (name === "specializations") {
      const selectedOptions = Array.from(
        e.target.selectedOptions,
        (option) => parseInt(option.value)
      );
      setFormData((prev) => ({
        ...prev,
        [name]: selectedOptions,
      }));
    } else if (name === "mentor_level") {
      setFormData((prev) => ({
        ...prev,
        [name]: value ? parseInt(value) : "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "number" ? (value === "" ? "" : Number(value)) : value,
      }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const removeSpecialization = (deptId) => {
    setFormData((prev) => ({
      ...prev,
      specializations: prev.specializations.filter((id) => id !== deptId),
    }));
  };

  const clearMentorLevel = () => {
    setFormData((prev) => ({
      ...prev,
      mentor_level: "",
    }));
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

    if (!formData.mentor_level && formData.mentor_level !== 0) {
      newErrors.mentor_level = "Mentor level is required";
    }

    if (!formData.specializations || formData.specializations.length === 0) {
      newErrors.specializations = "At least one specialization is required";
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

    const payload = {
      full_name: formData.full_name,
      phone_number: formData.phone_number,
      email: formData.email,
      mentor_level: formData.mentor_level ? parseInt(formData.mentor_level) : null,
      specializations: formData.specializations.map(id => parseInt(id)),
      current_company: formData.current_company || "",
      years_of_experience: Number(formData.years_of_experience),
      max_trainees: Number(formData.max_trainees),
      current_trainees: Number(formData.current_trainees || 0),
      mentorship_status: "pending",
      background_verified: formData.background_verified,
      mentorship_certified: formData.mentorship_certified,
    };

    console.log("📦 Sending payload:", payload);

    const url = isEditMode
      ? `${BASE_URL}/api/mentor/mentors/${id}/`
      : `${BASE_URL}/api/mentor/mentors/`;

    try {
      const response = await fetch(url, {
        method: isEditMode ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json().catch(() => null);
      console.log("📥 Response:", responseData);

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}`;
        
        if (responseData) {
          if (responseData.message) {
            errorMessage = responseData.message;
          } else if (responseData.errors) {
            const fieldErrors = Object.entries(responseData.errors)
              .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`)
              .join('\n');
            errorMessage = `Validation failed:\n${fieldErrors}`;
            
            const newErrors = {};
            Object.entries(responseData.errors).forEach(([field, errors]) => {
              newErrors[field] = Array.isArray(errors) ? errors[0] : errors;
            });
            setErrors(newErrors);
          } else {
            errorMessage = JSON.stringify(responseData);
          }
        }

        throw new Error(errorMessage);
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
      console.error("❌ Error saving mentor:", err);
      setError(err.message);

      Swal.fire({
        icon: "error",
        title: "Save Failed",
        text: err.message,
        showConfirmButton: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  const handleCancel = () => {
    navigate("/mentor");
  };

  const getLevelDisplay = (level) => {
    return `${level.name} (Level ${level.number})`;
  };

  const getDepartmentDisplay = (dept) => {
    return `${dept.name} (${dept.code})`;
  };

  // Function to get the levels to display in dropdown
  const getDisplayLevels = () => {
    if (isEditMode) {
      // In edit mode, include all filtered levels AND the currently selected level if it's not already included
      const currentLevel = levels.find(l => l.id === formData.mentor_level);
      if (currentLevel && currentLevel.number <= 3 && !filteredLevels.some(l => l.id === currentLevel.id)) {
        return [...filteredLevels, currentLevel];
      }
    }
    return filteredLevels;
  };

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

  const displayLevels = getDisplayLevels();

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
              {/* Full Name */}
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

              {/* Phone Number and Email */}
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
            </div>
          </div>

          {/* Professional Information Section */}
          <div className="register-mentor-section">
            <h3 className="register-mentor-section__title">
              <span className="register-mentor-section__title-icon">💼</span>
              Professional Information
            </h3>
            <div className="register-mentor-form__row">
              {/* Mentor Level and Current Company */}
              <div className="register-mentor-form__col-half">
                <div className="register-mentor-form__field-group">
                  <label className="register-mentor-form__label">
                    Mentor Level <span className="register-mentor-form__required">*</span>
                  </label>
                  <div className="register-mentor-form__select-wrapper">
                    <select
                      className={`register-mentor-form__select ${errors.mentor_level ? "register-mentor-form__select--error" : ""} ${formData.mentor_level ? "register-mentor-form__select--has-value" : ""}`}
                      name="mentor_level"
                      value={formData.mentor_level || ""}
                      onChange={handleChange}
                      disabled={loading || displayLevels.length === 0}
                    >
                      <option value="">Select Mentor Level</option>
                      {displayLevels.map((level) => (
                        <option key={level.id} value={level.id}>
                          {getLevelDisplay(level)}
                        </option>
                      ))}
                    </select>
                    {formData.mentor_level && (
                      <button
                        type="button"
                        className="register-mentor-form__clear-btn"
                        onClick={clearMentorLevel}
                        title="Clear selection"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  {errors.mentor_level && (
                    <span className="register-mentor-form__error-text">{errors.mentor_level}</span>
                  )}
                  {displayLevels.length === 0 && (
                    <small className="register-mentor-form__warning-text">
                      No mentor levels available (Level 4 and above)
                    </small>
                  )}
                </div>
              </div>

              <div className="register-mentor-form__col-half">
                <div className="register-mentor-form__field-group">
                  <label className="register-mentor-form__label">Current Company</label>
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

              {/* Experience, Max Trainees, Current Trainees */}
              <div className="register-mentor-form__col-third">
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

              <div className="register-mentor-form__col-third">
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

              <div className="register-mentor-form__col-third">
                <div className="register-mentor-form__field-group">
                  <label className="register-mentor-form__label">Current Trainees</label>
                  <input
                    type="number"
                    className="register-mentor-form__input"
                    name="current_trainees"
                    value={formData.current_trainees}
                    onChange={handleChange}
                    placeholder="Current number of trainees"
                    min="0"
                    disabled={loading}
                  />
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
            <div className="register-mentor-form__row">
              <div className="register-mentor-form__col-full">
                <div className="register-mentor-form__field-group">
                  <label className="register-mentor-form__label">
                    Specializations <span className="register-mentor-form__required">*</span>
                  </label>
                  <select
                    multiple
                    className={`register-mentor-form__select register-mentor-form__multi-select ${errors.specializations ? "register-mentor-form__select--error" : ""}`}
                    name="specializations"
                    value={formData.specializations.map(String)}
                    onChange={handleChange}
                    disabled={loading || departments.length === 0}
                    size="6"
                  >
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {getDepartmentDisplay(dept)}
                      </option>
                    ))}
                  </select>
                  {errors.specializations && (
                    <span className="register-mentor-form__error-text">{errors.specializations}</span>
                  )}
                  {departments.length === 0 && (
                    <small className="register-mentor-form__warning-text">
                      No active departments available
                    </small>
                  )}
                  <small className="register-mentor-form__help-text">
                    Hold Ctrl/Cmd to select multiple specializations
                  </small>
                </div>
              </div>

              {/* Selected Specializations Tags */}
              {formData.specializations.length > 0 && (
                <div className="register-mentor-form__col-full">
                  <div className="register-mentor-form__field-group">
                    <label className="register-mentor-form__label">
                      Selected Specializations:
                    </label>
                    <div className="register-mentor-form__tags-container">
                      {formData.specializations.map((deptId) => {
                        const dept = departments.find((d) => d.id === deptId);
                        return dept ? (
                          <span key={deptId} className="register-mentor-form__tag">
                            {getDepartmentDisplay(dept)}
                            <button
                              type="button"
                              className="register-mentor-form__tag-remove-btn"
                              onClick={() => removeSpecialization(deptId)}
                              title="Remove"
                            >
                              ×
                            </button>
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Verification Status Section */}
          <div className="register-mentor-form__verification-section">
            <h5 className="register-mentor-form__section-title">
              <span className="register-mentor-section__title-icon">✅</span>
              Verification Status
            </h5>
            <div className="register-mentor-form__checkbox-group">
              <div className="register-mentor-form__checkbox-wrapper">
                <input
                  type="checkbox"
                  className="register-mentor-form__checkbox"
                  name="background_verified"
                  checked={formData.background_verified}
                  onChange={handleChange}
                  disabled={loading}
                  id="backgroundVerified"
                />
                <label
                  className="register-mentor-form__checkbox-label"
                  htmlFor="backgroundVerified"
                >
                  Background Verified
                </label>
              </div>
              <div className="register-mentor-form__checkbox-wrapper">
                <input
                  type="checkbox"
                  className="register-mentor-form__checkbox"
                  name="mentorship_certified"
                  checked={formData.mentorship_certified}
                  onChange={handleChange}
                  disabled={loading}
                  id="mentorshipCertified"
                />
                <label
                  className="register-mentor-form__checkbox-label"
                  htmlFor="mentorshipCertified"
                >
                  Mentorship Certified
                </label>
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