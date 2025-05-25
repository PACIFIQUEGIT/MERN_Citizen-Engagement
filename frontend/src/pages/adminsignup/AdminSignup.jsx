import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './AdminSignup.module.css';

const baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000/api';

const AdminSignup = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const form = e.target;
    const formData = new FormData(form);

    const data = {
      name: formData.get('name')?.trim(),
      email: formData.get('email')?.trim(),
      password: formData.get('password'),
      institution: formData.get('institution'),
    };

    try {
      const response = await fetch(`${baseUrl}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        alert('✅ Admin signed up successfully! Please login.');
        navigate('/admin');
      } else {
        setError(`❌ ${result.message}`);
      }
    } catch (err) {
      console.error(err);
      setError('❌ Network error, please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Link to="/" className={styles.homeButton}>
        ⬅ Home
      </Link>

      <h2>Admin Sign-Up</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          name="name"
          type="text"
          placeholder="Full Name"
          required
          className={styles.input}
        />
        <input
          name="email"
          type="email"
          placeholder="Email Address"
          required
          className={styles.input}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          className={styles.input}
        />

        <label htmlFor="institution" className={styles.label}>
          Select Institution:
        </label>
        <select
          id="institution"
          name="institution"
          required
          className={styles.input}
        >
          <option value="">--Select--</option>
          <option value="Health">Health</option>
          <option value="Education">Education</option>
          <option value="Sport">Sport</option>
        </select>

        <button
          type="submit"
          className={styles.submitButton}
          disabled={loading}
          aria-busy={loading}
        >
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>

        {error && (
          <p className={styles.error} aria-live="polite">
            {error}
          </p>
        )}
      </form>
    </div>
  );
};

export default AdminSignup;
