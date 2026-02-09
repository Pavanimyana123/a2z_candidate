// App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./components/Pages/Login/Login";
import Dashboard from "./components/Admin/Dashboard/Dashboard";
import Candidate from "./components/Admin/Candidates/Candidates";
import Mentors from "./components/Admin/Mentors/Mentors";
import LevelsManagement from "./components/Admin/LevelManagement/LevelManagement";
import DepartmentManagement from "./components/Admin/DepartmentManagement/DepartmentManagement";
import RotationProgram from "./components/Admin/RotationProgram/RotationProgram";
import ComplianceManagement from "./components/Admin/ComplianceManagement/ComplianceManagement";
import AuditLogs from "./components/Admin/AuditLogs/AuditLogs";
import Certifications from "./components/Admin/Certificate/Certificate";
import ReportsAnalytics from "./components/Admin/Reports/Reports";
import SystemSettings from "./components/Admin/SystemSettings/SystemSettings";
import CandidateLayout from "./components/Candidate/Layout/CandidateLayout";
import MentorLayout from "./components/Mentor/Layout/MentorLayout";
import MentorDashboard from "./components/Mentor/MentorDashboard/MentorDashboard"
import MentorCandidates from "./components/Mentor/MentorCandidates/MentorCandidates";
import MentorLogBook from "./components/Mentor/MentorLogBook/MentorLogBook";
import MentorEvidence from "./components/Mentor/MentorEvidence/MentorEvidence";
import MentorRotation from "./components/Mentor/MentorRotation/MentorRotation";
import MentorCompliance from "./components/Mentor/MentorCompliance/MentorCompliance";
import MentorFeedback from "./components/Mentor/MentorFeedback/MentorFeedback";
import MentorReports from "./components/Mentor/MentorReports/MentorReports";

import CandidateDashboard from "./components/Candidate/CandidateDasboard/CandidateDashboard"
import CandidateProfessionalIdentity from "./components/Candidate/CandidateProfessionality/CandidateProfessionality";
import CandidateDigitalLogbook from "./components/Candidate/CandidateDigitalLogBox/CandidateDigitalLogBox";
import CandidateCompetency from "./components/Candidate/CandidateCompetency/CandidateCompetency";
import CandidateRotation from "./components/Candidate/CandidateRotation/CandidateRotation"
import CandidateCompliance from "./components/Candidate/CandidateCompliance/CandidateCompliance";
import CandidateCertifications from "./components/Candidate/CandidateCertification/CartificationCertificate";
import CandidateLearning from "./components/Candidate/CandidateLearning/CandidateLearning";
import CandidateMentorship from "./components/Candidate/CandidateMentorship/CandidateMentorship";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/candidate" element={<Candidate />} />
           <Route path="/mentor" element={<Mentors />} />
            <Route path="/level" element={<LevelsManagement />} />
            <Route path="/department" element={<DepartmentManagement />} />
            <Route path="/rotation" element={<RotationProgram />} />
            <Route path="/compliance" element={<ComplianceManagement />} />
             <Route path="/certificate" element={<Certifications />} />
               <Route path="/report" element={<ReportsAnalytics />} />
            <Route path="/audit" element={<AuditLogs />} />
            <Route path="/system" element={<SystemSettings />} />


             {/* <Route path="/candidate-layout" element={<CandidateLayout />} />
             <Route path="/mentor-layout" element={<MentorLayout />} /> */}
              <Route path="/mentor-dashboard" element={<MentorDashboard />} />
              <Route path="/mentor-candidates" element={<MentorCandidates />} />
              <Route path="/mentor-logbook" element={<MentorLogBook />} />
              <Route path="/mentor-evidence" element={<MentorEvidence />} />
              <Route path="/mentor-rotation" element={<MentorRotation />} />
              <Route path="/mentor-compliance" element={<MentorCompliance />} />
               <Route path="/mentor-feedback" element={<MentorFeedback />} />
                <Route path="/mentor-reports" element={<MentorReports />} />


              <Route path="/candidate-dashboard" element={<CandidateDashboard />} />
              <Route path="/candidate-professionality" element={<CandidateProfessionalIdentity />} />
              <Route path="/candidate-digital" element={<CandidateDigitalLogbook />} />
               <Route path="/candidate-competence" element={<CandidateCompetency />} />
               <Route path="/candidate-rotation" element={<CandidateRotation />} />
               <Route path="/candidate-compliance" element={<CandidateCompliance />} />
                <Route path="/candidate-certificate" element={<CandidateCertifications />} />
                 <Route path="/candidate-learning" element={<CandidateLearning />} />
                 <Route path="/candidate-mentorship" element={<CandidateMentorship />} />




      </Routes>
    </Router>
  );
}

export default App;