// CreateCertificate.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Layout/Sidebar";
import Header from "../Layout/Header";
import "./Certificate.css";
import "./CreateCertification.css";
import { FaArrowLeft } from "react-icons/fa";

const BASE_URL = "http://145.79.0.94:8000";

const CreateCertificate = () => {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState("");
  const [certificationCategories, setCertificationCategories] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Fetch certification categories and candidates on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch certification categories
        const categoriesResponse = await fetch(`${BASE_URL}/api/admin/certification-categories/`);
        const categoriesData = await categoriesResponse.json();
        
        // Fetch candidates
        const candidatesResponse = await fetch(`${BASE_URL}/api/candidate/candidates/`);
        const candidatesData = await candidatesResponse.json();
        
        if (categoriesData.status) {
          setCertificationCategories(categoriesData.data);
        } else {
          console.error("Failed to fetch categories:", categoriesData.message);
        }
        
        if (candidatesData.status) {
          setCandidates(candidatesData.data);
        } else {
          console.error("Failed to fetch candidates:", candidatesData.message);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleSubmit = async () => {
    if (!selectedTemplate || !selectedCandidate) {
      alert("Please select both certificate type and candidate");
      return;
    }
    
    setSubmitting(true);
    
    // Here you would typically send the data to your backend
    // For example:
    // const certificateData = {
    //   certification_category_id: selectedTemplate,
    //   candidate_id: selectedCandidate,
    //   issued_date: new Date().toISOString(),
    //   status: "issued"
    // };
    // 
    // try {
    //   const response = await fetch(`${BASE_URL}/api/certificates/`, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(certificateData),
    //   });
    //   const result = await response.json();
    //   if (result.status) {
    //     alert("Certificate submitted successfully!");
    //     handleReset();
    //   } else {
    //     alert("Failed to submit certificate: " + result.message);
    //   }
    // } catch (err) {
    //   console.error("Error submitting certificate:", err);
    //   alert("Error submitting certificate. Please try again.");
    // } finally {
    //   setSubmitting(false);
    // }
    
    // Temporary alert for demonstration
    alert(`Certificate submitted!\nCertificate Type: ${selectedTemplate}\nCandidate ID: ${selectedCandidate}`);
    setSubmitting(false);
  };
  
  const handleReset = () => {
    setSelectedTemplate("");
    setSelectedCandidate("");
  };
  
  const handleCancel = () => navigate(-1);

  // Get selected category object for preview
  const selectedCategory = certificationCategories.find(
    cat => cat.id === parseInt(selectedTemplate)
  );
  
  // Get selected candidate object for preview
  const selectedCandidateObj = candidates.find(
    cand => cand.id === parseInt(selectedCandidate)
  );

  if (loading) {
    return (
      <div className="ta-layout-wrapper">
        <Sidebar />
        <div className="ta-main-wrapper">
          <Header />
          <div className="ta-content-area">
            <div className="cert-wrapper">
              <div style={{ textAlign: "center", padding: "50px" }}>
                Loading data...
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ta-layout-wrapper">
        <Sidebar />
        <div className="ta-main-wrapper">
          <Header />
          <div className="ta-content-area">
            <div className="cert-wrapper">
              <div style={{ textAlign: "center", padding: "50px", color: "red" }}>
                {error}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ta-layout-wrapper">
      <Sidebar />
      <div className="ta-main-wrapper">
        <Header />
        <div className="ta-content-area">
          <div className="cert-wrapper">

            {/* Page Header */}
            <div className="cert-header">
              <button className="btn-back mb-2" onClick={() => navigate(-1)}>
                <FaArrowLeft /> Back
              </button>
              <h2>Certifications</h2>
              <p>Issue and preview certificates for your candidates.</p>
            </div>

            {/* Two-column layout */}
            <div className="cc-two-col">

              {/* ── LEFT: Form ── */}
              <div className="cc-form-panel">
                <h3 className="cc-form-title">Create a new certification</h3>

                {/* Certificate type - from API */}
                <div className="cc-field-group">
                  <label className="cc-label">Certificate type</label>
                  <select
                    className="cc-select"
                    value={selectedTemplate}
                    onChange={(e) => setSelectedTemplate(e.target.value)}
                  >
                    <option value="">Select certificate type</option>
                    {certificationCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {selectedCategory && selectedCategory.description && (
                    <div style={{ fontSize: "12px", color: "#666", marginTop: "5px" }}>
                      {selectedCategory.description}
                    </div>
                  )}
                </div>

                {/* Candidate - from API */}
                <div className="cc-field-group">
                  <label className="cc-label">Candidate</label>
                  <select
                    className="cc-select"
                    value={selectedCandidate}
                    onChange={(e) => setSelectedCandidate(e.target.value)}
                  >
                    <option value="">Select candidate</option>
                    {candidates.map((candidate) => (
                      <option key={candidate.id} value={candidate.id}>
                        {candidate.full_name} ({candidate.email})
                      </option>
                    ))}
                  </select>
                  {selectedCandidateObj && (
                    <div style={{ fontSize: "12px", color: "#666", marginTop: "5px" }}>
                      Status: {selectedCandidateObj.candidate_status} | 
                      Phone: {selectedCandidateObj.phone_number}
                    </div>
                  )}
                </div>

                {/* Info note */}
                <div className="cc-info-box">
                  Please confirm the details on the right before submitting. Once issued, the
                  certificate will be sent to the candidate.
                </div>

                {/* Actions */}
                <div className="cc-actions">
                  <button 
                    className="cc-btn-submit" 
                    onClick={handleSubmit}
                    disabled={submitting}
                  >
                    {submitting ? "Submitting..." : "Submit"}
                  </button>
                  <button className="cc-btn-reset" onClick={handleReset}>Reset</button>
                  <button className="cc-btn-cancel" onClick={handleCancel}>Cancel</button>
                </div>
              </div>

              {/* ── RIGHT: Preview ── */}
              <div className="cc-preview-panel">
                <div className="cc-preview-label">Template preview</div>
                <div className="cc-preview-frame">
                  {selectedTemplate === "2" && 
                    <Template1 candidate={selectedCandidateObj?.full_name || ""} />
                  }
                  {selectedTemplate === "3" && 
                    <Template2 candidate={selectedCandidateObj?.full_name || ""} />
                  }
                  {selectedTemplate === "4" && 
                    <Template3 candidate={selectedCandidateObj?.full_name || ""} />
                  }
                  {(!selectedTemplate || 
                    (selectedTemplate !== "2" && selectedTemplate !== "3" && selectedTemplate !== "4")) && (
                    <div style={{ 
                      textAlign: "center", 
                      padding: "50px", 
                      color: "#999" 
                    }}>
                      Select a certificate type to preview
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   TEMPLATE 1  —  Admiralty Commission / Achievement
   (For Basic Surveyor - ID: 2)
───────────────────────────────────────────── */
const Template1 = ({ candidate }) => (
  <div className="cc-cert cert-1">
    <div className="cert-1-inner">

      {/* Corner ornaments */}
      <div className="cert-1-corner tl">
        <svg viewBox="0 0 22 22"><polyline points="0,22 0,0 22,0" stroke="#C9A84C" strokeWidth="1.5" fill="none"/></svg>
      </div>
      <div className="cert-1-corner tr">
        <svg viewBox="0 0 22 22"><polyline points="22,22 22,0 0,0" stroke="#C9A84C" strokeWidth="1.5" fill="none"/></svg>
      </div>
      <div className="cert-1-corner bl">
        <svg viewBox="0 0 22 22"><polyline points="0,0 0,22 22,22" stroke="#C9A84C" strokeWidth="1.5" fill="none"/></svg>
      </div>
      <div className="cert-1-corner br">
        <svg viewBox="0 0 22 22"><polyline points="22,0 22,22 0,22" stroke="#C9A84C" strokeWidth="1.5" fill="none"/></svg>
      </div>

      {/* Top block */}
      <div className="cert-1-top">
        <div className="cert-1-title">International Maritime Authority</div>
        <div className="cert-1-anchor-icon">⚓</div>
        <div className="cert-1-heading">Certificate of<br/>Basic Surveyor</div>
      </div>

      {/* Body */}
      <div className="cert-1-body-block">
        <div className="cert-1-body-text">
          This is to certify that the officer named hereinafter<br/>
          has duly fulfilled all requirements set forth under<br/>
          maritime law and surveyor regulations
        </div>
        <div className="cert-1-name">
          {candidate || <span style={{ opacity: 0.45 }}>— Recipient Name —</span>}
        </div>
        <div className="cert-1-body-text" style={{ marginTop: 6 }}>
          is hereby certified as<br/>
          <span className="cert-1-rank">Basic Surveyor — Class I</span><br/>
          with full authority to conduct marine surveys and inspections
        </div>
      </div>

      {/* Footer */}
      <div className="cert-1-footer">
        <div className="cert-1-sig-block">
          <div className="cert-1-sig-line"/>
          <div className="cert-1-sig-label">Chief Surveyor</div>
        </div>
        <div className="cert-1-seal">
          <div className="cert-1-seal-text">MARITIME<br/>AUTHORITY<br/>★ SEAL ★</div>
        </div>
        <div className="cert-1-sig-block">
          <div className="cert-1-sig-line"/>
          <div className="cert-1-sig-label">Registrar General</div>
        </div>
      </div>

      {/* Wave decoration */}
      <div className="cert-1-wave">
        <svg width="100%" height="22" preserveAspectRatio="none">
          <path d="M0,12 Q60,2 120,12 T240,12 T360,12 T480,12 T600,12 T720,12" stroke="#C9A84C" strokeWidth="2" fill="none"/>
          <path d="M0,18 Q60,8 120,18 T240,18 T360,18 T480,18 T600,18 T720,18" stroke="#C9A84C" strokeWidth="1.5" fill="none"/>
        </svg>
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   TEMPLATE 2  —  Marine Equipment Competency
   (For Marine Equipment - ID: 3)
───────────────────────────────────────────── */
const Template2 = ({ candidate }) => (
  <div className="cc-cert cert-2">
    {/* Header bar */}
    <div className="cert-2-header">
      <div className="cert-2-logo-area">
        <div className="cert-2-logo-circle">⚙️</div>
        <div>
          <div className="cert-2-org">Marine Equipment Training Board</div>
          <div className="cert-2-org-sub">Equipment Certification Division</div>
        </div>
      </div>
      <div className="cert-2-cert-no">MEB/EQUIP/2024-0387</div>
    </div>

    {/* Dashed stripe */}
    <div className="cert-2-stripe"/>

    {/* Body */}
    <div className="cert-2-body-area">
      <div className="cert-2-certifies">Certifies that</div>
      <div className="cert-2-type">
        Marine Equipment —<br/>Installation & Maintenance Competency
      </div>
      <div className="cert-2-recipient-label">Awarded to</div>
      <div className="cert-2-recipient">
        {candidate || <span style={{ opacity: 0.4 }}>— Recipient Name —</span>}
      </div>
      <div className="cert-2-desc">
        Has successfully completed all mandatory training requirements and demonstrated
        proficiency in marine equipment installation, maintenance, safety protocols, and
        regulatory compliance as required by international maritime standards.
      </div>
      <div className="cert-2-badges">
        <span className="cert-2-badge">IMO Compliant</span>
        <span className="cert-2-badge">SOLAS</span>
        <span className="cert-2-badge">MARPOL</span>
        <span className="cert-2-badge">ISO Certified</span>
      </div>

      <div className="cert-2-footer">
        <div>
          <div className="cert-2-date-label">Issue date</div>
          <div className="cert-2-date-val">{new Date().toLocaleDateString()}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div className="cert-2-sig">Eng. M. Rodriguez</div>
          <div className="cert-2-sig-under">Director of Equipment Certification</div>
        </div>
      </div>
    </div>

    {/* Right accent bar */}
    <div className="cert-2-accent-bar"/>
  </div>
);

/* ─────────────────────────────────────────────
   TEMPLATE 3  —  QA/QC Specialist
   (For QA/QC Specialist - ID: 4)
───────────────────────────────────────────── */
const Template3 = ({ candidate }) => (
  <div className="cc-cert cert-3">
    {/* Watermark */}
    <div className="cert-3-watermark">QUALITY</div>

    {/* Top band */}
    <div className="cert-3-topband">
      <div className="cert-3-topband-txt">Quality Assurance &amp; Control Authority</div>
      <div className="cert-3-topband-txt">Reg. No. QAQCA/2024/1157</div>
    </div>

    {/* Main area */}
    <div className="cert-3-main-body">
      {/* Sidebar */}
      <div className="cert-3-sidebar">
        <div className="cert-3-sidebar-icon">✓</div>
        <div className="cert-3-sidebar-divider"/>
        <div className="cert-3-sidebar-text">Quality Assurance</div>
        <div className="cert-3-sidebar-divider"/>
        <div className="cert-3-sidebar-icon">◆</div>
      </div>

      {/* Content */}
      <div className="cert-3-content">
        <div className="cert-3-eyebrow">Certificate of Excellence</div>
        <div className="cert-3-main-title">
          QA/QC Specialist<br/>Certification
        </div>

        <div className="cert-3-divider-line">
          <span className="cert-3-diamond">◆</span>
        </div>

        <div className="cert-3-awarded">This certificate is proudly awarded to</div>
        <div className="cert-3-holder">
          {candidate || <span style={{ opacity: 0.4, fontSize: "14px" }}>— Recipient Name —</span>}
        </div>

        <div className="cert-3-desc">
          Having successfully completed the prescribed modules in Quality Management Systems,
          Quality Control Procedures, Auditing Techniques, and Process Improvement
          in accordance with international quality standards.
        </div>

        <div className="cert-3-modules">
          <span className="cert-3-mod">QMS</span>
          <span className="cert-3-mod">ISO 9001</span>
          <span className="cert-3-mod">Auditing</span>
          <span className="cert-3-mod">Six Sigma</span>
        </div>

        <div className="cert-3-bottom">
          <div>
            <div className="cert-3-sig-area">Dr. Sarah Chen</div>
            <div className="cert-3-sig-sub">Chief Quality Officer</div>
            <div className="cert-3-valid">Valid indefinitely</div>
          </div>
          <div className="cert-3-qr">✓✓</div>
        </div>
      </div>
    </div>
  </div>
);

export default CreateCertificate;