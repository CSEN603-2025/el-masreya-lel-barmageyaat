import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./AllStudents.css";

function AllStudents({ studentUsers }) {
  const [filter, setFilter] = useState("all");
  const [filteredStudents, setFilteredStudents] = useState(studentUsers);
  console.log(studentUsers);
  useEffect(() => {
    if (filter === "all") {
      setFilteredStudents(studentUsers);
    } else if (filter === "applied") {
      setFilteredStudents(
        studentUsers.filter((s) => s.appliedInternships.length > 0)
      );
    } else if (filter === "not_applied") {
      setFilteredStudents(
        studentUsers.filter((s) => s.appliedInternships.length === 0)
      );
    }
  }, [filter, studentUsers]);

  return (
    <div className="students-container">
      <h1>All Students</h1>

      <div className="filter-bar">
        <label htmlFor="filter">Internship Status:</label>
        <select
          id="filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="applied">Applied</option>
          <option value="not_applied">Not Applied</option>
        </select>
      </div>

      <div className="student-list">
        {filteredStudents.map((student) => (
          <Link
            to={`/ScadViewOfStudentProfile/${student.studentId}`}
            key={student.studentId}
            className="student-card"
          >
            <div className="student-name">
              {student.firstName} {student.lastName}
            </div>
            <div className="student-email">{student.email}</div>
            <div
              className={`internship-status ${
                student.appliedInternships.length > 0
                  ? "applied"
                  : "not-applied"
              }`}
            >
              {student.appliedInternships.length > 0
                ? "Applied"
                : "Not Applied"}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default AllStudents;
