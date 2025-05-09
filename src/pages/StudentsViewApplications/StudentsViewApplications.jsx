import { useNavigate } from "react-router-dom";

function StudentsViewApplications({ companyUsers, studentUsers, currUserId }) {
  const currentUser = studentUsers.find(
    (user) => user.studentId === currUserId
  );
  const navigate = useNavigate();

  if (!currentUser) {
    return <h2>Student not found or not logged in.</h2>;
  } else if (
    !currentUser.appliedInternships ||
    currentUser.appliedInternships.length === 0
  ) {
    return <h2>No applications found.</h2>;
  }

  return (
    <div>
      <h1>View Applications</h1>

      {currentUser.appliedInternships.map((internship) => {
        const company = companyUsers.find((company) =>
          company.internships.some(
            (intern) => intern.internshipID === internship.internshipId
          )
        );

        if (!company) {
          console.warn(
            "No company found for internship ID:",
            internship.internshipID
          );
          return null;
        }

        const internshipDetails = company.internships.find(
          (intern) => intern.internshipID === internship.internshipId
        );

        if (!internshipDetails) {
          console.warn(
            "Internship details missing for ID:",
            internship.internshipID
          );
          return null;
        }
        const applicationStatus = internshipDetails.applications.find(
          (application) => application.username === currentUser.username
        )?.status;

        return (
          <div key={internship.internshipID}>
            <h2>{internshipDetails.title}</h2>
            <p>{internshipDetails.description}</p>
            <b>Application status: </b>
            {applicationStatus === "accepted" && (
              <h4 style={{ color: "green" }}>Accepted</h4>
            )}
            {applicationStatus === "rejected" && (
              <h4 style={{ color: "red" }}>Rejected</h4>
            )}
            {applicationStatus === "pending" && (
              <h4 style={{ color: "orange" }}>Pending</h4>
            )}
            {applicationStatus === "finalized" && (
              <h4 style={{ color: "blue" }}>finalized</h4>
            )}
            <button
              onClick={() =>
                navigate(
                  `/internshipDetails/${internshipDetails.internshipID}/${company.username}`
                )
              }
            >
              View Details
            </button>
            <button
              onClick={() =>
                navigate(
                  `/InternshipApplicationPage/${internshipDetails.internshipID}/${company.username}`
                )
              }
            >
              Edit Application
            </button>
            <button onClick={() => navigate(-1)} style={{ marginTop: "20px" }}>
              Go Back
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default StudentsViewApplications;
