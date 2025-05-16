import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBuilding,
  FaIndustry,
  FaUsers,
  FaEnvelope,
  FaPhone,
  FaGlobe,
  FaMapMarkerAlt,
  FaFileAlt,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import "./ViewCompanyRequest.css";

function ViewCompanyRequest() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [companyRequests, setCompanyRequests] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionFeedback, setActionFeedback] = useState(null);

  useEffect(() => {
    const storedRequests = localStorage.getItem("companyUsers");
    if (storedRequests) {
      setCompanyRequests(JSON.parse(storedRequests));
    }
  }, []);

  const filteredRequests = companyRequests.filter(
    (request) =>
      (request.companyName || "")
        .toLowerCase()
        .includes(search.toLowerCase()) &&
      (request.industry || "").toLowerCase().includes(filter.toLowerCase())
  );

  const handleApprove = (companyId) => {
    const updatedRequests = companyRequests.map((company) =>
      company.id === companyId ? { ...company, status: "approved" } : company
    );
    setCompanyRequests(updatedRequests);
    localStorage.setItem("companyUsers", JSON.stringify(updatedRequests));
    setShowModal(false);
    setActionFeedback({
      type: "success",
      message: "Company approved successfully",
    });
    setTimeout(() => setActionFeedback(null), 2000);
  };

  const handleReject = (companyId) => {
    const updatedRequests = companyRequests.map((company) =>
      company.id === companyId ? { ...company, status: "rejected" } : company
    );
    setCompanyRequests(updatedRequests);
    localStorage.setItem("companyUsers", JSON.stringify(updatedRequests));
    setShowModal(false);
    setActionFeedback({
      type: "error",
      message: "Company rejected",
    });
    setTimeout(() => setActionFeedback(null), 2000);
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
        <h1>Company Registration Requests</h1>

        <div className="filters">
          <input
            className="input-field"
            placeholder="Search companies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <input
            className="input-field"
            placeholder="Filter by industry..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>

        <div className="requests-list">
          {filteredRequests.map((request) => (
            <motion.div
              key={request.id}
              className="request-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="company-logo">
                {request.logo ? (
                  <img src={request.logo} alt={request.companyName} />
                ) : (
                  <FaBuilding />
                )}
              </div>
              <h3 className="company-name">{request.companyName}</h3>
              <div className="company-info">
                <div>
                  <FaIndustry /> <strong>Industry:</strong> {request.industry}
                </div>
                <div>
                  <FaUsers /> <strong>Size:</strong> {request.companySize}
                </div>
                <div>
                  <FaEnvelope /> <strong>Email:</strong> {request.email}
                </div>
                <span className={`status-badge ${request.status}`}>
                  {request.status}
                </span>
              </div>
              <button
                className="view-details-btn"
                onClick={() => viewCompanyDetails(request)}
              >
                View Details
              </button>
            </motion.div>
          ))}
        </div>

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
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
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
                    <div className="info-item">
                      <FaPhone />
                      <div>
                        <label>Phone</label>
                        <p>{selectedCompany.phoneNumber}</p>
                      </div>
                    </div>
                    <div className="info-item">
                      <FaGlobe />
                      <div>
                        <label>Website</label>
                        <a
                          href={selectedCompany.website}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {selectedCompany.website}
                        </a>
                      </div>
                    </div>
                    <div className="info-item">
                      <FaMapMarkerAlt />
                      <div>
                        <label>Address</label>
                        <p>{selectedCompany.address}</p>
                      </div>
                    </div>
                  </div>

                  <div className="description-section">
                    <h3>Company Description</h3>
                    <p>{selectedCompany.description}</p>
                  </div>

                  <div className="documents-section">
                    <h3>Verification Documents</h3>
                    <div className="documents-list">
                      {selectedCompany.documents?.map((doc, index) => (
                        <div key={index} className="document-item">
                          <FaFileAlt />
                          <span>{doc.name}</span>
                          <a
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="view-document-btn"
                          >
                            View Document
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedCompany.status === "pending" && (
                    <div className="modal-actions">
                      <button
                        className="approve-btn"
                        onClick={() => handleApprove(selectedCompany.id)}
                      >
                        <FaCheck /> Approve
                      </button>
                      <button
                        className="reject-btn"
                        onClick={() => handleReject(selectedCompany.id)}
                      >
                        <FaTimes /> Reject
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {actionFeedback && (
            <motion.div
              className={`action-feedback ${actionFeedback.type}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              {actionFeedback.type === "success" ? <FaCheck /> : <FaTimes />}
              {actionFeedback.message}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default ViewCompanyRequest;
