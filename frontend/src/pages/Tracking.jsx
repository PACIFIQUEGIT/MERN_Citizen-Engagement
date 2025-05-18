import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Tracking.css';

const Tracking = () => {
  const [ticketId, setTicketId] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setStatus('');

    try {
      const response = await fetch(`http://localhost:4000/api/complaints/status/${ticketId}`);

      if (!response.ok) {
        const message = await response.text();
        throw new Error(`Error ${response.status}: ${message}`);
      }

      const result = await response.json();

      setStatus(`
        <strong>Ticket ID:</strong> ${result.ticketId} <br/>
        <strong>Status:</strong> ${result.status} <br/>
        <strong>Category:</strong> ${result.category} <br/>
        <strong>Submitted On:</strong> ${new Date(result.submittedAt).toLocaleString()}
      `);
    } catch (error) {
      console.error(error);
      setError(`❌ ${error.message}`);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px', background: '#f9f9f9' }}>
      <button
        onClick={() => navigate('/')}
        style={{ padding: '8px 12px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginBottom: '20px' }}
      >
        ⬅ Home
      </button>

      <h2>Track Your Complaint Status</h2>

      <form onSubmit={handleSubmit} style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 0 10px #ccc' }}>
        <label htmlFor="ticketId">Ticket ID</label>
        <input
          type="text"
          id="ticketId"
          value={ticketId}
          onChange={(e) => setTicketId(e.target.value)}
          placeholder="Enter your ticket ID"
          required
          style={inputStyle}
        />
        <button type="submit" style={buttonStyle}>Track Status</button>
      </form>

      {status && <div className="status" style={{ marginTop: '20px' }} dangerouslySetInnerHTML={{ __html: status }} />}
      {error && <div className="error" style={{ marginTop: '20px', color: 'red' }}>{error}</div>}
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

export default Tracking;
