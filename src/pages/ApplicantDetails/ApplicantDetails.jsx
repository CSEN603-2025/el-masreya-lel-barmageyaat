import { useParams, useNavigate } from "react-router-dom";

function ApplicantDetails({ companyUsers, setCompanyUsers, addNotification }) {
  const { username } = useParams();
  const navigate = useNavigate();

  // Fetch the company applicant data
  const companyApplicant = companyUsers.flatMap((company) =>
    company.internships.flatMap((internship) =>
      internship.applications.filter(
        (application) => application.username === username
      )
    )
  )[0]; // the [0] is to get the first match

  return (
    <div>
      {companyApplicant ? (
        <div>
          <b>name:</b> {companyApplicant.firstName} {companyApplicant.lastName}
          <br />
          <b>cover letter:</b> {companyApplicant.coverLetter}
          <br />
          <b>email:</b> {companyApplicant.email}
          <br />
          <b>skills:</b>
          <ul>
            {companyApplicant.skills.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>
          <br />
          experiences: <h4>this is a placeholder for the experiences</h4>
          <br />
          <label>status:</label>
          <select
            value={companyApplicant.status}
            onChange={(e) => {
              const newStatus = e.target.value;
              const prevStatus = companyApplicant.status;
              
              const updatedCompanyUsers = companyUsers.map((company) => {
                return {
                  ...company,
                  internships: company.internships.map((internship) => {
                    return {
                      ...internship,
                      applications: internship.applications.map(
                        (application) => {
                          if (application.username === username) {
                            return { 
                              ...application, 
                              status: newStatus,
                              statusNotified: false // Reset notification flag
                            };
                          }
                          return application;
                        }
                      ),
                    };
                  }),
                };
              });
              
              setCompanyUsers(updatedCompanyUsers);
              
              // Send a notification when status changes
              if (addNotification && prevStatus !== newStatus) {
                if (newStatus === "accepted") {
                  addNotification(`Application for ${companyApplicant.firstName} ${companyApplicant.lastName} has been accepted.`, "success");
                } else if (newStatus === "rejected") {
                  addNotification(`Application for ${companyApplicant.firstName} ${companyApplicant.lastName} has been rejected.`, "error");
                } else if (newStatus === "finalized") {
                  addNotification(`Application for ${companyApplicant.firstName} ${companyApplicant.lastName} has been finalized.`, "info");
                }
              }
            }}
          >
            <option value="pending">pending</option>
            <option value="accepted">accepted</option>
            <option value="rejected">rejected</option>
            <option value="finalized">finalized</option>
          </select>
          <br />
          <label>internship status: </label>
          <select
            value={companyApplicant.internshipStatus}
            onChange={(e) => {
              const newInternshipStatus = e.target.value;
              const prevStatus = companyApplicant.internshipStatus;
              
              const updatedCompanyUsers = companyUsers.map((company) => {
                return {
                  ...company,
                  internships: company.internships.map((internship) => {
                    return {
                      ...internship,
                      applications: internship.applications.map(
                        (application) => {
                          if (application.username === username) {
                            return {
                              ...application,
                              internshipStatus: newInternshipStatus,
                              internshipStatusNotified: false // Reset notification flag
                            };
                          }
                          return application;
                        }
                      ),
                    };
                  }),
                };
              });
              
              setCompanyUsers(updatedCompanyUsers);
              
              // Send a notification when internship status changes
              if (addNotification && prevStatus !== newInternshipStatus) {
                if (newInternshipStatus === "currentIntern") {
                  addNotification(`${companyApplicant.firstName} ${companyApplicant.lastName} has started the internship.`, "info");
                } else if (newInternshipStatus === "InternshipComplete") {
                  addNotification(`${companyApplicant.firstName} ${companyApplicant.lastName} has completed the internship.`, "success");
                }
              }
            }}
          >
            <option value="didntStartYet">didn't start yet</option>
            <option value="currentIntern">current intern</option>
            <option value="InternshipComplete">InternshipComplete</option>
          </select>
          <br />
        </div>
      ) : (
        <h1>No applicants found with that name (this is a code issue)</h1>
      )}
      <button onClick={() => navigate(-1)} style={{ marginTop: "20px" }}>
        Go Back
      </button>
    </div>
  );
}

export default ApplicantDetails;
