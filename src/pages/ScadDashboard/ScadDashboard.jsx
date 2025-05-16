import React, { useState, useEffect } from "react";
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
import VideoCall from '../../components/VideoCall/VideoCall';
import "./ScadDashboard.css";

function ScadDashboard({ companyUsers, setCompanyUsers }) {
  const navigate = useNavigate();
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [activeCall, setActiveCall] = useState(null);
  const [showUpcoming, setShowUpcoming] = useState(true);

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

  // Load appointments from localStorage
  useEffect(() => {
    const savedAppointments = localStorage.getItem('appointments');
    if (savedAppointments) {
      const allAppointments = JSON.parse(savedAppointments);
      // Filter for approved appointments only
      const relevantAppointments = allAppointments.filter(app => 
        app.scadApproval === 'approved' && app.studentApproval === 'approved'
      );
      setAppointments(relevantAppointments);
    }
  }, []);

  // Filter appointments for today and upcoming
  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(app => app.date === today);
  const upcomingAppointments = appointments.filter(app => app.date > today);

  const handleStartCall = (appointment) => {
    setActiveCall(appointment);
  };

  const handleEndCall = () => {
    setActiveCall(null);
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
              <h2>Company Evaluations</h2>
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
            <div className="dashboard-card">
              <div className="card-icon workshop-icon">🛠️</div>
              <h2>Workshops</h2>
              <p>Manage and review university workshops and participation.</p>
              <Link to="/Workshops" className="card-button">
                View Workshops
              </Link>
            </div>
          </div>
        </div>

        {/* Appointments Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Video Call Appointments</h2>
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowUpcoming(false)}
                    className={`px-4 py-2 rounded ${!showUpcoming ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                  >
                    Today's Calls
                  </button>
                  <button
                    onClick={() => setShowUpcoming(true)}
                    className={`px-4 py-2 rounded ${showUpcoming ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                  >
                    Upcoming Calls
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-2">Date</th>
                      <th className="px-4 py-2">Time</th>
                      <th className="px-4 py-2">Student</th>
                      <th className="px-4 py-2">Purpose</th>
                      <th className="px-4 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(showUpcoming ? upcomingAppointments : todayAppointments).map((appointment) => (
                      <tr key={appointment.id} className="border-t">
                        <td className="px-4 py-2">{appointment.date}</td>
                        <td className="px-4 py-2">{appointment.time}</td>
                        <td className="px-4 py-2">{appointment.studentName}</td>
                        <td className="px-4 py-2">
                          {appointment.context === 'report_review' 
                            ? 'Report Review'
                            : appointment.purpose}
                        </td>
                        <td className="px-4 py-2">
                          {appointment.date === today && (
                            <button
                              onClick={() => handleStartCall(appointment)}
                              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                            >
                              Start Call
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {(showUpcoming ? upcomingAppointments : todayAppointments).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No {showUpcoming ? 'upcoming' : 'today\'s'} appointments found.
                  </div>
                )}
              </div>
            </div>
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

      {/* Video Call Modal */}
      {activeCall && (
        <VideoCall
          onEndCall={handleEndCall}
          studentName={activeCall.studentName}
        />
      )}
    </div>
  );
}

export default ScadDashboard;
