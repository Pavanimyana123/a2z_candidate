// App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./components/Pages/Login/Login";
import Dashboard from "./components/Admin/Dashboard/Dashboard";
import Candidate from "./components/Admin/Candidates/Candidates";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/candidate" element={<Candidate />} />
      </Routes>
    </Router>
  );
}

export default App;