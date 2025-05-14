import { useState } from "react";
import InternshipList from "../../components/InternshipList/InternshipList";
import InternshipForm from "../../components/InternshipForm/InternshipForm";

function CompanyViewPostings({ currUser, setCompanyUsers }) {
  const [showForm, setShowForm] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [formInitial, setFormInitial] = useState({});

  if (!currUser) return <p>No internships available.</p>;

  const handleAdd = () => {
    setFormInitial({});
    setEditIndex(null);
    setShowForm(true);
  };

  const handleEdit = (idx) => {
    setFormInitial(currUser.internships[idx]);
    setEditIndex(idx);
    setShowForm(true);
  };

  const handleDelete = (idx) => {
    if (window.confirm("Are you sure you want to delete this internship?")) {
      const updatedInternships = currUser.internships.filter((_, i) => i !== idx);
      setCompanyUsers((prev) =>
        prev.map((c) =>
          c.username === currUser.username
            ? { ...c, internships: updatedInternships }
            : c
        )
      );
    }
  };

  const handleFormSubmit = (data) => {
    let updatedInternships;
    if (editIndex !== null) {
      // Update
      updatedInternships = currUser.internships.map((item, idx) =>
        idx === editIndex ? { ...item, ...data } : item
      );
    } else {
      // Create
      const newInternship = {
        ...data,
        internshipID: Date.now(),
        companyName: currUser.username,
        applications: [],
        status: "Open",
      };
      updatedInternships = [...currUser.internships, newInternship];
    }
    setCompanyUsers((prev) =>
      prev.map((c) =>
        c.username === currUser.username
          ? { ...c, internships: updatedInternships }
          : c
      )
    );
    setShowForm(false);
    setEditIndex(null);
  };

  return (
    <div>
      <h1>Company View Postings</h1>
      <button onClick={handleAdd}>Add Internship</button>
      {showForm && (
        <InternshipForm
          onSubmit={handleFormSubmit}
          initialData={formInitial}
          onCancel={() => setShowForm(false)}
        />
      )}
      {currUser.internships.length === 0 && <p>No internships available.</p>}
      {currUser.internships.map((internship, idx) => (
        <div key={internship.internshipID} style={{ marginBottom: 16 }}>
          <InternshipList internship={internship} />
          <button onClick={() => handleEdit(idx)}>Edit</button>
          <button onClick={() => handleDelete(idx)}>Delete</button>
        </div>
      ))}
      <button type="button" onClick={() => window.history.back()}>
        Back
      </button>
    </div>
  );
}

export default CompanyViewPostings;
