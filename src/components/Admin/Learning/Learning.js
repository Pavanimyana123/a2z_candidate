import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Layout/Sidebar";
import Header from "../Layout/Header";
import "./Learning.css";
import { FaSearch, FaFilter, FaEdit, FaTrash, FaBook, FaClock, FaCheckCircle, FaHourglassHalf } from "react-icons/fa";
import Swal from 'sweetalert2';
import { BASE_URL } from "../../../ApiUrl";

const Learning = () => {
  const [learnings, setLearnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [statusFilter, setStatusFilter] = useState("All Status");
  
  const navigate = useNavigate();

  // Fetch learning data
  useEffect(() => {
    fetchLearnings();
  }, []);

  const fetchLearnings = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/api/learning/courses/`); // Adjust endpoint as needed
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('API Response:', result);
      
      if (result.status && result.data) {
        setLearnings(result.data);
        console.log('Learnings set:', result.data);
      } else {
        throw new Error(result.message || 'Failed to fetch learning courses');
      }
      
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching learning courses:', err);
      
      Swal.fire({
        icon: 'error',
        title: 'Failed to Load Learning Courses',
        text: err.message || 'An error occurred while fetching learning courses',
        timer: 3000,
        showConfirmButton: true
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddLearning = () => {
    navigate('/add-learning');
  };

  const handleEdit = (learningId) => {
    navigate(`/add-learning/${learningId}`);
  };

  const handleDelete = async (learningId, courseName) => {
    try {
      const response = await fetch(`${BASE_URL}/api/learning/courses/${learningId}/`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Refresh the learning list
      await fetchLearnings();
      
      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: `${courseName} has been deleted successfully.`,
        timer: 2000,
        showConfirmButton: false
      });
      
    } catch (err) {
      console.error('Error deleting learning course:', err);
      
      Swal.fire({
        icon: 'error',
        title: 'Delete Failed',
        text: 'Failed to delete learning course. Please try again.',
        timer: 3000,
        showConfirmButton: true
      });
    }
  };

  const confirmDelete = (learning) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete ${learning.course_name}. This action cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete(learning.learning_id, learning.course_name);
      }
    });
  };

  // Filter learning courses based on search and filters
  const filteredLearnings = learnings.filter(learning => {
    const matchesSearch = searchTerm === "" || 
      (learning.course_name && learning.course_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (learning.instructor && learning.instructor.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (learning.category && learning.category.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = categoryFilter === "All Categories" || 
      (learning.category && learning.category === categoryFilter);
    
    const matchesStatus = statusFilter === "All Status" || 
      (learning.status && learning.status === statusFilter.toLowerCase());
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Get unique categories for filter dropdown
  const uniqueCategories = [...new Set(learnings.map(l => l.category).filter(Boolean))];

  // Status badge component
  const getStatusBadge = (status) => {
    switch(status?.toLowerCase()) {
      case 'active':
        return <span className="learning-pill active">Active</span>;
      case 'inactive':
        return <span className="learning-pill inactive">Inactive</span>;
      case 'draft':
        return <span className="learning-pill draft">Draft</span>;
      default:
        return <span className="learning-pill">Unknown</span>;
    }
  };

  // Get difficulty level badge
  const getDifficultyBadge = (level) => {
    switch(level?.toLowerCase()) {
      case 'beginner':
        return <span className="learning-difficulty beginner">Beginner</span>;
      case 'intermediate':
        return <span className="learning-difficulty intermediate">Intermediate</span>;
      case 'advanced':
        return <span className="learning-difficulty advanced">Advanced</span>;
      default:
        return <span className="learning-difficulty">Not Set</span>;
    }
  };

  return (
    <div className="ta-layout-wrapper">
      <Sidebar />
      <div className="ta-main-wrapper">
        <Header />
        <div className="ta-content-area">
          <div className="learning-wrapper">
            {/* Page Header */}
            <div className="learning-header">
              <div>
                <h2><FaBook className="me-2" /> Learning Management</h2>
                <p>View and manage all learning courses ({learnings.length} total)</p>
              </div>
              <button onClick={handleAddLearning} className="btn btn-primary learning-add-btn">
                Add Learning Course
              </button>
            </div>

            {/* Filters */}
            <div className="learning-filters-box">
              <div className="learning-filters">
                <div className="learning-search">
                  <FaSearch />
                  <input 
                    type="text" 
                    placeholder="Search courses, instructors..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <select 
                  className="learning-select"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="All Categories">All Categories</option>
                  {uniqueCategories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>

                <select 
                  className="learning-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="All Status">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="draft">Draft</option>
                </select>

                <button className="learning-filter-btn" onClick={fetchLearnings}>
                  <FaFilter />
                </button>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="learning-loading">
                <p>Loading learning courses...</p>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="learning-error">
                <p>Error: {error}</p>
                <button onClick={fetchLearnings} className="btn btn-secondary">
                  Retry
                </button>
              </div>
            )}

            {/* Table */}
            {!loading && !error && (
              <div className="learning-table-wrapper">
                <table className="table learning-table">
                  <thead>
                    <tr>
                      <th>Course Name</th>
                      <th>Category</th>
                      <th>Instructor</th>
                      <th>Duration</th>
                      <th>Difficulty</th>
                      <th>Enrolled</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLearnings.length > 0 ? (
                      filteredLearnings.map((learning) => (
                        <LearningRow 
                          key={learning.learning_id}
                          learning={learning}
                          onEdit={handleEdit}
                          onDelete={confirmDelete}
                          getStatusBadge={getStatusBadge}
                          getDifficultyBadge={getDifficultyBadge}
                        />
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="text-center">
                          No learning courses found
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
const LearningRow = ({ learning, onEdit, onDelete, getStatusBadge, getDifficultyBadge }) => {
  // Format duration
  const formatDuration = (hours) => {
    if (!hours) return 'N/A';
    return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
  };

  return (
    <tr>
      <td className="learning-name">
        <div className="learning-info">
          <FaBook className="learning-icon" />
          <div>
            <strong>{learning.course_name || 'N/A'}</strong>
            {learning.code && <small className="d-block text-muted">{learning.code}</small>}
          </div>
        </div>
      </td>
      <td>
        <span className="learning-category">
          {learning.category || 'N/A'}
        </span>
      </td>
      <td>{learning.instructor || 'N/A'}</td>
      <td>
        <span className="learning-duration">
          <FaClock className="me-1" />
          {formatDuration(learning.duration_hours)}
        </span>
      </td>
      <td>{getDifficultyBadge(learning.difficulty_level)}</td>
      <td>
        <span className="learning-enrolled">
          {learning.enrolled_count || 0} students
        </span>
      </td>
      <td>{getStatusBadge(learning.status)}</td>
      <td>
        <div className="learning-action-icons">
          <FaEdit 
            className="learning-action-icon edit-icon" 
            onClick={() => onEdit(learning.learning_id)}
            title="Edit Course"
          />
          <FaTrash 
            className="learning-action-icon delete-icon" 
            onClick={() => onDelete(learning)}
            title="Delete Course"
          />
        </div>
      </td>
    </tr>
  );
};

export default Learning;