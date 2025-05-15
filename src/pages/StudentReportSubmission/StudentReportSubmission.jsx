import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";

function StudentReportSubmission({ studentUsers, setStudentUsers }) {
  const { studentId, internshipId, companyUsername } = useParams();
  const navigate = useNavigate();
  const majorCourseMap = {
    "Computer Engineering": [
      "Data Structures",
      "Operating Systems",
      "Computer Networks",
      "Database Systems",
    ],
    "Business Administration": [
      "Marketing",
      "Organizational Behavior",
      "Corporate Finance",
    ],
    "Mechanical Engineering": [
      "Thermodynamics",
      "Fluid Mechanics",
      "Control Systems",
    ],
    // Add more as needed
  };

  const student = studentUsers.find(
    (student) => student.studentId === parseInt(studentId)
  );

  const appliedInternship = student?.appliedInternships.find(
    (internship) =>
      internship.internshipId === parseInt(internshipId) &&
      internship.companyUsername === companyUsername
  );

  const [report, setReport] = useState("");
  const [rating, setRating] = useState(1);
  const [duration, setDuration] = useState("");
  const [file, setFile] = useState(null);
  const [recommend, setRecommend] = useState("");
  const [selectedMajor, setSelectedMajor] = useState("");
  const [selectedCourses, setSelectedCourses] = useState([]);

  const handleReportSubmit = (e) => {
    e.preventDefault();

    if (appliedInternship) {
      const updatedAppliedInternship = {
        ...appliedInternship,
        review: {
          content: report,
          date: new Date().toISOString(),
          rating,
          recommend,
          duration,
          file: file ? file.name : null,
          major: selectedMajor,
          courses: selectedCourses,
        },
      };

      setStudentUsers((prevStudents) =>
        prevStudents.map((stu) =>
          stu.studentId === student.studentId
            ? {
                ...stu,
                appliedInternships: stu.appliedInternships.map((internship) =>
                  internship.internshipId === appliedInternship.internshipId &&
                  internship.companyUsername ===
                    appliedInternship.companyUsername
                    ? updatedAppliedInternship
                    : internship
                ),
              }
            : stu
        )
      );

      alert("Report submitted successfully!");
      navigate(-1);
    } else {
      alert("No matching internship found.");
    }
  };

  const handleCourseChange = (e) => {
    const value = e.target.value;
    setSelectedCourses((prevCourses) =>
      prevCourses.includes(value)
        ? prevCourses.filter((course) => course !== value)
        : [...prevCourses, value]
    );
  };

  return (
    <div>
      <h1>Student Evaluation Submission for {companyUsername}</h1>

      {appliedInternship ? (
        <form onSubmit={handleReportSubmit}>
          <div>
            <label htmlFor="report">Internship Report:</label>
            <textarea
              id="report"
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
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>

          <div>
            <label>Would you recommend this internship?</label>
            <div>
              <label>
                <input
                  type="radio"
                  name="recommend"
                  value="yes"
                  checked={recommend === "yes"}
                  onChange={(e) => setRecommend(e.target.value)}
                />
                Yes
              </label>
              <label>
                <input
                  type="radio"
                  name="recommend"
                  value="no"
                  checked={recommend === "no"}
                  onChange={(e) => setRecommend(e.target.value)}
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
              accept=".jpg, .jpeg, .png, .pdf"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>

          <div>
            <label htmlFor="major">Select Your Major:</label>
            <select
              id="major"
              value={selectedMajor}
              onChange={(e) => {
                setSelectedMajor(e.target.value);
                setSelectedCourses([]); // Reset courses when major changes
              }}
              required
            >
              <option value="">-- Select Major --</option>
              {Object.keys(majorCourseMap).map((major) => (
                <option key={major} value={major}>
                  {major}
                </option>
              ))}
            </select>
          </div>

          {selectedMajor && (
            <div>
              <label>
                Select Courses That Helped You Durring The Internship:
              </label>
              {majorCourseMap[selectedMajor].map((course) => (
                <div key={course}>
                  <label>
                    <input
                      type="checkbox"
                      value={course}
                      checked={selectedCourses.includes(course)}
                      onChange={handleCourseChange}
                    />
                    {course}
                  </label>
                </div>
              ))}
            </div>
          )}

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
