
import { Link } from "react-router-dom";

function HowItWorks() {
  return (
    <main className="page-content about-subpage">
      <section className="subpage-hero">
        <p className="eyebrow">THE HACKMATE AI EXPERIENCE</p>

        <h1>
          From individual ideas
          <span> to shared achievements.</span>
        </h1>

        <p className="about-intro">
          Every collaboration begins with a simple connection.
          Explore the journey from expressing your interests
          to finding people who can help turn an idea into action.
        </p>
      </section>

      <section className="journey-list">
        <article className="journey-step">
          <span className="journey-number">01</span>
          <div>
            <p className="eyebrow">START WITH YOU</p>
            <h2>Build your student profile.</h2>
            <p>
              Introduce your skills, interests, academic background,
              experience, and the areas you want to explore.
            </p>
          </div>
        </article>

        <article className="journey-step">
          <span className="journey-number">02</span>
          <div>
            <p className="eyebrow">EXPLORE POSSIBILITIES</p>
            <h2>Discover opportunities.</h2>
            <p>
              Find hackathons, innovation challenges, research
              competitions, and project opportunities that match
              your interests.
            </p>
          </div>
        </article>

        <article className="journey-step">
          <span className="journey-number">03</span>
          <div>
            <p className="eyebrow">MEET YOUR MATCH</p>
            <h2>Discover potential collaborators.</h2>
            <p>
              Explore students with shared goals and complementary
              strengths, including people from other departments.
            </p>
          </div>
        </article>

        <article className="journey-step">
          <span className="journey-number">04</span>
          <div>
            <p className="eyebrow">MOVE FORWARD TOGETHER</p>
            <h2>Bring your team together.</h2>
            <p>
              Connect around a common goal, discuss ideas,
              and work together toward a shared outcome.
            </p>
          </div>
        </article>
      </section>

      <section className="journey-cta">
        <h2>Your next idea could start with a connection.</h2>
        <p>Take the first step toward discovering your community.</p>
        <Link to="/get-started" className="primary-button">
          Get Started <span aria-hidden="true">→</span>
        </Link>
      </section>

      
        <div className="subpage-navigation">
        <Link to="/about" className="back-about-button">
            <span aria-hidden="true">←</span> Back to About
        </Link>

        </div>

    </main>
  );
}

export default HowItWorks;
