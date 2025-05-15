import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import StudentsNavBar from "../../components/studentsNavBar/StudentsNavBar";
import { sendApplicationNotificationEmail } from "../../utils/emailService";
import "./InternshipApplicationPage.css";

/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
//////this is the page where the intern uploads his cover letter and documents///////
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
function InternshipApplicationPage({
  companyUsers,
  setCompanyUsers,
  currUserId,
  studentUsers,
  setStudentUsers,
  addNotification
}) {
  const { internshipId, companyName } = useParams();
  const navigate = useNavigate();
  const currUser = studentUsers.find((user) => user.studentId === currUserId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    coverLetter: "",
    documents: null
  });

  // Get the company and internship
  const company = companyUsers.find(comp => comp.username === companyName);
  const internship = company?.internships?.find(
    intern => intern.internshipID === parseInt(internshipId)
  );

  if (!currUser) {
    return (
      <div className="application-container">
        <StudentsNavBar />
        <div className="application-error">
          <h2>Error: You must be logged in to apply</h2>
          <button onClick={() => navigate("/login")} className="nav-button">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (!internship) {
    return (
      <div className="application-container">
        <StudentsNavBar />
        <div className="application-error">
          <h2>Error: Internship not found</h2>
          <button onClick={() => navigate("/studentsDashboard")} className="nav-button">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "documents" && files.length > 0) {
      setFormData({
        ...formData,
        documents: files[0]
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const { coverLetter, documents } = formData;
      const fullName = `${currUser?.firstName || ''} ${currUser?.lastName || ''}`.trim();
      const today = new Date().toISOString().split('T')[0];

      // Create a notification payload
      const notificationMessage = `${fullName} applied for your "${internship.title}" internship`;
      
      // Update company data
      const updatedCompanies = companyUsers.map((company) => {
        if (company.username === companyName) {
          // Add notification to company
          company.notifications = company.notifications || [];
          company.notifications.push({
            id: Date.now(),
            message: notificationMessage,
            date: today,
            read: false,
            type: "application",
            studentId: currUser.studentId,
            internshipId: parseInt(internshipId)
          });

          // Update internship applications
          const updatedInternships = company.internships.map((internship) => {
            if (internship.internshipID === parseInt(internshipId)) {
              let updatedApplications = internship.applications || [];
              
              const userAlreadyApplied = updatedApplications.some(
                (application) => application.username === currUser.username
              );

              if (userAlreadyApplied) {
                // Update existing application
                updatedApplications = updatedApplications.map(application => {
                  if (application.username === currUser.username) {
                    return {
                      ...application,
                      coverLetter,
                      documents,
                      updatedAt: today
                    };
                  }
                  return application;
                });
              } else {
                // Create new application
                updatedApplications.push({
                  applicationId: (internship.applications?.length || 0) + 1,
                  studentId: currUser.studentId,
                  username: currUser.username,
                  firstName: currUser.firstName,
                  lastName: currUser.lastName,
                  email: currUser.email,
                  experiences: currUser.experiences,
                  skills: currUser.skills,
                  education: currUser.education,
                  profilePicture: currUser.profilePicture,
                  coverLetter,
                  documents,
                  status: "Pending",
                  internshipStatus: "didntStartYet",
                  appliedAt: today
                });
              }

              return {
                ...internship,
                applications: updatedApplications,
              };
            }
            return internship;
          });

          return {
            ...company,
            internships: updatedInternships,
          };
        }
        return company;
      });

      // Update student data
      const updatedStudents = studentUsers.map((student) => {
        if (student.studentId === currUserId) {
          const alreadyReferenced = (student.appliedInternships || []).some(
            (app) =>
              app.internshipId === parseInt(internshipId) &&
              app.companyUsername === companyName
          );

          if (!alreadyReferenced) {
            const updatedApplications = [
              ...(student.appliedInternships || []),
              {
                internshipId: parseInt(internshipId),
                companyUsername: companyName,
                appliedAt: today
              },
            ];
            return {
              ...student,
              appliedInternships: updatedApplications,
            };
          }
        }
        return student;
      });

      // Update state
      setCompanyUsers(updatedCompanies);
      setStudentUsers(updatedStudents);

      // Send email notification
      await sendApplicationNotificationEmail({
        company,
        student: currUser,
        internship
      });

      // Show success notification
      if (addNotification) {
        addNotification("Your application has been submitted successfully!", "success");
      } else {
        alert("Application submitted successfully!");
      }

      // Redirect to dashboard
      navigate("/studentsDashboard");
    } catch (error) {
      console.error("Error submitting application:", error);
      if (addNotification) {
        addNotification("Error submitting application. Please try again.", "error");
      } else {
        alert("Error submitting application. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isReapplying = currUser.appliedInternships?.some(
    app => app.internshipId === parseInt(internshipId) && app.companyUsername === companyName
  );

  return (
    <div className="application-container">
      <StudentsNavBar />
      <div className="application-form-container">
        <h1>{isReapplying ? "Update Your Application" : "Apply for Internship"}</h1>
        <div className="internship-info">
          <h2>{internship.title}</h2>
          <p><strong>Company:</strong> {company.name || company.username}</p>
          <p><strong>Location:</strong> {internship.location}</p>
          <p><strong>Duration:</strong> {internship.duration}</p>
          <p><strong>Compensation:</strong> {internship.paid ? "Paid" : "Unpaid"}</p>
        </div>

        <form onSubmit={handleSubmit} className="application-form">
          <div className="form-group">
            <label htmlFor="coverLetter">Cover Letter:</label>
            <textarea
              id="coverLetter"
              name="coverLetter"
              rows="6"
              placeholder="Explain why you're interested in this position and what makes you a good fit..."
              value={formData.coverLetter}
              onChange={handleInputChange}
              required
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="documents">Upload Resume/CV:</label>
            <input 
              type="file" 
              id="documents" 
              name="documents" 
              onChange={handleInputChange}
              className="form-input file-input"
              accept=".pdf,.doc,.docx"
            />
            <small className="file-hint">Accepted formats: PDF, DOC, DOCX</small>
          </div>
          
          <div className="form-actions">
            <button 
              type="button" 
              onClick={() => navigate(-1)} 
              className="back-button"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : (isReapplying ? "Update Application" : "Submit Application")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default InternshipApplicationPage;
