import { useParams } from "react-router-dom";

/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
//////this is the page where the intern uploads his cover leeter and documents///////
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
function InternshipApplicationPage({
  companyUsers,
  setCompanyUsers,
  currUser,
}) {
  const { internshipId, companyName } = useParams(); // Updated variable names

  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    console.log("we are in the handleSubmit function");
    const updatedCompanies = companyUsers.map((company) => {
      console.log("Company username:", company.username);
      console.log("Current company username: ", companyName);
      if (company.username === companyName) {
        // Updated variable name
        console.log("Company found:", company.username);
        const updatedInternships = company.internships.map((internship) => {
          if (internship.internshipID === parseInt(internshipId)) {
            console.log("internship found:", internship.internshipID);
            // Updated variable name
            const updatedApplications = internship.applications.map(
              (application) => {
                if (application.username === currUser.username) {
                  console.log("Application found for user:", currUser.username);
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
              (application) => application.username === currUser.username
            );

            if (!userAlreadyApplied) {
              updatedApplications.push({
                username: currUser.username,
                firstName: currUser.firstName,
                lastName: currUser.lastName,
                email: currUser.email,
                experiences: currUser.experiences,
                skills: currUser.skills,
                education: currUser.education,
                profilePicture: currUser.profilePicture,
                coverLetter: formData.get("coverLetter"),
                documents: formData.get("documents"),
                status: "Pending",
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
