import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Tracking.module.css';

const baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000/api';

const Tracking = () => {
  const [ticketId, setTicketId] = useState('');
  const [statusData, setStatusData] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setStatusData(null);

    try {
      const response = await fetch(`${baseUrl}/complaints/status/${ticketId}`);

      if (!response.ok) {
        const message = await response.text();
        throw new Error(`Error ${response.status}: ${message}`);
      }

      const result = await response.json();
      setStatusData(result);
    } catch (error) {
      console.error(error);
      setError(`❌ ${error.message}`);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px', background: '#f9f9f9' }}>
      <button
        onClick={() => navigate('/')}
        style={{
          padding: '8px 12px',
          background: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '20px',
        }}
      >
        ⬅ Home
      </button>

      <h2>Track Your Complaint Status</h2>

      <form
        onSubmit={handleSubmit}
        style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 0 10px #ccc' }}
      >
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
        <button type="submit" style={buttonStyle}>
          Track Status
        </button>
      </form>

      {statusData && (
        <div className={styles.status} style={{ marginTop: '20px' }}>
          <p><strong>Ticket ID:</strong> {statusData.ticketId}</p>
          <p><strong>Status:</strong> {statusData.status}</p>
          <p><strong>Category:</strong> {statusData.category}</p>
          <p><strong>Submitted On:</strong> {new Date(statusData.submittedAt).toLocaleString()}</p>
        </div>
      )}
      {error && (
        <div className={styles.error} style={{ marginTop: '20px', color: 'red' }}>
          {error}
        </div>
      )}
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
