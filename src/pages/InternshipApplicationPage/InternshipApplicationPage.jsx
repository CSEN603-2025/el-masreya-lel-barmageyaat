import { useLocation, useParams } from "react-router-dom";

function InternshipApplicationPage({
  allInternships,
  setAllInternships,
  currUser,
}) {
  const { internshipId } = useParams();

  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const updatedInternships = allInternships.map((internship) => {
      if (internship.id === parseInt(internshipId)) {
        return {
          ...internship,
          applications: [
            ...internship.applications,
            {
              user: currUser,
              coverLetter: formData.get("coverLetter"),
            },
          ],
        };
      }

      return internship;
    });
    // // Handle form submission logic here
    setAllInternships(updatedInternships);
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
        <label>documents:</label>
        <button type="submit">Submit</button>
        <button type="button" onClick={() => window.history.back()}>
          Back
        </button>
      </form>
    </div>
  );
}

export default InternshipApplicationPage;
