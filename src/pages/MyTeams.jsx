
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CURRENT_STUDENT_ID } from "../data/currentStudent";
import "./MyTeams.css";

function MyTeams() {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const savedTeams = JSON.parse(
      localStorage.getItem("hackmateTeams") || "[]"
    );

    setTeams(savedTeams);
  }, []);

  // Identify teams created by the current student.
  const createdTeams = teams.filter((team) =>
    (team.members || []).some(
      (member) =>
        member.studentId === CURRENT_STUDENT_ID &&
        member.role === "Leader" &&
        member.status === "Accepted"
    )
  );

  // Identify teams where the current student is an accepted member,
  // but is not the team leader.
  const joinedTeams = teams.filter((team) => {
    const currentStudentIsMember = (team.members || []).some(
      (member) =>
        member.studentId === CURRENT_STUDENT_ID &&
        member.status === "Accepted"
    );

    const currentStudentIsLeader = (team.members || []).some(
      (member) =>
        member.studentId === CURRENT_STUDENT_ID &&
        member.role === "Leader" &&
        member.status === "Accepted"
    );

    return currentStudentIsMember && !currentStudentIsLeader;
  });

  const acceptedMembersCount = [...createdTeams, ...joinedTeams].reduce(
    (total, team) =>
      total +
      (team.members || []).filter(
        (member) => member.status === "Accepted"
      ).length,
    0
  );

  const pendingInvitationsCount = createdTeams.reduce(
    (total, team) =>
      total +
      (team.invitations || []).filter(
        (invitation) => invitation.status === "Pending"
      ).length,
    0
  );

  const renderTeamCard = (team, isLeader) => {
    const members = team.members || [];
    const invitations = team.invitations || [];

    const acceptedCount = members.filter(
      (member) => member.status === "Accepted"
    ).length;

    const pendingCount = invitations.filter(
      (invitation) => invitation.status === "Pending"
    ).length;

    const leader = members.find(
      (member) => member.role === "Leader"
    );

    return (
      <div className="mt-team-card" key={team.id}>
        <div className="mt-team-top">
          <span className="mt-team-type">
            {team.type === "event"
              ? "🏆 Event Team"
              : "💡 Project Team"}
          </span>

          <span className="mt-team-status">
            {isLeader ? "Created" : "Joined"}
          </span>
        </div>

        <h3>{team.name}</h3>

        <p className="mt-event-name">
          {team.type === "event"
            ? team.eventName
            : "Independent Project"}
        </p>

        <p className="mt-description">{team.description}</p>

        <div className="mt-team-info">
          <div>
            <span>Team Capacity</span>
            <strong>{team.teamSize} Members</strong>
          </div>

          <div>
            <span>Accepted Members</span>
            <strong>{acceptedCount}</strong>
          </div>

          {isLeader && (
            <div>
              <span>Pending Invitations</span>
              <strong>{pendingCount}</strong>
            </div>
          )}
        </div>

        <div className="mt-skills">
          {team.skills?.length > 0 ? (
            team.skills.map((skill, index) => (
              <span key={index}>{skill}</span>
            ))
          ) : (
            <small>No required skills added.</small>
          )}
        </div>

        <div className="mt-card-footer">
          <span>
            Leader: {team.leader || leader?.name || "Not available"}
          </span>

          <Link to={`/teams/${team.id}`} className="mt-view-button">
            View Team →
          </Link>
        </div>
      </div>
    );
  };

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

      {/* Summary */}
      <div className="mt-summary">
        <div className="mt-summary-card">
          <span>Created Teams</span>
          <strong>{createdTeams.length}</strong>
        </div>

        <div className="mt-summary-card">
          <span>Joined Teams</span>
          <strong>{joinedTeams.length}</strong>
        </div>

        <div className="mt-summary-card">
          <span>Accepted Members</span>
          <strong>{acceptedMembersCount}</strong>
        </div>

        <div className="mt-summary-card">
          <span>Pending Invitations</span>
          <strong>{pendingInvitationsCount}</strong>
        </div>
      </div>

      {/* Teams created by the current student */}
      <div className="mt-section-heading">
        <div>
          <h2>Teams You Created</h2>
          <p>Teams where you are the team leader.</p>
        </div>
      </div>

      {createdTeams.length > 0 ? (
        <div className="mt-team-grid">
          {createdTeams.map((team) => renderTeamCard(team, true))}
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

      {/* Teams joined by the current student */}
      {/* Teams joined by the current student */}
<div className="mt-section-heading mt-joined-section">
        <div>
          <h2>Teams You've Joined</h2>
          <p>
            Teams where you are an accepted member, even if
            someone else is the leader.
          </p>
        </div>
      </div>

      {joinedTeams.length > 0 ? (
        <div className="mt-team-grid">
          {joinedTeams.map((team) => renderTeamCard(team, false))}
        </div>
      ) : (
        <div className="mt-empty-state mt-joined-empty">
  <div className="mt-empty-icon">🤝</div>

  <h3>You haven't joined any teams yet</h3>

  <p>
    When you accept a team invitation, that team
    will appear here.
  </p>

  <Link to="/find-teammates" className="mt-create-button">
    Find Teammates
  </Link>
</div>
      )}
    </div>
  );
}

export default MyTeams;
