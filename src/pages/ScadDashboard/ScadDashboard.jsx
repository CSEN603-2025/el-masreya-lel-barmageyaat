import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBuilding,
  FaCheckCircle,
  FaTimesCircle,
  FaFileAlt,
  FaEnvelope,
  FaIndustry,
  FaUsers,
  FaTimes,
} from "react-icons/fa";
import "./ScadDashboard.css";

function ScadDashboard({ companyUsers, setCompanyUsers }) {
  const navigate = useNavigate();
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleApprove = (companyId) => {
    setCompanyUsers(
      companyUsers.map((company) =>
        company.id === companyId ? { ...company, status: "approved" } : company
      )
    );
    setShowModal(false);
  };

  const handleReject = (companyId) => {
    setCompanyUsers(
      companyUsers.map((company) =>
        company.id === companyId ? { ...company, status: "rejected" } : company
      )
    );
    setShowModal(false);
  };

  const viewCompanyDetails = (company) => {
    setSelectedCompany(company);
    setShowModal(true);
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>SCAD Office</h2>
          <div className="sidebar-divider"></div>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li>
              <Link to="/login">
                <i className="nav-icon logout-icon">🚪</i>
                Logout
              </Link>
            </li>
          </ul>
        </nav>
        <div className="sidebar-footer">
          <p>© 2023 SCAD Office</p>
        </div>
      </aside>

      <main className="dashboard-main">
        <div className="dashboard-header">
          <h1>SCAD Dashboard</h1>
          <div className="dashboard-actions">
            <div className="date-display">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
        </div>

        <div className="dashboard-sections">
          <div className="section-header">
            <h2>Quick Actions</h2>
          </div>

          <div className="dashboard-cards">
            <div className="dashboard-card">
              <div className="card-icon student-icon">👨‍🎓</div>
              <h2>Student Management</h2>
              <p>View and manage student profiles and internship progress.</p>
              <Link to="/AllStudents" className="card-button">
                View Students
              </Link>
            </div>

            <div className="dashboard-card">
              <div className="card-icon company-icon">🏢</div>
              <h2>Company Requests</h2>
              <p>Review and manage company registration requests.</p>
              <Link to="/ViewCompanyRequest" className="card-button">
                View Requests
              </Link>
            </div>

            <div className="dashboard-card">
              <div className="card-icon cycle-icon">🔄</div>
              <h2>Internship Cycle Management</h2>
              <p>
                Set the start and end dates for the current internship cycle and
                manage past cycles.
              </p>
              <Link to="/InternshipCycleSettings" className="card-button">
                Manage Cycles
              </Link>
            </div>

            <div className="dashboard-card">
              <div className="card-icon reports-icon">📊</div>
              <h2>Generate Reports</h2>
              <p>
                Create detailed reports about students, companies, and
                internship progress.
              </p>
              <Link to="/scad-reports" className="card-button">
                Generate Reports
              </Link>
            </div>

            <div className="dashboard-card">
              <div className="card-icon view-icon">📋</div>
              <h2>View Submitted Reports</h2>
              <p>
                Access and review all reports and evaluations submitted by
                students.
              </p>
              <Link to="/scad-submitted-reports" className="card-button">
                View Submissions
              </Link>
            </div>

            <div className="dashboard-card">
              <h3>Company Evaluations</h3>
              <p>
                View and manage evaluations submitted by companies for their
                interns
              </p>
              <button
                className="dashboard-button"
                onClick={() => navigate("/scad/company-evaluations")}
              >
                View Company Evaluations
              </button>
            </div>
          </div>
        </div>

        <div className="companies-section">
          <h2>Company Registrations</h2>
          <div className="companies-list">
            {companyUsers.map((company) => (
              <motion.div
                key={company.id}
                className="company-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="company-logo">
                  {company.logo ? (
                    <img src={company.logo} alt={company.companyName} />
                  ) : (
                    <FaBuilding />
                  )}
                </div>
                <div className="company-info">
                  <h3>{company.companyName}</h3>
                  <p className="company-industry">{company.industry}</p>
                  <p className="company-size">{company.companySize}</p>
                  <p className="company-email">{company.email}</p>
                  <span className={`status-badge ${company.status}`}>
                    {company.status}
                  </span>
                </div>
                <button
                  className="view-details-btn"
                  onClick={() => viewCompanyDetails(company)}
                >
                  View Details
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <AnimatePresence>
        {showModal && selectedCompany && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="close-modal"
                onClick={() => setShowModal(false)}
              >
                <FaTimes />
              </button>

              <div className="modal-header">
                <div className="company-logo">
                  {selectedCompany.logo ? (
                    <img
                      src={selectedCompany.logo}
                      alt={selectedCompany.companyName}
                    />
                  ) : (
                    <FaBuilding />
                  )}
                </div>
                <h2>{selectedCompany.companyName}</h2>
                <span className={`status-badge ${selectedCompany.status}`}>
                  {selectedCompany.status}
                </span>
              </div>

              <div className="modal-body">
                <div className="info-section">
                  <div className="info-item">
                    <FaIndustry />
                    <div>
                      <label>Industry</label>
                      <p>{selectedCompany.industry}</p>
                    </div>
                  </div>
                  <div className="info-item">
                    <FaUsers />
                    <div>
                      <label>Company Size</label>
                      <p>{selectedCompany.companySize}</p>
                    </div>
                  </div>
                  <div className="info-item">
                    <FaEnvelope />
                    <div>
                      <label>Email</label>
                      <p>{selectedCompany.email}</p>
                    </div>
                  </div>
                </div>

                <div className="documents-section">
                  <h3>Verification Documents</h3>
                  <div className="documents-list">
                    {selectedCompany.documents.map((doc, index) => (
                      <div key={index} className="document-item">
                        <FaFileAlt />
                        <span>{doc.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {selectedCompany.status === "pending" && (
                <div className="modal-actions">
                  <button
                    className="approve-btn"
                    onClick={() => handleApprove(selectedCompany.id)}
                  >
                    <FaCheckCircle /> Approve
                  </button>
                  <button
                    className="reject-btn"
                    onClick={() => handleReject(selectedCompany.id)}
                  >
                    <FaTimesCircle /> Reject
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ScadDashboard;
