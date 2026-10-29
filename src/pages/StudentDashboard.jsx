
import { Link } from "react-router-dom";
import "./StudentDashboard.css";

const stats = [
  { label: "Active projects", value: "0", icon: "↗" },
  { label: "Completed projects", value: "0", icon: "✓" },
  { label: "Achievements", value: "0", icon: "◇" },
];

const teamOptions = [
  {
    icon: "⌕",
    title: "Find a team",
    description:
      "Discover students with the skills and interests your next project needs.",
    action: "Explore teammates",
    link: "/find-teammates",
  },
  {
    icon: "+",
    title: "Build a team",
    description:
      "Start a hackathon team or create an independent project and invite students.",
    action: "Create a team",
    link: "/teams/create",
  },
];

function StudentDashboard() {
  const firstName = "there";

  return (
    <div className="dashboard-page">
      <aside className="dashboard-sidebar">
        <Link to="/" className="dashboard-brand">
          <span className="dashboard-brand-icon">H</span>
          <span>
            <strong>HackMate</strong>
            <small>AI COLLABORATION</small>
          </span>
        </Link>

        <p className="dashboard-menu-label">WORKSPACE</p>

        <nav className="dashboard-nav">
          <Link to="/dashboard" className="dashboard-nav-link active">
            <span>▦</span> Dashboard
          </Link>
          <Link to="/find-teammates" className="dashboard-nav-link">
  <span>♧</span> Find teammates
</Link>
          <Link to="/teams" className="dashboard-nav-link">
            <span>◫</span> My teams
          </Link>
          <Link to="/projects" className="dashboard-nav-link">
            <span>◇</span> My projects
          </Link>
          <Link to="/invitations" className="dashboard-nav-link">
            <span>✉</span> Requests & invitations
          </Link>
        </nav>

        <div className="dashboard-sidebar-bottom">
          <div className="dashboard-help">
            <span className="dashboard-help-icon">?</span>
            <div>
              <strong>Build something great</strong>
              <p>Your next teammate could be one click away.</p>
            </div>
          </div>
          <Link to="/" className="dashboard-back-home">
            ← Back to website
          </Link>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-topbar">
          <div>
            <span className="dashboard-breadcrumb">Workspace / Dashboard</span>
            <h2>Student Dashboard</h2>
          </div>

          <Link to="/profile" className="dashboard-profile-button">
            <span className="dashboard-avatar">S</span>
            <span>My account</span>
          </Link>
        </header>

        <section className="dashboard-content">
          <div className="dashboard-welcome">
            <div>
              <span className="dashboard-eyebrow">YOUR COLLABORATION SPACE</span>
              <h1>Welcome back, {firstName}!</h1>
              <p>
                Great ideas become better projects when the right people build
                them together.
              </p>
            </div>
            <div className="dashboard-welcome-mark">H</div>
          </div>

          <section className="dashboard-section">
            <div className="dashboard-section-heading">
              <div>
                <h2>Your progress</h2>
                <p>Your project activity at a glance.</p>
              </div>
            </div>

            <div className="dashboard-stats">
              {stats.map((stat) => (
                <article className="dashboard-stat-card" key={stat.label}>
                  <div className="dashboard-stat-top">
                    <span>{stat.label}</span>
                    <span className="dashboard-stat-icon">{stat.icon}</span>
                  </div>
                  <strong>{stat.value}</strong>
                  <p>Will update as you use HackMate AI</p>
                </article>
              ))}
            </div>
          </section>

          <section className="dashboard-section">
            <div className="dashboard-section-heading">
              <div>
                <h2>What's your next move?</h2>
                <p>Start with the collaboration goal that fits you.</p>
              </div>
            </div>

            <div className="dashboard-action-grid">
              {teamOptions.map((option) => (
                <article className="dashboard-action-card" key={option.title}>
                  <div className="dashboard-action-icon">{option.icon}</div>
                  <h3>{option.title}</h3>
                  <p>{option.description}</p>
                  <Link to={option.link} className="dashboard-action-link">
                    {option.action} <span>→</span>
                  </Link>
                </article>
              ))}
            </div>
          </section>

          <section className="dashboard-lower-grid">
            <article className="dashboard-panel">
              <div className="dashboard-panel-heading">
                <div>
                  <h2>Your team status</h2>
                  <p>Let others know what you're looking for.</p>
                </div>
                <span className="dashboard-status-dot" />
              </div>

              <div className="dashboard-empty-state">
                <span className="dashboard-empty-icon">♧</span>
                <h3>Your collaboration journey starts here</h3>
                <p>
                  Choose whether you want to join a team or create one of your
                  own.
                </p>
                <Link to="/profile" className="dashboard-secondary-button">
                  Set up your profile
                </Link>
              </div>
            </article>

            <article className="dashboard-panel">
              <div className="dashboard-panel-heading">
                <div>
                  <h2>Requests & invitations</h2>
                  <p>Keep track of team connections.</p>
                </div>
                <span className="dashboard-count">0</span>
              </div>

              <div className="dashboard-empty-state">
                <span className="dashboard-empty-icon">✉</span>
                <h3>Nothing waiting for you</h3>
                <p>
                  Team invitations and join requests will appear here when
                  available.
                </p>
                <Link to="/teams" className="dashboard-secondary-button">
                  Explore teams
                </Link>
              </div>
            </article>
          </section>

          <footer className="dashboard-footer">
            HackMate AI · Find your people. Build your next idea.
          </footer>
        </section>
      </main>
    </div>
  );
}

export default StudentDashboard;
