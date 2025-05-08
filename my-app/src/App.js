import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import loginpic from './Assets/loginpic.png';
import StudentDashboard from './pages/studentDashboard';
import AdminDashboard from './pages/adminDashboard';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    // Simulated login logic
    if (username === 'student' && password === '1234') {
      navigate('/student-dashboard');
    } else if (username === 'admin' && password === 'admin123') {
      navigate('/admin-dashboard');
    } else {
      alert('Invalid username or password');
    }
  };

  return (
    <div>
      <nav className="navbar">
        <h1>Internship Management System</h1>
        <ul className="nav-links">
          <li><a href="/">Home</a></li>
          <li><a href="/">Register</a></li>
          <li><a href="/">Contact</a></li>
          <li><a href="/">About</a></li>


        </ul>
      </nav>
      <div className="main-section">
        <div className="login-box">
          <h2>Welcome</h2>
          <p>Simplify your workflow and boost productivity.</p>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleLogin}>Login</button>
          <p className="register">Not a member? <a href="/">Register now</a></p>
        </div>
        <div className="image-box" style={{ backgroundImage: `url(${loginpic})` }}></div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
