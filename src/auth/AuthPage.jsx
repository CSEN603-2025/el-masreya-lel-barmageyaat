import React, { useState } from 'react';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('');
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (isLogin) {
      console.log('Logging in:', formData);
    } else {
      console.log('Registering:', { role, ...formData });
    }
  };

  const renderRoleFields = () => {
    switch (role) {
      case 'student':
        return (
          <>
            <input name="university" placeholder="University" onChange={handleChange} />
            <input name="major" placeholder="Major" onChange={handleChange} />
          </>
        );
      case 'company':
        return (
          <>
            <input name="companyName" placeholder="Company Name" onChange={handleChange} />
            <input name="industry" placeholder="Industry" onChange={handleChange} />
          </>
        );
      case 'faculty':
        return (
          <>
            <input name="facultyName" placeholder="Faculty Name" onChange={handleChange} />
            <input name="department" placeholder="Department" onChange={handleChange} />
          </>
        );
      case 'scad':
        return (
          <>
            <input name="scadID" placeholder="SCAD ID" onChange={handleChange} />
            <input name="position" placeholder="Position" onChange={handleChange} />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ backgroundColor: "#f0f8f5", padding: "2rem", maxWidth: "500px", margin: "auto", borderRadius: "12px" }}>
      <h2 style={{ color: "#1b5e20" }}>{isLogin ? 'Login' : 'Register'}</h2>

      {!isLogin && (
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", flexWrap: "wrap" }}>
          <button type="button" onClick={() => setRole('student')}>Student</button>
          <button type="button" onClick={() => setRole('company')}>Company</button>
          <button type="button" onClick={() => setRole('faculty')}>Faculty</button>
          <button type="button" onClick={() => setRole('scad')}>SCAD Officer</button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          value={formData.email}
          onChange={handleChange}
          style={{ marginBottom: '0.5rem', width: '100%', padding: '0.5rem' }}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          value={formData.password}
          onChange={handleChange}
          style={{ marginBottom: '0.5rem', width: '100%', padding: '0.5rem' }}
        />

        {!isLogin && renderRoleFields()}

        <button type="submit" style={{ backgroundColor: "#1b5e20", color: "white", padding: "0.5rem 1rem", width: "100%", marginTop: "1rem" }}>
          {isLogin ? 'Login' : 'Register'}
        </button>
      </form>

      <p style={{ marginTop: '1rem', textAlign: 'center' }}>
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <button onClick={() => setIsLogin(!isLogin)} style={{ color: "#01579b", background: "none", border: "none", cursor: "pointer" }}>
          {isLogin ? "Register" : "Login"} here
        </button>
      </p>
    </div>
  );
};

export default AuthPage;
