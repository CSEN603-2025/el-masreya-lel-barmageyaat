function InternshipList({ internship }) {
  return (
    <div>
      <h2>{internship.title}</h2>
      <p>Company: {internship.companyName}</p>
      <p>Location: {internship.location}</p>
      <p>Description: {internship.description}</p>
      <p>Requirements:</p>
      <ul>
        {internship.requirements.map((req, index) => (
          <li key={index}>{req}</li>
        ))}
      </ul>
      <p>Duration: {internship.duration}</p>
      <p>Status: {internship.status}</p>
    </div>
  );
}

export default InternshipList;
