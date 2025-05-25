import React, { useState, useEffect, useCallback } from 'react';
import styles from './Admin.module.css';

function Admin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [complaints, setComplaints] = useState([]);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);
  const [responseNotes, setResponseNotes] = useState({});
  const [statusUpdates, setStatusUpdates] = useState({});
  const baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000/api';

  const fetchComplaints = useCallback(async () => {
    try {
      const res = await fetch(`${baseUrl}/complaints/all`, {
        headers: { Authorization: 'Bearer ' + token },
      });

      if (!res.ok) {
        alert('Session expired. Please log in again.');
        setToken('');
        setComplaints([]);
        return;
      }

      const data = await res.json();
      setComplaints(data);

      const notes = {};
      const statuses = {};
      data.forEach(c => {
        notes[c.ticketId] = c.responseNote || '';
        statuses[c.ticketId] = '';
      });
      setResponseNotes(notes);
      setStatusUpdates(statuses);
    } catch (err) {
      console.error(err);
      alert('❌ Failed to load complaints.');
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchComplaints();
    }
  }, [token, fetchComplaints]);

  const handleLogin = async () => {
    setLoading(true);
    setMessage({ text: '', type: '' });
    try {
      const res = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.ok) {
        setToken(data.token);
        setMessage({ text: '✅ Login successful.', type: 'success' });
      } else {
        setMessage({ text: '❌ ' + data.message, type: 'error' });
      }
    } catch {
      setMessage({ text: '❌ Network error.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = (ticketId, newStatus) => {
    setStatusUpdates(prev => ({ ...prev, [ticketId]: newStatus }));
  };

  const submitStatusUpdate = async (ticketId) => {
    const newStatus = statusUpdates[ticketId];
    if (!newStatus) {
      alert('Please select a status before submitting.');
      return;
    }
    try {
      const res = await fetch(`${baseUrl}/complaints/status/${ticketId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        alert(`✅ Status updated to "${newStatus}"`);
        fetchComplaints();
      } else {
        const data = await res.json();
        alert(`❌ Failed to update: ${data.message}`);
      }
    } catch {
      alert('❌ Network/server error.');
    }
  };

  const handleNoteChange = (ticketId, value) => {
    setResponseNotes(prev => ({ ...prev, [ticketId]: value }));
  };

  const submitResponse = async (ticketId) => {
    const responseNote = responseNotes[ticketId] || '';
    try {
      const res = await fetch(`${baseUrl}/complaints/response/${ticketId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ responseNote }),
      });
      const data = await res.json();
      if (res.ok) {
        alert('✅ Response note submitted.');
        fetchComplaints();
      } else {
        alert(`❌ Failed to submit: ${data.message}`);
      }
    } catch {
      alert('❌ Network/server error.');
    }
  };

  const handleLogout = () => {
    setToken('');
    setComplaints([]);
    setResponseNotes({});
    setStatusUpdates({});
    setMessage({ text: '', type: '' });
  };

  if (!token) {
    return (
      <div className={styles.container}>
        <button onClick={() => window.location.href = '/'}>⬅ Home</button>
        <h3>Admin Login</h3>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className={styles.input}
        />
        <button onClick={handleLogin} disabled={loading} className={styles.button}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        {message.text && (
          <p className={message.type === 'error' ? styles.error : styles.success}>
            {message.text}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <button onClick={handleLogout} className={styles.button}>🔓 Logout</button>
      <h2>Admin Complaint Dashboard</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Ticket ID</th>
            <th>Title</th>
            <th>Category</th>
            <th>Status</th>
            <th>Submitted</th>
            <th>Update Status</th>
            <th>Submit Status</th>
            <th>Response Note</th>
            <th>Submit Note</th>
          </tr>
        </thead>
        <tbody>
          {complaints.map(c => (
            <tr key={c.ticketId}>
              <td>{c.ticketId}</td>
              <td>{c.title || 'N/A'}</td>
              <td>{c.category}</td>
              <td>{c.status}</td>
              <td>{new Date(c.submittedAt).toLocaleString()}</td>
              <td>
                <select
                  value={statusUpdates[c.ticketId] || ''}
                  onChange={(e) => updateStatus(c.ticketId, e.target.value)}
                >
                  <option value="">-- Change --</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </td>
              <td>
                <button
                  onClick={() => submitStatusUpdate(c.ticketId)}
                  disabled={!statusUpdates[c.ticketId]}
                  className={styles.smallButton}
                >
                  Update
                </button>
              </td>
              <td>
                <textarea
                  rows="2"
                  value={responseNotes[c.ticketId] || ''}
                  onChange={e => handleNoteChange(c.ticketId, e.target.value)}
                />
              </td>
              <td>
                <button
                  onClick={() => submitResponse(c.ticketId)}
                  className={styles.smallButton}
                >
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
