import React, { useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import styles from './Home.module.css';

const baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000/api';

function App() {
  useEffect(() => {
    const form = document.getElementById('complaintForm');

    if (form) {
      const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(form);

        try {
          const response = await fetch(`${baseUrl}/complaints`, {
            method: 'POST',
            body: formData,
          });

          const result = await response.json();

          if (response.ok) {
            alert(`Complaint submitted! Ticket ID: ${result.ticketId}`);
          } else {
            alert(`Error: ${result.message}`);
          }
        } catch (err) {
          console.error('Error submitting form:', err);
          alert('Submission failed: Network or server error');
        }
      };

      form.addEventListener('submit', handleSubmit);

      return () => {
        form.removeEventListener('submit', handleSubmit);
      };
    }
  }, []);

  return (
    <div className={styles.App}>
      {/* Top Buttons using React Router Links */}
      <div className={styles.topButtons}>
        <Link to="/admin">
          <button>Admin</button>
        </Link>
        <Link to="/admin-signup">
          <button>Create New Admin</button>
        </Link>
      </div>

      <h2>Submit a Complaint or Feedback</h2>

      <form className={styles.home} id="complaintForm" encType="multipart/form-data" method="POST">
        {/* form fields here */}
        <input type="text" name="fullName" placeholder="Full Name" required />
        <input type="email" name="email" placeholder="Email Address" required />
        <input type="text" name="phone" placeholder="Phone Number" />
        <input type="text" name="location" placeholder="Location" />

        <select name="category">
          <option value="Health">Health</option>
          <option value="Education">Education</option>
          <option value="Sport">Sport</option>
        </select>

        <input type="text" name="title" placeholder="Complaint Title" />
        <textarea name="description" placeholder="Detailed Description"></textarea>

        <input type="file" name="attachment" />
        <button type="submit">Submit Complaint</button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '5px !important' }}>
        <Link to="/tracking">
          <button style={{ backgroundColor: '#17a2b8' }}>
            Track Your Complaint
          </button>
        </Link>
      </div>
    </div>
  );
}

export default App;
