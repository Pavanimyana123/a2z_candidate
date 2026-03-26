import React, { useState, useEffect } from "react";
import CandidateSidebar from "../Layout/CandidateSidebar";
import Header from "../Layout/CandidateHeader";
import {
  FaClock,
  FaCheckCircle,
  FaCamera,
  FaPlus,
  FaSearch,
  FaMapMarkerAlt,
  FaShip,
  FaCalendarAlt,
  FaSpinner,
  FaFile,
  FaEdit,
  FaTrash
} from "react-icons/fa";
import "./CandidateDigitalLogBox.css";
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from "../../../ApiUrl";
import Swal from 'sweetalert2';

const CandidateDigitalLogbook = () => {
  const navigate = useNavigate();
  const [logEntries, setLogEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [stats, setStats] = useState({
    totalHours: 0,
    validatedHours: 0,
    pendingCount: 0,
    totalPhotos: 0
  });

  useEffect(() => {
    fetchLogEntries();
  }, []);

  const fetchLogEntries = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/api/candidate/digital-logbook/`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: "include"
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.status && result.data) {
        setLogEntries(result.data);
        calculateStats(result.data);
        console.log('✅ Logbook entries fetched successfully:', result.data);
      } else {
        throw new Error(result.message || 'Failed to fetch logbook entries');
      }
    } catch (err) {
      console.error('Error fetching logbook entries:', err);
      Swal.fire({
        icon: 'error',
        title: 'Failed to Load Entries',
        text: err.message || 'An error occurred while loading logbook entries',
        timer: 3000,
        showConfirmButton: true
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (entryId) => {
    navigate(`/candidate/logbook/edit/${entryId}`);
  };

  const handleDelete = async (entryId, entryTitle) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete "${entryTitle}". This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`${BASE_URL}/api/candidate/digital-logbook/${entryId}/`, {
          method: 'DELETE',
          headers: {
            'Accept': 'application/json',
          },
          credentials: "include"
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Logbook entry has been deleted successfully.',
          timer: 2000,
          showConfirmButton: false
        });

        // Refresh the list after deletion
        fetchLogEntries();
      } catch (err) {
        console.error('Error deleting entry:', err);
        Swal.fire({
          icon: 'error',
          title: 'Delete Failed',
          text: err.message || 'Failed to delete logbook entry.',
          showConfirmButton: true
        });
      }
    }
  };

  const calculateStats = (entries) => {
    let totalHours = 0;
    let validatedHours = 0;
    let pendingCount = 0;
    let totalPhotos = 0;

    entries.forEach(entry => {
      // Calculate total hours from the total_hours field or from duration components
      if (entry.total_hours) {
        totalHours += entry.total_hours;
      } else {
        // Fallback calculation if total_hours not provided
        const hours = (entry.months * 30 * 24) + (entry.weeks * 7 * 24) + (entry.days * 24) + entry.hours + (entry.minutes / 60);
        totalHours += hours;
      }

      // Calculate validated hours (assuming verified entries)
      if (entry.verification_status === 'verified') {
        validatedHours += entry.total_hours || 0;
      }

      // Count pending entries
      if (entry.verification_status === 'pending') {
        pendingCount++;
      }

      // Count evidence files
      if (entry.photo_files && Array.isArray(entry.photo_files)) {
        totalPhotos += entry.photo_files.length;
      }
      if (entry.evidence_files && Array.isArray(entry.evidence_files)) {
        totalPhotos += entry.evidence_files.length;
      }
    });

    setStats({
      totalHours: Math.round(totalHours),
      validatedHours: Math.round(validatedHours),
      pendingCount: pendingCount,
      totalPhotos: totalPhotos
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Function to calculate total hours from entry
  const getTotalHours = (entry) => {
    if (entry.total_hours) {
      return Math.round(entry.total_hours);
    } else {
      const hours = (entry.months * 30 * 24) + (entry.weeks * 7 * 24) + (entry.days * 24) + entry.hours + (entry.minutes / 60);
      return Math.round(hours);
    }
  };

  const getFileCount = (entry) => {
    let count = 0;
    if (entry.photo_files && entry.photo_files.length) count += entry.photo_files.length;
    if (entry.video_files && entry.video_files.length) count += entry.video_files.length;
    if (entry.document_files && entry.document_files.length) count += entry.document_files.length;
    if (entry.evidence_files && entry.evidence_files.length) count += entry.evidence_files.length;
    return count;
  };

  const filteredEntries = logEntries.filter(entry => {
    // Search filter
    const matchesSearch = searchTerm === "" || 
      entry.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.work_description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.work_location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.ship_name?.toLowerCase().includes(searchTerm.toLowerCase());

    // Status filter
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "validated" && entry.verification_status === "verified") ||
      (statusFilter === "pending" && entry.verification_status === "pending");

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="ta-layout-wrapper">
        <CandidateSidebar />
        <div className="ta-main-wrapper">
          <Header />
          <div className="ta-content-area">
            <div className="container-fluid cdl-wrapper">
              <div className="text-center p-5">
                <FaSpinner className="fa-spin fa-3x" />
                <p className="mt-2">Loading logbook entries...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ta-layout-wrapper">
      <CandidateSidebar />

      <div className="ta-main-wrapper">
        <Header />

        <div className="ta-content-area">
          <div className="container-fluid cdl-wrapper">

            {/* ================= HEADER ================= */}
            <div className="d-flex justify-content-between align-items-start mb-4">
              <div>
                <h3 className="cdl-title">Digital Logbook</h3>
                <p className="cdl-subtitle">
                  Record and track your field activities and evidence
                </p>
              </div>
              <button 
                className="btn cdl-primary-btn"
                onClick={() => navigate('/candidate/logbook/add')}
              >
                <FaPlus /> New Entry
              </button>
            </div>

            {/* ================= STATS ================= */}
            <div className="row g-4 mb-4">
              <StatCard 
                icon={<FaClock />} 
                value={`${stats.totalHours}h`} 
                label="Total Hours" 
              />
              <StatCard 
                icon={<FaCheckCircle />} 
                value={`${stats.validatedHours}h`} 
                label="Validated" 
                success 
              />
              <StatCard 
                icon={<FaClock />} 
                value={stats.pendingCount} 
                label="Pending Review" 
                warning 
              />
              <StatCard 
                icon={<FaCamera />} 
                value={stats.totalPhotos} 
                label="Evidence Items" 
                info 
              />
            </div>

            {/* ================= SEARCH & FILTER ================= */}
            <div className="row g-3 mb-4">
              <div className="col-lg-9">
                <div className="cdl-search">
                  <FaSearch />
                  <input 
                    placeholder="Search entries by title, description, location..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-lg-3">
                <select 
                  className="form-select cdl-filter"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Entries</option>
                  <option value="validated">Validated</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>

            {/* ================= LOG ENTRIES ================= */}
            {filteredEntries.length === 0 ? (
              <div className="text-center p-5">
                <p className="text-muted">No logbook entries found.</p>
                <button 
                  className="btn cdl-primary-btn mt-2"
                  onClick={() => navigate('/candidate/logbook/add')}
                >
                  <FaPlus /> Create Your First Entry
                </button>
              </div>
            ) : (
              filteredEntries.map((entry) => (
                <LogEntry
                  key={entry.id}
                  id={entry.id}
                  title={entry.title || "Untitled Entry"}
                  status={entry.verification_status === "verified" ? "validated" : "pending"}
                  totalHours={getTotalHours(entry)}
                  desc={entry.work_description || entry.description || "No description provided"}
                  location={entry.work_location || "Location not specified"}
                  asset={entry.ship_name || "Asset not specified"}
                  startDate={formatDate(entry.start_date)}
                  endDate={formatDate(entry.end_date)}
                  fileCount={getFileCount(entry)}
                  onView={() => navigate(`/candidate/logbook/${entry.id}`)}
                  onEdit={() => handleEdit(entry.id)}
                  onDelete={() => handleDelete(entry.id, entry.title)}
                />
              ))
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

/* ================= SUB COMPONENTS ================= */

const StatCard = ({ icon, value, label, success, warning, info }) => (
  <div className="col-xl-3 col-md-6">
    <div className="cdl-stat-card">
      <div className={`cdl-stat-icon ${success ? "ok" : warning ? "warn" : info ? "info" : ""}`}>
        {icon}
      </div>
      <h3>{value}</h3>
      <p>{label}</p>
    </div>
  </div>
);

const LogEntry = ({ id, title, status, totalHours, desc, location, asset, startDate, endDate, fileCount, onView, onEdit, onDelete }) => (
  <div className="cdl-log-card">
    <div className="d-flex justify-content-between align-items-start">
      <div className="flex-grow-1" onClick={onView} style={{ cursor: 'pointer' }}>
        <div className="d-flex align-items-center gap-2 mb-2">
          <h5 className="mb-0">{title}</h5>
          <span className={`cdl-badge ${status}`}>
            {status === "validated" ? "Validated" : "Pending"}
          </span>
        </div>
        <p className="cdl-desc">{desc}</p>

        <div className="cdl-meta">
          {location && (
            <span><FaMapMarkerAlt /> {location}</span>
          )}
          {asset && (
            <span><FaShip /> {asset}</span>
          )}
          {startDate && endDate && (
            <span><FaCalendarAlt /> {startDate} - {endDate}</span>
          )}
          <span>
            {fileCount > 0 ? <FaCamera /> : <FaFile />} 
            {fileCount} {fileCount === 1 ? 'file' : 'files'}
          </span>
        </div>
      </div>

      <div className="text-end">
        <h4>{totalHours}h</h4>
        <span className="cdl-muted">total hours</span>
        <div className="cdl-action-buttons">
          <button 
            className="cdl-action-btn cdl-edit-btn"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            title="Edit entry"
          >
            <FaEdit />
          </button>
          <button 
            className="cdl-action-btn cdl-delete-btn"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            title="Delete entry"
          >
            <FaTrash />
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default CandidateDigitalLogbook;