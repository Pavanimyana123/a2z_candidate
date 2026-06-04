import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../Layout/Sidebar";
import Header from "../Layout/Header";
import "../../Candidate/CandidateProfessionality/CandidateProfessionality.css";
import { FaArrowLeft, FaPrint } from "react-icons/fa";
import { BASE_URL } from "../../../ApiUrl";

const CandidateProfessionalId = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchCandidate();
    }
  }, [id]);

  const fetchCandidate = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BASE_URL}/api/candidate/candidates/${id}/`);
      const data = await response.json();

      if (response.ok && data.status && data.data) {
        setCandidate(data.data);
      } else {
        throw new Error(data.message || 'Failed to load candidate');
      }
    } catch (err) {
      setError(err.message || 'Failed to load candidate');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  const getProfessionalId = () => {
    if (!candidate) return 'ICSEM-0000-000000';
    const year = new Date().getFullYear();
    const idString = String(candidate.id || candidate.candidate_id || '0').padStart(6, '0');
    return `ICSEM-${year}-${idString}`;
  };

  const handlePrint = () => {
    window.print();
  };

  const getInitials = () => {
    if (!candidate?.full_name) return 'NA';
    return candidate.full_name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <>
      <style>{`@media print {
        body * {
          visibility: hidden;
        }
        .print-area, .print-area * {
          visibility: visible;
        }
        .print-area {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
        }
      }`}</style>
      <div className="ta-layout-wrapper">
        <Sidebar />
        <div className="ta-main-wrapper">
          <Header />
          <div className="ta-content-area">
            <div className="container-fluid cpi-wrapper print-area">
              <div className="d-flex justify-content-between align-items-start mb-4">
                <div>
                  <h3 className="cpi-title">Professional Identity</h3>
                  <p className="cpi-subtitle">Verified ID details for candidate records.</p>
                </div>
                <div className="cpi-actions d-flex gap-2">
                  <button className="btn btn-outline-secondary cpi-btn" onClick={() => navigate('/candidate')}>
                    <FaArrowLeft /> Back to Candidates
                  </button>
                  <button className="btn btn-primary cpi-btn" onClick={handlePrint}>
                    <FaPrint /> Print ID
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-3">Loading candidate ID...</p>
                </div>
              ) : error ? (
                <div className="alert alert-danger">{error}</div>
              ) : candidate ? (
                <div className="row g-4 justify-content-center">
                  <div className="col-lg-6">
                    <div className="cpi-id-card">
                      <div className="cpi-id-header">
                        <div className="cpi-logo">IC</div>
                        <span>ICSEM Platform</span>
                      </div>
                      <div className="cpi-profile">
                        <div className="cpi-avatar">{getInitials()}</div>
                        <h4>{candidate.full_name || 'Candidate Name'}</h4>
                        <p>{candidate.current_level ? `Level ${candidate.current_level}` : 'Candidate'}</p>
                      </div>
                      <div className="cpi-id-box">
                        <span>Surveyor ID</span>
                        <strong>{getProfessionalId()}</strong>
                      </div>
                      <div className="cpi-meta-grid">
                        <div className="cpi-meta">
                          <span>Competency</span>
                          <strong>{candidate.competency || 'Developing'}</strong>
                        </div>
                        <div className="cpi-meta">
                          <span>Experience</span>
                          <strong>{candidate.years_of_experience || '0h'}</strong>
                        </div>
                      </div>
                      <div className="cpi-discipline">
                        <span>Discipline</span>
                        <strong>{candidate.discipline || candidate.department || 'Marine Structural Inspection'}</strong>
                      </div>
                      <div className="cpi-contact-info">
                        <div className="cpi-contact-item mb-2">
                          <span>Email</span>
                          <strong>{candidate.email || 'N/A'}</strong>
                        </div>
                        <div className="cpi-contact-item">
                          <span>Phone</span>
                          <strong>{candidate.phone_number || 'N/A'}</strong>
                        </div>
                      </div>
                      <div className="cpi-footer">
                        <span>Member since {formatDate(candidate.created_at || candidate.created_at_date || candidate.joined_at || new Date())}</span>
                        <span>{candidate.current_level ? `Level ${candidate.current_level}` : 'Level 1'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="alert alert-warning">Candidate not found.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CandidateProfessionalId;
