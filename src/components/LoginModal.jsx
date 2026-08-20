import { useEffect, useRef, useState } from "react";
import "../styles/LoginModal.css";
import { useAuth } from "../hooks/useAuth";
import { loginWithFirebaseToken } from "../services/authService";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../firebase/firebase";

export default function LoginModal({ onClose }) {
  const [mobile, setMobile] = useState("");
  const [step, setStep] = useState("MOBILE"); // MOBILE | OTP
  const [otp, setOtp] = useState(["", "", "", "", "", ""]); // 6 digits for Firebase
  const [timeLeft, setTimeLeft] = useState(60);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showQr, setShowQr] = useState(true);
  
  const otpRefs = useRef([]);
  const { loginAuth } = useAuth();

  /* ⏱ OTP Countdown */
  useEffect(() => {
    if (step !== "OTP" || timeLeft === 0) return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [step, timeLeft]);

  useEffect(() => {
    if (!auth) return;
    const container = document.getElementById('login-recaptcha-container');
    if (!container) return;

    // Clear any existing verifier
    if (window.recaptchaVerifier) {
      try { window.recaptchaVerifier.clear(); } catch (_) {}
      window.recaptchaVerifier = null;
    }

    // Create fresh verifier
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'login-recaptcha-container', {
      size: 'invisible',
      callback: () => {},
      'expired-callback': () => {
        // Auto-reset when reCAPTCHA expires
        if (window.recaptchaVerifier) {
          try { window.recaptchaVerifier.clear(); } catch (_) {}
          window.recaptchaVerifier = null;
        }
      }
    });

    // Pre-render to avoid cold-start crash on first click
    window.recaptchaVerifier.render().catch(() => {});

    return () => {
      if (window.recaptchaVerifier) {
        try { window.recaptchaVerifier.clear(); } catch (_) {}
        window.recaptchaVerifier = null;
      }
    };
  }, []);

  const handleMobileChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 10) setMobile(value);
  };

  // Helper to create a fresh reCAPTCHA verifier
  const resetRecaptcha = () => {
    if (window.recaptchaVerifier) {
      try { window.recaptchaVerifier.clear(); } catch (_) {}
      window.recaptchaVerifier = null;
    }
    const container = document.getElementById('login-recaptcha-container');
    if (auth && container) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'login-recaptcha-container', {
        size: 'invisible',
        callback: () => {}
      });
      window.recaptchaVerifier.render().catch(() => {});
    }
  };

  const sendOtp = async () => {
    if (mobile.length !== 10) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const phoneNumber = '+91' + mobile;
      const appVerifier = window.recaptchaVerifier;

      if (!appVerifier) {
        resetRecaptcha();
        throw new Error("reCAPTCHA not ready. Please try again.");
      }

      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      window.confirmationResult = confirmationResult;
      setStep("OTP");
      setTimeLeft(60);
    } catch (err) {
      console.error("sendOtp error:", err);
      // Always reset reCAPTCHA on failure — critical for retry to work
      resetRecaptcha();
      setError(err.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      setError("Enter a 6-digit verification code.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const confirmationResult = window.confirmationResult;
      if (!confirmationResult) {
        throw new Error("Session expired. Please request a new OTP.");
      }

      const result = await confirmationResult.confirm(otpValue);
      const idToken = await result.user.getIdToken();

      const backendResponse = await loginWithFirebaseToken(idToken);
      if (backendResponse && backendResponse.success) {
        const { accessToken, user: backendUser } = backendResponse.data;
        loginAuth(accessToken, backendUser);
        onClose();
      } else {
        throw new Error('Backend authentication failed.');
      }
    } catch (err) {
      console.error(err);
      const code = err?.code || '';
      const msg = err?.message || '';

      if (
        code === 'auth/session-expired' ||
        code === 'auth/code-expired' ||
        msg.includes('SESSION_EXPIRED') ||
        msg.includes('session expired') ||
        msg.includes('expired')
      ) {
        // Firebase session timed out — user must re-request OTP
        setError('OTP expired. Please click "Resend OTP" to get a new code.');
        setTimeLeft(0); // immediately show Resend link
      } else if (code === 'auth/invalid-verification-code' || msg.includes('invalid')) {
        setError('Incorrect OTP. Please check and try again.');
      } else if (!err?.response && msg.includes('Network')) {
        // Backend CORS / cold-start / network error — not an OTP error
        setError('Server is warming up. Please wait a moment and try again.');
      } else {
        setError('Failed to verify OTP. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-overlay" onClick={onClose}>
      <div className="login-container" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        {/* LEFT PANEL */}
        <div className="login-left">
          <div className="login-left-top">
            <h1 className="left-logo">VENNOIRR</h1>
            <div className="left-plus-pass">
              <span className="lightning-bolt">⚡</span>
              <span className="kwik-pass-txt">KwikPass</span>
            </div>
          </div>

          <div className="login-left-center">
            <h3>Welcome!</h3>
            <p>Sign in to access your orders and account details!</p>
          </div>

          <div className="login-left-bottom">
            {showQr && (
              <div className="download-app">
                <div className="qr-container">
                  <svg width="34" height="34" viewBox="0 0 29 29" fill="none">
                    <path d="M1 1h7v7H1V1zm1 1v5h5V2H2zm2 2h1v1H4V4zm8-3h1v1h-1V1zm2 0h2v1h-2V1zm3 0h1v2h-1V1zm4 0h3v1h-3V1zm-7 2h2v1h-2V3zm3 0h1v1h-1V3zm2 0h1v2h-1V3zm2 0h1v1h-1V3zm-9 2h1v1h-1V5zm4 0h1v1h-1V5zm-8 4h1v1H1V9zm2 0h1v1H3V9zm2 0h2v2H5V9zm3 0h2v1H8V9zm4 0h1v3h-1V9zm2 0h1v1h-1V9zm3 0h1v1h-1V9zm2 0h2v2h-2V9zm-13 2h2v1h-2v-1zm4 0h1v1h-1v-1zm6 0h2v1h-2v-1zm3 0h1v1h-1v-1zm-13 2h1v2h-1v-2zm2 0h1v1h-1v-1zm4 0h1v1h-1v-1zm2 0h1v1h-1v-1zm4 0h2v1h-2v-1zm3 0h1v1h-1v-1zm-15 2h2v1H1v-1zm3 0h1v1H4v-1zm4 0h1v1H8v-1zm4 0h1v2h-1v-2zm3 0h2v1h-2v-1zm4 0h1v1h-1v-1zm-16 2h7v7H1v-7zm1 1v5h5V18H2zm2 2h1v1H4v-1zm8-1h1v1h-1v-1zm3 0h1v1h-1v-1zm4 0h2v2h-2v-2zm-5 2h1v2h-1v-2zm3 0h2v1h-2v-1zm3 0h1v1h-1v-1zm-7 2h1v1h-1v-1zm5 0h2v1h-2v-1zm3 0h1v1h-1v-1z" fill="black"/>
                  </svg>
                </div>
                <div className="download-info">
                  <span>Download our<br />app</span>
                </div>
                <button className="qr-close" onClick={() => setShowQr(false)}>✕</button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="login-right">
          
          {/* MOBILE NUMBER INPUT */}
          {step === "MOBILE" && (
            <>
              <h2>Login/Sign In</h2>
              <p className="subtitle">Enter Mobile Number</p>

              <div className="mobile-input">
                <div className="country-code-wrap">
                  <span>🇮🇳</span>
                  <span>+91</span>
                </div>
                <input
                  type="tel"
                  placeholder="Enter Mobile Number"
                  value={mobile}
                  onChange={handleMobileChange}
                  onKeyDown={(e) => e.key === 'Enter' && sendOtp()}
                />
              </div>

              {error && <p className="error-text" style={{color: '#ff3b30', fontSize: '12px', textAlign: 'center', margin: '-10px 0 15px'}}>{error}</p>}

              <button className="otp-btn" onClick={sendOtp} disabled={loading || mobile.length !== 10}>
                {loading ? "Please wait..." : "Submit"}
              </button>

              <div className="terms">
                By logging in, you're agreeing to our <br />
                <a href="#">Privacy Policy</a> <a href="#">Terms of Service</a>
                <br />
                <a href="#" className="trouble">Trouble logging in?</a>
              </div>
            </>
          )}

          {/* OTP INPUT */}
          {step === "OTP" && (
            <>
              <h2>OTP Verification</h2>
              <p className="subtitle">
                We have sent a verification code to <br />
                <strong>+91 {mobile}</strong>
              </p>

              <div className="otp-inputs">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (otpRefs.current[index] = el)}
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(e.target.value, index)}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace" && !digit && index > 0) {
                        otpRefs.current[index - 1]?.focus();
                      }
                      if (e.key === "Enter") {
                        handleVerify();
                      }
                    }}
                  />
                ))}
              </div>

              {error && <p className="error-text" style={{color: '#ff3b30', fontSize: '12px', textAlign: 'center', margin: '-5px 0 15px'}}>{error}</p>}

              <p className="resend">
                {timeLeft > 0 ? (
                  <span>Resend OTP in {timeLeft}s</span>
                ) : (
                  <span onClick={sendOtp} style={{textDecoration: 'underline'}}>Resend OTP</span>
                )}
              </p>

              <button className="otp-btn" onClick={handleVerify} disabled={loading || otp.join("").length < 6}>
                {loading ? "Verifying..." : "Verify"}
              </button>
            </>
          )}

          {/* CRITICAL: Keep reCAPTCHA container outside conditional step render to avoid 'removed 0' error */}
          <div id="login-recaptcha-container"></div>
        </div>
      </div>
    </div>
  );
}
