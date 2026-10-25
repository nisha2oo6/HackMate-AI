
import { Link } from "react-router-dom";

function About() {
  return (
    <main className="page-content about-page">
      <section className="about-hero">
        <p className="eyebrow">THE STORY BEHIND HACKMATE AI</p>

        <h1>
          Ideas grow stronger
          <br />
          <span>when talent comes together.</span>
        </h1>

        <p className="about-intro">
          HackMate AI is a student collaboration platform designed
          to connect ideas, abilities, and opportunities. It helps
          students look beyond familiar circles and explore the
          possibilities that emerge when different perspectives
          come together.
        </p>

        <div className="about-hero-note">
          <span className="about-note-line" />
          <p>
            One idea can start something.
            The right people can take it further.
          </p>
        </div>
      </section>

      <section className="about-story">
        <div className="about-story-heading">
          <p className="eyebrow">THE CHALLENGE</p>

          <h2>
            Potential is everywhere.
            Finding the right connections is not always easy.
          </h2>
        </div>

        <div className="about-story-content">
          <p>
            Students encounter hackathons, research competitions,
            innovation challenges, and project opportunities
            throughout their academic journey. But finding the
            right people to participate with can be difficult.
          </p>

          <p>
            Many students connect mainly within their existing
            friendship groups. Talented individuals from other
            departments may remain undiscovered, and a promising
            idea can struggle to find the mix of skills it needs.
          </p>

          <p>
            HackMate AI addresses this gap by bringing student
            profiles, opportunities, interests, and collaboration
            together in one connected space.
          </p>
        </div>
      </section>

      <section className="about-purpose">
        <div className="purpose-number">01</div>

        <div className="purpose-content">
          <p className="eyebrow">THE PURPOSE</p>

          <h2>Make meaningful student connections easier.</h2>

          <p>
            Beyond finding a teammate, collaboration is an
            opportunity to learn a new skill, understand a
            different perspective, contribute individual strengths,
            and turn a shared ambition into something meaningful.
          </p>
        </div>
      </section>

      <section className="about-belief">
        <p className="eyebrow">THE BIGGER PICTURE</p>

        <h2>
          A place where different strengths can create something
          greater together.
        </h2>

        <p>
          HackMate AI connects student potential with the people
          and opportunities that can help it grow.
        </p>
      </section>

      <section className="about-explore">
        <div className="about-explore-heading">
          <p className="eyebrow">EXPLORE HACKMATE AI</p>
          <h2>Get to know the platform.</h2>
          <p>
            Learn about the direction behind HackMate AI and
            the journey from an individual idea to a collaborative team.
          </p>
        </div>

        <div className="about-explore-buttons">
          <Link to="/about/mission" className="about-nav-card">
            <span className="about-nav-number">01</span>
            <span className="about-nav-copy">
              <strong>Mission &amp; Vision</strong>
              <span>The purpose and future direction of HackMate AI.</span>
            </span>
            <span className="about-nav-arrow" aria-hidden="true">→</span>
          </Link>

          <Link to="/about/how-it-works" className="about-nav-card">
            <span className="about-nav-number">02</span>
            <span className="about-nav-copy">
              <strong>How It Works</strong>
              <span>Explore the student collaboration journey.</span>
            </span>
            <span className="about-nav-arrow" aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </main>
  );
}

export default About;
