import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Layout/Sidebar";
import Header from "../Layout/Header";
import "./ComplianceManagement.css";
import {
  FaShieldAlt,
  FaHeartbeat,
  FaExclamationTriangle,
  FaBalanceScale,
  FaPlus,
  FaEdit,
  FaTrash,
  FaLayerGroup,
  FaTimes,
  FaSave
} from "react-icons/fa";
import Swal from "sweetalert2";
import { BASE_URL } from "../../../ApiUrl";

const ComplianceManagement = () => {
  const navigate = useNavigate();
  const [complianceRules, setComplianceRules] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState("");

  const [summaryData, setSummaryData] = useState({
    safetyInduction: 0,
    medicalValidity: 0,
    incidentTracking: 0,
    ethicsViolations: 0
  });

  useEffect(() => {
    fetchComplianceRules();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/admin/compliance-categories/`);
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      const result = await response.json();
      if (result.status && result.data) {
        setCategories(result.data);
      } else if (Array.isArray(result)) {
        setCategories(result);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load categories',
        timer: 3000
      });
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please enter a category name',
        timer: 2000
      });
      return;
    }

    setCategoryLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/admin/compliance-categories/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category_name: newCategoryName })
      });

      if (!response.ok) {
        throw new Error("Failed to add category");
      }

      const result = await response.json();
      
      await Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Category added successfully',
        timer: 2000,
        showConfirmButton: false
      });

      setNewCategoryName("");
      await fetchCategories();
    } catch (error) {
      console.error("Error adding category:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to add category',
        timer: 3000
      });
    } finally {
      setCategoryLoading(false);
    }
  };

  const handleStartEdit = (categoryId, categoryName) => {
    setEditingCategory(categoryId);
    setNewCategoryName(categoryName);
    setEditCategoryName(categoryName);
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setNewCategoryName("");
    setEditCategoryName("");
  };

  const handleUpdateCategory = async () => {
    if (!newCategoryName.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please enter a category name',
        timer: 2000
      });
      return;
    }

    setCategoryLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/admin/compliance-categories/${editingCategory}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category_name: newCategoryName })
      });

      if (!response.ok) {
        throw new Error("Failed to update category");
      }

      await Swal.fire({
        icon: 'success',
        title: 'Updated!',
        text: 'Category updated successfully',
        timer: 2000,
        showConfirmButton: false
      });

      setEditingCategory(null);
      setNewCategoryName("");
      setEditCategoryName("");
      await fetchCategories();
    } catch (error) {
      console.error("Error updating category:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to update category',
        timer: 3000
      });
    } finally {
      setCategoryLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId, categoryName) => {
    const ruleCount = complianceRules.filter(rule => rule.category === categoryId).length;
    
    if (ruleCount > 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Cannot Delete',
        text: `This category has ${ruleCount} rule(s). Please delete or move the rules first.`,
        timer: 3000
      });
      return;
    }

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete "${categoryName}". This action cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`${BASE_URL}/api/admin/compliance-categories/${categoryId}/`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error("Failed to delete category");
        }

        await Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Category deleted successfully',
          timer: 2000,
          showConfirmButton: false
        });

        await fetchCategories();
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Failed to delete category',
          timer: 3000
        });
      }
    }
  };

  const fetchComplianceRules = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/admin/compliance-rules/`);

      if (!response.ok) {
        throw new Error("Failed to fetch");
      }

      const result = await response.json();

      if (result.status && result.data) {
        setComplianceRules(result.data);
        updateSummaryData(result.data);
      } else if (Array.isArray(result)) {
        setComplianceRules(result);
        updateSummaryData(result);
      }
    } catch (error) {
      console.error("API Error:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load compliance rules',
        timer: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSummaryData = (rules) => {
    // First, fetch categories to map IDs to names
    const getCategoryCounts = async () => {
      try {
        const catResponse = await fetch(`${BASE_URL}/api/admin/compliance-categories/`);
        const catResult = await catResponse.json();
        const categoriesList = catResult.status ? catResult.data : catResult;
        
        // Create mapping from category ID to normalized name
        const categoryMapping = {};
        categoriesList.forEach(cat => {
          const catId = cat.id || cat.category_id;
          const catName = cat.category_name.toLowerCase();
          
          if (catName.includes('safety') || catName.includes('induction')) {
            categoryMapping[catId] = 'safetyInduction';
          } else if (catName.includes('medical') || catName.includes('validity')) {
            categoryMapping[catId] = 'medicalValidity';
          } else if (catName.includes('incident') || catName.includes('tracking')) {
            categoryMapping[catId] = 'incidentTracking';
          } else if (catName.includes('ethics') || catName.includes('violation')) {
            categoryMapping[catId] = 'ethicsViolations';
          }
        });
        
        // Count rules by category
        const counts = {
          safetyInduction: 0,
          medicalValidity: 0,
          incidentTracking: 0,
          ethicsViolations: 0
        };
        
        rules.forEach(rule => {
          const mappedKey = categoryMapping[rule.category];
          if (mappedKey && counts[mappedKey] !== undefined) {
            counts[mappedKey]++;
          }
        });
        
        setSummaryData(counts);
      } catch (error) {
        console.error("Error fetching categories for summary:", error);
        // Fallback: try to determine from rule names or use existing mapping
        const counts = {
          safetyInduction: 0,
          medicalValidity: 0,
          incidentTracking: 0,
          ethicsViolations: 0
        };
        
        rules.forEach(rule => {
          if (rule.category === 'safety' || rule.category === 1 || 
              (rule.category_name && rule.category_name.toLowerCase().includes('safety'))) {
            counts.safetyInduction++;
          } else if (rule.category === 'medical' || rule.category === 2 ||
                     (rule.category_name && rule.category_name.toLowerCase().includes('medical'))) {
            counts.medicalValidity++;
          } else if (rule.category === 'incident' || rule.category === 3 ||
                     (rule.category_name && rule.category_name.toLowerCase().includes('incident'))) {
            counts.incidentTracking++;
          } else if (rule.category === 'ethics' || rule.category === 4 ||
                     (rule.category_name && rule.category_name.toLowerCase().includes('ethics'))) {
            counts.ethicsViolations++;
          }
        });
        
        setSummaryData(counts);
      }
    };
    
    getCategoryCounts();
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId || cat.category_id === categoryId);
    return category ? category.category_name : categoryId;
  };

  const formatRules = (rule) => {
    switch (rule.category_type || rule.category) {
      case "safety":
      case 1:
        return [
          { label: "Validity Period", value: rule.validity_period_months || rule.validity_days || 12, unit: "months" },
          { label: "Renewal Warning", value: rule.renewal_warning_days || 30, unit: "days before" },
          { label: "Grace Period", value: rule.grace_period_days || 7, unit: "days" }
        ];

      case "medical":
      case 2:
        return [
          { label: "Certificate Validity", value: rule.validity_period_months || rule.validity_days || 24, unit: "months" },
          { label: "Renewal Warning", value: rule.renewal_warning_days || 60, unit: "days before" },
          {
            label: "Mandatory Check Interval",
            value: rule.mandatory_check_interval_months || rule.check_interval || 6,
            unit: "months"
          }
        ];

      case "incident":
      case 3:
        return [
          { label: "Report Deadline", value: rule.report_deadline_hours || rule.validity_period_months || 24, unit: "hours" },
          { label: "Investigation Period", value: rule.investigation_period_days || rule.grace_period_days || 7, unit: "days" },
          { label: "Review Cycle", value: rule.review_cycle_days || rule.renewal_warning_days || 30, unit: "days" }
        ];

      case "ethics":
      case 4:
        return [
          { label: "Review Period", value: rule.review_period_days || rule.grace_period_days || 14, unit: "days" },
          { label: "Appeal Window", value: rule.appeal_window_days || rule.renewal_warning_days || 30, unit: "days" },
          { label: "Record Retention", value: rule.record_retention_years || rule.validity_period_months || 5, unit: "years" }
        ];

      default:
        return [
          { label: "Validity Period", value: rule.validity_period_months || "-", unit: "months" },
          { label: "Renewal Warning", value: rule.renewal_warning_days || "-", unit: "days before" },
          { label: "Grace Period", value: rule.grace_period_days || "-", unit: "days" }
        ];
    }
  };

  const getIcon = (categoryId) => {
    const categoryName = getCategoryName(categoryId).toLowerCase();
    if (categoryName.includes('safety') || categoryName.includes('induction')) {
      return <FaShieldAlt />;
    } else if (categoryName.includes('medical') || categoryName.includes('validity')) {
      return <FaHeartbeat />;
    } else if (categoryName.includes('incident') || categoryName.includes('tracking')) {
      return <FaExclamationTriangle />;
    } else if (categoryName.includes('ethics') || categoryName.includes('violation')) {
      return <FaBalanceScale />;
    }
    return <FaLayerGroup />;
  };

  const getCategoryTitle = (categoryId) => {
    const categoryName = getCategoryName(categoryId);
    return categoryName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const handleAddCompliance = () => {
    navigate("/compliance/add");
  };

  const handleEditRule = (ruleId) => {
    navigate(`/compliance/edit/${ruleId}`);
  };

  const handleDeleteRule = async (ruleId, ruleName) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete "${ruleName}". This action cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          setDeletingId(ruleId);
          const response = await fetch(`${BASE_URL}/api/admin/compliance-rules/${ruleId}/`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            }
          });

          if (!response.ok) {
            throw new Error('Failed to delete compliance rule');
          }

          return true;
        } catch (error) {
          Swal.showValidationMessage(`Delete failed: ${error.message}`);
          throw error;
        } finally {
          setDeletingId(null);
        }
      }
    });

    if (result.isConfirmed) {
      await Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'Compliance rule has been deleted successfully.',
        timer: 2000,
        showConfirmButton: false
      });
      
      await fetchComplianceRules();
    }
  };

  // Group rules by category for better display
  const groupedRules = complianceRules.reduce((acc, rule) => {
    const categoryId = rule.category;
    if (!acc[categoryId]) {
      acc[categoryId] = [];
    }
    acc[categoryId].push(rule);
    return acc;
  }, {});

  return (
    <div className="ta-layout-wrapper">
      <Sidebar />

      <div className="ta-main-wrapper">
        <Header />

        <div className="ta-content-area compliance-page">
          {/* HEADER */}
          <div className="compliance-header">
            <div>
              <h2>Compliance Management</h2>
              <p>Configure compliance rules and track violations</p>
            </div>

            <div className="header-buttons">
              <button
                className="btn btn-primary compliance-config-btn"
                onClick={handleAddCompliance}
              >
                <FaPlus /> Add Compliance Rule
              </button>
            </div>
          </div>

          {/* SUMMARY CARDS - Updated with proper icons and layout like the image */}
          <div className="row g-4">
            <SummaryCard 
              title="Safety Induction" 
              value={summaryData.safetyInduction} 
              icon={<FaShieldAlt />} 
              subtitle="Configure validity and threshold rules"
            />
            <SummaryCard 
              title="Medical Validity" 
              value={summaryData.medicalValidity} 
              icon={<FaHeartbeat />}
              subtitle="Configure validity and threshold rules"
            />
            <SummaryCard 
              title="Incident Tracking" 
              value={summaryData.incidentTracking} 
              icon={<FaExclamationTriangle />}
              subtitle="Configure validity and threshold rules"
            />
            <SummaryCard 
              title="Ethics Violations" 
              value={summaryData.ethicsViolations} 
              icon={<FaBalanceScale />}
              subtitle="Configure validity and threshold rules"
            />
          </div>

          {/* CATEGORIES TABLE */}
          <div className="compliance-card mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-3">
              <div>
                <h4>Compliance Categories</h4>
                <p className="subtext mb-0">Manage compliance categories and their configurations</p>
              </div>
              <div className="d-flex gap-2 flex-wrap">
                <input
                  type="text"
                  className="form-control"
                  placeholder={editingCategory ? "Edit category name" : "Enter category name"}
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  style={{ width: '250px' }}
                  disabled={categoryLoading}
                />
                {editingCategory ? (
                  <>
                    <button
                      className="btn btn-success"
                      onClick={handleUpdateCategory}
                      disabled={categoryLoading}
                    >
                      {categoryLoading ? 'Updating...' : <><FaSave /> Update</>}
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={handleCancelEdit}
                      disabled={categoryLoading}
                    >
                      <FaTimes /> Cancel
                    </button>
                  </>
                ) : (
                  <button
                    className="btn btn-primary"
                    onClick={handleAddCategory}
                    disabled={categoryLoading}
                  >
                    {categoryLoading ? 'Adding...' : <><FaPlus /> Add Category</>}
                  </button>
                )}
              </div>
            </div>

            <div className="table-responsive">
              <table className="table compliance-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Category Name</th>
                    <th>Total Rules</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.length > 0 ? (
                    categories.map((category) => {
                      const categoryId = category.id || category.category_id;
                      const ruleCount = complianceRules.filter(rule => rule.category === categoryId).length;
                      
                      return (
                        <tr key={categoryId}>
                          <td>{categoryId}</td>
                          <td>
                            <div className="category-name">
                              {getIcon(categoryId)}
                              <span className="ms-2">{category.category_name}</span>
                            </div>
                          </td>
                          <td>
                            <span className="badge bg-info">{ruleCount} Rules</span>
                          </td>
                          <td>
                            <span className="badge bg-success">Active</span>
                          </td>
                          <td>
                            <button 
                              className="btn btn-sm btn-outline-secondary me-2"
                              onClick={() => handleStartEdit(categoryId, category.category_name)}
                              title="Edit Category"
                              disabled={editingCategory !== null}
                            >
                              <FaEdit /> Edit
                            </button>
                            <button 
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDeleteCategory(categoryId, category.category_name)}
                              title="Delete Category"
                              disabled={ruleCount > 0 || editingCategory !== null}
                            >
                              <FaTrash /> Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center">
                        <p className="mb-0">No categories found. Enter a category name above to create one.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* RULES CARDS - Grouped by Category */}
          {loading ? (
            <div className="text-center mt-5">
              <div className="spinner-border text-primary" />
              <p className="mt-2">Loading compliance rules...</p>
            </div>
          ) : (
            <div className="row g-4 mt-1">
              {Object.keys(groupedRules).length > 0 ? (
                Object.keys(groupedRules).map((categoryId) => (
                  <RuleCard
                    key={categoryId}
                    title={getCategoryTitle(categoryId)}
                    icon={getIcon(categoryId)}
                    rules={groupedRules[categoryId]}
                    onEdit={handleEditRule}
                    onDelete={handleDeleteRule}
                    formatRules={formatRules}
                    deletingId={deletingId}
                  />
                ))
              ) : (
                <div className="col-12 text-center mt-4">
                  <div className="compliance-card">
                    <p className="mb-0">No compliance rules found. Click "Add Compliance Rule" to create one.</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* RECENT INCIDENTS TABLE */}
          <div className="compliance-card mt-4">
            <h4>Recent Incidents</h4>
            <p className="subtext">Track and manage compliance incidents</p>

            <table className="table compliance-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Candidate</th>
                  <th>Date</th>
                  <th>Severity</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <IncidentRow
                  type="Safety Violation"
                  name="John Smith"
                  date="2024-01-28"
                  severity="medium"
                  status="investigating"
                />
                <IncidentRow
                  type="Medical Expiry"
                  name="Sarah Johnson"
                  date="2024-01-25"
                  severity="high"
                  status="open"
                />
                <IncidentRow
                  type="Documentation Issue"
                  name="Mike Chen"
                  date="2024-01-20"
                  severity="low"
                  status="resolved"
                />
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

/* COMPONENTS - Updated to match the image layout */
const SummaryCard = ({ title, value, icon, subtitle }) => (
  <div className="col-lg-3 col-md-6">
    <div className="compliance-card summary-card">
      <div className="summary-icon">{icon}</div>
      <div className="summary-content">
        <h4>{title}</h4>
        <p className="summary-subtitle">{subtitle || "Configure validity and threshold rules"}</p>
        <div className="summary-value">
          <span className="value-number">{value}</span>
          <span className="value-label">Active Rules</span>
        </div>
      </div>
    </div>
  </div>
);

const RuleCard = ({ title, icon, rules, onEdit, onDelete, formatRules, deletingId }) => {
  return (
    <div className="col-lg-6">
      {/* <div className="compliance-card rule-card"> */}
        {/* <div className="rule-header">
          <div className="rule-icon">{icon}</div>
          <div>
            <h5>{title}</h5>
            <p>Configure validity and threshold rules</p>
          </div>
        </div> */}

        {rules.map((rule) => {
          const formattedRules = formatRules(rule);
          const isDeleting = deletingId === rule.id;
          
          return (
            <div key={rule.id} className="rule-item-wrapper">
              <div className="rule-name-section">
                <div className="rule-name-wrapper">
                  <span className="rule-name">{rule.name || rule.rule_name || title}</span>
                  <div className="rule-status-badges">
                    <span className={`badge ${rule.is_active !== false ? 'bg-success' : 'bg-secondary'}`}>
                      {rule.is_active !== false ? 'Active' : 'Inactive'}
                    </span>
                    <span className={`badge ${rule.is_mandatory ? 'bg-danger' : 'bg-info'}`}>
                      {rule.is_mandatory ? 'Mandatory' : 'Optional'}
                    </span>
                    <span className="badge bg-primary">Priority: {rule.priority || 1}</span>
                  </div>
                </div>
                <div className="rule-actions">
                  <button 
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => onEdit(rule.id)}
                    title="Edit Rule"
                    disabled={isDeleting}
                  >
                    <FaEdit /> Edit
                  </button>
                  <button 
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => onDelete(rule.id, rule.name || rule.rule_name || title)}
                    title="Delete Rule"
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    ) : (
                      <>
                        <FaTrash /> Delete
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              {formattedRules.map((formattedRule, idx) => (
                <div className="rule-row" key={idx}>
                  <span className="rule-label">{formattedRule.label}</span>
                  <div className="rule-input">
                    <strong>{formattedRule.value}</strong>
                    <small>{formattedRule.unit}</small>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    // </div>
  );
};

const IncidentRow = ({ type, name, date, severity, status }) => (
  <tr>
    <td>{type}</td>
    <td>{name}</td>
    <td>{date}</td>
    <td>
      <span className={`pill severity ${severity}`}>{severity}</span>
    </td>
    <td>
      <span className={`pill status ${status}`}>{status}</span>
    </td>
    <td>
      <button className="btn btn-outline-primary btn-sm">View</button>
    </td>
  </tr>
);

export default ComplianceManagement;