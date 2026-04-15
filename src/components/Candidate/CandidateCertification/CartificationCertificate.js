import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CandidateSidebar from "../Layout/CandidateSidebar";
import Header from "../Layout/CandidateHeader";
import {
  FaFilter,
  FaPlus,
  FaDownload,
  FaExternalLinkAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaCalendarAlt,
  FaEdit,
  FaTrash,
  FaSpinner,
  FaClock,
  FaTimesCircle
} from "react-icons/fa";
import Swal from 'sweetalert2';
import { BASE_URL } from "../../../ApiUrl";
import "./CandidateCertificate.css";

const CandidateCertifications = () => {
  const navigate = useNavigate();
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [stats, setStats] = useState({
    active: 0,
    expiringSoon: 0,
    nextRenewal: null
  });

  // Get candidate data from localStorage
  const getCandidateData = () => {
    const candidateData = localStorage.getItem('candidate_user');
    if (candidateData) {
      try {
        return JSON.parse(candidateData);
      } catch (e) {
        console.error('Error parsing candidate data:', e);
        return null;
      }
    }
    return null;
  };

  const candidateData = getCandidateData();
  const candidateId = candidateData?.user_id;

  // Fetch certifications on component mount
  useEffect(() => {
    if (candidateId) {
      fetchCertifications();
    }
  }, [candidateId]);

  const fetchCertifications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${BASE_URL}/api/candidate/certifications/`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.status && result.data) {
        setCertifications(result.data);
        calculateStats(result.data);
        console.log('✅ Certifications loaded:', result.data);
      } else {
        throw new Error(result.message || 'Failed to fetch certifications');
      }
    } catch (err) {
      console.error('Error fetching certifications:', err);
      setError(err.message);
      Swal.fire({
        icon: 'error',
        title: 'Failed to Load Certifications',
        text: err.message || 'An error occurred while loading certifications',
        showConfirmButton: true
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (certData) => {
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);
    
    let active = 0;
    let expiringSoon = 0;
    let nextRenewalDate = null;
    
    certData.forEach(cert => {
      const expiryDate = new Date(cert.expiry_date);
      
      if (expiryDate > today && cert.status === 'approved') {
        active++;
        
        if (expiryDate <= thirtyDaysFromNow) {
          expiringSoon++;
        }
        
        if (!nextRenewalDate || expiryDate < nextRenewalDate) {
          nextRenewalDate = expiryDate;
        }
      }
    });
    
    setStats({
      active,
      expiringSoon,
      nextRenewal: nextRenewalDate ? formatDate(nextRenewalDate) : 'No renewals'
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatDisplayDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const calculateRemainingDays = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Expired';
    if (diffDays === 0) return 'Expires today';
    return `${diffDays} days remaining`;
  };

  const getExpiryStatus = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    return expiry > today ? 'valid' : 'expired';
  };

  const getApprovalStatusInfo = (status) => {
    switch(status) {
      case 'approved':
        return {
          text: 'Approved',
          class: 'approved',
          icon: <FaCheckCircle />
        };
      case 'pending':
        return {
          text: 'Pending',
          class: 'pending',
          icon: <FaClock />
        };
      case 'rejected':
        return {
          text: 'Rejected',
          class: 'rejected',
          icon: <FaTimesCircle />
        };
      default:
        return {
          text: 'Unknown',
          class: 'unknown',
          icon: <FaExclamationTriangle />
        };
    }
  };

  const getCardStatusClass = (approvalStatus, expiryDate) => {
    if (approvalStatus === 'rejected') return 'rejected';
    if (approvalStatus === 'pending') return 'pending';
    const expiry = new Date(expiryDate);
    const today = new Date();
    if (expiry <= today) return 'expired';
    return 'valid';
  };

  const handleAddCertificate = () => {
    navigate("/candidate-certifications/add");
  };

  const handleEditCertificate = (certId) => {
    navigate(`/candidate-certifications/edit/${certId}`);
  };

  const handleDeleteCertificate = async (certId, certName) => {
    const result = await Swal.fire({
      title: 'Delete Certificate?',
      html: `Are you sure you want to delete <strong>${certName}</strong>?<br>This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    });
    
    if (result.isConfirmed) {
      setActionLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/api/candidate/certifications/${certId}/`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const updatedCertifications = certifications.filter(cert => cert.id !== certId);
        setCertifications(updatedCertifications);
        calculateStats(updatedCertifications);
        
        await Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Certificate has been deleted successfully.',
          timer: 2000,
          showConfirmButton: false
        });
      } catch (err) {
        console.error('Error deleting certification:', err);
        Swal.fire({
          icon: 'error',
          title: 'Delete Failed',
          text: err.message || 'Failed to delete certificate. Please try again.',
          showConfirmButton: true
        });
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleDownloadCertificate = async (certId) => {
    try {
      const certification = certifications.find(cert => cert.id === certId);
      if (certification && certification.document) {
        const fileUrl = `${BASE_URL}${certification.document}`;
        window.open(fileUrl, '_blank');
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'No Document',
          text: 'No document available for this certification.',
          timer: 2000,
          showConfirmButton: false
        });
      }
    } catch (err) {
      console.error('Error downloading certificate:', err);
      Swal.fire({
        icon: 'error',
        title: 'Download Failed',
        text: 'Failed to download certificate. Please try again.',
        showConfirmButton: true
      });
    }
  };

  const handleVerifyCertificate = (certNumber) => {
    Swal.fire({
      icon: 'info',
      title: 'Verification',
      text: `Verifying certificate: ${certNumber}`,
      timer: 2000,
      showConfirmButton: false
    });
  };

  if (loading) {
    return (
      <div className="ccert-layout-wrapper">
        <CandidateSidebar />
        <div className="ccert-main-wrapper">
          <Header />
          <div className="ccert-content-area">
            <div className="ccert-loading-container">
              <FaSpinner className="ccert-spinner" />
              <p>Loading certifications...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ccert-layout-wrapper">
      <CandidateSidebar />

      <div className="ccert-main-wrapper">
        <Header />

        <div className="ccert-content-area container-fluid">
          <div className="ccert-page-header">
            <div>
              <h3 className="ccert-title">Certifications</h3>
              <p className="ccert-sub">
                Manage your professional certifications and credentials
              </p>
            </div>

            <div className="ccert-header-actions">
              <button className="ccert-btn-outline">
                <FaFilter /> Filter
              </button>

              <button className="ccert-btn-primary" onClick={handleAddCertificate}>
                <FaPlus /> Add Certification
              </button>
            </div>
          </div>

          <div className="ccert-stats-grid">
            <StatCard
              icon={<FaCheckCircle />}
              value={stats.active.toString()}
              label="Active Certifications"
              type="success"
            />

            <StatCard
              icon={<FaExclamationTriangle />}
              value={stats.expiringSoon.toString()}
              label="Expiring Soon"
              type="warning"
            />

            <StatCard
              icon={<FaCalendarAlt />}
              value={stats.nextRenewal}
              label="Next Renewal"
              type="info"
            />
          </div>

          <div className="ccert-card">
            <div className="ccert-card-header">
              <div>
                <h5>Your Certifications</h5>
                <p className="ccert-muted">All your professional credentials</p>
              </div>
              <span className="ccert-count-badge">{certifications.length} Total</span>
            </div>

            {certifications.length === 0 ? (
              <div className="ccert-empty-state">
                <div className="ccert-empty-icon">
                  <FaCheckCircle />
                </div>
                <h6>No Certifications Found</h6>
                <p className="ccert-muted">Start by adding your first certification</p>
                <button className="ccert-btn-primary" onClick={handleAddCertificate}>
                  <FaPlus /> Add Certification
                </button>
              </div>
            ) : (
              <div className="ccert-certificates-list">
                {certifications.map(cert => {
                  const approvalInfo = getApprovalStatusInfo(cert.status);
                  const expiryStatus = getExpiryStatus(cert.expiry_date);
                  const cardStatus = getCardStatusClass(cert.status, cert.expiry_date);
                  
                  return (
                    <CertificationCard
                      key={cert.id}
                      id={cert.id}
                      cardStatus={cardStatus}
                      approvalStatus={cert.status}
                      approvalStatusText={approvalInfo.text}
                      approvalStatusClass={approvalInfo.class}
                      approvalIcon={approvalInfo.icon}
                      title={cert.certificate_number}
                      org={cert.issuing_authority}
                      certificationName={cert.certification_name || "Certification"}
                      issued={formatDisplayDate(cert.issue_date)}
                      expiry={formatDisplayDate(cert.expiry_date)}
                      remaining={calculateRemainingDays(cert.expiry_date)}
                      expiryStatus={expiryStatus}
                      onEdit={handleEditCertificate}
                      onDelete={handleDeleteCertificate}
                      onDownload={handleDownloadCertificate}
                      onVerify={handleVerifyCertificate}
                      document={cert.document}
                      actionLoading={actionLoading}
                    />
                  );
                })}
              </div>
            )}
          </div>

          <div className="ccert-card">
            <div className="ccert-card-header">
              <div>
                <h5>Recommended Certifications</h5>
                <p className="ccert-muted">
                  Based on your career progression
                </p>
              </div>
            </div>

            <div className="ccert-recommended-grid">
              <RecommendedCard
                title="API 570 Piping Inspector"
                exam="March 2024"
                level="high"
              />

              <RecommendedCard
                title="CSWIP 3.2 Senior Welding Inspector"
                exam="April 2024"
                level="medium"
              />

              <RecommendedCard
                title="ASNT NDT Level II (UT)"
                exam="February 2024"
                level="high"
              />

              <RecommendedCard
                title="NACE CIP Level 2"
                exam="May 2024"
                level="medium"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ================= STAT CARD ================= */
const StatCard = ({ icon, value, label, type }) => (
  <div className="ccert-stat-card">
    <div className={`ccert-stat-icon ${type}`}>
      {icon}
    </div>
    <div className="ccert-stat-content">
      <h4>{value}</h4>
      <p>{label}</p>
    </div>
  </div>
);

/* ================= CERTIFICATION CARD ================= */
const CertificationCard = ({
  id,
  cardStatus,
  approvalStatus,
  approvalStatusText,
  approvalStatusClass,
  approvalIcon,
  title,
  org,
  certificationName,
  issued,
  expiry,
  remaining,
  expiryStatus,
  onEdit,
  onDelete,
  onDownload,
  onVerify,
  document,
  actionLoading
}) => (
  <div className={`ccert-certificate-item ${cardStatus}`}>
    <div className="ccert-certificate-main">
      <div className="ccert-certificate-icon">
        {approvalIcon}
      </div>

      <div className="ccert-certificate-info">
        <div className="ccert-certificate-header">
          <h6>{title}</h6>
          <span className={`ccert-status-tag ${approvalStatusClass}`}>
            {approvalStatusText}
          </span>
        </div>
        
        <p className="ccert-organization">{org}</p>
        
        <div className="ccert-certificate-meta">
          <span className="ccert-meta-tag">{certificationName}</span>
        </div>

        <div className="ccert-dates-grid">
          <div className="ccert-date-item">
            <span className="ccert-date-label">Issue Date</span>
            <span className="ccert-date-value">{issued}</span>
          </div>
          <div className="ccert-date-item">
            <span className="ccert-date-label">Expiry Date</span>
            <span className="ccert-date-value">{expiry}</span>
          </div>
          {/* <div className="ccert-date-item">
            <span className="ccert-date-label">Remaining</span>
            <span className={`ccert-remaining ${expiryStatus}`}>{remaining}</span>
          </div> */}
        </div>
      </div>

      <div className="ccert-certificate-actions">
        <button 
          className="ccert-action-btn ccert-edit-btn"
          onClick={() => onEdit(id)}
          title="Edit Certificate"
        >
          <FaEdit />
        </button>
        <button 
          className="ccert-action-btn ccert-delete-btn"
          onClick={() => onDelete(id, title)}
          disabled={actionLoading}
          title="Delete Certificate"
        >
          <FaTrash />
        </button>
        <button 
          className="ccert-action-btn ccert-download-btn"
          onClick={() => onDownload(id)}
          disabled={!document}
          title="Download Certificate"
        >
          <FaDownload />
        </button>
        <button 
          className="ccert-action-btn ccert-verify-btn"
          onClick={() => onVerify(title)}
          title="Verify Certificate"
        >
          <FaExternalLinkAlt />
        </button>
      </div>
    </div>

    {approvalStatus === 'approved' && expiryStatus === 'valid' && (
      <div className="ccert-certificate-progress">
        <div className={`ccert-progress-bar ${cardStatus}`} />
      </div>
    )}
  </div>
);

const RecommendedCard = ({ title, exam, level }) => (
  <div className="ccert-recommend-item">
    <div className="ccert-recommend-header">
      <h6>{title}</h6>
      <span className={`ccert-relevance-badge ${level}`}>
        {level === "high" ? "High" : "Medium"}
      </span>
    </div>
    <p className="ccert-exam-date">Next exam: {exam}</p>
    <button className="ccert-learn-more-btn">
      Learn More
    </button>
  </div>
);

export default CandidateCertifications;