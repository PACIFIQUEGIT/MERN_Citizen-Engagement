import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminSignup.css';

const AdminSignup = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      institution: formData.get('institution'),
    };

    try {
      const response = await fetch('http://localhost:4000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        alert('✅ Admin signed up successfully! Please login.');
        navigate('/admin'); // React Router navigation
      } else {
        setError(`❌ ${result.message}`);
      }
    } catch (err) {
      console.error(err);
      setError('❌ Network error, please try again later.');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px', background: '#f9f9f9' }}>
      <button onClick={() => navigate('/')} style={{ marginBottom: '10px', background: '#007bff', color: 'white', padding: '8px', borderRadius: '4px', border: 'none' }}>
        ⬅ Home
      </button>
      <h2>Admin Sign-Up</h2>

      <form onSubmit={handleSubmit} style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 0 10px #ccc' }}>
        <input name="name" type="text" placeholder="Full Name" required style={inputStyle} />
        <input name="email" type="email" placeholder="Email Address" required style={inputStyle} />
        <input name="password" type="password" placeholder="Password" required style={inputStyle} />

        <label htmlFor="institution">Select Institution:</label>
        <select name="institution" required style={inputStyle}>
          <option value="Health">Health</option>
          <option value="Education">Education</option>
          <option value="Sport">Sport</option>
        </select>

        <button type="submit" style={buttonStyle}>Sign Up</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
};

const inputStyle = {
  width: '100%',
  padding: '8px',
  marginTop: '5px',
  marginBottom: '10px',
  border: '1px solid #ccc',
  borderRadius: '4px',
};

const buttonStyle = {
  marginTop: '15px',
  padding: '10px 20px',
  background: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

export default AdminSignup;
