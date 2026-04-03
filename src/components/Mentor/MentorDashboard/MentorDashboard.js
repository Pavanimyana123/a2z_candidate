import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MentorSidebar from "../Layout/MentorSidebar";
import Header from "../Layout/MentorHeader";
import "./MentorDashboard.css";
import { BASE_URL } from "../../../ApiUrl";


const MentorDashboardPage = () => {
  const navigate = useNavigate();
  const [mentorData, setMentorData] = useState(null);
  const [totalCandidates, setTotalCandidates] = useState(0);
  const [pendingLogbooks, setPendingLogbooks] = useState(0);
  const [recentCandidates, setRecentCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mentorName, setMentorName] = useState("");

  // Get mentor from localStorage
  const getMentorFromStorage = () => {
    const storedData = localStorage.getItem("mentor_user");
    if (storedData) {
      try {
        return JSON.parse(storedData);
      } catch (error) {
        console.error("Error parsing mentor data:", error);
        return null;
      }
    }
    return null;
  };

  // Helper function to get initials from name
  const getInitials = (name) => {
    if (!name) return "??";
    const nameParts = name.split(" ");
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
  };

  // Helper function to determine status based on hours and level
  const getCandidateStatus = (totalHours, targetLevel) => {
    // Logic to determine status (you can adjust these thresholds)
    if (totalHours > 500) return { text: "Compliant", class: "ta-status-green" };
    if (totalHours > 200) return { text: "At Risk", class: "ta-status-orange" };
    return { text: "Pending", class: "ta-status-yellow" };
  };

  // Handle card click navigation
  const handleCardClick = (path) => {
    navigate(path);
  };

  // Fetch data
  useEffect(() => {
    const fetchMentorData = async () => {
      try {
        const mentor = getMentorFromStorage();
        if (!mentor) {
          setLoading(false);
          return;
        }

        setMentorData(mentor);
        setMentorName(mentor.full_name);

        // Fetch mentorship assignments
        const assignmentsResponse = await fetch(`${BASE_URL}/api/mentor/mentorship-assignments/`);
        const assignmentsData = await assignmentsResponse.json();
        
        // Fetch digital logbook entries
        const logbookResponse = await fetch(`${BASE_URL}/api/candidate/digital-logbook/`);
        const logbookData = await logbookResponse.json();
        
        // Fetch candidates data to get more details
        const candidatesResponse = await fetch(`${BASE_URL}/api/candidate/candidates/`);
        const candidatesData = await candidatesResponse.json();
        
        if (assignmentsData.status && assignmentsData.data) {
          // Filter assignments for the logged-in mentor
          const mentorAssignments = assignmentsData.data.filter(
            assignment => assignment.mentor_name === mentor.full_name
          );
          
          // Count unique candidates (based on candidate_name)
          const uniqueCandidates = [...new Set(mentorAssignments.map(a => a.candidate_name))];
          setTotalCandidates(uniqueCandidates.length);
          
          // Count pending logbooks
          if (logbookData.status && logbookData.data) {
            const pendingLogs = logbookData.data.filter(
              entry => entry.reviewed_by === mentor.full_name && entry.verification_status === "pending"
            );
            setPendingLogbooks(pendingLogs.length);
          }
          
          // Process recent candidates data
          const candidatesList = [];
          
          for (const assignment of mentorAssignments) {
            const candidateName = assignment.candidate_name;
            
            // Get candidate details from candidates API
            const candidateDetails = candidatesData.status && candidatesData.data
              ? candidatesData.data.find(c => c.full_name === candidateName)
              : null;
            
            // Get all logbook entries for this candidate
            const candidateLogbooks = logbookData.status && logbookData.data
              ? logbookData.data.filter(entry => entry.candidate_name === candidateName)
              : [];
            
            // Calculate total hours for this candidate
            const totalHours = candidateLogbooks.reduce((sum, entry) => {
              return sum + (parseFloat(entry.total_hours) || 0);
            }, 0);
            
            // Get the target level from assignment
            const targetLevel = assignment.target_level_name || "Level 0";
            const levelNumber = targetLevel.match(/\d+/);
            const levelText = levelNumber ? `Level ${levelNumber[0]}` : targetLevel;
            
            // Get status
            const status = getCandidateStatus(totalHours, targetLevel);
            
            candidatesList.push({
              name: candidateName,
              initials: getInitials(candidateName),
              level: levelText,
              hours: Math.round(totalHours),
              status: status.text,
              statusClass: status.class,
              assignmentDate: assignment.created_at,
              department: assignment.department_name
            });
          }
          
          // Sort by assignment date (most recent first) and take first 4
          const sortedCandidates = candidatesList.sort((a, b) => 
            new Date(b.assignmentDate) - new Date(a.assignmentDate)
          ).slice(0, 4);
          
          setRecentCandidates(sortedCandidates);
        }
        
      } catch (error) {
        console.error("Error fetching mentor data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMentorData();
  }, []);

  return (
    <div className="ta-layout-wrapper">

      {/* Sidebar */}
      <MentorSidebar />

      {/* Main Area */}
      <div className="ta-main-wrapper">

        {/* Header */}
        <Header />

        {/* Dashboard Content */}
        <div className="ta-content-area">
          <div className="ta-dashboard">

            {/* Heading */}
            <div className="ta-dashboard-header mb-4">
              <h4 className="fw-semibold">Mentor Dashboard</h4>
              <p className="text-muted mb-0">
                Welcome back, {mentorName || "Mentor"}. Here's your supervision overview.
              </p>
            </div>

            {/* Stat Cards */}
            <div className="row g-3 mb-4">

              {/* Total Candidates Card - Clickable */}
              <div className="col-md-3">
                <div 
                  className="ta-stat-card clickable-card" 
                  onClick={() => handleCardClick("/mentor-candidates")}
                  style={{ cursor: "pointer" }}
                >
                  <div>
                    <p className="ta-stat-title">Total Candidates</p>
                    <h3>{loading ? "Loading..." : totalCandidates}</h3>
                    {/* <small className="text-muted">Under supervision</small> */}
                  </div>
                  <div className="ta-stat-icon ta-blue-bg">👥</div>
                </div>
              </div>

              {/* Pending Logbooks Card */}
              <div className="col-md-3">
                <div className="ta-stat-card">
                  <div>
                    <p className="ta-stat-title">Pending Logbooks</p>
                    <h3>{loading ? "Loading..." : pendingLogbooks}</h3>
                    {/* <small className="text-muted">Awaiting approval</small> */}
                  </div>
                  <div className="ta-stat-icon ta-yellow-bg">📘</div>
                </div>
              </div>

              {/* Evidence Reviews Card */}
              <div className="col-md-3">
                <div className="ta-stat-card">
                  <div>
                    <p className="ta-stat-title">Evidence Reviews</p>
                    <h3>12</h3>
                    {/* <small className="text-muted">Need attention</small> */}
                  </div>
                  <div className="ta-stat-icon ta-grey-bg">📋</div>
                </div>
              </div>

              {/* Promotion Ready Card */}
              <div className="col-md-3">
                <div className="ta-stat-card">
                  <div>
                    <p className="ta-stat-title">Promotion Ready</p>
                    <h3>3</h3>
                    {/* <small className="text-muted">Eligible candidates</small> */}
                  </div>
                  <div className="ta-stat-icon ta-green-bg">🏅</div>
                </div>
              </div>

            </div>

            {/* Bottom Section */}
            <div className="row g-3">

              {/* Recent Candidates */}
              <div className="col-lg-8">
                <div className="ta-card">

                  <div className="ta-card-header">
                    <h6 className="mb-0">Recent Candidates</h6>
                    <span className="ta-view-all">View all →</span>
                  </div>

                  {loading ? (
                    <div className="text-center py-4">Loading candidates...</div>
                  ) : recentCandidates.length === 0 ? (
                    <div className="text-center py-4">No candidates assigned yet</div>
                  ) : (
                    <table className="table ta-table align-middle">
                      <thead>
                        <tr>
                          <th>CANDIDATE</th>
                          <th>LEVEL</th>
                          <th>HOURS</th>
                          <th>STATUS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentCandidates.map((candidate, index) => (
                          <tr key={index}>
                            <td>
                              <div className="ta-candidate">
                                <div className="ta-candidate-avatar">{candidate.initials}</div>
                                {candidate.name}
                              </div>
                            </td>
                            <td><span className="ta-badge-level">{candidate.level}</span></td>
                            <td>{candidate.hours}h</td>
                            <td><span className={`ta-status ${candidate.statusClass}`}>{candidate.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                </div>
              </div>

              {/* Compliance Alerts */}
              <div className="col-lg-4">
                <div className="ta-card">
                  <h6 className="mb-3">Compliance Alerts</h6>

                  <div className="ta-alert ta-alert-danger">
                    Kavitha Nair - Medical certificate expired 3 days ago
                  </div>

                  <div className="ta-alert ta-alert-warning">
                    Ananya Reddy - PPE certification expiring in 7 days
                  </div>

                  <div className="ta-alert ta-alert-info">
                    Priya Sharma eligible for Level 3 promotion review
                  </div>

                </div>
              </div>

            </div>

            {/* Exposure + Quick Actions Section */}
            <div className="row g-3 mt-1">

              {/* Exposure Hours Summary */}
              <div className="col-lg-8">
                <div className="ta-card">

                  <h6 className="mb-3">Exposure Hours Summary</h6>

                  {/* Bar Chart */}
                  <div className="ta-chart-wrapper">
                    <div className="ta-chart-bars">
                      {[
                        { day: "Mon", value: 80 },
                        { day: "Tue", value: 70 },
                        { day: "Wed", value: 90 },
                        { day: "Thu", value: 65 },
                        { day: "Fri", value: 60 },
                        { day: "Sat", value: 25 },
                        { day: "Sun", value: 20 }
                      ].map((item, index) => (
                        <div key={index} className="ta-bar-container">
                          <div
                            className="ta-bar"
                            style={{ height: `${item.value}%` }}
                          />
                          <span>{item.day}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Summary Stats */}
                  <div className="ta-exposure-stats">
                    <div>
                      <h4>24h</h4>
                      <p>Today</p>
                    </div>

                    <div>
                      <h4>156h</h4>
                      <p>This Week</p>
                    </div>

                    <div>
                      <h4>624h</h4>
                      <p>This Month</p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Quick Actions */}
              <div className="col-lg-4">
                <div className="ta-card">

                  <h6 className="mb-3">Quick Actions</h6>

                  <button className="ta-quick-btn">
                    📘 Review Logbook Entries
                  </button>

                  <button className="ta-quick-btn">
                    📄 Review Evidence
                  </button>

                  <button className="ta-quick-btn">
                    ⏱ Check Compliance Status
                  </button>

                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorDashboardPage;