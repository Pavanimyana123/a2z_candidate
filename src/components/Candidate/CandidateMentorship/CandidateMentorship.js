import React from "react";
import CandidateSidebar from "../Layout/CandidateSidebar";
import Header from "../Layout/CandidateHeader";
import { FaUsers, FaCommentDots, FaCalendarAlt, FaCheckCircle } from "react-icons/fa";
import "./CandidateMentorship.css";

const CandidateMentorship = () => {
  return (
    <div className="cm-layout-wrapper">

      <CandidateSidebar />

      <div className="cm-main-wrapper">

        <Header />

        <div className="cm-content-area container-fluid">

          {/* ================= IMAGE 1 ================= */}

          {/* Page Header */}
          <div className="d-flex justify-content-between align-items-start mb-4">
            <div>
              <h3 className="cm-title">Mentorship</h3>
              <p className="cm-sub">Connect with experienced professionals</p>
            </div>

            <button className="btn cm-primary-btn">
              <FaUsers className="me-2" />
              Find a Mentor
            </button>
          </div>

          {/* Your Mentor */}
          <div className="cm-card mb-4">
            <h5>Your Mentor</h5>
            <p className="cm-muted">Your assigned senior guide</p>

            <div className="cm-mentor-box">

              <div className="d-flex align-items-center gap-3">

                <div className="cm-avatar">SM</div>

                <div>
                  <h6 className="mb-1">Dr. Sarah Mitchell</h6>
                  <p className="cm-muted mb-2">
                    Principal / Authority • Level 5
                  </p>

                  <span className="cm-tag">
                    Marine Structural Inspection
                  </span>
                </div>

              </div>

              <div className="d-flex gap-2">
                <button className="btn cm-outline-btn">
                  <FaCommentDots className="me-2" />
                  Message
                </button>

                <button className="btn cm-outline-btn">
                  <FaCalendarAlt className="me-2" />
                  Schedule
                </button>
              </div>

            </div>
          </div>

          {/* ================= IMAGE 2 CONTINUATION ================= */}

          {/* Milestones */}
          <div className="cm-card mb-4">

            <div className="d-flex justify-content-between">
              <div>
                <h5>Your Milestones</h5>
                <p className="cm-muted">Track your mentorship journey</p>
              </div>

              <div className="text-end">
                <h4>6/8</h4>
                <span className="cm-muted small">completed</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="cm-progress">
              <div className="cm-progress-fill" />
            </div>

            {/* Completed Items */}
            <Milestone title="Complete Safety Induction" date="Completed 20 Jun 2023" />
            <Milestone title="First Field Inspection" date="Completed 15 Jul 2023" />
            <Milestone title="Manufacturing Rotation" date="Completed 15 Oct 2023" />
            <Milestone title="Coating Rotation" date="Completed 16 Jan 2024" />
            <Milestone title="First Certification (API 510)" date="Completed 01 Aug 2023" />
            <Milestone title="Level 2 Promotion" date="Completed 17 Jan 2024" />

            {/* Pending */}
            <PendingMilestone index="7" title="Complete QA/QC Rotation" />
            <PendingMilestone index="8" title="Second Certification" />

          </div>

          {/* Available Mentors */}
          <div className="cm-card">

            <h5>Available Mentors</h5>
            <p className="cm-muted">
              Senior professionals you can connect with
            </p>

            <div className="row g-4 mt-2">

              <MentorCard
                initials="DSM"
                name="Dr. Sarah Mitchell"
                role="Principal"
                tag="Marine Structural Inspection"
                level="Level 5"
                mentees="4 mentees"
              />

              <MentorCard
                initials="JW"
                name="James Wong"
                role="Senior Surveyor"
                tag="Coating & Corrosion"
                level="Level 4"
                mentees="3 mentees"
              />

              <MentorCard
                initials="MT"
                name="Michael Torres"
                role="Lead Surveyor"
                tag="NDT & Quality"
                level="Level 4"
                mentees="2 mentees"
              />

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

/* ================= SUB COMPONENTS ================= */

const Milestone = ({ title, date }) => (
  <div className="cm-milestone">
    <div className="d-flex align-items-center gap-3">
      <div className="cm-check">
        <FaCheckCircle />
      </div>

      <div>
        <strong>{title}</strong>
        <p className="cm-muted small">{date}</p>
      </div>
    </div>

    <span className="cm-approved">Approved</span>
  </div>
);

const PendingMilestone = ({ index, title }) => (
  <div className="cm-pending">
    <div className="cm-number">{index}</div>
    <strong>{title}</strong>
  </div>
);

const MentorCard = ({ initials, name, role, tag, level, mentees }) => (
  <div className="col-lg-4">
    <div className="cm-mentor-card">

      <div className="d-flex gap-3">
        <div className="cm-avatar-light">{initials}</div>

        <div>
          <h6>{name}</h6>
          <p className="cm-muted">{role}</p>
        </div>
      </div>

      <span className="cm-tag mt-3 d-inline-block">{tag}</span>

      <div className="d-flex justify-content-between mt-3">
        <span className="cm-muted">{level}</span>
        <span className="cm-muted">{mentees}</span>
      </div>

    </div>
  </div>
);

export default CandidateMentorship;
