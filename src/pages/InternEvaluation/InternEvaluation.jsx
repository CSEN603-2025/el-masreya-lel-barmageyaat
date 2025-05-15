import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './InternEvaluation.css';

function InternEvaluation({ companyUsers, setCompanyUsers, addNotification }) {
  const { username } = useParams();
  const navigate = useNavigate();

  const [evaluation, setEvaluation] = useState({
    technicalSkills: '',
    technicalSkillsRating: 0,
    communicationSkills: '',
    communicationSkillsRating: 0,
    teamwork: '',
    teamworkRating: 0,
    initiative: '',
    initiativeRating: 0,
    overallPerformance: '',
    overallRating: 0,
    strengthsAndAchievements: '',
    areasForImprovement: '',
    additionalComments: '',
    evaluationDate: new Date().toISOString(),
    lastModified: new Date().toISOString()
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Find the intern's data
  const findInternData = () => {
    for (const company of companyUsers) {
      for (const internship of company.internships || []) {
        const application = internship.applications?.find(
          app => app.username === username && app.internshipStatus === "InternshipComplete"
        );
        if (application) {
          return {
            intern: application,
            internship,
            company
          };
        }
      }
    }
    return null;
  };

  const internData = findInternData();

  useEffect(() => {
    if (internData?.intern?.evaluation) {
      setEvaluation(internData.intern.evaluation);
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
    setLoading(false);
  }, [internData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEvaluation(prev => ({
      ...prev,
      [name]: value,
      lastModified: new Date().toISOString()
    }));
  };

  const handleRatingChange = (name, value) => {
    setEvaluation(prev => ({
      ...prev,
      [name]: value,
      lastModified: new Date().toISOString()
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const updatedCompanyUsers = companyUsers.map(company => ({
      ...company,
      internships: (company.internships || []).map(internship => ({
        ...internship,
        applications: (internship.applications || []).map(application =>
          application.username === username && application.internshipStatus === "InternshipComplete"
            ? { ...application, evaluation }
            : application
        )
      }))
    }));

    setCompanyUsers(updatedCompanyUsers);
    setIsEditing(false);
    addNotification("Evaluation saved successfully!", "success");
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this evaluation? This action cannot be undone.")) {
      const updatedCompanyUsers = companyUsers.map(company => ({
        ...company,
        internships: (company.internships || []).map(internship => ({
          ...internship,
          applications: (internship.applications || []).map(application =>
            application.username === username && application.internshipStatus === "InternshipComplete"
              ? { ...application, evaluation: null }
              : application
          )
        }))
      }));

      setCompanyUsers(updatedCompanyUsers);
      setEvaluation({
        technicalSkills: '',
        technicalSkillsRating: 0,
        communicationSkills: '',
        communicationSkillsRating: 0,
        teamwork: '',
        teamworkRating: 0,
        initiative: '',
        initiativeRating: 0,
        overallPerformance: '',
        overallRating: 0,
        strengthsAndAchievements: '',
        areasForImprovement: '',
        additionalComments: '',
        evaluationDate: new Date().toISOString(),
        lastModified: new Date().toISOString()
      });
      setIsEditing(true);
      addNotification("Evaluation deleted successfully!", "success");
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!internData) {
    return (
      <div className="not-found">
        <h2>Intern not found or internship not completed</h2>
        <button onClick={() => navigate(-1)} className="back-button">
          Go Back
        </button>
      </div>
    );
  }

  const RatingInput = ({ name, value }) => (
    <div className="rating-input">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`star-button ${star <= value ? 'active' : ''}`}
          onClick={() => handleRatingChange(name, star)}
          disabled={!isEditing}
        >
          ★
        </button>
      ))}
    </div>
  );

  return (
    <div className="evaluation-container">
      <div className="evaluation-header">
        <h1>Intern Evaluation</h1>
        <div className="intern-info">
          <h2>{internData.intern.firstName} {internData.intern.lastName}</h2>
          <p className="internship-title">{internData.internship.title}</p>
          <p className="completion-date">
            Completed: {new Date(internData.intern.completionDate).toLocaleDateString()}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="evaluation-form">
        <div className="evaluation-section">
          <h3>Technical Skills</h3>
          <RatingInput name="technicalSkillsRating" value={evaluation.technicalSkillsRating} />
          <textarea
            name="technicalSkills"
            value={evaluation.technicalSkills}
            onChange={handleInputChange}
            placeholder="Evaluate technical skills and competencies..."
            disabled={!isEditing}
            required
          />
        </div>

        <div className="evaluation-section">
          <h3>Communication Skills</h3>
          <RatingInput name="communicationSkillsRating" value={evaluation.communicationSkillsRating} />
          <textarea
            name="communicationSkills"
            value={evaluation.communicationSkills}
            onChange={handleInputChange}
            placeholder="Evaluate communication abilities..."
            disabled={!isEditing}
            required
          />
        </div>

        <div className="evaluation-section">
          <h3>Teamwork</h3>
          <RatingInput name="teamworkRating" value={evaluation.teamworkRating} />
          <textarea
            name="teamwork"
            value={evaluation.teamwork}
            onChange={handleInputChange}
            placeholder="Evaluate collaboration and team contributions..."
            disabled={!isEditing}
            required
          />
        </div>

        <div className="evaluation-section">
          <h3>Initiative & Proactivity</h3>
          <RatingInput name="initiativeRating" value={evaluation.initiativeRating} />
          <textarea
            name="initiative"
            value={evaluation.initiative}
            onChange={handleInputChange}
            placeholder="Evaluate self-direction and initiative..."
            disabled={!isEditing}
            required
          />
        </div>

        <div className="evaluation-section">
          <h3>Overall Performance</h3>
          <RatingInput name="overallRating" value={evaluation.overallRating} />
          <textarea
            name="overallPerformance"
            value={evaluation.overallPerformance}
            onChange={handleInputChange}
            placeholder="Provide an overall assessment..."
            disabled={!isEditing}
            required
          />
        </div>

        <div className="evaluation-section">
          <h3>Strengths & Achievements</h3>
          <textarea
            name="strengthsAndAchievements"
            value={evaluation.strengthsAndAchievements}
            onChange={handleInputChange}
            placeholder="List key strengths and notable achievements..."
            disabled={!isEditing}
            required
          />
        </div>

        <div className="evaluation-section">
          <h3>Areas for Improvement</h3>
          <textarea
            name="areasForImprovement"
            value={evaluation.areasForImprovement}
            onChange={handleInputChange}
            placeholder="Suggest areas for professional development..."
            disabled={!isEditing}
            required
          />
        </div>

        <div className="evaluation-section">
          <h3>Additional Comments</h3>
          <textarea
            name="additionalComments"
            value={evaluation.additionalComments}
            onChange={handleInputChange}
            placeholder="Any other comments or feedback..."
            disabled={!isEditing}
          />
        </div>

        <div className="evaluation-footer">
          {isEditing ? (
            <button type="submit" className="save-button">
              Save Evaluation
            </button>
          ) : (
            <div className="action-buttons">
              <button type="button" onClick={() => setIsEditing(true)} className="edit-button">
                Edit Evaluation
              </button>
              <button type="button" onClick={handleDelete} className="delete-button">
                Delete Evaluation
              </button>
            </div>
          )}
          <button type="button" onClick={() => navigate(-1)} className="back-button">
            Back
          </button>
        </div>
      </form>

      {!isEditing && (
        <div className="last-modified">
          Last modified: {new Date(evaluation.lastModified).toLocaleString()}
        </div>
      )}
    </div>
  );
}

export default InternEvaluation; 