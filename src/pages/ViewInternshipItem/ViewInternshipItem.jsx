import { useParams } from "react-router-dom";

function ViewInternshipItem({ studentUsers }) {
  const { type, studentId, internshipId, companyUsername } = useParams();

  const student = studentUsers.find((s) => s.studentId === parseInt(studentId));

  if (!student) {
    return <p>🚫 Student not found.</p>;
  }

  const internship = student.appliedInternships.find(
    (i) =>
      i.internshipId === parseInt(internshipId) &&
      i.companyUsername === companyUsername
  );

  if (!internship) {
    return <p>🚫 Internship not found for this student.</p>;
  }

  if (type === "report") {
    const report = internship.report;
    if (!report) return <p>🚫 No report found.</p>;

    return (
      <div>
        <h1>📄 Internship Report</h1>
        <p>
          <strong>Submitted On:</strong>{" "}
          {new Date(report.date).toLocaleDateString()}
        </p>
        <p>
          <strong>Content:</strong>
        </p>
        <div style={{ whiteSpace: "pre-line", marginTop: "1rem" }}>
          {report.content}
        </div>
      </div>
    );
  }

  if (type === "review") {
    const review = internship.review;
    if (!review) return <p>🚫 No review found.</p>;

    return (
      <div>
        <h1>📋 Internship Review</h1>
        <p>
          <strong>Reviewed By:</strong> {review.reviewer}
        </p>
        <p>
          <strong>Rating:</strong> {review.rating} ⭐
        </p>
        <p>
          <strong>Comments:</strong>
        </p>
        <div style={{ whiteSpace: "pre-line", marginTop: "1rem" }}>
          {review.comments}
        </div>
      </div>
    );
  }

  return <p>❓ Invalid type in URL. Use "report" or "review".</p>;
}

export default ViewInternshipItem;
