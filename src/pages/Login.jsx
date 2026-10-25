
import { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    setMessage(
      "Login form is ready. Authentication will be connected later."
    );
  }

  return (
    <main className="login-page">
      {/* Left branding section */}
      <section className="login-brand">
        <div className="brand-content">
          <p className="login-eyebrow">
            CONNECT. COLLABORATE. CREATE.
          </p>

          <h1>
            Great ideas deserve
            <span> the right team.</span>
          </h1>

          <p className="brand-description">
            Discover opportunities, connect with talented
            students, and bring your ideas to life through
            meaningful collaboration.
          </p>

          <div className="brand-tags">
            <span>Discover</span>
            <span>Connect</span>
            <span>Collaborate</span>
          </div>
        </div>

        <p className="brand-footer">
          Find your people. Build something remarkable.
        </p>
      </section>

      {/* Right login section */}
      <section className="login-form-section">
        <div className="login-card">
          <Link to="/" className="mobile-logo">
            HackMate AI
          </Link>

          <p className="form-eyebrow">WELCOME BACK</p>

          <h2>Sign in to your account</h2>

          <p className="form-description">
            Continue your journey with HackMate AI.
          </p>

          <form onSubmit={handleSubmit}>
            {/* College email */}
            <div className="form-field">
              <label htmlFor="email">
                College email
              </label>

              <input
                id="email"
                type="email"
                placeholder="you@college.edu"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                autoComplete="email"
                required
              />
            </div>

            {/* Password and forgot password */}
            <div className="form-field">
              <div className="password-label-row">
                <label htmlFor="password">
                  Password
                </label>

                <Link
                  to="/forgot-password"
                  className="forgot-password"
                >
                  Forgot password?
                </Link>
              </div>

              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                autoComplete="current-password"
                required
              />
            </div>

            {/* Sign in button */}
            <button
              type="submit"
              className="login-button"
            >
              Sign In
              <span aria-hidden="true">→</span>
            </button>

            {/* Login feedback */}
            {message && (
              <p className="login-message" role="status">
                {message}
              </p>
            )}
          </form>

          {/* Sign up link */}
          <p className="signup-prompt">
            New to HackMate AI?{" "}
            <Link
              to="/register"
              className="signup-link"
            >
              Create an account
            </Link>
          </p>

          {/* Back to home */}
          <Link to="/" className="back-home">
            ← Back to Home
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Login;