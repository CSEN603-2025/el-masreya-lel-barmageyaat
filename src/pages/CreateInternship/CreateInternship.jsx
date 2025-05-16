import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaBriefcase,
  FaClock,
  FaMoneyBillWave,
  FaListAlt,
  FaFileAlt,
  FaPlus,
  FaTimes,
} from "react-icons/fa";
import "./CreateInternship.css";

const CreateInternship = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    duration: "",
    isPaid: false,
    salary: "",
    skills: [],
    description: "",
    companyId: JSON.parse(localStorage.getItem("currentUser"))?.id,
  });
  const [newSkill, setNewSkill] = useState("");
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create new internship post
    const newInternship = {
      id: Date.now(),
      ...formData,
      createdAt: new Date().toISOString(),
      status: "active",
      applications: [],
    };

    // Get existing internships from localStorage
    const existingInternships = JSON.parse(
      localStorage.getItem("internships") || "[]"
    );

    // Add new internship
    const updatedInternships = [...existingInternships, newInternship];

    // Save to localStorage
    localStorage.setItem("internships", JSON.stringify(updatedInternships));

    // Show success message
    setSuccess(true);

    // Redirect after 2 seconds
    setTimeout(() => {
      navigate("/CompanyViewPostings");
    }, 2000);
  };

  if (success) {
    return (
      <div className="success-message">
        <h2>Internship Posted Successfully!</h2>
        <p>Your internship posting has been created.</p>
        <p>You will be redirected to your postings...</p>
      </div>
    );
  }

  return (
    <div className="create-internship-page">
      <motion.div
        className="create-internship-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="create-internship-header">
          <h1>Create New Internship</h1>
          <p>Fill in the details for your internship posting</p>
        </div>

        <form onSubmit={handleSubmit} className="create-internship-form">
          <div className="form-group">
            <div className="input-icon">
              <FaBriefcase />
            </div>
            <input
              type="text"
              name="title"
              placeholder="Internship Title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <div className="input-icon">
              <FaClock />
            </div>
            <select
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              required
              className="duration-select"
            >
              <option value="">Select Duration</option>
              <option value="1-3 months">1-3 months</option>
              <option value="3-6 months">3-6 months</option>
              <option value="6-12 months">6-12 months</option>
            </select>
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="isPaid"
                checked={formData.isPaid}
                onChange={handleInputChange}
              />
              Paid Internship
            </label>
          </div>

          {formData.isPaid && (
            <div className="form-group">
              <div className="input-icon">
                <FaMoneyBillWave />
              </div>
              <input
                type="number"
                name="salary"
                placeholder="Expected Salary (AED)"
                value={formData.salary}
                onChange={handleInputChange}
                required
                min="0"
              />
            </div>
          )}

          <div className="form-group">
            <div className="input-icon">
              <FaListAlt />
            </div>
            <div className="skills-input-container">
              <input
                type="text"
                placeholder="Add Required Skills"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
              />
              <button
                type="button"
                className="add-skill-btn"
                onClick={handleAddSkill}
              >
                <FaPlus />
              </button>
            </div>
            <div className="skills-list">
              {formData.skills.map((skill, index) => (
                <div key={index} className="skill-tag">
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="remove-skill-btn"
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <div className="input-icon">
              <FaFileAlt />
            </div>
            <textarea
              name="description"
              placeholder="Job Description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows="6"
              className="internship-description"
            />
          </div>

          <motion.button
            type="submit"
            className="create-internship-button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Create Internship Post
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateInternship;
