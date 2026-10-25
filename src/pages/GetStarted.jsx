
import { Link } from "react-router-dom";

function GetStarted() {
  return (
    <main className="page-content">
      <p className="eyebrow">GET STARTED</p>

      <h1>Stop Searching Alone. Start Building Together.</h1>

      <p>
        Your next hackathon, project partner, or big idea could be
        closer than you think.
      </p>

      <Link to="/login" className="primary-button">
        Get Started with HackMate AI
      </Link>

      <section className="feature-grid">
        <article className="feature-card">
          <h2>Real-time Matchmaking</h2>
          <p>Find students whose skills complement yours.</p>
        </article>

        <article className="feature-card">
          <h2>Cross-discipline Teams</h2>
          <p>Collaborate with talented students across departments.</p>
        </article>

        <article className="feature-card">
          <h2>Direct Collaboration</h2>
          <p>Bring your ideas and teammates together.</p>
        </article>
      </section>
    </main>
  );
}

export default GetStarted;
