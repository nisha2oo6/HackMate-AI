
import { Link } from "react-router-dom";

function Mission() {
  return (
    <main className="page-content about-subpage">
      <section className="subpage-hero">
        <p className="eyebrow">OUR MISSION & VISION</p>

        <h1>
          Connecting potential.
          <span> Inspiring possibilities.</span>
        </h1>

        <p className="about-intro">
          We believe students can achieve more when they have
          the opportunity to connect with people who bring
          different strengths, perspectives, and ambitions.
        </p>
      </section>

      <section className="mission-grid">
        <article className="mission-card">
          <span className="mission-number">01 / MISSION</span>
          <h2>Make collaboration more accessible.</h2>
          <p>
            Our mission is to help students discover meaningful
            opportunities, connect with compatible collaborators,
            and bring their ideas to life through teamwork.
          </p>
        </article>

        <article className="mission-card">
          <span className="mission-number">02 / VISION</span>
          <h2>A connected community of innovators.</h2>
          <p>
            Our vision is a student community where talent is
            recognised beyond departmental boundaries and every
            student has more ways to participate, contribute,
            learn, and innovate.
          </p>
        </article>
      </section>

      <section className="mission-principles">
        <p className="eyebrow">THE PRINCIPLES THAT GUIDE US</p>
        <h2>Collaboration with purpose.</h2>

        <ul>
          <li>
            <strong>Inclusivity</strong>
            <span>Every student should have opportunities to contribute.</span>
          </li>
          <li>
            <strong>Complementary strengths</strong>
            <span>Different abilities can make a team more effective.</span>
          </li>
          <li>
            <strong>Shared growth</strong>
            <span>Working together creates space to learn from one another.</span>
          </li>
          <li>
            <strong>Innovation</strong>
            <span>Fresh perspectives can lead to better ideas and solutions.</span>
          </li>
        </ul>
      </section>

      
        <div className="subpage-navigation">
        <Link to="/about" className="back-about-button">
            <span aria-hidden="true">←</span> Back to About
        </Link>

        </div>

    </main>
  );
}

export default Mission;
