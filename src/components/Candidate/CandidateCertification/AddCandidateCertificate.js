// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import CandidateSidebar from '../Layout/CandidateSidebar';
// import Header from '../Layout/CandidateHeader';
// import "./AddCandidateCertificate.css";
// import Swal from 'sweetalert2';
// import { BASE_URL } from "../../../ApiUrl";

// const AddCertificate = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const [loading, setLoading] = useState(false);
//   const [fetchLoading, setFetchLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [errors, setErrors] = useState({});
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [complianceRules, setComplianceRules] = useState([]);
//   const [candidateUser, setCandidateUser] = useState(null);

//   const [formData, setFormData] = useState({
//     issue_date: '',
//     expiry_date: '',
//     certificate_number: '',
//     issuing_authority: '',
//     document: '',
//     is_approved: true,
//     approved_at: new Date().toISOString(),
//     approval_remarks: '',
//     status: 'pending',
//     candidate: null,
//     compliance_rule: '',
//     approved_by_mentor: 0
//   });

//   // Fetch compliance rules and candidate data on component mount
//   useEffect(() => {
//     fetchComplianceRules();
//     getCandidateFromLocalStorage();
//   }, []);

//   // Fetch certificate data if in edit mode
//   useEffect(() => {
//     if (id) {
//       setIsEditMode(true);
//       fetchCertificateData();
//     }
//   }, [id]);

//   const getCandidateFromLocalStorage = () => {
//     try {
//       const storedData = localStorage.getItem('candidate_user');
//       if (storedData) {
//         const parsedData = JSON.parse(storedData);
//         setCandidateUser(parsedData);
//         setFormData(prev => ({
//           ...prev,
//           candidate: parseInt(parsedData.user_id) || 0
//         }));
//       }
//     } catch (err) {
//       console.error('Error parsing candidate data:', err);
//       setError('Failed to load candidate information');
//     }
//   };

//   const fetchComplianceRules = async () => {
//     try {
//       const response = await fetch(`${BASE_URL}/api/admin/compliance-categories/`);
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       const result = await response.json();
      
//       if (result.status && result.data) {
//         setComplianceRules(result.data);
//         console.log('✅ Compliance rules loaded:', result.data);
//       }
//     } catch (err) {
//       console.error('Error fetching compliance rules:', err);
//       setError('Failed to load compliance categories');
      
//       Swal.fire({
//         icon: 'error',
//         title: 'Failed to Load Categories',
//         text: err.message || 'An error occurred while loading compliance categories',
//         showConfirmButton: true
//       });
//     }
//   };

//   const fetchCertificateData = async () => {
//     try {
//       setFetchLoading(true);
//       const response = await fetch(`${BASE_URL}/api/candidate/compliance-certificates/${id}/`);
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       const result = await response.json();
      
//       if (result.status && result.data) {
//         const certData = result.data;
//         setFormData({
//           issue_date: certData.issue_date || '',
//           expiry_date: certData.expiry_date || '',
//           certificate_number: certData.certificate_number || '',
//           issuing_authority: certData.issuing_authority || '',
//           document: certData.document || '',
//           is_approved: certData.is_approved !== undefined ? certData.is_approved : true,
//           approved_at: certData.approved_at || new Date().toISOString(),
//           approval_remarks: certData.approval_remarks || '',
//           status: certData.status || 'pending',
//           candidate: certData.candidate || (candidateUser ? parseInt(candidateUser.user_id) : 0),
//           compliance_rule: certData.compliance_rule || '',
//           approved_by_mentor: certData.approved_by_mentor || 0
//         });
//         console.log('✅ Certificate data loaded for edit:', certData);
//       }
//     } catch (err) {
//       setError(err.message);
//       console.error('Error fetching certificate data:', err);
      
//       Swal.fire({
//         icon: 'error',
//         title: 'Failed to Load Certificate',
//         text: err.message || 'An error occurred while loading certificate data',
//         showConfirmButton: true
//       });
//     } finally {
//       setFetchLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
    
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
    
//     // Clear error for this field
//     if (errors[name]) {
//       setErrors(prev => ({ ...prev, [name]: '' }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.issue_date) {
//       newErrors.issue_date = "Issue date is required";
//     }

//     if (!formData.expiry_date) {
//       newErrors.expiry_date = "Expiry date is required";
//     }

//     if (!formData.certificate_number?.trim()) {
//       newErrors.certificate_number = "Certificate number is required";
//     }

//     if (!formData.issuing_authority?.trim()) {
//       newErrors.issuing_authority = "Issuing authority is required";
//     }

//     if (!formData.document) {
//       newErrors.document = "Document is required";
//     }

//     if (!formData.compliance_rule) {
//       newErrors.compliance_rule = "Compliance rule is required";
//     }

//     // Validate that expiry date is after issue date
//     if (formData.issue_date && formData.expiry_date) {
//       const issueDate = new Date(formData.issue_date);
//       const expiryDate = new Date(formData.expiry_date);
      
//       if (expiryDate < issueDate) {
//         newErrors.expiry_date = "Expiry date must be after or equal to issue date";
//       }
//     }

//     const isValid = Object.keys(newErrors).length === 0;
//     setErrors(newErrors);
//     return isValid;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       Swal.fire({
//         icon: 'error',
//         title: 'Validation Failed',
//         text: 'Please check all required fields and try again.',
//         timer: 3000,
//         showConfirmButton: true
//       });
//       return;
//     }

//     setLoading(true);
//     setError('');

//     // Prepare payload according to API requirements
//     const payload = {
//       issue_date: formData.issue_date,
//       expiry_date: formData.expiry_date,
//       certificate_number: formData.certificate_number,
//       issuing_authority: formData.issuing_authority,
//       document: formData.document,
//       is_approved: formData.is_approved,
//       approved_at: formData.approved_at,
//       approval_remarks: formData.approval_remarks || '',
//       status: formData.status,
//       candidate: parseInt(formData.candidate) || 0,
//       compliance_rule: parseInt(formData.compliance_rule) || 0,
//       approved_by_mentor: parseInt(formData.approved_by_mentor) || 0
//     };

//     console.log('Submitting payload:', payload);

//     const method = isEditMode ? 'PUT' : 'POST';
//     const url = isEditMode 
//       ? `${BASE_URL}/api/candidate/compliance-certificates/${id}/` 
//       : `${BASE_URL}/api/candidate/compliance-certificates/`;

//     try {
//       const response = await fetch(url, {
//         method: method,
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(payload)
//       });

//       const responseData = await response.json();

//       if (!response.ok) {
//         throw new Error(responseData.message || `Failed to ${isEditMode ? 'update' : 'create'} compliance certificate`);
//       }

//       await Swal.fire({
//         icon: 'success',
//         title: 'Success!',
//         text: `Compliance certificate has been ${isEditMode ? 'updated' : 'added'} successfully.`,
//         timer: 2000,
//         showConfirmButton: false
//       });
      
//       navigate('/candidate-certifications');
//     } catch (err) {
//       setError(err.message || `Failed to ${isEditMode ? 'update' : 'add'} compliance certificate. Please try again.`);
      
//       Swal.fire({
//         icon: 'error',
//         title: isEditMode ? 'Update Failed' : 'Add Failed',
//         text: err.message || `Failed to ${isEditMode ? 'update' : 'add'} compliance certificate. Please try again.`,
//         timer: 3000,
//         showConfirmButton: true
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async () => {
//     if (!isEditMode) return;

//     const result = await Swal.fire({
//       title: 'Are you sure?',
//       text: "You won't be able to revert this!",
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonColor: '#d33',
//       cancelButtonColor: '#3085d6',
//       confirmButtonText: 'Yes, delete it!'
//     });

//     if (result.isConfirmed) {
//       setLoading(true);
//       try {
//         const response = await fetch(`${BASE_URL}/api/candidate/compliance-certificates/${id}/`, {
//           method: 'DELETE',
//           headers: {
//             'Content-Type': 'application/json',
//           }
//         });

//         if (!response.ok) {
//           throw new Error('Failed to delete certificate');
//         }

//         await Swal.fire({
//           icon: 'success',
//           title: 'Deleted!',
//           text: 'Compliance certificate has been deleted successfully.',
//           timer: 2000,
//           showConfirmButton: false
//         });
        
//         navigate('/candidate-certifications');
//       } catch (err) {
//         Swal.fire({
//           icon: 'error',
//           title: 'Delete Failed',
//           text: err.message || 'Failed to delete certificate. Please try again.',
//           timer: 3000,
//           showConfirmButton: true
//         });
//       } finally {
//         setLoading(false);
//       }
//     }
//   };

//   const handleCancel = () => {
//     navigate('/candidate-certifications');
//   };

//   if (fetchLoading) {
//     return (
//       <div className="ccert-layout-wrapper">
//         <CandidateSidebar />
//         <div className="ccert-main-wrapper">
//           <Header />
//           <div className="ccert-content-area">
//             <div className="text-center p-5">
//               <div className="spinner-border text-primary" role="status">
//                 <span className="visually-hidden">Loading...</span>
//               </div>
//               <p className="mt-2">Loading certificate data...</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="ccert-layout-wrapper">
//       <CandidateSidebar />
      
//       <div className="ccert-main-wrapper">
//         <Header />
        
//         <div className="ccert-content-area">
//           <div className="cert-add-wrapper">
//             {/* Header */}
//             <div className="cert-add-header">
//               <div>
//                 <h2>{isEditMode ? 'Edit Compliance Certificate' : 'Add New Compliance Certificate'}</h2>
//                 <p>{isEditMode ? 'Update your compliance certificate details below' : 'Fill in the compliance certificate details below'}</p>
//               </div>
//             </div>

//             {/* Error Message */}
//             {error && <div className="cert-add-error alert alert-danger">{error}</div>}

//             {/* Form */}
//             <div className="cert-add-form-container">
//               <form onSubmit={handleSubmit}>
//                 <div className="row">
//                   {/* Certificate Number */}
//                   <div className="col-md-6 mb-3">
//                     <label className="form-label">Certificate Number *</label>
//                     <input
//                       type="text"
//                       className={`form-control ${errors.certificate_number ? 'is-invalid' : ''}`}
//                       name="certificate_number"
//                       value={formData.certificate_number}
//                       onChange={handleChange}
//                       placeholder="Enter certificate number"
//                       disabled={loading}
//                     />
//                     {errors.certificate_number && (
//                       <div className="invalid-feedback">{errors.certificate_number}</div>
//                     )}
//                   </div>

//                   {/* Issuing Authority */}
//                   <div className="col-md-6 mb-3">
//                     <label className="form-label">Issuing Authority *</label>
//                     <input
//                       type="text"
//                       className={`form-control ${errors.issuing_authority ? 'is-invalid' : ''}`}
//                       name="issuing_authority"
//                       value={formData.issuing_authority}
//                       onChange={handleChange}
//                       placeholder="Enter issuing authority"
//                       disabled={loading}
//                     />
//                     {errors.issuing_authority && (
//                       <div className="invalid-feedback">{errors.issuing_authority}</div>
//                     )}
//                   </div>

//                   {/* Compliance Rule */}
//                   <div className="col-md-6 mb-3">
//                     <label className="form-label">Compliance Category *</label>
//                     <select
//                       className={`form-control ${errors.compliance_rule ? 'is-invalid' : ''}`}
//                       name="compliance_rule"
//                       value={formData.compliance_rule}
//                       onChange={handleChange}
//                       disabled={loading}
//                     >
//                       <option value="">Select Compliance Category</option>
//                       {complianceRules.map(rule => (
//                         <option key={rule.id} value={rule.id}>
//                           {rule.category_name}
//                         </option>
//                       ))}
//                     </select>
//                     {errors.compliance_rule && (
//                       <div className="invalid-feedback">{errors.compliance_rule}</div>
//                     )}
//                   </div>

//                   {/* Document */}
//                   <div className="col-md-6 mb-3">
//                     <label className="form-label">Document URL/Path *</label>
//                     <input
//                       type="text"
//                       className={`form-control ${errors.document ? 'is-invalid' : ''}`}
//                       name="document"
//                       value={formData.document}
//                       onChange={handleChange}
//                       placeholder="Enter document URL or file path"
//                       disabled={loading}
//                     />
//                     {errors.document && (
//                       <div className="invalid-feedback">{errors.document}</div>
//                     )}
//                     <small className="text-muted">
//                       Provide the URL or path to the certificate document
//                     </small>
//                   </div>

//                   {/* Issue Date */}
//                   <div className="col-md-6 mb-3">
//                     <label className="form-label">Issue Date *</label>
//                     <input
//                       type="date"
//                       className={`form-control ${errors.issue_date ? 'is-invalid' : ''}`}
//                       name="issue_date"
//                       value={formData.issue_date}
//                       onChange={handleChange}
//                       disabled={loading}
//                     />
//                     {errors.issue_date && (
//                       <div className="invalid-feedback">{errors.issue_date}</div>
//                     )}
//                   </div>

//                   {/* Expiry Date */}
//                   <div className="col-md-6 mb-3">
//                     <label className="form-label">Expiry Date *</label>
//                     <input
//                       type="date"
//                       className={`form-control ${errors.expiry_date ? 'is-invalid' : ''}`}
//                       name="expiry_date"
//                       value={formData.expiry_date}
//                       onChange={handleChange}
//                       disabled={loading}
//                     />
//                     {errors.expiry_date && (
//                       <div className="invalid-feedback">{errors.expiry_date}</div>
//                     )}
//                   </div>

//                   {/* Status */}
//                   <div className="col-md-6 mb-3">
//                     <label className="form-label">Status</label>
//                     <select
//                       className="form-control"
//                       name="status"
//                       value={formData.status}
//                       onChange={handleChange}
//                       disabled={loading}
//                     >
//                       <option value="pending">Pending</option>
//                       <option value="approved">Approved</option>
//                       <option value="rejected">Rejected</option>
//                     </select>
//                   </div>

//                   {/* Approval Remarks */}
//                   <div className="col-md-6 mb-3">
//                     <label className="form-label">Approval Remarks</label>
//                     <input
//                       type="text"
//                       className="form-control"
//                       name="approval_remarks"
//                       value={formData.approval_remarks}
//                       onChange={handleChange}
//                       placeholder="Enter approval remarks (if any)"
//                       disabled={loading}
//                     />
//                   </div>

//                   {/* Approval Status */}
//                   <div className="col-12 mb-3">
//                     <div className="form-check">
//                       <input
//                         type="checkbox"
//                         className="form-check-input"
//                         name="is_approved"
//                         checked={formData.is_approved}
//                         onChange={handleChange}
//                         id="isApproved"
//                         disabled={loading}
//                       />
//                       <label className="form-check-label" htmlFor="isApproved">
//                         Approved
//                       </label>
//                     </div>
//                     <small className="text-muted">
//                       Check if this certificate is approved
//                     </small>
//                   </div>
//                 </div>

//                 {/* Note */}
//                 <div className="cert-add-note mb-4">
//                   <small className="text-muted">
//                     Note: Fields marked with * are required. Please ensure all information is accurate.
//                   </small>
//                 </div>

//                 {/* Form Actions */}
//                 <div className="cert-add-actions">
//                   <button 
//                     type="button" 
//                     className="btn btn-outline-secondary me-2"
//                     onClick={handleCancel}
//                     disabled={loading}
//                   >
//                     Cancel
//                   </button>
//                   {isEditMode && (
//                     <button 
//                       type="button" 
//                       className="btn btn-danger me-2"
//                       onClick={handleDelete}
//                       disabled={loading}
//                     >
//                       Delete
//                     </button>
//                   )}
//                   <button 
//                     type="submit" 
//                     className="btn btn-primary"
//                     disabled={loading}
//                   >
//                     {loading ? (isEditMode ? 'Updating...' : 'Adding...') : (isEditMode ? 'Update Certificate' : 'Add Certificate')}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddCertificate;