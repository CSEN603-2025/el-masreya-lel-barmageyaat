import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import StudentsNavBar from "../../components/studentsNavBar/StudentsNavBar";
import "./SuggestedCompanies.css";

function SuggestedCompanies({ currUser, companyUsers, studentUsers }) {
  const [suggestedCompanies, setSuggestedCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [loading, setLoading] = useState(true);

  // Generate recommendations when component mounts or when user/companies change
  useEffect(() => {
    if (!currUser || !companyUsers || !studentUsers) {
      setLoading(false);
      return;
    }

    setLoading(true);

    // Delay to simulate loading data
    setTimeout(() => {
      // Get companies with matching interests/industry
      const interestBasedSuggestions = findCompaniesByInterests(
        currUser,
        companyUsers
      );

      // Get companies recommended by other students
      const peerRecommendations = findCompaniesByPeerRecommendations(
        currUser,
        companyUsers,
        studentUsers
      );

      // Get companies based on your major
      const majorBasedSuggestions = findCompaniesByMajor(
        currUser,
        companyUsers
      );

      // Combine all suggestions and remove duplicates
      const allSuggestions = [
        ...interestBasedSuggestions.map((company) => ({
          ...company,
          matchReason: "Based on your interests",
          matchType: "interest",
        })),
        ...peerRecommendations.map((company) => ({
          ...company,
          matchReason: "Recommended by past interns",
          matchType: "recommendation",
        })),
        ...majorBasedSuggestions.map((company) => ({
          ...company,
          matchReason: `Relevant to ${currUser.major || "your field"}`,
          matchType: "major",
        })),
      ];

      // Remove duplicates and prioritize by match type
      const uniqueSuggestions = removeDuplicateCompanies(allSuggestions);

      setSuggestedCompanies(uniqueSuggestions);
      setFilteredCompanies(uniqueSuggestions);
      setLoading(false);
    }, 1000);
  }, [currUser, companyUsers, studentUsers]);

  // Function to find companies matching student interests
  const findCompaniesByInterests = (student, companies) => {
    if (!student || !student.interests || !student.interests.length) {
      return [];
    }

    const interests = student.interests.map((interest) =>
      interest.toLowerCase()
    );

    return companies.filter((company) => {
      // Check if company industry matches any student interest
      if (
        company.industry &&
        interests.includes(company.industry.toLowerCase())
      ) {
        return true;
      }

      // Check if any internship description or title contains interest keywords
      if (company.internships) {
        return company.internships.some((internship) => {
          const description = internship.description
            ? internship.description.toLowerCase()
            : "";
          const title = internship.title ? internship.title.toLowerCase() : "";

          return interests.some(
            (interest) =>
              description.includes(interest) || title.includes(interest)
          );
        });
      }

      return false;
    });
  };

  // Function to find companies recommended by other students
  const findCompaniesByPeerRecommendations = (student, companies, students) => {
    // In a real app, you would fetch this from a database
    // For this demo, we'll simulate by using internships where students have completed
    const recommendedCompanies = [];

    students.forEach((otherStudent) => {
      // Skip the current student
      if (otherStudent.studentId === student.studentId) {
        return;
      }

      // Check if student has completed internships
      if (otherStudent.appliedInternships) {
        otherStudent.appliedInternships.forEach((application) => {
          const company = companies.find(
            (c) => c.username === application.companyUsername
          );
          if (company) {
            // Simulate a recommendation score
            const recommendationScore = Math.random() * 5; // 0-5 star rating
            if (recommendationScore >= 4) {
              recommendedCompanies.push({
                ...company,
                recommendationScore,
                recommendedBy: otherStudent.username,
              });
            }
          }
        });
      }
    });

    return recommendedCompanies;
  };

  // Function to find companies that match student's major
  const findCompaniesByMajor = (student, companies) => {
    if (!student || !student.major) {
      return [];
    }

    const majorKeywords = getMajorKeywords(student.major);

    return companies.filter((company) => {
      // Check if company has internships with descriptions related to major
      if (company.internships) {
        return company.internships.some((internship) => {
          const description = internship.description
            ? internship.description.toLowerCase()
            : "";
          const title = internship.title ? internship.title.toLowerCase() : "";
          const requirements = internship.requirements
            ? internship.requirements.join(" ").toLowerCase()
            : "";

          return majorKeywords.some(
            (keyword) =>
              description.includes(keyword) ||
              title.includes(keyword) ||
              requirements.includes(keyword)
          );
        });
      }

      return false;
    });
  };

  // Remove duplicate companies with the same ID
  const removeDuplicateCompanies = (companies) => {
    const uniqueCompanies = [];
    const companyIds = new Set();

    companies.forEach((company) => {
      if (!companyIds.has(company.username)) {
        companyIds.add(company.username);
        uniqueCompanies.push(company);
      }
    });

    return uniqueCompanies;
  };

  // Get keywords related to a major
  const getMajorKeywords = (major) => {
    // Map of majors to related keywords
    const majorKeywordsMap = {
      "Computer Science": [
        "software",
        "programming",
        "algorithm",
        "data structure",
        "computer",
        "code",
        "database",
        "development",
      ],
      "Information Technology": [
        "IT",
        "network",
        "system",
        "infrastructure",
        "support",
        "helpdesk",
        "security",
      ],
      "Computer Engineering": [
        "hardware",
        "circuit",
        "embedded",
        "processor",
        "architecture",
        "system",
      ],
      "Software Engineering": [
        "software",
        "development",
        "agile",
        "scrum",
        "testing",
        "quality",
      ],
      "Data Science": [
        "data",
        "analytics",
        "machine learning",
        "statistics",
        "visualization",
        "prediction",
      ],
      Cybersecurity: [
        "security",
        "encryption",
        "firewall",
        "threat",
        "vulnerability",
        "protection",
      ],
      "Business Administration": [
        "management",
        "administration",
        "strategy",
        "organization",
        "leadership",
      ],
      Marketing: [
        "marketing",
        "advertising",
        "promotion",
        "sales",
        "brand",
        "market research",
      ],
      Finance: [
        "finance",
        "accounting",
        "investment",
        "budget",
        "financial",
        "banking",
      ],
      Engineering: [
        "engineering",
        "design",
        "analysis",
        "system",
        "technical",
        "development",
      ],
      // Add more majors and keywords as needed
    };

    // Get keywords for the specific major or use general keywords
    let keywords = majorKeywordsMap[major] || [];

    // Add the major itself as a keyword
    keywords.push(major.toLowerCase());

    // Add some general internship keywords that are relevant to all majors
    const generalKeywords = ["intern", "student", "entry level", "junior"];

    return [...keywords, ...generalKeywords].map((keyword) =>
      keyword.toLowerCase()
    );
  };

  // Handle filter change
  const handleFilterChange = (filter) => {
    setFilterType(filter);

    if (filter === "all") {
      setFilteredCompanies(suggestedCompanies);
    } else {
      setFilteredCompanies(
        suggestedCompanies.filter((company) => company.matchType === filter)
      );
    }
  };

  return (
    <div className="suggested-companies-container">
      <StudentsNavBar />
      <div className="page-header">
        <h1>Suggested Companies for You</h1>
        <p className="user-info">
          Based on your profile:
          {currUser.major && (
            <span>
              {" "}
              Major: <strong>{currUser.major}</strong>
            </span>
          )}
          {currUser.interests && currUser.interests.length > 0 && (
            <span>
              {" "}
              Interests: <strong>{currUser.interests.join(", ")}</strong>
            </span>
          )}
        </p>
      </div>

      <div className="filter-controls">
        <button
          className={`filter-button ${filterType === "all" ? "active" : ""}`}
          onClick={() => handleFilterChange("all")}
        >
          All Suggestions
        </button>
        <button
          className={`filter-button ${
            filterType === "interest" ? "active" : ""
          }`}
          onClick={() => handleFilterChange("interest")}
        >
          Based on Interests
        </button>
        <button
          className={`filter-button ${filterType === "major" ? "active" : ""}`}
          onClick={() => handleFilterChange("major")}
        >
          Based on Major
        </button>
        <button
          className={`filter-button ${
            filterType === "recommendation" ? "active" : ""
          }`}
          onClick={() => handleFilterChange("recommendation")}
        >
          Peer Recommendations
        </button>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Finding the best matches for you...</p>
        </div>
      ) : (
        <>
          {filteredCompanies.length > 0 ? (
            <div className="companies-grid">
              {filteredCompanies.map((company, index) => (
                <div key={index} className="company-card">
                  <div className="company-header">
                    <h2>{company.name || company.username}</h2>
                    {company.recommendationScore && (
                      <div className="recommendation-score">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span
                            key={i}
                            className={
                              i < Math.floor(company.recommendationScore)
                                ? "star filled"
                                : "star"
                            }
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <p className="company-industry">
                    <strong>Industry:</strong> {company.industry}
                  </p>
                  <p className="match-reason">{company.matchReason}</p>

                  {company.recommendedBy && (
                    <p className="recommended-by">
                      Recommended by: {company.recommendedBy}
                    </p>
                  )}

                  {company.internships && company.internships.length > 0 && (
                    <div className="internship-list">
                      <h3>Available Internships</h3>
                      <ul>
                        {company.internships
                          .slice(0, 2)
                          .map((internship, idx) => (
                            <li key={idx}>
                              <Link
                                to={`/internshipDetails/${internship.internshipID}/${company.username}`}
                                className="internship-link"
                              >
                                {internship.title} -{" "}
                                {internship.paid ? "Paid" : "Unpaid"}
                              </Link>
                            </li>
                          ))}
                      </ul>
                      {company.internships.length > 2 && (
                        <p className="more-internships">
                          +{company.internships.length - 2} more internships
                        </p>
                      )}
                    </div>
                  )}

                  <div className="company-actions">
                    <Link
                      to={`/companyProfile/${company.username}`}
                      className="view-profile-btn"
                    >
                      View Company Profile
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-results">
              <h2>No matching companies found</h2>
              <p>
                Try adjusting your profile interests or major to get better
                recommendations.
              </p>
              <Link to="/StudentProfile" className="update-profile-btn">
                Update Your Profile
              </Link>
            </div>
          )}
        </>
      )}

      <div className="page-actions">
        <Link to="/studentsDashboard" className="back-link">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}

export default SuggestedCompanies;
