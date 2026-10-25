
import { Link } from "react-router-dom";

function Home() {
  return (
    <main className="home-page">
      {/* SECTION 1: HERO */}
      <section className="home-hero">
        <div className="hero-glow" />

        <div className="hero-content">
          <span className="hero-badge">
            ✦ YOUR NEXT GREAT IDEA STARTS HERE
          </span>

          <h1>
            Find Your People.
            <br />
            <span>Build Your Ideas.</span>
          </h1>

          <p className="hero-description">
            Discover hackathons, innovation challenges, and project
            opportunities. Connect with talented students across
            departments and build a team that brings your ideas to life.
          </p>

          {/* Hero buttons removed as requested */}

          <div className="hero-highlights">
            <span>✦ Smart Teammate Matching</span>
            <span>✦ Cross-Department Teams</span>
            <span>✦ Opportunity Discovery</span>
          </div>
        </div>

        {/* CIRCULAR TEAM ILLUSTRATION */}
        <div
          className="hero-visual"
          aria-label="How HackMate AI helps students build teams"
        >
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />

          <div className="visual-center">
            <span className="visual-symbol">H</span>
            <strong>HackMate AI</strong>
            <span>Your team starts here</span>
          </div>

          <div className="floating-card card-top">
            <span className="floating-icon">✦</span>
            <div>
              <strong>Discover</strong>
              <p>Opportunities for you</p>
            </div>
          </div>

          <div className="floating-card card-left">
            <span className="avatar">C</span>
            <div>
              <strong>Creative Thinker</strong>
              <p>Design · Ideas</p>
            </div>
          </div>

          <div className="floating-card card-right">
            <span className="avatar avatar-blue">T</span>
            <div>
              <strong>Find Your Teammates</strong>
              <p>Skills · Collaboration</p>
            </div>
          </div>

          <div className="floating-card card-bottom">
            <span className="match-icon">✓</span>
            <div>
              <strong>Better Together</strong>
              <p>Skills that complement</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: FEATURES — EXISTING CONTENT PRESERVED */}
      <section className="home-features">
        <div className="section-heading">
          <span className="eyebrow">BUILT FOR STUDENT INNOVATORS</span>
          <h2>Everything you need to find your team.</h2>
          <p>
            From discovering your next opportunity to finding the right
            collaborators, make every idea a chance to build something.
          </p>
        </div>

        <div className="feature-grid">
          <article className="feature-card">
            <span className="feature-number">01</span>
            <h2>Discover Opportunities</h2>
            <p>
              Explore hackathons, innovation challenges, research
              competitions, and project contests in one place.
            </p>
          </article>

          <article className="feature-card">
            <span className="feature-number">02</span>
            <h2>Find Your Teammates</h2>
            <p>
              Connect with students from different departments who
              share your interests and bring complementary skills.
            </p>
          </article>

          <article className="feature-card">
            <span className="feature-number">03</span>
            <h2>Build Balanced Teams</h2>
            <p>
              Identify missing skills and discover potential teammates
              who can strengthen your team's capabilities.
            </p>
          </article>
        </div>
      </section>

      
      {/* SECTION 3: GET STARTED WITH HACKMATE AI */}
      <section className="home-cta">
        <div className="cta-heading">
          <p className="eyebrow">
            YOUR NEXT COLLABORATION STARTS HERE
          </p>

          <h2>Great ideas deserve great teams.</h2>

          <p className="cta-intro">
            Step beyond your circle. Meet your next collaborator.
          </p>
        </div>

        <div className="cta-layout">
          {/* Left: Main message and call to action */}
          <div className="cta-main">
            <span className="cta-label">
              YOUR NEXT CHAPTER STARTS HERE
            </span>

            <h3>
              Stop Searching Alone.
              <br />
              <span>Start Building Together.</span>
            </h3>

            <p className="cta-description">
              Your next hackathon, project partner, or big idea
              could be closer than you think.
            </p>

            <Link to="/get-started" className="primary-button cta-button">
              Get Started with HackMate AI
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          {/* Right: Why students should join */}
          <div className="cta-cards">
            <article className="cta-card">
              <span className="cta-card-icon">01</span>
              <div>
                <h3>Real-time Matchmaking</h3>
                <p>
                  Find students whose skills complement yours.
                </p>
              </div>
              <span className="cta-card-arrow" aria-hidden="true">↗</span>
            </article>

            <article className="cta-card">
              <span className="cta-card-icon">02</span>
              <div>
                <h3>Cross-discipline Teams</h3>
                <p>
                  Collaborate with talented students across departments.
                </p>
              </div>
              <span className="cta-card-arrow" aria-hidden="true">↗</span>
            </article>

            <article className="cta-card">
              <span className="cta-card-icon">03</span>
              <div>
                <h3>Direct Collaboration</h3>
                <p>
                  Connect with potential teammates and start
                  building together.
                </p>
              </div>
              <span className="cta-card-arrow" aria-hidden="true">↗</span>
            </article>
          </div>
        </div>
      </section>

    </main>
  );
}

export default Home;
