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
      
      // Check if certification is active (not expired AND approved)
      if (expiryDate > today && cert.status === 'approved') {
        active++;
        
        // Check if expiring within 30 days
        if (expiryDate <= thirtyDaysFromNow) {
          expiringSoon++;
        }
        
        // Find earliest renewal date
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

  // Get expiry status (based on date)
  const getExpiryStatus = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    return expiry > today ? 'valid' : 'expired';
  };

  // Get approval status display
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

  // Get overall card status class
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
      title: 'Are you sure?',
      text: `You are about to delete "${certName}". This action cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });
    
    if (result.isConfirmed) {
      try {
        const response = await fetch(`${BASE_URL}/api/candidate/certifications/${certId}/`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Remove the deleted certification from state
        const updatedCertifications = certifications.filter(cert => cert.id !== certId);
        setCertifications(updatedCertifications);
        
        // Recalculate stats
        calculateStats(updatedCertifications);
        
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Certification has been deleted successfully.',
          timer: 2000,
          showConfirmButton: false
        });
      } catch (err) {
        console.error('Error deleting certification:', err);
        Swal.fire({
          icon: 'error',
          title: 'Delete Failed',
          text: err.message || 'Failed to delete certification. Please try again.',
          showConfirmButton: true
        });
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
            <div className="text-center p-5">
              <FaSpinner className="fa-spin" size={40} color="#3498db" />
              <p className="mt-2">Loading certifications...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ccert-layout-wrapper">
      {/* Sidebar */}
      <CandidateSidebar />

      {/* Main */}
      <div className="ccert-main-wrapper">
        <Header />

        <div className="ccert-content-area container-fluid">
          {/* ================= PAGE HEADER ================= */}
          <div className="d-flex justify-content-between align-items-start mb-4">
            <div>
              <h3 className="ccert-title">Certifications</h3>
              <p className="ccert-sub">
                Manage your professional certifications and credentials
              </p>
            </div>

            <div className="d-flex gap-2">
              <button className="btn ccert-btn-outline">
                <FaFilter className="me-2" /> Filter
              </button>

              <button className="btn ccert-btn-primary" onClick={handleAddCertificate}>
                <FaPlus className="me-2" /> Add Certification
              </button>
            </div>
          </div>

          {/* ================= STATS ================= */}
          <div className="row g-4 mb-4">
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
            />
          </div>

          {/* ================= CERTIFICATIONS SECTION ================= */}
          <div className="ccert-card">
            <div className="mb-4">
              <h5 className="mb-1">Your Certifications</h5>
              <p className="ccert-muted">All your professional credentials</p>
            </div>

            {certifications.length === 0 ? (
              <div className="text-center p-5">
                <p className="ccert-muted">No certifications found.</p>
                <button className="btn ccert-btn-primary mt-2" onClick={handleAddCertificate}>
                  <FaPlus className="me-2" /> Add Your First Certification
                </button>
              </div>
            ) : (
              certifications.map(cert => {
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
                  />
                );
              })
            )}
          </div>

          {/* ================= RECOMMENDED CERTIFICATIONS ================= */}
          <div className="ccert-card mt-4">
            <div className="mb-4">
              <h5 className="mb-1">Recommended Certifications</h5>
              <p className="ccert-muted">
                Based on your career progression
              </p>
            </div>

            <div className="row g-4">
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
  <div className="col-lg-4">
    <div className="ccert-stat-card">
      <div className={`ccert-stat-icon ${type}`}>
        {icon}
      </div>
      <div>
        <h4>{value}</h4>
        <p className="ccert-muted mb-0">{label}</p>
      </div>
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
  onVerify
}) => (
  <div className={`ccert-cert-card ${cardStatus}`}>
    <div className="d-flex justify-content-between">
      <div className="d-flex gap-3">
        <div className="ccert-cert-icon">
          {approvalIcon}
        </div>

        <div>
          <h6 className="mb-1">{title}</h6>
          <p className="ccert-muted mb-2">{org}</p>

          <div className="d-flex gap-2 align-items-center flex-wrap">
            <span className="ccert-tag">{certificationName}</span>
            <span className={`ccert-status-badge ${approvalStatusClass}`}>
              {approvalStatusText}
            </span>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="d-flex gap-2">
        <button className="btn ccert-btn-outline" onClick={() => onEdit(id)}>
          <FaEdit className="me-2" /> Edit
        </button>
        <button className="btn ccert-btn-outline" onClick={() => onDelete(id, title)}>
          <FaTrash className="me-2" /> Delete
        </button>
        <button className="btn ccert-btn-outline" onClick={() => onDownload(id)}>
          <FaDownload className="me-2" /> Certificate
        </button>
        <button className="btn ccert-btn-outline" onClick={() => onVerify(title)}>
          <FaExternalLinkAlt className="me-2" /> Verify
        </button>
      </div>
    </div>

    {/* Dates */}
    <div className="row mt-3">
      <div className="col-md-4">
        <p className="ccert-muted small">Issue Date</p>
        <strong>{issued}</strong>
      </div>

      <div className="col-md-4">
        <p className="ccert-muted small">Expiry Date</p>
        <strong>{expiry}</strong>
      </div>

      <div className="col-md-4">
        <p className="ccert-muted small">Status</p>
        <strong className={`ccert-status-text ${approvalStatusClass}`}>
          {approvalStatusText}
        </strong>
      </div>
    </div>

    {/* Progress bar for approved certificates */}
    {approvalStatus === 'approved' && expiryStatus === 'valid' && (
      <div className="ccert-progress">
        <div className={`ccert-progress-fill ${cardStatus}`} />
      </div>
    )}
  </div>
);

const RecommendedCard = ({ title, exam, level }) => (
  <div className="col-md-6">
    <div className="ccert-recommend-card">
      <div className="d-flex justify-content-between mb-2">
        <h6 className="mb-0">{title}</h6>
        <span className={`ccert-badge ${level === "high" ? "high" : "medium"}`}>
          {level === "high" ? "High relevance" : "Medium relevance"}
        </span>
      </div>
      <p className="ccert-muted mb-3">Next exam: {exam}</p>
      <button className="btn ccert-recommend-btn w-100">Learn More</button>
    </div>
  </div>
);

export default CandidateCertifications;