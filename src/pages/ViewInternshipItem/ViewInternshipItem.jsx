import { useParams } from "react-router-dom";

function ViewInternshipItem({ studentUsers }) {
  const { type, studentId, internshipId, companyUsername } = useParams();

  const student = studentUsers.find((s) => s.studentId === parseInt(studentId, 10));

  if (!student) {
    return <p>🚫 Student not found.</p>;
  }

  const internship = student.appliedInternships.find(
    (i) =>
      i.internshipId === parseInt(internshipId, 10) &&
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
        {/* Content */}
        <p>
          <strong>Content:</strong>
        </p>
        <div style={{ whiteSpace: "pre-line", marginTop: "0.5rem" }}>
          {review.content}
        </div>

        {/* Date */}
        {review.date && (
          <p>
            <strong>Date:</strong> {new Date(review.date).toLocaleDateString()}
          </p>
        )}

        {/* Rating */}
        {review.rating != null && (
          <p>
            <strong>Rating:</strong> {review.rating} ⭐
          </p>
        )}

        {/* Recommend */}
        {review.recommend != null && (
          <p>
            <strong>Recommend:</strong> {review.recommend ? "Yes" : "No"}
          </p>
        )}

        {/* Duration */}
        {review.duration && (
          <p>
            <strong>Duration:</strong> {review.duration}
          </p>
        )}

        {/* Major Courses */}
        {review.majorCourses && (
          <p>
            <strong>Major Courses:</strong>
          </p>
        )}
        {review.majorCourses && (
          <div style={{ whiteSpace: "pre-line", marginTop: "0.5rem" }}>
            {review.majorCourses}
          </div>
        )}

        {/* Optional File */}
        {review.fileUrl && (
          <p>
            <strong>Attachment:</strong>{" "}
            <a href={review.fileUrl} target="_blank" rel="noopener noreferrer">
              Download File
            </a>
          </p>
        )}
      </div>
    );
  }

  return <p>❓ Invalid type in URL. Use "report" or "review".</p>;
}

export default ViewInternshipItem;
