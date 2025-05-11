import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";

function StudentReportSubmission({ studentUsers, setStudentUsers }) {
  const { studentId, internshipId, companyUsername } = useParams();
  const navigate = useNavigate();

  // Use studentId to find the student
  const student = studentUsers.find(
    (student) => student.studentId === parseInt(studentId)
  );

  // Use internshipId and companyUsername to find the corresponding applied internship
  const appliedInternship = student?.appliedInternships.find(
    (internship) =>
      internship.internshipId === parseInt(internshipId) &&
      internship.companyUsername === companyUsername
  );

  console.log(appliedInternship);
  // State to handle the report submission
  const [report, setReport] = useState("");
  const [rating, setRating] = useState(1);
  const [duration, setDuration] = useState("");
  const [file, setFile] = useState(null);
  const [recommend, setRecommend] = useState(""); // Yes or No recommendation

  // Handle form submission
  const handleReportSubmit = (e) => {
    e.preventDefault();

    if (appliedInternship) {
      // Add the review object to the applied internship
      const updatedAppliedInternship = {
        ...appliedInternship,
        review: {
          content: report,
          date: new Date().toISOString(), // You can store the submission date if needed
          rating, // Adding the rating field
          recommend, // Whether the internship is recommended or not
          duration, // Duration of the internship
          file: file ? file.name : null, // If there's a file, store its name (optional)
        },
      };

      // Update the student's appliedInternships array with the updated internship
      setStudentUsers((prevStudents) =>
        prevStudents.map((stu) =>
          stu.studentId === student.studentId
            ? {
                ...stu,
                appliedInternships: stu.appliedInternships.map((internship) =>
                  internship.internshipId === appliedInternship.internshipId &&
                  internship.companyUsername ===
                    appliedInternship.companyUsername
                    ? updatedAppliedInternship // Update the specific internship
                    : internship
                ),
              }
            : stu
        )
      );

      // Redirect the student to a confirmation or back to the previous page
      alert("Report submitted successfully!");
      navigate(-1); // Go back to the previous page
    } else {
      alert("No matching internship found.");
    }
  };

  return (
    <div>
      <h1>Student Report Submission</h1>

      {appliedInternship ? (
        <form onSubmit={handleReportSubmit}>
          <div>
            <label htmlFor="report">Internship Report:</label>
            <textarea
              id="report"
              name="report"
              rows="5"
              cols="50"
              value={report}
              onChange={(e) => setReport(e.target.value)}
              required
            ></textarea>
          </div>

          <div>
            <label htmlFor="rating">Rating (1 to 5):</label>
            <input
              type="number"
              id="rating"
              name="rating"
              value={rating}
              onChange={(e) =>
                setRating(Math.max(1, Math.min(5, e.target.value)))
              }
              min="1"
              max="5"
              required
            />
          </div>

          <div>
            <label htmlFor="duration">Internship Duration:</label>
            <input
              type="text"
              id="duration"
              name="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="recommend">
              Would you recommend this internship to another student?
            </label>
            <div>
              <label>
                <input
                  type="radio"
                  name="recommend"
                  value="yes"
                  onChange={(e) => setRecommend(e.target.value)}
                  checked={recommend === "yes"}
                />
                Yes
              </label>
              <label>
                <input
                  type="radio"
                  name="recommend"
                  value="no"
                  onChange={(e) => setRecommend(e.target.value)}
                  checked={recommend === "no"}
                />
                No
              </label>
            </div>
          </div>

          <div>
            <label htmlFor="file">Upload File (optional):</label>
            <input
              type="file"
              id="file"
              name="file"
              accept=".jpg, .jpeg, .png, .pdf"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>

          <button type="submit">Submit Report</button>
        </form>
      ) : (
        <p>No matching internship found for this student.</p>
      )}
      <button onClick={() => navigate(-1)}>Go Back</button>
    </div>
  );
}

export default StudentReportSubmission;
