import { useNavigate, useParams } from "react-router-dom";
import "./ScadViewOfStudentProfile.css";

function ScadViewOfStudentProfile({ studentUsers, companyUsers }) {
  const { studentID } = useParams();
  const navigate = useNavigate();
  const student = studentUsers.find((s) => s.studentId === parseInt(studentID));

  if (!student)
    return (
      <p style={{ textAlign: "center", padding: "2rem" }}>
        🚫 Student not found.
      </p>
    );

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>
          {student.firstName} {student.lastName}
        </h1>
        <p>
          {student.username} — {student.email}
        </p>
      </div>

      <div className="profile-section">
        <strong>🎓 Graduation Year:</strong> {student.graduationYear}
      </div>

      <ProfileSection title="🛠 Skills" items={student.skills} />
      <ProfileSection title="📌 Interests" items={student.interests} />

      <div className="profile-section">
        <h3>💼 Experiences</h3>
        {student.experiences.map((exp) => (
          <div key={exp.id} className="profile-experience">
            <strong>{exp.title}</strong> at <em>{exp.company}</em>
            <div>
              {exp.responsibilities} ({exp.duration})
            </div>
          </div>
        ))}
      </div>

      <div className="profile-section">
        <h3>🎓 Education</h3>
        {student.education.map((edu, index) => (
          <div key={index} className="profile-education">
            {edu.degree} - <em>{edu.institution}</em> ({edu.graduationYear})
          </div>
        ))}
      </div>

      <h2 style={{ marginTop: "2rem" }}>Submitted Internship Reports</h2>
      {student.appliedInternships?.length > 0 ? (
        student.appliedInternships.map((internship, idx) => {
          const report = internship.report;
          const review = internship.review;
          const company = companyUsers.find(
            (c) => c.username === internship.companyUsername
          );

          return (
            <div
              key={idx}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "16px",
                marginBottom: "16px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}
            >
              <h3>
                {internship.internshipTitle} at{" "}
                {company?.name || "Unknown Company"}
              </h3>

              {report && (
                <p>
                  <strong>📅 Report Submitted On:</strong>{" "}
                  {new Date(report.date).toLocaleDateString()}
                </p>
              )}

              <div style={{ marginTop: "8px", display: "flex", gap: "12px" }}>
                {report && (
                  <button
                    onClick={() =>
                      navigate(
                        `/scad/viewInternshipItem/report/${student.studentId}/${internship.internshipId}/${internship.companyUsername}`
                      )
                    }
                  >
                    📄 View Report
                  </button>
                )}
                {review && (
                  <button
                    onClick={() =>
                      navigate(
                        `/scad/viewInternshipItem/review/${student.studentId}/${internship.internshipId}/${internship.companyUsername}`
                      )
                    }
                  >
                    📋 View Review
                  </button>
                )}
              </div>
            </div>
          );
        })
      ) : (
        <p>This student hasn't submitted any internship reports yet.</p>
      )}
    </div>
  );
}

function ProfileSection({ title, items }) {
  return (
    <div className="profile-section">
      <h3>{title}</h3>
      <ul className="profile-list">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default ScadViewOfStudentProfile;
