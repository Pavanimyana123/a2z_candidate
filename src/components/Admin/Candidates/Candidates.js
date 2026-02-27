import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Layout/Sidebar";
import Header from "../Layout/Header";
import "./Candidates.css";
import { FaSearch, FaFilter, FaEdit, FaTrash, FaEllipsisH } from "react-icons/fa";
import Swal from 'sweetalert2';

const Candidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState("All Levels");
  const [statusFilter, setStatusFilter] = useState("All Status");
  
  const navigate = useNavigate();

  // Fetch candidates data
  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://145.79.0.94:8000/candidates/');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.status && result.data) {
        setCandidates(result.data);
      } else {
        throw new Error(result.message || 'Failed to fetch candidates');
      }
      
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching candidates:', err);
      
      Swal.fire({
        icon: 'error',
        title: 'Failed to Load Candidates',
        text: err.message || 'An error occurred while fetching candidates',
        timer: 3000,
        showConfirmButton: true
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddCandidate = () => {
    navigate('/add-candidate');
  };

  const handleEdit = (candidateId) => {
    navigate(`/add-candidate/${candidateId}`);
  };

  const handleDelete = async (candidateId, candidateName) => {
    try {
      const response = await fetch(`http://145.79.0.94:8000/candidates/${candidateId}/`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Refresh the candidates list
      await fetchCandidates();
      
      // Show success message
      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: `${candidateName} has been deleted successfully.`,
        timer: 2000,
        showConfirmButton: false
      });
      
    } catch (err) {
      console.error('Error deleting candidate:', err);
      
      Swal.fire({
        icon: 'error',
        title: 'Delete Failed',
        text: 'Failed to delete candidate. Please try again.',
        timer: 3000,
        showConfirmButton: true
      });
    }
  };

  const confirmDelete = (candidate) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete ${candidate.full_name}. This action cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete(candidate.candidate_id, candidate.full_name);
      }
    });
  };

  // Filter candidates based on search and filters
  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.phone_number?.includes(searchTerm);
    
    const matchesLevel = levelFilter === "All Levels" || 
                        candidate.current_level.toString() === levelFilter;
    
    const candidateStatus = candidate.safety_induction_status ? "active" : "blocked";
    const matchesStatus = statusFilter === "All Status" || 
                         candidateStatus === statusFilter.toLowerCase();
    
    return matchesSearch && matchesLevel && matchesStatus;
  });

  // Get unique levels for filter dropdown
  const uniqueLevels = [...new Set(candidates.map(c => c.current_level))].sort();

  return (
    <div className="ta-layout-wrapper">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Area */}
      <div className="ta-main-wrapper">
        {/* Header */}
        <Header />

        {/* Content */}
        <div className="ta-content-area">
          <div className="candidates-wrapper">

            {/* Page Header */}
            <div className="candidates-header">
              <div>
                <h2>Candidate Management</h2>
                <p>View and manage all training candidates ({candidates.length} total)</p>
              </div>

              <button onClick={handleAddCandidate} className="btn btn-primary candidates-add-btn">
                Add Candidate
              </button>
            </div>

            {/* Filters */}
            <div className="candidates-filters-box">
              <div className="candidates-filters">

                <div className="candidates-search">
                  <FaSearch />
                  <input 
                    type="text" 
                    placeholder="Search candidates..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <select 
                  className="candidates-select"
                  value={levelFilter}
                  onChange={(e) => setLevelFilter(e.target.value)}
                >
                  <option>All Levels</option>
                  {uniqueLevels.map(level => (
                    <option key={level} value={level}>Level {level}</option>
                  ))}
                </select>

                <select 
                  className="candidates-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option>All Status</option>
                  <option value="active">Active</option>
                  <option value="blocked">Blocked</option>
                </select>

                <button className="candidates-filter-btn" onClick={fetchCandidates}>
                  <FaFilter />
                </button>

              </div>
            </div>

            {/* Loading and Error States */}
            {loading && (
              <div className="candidates-loading">
                <p>Loading candidates...</p>
              </div>
            )}

            {error && (
              <div className="candidates-error">
                <p>Error: {error}</p>
                <button onClick={fetchCandidates} className="btn btn-secondary">
                  Retry
                </button>
              </div>
            )}

            {/* Table */}
            {!loading && !error && (
              <div className="candidates-table-wrapper">
                <table className="table candidates-table">
                  <thead>
                    <tr>
                      <th>Candidate Name</th>
                      <th>Level</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>City</th>
                      <th>Blood Group</th>
                      <th>Medical Expiry</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredCandidates.length > 0 ? (
                      filteredCandidates.map((candidate) => (
                        <CandidateRow 
                          key={candidate.candidate_id}
                          candidate={candidate}
                          onEdit={handleEdit}
                          onDelete={confirmDelete}
                        />
                      ))
                    ) : (
                      <tr>
                        <td colSpan="9" className="text-center">
                          No candidates found
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
const CandidateRow = ({ candidate, onEdit, onDelete }) => {
  // Format date if needed
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Determine status based on safety_induction_status
  const status = candidate.safety_induction_status ? 'active' : 'blocked';
  
  // For compliance, you can use medical_expiry_date logic
  const today = new Date();
  const medicalExpiry = candidate.medical_expiry_date ? new Date(candidate.medical_expiry_date) : null;
  const compliance = medicalExpiry && medicalExpiry > today ? 'compliant' : 'noncompliant';

  return (
    <tr>
      <td className="candidates-name">{candidate.full_name}</td>
      <td>
        <span className="candidates-level">{candidate.current_level}</span>
      </td>
      <td>{candidate.email}</td>
      <td>{candidate.phone_number || 'N/A'}</td>
      <td>{candidate.city || 'N/A'}</td>
      <td>{candidate.blood_group || 'N/A'}</td>
      <td>{formatDate(candidate.medical_expiry_date)}</td>
      <td>
        <span className={`candidates-pill ${status}`}>
          {status === 'active' ? 'Active' : 'Blocked'}
        </span>
      </td>
      <td>
        <div className="action-icons">
          <FaEdit 
            className="candidates-action-icon edit-icon" 
            onClick={() => onEdit(candidate.candidate_id)}
            title="Edit"
          />
          <FaTrash 
            className="candidates-action-icon delete-icon" 
            onClick={() => onDelete(candidate)}
            title="Delete"
          />
        </div>
      </td>
    </tr>
  );
};

export default Candidates;