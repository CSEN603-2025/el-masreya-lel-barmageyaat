import InternshipList from "../../components/InternshipList/InternshipList";

function CompanyViewPostings({ currUser }) {
  return (
    <div>
      <h1>Company View Postings</h1>
      {currUser ? (
        currUser.internships.map((internship) => (
          <InternshipList internship={internship} />
        ))
      ) : (
        <p>No internships available.</p>
      )}
      <button type="button" onClick={() => window.history.back()}>
        Back
      </button>
    </div>
  );
}

export default CompanyViewPostings;
