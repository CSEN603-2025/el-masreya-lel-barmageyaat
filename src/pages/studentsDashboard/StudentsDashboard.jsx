import React from "react";
import { Link } from "react-router-dom";
import StudentsNavBar from "../../components/studentsNavBar/StudentsNavBar";
import InternshipList from "../../components/InternshipList/InternshipList";
import InternshipFilter from "../../components/InternshipFilter/InternshipFilter";
import { useEffect, useMemo, useState, useCallback } from "react";

import "./StudentsDashboard.css";

function StudentsDashboard({
  companyUsers,
  currUser,
  studentUsers,
  markNotificationAsRead,
  clearAllNotifications,
}) {
  const allInternships = useMemo(() => {
    if (!companyUsers) return [];
    return companyUsers.flatMap((company) =>
      company.internships.map((internship) => ({
        ...internship,
        industry: company.industry || "Not specified",
      }))
    );
  }, [companyUsers]);

  const [filteredInternships, setFilteredInternships] = useState([]);

  // Get student notifications if user is logged in
  const studentNotifications = useMemo(() => {
    if (!currUser || !studentUsers) return [];
    const student = studentUsers.find(
      (s) => s.studentId === currUser.studentId
    );
    return student?.notifications || [];
  }, [currUser, studentUsers]);

  // Set filtered internships when allInternships changes
  useEffect(() => {
    // Only set state if different (to avoid endless loop)
    setFilteredInternships((prev) => {
      const newList = allInternships;
      const sameLength = prev.length === newList.length;
      const sameItems =
        sameLength && prev.every((item, idx) => item.id === newList[idx].id);

      return sameItems ? prev : newList;
    });
  }, [allInternships]);

  // Function to handle filter changes from the InternshipFilter component
  const handleFilterChange = useCallback((filteredResults) => {
    setFilteredInternships(filteredResults);
  }, []);

  return (
    <div className="students-dashboard">
      <StudentsNavBar
        currUser={currUser}
        notifications={studentNotifications}
        onMarkAsRead={markNotificationAsRead}
        onClearAll={clearAllNotifications}
      />

      <main className="dashboard-main">
        <div className="dashboard-header">
          <h1>Welcome, {currUser.firstName}!</h1>
        </div>

        <div className="quick-actions">
          <Link
            to={`/StudentInternships/${currUser.studentId}`}
            className="quick-action-card"
          >
            <i className="action-icon">💼</i>
            <h3>Current Internships</h3>
            <p>View and manage your active internships</p>
          </Link>

          <Link to="/student-past-internships" className="quick-action-card">
            <i className="action-icon">📚</i>
            <h3>Past Internships</h3>
            <p>View your completed internships and evaluations</p>
          </Link>

          <Link to="/ViewCompanyPostings" className="quick-action-card">
            <i className="action-icon">🔍</i>
            <h3>Find Internships</h3>
            <p>Browse and apply for new opportunities</p>
          </Link>

          <Link to="/StudentsViewApplications" className="quick-action-card">
            <i className="action-icon">📝</i>
            <h3>My Applications</h3>
            <p>Track your internship applications</p>
          </Link>
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <h2>Available Internships</h2>
            <InternshipFilter
              internships={allInternships}
              onFilterChange={handleFilterChange}
            />
          </div>

          <div className="internship-list">
            {filteredInternships.length > 0 ? (
              filteredInternships.map((internship) => (
                <InternshipList
                  internship={internship}
                  key={
                    internship.id || internship.companyName + internship.title
                  }
                />
              ))
            ) : (
              <div className="no-results">
                <h3>No internships found</h3>
                <p>Try adjusting your filters or search terms</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default StudentsDashboard;
