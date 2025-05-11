function MyInterns({ companyUsers, currUser }) {
  const currCompany = companyUsers.find(
    (company) => company.companyId === currUser.companyId
  );

  if (!currCompany || !currCompany.internships) {
    return <p>No company or internships found.</p>;
  }

  return (
    <div>
      <h1>My Interns</h1>
      {currCompany.internships.flatMap((internship) => {
        console.log(internship.applications);
        const currentInterns = internship.applications?.filter(
          (applicant) => applicant.internshipStatus === "currentIntern"
        );

        return currentInterns && currentInterns.length > 0 ? (
          currentInterns.map((applicant) => (
            <div key={applicant.username}>
              <h2>{applicant.firstName + " " + applicant.lastName}</h2>
              <p>Internship Status: {applicant.internshipStatus}</p>
              <p>Internship Title: {internship.title}</p>
            </div>
          ))
        ) : (
          <h2 key={internship.title}>
            No interns available for this internship.
          </h2>
        );
      })}
    </div>
  );
}

export default MyInterns;
