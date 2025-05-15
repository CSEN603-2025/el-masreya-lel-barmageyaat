import { useState, useMemo } from "react";
import InternshipFilter from "../../components/InternshipFilter/InternshipFilter";
import "./MyInterns.css";

function MyInterns({ companyUsers, currUser }) {
  const currCompany = companyUsers.find(
    (company) => company.companyId === currUser.companyId
  );

  if (!currCompany || !currCompany.internships) {
    return <div className="my-interns-container">
      <h1>My Interns</h1>
      <p className="no-data">No company or internships found.</p>
    </div>;
  }

  // Extract all internships with appropriate data for filtering
  const allInternships = useMemo(() => {
    return currCompany.internships.map(internship => ({
      ...internship,
      // Make sure internship has all the properties needed for filtering
      industry: currCompany.industry || "Not specified",
      paid: internship.paid || false,
      duration: internship.duration || "Not specified",
      companyName: currCompany.name || currCompany.username
    }));
  }, [currCompany]);

  const [filteredInternships, setFilteredInternships] = useState(allInternships);
  const [currentView, setCurrentView] = useState("internships"); // 'internships' or 'interns'

  // Handle filter changes from the InternshipFilter component
  const handleFilterChange = (filteredResults) => {
    setFilteredInternships(filteredResults);
  };

  // Extract all interns from filtered internships
  const interns = useMemo(() => {
    return filteredInternships.flatMap(internship => 
      (internship.applications || [])
        .filter(app => app.internshipStatus === "currentIntern" || app.internshipStatus === "InternshipComplete")
        .map(app => ({
          ...app,
          internshipTitle: internship.title,
          internshipId: internship.internshipID,
          duration: internship.duration,
          paid: internship.paid
        }))
    );
  }, [filteredInternships]);

  return (
    <div className="my-interns-container">
      <h1>Company Dashboard</h1>
      
      <div className="view-toggle">
        <button 
          className={`toggle-button ${currentView === 'internships' ? 'active' : ''}`}
          onClick={() => setCurrentView('internships')}
        >
          View Internships
        </button>
        <button 
          className={`toggle-button ${currentView === 'interns' ? 'active' : ''}`}
          onClick={() => setCurrentView('interns')}
        >
          View Interns
        </button>
      </div>
      
      <div className="filter-container">
        <h2>Filter Options</h2>
        <InternshipFilter 
          internships={allInternships} 
          onFilterChange={handleFilterChange}
          showCompanyFilter={false} // No need to filter by company since it's a single company view
        />
      </div>
      
      {currentView === 'internships' ? (
        <div className="internships-list">
          <h2>My Internship Postings</h2>
          {filteredInternships.length > 0 ? (
            filteredInternships.map((internship) => (
              <div key={internship.internshipID} className="internship-card">
                <div className="internship-header">
                  <h3>{internship.title}</h3>
                  <span className={`internship-badge ${internship.paid ? 'paid' : 'unpaid'}`}>
                    {internship.paid ? 'Paid' : 'Unpaid'}
                  </span>
                </div>
                <p><strong>Duration:</strong> {internship.duration}</p>
                <p><strong>Location:</strong> {internship.location}</p>
                <p><strong>Industry:</strong> {internship.industry}</p>
                <p>
                  <strong>Applications:</strong> {internship.applications ? internship.applications.length : 0}
                </p>
              </div>
            ))
          ) : (
            <p className="no-data">No internships match your filter criteria.</p>
          )}
        </div>
      ) : (
        <div className="interns-list">
          <h2>Current and Past Interns</h2>
          {interns.length > 0 ? (
            interns.map((intern) => (
              <div key={`${intern.username}-${intern.internshipId}`} className="intern-card">
                <div className="intern-header">
                  <h3>{intern.firstName} {intern.lastName}</h3>
                  <span className={`status-badge ${intern.internshipStatus === 'currentIntern' ? 'current' : 'past'}`}>
                    {intern.internshipStatus === 'currentIntern' ? 'Current Intern' : 'Past Intern'}
                  </span>
                </div>
                <p><strong>Position:</strong> {intern.internshipTitle}</p>
                <p><strong>Intern Username:</strong> {intern.username}</p>
                <p><strong>Duration:</strong> {intern.duration}</p>
                <p><strong>Compensation:</strong> {intern.paid ? 'Paid' : 'Unpaid'}</p>
              </div>
            ))
          ) : (
            <p className="no-data">No interns match your filter criteria.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default MyInterns;
