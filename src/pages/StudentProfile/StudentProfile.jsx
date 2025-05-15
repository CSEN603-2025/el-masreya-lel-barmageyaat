import { Link } from "react-router-dom";
import StudentsNavBar from "../../components/studentsNavBar/StudentsNavBar";
import { useState, useEffect } from "react";
import "./StudentProfile.css";

function StudentProfile({ currUser, studentUsers, setStudentUsers, setCurrUser }) {
  const [isEditing, setIsEditing] = useState(false);
  const [major, setMajor] = useState(currUser.major || "");
  const [semester, setSemester] = useState(currUser.semester || "");
  const [successMessage, setSuccessMessage] = useState("");
  const [localUser, setLocalUser] = useState(currUser);
  const [showMajorsList, setShowMajorsList] = useState(false);
  
  // Update local state when currUser changes
  useEffect(() => {
    setMajor(currUser.major || "");
    setSemester(currUser.semester || "");
    setLocalUser(currUser);
  }, [currUser]);
  
  // List of possible majors with their available semester ranges
  const majorsWithSemesters = [
    { name: "Computer Science", semesters: "1-8" },
    { name: "Information Technology", semesters: "1-8" },
    { name: "Computer Engineering", semesters: "1-10" },
    { name: "Software Engineering", semesters: "1-8" },
    { name: "Data Science", semesters: "1-8" },
    { name: "Cybersecurity", semesters: "1-8" },
    { name: "Artificial Intelligence", semesters: "1-8" },
    { name: "Business Information Systems", semesters: "1-8" },
    { name: "Electrical Engineering", semesters: "1-10" },
    { name: "Mechanical Engineering", semesters: "1-10" },
    { name: "Civil Engineering", semesters: "1-10" },
    { name: "Architecture", semesters: "1-10" },
    { name: "Business Administration", semesters: "1-8" },
    { name: "Economics", semesters: "1-8" },
    { name: "Marketing", semesters: "1-8" },
    { name: "Finance", semesters: "1-8" },
    { name: "Accounting", semesters: "1-8" },
    { name: "Communications", semesters: "1-8" },
    { name: "Journalism", semesters: "1-8" },
    { name: "Medicine", semesters: "1-12" },
    { name: "Pharmacy", semesters: "1-10" },
    { name: "Law", semesters: "1-10" }
  ];
  
  // Simple majors list for dropdown
  const majors = majorsWithSemesters.map(m => m.name);
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create updated user with new major and semester
    const updatedUser = {
      ...localUser,
      major,
      semester
    };
    
    // Update the current user locally
    setLocalUser(updatedUser);
    
    // Also update the current user in the App state
    setCurrUser(updatedUser);
    
    // Update the student users array
    const updatedStudentUsers = studentUsers.map(student => {
      if (student.studentId === currUser.studentId) {
        return updatedUser;
      }
      return student;
    });
    
    // Save the updated student users
    setStudentUsers(updatedStudentUsers);
    
    // Save to localStorage directly to ensure persistence
    try {
      localStorage.setItem("studentUsers", JSON.stringify(updatedStudentUsers));
      
      // Show success message
      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      
      // Exit edit mode
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving to localStorage:", error);
      setSuccessMessage("Error saving changes. Please try again.");
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };
  
  return (
    <div className="student-profile-container">
      <StudentsNavBar />
      <div className="profile-header">
        <h1>Student Profile</h1>
        <div className="header-buttons">
          <button 
            className="view-majors-button" 
            onClick={() => setShowMajorsList(!showMajorsList)}
          >
            {showMajorsList ? "Hide Majors List" : "View Majors List"}
          </button>
          <button 
            className="edit-button" 
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        </div>
      </div>
      
      {successMessage && (
        <div className={`success-message ${successMessage.includes("Error") ? "error-message" : ""}`}>
          {successMessage}
        </div>
      )}
      
      {showMajorsList && (
        <div className="majors-list-section">
          <h2>Available Majors and Semesters</h2>
          <div className="majors-grid">
            {majorsWithSemesters.map((major, index) => (
              <div key={index} className="major-item">
                <h3>{major.name}</h3>
                <p>Semesters: {major.semesters}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="profile-section">
        <h2>Academic Information</h2>
        {isEditing ? (
          <form onSubmit={handleSubmit} className="edit-form">
            <div className="form-group">
              <label htmlFor="major">Major:</label>
              <select 
                id="major" 
                value={major} 
                onChange={(e) => setMajor(e.target.value)}
                required
              >
                <option value="">Select a major</option>
                {majors.map((m, index) => (
                  <option key={index} value={m}>{m}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="semester">Semester:</label>
              <select 
                id="semester" 
                value={semester} 
                onChange={(e) => setSemester(e.target.value)}
                required
              >
                <option value="">Select a semester</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                  <option key={num} value={num}>Semester {num}</option>
                ))}
              </select>
            </div>
            
            <button type="submit" className="save-button">Save Changes</button>
          </form>
        ) : (
          <div className="info-display">
            <p><strong>Username:</strong> {localUser.username}</p>
            <p><strong>Major:</strong> {localUser.major || "Not specified"}</p>
            <p><strong>Semester:</strong> {localUser.semester ? `Semester ${localUser.semester}` : "Not specified"}</p>
          </div>
        )}
      </div>
      
      <div className="profile-section">
        <h2>Job Interests</h2>
        <p>{localUser.interests?.join(", ") || "No interests specified"}</p>
      </div>
      
      <div className="profile-section">
        <h2>Skills</h2>
        <p>{localUser.skills?.join(", ") || "No skills specified"}</p>
      </div>
      
      <div className="profile-section">
        <h2>Experiences</h2>
        {localUser.experiences && localUser.experiences.length > 0 ? (
          <ul className="experience-list">
            {localUser.experiences.map((experience, index) => (
              <li key={index} className="experience-item">
                <h3>{experience.title}</h3>
                <p className="company">{experience.company}</p>
                <p>{experience.responsibilities}</p>
                <p className="duration">{experience.duration}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No experiences listed</p>
        )}
      </div>
      
      <div className="profile-section">
        <h2>Education</h2>
        {localUser.education && localUser.education.length > 0 ? (
          <ul className="education-list">
            {localUser.education.map((education, index) => (
              <li key={index} className="education-item">
                <h3>{education.degree}</h3>
                <p>{education.institution}</p>
                <p>{education.year}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No education details listed</p>
        )}
      </div>
      
      <div className="profile-actions">
        <Link to={`/StudentInternships/${localUser.studentId}`} className="profile-link">
          View My Internships
        </Link>
        <Link to="/SuggestedCompanies" className="profile-link suggested-link">
          View Suggested Companies
        </Link>
        <Link to="/studentsDashboard" className="profile-link">
          Go to Students Dashboard
        </Link>
      </div>
    </div>
  );
}

export default StudentProfile;
