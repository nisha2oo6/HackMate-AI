
import { Link } from "react-router-dom";
import {
  getStudentById,
} from "../data/students";
import { CURRENT_STUDENT_ID } from "../data/currentStudent";
import "./StudentDashboard.css";

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
    link: "/create-team",
  },
];

function getDashboardTeamData(studentId) {
  try {
    const teams = JSON.parse(
      localStorage.getItem("hackmateTeams") || "[]"
    );

    const myTeams = teams.filter((team) =>
      (team.members || []).some(
        (member) =>
          Number(member.studentId) === Number(studentId) &&
          member.status === "Accepted"
      )
    );

    const pendingInvitations = teams.flatMap((team) =>
      (team.invitations || [])
        .filter(
          (invitation) =>
            Number(invitation.studentId) === Number(studentId) &&
            invitation.status === "Pending"
        )
        .map((invitation) => ({
          ...invitation,
          teamId: team.id,
          teamName: team.name || "Untitled team",
        }))
    );

    return { myTeams, pendingInvitations };
  } catch (error) {
    console.error("Unable to read dashboard team data:", error);

    return {
      myTeams: [],
      pendingInvitations: [],
    };
  }
}

function StudentDashboard() {
  const student = getStudentById(CURRENT_STUDENT_ID);
 
  const firstName =
    student?.name?.trim().split(/\s+/)[0] || "there";

  const avatarInitial =
    student?.initials?.charAt(0) ||
    firstName.charAt(0).toUpperCase();

  // Project statistics
  const projects = student?.projects || [];

  const activeProjects = projects.filter(
    (project) => project.status === "In Progress"
  ).length;

  const completedProjects = projects.filter(
    (project) => project.status === "Completed"
  ).length;

  const achievements =
    (student?.achievements?.length || 0) +
    (student?.certifications?.length || 0);

  // Team and invitation information
  const { myTeams, pendingInvitations } =
    getDashboardTeamData(CURRENT_STUDENT_ID);

  const stats = [
    {
      label: "Active projects",
      value: activeProjects,
      icon: "↗",
      description: "Projects currently in progress",
      link: "/my-projects?status=In%20Progress",
    },
    {
      label: "Completed projects",
      value: completedProjects,
      icon: "✓",
      description: "Projects successfully completed",
      link: "/my-projects?status=Completed",
    },
    {
      label: "Achievements",
      value: achievements,
      icon: "◇",
      description: "Achievements and certifications",
      link: "/achievements",
    },
  ];

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
          <Link to="/connections" className="dashboard-nav-link">
             <span>♧</span> Connections
          </Link>
          <Link to="/teams" className="dashboard-nav-link">
            <span>◫</span> My teams
          </Link>

          <Link to="/my-projects" className="dashboard-nav-link">
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
            <span className="dashboard-breadcrumb">
              Workspace / Dashboard
            </span>
            <h2>Student Dashboard</h2>
          </div>

          <Link to="/profile" className="dashboard-profile-button">
            <span className="dashboard-avatar">{avatarInitial}</span>
            <span>My account</span>
          </Link>
        </header>

        <section className="dashboard-content">
          <div className="dashboard-welcome">
            <div>
              <span className="dashboard-eyebrow">
                YOUR COLLABORATION SPACE
              </span>

              <h1>Welcome back, {firstName}!</h1>

              <p>
                Great ideas become better projects when the right people build
                them together.
              </p>
            </div>

            <div className="dashboard-welcome-mark">H</div>
          </div>

          {/* Progress statistics */}
          <section className="dashboard-section">
            <div className="dashboard-section-heading">
              <div>
                <h2>Your progress</h2>
                <p>Your project activity at a glance.</p>
              </div>
            </div>

            <div className="dashboard-stats">
              {stats.map((stat) => (
                <Link
                  to={stat.link}
                  className="dashboard-stat-card"
                  key={stat.label}
                >
                  <div className="dashboard-stat-top">
                    <span>{stat.label}</span>
                    <span className="dashboard-stat-icon">
                      {stat.icon}
                    </span>
                  </div>

                  <strong>{stat.value}</strong>
                  <p>{stat.description}</p>
                </Link>
              ))}
            </div>
          </section>

          {/* Collaboration actions */}
          <section className="dashboard-section">
            <div className="dashboard-section-heading">
              <div>
                <h2>What's your next move?</h2>
                <p>Start with the collaboration goal that fits you.</p>
              </div>
            </div>

            <div className="dashboard-action-grid">
              {teamOptions.map((option) => (
                <article
                  className="dashboard-action-card"
                  key={option.title}
                >
                  <div className="dashboard-action-icon">
                    {option.icon}
                  </div>

                  <h3>{option.title}</h3>
                  <p>{option.description}</p>

                  <Link
                    to={option.link}
                    className="dashboard-action-link"
                  >
                    {option.action} <span>→</span>
                  </Link>
                </article>
              ))}
            </div>
          </section>

          {/* Team status and invitations */}
          <section className="dashboard-lower-grid">
            <article className="dashboard-panel">
              <div className="dashboard-panel-heading">
                <div>
                  <h2>Your team status</h2>
                  <p>Keep track of your team participation.</p>
                </div>

                <span className="dashboard-status-dot" />
              </div>

              {myTeams.length > 0 ? (
                <div className="dashboard-dynamic-content">
                  <h3>
                    You're part of {myTeams.length}{" "}
                    {myTeams.length === 1 ? "team" : "teams"}!
                  </h3>

                  <div className="dashboard-dynamic-list">
                    {myTeams.slice(0, 3).map((team) => (
                      <div
                        className="dashboard-dynamic-item"
                        key={team.id}
                      >
                        <div className="dashboard-dynamic-info">
                          <strong>
                            {team.name || "Untitled team"}
                          </strong>

                          <p>
                            {team.eventName ||
                              team.type ||
                              "Project team"}
                          </p>
                        </div>

                        <Link
                          to={`/teams/${team.id}`}
                          className="dashboard-inline-link"
                        >
                          View team →
                        </Link>
                      </div>
                    ))}
                  </div>

                  <Link
                    to="/teams"
                    className="dashboard-secondary-button"
                  >
                    View all my teams
                  </Link>
                </div>
              ) : (
                <div className="dashboard-empty-state">
                  <span className="dashboard-empty-icon">♧</span>

                  <h3>Your collaboration journey starts here</h3>

                  <p>
                    {student?.availability ||
                      "You haven't set your availability yet."}
                    {" "}
                    Find teammates or create a team to get started.
                  </p>

                  <Link
                    to="/find-teammates"
                    className="dashboard-secondary-button"
                  >
                    Find teammates
                  </Link>
                </div>
              )}
            </article>

            <article className="dashboard-panel">
              <div className="dashboard-panel-heading">
                <div>
                  <h2>Requests & invitations</h2>
                  <p>Keep track of team connections.</p>
                </div>

                <span className="dashboard-count">
                  {pendingInvitations.length}
                </span>
              </div>

              {pendingInvitations.length > 0 ? (
                <div className="dashboard-dynamic-content">
                  <h3>
                    You have {pendingInvitations.length} pending{" "}
                    {pendingInvitations.length === 1
                      ? "invitation"
                      : "invitations"}.
                  </h3>

                  <div className="dashboard-dynamic-list">
                    {pendingInvitations.slice(0, 3).map((invitation) => (
                      <div
                        className="dashboard-dynamic-item"
                        key={`${invitation.teamId}-${invitation.id}`}
                      >
                        <div className="dashboard-dynamic-info">
                          <strong>{invitation.teamName}</strong>
                          <p>Team invitation · Awaiting your response</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Link
                    to="/invitations"
                    className="dashboard-secondary-button"
                  >
                    View all invitations
                  </Link>
                </div>
              ) : (
                <div className="dashboard-empty-state">
                  <span className="dashboard-empty-icon">✉</span>

                  <h3>Nothing waiting for you</h3>

                  <p>
                    Team invitations will appear here when someone
                    invites you to collaborate.
                  </p>

                  <Link
                    to="/invitations"
                    className="dashboard-secondary-button"
                  >
                    View invitations
                  </Link>
                </div>
              )}
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
