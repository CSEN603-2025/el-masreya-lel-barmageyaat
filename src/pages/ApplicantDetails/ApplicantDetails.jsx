import { useParams, useNavigate } from "react-router-dom";

function ApplicantDetails({ companyUsers }) {
  const { username } = useParams();
  const navigate = useNavigate();

  const applicant = companyUsers.map((company) =>
    company.internships.map((internship) => {
      return internship.applications.find(
        (application) => application.user.username === username
      );
    })
  );

  return (
    <div>
      <h1>this is the applicant</h1>
      {applicant.length > 0 ? (
        <div>
          <p>Applicant data found. Check the console for details.</p>
          <div>
            {applicant[1]
              .filter((app) => app !== undefined)
              .map((application, index) => (
                <div key={index}>
                  <p>Name: {application.user.username}</p>
                  <p>Email: {application.user.email}</p>
                  {application.documents && (
                    <p>
                      Resume:{" "}
                      <a
                        href={URL.createObjectURL(
                          new Blob([application.documents])
                        )}
                        download="resume.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Download Resume
                      </a>
                    </p>
                  )}
                  <p>Cover Letter: {application.coverLetter}</p>
                  <p>Status: {application.status}</p>
                  {
                    <div>
                      <select
                        onChange={(e) => {
                          application.status = e.target.value;
                        }}
                        defaultValue="Pending"
                      >
                        <option value="Pending" disabled>
                          Pending
                        </option>
                        <option value="finalized">Finalized</option>
                        <option value="accepted">Accepted</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                  }
                </div>
              ))}
          </div>
          {console.log("Applicant:", applicant[1])}
        </div>
      ) : (
        <p>No applications found for this user.</p>
      )}
      <button
        onClick={() => navigate(-1)}
        style={{
          marginBottom: "20px",
          padding: "8px 16px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Back
      </button>
    </div>
  );
}

export default ApplicantDetails;
