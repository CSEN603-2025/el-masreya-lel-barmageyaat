import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './CompletedInterns.css';
import { generateEvaluationPDF } from '../../utils/pdfGenerator';

function CompletedInterns({ companyUsers, currUser, setCompanyUsers, addNotification }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('completionDate'); // 'completionDate', 'name'
  const [timeFilter, setTimeFilter] = useState('all'); // 'all', 'lastMonth', 'last3Months', 'last6Months', 'lastYear'
  const [selectedIntern, setSelectedIntern] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

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
    lastModified: new Date().toISOString(),
    history: []
  });

  if (!currUser) {
    navigate('/login');
    return null;
  }

  // Get current company's data
  const companyData = companyUsers.find(company => company.username === currUser.username);
  
  // Get all completed interns from all internships
  const completedInterns = companyData?.internships?.flatMap(internship => 
    (internship.applications || [])
      .filter(application => application.internshipStatus === "InternshipComplete")
      .map(application => ({
        ...application,
        internshipTitle: internship.title,
        internshipId: internship.internshipID
      }))
  ) || [];

  // Filter interns based on completion date
  const filterInternsByTime = (interns) => {
    const now = new Date();
    return interns.filter(intern => {
      const completionDate = new Date(intern.completionDate);
      const monthsDiff = (now.getFullYear() - completionDate.getFullYear()) * 12 + 
                        (now.getMonth() - completionDate.getMonth());
      
      switch(timeFilter) {
        case 'lastMonth':
          return monthsDiff <= 1;
        case 'last3Months':
          return monthsDiff <= 3;
        case 'last6Months':
          return monthsDiff <= 6;
        case 'lastYear':
          return monthsDiff <= 12;
        default:
          return true;
      }
    });
  };

  // Sort interns
  const sortedInterns = [...filterInternsByTime(completedInterns)].sort((a, b) => {
    if (sortBy === 'completionDate') {
      return new Date(b.completionDate) - new Date(a.completionDate);
    }
    return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
  });

  // Filter interns based on search
  const filteredInterns = sortedInterns.filter(intern => {
    const searchString = searchTerm.toLowerCase();
    const fullName = `${intern.firstName} ${intern.lastName}`.toLowerCase();
    const internshipTitle = intern.internshipTitle.toLowerCase();
    
    return fullName.includes(searchString) || internshipTitle.includes(searchString);
  });

  const handleSelectIntern = (intern) => {
    setSelectedIntern(intern);
    setEvaluation(intern.evaluation || {
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
      lastModified: new Date().toISOString(),
      history: []
    });
    setIsEditing(!intern.evaluation);
  };

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

  const handleSubmitEvaluation = (e) => {
    e.preventDefault();
    
    // Create history entry
    const historyEntry = {
      timestamp: new Date().toISOString(),
      changes: {
        technicalSkills: evaluation.technicalSkills,
        technicalSkillsRating: evaluation.technicalSkillsRating,
        communicationSkills: evaluation.communicationSkills,
        communicationSkillsRating: evaluation.communicationSkillsRating,
        teamwork: evaluation.teamwork,
        teamworkRating: evaluation.teamworkRating,
        initiative: evaluation.initiative,
        initiativeRating: evaluation.initiativeRating,
        overallPerformance: evaluation.overallPerformance,
        overallRating: evaluation.overallRating,
        strengthsAndAchievements: evaluation.strengthsAndAchievements,
        areasForImprovement: evaluation.areasForImprovement,
        additionalComments: evaluation.additionalComments
      }
    };

    const updatedEvaluation = {
      ...evaluation,
      lastModified: new Date().toISOString(),
      history: [...(evaluation.history || []), historyEntry]
    };
    
    const updatedCompanyUsers = companyUsers.map(company => ({
      ...company,
      internships: (company.internships || []).map(internship => ({
        ...internship,
        applications: (internship.applications || []).map(application =>
          application.username === selectedIntern.username && application.internshipStatus === "InternshipComplete"
            ? { ...application, evaluation: updatedEvaluation }
            : application
        )
      }))
    }));

    setCompanyUsers(updatedCompanyUsers);
    setEvaluation(updatedEvaluation);
    setIsEditing(false);
    addNotification("Evaluation saved successfully!", "success");
  };

  const handleDeleteEvaluation = () => {
    if (window.confirm("Are you sure you want to delete this evaluation? This action cannot be undone.")) {
      const updatedCompanyUsers = companyUsers.map(company => ({
        ...company,
        internships: (company.internships || []).map(internship => ({
          ...internship,
          applications: (internship.applications || []).map(application =>
            application.username === selectedIntern.username && application.internshipStatus === "InternshipComplete"
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
        lastModified: new Date().toISOString(),
        history: []
      });
      setIsEditing(true);
      addNotification("Evaluation deleted successfully!", "success");
    }
  };

  const handleExportEvaluation = () => {
    if (!selectedIntern || !evaluation) return;

    const evaluationData = {
      internInfo: {
        name: `${selectedIntern.firstName} ${selectedIntern.lastName}`,
        email: selectedIntern.email,
        internshipTitle: selectedIntern.internshipTitle,
        completionDate: selectedIntern.completionDate
      },
      evaluation: {
        technicalSkills: {
          rating: evaluation.technicalSkillsRating,
          comments: evaluation.technicalSkills
        },
        communicationSkills: {
          rating: evaluation.communicationSkillsRating,
          comments: evaluation.communicationSkills
        },
        teamwork: {
          rating: evaluation.teamworkRating,
          comments: evaluation.teamwork
        },
        initiative: {
          rating: evaluation.initiativeRating,
          comments: evaluation.initiative
        },
        overallPerformance: {
          rating: evaluation.overallRating,
          comments: evaluation.overallPerformance
        },
        strengthsAndAchievements: evaluation.strengthsAndAchievements,
        areasForImprovement: evaluation.areasForImprovement,
        additionalComments: evaluation.additionalComments,
        evaluationDate: evaluation.evaluationDate,
        lastModified: evaluation.lastModified
      }
    };

    // Generate PDF file
    const success = generateEvaluationPDF(
      evaluationData, 
      `evaluation_${selectedIntern.firstName}_${selectedIntern.lastName}_${new Date().toISOString().split('T')[0]}`
    );
    
    if (success) {
      addNotification("Evaluation exported successfully as PDF!", "success");
    } else {
      addNotification("Failed to export evaluation as PDF.", "error");
    }
  };

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
    <div className="completed-interns-container">
      <div className="completed-interns-header">
        <h1>Past Completed Internships</h1>
        <div className="header-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by name or internship..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-controls">
            <select 
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="time-filter-select"
            >
              <option value="all">All Time</option>
              <option value="lastMonth">Last Month</option>
              <option value="last3Months">Last 3 Months</option>
              <option value="last6Months">Last 6 Months</option>
              <option value="lastYear">Last Year</option>
            </select>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="completionDate">Most Recent First</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="completed-interns-stats">
        <div className="stat-card">
          <h3>Total Past Interns</h3>
          <p className="stat-number">{completedInterns.length}</p>
        </div>
        <div className="stat-card">
          <h3>Selected Period</h3>
          <p className="stat-number">{filteredInterns.length}</p>
        </div>
      </div>

      <div className="completed-interns-content">
        <div className="interns-list">
          {filteredInterns.length > 0 ? (
            filteredInterns.map((intern) => (
              <div 
                key={`${intern.username}-${intern.internshipId}`} 
                className={`intern-card ${selectedIntern?.username === intern.username ? 'selected' : ''}`}
                onClick={() => handleSelectIntern(intern)}
              >
                <div className="intern-info">
                  <div className="intern-primary-info">
                    <h2>{intern.firstName} {intern.lastName}</h2>
                    <span className="completion-date">
                      Completed: {new Date(intern.completionDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="intern-details">
                    <p><strong>Past Internship:</strong> {intern.internshipTitle}</p>
                    <p><strong>Email:</strong> {intern.email}</p>
                  </div>
                  <div className="intern-skills">
                    {intern.skills.map((skill, index) => (
                      <span key={index} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                  <div className="evaluation-status">
                    {intern.evaluation ? (
                      <span className="status-complete">Evaluation Complete</span>
                    ) : (
                      <span className="status-pending">Evaluation Pending</span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-interns">
              {searchTerm ? (
                <p>No past interns match your search.</p>
              ) : (
                <p>No completed internships found for the selected time period.</p>
              )}
            </div>
          )}
        </div>

        {selectedIntern && (
          <div className="evaluation-panel">
            <div className="evaluation-header">
              <h2>Evaluation for {selectedIntern.firstName} {selectedIntern.lastName}</h2>
              <p className="internship-title">{selectedIntern.internshipTitle}</p>
            </div>

            <form onSubmit={handleSubmitEvaluation} className="evaluation-form">
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
                    <button type="button" onClick={handleDeleteEvaluation} className="delete-button">
                      Delete Evaluation
                    </button>
                    <button type="button" onClick={handleExportEvaluation} className="export-button">
                      Download as PDF
                    </button>
                  </div>
                )}
              </div>

              {!isEditing && evaluation.history && evaluation.history.length > 0 && (
                <div className="evaluation-history">
                  <h3>Evaluation History</h3>
                  <div className="history-list">
                    {evaluation.history.map((entry, index) => (
                      <div key={index} className="history-entry">
                        <p className="history-timestamp">
                          {new Date(entry.timestamp).toLocaleString()}
                        </p>
                        <button
                          type="button"
                          className="view-history-button"
                          onClick={() => {
                            if (window.confirm("View this historical version? Current unsaved changes will be lost.")) {
                              setEvaluation({
                                ...evaluation,
                                ...entry.changes
                              });
                            }
                          }}
                        >
                          View This Version
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </form>

            {!isEditing && evaluation.lastModified && (
              <div className="last-modified">
                Last modified: {new Date(evaluation.lastModified).toLocaleString()}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="navigation-footer">
        <button onClick={() => navigate('/active-interns')} className="view-active-button">
          View Active Interns
        </button>
        <button onClick={() => navigate(-1)} className="back-button">
          Back
        </button>
      </div>
    </div>
  );
}

export default CompletedInterns; 