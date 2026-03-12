import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Layout/Sidebar";
import Header from "../Layout/Header";
import "./EmailSettings.css";
import { FaSearch, FaFilter, FaEdit, FaTrash, FaEnvelope, FaPlus, FaServer, FaClock, FaChartBar } from "react-icons/fa";
import Swal from 'sweetalert2';
import { BASE_URL } from "../../../ApiUrl";

const EmailSettings = () => {
  const [emailSettings, setEmailSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  
  const navigate = useNavigate();

  // Fetch email settings data
  useEffect(() => {
    fetchEmailSettings();
  }, []);

  const fetchEmailSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/api/admin/host-mails/`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('API Response:', result);
      
      if (result.status && result.data) {
        setEmailSettings(result.data);
      } else {
        setEmailSettings([]);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching email settings:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmailSetting = () => {
    navigate('/add-email-settings');
  };

  const handleEdit = (hostId) => {
    navigate(`/add-email-settings/${hostId}`);
  };

  const handleDelete = async (hostId, hostName) => {
    try {
      const response = await fetch(`${BASE_URL}/api/admin/host-mails/${hostId}/`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await fetchEmailSettings();
      
      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: `${hostName} has been deleted successfully.`,
        timer: 2000,
        showConfirmButton: false
      });
      
    } catch (err) {
      console.error('Error deleting email setting:', err);
      
      Swal.fire({
        icon: 'error',
        title: 'Delete Failed',
        text: 'Failed to delete email setting. Please try again.',
        timer: 3000,
        showConfirmButton: true
      });
    }
  };

  const handleToggleStatus = async (setting) => {
    try {
      const newStatus = setting.status === 'active' ? 'inactive' : 'active';
      
      const response = await fetch(`${BASE_URL}/api/admin/host-mails/${setting.host_id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await fetchEmailSettings();
      
      Swal.fire({
        icon: 'success',
        title: 'Updated!',
        text: `${setting.host_name} has been ${newStatus === 'active' ? 'activated' : 'deactivated'}.`,
        timer: 2000,
        showConfirmButton: false
      });
      
    } catch (err) {
      console.error('Error toggling status:', err);
      
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'Failed to update status. Please try again.',
        timer: 3000,
        showConfirmButton: true
      });
    }
  };

  const confirmDelete = (setting) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete ${setting.host_name}. This action cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete(setting.host_id, setting.host_name);
      }
    });
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'active':
        return 'active';
      case 'inactive':
        return 'inactive';
      case 'maintenance':
        return 'maintenance';
      case 'suspended':
        return 'suspended';
      default:
        return 'inactive';
    }
  };

  // Get status display text
  const getStatusDisplay = (status) => {
    switch(status) {
      case 'active':
        return 'Active';
      case 'inactive':
        return 'Inactive';
      case 'maintenance':
        return 'Under Maintenance';
      case 'suspended':
        return 'Suspended';
      default:
        return status;
    }
  };

  // Filter email settings based on search and filters
  const filteredSettings = emailSettings.filter(setting => {
    const matchesSearch = searchTerm === "" || 
      (setting.host_name && setting.host_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (setting.host_email && setting.host_email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (setting.smtp_server && setting.smtp_server.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === "All Status" || setting.status === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  // Get unique statuses for filter dropdown
  const uniqueStatuses = [...new Set(emailSettings.map(s => s.status))].filter(Boolean);

  return (
    <div className="ta-layout-wrapper">
      <Sidebar />
      <div className="ta-main-wrapper">
        <Header />
        <div className="ta-content-area">
          <div className="email-settings-wrapper">
            {/* Page Header */}
            <div className="email-settings-header">
              <div>
                <h2>SMTP Host Settings</h2>
                <p>Configure and manage SMTP host connections ({emailSettings.length} total)</p>
              </div>
              <button onClick={handleAddEmailSetting} className="btn btn-primary email-settings-add-btn">
                <FaPlus /> Add SMTP Host
              </button>
            </div>

            {/* Filters */}
            <div className="email-settings-filters-box">
              <div className="email-settings-filters">
                <div className="email-settings-search">
                  <FaSearch />
                  <input 
                    type="text" 
                    placeholder="Search by host name, email or server..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <select 
                  className="email-settings-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="All Status">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="maintenance">Under Maintenance</option>
                  <option value="suspended">Suspended</option>
                </select>

                <button className="email-settings-filter-btn" onClick={fetchEmailSettings}>
                  <FaFilter />
                </button>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="email-settings-loading">
                <p>Loading SMTP hosts...</p>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="email-settings-error">
                <p>Error: {error}</p>
                <button onClick={fetchEmailSettings} className="btn btn-secondary">
                  Retry
                </button>
              </div>
            )}

            {/* Table */}
            {!loading && !error && (
              <div className="email-settings-table-wrapper">
                <table className="table email-settings-table">
                  <thead>
                    <tr>
                      <th>Host Name</th>
                      <th>Email</th>
                      <th>SMTP Server</th>
                      <th>Port</th>
                      <th>Limits</th>
                      {/* <th>Usage</th> */}
                      {/* <th>Last Used</th> */}
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSettings.length > 0 ? (
                      filteredSettings.map((setting) => (
                        <EmailSettingRow 
                          key={setting.host_id}
                          setting={setting}
                          onEdit={handleEdit}
                          onDelete={confirmDelete}
                          onToggleStatus={handleToggleStatus}
                          getStatusBadgeClass={getStatusBadgeClass}
                          getStatusDisplay={getStatusDisplay}
                        />
                      ))
                    ) : (
                      <tr>
                        <td colSpan="9" className="text-center">
                          No SMTP hosts found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---- Row Component ---- */
const EmailSettingRow = ({ setting, onEdit, onDelete, onToggleStatus, getStatusBadgeClass, getStatusDisplay }) => {
  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  };

  // Check if daily limit is exceeded
  const isDailyLimitExceeded = () => {
    return setting.current_daily_count >= setting.daily_limit;
  };

  // Check if hourly limit is exceeded
  const isHourlyLimitExceeded = () => {
    return setting.current_hourly_count >= setting.hourly_limit;
  };

  return (
    <tr>
      <td className="email-settings-name">
        <div className="d-flex align-items-center">
          <FaServer className="me-2 text-primary" />
          {setting.host_name || 'N/A'}
        </div>
      </td>
      <td>{setting.host_email || 'N/A'}</td>
      <td>
        <code>{setting.smtp_server || 'N/A'}</code>
      </td>
      <td>
        <span className="badge bg-secondary">{setting.smtp_port || 'N/A'}</span>
      </td>
      <td>
        <div className="limits-info">
          <small className="d-block">
            <FaClock className="me-1" /> Daily: {setting.current_daily_count || 0}/{setting.daily_limit || '∞'}
          </small>
          <small className="d-block">
            <FaClock className="me-1" /> Hourly: {setting.current_hourly_count || 0}/{setting.hourly_limit || '∞'}
          </small>
        </div>
      </td>
      {/* <td>
        <div className="usage-indicator">
          {isDailyLimitExceeded() && (
            <span className="badge bg-warning text-dark me-1" title="Daily limit exceeded">D</span>
          )}
          {isHourlyLimitExceeded() && (
            <span className="badge bg-warning text-dark" title="Hourly limit exceeded">H</span>
          )}
          {!isDailyLimitExceeded() && !isHourlyLimitExceeded() && (
            <span className="badge bg-success">OK</span>
          )}
        </div>
      </td> */}
      {/* <td>
        <small className="text-muted">
          {formatDate(setting.last_used_at)}
        </small>
      </td> */}
      <td>
        <span className={`email-settings-pill ${getStatusBadgeClass(setting.status)}`}>
          {getStatusDisplay(setting.status)}
        </span>
      </td>
      <td>
        <div className="action-icons">
          {/* <button 
            className="btn btn-sm btn-outline-primary me-2"
            onClick={() => onToggleStatus(setting)}
            title={setting.status === 'active' ? 'Deactivate' : 'Activate'}
          >
            {setting.status === 'active' ? 'Deactivate' : 'Activate'}
          </button> */}
          <FaEdit 
            className="email-settings-action-icon edit-icon" 
            onClick={() => onEdit(setting.host_id)}
            title="Edit Host"
            style={{ cursor: 'pointer', marginRight: '10px' }}
          />
          <FaTrash 
            className="email-settings-action-icon delete-icon" 
            onClick={() => onDelete(setting)}
            title="Delete Host"
            style={{ cursor: 'pointer', color: '#dc3545' }}
          />
        </div>
      </td>
    </tr>
  );
};

export default EmailSettings;