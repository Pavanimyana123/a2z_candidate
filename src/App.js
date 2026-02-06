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

      </Routes>
    </Router>
  );
}

export default App;