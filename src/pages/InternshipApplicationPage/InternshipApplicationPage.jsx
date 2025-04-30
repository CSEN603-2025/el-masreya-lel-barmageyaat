import { useParams } from "react-router-dom";

/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
//////this is the page where the intern uploads his cover leeter and documents///////
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////

function InternshipApplicationPage({
  companyUsers,
  setCompanyUsers,
  allInternships,
  setAllInternships,
  currUser,
}) {
  const { internshipId, companyName } = useParams();

  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    const updatedCompanies = companyUsers.map((company) => {
      if (company.username === companyName) {
        const updatedInternships = company.internships.map((internship) => {
          if (internship.id === parseInt(internshipId)) {
            const updatedApplications = internship.applications.map(
              (application) => {
                if (application.user.name === currUser.name) {
                  // Update existing application
                  return {
                    ...application,
                    coverLetter: formData.get("coverLetter"),
                    documents: formData.get("documents"),
                  };
                }
                return application;
              }
            );

            // if user hasn't applied before, add new application
            const userAlreadyApplied = internship.applications.some(
              (application) => application.user.name === currUser.name
            );

            if (!userAlreadyApplied) {
              updatedApplications.push({
                user: currUser,
                coverLetter: formData.get("coverLetter"),
                documents: formData.get("documents"),
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

    setCompanyUsers(updatedCompanies);
    alert("Application submitted");
    console.log("Application submitted");
  }

  return (
    <div>
      <h1>Any additional information you would like to give? </h1>
      <form onSubmit={handleSubmit}>
        <label>Cover Letter:</label>
        <textarea
          name="coverLetter"
          rows="4"
          cols="50"
          placeholder="Write your cover letter here..."
        ></textarea>
        <br />
        <label>Documents:</label>
        <input type="file" name="documents" />
        <br />
        <button type="submit">Submit</button>
        <button type="button" onClick={() => window.history.back()}>
          Back
        </button>
      </form>
    </div>
  );
}

export default InternshipApplicationPage;
