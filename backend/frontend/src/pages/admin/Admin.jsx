import React, { useState } from 'react';
import './Admin.css'; // Include your styles or use styled-components

function Admin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [complaints, setComplaints] = useState([]);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Handle Login
  const handleLogin = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (res.ok) {
        setToken(data.token); // Store the token for authenticated requests
        setMessage({ text: '✅ Login successful.', type: 'success' });
        fetchComplaints(data.token);
      } else {
        setMessage({ text: '❌ ' + data.message, type: 'error' });
      }
    } catch (err) {
      setMessage({ text: '❌ Network error.', type: 'error' });
    }
  };

  // Fetch complaints
  const fetchComplaints = async (authToken = token) => {
    try {
      const res = await fetch('http://localhost:4000/api/complaints/all', {
        headers: { Authorization: 'Bearer ' + authToken }
      });

      if (!res.ok) {
        alert('Session expired. Please log in again.');
        setToken('');
        return;
      }

      const data = await res.json();
      setComplaints(data);
    } catch (err) {
      console.error(err);
      alert('❌ Failed to load complaints.');
    }
  };

  // Update complaint status
  const updateStatus = async (ticketId, newStatus) => {
    if (!newStatus) return;
    try {
      const res = await fetch(`http://localhost:4000/api/complaints/status/${ticketId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        alert(`✅ Status updated to "${newStatus}"`);
        fetchComplaints();
      } else {
        const data = await res.json();
        alert(`❌ Failed to update: ${data.message}`);
      }
    } catch (err) {
      alert('❌ Network/server error.');
    }
  };

  // Submit response note
  const submitResponse = async (ticketId, responseNote) => {
    try {
      const res = await fetch(`http://localhost:4000/api/complaints/response/${ticketId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ responseNote })
      });

      const data = await res.json();
      if (res.ok) {
        alert(`✅ Response note submitted.`);
        fetchComplaints();
      } else {
        alert(`❌ Failed to submit: ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      alert('❌ Network/server error.');
    }
  };

  if (!token) {
    // Login section if no token
    return (
      <div style={{ padding: 20 }}>
        <button onClick={() => window.location.href = '/'}>⬅ Home</button>
        <h3>Admin Login</h3>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        /><br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        /><br />
        <button onClick={handleLogin}>Login</button>
        <p className={message.type}>{message.text}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <button onClick={() => window.location.reload()}>🔓 Logout</button>
      <h2>Admin Complaint Dashboard</h2>
      <table>
        <thead>
          <tr>
            <th>Ticket ID</th>
            <th>Title</th>
            <th>Category</th>
            <th>Status</th>
            <th>Submitted</th>
            <th>Update Status</th>
            <th>Response Note</th>
            <th>Submit</th>
          </tr>
        </thead>
        <tbody>
          {complaints.map((c) => (
            <tr key={c.ticketId}>
              <td>{c.ticketId}</td>
              <td>{c.title || 'N/A'}</td>
              <td>{c.category}</td>
              <td>{c.status}</td>
              <td>{new Date(c.submittedAt).toLocaleString()}</td>
              <td>
                <select onChange={(e) => updateStatus(c.ticketId, e.target.value)}>
                  <option value="">-- Change --</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </td>
              <td>
                <textarea
                  id={`note-${c.ticketId}`}
                  rows="2"
                  defaultValue={c.responseNote || ''}
                />
              </td>
              <td>
                <button
                  onClick={() =>
                    submitResponse(c.ticketId, document.querySelector(`#note-${c.ticketId}`).value)
                  }>
                  Submit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Admin;
