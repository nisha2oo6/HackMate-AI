import { useState } from "react";
import { Link } from "react-router-dom";
import "./ForgotPassword.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!email.trim()) {
      setError("Please enter your college email.");
      return;
    }

    setMessage(
      "Your form is ready. Password reset emails will be enabled when the backend is connected."
    );
  }

  return (
    <main className="forgot-page">
      {/* Left branding section */}
      <section className="forgot-brand">
        <div className="forgot-brand-content">
          <p className="forgot-eyebrow">
            YOUR JOURNEY CONTINUES
          </p>

          <h1>
            A fresh start
            <span> is just ahead.</span>
          </h1>

          <p className="forgot-brand-description">
            Getting back into your account should be simple.
            Take the next step and continue connecting,
            collaborating, and creating with HackMate AI.
          </p>

          <div className="forgot-tags">
            <span>Secure access</span>
            <span>Student community</span>
          </div>
        </div>

        <p className="forgot-brand-footer">
          Find your people. Build something remarkable.
        </p>
      </section>

      {/* Right password recovery section */}
      <section className="forgot-form-section">
        <div className="forgot-form-content">
          <Link to="/" className="forgot-mobile-logo">
            HackMate AI
          </Link>

          <p className="forgot-form-eyebrow">
            ACCOUNT RECOVERY
          </p>

          <h2>Forgot your password?</h2>

          <p className="forgot-description">
            Enter the college email associated with your
            account. Instructions to reset your password
            will be sent to that address once recovery is enabled.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="forgot-field">
              <label htmlFor="forgot-email">
                College email
              </label>

              <input
                id="forgot-email"
                type="email"
                placeholder="you@college.edu"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setMessage("");
                  setError("");
                }}
                autoComplete="email"
                required
              />
            </div>

            {error && (
              <p className="forgot-error" role="alert">
                {error}
              </p>
            )}

            {message && (
              <p className="forgot-success" role="status">
                {message}
              </p>
            )}

            <button
              type="submit"
              className="forgot-button"
            >
              Send Reset Link
              <span aria-hidden="true">→</span>
            </button>
          </form>

          <Link to="/login" className="forgot-back-login">
            <span aria-hidden="true">←</span> Back to Sign In
          </Link>

          <Link to="/" className="forgot-back-home">
            Back to Home
          </Link>
        </div>
      </section>
    </main>
  );
}

export default ForgotPassword;