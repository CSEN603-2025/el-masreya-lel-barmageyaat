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
      {console.log("currUserId: " + Number(currUserId))}
      {console.log("current user: ", currentUser)}
      {console.log("applied internships: ", currentUser.appliedInternships)}

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

        return (
          <div key={internship.internshipID}>
            <h2>{internshipDetails.title}</h2>
            <p>{internshipDetails.description}</p>
            {console.log("internshipDetails: ", internshipDetails)}
            {console.log("company: ", company)}
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
