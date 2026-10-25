import { useState } from "react";
import { Link } from "react-router-dom";
import "./Register.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    setMessage("");
    setError("");

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please try again.");
      return;
    }

    setMessage(
      "Form validated successfully! Account creation will be connected later."
    );
  }

  return (
    <main className="register-page">
      {/* Left branding section */}
      <section className="register-brand">
        <div className="register-brand-content">
          <p className="register-eyebrow">
            CONNECT. COLLABORATE. CREATE.
          </p>

          <h1>
            Your next big idea
            <span> starts here.</span>
          </h1>

          <p className="register-brand-description">
            Create your student profile, showcase your skills,
            and connect with people who share your ambition.
          </p>

          <div className="register-tags">
            <span>Showcase your skills</span>
            <span>Meet collaborators</span>
            <span>Explore opportunities</span>
          </div>
        </div>

        <p className="register-brand-footer">
          Find your people. Build something remarkable.
        </p>
      </section>

      {/* Right registration section */}
      <section className="register-form-section">
        <div className="register-form-content">
          <Link to="/" className="register-mobile-logo">
            HackMate AI
          </Link>

          <p className="register-form-eyebrow">
            GET STARTED
          </p>

          <h2>Create your account</h2>

          <p className="register-description">
            Join the student collaboration community.
          </p>

          <form onSubmit={handleSubmit}>
            {/* Full name */}
            <div className="register-field">
              <label htmlFor="register-name">
                Full name
              </label>

              <input
                id="register-name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
                required
              />
            </div>

            {/* College email */}
            <div className="register-field">
              <label htmlFor="register-email">
                College email
              </label>

              <input
                id="register-email"
                type="email"
                placeholder="you@college.edu"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
              />
            </div>

            {/* Department */}
            <div className="register-field">
              <label htmlFor="register-department">
                Department
              </label>

              <select
                id="register-department"
                value={department}
                onChange={(event) =>
                  setDepartment(event.target.value)
                }
                required
              >
                <option value="" disabled>
                  Select your department
                </option>
                <option value="CSE">
                  Computer Science and Engineering
                </option>
                <option value="IT">
                  Information Technology
                </option>
                <option value="AIML">
                  Artificial Intelligence and Machine Learning
                </option>
                <option value="AIDS">
                  Artificial Intelligence and Data Science
                </option>
                <option value="ECE">
                  Electronics and Communication Engineering
                </option>
                <option value="EEE">
                  Electrical and Electronics Engineering
                </option>
                <option value="MECH">
                  Mechanical Engineering
                </option>
                <option value="CIVIL">
                  Civil Engineering
                </option>
                <option value="OTHER">
                  Other
                </option>
              </select>
            </div>

            {/* Password */}
            <div className="register-field">
              <label htmlFor="register-password">
                Password
              </label>

              <input
                id="register-password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                autoComplete="new-password"
                minLength={8}
                required
              />

              <span className="register-field-hint">
                Use at least 8 characters.
              </span>
            </div>

            {/* Confirm password */}
            <div className="register-field">
              <label htmlFor="confirm-password">
                Confirm password
              </label>

              <input
                id="confirm-password"
                type="password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                autoComplete="new-password"
                minLength={8}
                required
              />
            </div>

            {/* Validation feedback */}
            {error && (
              <p className="register-error" role="alert">
                {error}
              </p>
            )}

            {message && (
              <p className="register-success" role="status">
                {message}
              </p>
            )}

            {/* Create account */}
            <button
              type="submit"
              className="register-button"
            >
              Create Account
              <span aria-hidden="true">→</span>
            </button>
          </form>

          <p className="register-signin-prompt">
            Already have an account?{" "}
            <Link to="/login" className="register-signin-link">
              Sign In
            </Link>
          </p>

          <Link to="/" className="register-back-home">
            ← Back to Home
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Register;