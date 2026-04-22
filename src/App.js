// App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./components/Pages/Login/Login";
import ForgotPassword from "./components/Pages/Login/ForgotPassword";
import Dashboard from "./components/Admin/Dashboard/Dashboard";
import Users from "./components/Admin/Users/Users"
import AddUsers from "./components/Admin/Users/AddUsers"
import Candidate from "./components/Admin/Candidates/Candidates";
import CandidateForm from "./components/Admin/Candidates/AddCandidate";
import Mentors from "./components/Admin/Mentors/Mentors";
import AddMentor from "./components/Admin/Mentors/AddMentors";
import LevelsManagement from "./components/Admin/LevelManagement/LevelManagement";
import AddLevel from "./components/Admin/LevelManagement/AddLevel";
import DepartmentManagement from "./components/Admin/DepartmentManagement/DepartmentManagement";
import AddDepartment from "./components/Admin/DepartmentManagement/AddDepartmentManagament";
import DepartmentLevel from "./components/Admin/DepartmentLevel/DepartmentLevel";
import AddDepartmentLevel from "./components/Admin/DepartmentLevel/AddDepartmentLevel";
import RotationProgram from "./components/Admin/RotationProgram/RotationProgram";
import AdminCompetency from "./components/Admin/Competency/AdminCompetency"
import AddAdminCompetency from "./components/Admin/Competency/AddAdminCompetency";
import ComplianceManagement from "./components/Admin/ComplianceManagement/ComplianceManagement";
import AddCompliance from './components/Admin/ComplianceManagement/AddComplianceManagement';
import AddComplianceCertificate from "./components/Candidate/CandidateCompliance/AddCandidateCompliance"
import AuditLogs from "./components/Admin/AuditLogs/AuditLogs";
import Certifications from "./components/Admin/Certificate/Certificate";
import CertificationCategories from "./components/Admin/Certificate/CertificateCategory"
import ReportsAnalytics from "./components/Admin/Reports/Reports";
import SystemSettings from "./components/Admin/SystemSettings/SystemSettings";
import EmailSettings from "./components/Admin/EmailSettings/EmailSettings";
import AddEmailSettings from "./components/Admin/EmailSettings/AddEmailSettings";

import CandidateLayout from "./components/Candidate/Layout/CandidateLayout";
import MentorLayout from "./components/Mentor/Layout/MentorLayout";
import MentorDashboard from "./components/Mentor/MentorDashboard/MentorDashboard"
import MentorCandidates from "./components/Mentor/MentorCandidates/MentorCandidates";
import MentorCandidatesCompetency from "./components/Mentor/MentorCandidates/MentorCandidateCompetency"
import MentorLogbookDetails from './components/Mentor/MentorCandidates/MentorLogBookDetails';
import MentorCompetencyReview from "./components/Mentor/MentorCandidates/MentorCompetencyReview";
import MentorRequests from "./components/Mentor/MentorRequests/MentorRequests";
import MentorLogBook from "./components/Mentor/MentorLogBook/MentorLogBook";
import MentorEvidence from "./components/Mentor/MentorEvidence/MentorEvidence";
import MentorRotation from "./components/Mentor/MentorRotation/MentorRotation";
import MentorCompliance from "./components/Mentor/MentorCompliance/MentorCompliance";
import MentorFeedback from "./components/Mentor/MentorFeedback/MentorFeedback";
import MentorReports from "./components/Mentor/MentorReports/MentorReports";
import MentorCertificatesPage from "./components/Mentor/MentorCertificates/MentorCertificates";
import ProgressionManagement from "./components/Mentor/ProgressionManagement/ProgressionManagement";

import CandidateDashboard from "./components/Candidate/CandidateDasboard/CandidateDashboard"
import CandidateProfessionalIdentity from "./components/Candidate/CandidateProfessionality/CandidateProfessionality";
import CandidateDigitalLogbook from "./components/Candidate/CandidateDigitalLogBox/CandidateDigitalLogBox";
import CandidateDigitalLogbookDetails from './components/Candidate/CandidateDigitalLogBox/CandidateDigitalLogDetails';
import AddLogbookEntry from "./components/Candidate/CandidateDigitalLogBox/AddCandidateLogEntry";
import CandidateCompetency from "./components/Candidate/CandidateCompetency/CandidateCompetency";
import CompetenceForm from "./components/Candidate/CandidateCompetency/AddCandidateCompetency";
import AddEvidence from "./components/Candidate/CandidateEvidance/CandidateEvidance";
import CandidateRotation from "./components/Candidate/CandidateRotation/CandidateRotation"
import CandidateCompliance from "./components/Candidate/CandidateCompliance/CandidateCompliance";
import CandidateCertifications from "./components/Candidate/CandidateCertification/CartificationCertificate";
import AddCandidateCertificate from './components/Candidate/CandidateCertification/AddCandidateCertificate';
import CandidateLearning from "./components/Candidate/CandidateLearning/CandidateLearning";
import CandidateMentorship from "./components/Candidate/CandidateMentorship/CandidateMentorship";
import FindMentor from './components/Candidate/CandidateMentorship/FindMentor';
import Learning from "./components/Admin/Learning/Learning";
import AddLearning from './components/Admin/Learning/AddLearning';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
         <Route path="/users" element={<Users />} />
            <Route path="/add-admin-users" element={<AddUsers />} />
            <Route path="/add-admin-users/:id" element={<AddUsers />} />
        <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/candidate" element={<Candidate />} />
          <Route path="/add-candidate" element={<CandidateForm />} />
          <Route path="/add-candidate/:id" element={<CandidateForm />} />
           <Route path="/mentor" element={<Mentors />} />
             <Route path="/add-mentor" element={<AddMentor />} />
               <Route path="/add-mentor/:id" element={<AddMentor />} />
            <Route path="/level" element={<LevelsManagement />} />
            <Route path="/levels/add" element={<AddLevel />} />
            <Route path="/levels/edit/:id" element={<AddLevel />} />
            <Route path="/department" element={<DepartmentManagement />} />
            <Route path="/department/add" element={<AddDepartment />} />
            <Route path="/department/edit/:id" element={<AddDepartment />} />
            <Route path="/department-level" element={<DepartmentLevel />} />
            <Route path="/add-department-level" element={<AddDepartmentLevel />} />
             <Route path="/edit-department-level/:id" element={<AddDepartmentLevel />} />
            <Route path="/rotation" element={<RotationProgram />} />
            <Route path="/admin-competency" element={<AdminCompetency />} />
            <Route path="/admin-add-competency" element={<AddAdminCompetency />} />
            <Route path="/compliance" element={<ComplianceManagement />} />
            <Route path="/compliance/add" element={<AddCompliance />} />
            <Route path="/compliance/edit/:id" element={<AddCompliance />} />
            <Route path="/certificate" element={<Certifications />} />
            <Route path="/certification-categories" element={<CertificationCategories />} />
            <Route path="/learning" element={<Learning />} />
            <Route path="/add-learning" element={<AddLearning />} />
            <Route path="/add-learning/:id" element={<AddLearning />} />
            <Route path="/report" element={<ReportsAnalytics />} />
            <Route path="/audit" element={<AuditLogs />} />
            <Route path="/system" element={<SystemSettings />} />
            <Route path="/email-settings" element={<EmailSettings />} />
            <Route path="/add-email-settings" element={<AddEmailSettings />} />
            <Route path="/add-email-settings/:id" element={<AddEmailSettings />} />

             {/* <Route path="/candidate-layout" element={<CandidateLayout />} />
             <Route path="/mentor-layout" element={<MentorLayout />} /> */}
              <Route path="/mentor-dashboard" element={<MentorDashboard />} />
              <Route path="/mentor-candidates" element={<MentorCandidates />} />
              <Route path="/mentor-candidate-competency" element={<MentorCandidatesCompetency />} />
              <Route path="/mentor-competency-review/:competencyId" element={<MentorCompetencyReview />} />
              <Route path="/mentor/logbook/:id" element={<MentorLogbookDetails />} />
               <Route path="/mentor-requests" element={<MentorRequests />} />
              <Route path="/mentor-logbook" element={<MentorLogBook />} />
              <Route path="/mentor-evidence" element={<MentorEvidence />} />
              <Route path="/mentor-rotation" element={<MentorRotation />} />
              <Route path="/mentor-compliance" element={<MentorCompliance />} />
              <Route path="/mentor-certificates" element={<MentorCertificatesPage />} />
               <Route path="/mentor-feedback" element={<MentorFeedback />} />
                <Route path="/mentor-reports" element={<MentorReports />} />
                <Route path="/progression-management" element={<ProgressionManagement />} />



              <Route path="/candidate-dashboard" element={<CandidateDashboard />} />
              <Route path="/candidate-professionality" element={<CandidateProfessionalIdentity />} />
              <Route path="/candidate-digital" element={<CandidateDigitalLogbook />} />
              <Route path="/candidate/logbook/add" element={<AddLogbookEntry />} />
              <Route path="/candidate/logbook/edit/:id" element={<AddLogbookEntry />} />
              <Route path="/candidate/logbook/:id" element={<CandidateDigitalLogbookDetails />} />
               <Route path="/candidate-competence" element={<CandidateCompetency />} />
               <Route path="/add-competence" element={<CompetenceForm />} />
                <Route path="/add-evidence" element={<AddEvidence />} />
                <Route path="/add-evidence/:id" element={<AddEvidence />} />
               <Route path="/candidate-rotation" element={<CandidateRotation />} />
               <Route path="/candidate-compliance" element={<CandidateCompliance />} />
                <Route path="/candidate-compliance/add-certificate" element={<AddComplianceCertificate />} />
               <Route path="/candidate-compliance/edit-certificate/:id" element={<AddComplianceCertificate />} />
                <Route path="/candidate-certificate" element={<CandidateCertifications />} />
                 <Route path="/candidate-certifications/add" element={<AddCandidateCertificate />} />
                <Route path="/candidate-certifications/edit/:id" element={<AddCandidateCertificate />} />
                 <Route path="/candidate-learning" element={<CandidateLearning />} />
                 <Route path="/candidate-mentorship" element={<CandidateMentorship />} />
                 <Route path="/find-mentor" element={<FindMentor />} />




      </Routes>
    </Router>
  );
}

export default App;