import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../Layout/Sidebar";
import Header from "../Layout/Header";
import "./AddMentor.css";
import Swal from "sweetalert2";
import { BASE_URL } from "../../../ApiUrl";

const AddMentor = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get ID from URL for edit mode
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [error, setError] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);

  // State for dropdown options
  const [levels, setLevels] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  const [formData, setFormData] = useState({
    full_name: "",
    phone_number: "",
    email: "",
    mentor_level: "", // Will store level_id
    specializations: [], // Will store array of department_ids
    current_company: "",
    years_of_experience: "",
    max_trainees: "",
    current_trainees: "",
    mentorship_status: "active",
    background_verified: true,
    mentorship_certified: true,
  });

  const [errors, setErrors] = useState({});

  // Fetch levels and departments on component mount
  useEffect(() => {
    fetchOptions();
  }, []);

  // Fetch mentor data if in edit mode
  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      fetchMentorData();
    }
  }, [id]);

  const fetchOptions = async () => {
    try {
      setLoadingOptions(true);

      // Fetch levels
      const levelsResponse = await fetch(`${BASE_URL}/api/admin/levels/`);
      if (!levelsResponse.ok) {
        throw new Error(`Failed to fetch levels: ${levelsResponse.status}`);
      }
      const levelsData = await levelsResponse.json();
      console.log("✅ Levels fetched:", levelsData);

      // Fetch departments
      const deptsResponse = await fetch(`${BASE_URL}/api/admin/departments/`);
      if (!deptsResponse.ok) {
        throw new Error(`Failed to fetch departments: ${deptsResponse.status}`);
      }
      const deptsData = await deptsResponse.json();
      console.log("✅ Departments fetched:", deptsData);

      // Filter active levels and departments
      const activeLevels =
        levelsData.data?.filter((level) => level.is_active) || [];
      const activeDepartments =
        deptsData.data?.filter((dept) => dept.is_active) || [];

      setLevels(activeLevels);
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
          mentor_level: mentorData.mentor_level || "",
          specializations: mentorData.specializations || [],
          current_company: mentorData.current_company || "",
          years_of_experience: mentorData.years_of_experience || "",
          max_trainees: mentorData.max_trainees || "",
          current_trainees: mentorData.current_trainees || "",
          mentorship_status: mentorData.mentorship_status || "active",
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
      // Handle multi-select for specializations
      const selectedOptions = Array.from(
        e.target.selectedOptions,
        (option) => option.value,
      );
      setFormData((prev) => ({
        ...prev,
        [name]: selectedOptions,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "number" ? (value === "" ? "" : Number(value)) : value,
      }));
    }

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Remove a selected specialization
  const removeSpecialization = (deptId) => {
    setFormData((prev) => ({
      ...prev,
      specializations: prev.specializations.filter((id) => id !== deptId),
    }));
  };

  // Clear selected mentor level
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

    if (!formData.mentor_level) {
      newErrors.mentor_level = "Mentor level is required";
    }

    if (!formData.specializations || formData.specializations.length === 0) {
      newErrors.specializations = "At least one specialization is required";
    }

    if (!formData.years_of_experience && formData.years_of_experience !== 0) {
      newErrors.years_of_experience = "Years of experience is required";
    } else if (
      formData.years_of_experience < 0 ||
      formData.years_of_experience > 50
    ) {
      newErrors.years_of_experience =
        "Years of experience must be between 0 and 50";
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
      mentor_level: formData.mentor_level,
      specializations: formData.specializations,
      current_company: formData.current_company || "",
      years_of_experience: Number(formData.years_of_experience),
      max_trainees: Number(formData.max_trainees),
      current_trainees: Number(formData.current_trainees || 0),
      mentorship_status: formData.mentorship_status,
      background_verified: formData.background_verified,
      mentorship_certified: formData.mentorship_certified,
    };

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

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}`;

        try {
          const errorData = await response.json();
          errorMessage =
            errorData.message || errorData.error || JSON.stringify(errorData);
        } catch {}

        throw new Error(errorMessage);
      }

      await Swal.fire({
        icon: "success",
        title: isEditMode ? "Updated!" : "Created!",
        text: "Mentor saved successfully",
        timer: 2000,
        showConfirmButton: false,
      });

      navigate("/mentor");
    } catch (err) {
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

  const handleCancel = () => {
    navigate("/mentor");
  };

  // Get level display name with number
  const getLevelDisplay = (level) => {
    return `${level.name} (${level.number})`;
  };

  // Get department display with code
  const getDepartmentDisplay = (dept) => {
    return `${dept.name} (${dept.code})`;
  };

  // Get level name by ID for display
  const getLevelName = (levelId) => {
    const level = levels.find((l) => l.level_id === levelId);
    return level ? getLevelDisplay(level) : "Unknown Level";
  };

  // Get department name by ID for display
  const getDepartmentName = (deptId) => {
    const dept = departments.find((d) => d.department_id === deptId);
    return dept ? getDepartmentDisplay(dept) : "Unknown Department";
  };

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
                {fetchLoading
                  ? "Loading mentor data..."
                  : "Loading levels and departments..."}
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
            {/* Header */}
            <div className="am-header">
              <div>
                <h2>{isEditMode ? "Edit Mentor" : "Add New Mentor"}</h2>
                <p>
                  {isEditMode
                    ? "Update the mentor details below"
                    : "Fill in the mentor details below"}
                </p>
              </div>

            </div>

            {/* Error Message */}
            {error && (
              <div
                className="alert alert-danger alert-dismissible fade show"
                role="alert"
              >
                <strong>Error:</strong> {error}
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setError("")}
                  aria-label="Close"
                ></button>
              </div>
            )}

            {/* Form */}
            <div className="am-form-container">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  {/* Full Name */}
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
                    {errors.full_name && (
                      <div className="invalid-feedback">{errors.full_name}</div>
                    )}
                  </div>

                  {/* Phone Number */}
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
                    />
                    {errors.phone_number && (
                      <div className="invalid-feedback">
                        {errors.phone_number}
                      </div>
                    )}
                  </div>

                  {/* Email */}
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
                    {errors.email && (
                      <div className="invalid-feedback">{errors.email}</div>
                    )}
                  </div>

                  {/* Mentor Level - Now showing name and number */}
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Mentor Level *</label>
                    <div className="position-relative">
                      <select
                        className={`form-select ${errors.mentor_level ? "is-invalid" : ""} ${formData.mentor_level ? "has-value" : ""}`}
                        name="mentor_level"
                        value={formData.mentor_level}
                        onChange={handleChange}
                        disabled={loading || levels.length === 0}
                      >
                        <option value="">Select Mentor Level</option>
                        {levels.map((level) => (
                          <option key={level.level_id} value={level.level_id}>
                            {getLevelDisplay(level)}
                          </option>
                        ))}
                      </select>
                      {formData.mentor_level && (
                        <button
                          type="button"
                          className="btn-clear-selection"
                          onClick={clearMentorLevel}
                          title="Clear selection"
                        >
                          <i className="bi bi-x-circle-fill"></i>
                        </button>
                      )}
                    </div>
                    {errors.mentor_level && (
                      <div className="invalid-feedback">
                        {errors.mentor_level}
                      </div>
                    )}
                    {levels.length === 0 && (
                      <small className="text-warning">
                        No active levels available
                      </small>
                    )}
                  </div>

                  {/* Current Company */}
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

                  {/* Years of Experience */}
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
                    {errors.years_of_experience && (
                      <div className="invalid-feedback">
                        {errors.years_of_experience}
                      </div>
                    )}
                  </div>

                  {/* Max Trainees */}
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
                    {errors.max_trainees && (
                      <div className="invalid-feedback">
                        {errors.max_trainees}
                      </div>
                    )}
                  </div>

                  {/* Current Trainees */}
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Current Trainees</label>
                    <input
                      type="number"
                      className="form-control"
                      name="current_trainees"
                      value={formData.current_trainees}
                      onChange={handleChange}
                      placeholder="Current number of trainees"
                      min="0"
                      disabled={loading}
                    />
                  </div>

                  {/* Mentorship Status */}
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
                      <option value="on-leave">On Leave</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>

                  {/* Specializations - Multi-select showing name and code */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Specializations *</label>
                    <select
                      multiple
                      className={`form-select ${errors.specializations ? "is-invalid" : ""}`}
                      name="specializations"
                      value={formData.specializations}
                      onChange={handleChange}
                      disabled={loading || departments.length === 0}
                      size="4"
                    >
                      {departments.map((dept) => (
                        <option
                          key={dept.department_id}
                          value={dept.department_id}
                        >
                          {getDepartmentDisplay(dept)}
                        </option>
                      ))}
                    </select>
                    {errors.specializations && (
                      <div className="invalid-feedback">
                        {errors.specializations}
                      </div>
                    )}
                    {departments.length === 0 && (
                      <small className="text-warning">
                        No active departments available
                      </small>
                    )}
                    <small className="text-muted">
                      Hold Ctrl/Cmd to select multiple
                    </small>
                  </div>

                  {/* Selected Specializations Tags */}
                  {formData.specializations.length > 0 && (
                    <div className="col-12 mb-3">
                      <label className="form-label">
                        Selected Specializations:
                      </label>
                      <div className="selected-tags-container">
                        {formData.specializations.map((deptId) => {
                          const dept = departments.find(
                            (d) => d.department_id === deptId,
                          );
                          return dept ? (
                            <span key={deptId} className="selected-tag">
                              {getDepartmentDisplay(dept)}
                              <button
                                type="button"
                                className="tag-remove"
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
                  )}

                  
                </div>

                {/* Verification Status Section */}
                <div className="row">
                  <div className="col-12">
                    <h5>Verification Status</h5>
                  </div>
                  <div className="col-md-6">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        name="background_verified"
                        checked={formData.background_verified}
                        onChange={handleChange}
                        disabled={loading}
                        id="backgroundVerified"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="backgroundVerified"
                      >
                        Background Verified
                      </label>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        name="mentorship_certified"
                        checked={formData.mentorship_certified}
                        onChange={handleChange}
                        disabled={loading}
                        id="mentorshipCertified"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="mentorshipCertified"
                      >
                        Mentorship Certified
                      </label>
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="am-actions mt-4">
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
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
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
        </div>
      </div>
    </div>
  );
};

export default AddMentor;
