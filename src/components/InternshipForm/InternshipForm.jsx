import { useState } from "react";

function InternshipForm({ onSubmit, initialData = {}, onCancel }) {
  const [form, setForm] = useState({
    title: initialData.title || "",
    description: initialData.description || "",
    duration: initialData.duration || "",
    paid: initialData.paid || false,
    salary: initialData.salary || "",
    requirements: initialData.requirements ? initialData.requirements.join(", ") : "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      requirements: form.requirements.split(",").map((s) => s.trim()),
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px', margin: '16px 0' }}>
      <input name="title" value={form.title} onChange={handleChange} placeholder="Title" required />
      <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" required />
      <input name="duration" value={form.duration} onChange={handleChange} placeholder="Duration" required />
      <label>
        Paid:
        <input type="checkbox" name="paid" checked={form.paid} onChange={handleChange} />
      </label>
      {form.paid && (
        <input name="salary" value={form.salary} onChange={handleChange} placeholder="Salary" required={form.paid} />
      )}
      <input name="requirements" value={form.requirements} onChange={handleChange} placeholder="Skills (comma separated)" required />
      <button type="submit">Save</button>
      {onCancel && <button type="button" onClick={onCancel}>Cancel</button>}
    </form>
  );
}

export default InternshipForm; 