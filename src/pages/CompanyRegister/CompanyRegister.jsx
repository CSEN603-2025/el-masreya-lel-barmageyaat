import { Link, useNavigate } from "react-router-dom";
import StudentsNavBar from "../../components/studentsNavBar/StudentsNavBar";
import { useState } from "react";

function CompanyRegister({ setCompanyUsers }) {
  const navigate = useNavigate();
  const [logo, setLogo] = useState(null);

  function handleRegister(e) {
    e.preventDefault();
    setCompanyUsers((prevUsers) => [
      ...prevUsers,
      {
        companyName: e.target.companyName.value,
        industry: e.target.industry.value,
        companySize: e.target.companySize.value,
        logo: logo,
        email: e.target.Email.value,
      },
    ]);
    navigate("/login");
    alert("Company registered!");
  }

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    setLogo(file);
  };

  return (
    <div>
      <StudentsNavBar />
      <h1>Company Register</h1>
      <form onSubmit={handleRegister}>
        <div>
          <label>Company Name</label>
          <input type="text" name="companyName" required />
        </div>
        <div>
          <label>Industry</label>
          <input type="industry" name="industry" required />
        </div>

        <div>
          <label>CompanySize</label>
          <select id="companySize" name="companySize">
            ss
            <option value="small">Small (&le; 50 employees)"</option>
            <option value="medium">Medium(&le; 100 employees)</option>
            <option value="large">Large(&le; 500 employees)</option>
            <option value="corporate">Corporate(&gt; 500 employees)</option>
          </select>
        </div>

        <div>
          <label htmlFor="companyLogo">Company Logo</label>
          <input
            type="file"
            id="companyLogo"
            accept="image/*"
            onChange={handleLogoChange}
          />
        </div>

        <div>
          <label>Email</label>
          <input type="Email" name="Email" required />
        </div>
        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
}

export default CompanyRegister;
