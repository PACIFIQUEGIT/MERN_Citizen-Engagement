import React, { useEffect } from 'react';
import styles from './Home.module.css';

function App() {
  useEffect(() => {
    const form = document.getElementById('complaintForm');

    if (form) {
      const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(form);

        try {
          const response = await fetch('http://localhost:4000/api/complaints', {
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
      {/* Top Buttons */}
      <div className={styles.topButtons}>
        <button onClick={() => window.location.href = '/admin'}>Admin</button>
        <button onClick={() => window.location.href = '/admin-signup'}>Create New Admin</button>
      </div>

      <h2>Submit a Complaint or Feedback</h2>

      <form className={styles.home} id="complaintForm" encType="multipart/form-data" method="POST">
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
        <button
          onClick={() => window.location.href = '/tracking'}
          style={{ backgroundColor: '#17a2b8' }}
        >
          Track Your Complaint
        </button>
      </div>
    </div>
  );
}

export default App;
