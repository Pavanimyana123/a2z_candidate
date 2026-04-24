import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Layout/Sidebar";
import Header from "../Layout/Header";
import "./Announcements.css";
import { FaSearch, FaFilter, FaEdit, FaTrash } from "react-icons/fa";
import Swal from 'sweetalert2';
import { BASE_URL } from "../../../ApiUrl";

// Dummy data for development/fallback
const DUMMY_ANNOUNCEMENTS = [
  {
    id: 1,
    title: "New Training Module Available",
    content: "We are excited to announce the launch of our new Advanced Safety Training module. All candidates are required to complete this module by the end of the month.",
    target_audience: "candidates",
    is_active: true,
    priority: "high",
    created_at: "2024-01-15T09:30:00Z",
    expiry_date: "2024-03-15T00:00:00Z"
  },
  {
    id: 2,
    title: "Mentor Workshop Schedule",
    content: "All mentors are invited to attend the quarterly workshop on January 25th, 2024. The workshop will cover new teaching methodologies and assessment techniques.",
    target_audience: "mentors",
    is_active: true,
    priority: "normal",
    created_at: "2024-01-10T14:15:00Z",
    expiry_date: "2024-01-25T00:00:00Z"
  },
  {
    id: 3,
    title: "System Maintenance Notice",
    content: "The training platform will undergo scheduled maintenance on Sunday, January 21st, from 2:00 AM to 6:00 AM EST. The system may be temporarily unavailable during this time.",
    target_audience: "all",
    is_active: true,
    priority: "urgent",
    created_at: "2024-01-18T11:00:00Z",
    expiry_date: "2024-01-22T00:00:00Z"
  }
];

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [useDummyData, setUseDummyData] = useState(false); // Track if using dummy data
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      setUseDummyData(false);
      
      const response = await fetch(`${BASE_URL}/api/admin/announcements/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      console.log('Announcements API Response:', result);
      
      let fetchedData = [];
      if (result.status && result.data) {
        fetchedData = result.data;
      } else if (Array.isArray(result)) {
        fetchedData = result;
      }
      
      // If no data from API, use dummy data
      if (fetchedData.length === 0) {
        console.log('No announcements from API, loading dummy data...');
        setAnnouncements(DUMMY_ANNOUNCEMENTS);
        setUseDummyData(true);
      } else {
        setAnnouncements(fetchedData);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching announcements:', err);
      console.log('Loading dummy data as fallback...');
      
      // Use dummy data as fallback when API fails
      setAnnouncements(DUMMY_ANNOUNCEMENTS);
      setUseDummyData(true);
      setError(null); // Don't show error when using dummy data
      
      // Optional: Show a subtle notification that dummy data is being used
      Swal.fire({
        icon: 'info',
        title: 'Using Demo Data',
        text: 'Showing sample announcements for development purposes.',
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddAnnouncement = () => {
    navigate('/add-announcement');
  };

  const handleEdit = (announcementId) => {
    navigate(`/add-announcement/${announcementId}`);
  };

  const handleDelete = async (announcementId, title) => {
    // If using dummy data, handle deletion locally
    if (useDummyData) {
      setAnnouncements(prev => prev.filter(item => item.id !== announcementId));
      
      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: `"${title}" has been deleted successfully.`,
        timer: 2000,
        showConfirmButton: false
      });
      return;
    }

    // Otherwise, delete from API
    try {
      const response = await fetch(`${BASE_URL}/api/admin/announcements/${announcementId}/`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await fetchAnnouncements();
      
      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: `"${title}" has been deleted successfully.`,
        timer: 2000,
        showConfirmButton: false
      });
      
    } catch (err) {
      console.error('Error deleting announcement:', err);
      
      Swal.fire({
        icon: 'error',
        title: 'Delete Failed',
        text: 'Failed to delete announcement. Please try again.',
        timer: 3000,
        showConfirmButton: true
      });
    }
  };

  const confirmDelete = (announcement) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete "${announcement.title}". This action cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete(announcement.id, announcement.title);
      }
    });
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
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

  // Filter announcements
  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = searchTerm === "" || 
      (announcement.title && announcement.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (announcement.content && announcement.content.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const isActive = announcement.is_active ? "active" : "inactive";
    const matchesStatus = statusFilter === "All Status" || isActive === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="ta-layout-wrapper">
      <Sidebar />
      <div className="ta-main-wrapper">
        <Header />
        <div className="ta-content-area">
          <div className="announcements-wrapper">
            {/* Page Header */}
            <div className="announcements-header">
              <div>
                <h2>Announcements Management</h2>
                <p>Create and manage announcements ({announcements.length} total)</p>
                {useDummyData && (
                  <small className="text-info">
                    <i className="fas fa-info-circle"></i> Currently showing demo data
                  </small>
                )}
              </div>
              <button onClick={handleAddAnnouncement} className="btn btn-primary announcements-add-btn">
                Add Announcement
              </button>
            </div>

            {/* Filters */}
            <div className="announcements-filters-box">
              <div className="announcements-filters">
                <div className="announcements-search">
                  <FaSearch />
                  <input 
                    type="text" 
                    placeholder="Search announcements..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <select 
                  className="announcements-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="All Status">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>

                <button className="announcements-filter-btn" onClick={fetchAnnouncements}>
                  <FaFilter />
                </button>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="announcements-loading text-center p-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Loading announcements...</p>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="announcements-error alert alert-danger">
                <p>Error: {error}</p>
                <button onClick={fetchAnnouncements} className="btn btn-primary mt-2">
                  Retry
                </button>
              </div>
            )}

            {/* Table */}
            {!loading && !error && (
              <div className="announcements-table-wrapper">
                <table className="table announcements-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Content</th>
                      <th>Target Audience</th>
                      <th>Created Date</th>
                      <th>Priority</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAnnouncements.length > 0 ? (
                      filteredAnnouncements.map((announcement) => (
                        <AnnouncementRow 
                          key={announcement.id}
                          announcement={announcement}
                          formatDate={formatDate}
                          onEdit={handleEdit}
                          onDelete={confirmDelete}
                        />
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center py-4">
                          No announcements found
                          {searchTerm && (
                            <div>
                              <button 
                                className="btn btn-link mt-2"
                                onClick={() => setSearchTerm('')}
                              >
                                Clear Search
                              </button>
                            </div>
                          )}
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
const AnnouncementRow = ({ announcement, formatDate, onEdit, onDelete }) => {
  // Truncate content for display
  const truncateContent = (content, maxLength = 100) => {
    if (!content) return 'N/A';
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const status = announcement.is_active ? 'active' : 'inactive';
  
  // Get priority badge color
  const getPriorityBadge = (priority) => {
    const badges = {
      urgent: { bg: '#fee2e2', color: '#dc2626', label: 'Urgent' },
      high: { bg: '#fff7ed', color: '#f97316', label: 'High' },
      normal: { bg: '#e0e7ff', color: '#4f46e5', label: 'Normal' },
      low: { bg: '#f3f4f6', color: '#6b7280', label: 'Low' }
    };
    return badges[priority] || badges.normal;
  };

  const priorityBadge = getPriorityBadge(announcement.priority);

  // Format target audience for display
  const getAudienceLabel = (audience) => {
    const labels = {
      all: 'All Users',
      candidates: 'Candidates',
      mentors: 'Mentors',
      admins: 'Admins'
    };
    return labels[audience] || audience;
  };

  return (
    <tr>
      <td className="announcements-title">
        {announcement.title || 'N/A'}
      </td>
      <td className="announcements-content">
        {truncateContent(announcement.content)}
      </td>
      <td>
        <span className="announcements-audience">
          {getAudienceLabel(announcement.target_audience)}
        </span>
      </td>
      <td>{formatDate(announcement.created_at)}</td>
      <td>
        <span 
          className="announcements-priority-badge"
          style={{
            backgroundColor: priorityBadge.bg,
            color: priorityBadge.color,
            padding: '4px 12px',
            borderRadius: '999px',
            fontSize: '12px',
            fontWeight: '600'
          }}
        >
          {priorityBadge.label}
        </span>
      </td>
      <td>
        <span className={`announcements-pill ${status}`}>
          {status === 'active' ? 'Active' : 'Inactive'}
        </span>
      </td>
      <td>
        <div className="action-icons">
          <FaEdit 
            className="announcements-action-icon edit-icon" 
            onClick={() => onEdit(announcement.id)}
            title="Edit Announcement"
            style={{ cursor: 'pointer', marginRight: '10px', color: '#4a6cf7' }}
          />
          <FaTrash 
            className="announcements-action-icon delete-icon" 
            onClick={() => onDelete(announcement)}
            title="Delete Announcement"
            style={{ cursor: 'pointer', color: '#dc3545' }}
          />
        </div>
      </td>
    </tr>
  );
};

export default Announcements;