
import { useState } from "react";
import { Link } from "react-router-dom";
import { getStudentById } from "../data/students";
import { CURRENT_STUDENT_ID } from "../data/currentStudent";
import "./Connections.css";

const demoConnections = [
  {
    id: 2,
    name: "Priya Sharma",
    initials: "PS",
    department: "Information Technology",
    year: "3rd Year",
    skills: ["React", "UI/UX Design"],
  },
  {
    id: 3,
    name: "Rahul Dev",
    initials: "RD",
    department: "AI & Data Science",
    year: "2nd Year",
    skills: ["Python", "Machine Learning"],
  },
  {
    id: 4,
    name: "Meena Krish",
    initials: "MK",
    department: "Computer Science",
    year: "2nd Year",
    skills: ["Java", "Web Development"],
  },
];

const demoReceivedRequests = [
  {
    id: 5,
    name: "Karthik Raj",
    initials: "KR",
    department: "Electronics & Communication",
    year: "3rd Year",
    message: "Hi! I'd like to connect and explore project opportunities.",
  },
  {
    id: 6,
    name: "Divya S",
    initials: "DS",
    department: "Information Technology",
    year: "2nd Year",
    message: "Would love to connect with you!",
  },
];

const demoSentRequests = [
  {
    id: 7,
    name: "Arjun Kumar",
    initials: "AK",
    department: "Computer Science",
    year: "3rd Year",
    status: "Pending",
  },
  {
    id: 8,
    name: "Sneha R",
    initials: "SR",
    department: "Information Technology",
    year: "3rd Year",
    status: "Pending",
  },
];

function Connections() {
  const [activeTab, setActiveTab] = useState("connections");

  const student = getStudentById(CURRENT_STUDENT_ID);
  const firstName = student?.name?.trim().split(/\s+/)[0] || "there";
  const avatarInitial =
    student?.initials?.charAt(0) ||
    firstName.charAt(0).toUpperCase();

  const tabs = [
    {
      id: "connections",
      label: "My Connections",
      count: demoConnections.length,
    },
    {
      id: "received",
      label: "Received Requests",
      count: demoReceivedRequests.length,
    },
    {
      id: "sent",
      label: "Sent Requests",
      count: demoSentRequests.length,
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
          <Link to="/dashboard" className="dashboard-nav-link">
            <span>▦</span> Dashboard
          </Link>

          <Link to="/find-teammates" className="dashboard-nav-link">
            <span>♧</span> Find teammates
          </Link>

          <Link to="/connections" className="dashboard-nav-link active">
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
              Workspace / Connections
            </span>
            <h2>Connections</h2>
          </div>

          <Link to="/profile" className="dashboard-profile-button">
            <span className="dashboard-avatar">{avatarInitial}</span>
            <span>My account</span>
          </Link>
        </header>

        <section className="connections-content">
          <div className="connections-heading">
            <div>
              <span className="dashboard-eyebrow">
                YOUR NETWORK
              </span>
              <h1>Stay connected, {firstName}.</h1>
              <p>
                Build your student network and connect with people who share
                your interests.
              </p>
            </div>
          </div>

          <div className="connections-demo-banner">
            <span>ⓘ</span>
            <p>
              You're viewing a frontend preview. Connection requests and
              actions will be enabled after backend integration.
            </p>
          </div>

          <div className="connections-tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`connections-tab ${
                  activeTab === tab.id ? "active" : ""
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
                <span>{tab.count}</span>
              </button>
            ))}
          </div>

          {activeTab === "connections" && (
            <section className="connections-list-section">
              <div className="connections-section-heading">
                <div>
                  <h2>My Connections</h2>
                  <p>Students you're connected with.</p>
                </div>
                <span>{demoConnections.length} connections</span>
              </div>

              <div className="connections-card-grid">
                {demoConnections.map((person) => (
                  <article className="connection-card" key={person.id}>
                    <div className="connection-card-top">
                      <div className="connection-avatar">
                        {person.initials}
                      </div>
                      <span className="connection-status">
                        Connected
                      </span>
                    </div>

                    <h3>{person.name}</h3>
                    <p className="connection-department">
                      {person.department} · {person.year}
                    </p>

                    <div className="connection-skills">
                      {person.skills.map((skill) => (
                        <span key={skill}>{skill}</span>
                      ))}
                    </div>

                    <Link
                      to={`/student/${person.id}`}
                      className="connection-profile-link"
                    >
                      View profile →
                    </Link>
                  </article>
                ))}
              </div>
            </section>
          )}

          {activeTab === "received" && (
            <section className="connections-list-section">
              <div className="connections-section-heading">
                <div>
                  <h2>Received Requests</h2>
                  <p>Students who would like to connect with you.</p>
                </div>
                <span>{demoReceivedRequests.length} requests</span>
              </div>

              <div className="connection-request-list">
                {demoReceivedRequests.map((person) => (
                  <article className="connection-request-card" key={person.id}>
                    <div className="connection-avatar">
                      {person.initials}
                    </div>

                    <div className="connection-request-info">
                      <h3>{person.name}</h3>
                      <p>
                        {person.department} · {person.year}
                      </p>
                      <span className="connection-request-message">
                        "{person.message}"
                      </span>
                    </div>

                    <div className="connection-request-actions">
                      <button type="button" disabled>
                        Accept
                      </button>
                      <button
                        type="button"
                        className="connection-decline-button"
                        disabled
                      >
                        Decline
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {activeTab === "sent" && (
            <section className="connections-list-section">
              <div className="connections-section-heading">
                <div>
                  <h2>Sent Requests</h2>
                  <p>Connection requests you've sent to other students.</p>
                </div>
                <span>{demoSentRequests.length} pending</span>
              </div>

              <div className="connection-request-list">
                {demoSentRequests.map((person) => (
                  <article className="connection-request-card" key={person.id}>
                    <div className="connection-avatar">
                      {person.initials}
                    </div>

                    <div className="connection-request-info">
                      <h3>{person.name}</h3>
                      <p>
                        {person.department} · {person.year}
                      </p>
                      <span className="connection-pending-label">
                        {person.status}
                      </span>
                    </div>

                    <button
                      type="button"
                      className="connection-cancel-button"
                      disabled
                    >
                      Cancel request
                    </button>
                  </article>
                ))}
              </div>
            </section>
          )}
        </section>
      </main>
    </div>
  );
}

export default Connections;
