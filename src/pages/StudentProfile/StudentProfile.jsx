import { useState } from "react";
import { Link } from "react-router-dom";
import StudentsNavBar from "../../components/studentsNavBar/StudentsNavBar";

function StudentProfile({ currUser, studentUsers, setStudentUsers }) {
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    interests: currUser.interests ? currUser.interests.join(", ") : "",
    skills: currUser.skills ? currUser.skills.join(", ") : "",
    experiences: currUser.experiences || [],
    activities: currUser.activities ? currUser.activities.join(", ") : "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleExperienceChange = (idx, field, value) => {
    setForm((prev) => {
      const updated = [...prev.experiences];
      updated[idx] = { ...updated[idx], [field]: value };
      return { ...prev, experiences: updated };
    });
  };

  const addExperience = () => {
    setForm((prev) => ({
      ...prev,
      experiences: [
        ...prev.experiences,
        { title: "", company: "", responsibilities: "", duration: "" },
      ],
    }));
  };

  const removeExperience = (idx) => {
    setForm((prev) => {
      const updated = prev.experiences.filter((_, i) => i !== idx);
      return { ...prev, experiences: updated };
    });
  };

  const handleSave = () => {
    setStudentUsers((prev) =>
      prev.map((s) =>
        s.username === currUser.username
          ? {
              ...s,
              interests: form.interests.split(",").map((s) => s.trim()),
              skills: form.skills.split(",").map((s) => s.trim()),
              experiences: form.experiences,
              activities: form.activities.split(",").map((s) => s.trim()),
            }
          : s
      )
    );
    setEditMode(false);
  };

  return (
    <div>
      <StudentsNavBar />
      <h1>Student Profile</h1>
      <h1>{currUser.username}</h1>
      ___________________________________
      <h2>Job Interests</h2>
      {editMode ? (
        <input
          name="interests"
          value={form.interests}
          onChange={handleChange}
          placeholder="e.g. Software, Marketing"
        />
      ) : (
        <p>{currUser.interests?.join(", ")}</p>
      )}
      ___________________________________
      <h2>Skills</h2>
      {editMode ? (
        <input
          name="skills"
          value={form.skills}
          onChange={handleChange}
          placeholder="e.g. Python, Communication"
        />
      ) : (
        <p>{currUser.skills?.join(", ")}</p>
      )}
      ___________________________________
      <h2>Experiences (Internships/Part-time Jobs)</h2>
      <ul>
        {editMode
          ? form.experiences.map((exp, idx) => (
              <li key={idx}>
                <input
                  placeholder="Title"
                  value={exp.title}
                  onChange={(e) => handleExperienceChange(idx, "title", e.target.value)}
                />
                <input
                  placeholder="Company"
                  value={exp.company}
                  onChange={(e) => handleExperienceChange(idx, "company", e.target.value)}
                />
                <input
                  placeholder="Responsibilities"
                  value={exp.responsibilities}
                  onChange={(e) => handleExperienceChange(idx, "responsibilities", e.target.value)}
                />
                <input
                  placeholder="Duration"
                  value={exp.duration}
                  onChange={(e) => handleExperienceChange(idx, "duration", e.target.value)}
                />
                <button onClick={() => removeExperience(idx)}>Remove</button>
              </li>
            ))
          : currUser.experiences?.map((experience, index) => (
              <li key={index}>
                <h3>{experience.title}</h3>
                <p>{experience.company}</p>
                <p>{experience.responsibilities}</p>
                <p>{experience.duration}</p>
              </li>
            ))}
      </ul>
      {editMode && <button onClick={addExperience}>Add Experience</button>}
      ___________________________________
      <h2>College Activities</h2>
      {editMode ? (
        <input
          name="activities"
          value={form.activities}
          onChange={handleChange}
          placeholder="e.g. Debate Club, Sports Team"
        />
      ) : (
        <p>{currUser.activities?.join(", ")}</p>
      )}
      ___________________________________
      <br />
      <br />
      {editMode ? (
        <>
          <button onClick={handleSave}>Save</button>
          <button onClick={() => setEditMode(false)}>Cancel</button>
        </>
      ) : (
        <button onClick={() => setEditMode(true)}>Edit Profile</button>
      )}
      <br />
      <Link to="/studentsDashboard">Go to Students Dashboard</Link>
    </div>
  );
}

export default StudentProfile;
