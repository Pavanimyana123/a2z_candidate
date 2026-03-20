import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import MentorSidebar from "../Layout/MentorSidebar";
import Header from "../Layout/MentorHeader";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaSpinner,
  FaStar,
  FaChartBar,
  FaArrowLeft,
  FaUserGraduate,
  FaBuilding,
  FaLevelUpAlt,
  FaCheck,
  FaTimes,
  FaSave,
  FaFileAlt,
  FaEdit
} from "react-icons/fa";
import { BASE_URL } from "../../../ApiUrl";
import "./MentorCompetencyReview.css";

const MentorCompetencyReview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { competencyId } = useParams();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [mentorInfo, setMentorInfo] = useState(null);
  const [competencyData, setCompetencyData] = useState(null);
  const [candidateInfo, setCandidateInfo] = useState(null);
  
  // Form state for scores
  const [scores, setScores] = useState({
    technical_knowledge: 0,
    field_execution: 0,
    documentation_quality: 0,
    ethics_independence: 0,
    communication: 0
  });
  
  // Form state for review
  const [reviewComments, setReviewComments] = useState("");
  const [selectedAction, setSelectedAction] = useState(null);

  // Get current mentor from localStorage
  useEffect(() => {
    try {
      const mentorUser = localStorage.getItem('mentor_user');
      if (mentorUser) {
        const parsed = JSON.parse(mentorUser);
        setMentorInfo(parsed);
      }
    } catch (error) {
      console.error('Error parsing mentor_user from localStorage:', error);
    }
  }, []);

  // Get action and candidate info from location state
  useEffect(() => {
    if (location.state) {
      setSelectedAction(location.state.action);
      setCandidateInfo(location.state.candidateInfo);
      
      // If competency data was passed, use it
      if (location.state.competencyData) {
        setCompetencyData(location.state.competencyData);
        // Initialize scores from competency data
        setScores({
          technical_knowledge: location.state.competencyData.technical_knowledge || 0,
          field_execution: location.state.competencyData.field_execution || 0,
          documentation_quality: location.state.competencyData.documentation_quality || 0,
          ethics_independence: location.state.competencyData.ethics_independence || 0,
          communication: location.state.competencyData.communication || 0
        });
        setLoading(false);
      }
    }
  }, [location.state]);

  // Fetch competency data if not passed in state
  useEffect(() => {
    const fetchCompetencyData = async () => {
      if (!competencyId || competencyData) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${BASE_URL}/api/candidate/competencies/${competencyId}/`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.status && result.data) {
          setCompetencyData(result.data);
          // Initialize scores from fetched competency data
          setScores({
            technical_knowledge: result.data.technical_knowledge || 0,
            field_execution: result.data.field_execution || 0,
            documentation_quality: result.data.documentation_quality || 0,
            ethics_independence: result.data.ethics_independence || 0,
            communication: result.data.communication || 0
          });
        } else {
          throw new Error(result.message || 'Failed to fetch competency data');
        }
      } catch (err) {
        console.error('Error fetching competency data:', err);
        setError(err.message || 'Failed to load competency data');
      } finally {
        setLoading(false);
      }
    };

    fetchCompetencyData();
  }, [competencyId, competencyData]);

  const handleScoreChange = (field, value) => {
    // Ensure value is between 0 and 100
    const numValue = Math.min(100, Math.max(0, parseInt(value) || 0));
    setScores(prev => ({
      ...prev,
      [field]: numValue
    }));
  };

  const handleGoBack = () => {
    if (location.state?.from) {
      navigate(location.state.from);
    } else {
      navigate('/mentor-candidates');
    }
  };

  const handleApprove = () => {
    setSelectedAction('approve');
  };

  const handleReject = () => {
    setSelectedAction('reject');
  };

  const handleCancel = () => {
    setSelectedAction(null);
    setReviewComments("");
    setError(null);
  };

 const handleSubmit = async () => {
  // Validate comment for reject action
  if (selectedAction === 'reject' && !reviewComments.trim()) {
    setError('Please provide comments when rejecting');
    return;
  }

  // Validate scores for approve action
  if (selectedAction === 'approve') {
    const allScoresValid = Object.values(scores).every(score => score > 0);
    if (!allScoresValid) {
      setError('Please provide scores for all competencies before approving');
      return;
    }
  }

  const reviewerName = mentorInfo?.name || mentorInfo?.full_name || mentorInfo?.email || 'Mentor';
  
  try {
    setSubmitting(true);
    setError(null);
    
    // Step 1: Update the competency scores via PUT to /api/candidate/competencies/{id}/
    if (selectedAction === 'approve') {
      // Only send the scores - no status field
      const scoresPayload = {
        technical_knowledge: scores.technical_knowledge,
        field_execution: scores.field_execution,
        documentation_quality: scores.documentation_quality,
        ethics_independence: scores.ethics_independence,
        communication: scores.communication
      };

      console.log('Sending scores payload:', scoresPayload);

      const scoresResponse = await fetch(`${BASE_URL}/api/candidate/competencies/${competencyId}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scoresPayload)
      });

      if (!scoresResponse.ok) {
        const errorData = await scoresResponse.json();
        console.error('Scores update error:', errorData);
        throw new Error(errorData.message || 'Failed to update competency scores');
      }
    }
    
    // Step 2: Fetch all evidence for this competency to update each one
    const evidenceResponse = await fetch(`${BASE_URL}/api/candidate/competency-evidence/?competency=${competencyId}`);
    if (!evidenceResponse.ok) {
      throw new Error('Failed to fetch evidence');
    }
    
    const evidenceResult = await evidenceResponse.json();
    
    if (evidenceResult.status && evidenceResult.data && evidenceResult.data.length > 0) {
      // Step 3: Update each evidence item's verification status
      const evidenceItems = evidenceResult.data;
      
      for (const evidence of evidenceItems) {
        const statusPayload = {
          action: selectedAction,
          reviewer_name: reviewerName,
          comments: reviewComments || ''
        };

        console.log(`Updating evidence ${evidence.id} with:`, statusPayload);

        const statusResponse = await fetch(`${BASE_URL}/api/candidate/competency-evidence/${evidence.id}/verify/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(statusPayload)
        });

        if (!statusResponse.ok) {
          const errorData = await statusResponse.json();
          console.error(`Failed to update evidence ${evidence.id}:`, errorData);
          // Continue with other evidence items even if one fails
        }
      }
    }
    
    setSuccess(`Competency ${selectedAction === 'approve' ? 'approved' : 'rejected'} successfully`);
    
    // Update local competency data status
    setCompetencyData(prev => ({
      ...prev,
      status: selectedAction === 'approve' ? 'approved' : 'rejected',
      ...scores
    }));

    // Clear success message after 3 seconds and navigate back
    setTimeout(() => {
      setSuccess(null);
      navigate('/mentor-candidates');
    }, 3000);
    
  } catch (err) {
    console.error('Error updating competency:', err);
    setError(err.message || 'Failed to update competency');
    
    // Clear error message after 5 seconds
    setTimeout(() => {
      setError(null);
    }, 5000);
  } finally {
    setSubmitting(false);
  }
};

  if (loading) {
    return (
      <div className="ta-layout-wrapper">
        <MentorSidebar />
        <div className="ta-main-wrapper">
          <Header />
          <div className="ta-content-area">
            <div className="mcr-loading-container">
              <FaSpinner className="mcr-spinner" />
              <p>Loading competency details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !competencyData) {
    return (
      <div className="ta-layout-wrapper">
        <MentorSidebar />
        <div className="ta-main-wrapper">
          <Header />
          <div className="ta-content-area">
            <div className="mcr-error-container">
              <FaExclamationCircle className="mcr-error-icon" />
              <h3>Error Loading Data</h3>
              <p>{error}</p>
              <button onClick={handleGoBack} className="mcr-retry-btn">
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ta-layout-wrapper">
      <MentorSidebar />

      <div className="ta-main-wrapper">
        <Header />

        <div className="ta-content-area">
          <div className="container-fluid mcr-wrapper">

            {/* Back Button */}
            <div className="mcr-header-section">
              <button className="mcr-back-btn" onClick={handleGoBack}>
                <FaArrowLeft /> Back
              </button>
            </div>

            {/* Page Header */}
            <div className="mcr-page-header">
              <div>
                <h3 className="mcr-page-title">Review Competency</h3>
                <p className="mcr-page-subtitle">
                  {selectedAction === 'approve' 
                    ? 'Add marks and approve this competency' 
                    : 'You are about to reject this competency'}
                </p>
              </div>
              <div className={`mcr-status-badge ${competencyData?.status || 'draft'}`}>
                {competencyData?.status || 'Draft'}
              </div>
            </div>

            {/* Success Message */}
            {success && (
              <div className="mcr-success-notification">
                <FaCheckCircle /> {success}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mcr-error-notification">
                <FaExclamationCircle /> {error}
              </div>
            )}

            {/* Competency Details Form */}
            <div className="mcr-form-container">
              {/* Candidate Info */}
              <div className="mcr-candidate-info">
                <div className="mcr-candidate-avatar">
                  <FaUserGraduate />
                </div>
                <div className="mcr-candidate-details">
                  <h4>{candidateInfo?.name || competencyData?.candidate_name || 'N/A'}</h4>
                  <div className="mcr-candidate-meta">
                    <span><FaBuilding /> {candidateInfo?.department || competencyData?.department_name || 'N/A'}</span>
                    <span><FaLevelUpAlt /> {candidateInfo?.level || competencyData?.competency_name || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Competency Scores - Editable Input Fields */}
              <div className="mcr-scores-section">
                <h5 className="mcr-section-title">
                  <FaEdit className="mcr-section-icon" /> Enter Competency Marks (0-100)
                </h5>
                
                <div className="mcr-score-grid">
                  {/* Technical Knowledge */}
                  <div className="mcr-score-card editable">
                    <div className="mcr-score-label">
                      <FaChartBar />
                      <span>Technical Knowledge</span>
                    </div>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      className="mcr-score-input"
                      value={scores.technical_knowledge}
                      onChange={(e) => handleScoreChange('technical_knowledge', e.target.value)}
                      disabled={submitting || selectedAction === 'reject'}
                      placeholder="0-100"
                    />
                  </div>

                  {/* Field Execution */}
                  <div className="mcr-score-card editable">
                    <div className="mcr-score-label">
                      <FaChartBar />
                      <span>Field Execution</span>
                    </div>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      className="mcr-score-input"
                      value={scores.field_execution}
                      onChange={(e) => handleScoreChange('field_execution', e.target.value)}
                      disabled={submitting || selectedAction === 'reject'}
                      placeholder="0-100"
                    />
                  </div>

                  {/* Documentation Quality */}
                  <div className="mcr-score-card editable">
                    <div className="mcr-score-label">
                      <FaChartBar />
                      <span>Documentation Quality</span>
                    </div>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      className="mcr-score-input"
                      value={scores.documentation_quality}
                      onChange={(e) => handleScoreChange('documentation_quality', e.target.value)}
                      disabled={submitting || selectedAction === 'reject'}
                      placeholder="0-100"
                    />
                  </div>

                  {/* Ethics & Independence */}
                  <div className="mcr-score-card editable">
                    <div className="mcr-score-label">
                      <FaChartBar />
                      <span>Ethics & Independence</span>
                    </div>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      className="mcr-score-input"
                      value={scores.ethics_independence}
                      onChange={(e) => handleScoreChange('ethics_independence', e.target.value)}
                      disabled={submitting || selectedAction === 'reject'}
                      placeholder="0-100"
                    />
                  </div>

                  {/* Communication */}
                  <div className="mcr-score-card editable">
                    <div className="mcr-score-label">
                      <FaChartBar />
                      <span>Communication</span>
                    </div>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      className="mcr-score-input"
                      value={scores.communication}
                      onChange={(e) => handleScoreChange('communication', e.target.value)}
                      disabled={submitting || selectedAction === 'reject'}
                      placeholder="0-100"
                    />
                  </div>
                </div>
              </div>

              {/* Evidence Summary */}
              <div className="mcr-evidence-summary">
                <h5 className="mcr-section-title">
                  <FaFileAlt className="mcr-section-icon" /> Evidence Status
                </h5>
                <p className="mcr-evidence-note">
                  Review all evidence in the candidate's competency details before making a decision.
                </p>
              </div>

              {/* Action Buttons - Show only if no action selected */}
              {!selectedAction && (
                <div className="mcr-action-buttons">
                  <button
                    className="mcr-btn mcr-btn-approve"
                    onClick={handleApprove}
                    disabled={submitting}
                  >
                    <FaCheck /> Approve with Marks
                  </button>
                  <button
                    className="mcr-btn mcr-btn-reject"
                    onClick={handleReject}
                    disabled={submitting}
                  >
                    <FaTimes /> Reject
                  </button>
                </div>
              )}

              {/* Review Comments Section - Show only when action selected */}
              {selectedAction && (
                <div className="mcr-comments-section">
                  <h5 className="mcr-section-title">
                    Review Comments
                  </h5>

                  {/* Comment Input */}
                  <div className="mcr-comment-input">
                    <label htmlFor="reviewComments">
                      Your Comments {selectedAction === 'reject' && <span className="mcr-required">*</span>}
                    </label>
                    <textarea
                      id="reviewComments"
                      className="mcr-textarea"
                      placeholder={selectedAction === 'approve' 
                        ? "Add any optional comments for approval..." 
                        : "Please provide reason for rejection..."
                      }
                      value={reviewComments}
                      onChange={(e) => setReviewComments(e.target.value)}
                      rows="4"
                      disabled={submitting}
                    />
                    <small className="mcr-comment-hint">
                      {reviewComments.length}/500 characters
                    </small>
                  </div>
                </div>
              )}

              {/* Confirmation Buttons - Show only when action selected */}
              {selectedAction && (
                <div className="mcr-action-section">
                  <div className="mcr-selected-action">
                    {selectedAction === 'approve' ? (
                      <span className="mcr-action-badge approve">
                        <FaCheck /> You are about to approve this competency with the marks above
                      </span>
                    ) : (
                      <span className="mcr-action-badge reject">
                        <FaTimes /> You are about to reject this competency
                      </span>
                    )}
                  </div>

                  <div className="mcr-confirmation-buttons">
                    <button
                      className="mcr-btn mcr-btn-secondary"
                      onClick={handleCancel}
                      disabled={submitting}
                    >
                      Cancel
                    </button>
                    <button
                      className={`mcr-btn mcr-btn-primary ${selectedAction}`}
                      onClick={handleSubmit}
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <FaSpinner className="mcr-spinner-small" /> 
                          {selectedAction === 'approve' ? 'Approving...' : 'Rejecting...'}
                        </>
                      ) : (
                        <>
                          <FaSave /> Confirm {selectedAction === 'approve' ? 'Approve' : 'Reject'}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Meta Info */}
              <div className="mcr-meta-info">
                <small>
                  Last Updated: {competencyData?.updated_at 
                    ? new Date(competencyData.updated_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    : 'N/A'}
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorCompetencyReview;