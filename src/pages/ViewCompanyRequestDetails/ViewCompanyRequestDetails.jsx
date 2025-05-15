import { useParams, useNavigate } from "react-router-dom";

function ViewCompanyRequestDetails({ companyRequests, setCompanyRequests, addNotification }) {
  const { companyName } = useParams();
  const navigate = useNavigate(); // Hook to navigate to previous page

  // Find the current company request based on the company name
  const currRequest = companyRequests.find(
    (request) => request.companyName === companyName
  );

  // Function to handle accepting the request
  const handleAccept = () => {
    setCompanyRequests((prevRequests) =>
      prevRequests.map((request) =>
        request.companyName === companyName
          ? { ...request, status: "accepted" } // Update the status to "accepted"
          : request
      )
    );
    
    // Add notification in the background
    if (addNotification) {
      addNotification(`Company request from ${companyName} has been accepted.`, "success");
    }
    
    navigate(-1); // Navigate back to the previous page after accepting
  };

  // Function to handle rejecting the request
  const handleReject = () => {
    setCompanyRequests((prevRequests) =>
      prevRequests.map((request) =>
        request.companyName === companyName
          ? { ...request, status: "rejected" } // Update the status to "rejected"
          : request
      )
    );
    
    // Add notification in the background
    if (addNotification) {
      addNotification(`Company request from ${companyName} has been rejected.`, "error");
    }
    
    navigate(-1); // Navigate back to the previous page after rejecting
  };

  return (
    <div>
      {currRequest.logo ? (
        <>
          <b>Company logo: </b>
          <b>{currRequest.logo}</b>
          <br />
        </>
      ) : null}
      <h2>{currRequest.companyName}</h2>
      <b>Industry: </b>
      {currRequest.industry}
      <br />
      <b>Company size: </b>
      {currRequest.companySize}
      <br />
      <b>Company E-mail: </b>
      {currRequest.email}
      <br />
      <b>Request status: </b>
      {currRequest.status}
      <br />

      {/* Buttons for accepting or rejecting the request */}
      <button onClick={handleAccept}>Accept</button>
      <button onClick={handleReject}>Reject</button>
    </div>
  );
}

export default ViewCompanyRequestDetails;
