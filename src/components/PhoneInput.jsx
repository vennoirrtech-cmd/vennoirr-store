import React, { useState, useEffect } from 'react';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import './AuthPhone.css';

const PhoneInput = ({ onOtpSent }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Initialize invisible reCAPTCHA when component mounts
  useEffect(() => {
    if (!auth) return;

    const timer = setTimeout(() => {
      const container = document.getElementById('recaptcha-container');
      if (!container) return;

      if (window.recaptchaVerifier) {
        try { window.recaptchaVerifier.clear(); } catch (_) {}
        window.recaptchaVerifier = null;
      }

      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        'recaptcha-container',
        { size: 'invisible', callback: () => {} }
      );
    }, 300);

    return () => {
      clearTimeout(timer);
      if (window.recaptchaVerifier) {
        try { window.recaptchaVerifier.clear(); } catch (_) {}
        window.recaptchaVerifier = null;
      }
    };
  }, []);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');

    if (!phoneNumber.trim()) {
      setError('Please enter a phone number.');
      return;
    }

    // Format to E.164: if user typed 10 digits, prepend +91
    let formatted = phoneNumber.trim();
    if (!formatted.startsWith('+')) {
      formatted = '+91' + formatted.replace(/\D/g, '');
    }

    if (!/^\+[1-9]\d{9,14}$/.test(formatted)) {
      setError('Invalid phone number. Use format: +919876543210');
      return;
    }

    setLoading(true);
    try {
      const appVerifier = window.recaptchaVerifier;
      if (!appVerifier) throw new Error('reCAPTCHA not ready. Please refresh.');

      const confirmationResult = await signInWithPhoneNumber(auth, formatted, appVerifier);
      onOtpSent(confirmationResult);
    } catch (err) {
      console.error('Send OTP error:', err);
      setError(err.message || 'Failed to send OTP. Please try again.');
      // Reset reCAPTCHA on failure so user can retry
      if (window.recaptchaVerifier) {
        try { window.recaptchaVerifier.clear(); } catch (_) {}
        window.recaptchaVerifier = null;
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="phone-input-container">
      <h2>Provide Phone Number</h2>
      <form onSubmit={handleSendOtp}>
        <div className="input-group">
          <input
            type="tel"
            placeholder="+919876543210"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
            title="E.164 format required, e.g. +919876543210"
          />
        </div>
        {error && <p className="error-text" style={{ color: '#ff3b30', fontSize: '12px' }}>{error}</p>}
        <div id="recaptcha-container"></div>
        <button type="submit" disabled={loading || !phoneNumber}>
          {loading ? 'Sending...' : 'Send OTP'}
        </button>
      </form>
    </div>
  );
};

export default PhoneInput;
