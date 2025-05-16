import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaBuilding,
  FaEnvelope,
  FaIndustry,
  FaUsers,
  FaImage,
  FaCheckCircle,
  FaFileAlt,
  FaUser,
  FaPhone,
  FaGlobe,
  FaMapMarkerAlt,
} from "react-icons/fa";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import "./CompanyRegister.css";

const CompanyRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: "",
    industry: "",
    companySize: "",
    email: "",
    contactPerson: "",
    phoneNumber: "",
    website: "",
    address: "",
    description: "",
  });
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [documentPreviews, setDocumentPreviews] = useState([]);
  const [success, setSuccess] = useState(false);

  const particlesInit = async (engine) => {
    await loadFull(engine);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDocumentChange = (e) => {
    const files = Array.from(e.target.files);
    setDocuments((prev) => [...prev, ...files]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDocumentPreviews((prev) => [
          ...prev,
          {
            name: file.name,
            type: file.type,
            size: file.size,
            url: reader.result,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeDocument = (index) => {
    setDocuments((prev) => prev.filter((_, i) => i !== index));
    setDocumentPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate documents
    if (documentPreviews.length === 0) {
      alert("Please upload at least one verification document");
      return;
    }

    // Create new company request
    const newCompany = {
      id: Date.now(),
      ...formData,
      logo: logoPreview,
      documents: documentPreviews,
      status: "pending",
      registrationDate: new Date().toISOString(),
    };

    // Get existing requests from localStorage
    const existingRequests = JSON.parse(
      localStorage.getItem("companyUsers") || "[]"
    );

    // Add new request
    const updatedRequests = [...existingRequests, newCompany];

    // Save to localStorage
    localStorage.setItem("companyUsers", JSON.stringify(updatedRequests));

    // Show success message
    setSuccess(true);

    // Clear form
    setFormData({
      companyName: "",
      industry: "",
      companySize: "",
      email: "",
      contactPerson: "",
      phoneNumber: "",
      website: "",
      address: "",
      description: "",
    });
    setLogo(null);
    setLogoPreview(null);
    setDocuments([]);
    setDocumentPreviews([]);

    // Redirect after 2 seconds
    setTimeout(() => {
      navigate("/login");
    }, 2000);
  };

  if (success) {
    return (
      <div className="success-message">
        <h2>Registration Successful!</h2>
        <p>Your company registration request has been submitted for review.</p>
        <p>You will be redirected to the login page...</p>
      </div>
    );
  }

  return (
    <div className="register-page">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: {
            color: {
              value: "#f8fafc",
            },
          },
          fpsLimit: 60,
          particles: {
            color: {
              value: ["#3b82f6", "#2563eb", "#60a5fa"],
            },
            links: {
              color: "#3b82f6",
              distance: 150,
              enable: true,
              opacity: 0.3,
              width: 1,
            },
            move: {
              enable: true,
              outModes: {
                default: "bounce",
              },
              random: false,
              speed: 1,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                area: 800,
              },
              value: 60,
            },
            opacity: {
              value: 0.3,
            },
            shape: {
              type: "circle",
            },
            size: {
              value: { min: 1, max: 3 },
            },
          },
          detectRetina: true,
        }}
      />

      <motion.div
        className="register-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="register-header">
          <h1>SCAD Company Registration</h1>
          <p>Join our network of industry partners</p>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <div className="input-icon">
              <FaBuilding />
            </div>
            <input
              type="text"
              name="companyName"
              placeholder="Company Name"
              value={formData.companyName}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <div className="input-icon">
              <FaIndustry />
            </div>
            <input
              type="text"
              name="industry"
              placeholder="Industry"
              value={formData.industry}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <div className="input-icon">
              <FaUsers />
            </div>
            <select
              name="companySize"
              value={formData.companySize}
              onChange={handleInputChange}
              required
              className="company-size-select"
            >
              <option value="">Select Company Size</option>
              <option value="small">Small (1-50 employees)</option>
              <option value="medium">Medium (51-200 employees)</option>
              <option value="large">Large (201-1000 employees)</option>
              <option value="corporate">Corporate (1000+ employees)</option>
            </select>
          </div>

          <div className="form-group">
            <div className="input-icon">
              <FaEnvelope />
            </div>
            <input
              type="email"
              name="email"
              placeholder="Official Company Email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <div className="input-icon">
              <FaUser />
            </div>
            <input
              type="text"
              name="contactPerson"
              placeholder="Contact Person Name"
              value={formData.contactPerson}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <div className="input-icon">
              <FaPhone />
            </div>
            <input
              type="tel"
              name="phoneNumber"
              placeholder="Contact Phone Number"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <div className="input-icon">
              <FaGlobe />
            </div>
            <input
              type="text"
              name="website"
              placeholder="Company Website"
              value={formData.website}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <div className="input-icon">
              <FaMapMarkerAlt />
            </div>
            <input
              type="text"
              name="address"
              placeholder="Company Address"
              value={formData.address}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <div className="input-icon">
              <FaFileAlt />
            </div>
            <textarea
              name="description"
              placeholder="Company Description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows="4"
              className="company-description"
            />
          </div>

          <div className="logo-upload-section">
            <div className="logo-preview">
              {logoPreview ? (
                <img src={logoPreview} alt="Company Logo Preview" />
              ) : (
                <div className="logo-placeholder">
                  <FaImage />
                  <span>Company Logo</span>
                </div>
              )}
            </div>
            <div className="logo-upload">
              <input
                type="file"
                id="logo"
                accept="image/*"
                onChange={handleLogoChange}
                className="logo-input"
              />
              <label htmlFor="logo" className="logo-label">
                Upload Logo
              </label>
            </div>
          </div>

          <div className="documents-upload-section">
            <div className="documents-header">
              <FaFileAlt />
              <h3>Verification Documents</h3>
              <p>
                Upload documents proving your company's legitimacy (e.g., tax
                documents, business license)
              </p>
            </div>

            <div className="documents-upload">
              <input
                type="file"
                id="documents"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleDocumentChange}
                className="documents-input"
                multiple
              />
              <label htmlFor="documents" className="documents-label">
                Upload Documents
              </label>
            </div>

            {documentPreviews.length > 0 && (
              <div className="documents-list">
                {documentPreviews.map((doc, index) => (
                  <div key={index} className="document-item">
                    <FaFileAlt />
                    <span>{doc.name}</span>
                    <button
                      type="button"
                      onClick={() => removeDocument(index)}
                      className="remove-document"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <motion.button
            type="submit"
            className="register-button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Register Company
          </motion.button>

          <div className="register-footer">
            <p>
              Already have an account?{" "}
              <Link to="/login" className="login-link">
                Login here
              </Link>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CompanyRegister;
