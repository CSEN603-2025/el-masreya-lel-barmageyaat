import { useParams } from "react-router-dom";

/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
//////this is the page where the intern uploads his cover leeter and documents///////
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
function InternshipApplicationPage({
  companyUsers,
  setCompanyUsers,
  currUserId,
  studentUsers,
  setStudentUsers,
}) {
  const { internshipId, companyName } = useParams(); // Updated variable names
  const currUser = studentUsers.find((user) => user.studentId === currUserId);

  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    // Handling file upload, ensuring it's attached correctly
    const documentFile = formData.get("documents"); // This will be the file
    const coverLetter = formData.get("coverLetter"); // This will be the cover letter text

    const updatedCompanies = companyUsers.map((company) => {
      if (company.username === companyName) {
        const updatedInternships = company.internships.map((internship) => {
          if (internship.internshipID === parseInt(internshipId)) {
            let updatedApplications = internship.applications.map(
              (application) => {
                if (application.username === currUser.username) {
                  return {
                    ...application,
                    coverLetter,
                    documents: documentFile, // Store the file object
                  };
                }
                return application;
              }
            );

            // If user hasn't applied before, add new application
            const userAlreadyApplied = internship.applications.some(
              (application) => application.username === currUser.username
            );

            if (!userAlreadyApplied) {
              updatedApplications = [
                ...updatedApplications,
                {
                  applicationId: internship.applications.length + 1,
                  username: currUser.username,
                  firstName: currUser.firstName,
                  lastName: currUser.lastName,
                  email: currUser.email,
                  experiences: currUser.experiences,
                  skills: currUser.skills,
                  education: currUser.education,
                  profilePicture: currUser.profilePicture,
                  coverLetter,
                  documents: documentFile, // Store the file object
                  status: "Pending",
                  internshipStatus: "didntStartYet",
                },
              ];
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

    // Update student users with applied internships
    const updatedStudents = studentUsers.map((student) => {
      if (student.studentId === currUserId) {
        const alreadyReferenced = (student.appliedInternships || []).some(
          (app) =>
            app.internshipId === parseInt(internshipId) &&
            app.companyUsername === companyName
        );

        if (!alreadyReferenced) {
          const updatedApplications = [
            ...(student.appliedInternships || []),
            {
              internshipId: parseInt(internshipId),
              companyUsername: companyName,
            },
          ];
          return {
            ...student,
            appliedInternships: updatedApplications,
          };
        }
      }
      return student;
    });

    setStudentUsers(updatedStudents);
    alert("Application submitted");
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
