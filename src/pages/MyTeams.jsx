
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./MyTeams.css";

function MyTeams() {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const savedTeams = JSON.parse(
      localStorage.getItem("hackmateTeams") || "[]"
    );

    setTeams(savedTeams);
  }, []);

  return (
    <div className="mt-page">
      <div className="mt-header">
        <div>
          <span className="mt-eyebrow">YOUR WORKSPACE</span>
          <h1>My Teams</h1>
          <p>
            Manage the teams you create and collaborate with
            students on exciting ideas.
          </p>
        </div>

        <Link to="/create-team" className="mt-create-button">
          + Create New Team
        </Link>
      </div>

      <div className="mt-summary">
        <div className="mt-summary-card">
          <span>Created Teams</span>
          <strong>{teams.length}</strong>
        </div>

        <div className="mt-summary-card">
          <span>Accepted Members</span>
          <strong>
            {teams.reduce(
              (total, team) => total + team.members.length,
              0
            )}
          </strong>
        </div>

        <div className="mt-summary-card">
          <span>Pending Invitations</span>
          <strong>
            {teams.reduce(
              (total, team) => total + team.invitations.length,
              0
            )}
          </strong>
        </div>
      </div>

      <div className="mt-section-heading">
        <div>
          <h2>Teams You Created</h2>
          <p>Teams where you are the team leader.</p>
        </div>
      </div>

      {teams.length > 0 ? (
        <div className="mt-team-grid">
          {teams.map((team) => (
            <div className="mt-team-card" key={team.id}>
              <div className="mt-team-top">
                <span className="mt-team-type">
                  {team.type === "event"
                    ? "🏆 Event Team"
                    : "💡 Project Team"}
                </span>

                <span className="mt-team-status">Created</span>
              </div>

              <h3>{team.name}</h3>

              <p className="mt-event-name">
                {team.type === "event"
                  ? team.eventName
                  : "Independent Project"}
              </p>

              <p className="mt-description">
                {team.description}
              </p>

              <div className="mt-team-info">
                <div>
                  <span>Team Capacity</span>
                  <strong>{team.teamSize} Members</strong>
                </div>

                <div>
                  <span>Accepted Members</span>
                  <strong>{team.members.length}</strong>
                </div>

                <div>
                  <span>Pending Invitations</span>
                  <strong>{team.invitations.length}</strong>
                </div>
              </div>

              <div className="mt-skills">
                {team.skills.length > 0 ? (
                  team.skills.map((skill, index) => (
                    <span key={index}>{skill}</span>
                  ))
                ) : (
                  <small>No required skills added.</small>
                )}
              </div>

              <div className="mt-card-footer">
                <span>
                  Leader: {team.leader}
                </span>

                <Link
  to={`/teams/${team.id}`}
  className="mt-view-button"
>
  View Team →
</Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-empty-state">
          <div className="mt-empty-icon">👥</div>
          <h3>You haven't created a team yet</h3>
          <p>
            Start building your team by finding students
            with the skills and interests you need.
          </p>

          <Link to="/create-team" className="mt-create-button">
            Create Your First Team
          </Link>
        </div>
      )}
    </div>
  );
}

export default MyTeams;
