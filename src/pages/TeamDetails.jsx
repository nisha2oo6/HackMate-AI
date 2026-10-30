
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { students } from "./FindTeammates";
import "./TeamDetails.css";

function TeamDetails() {
  const { id } = useParams();

  const [team, setTeam] = useState(null);
  const [studentSearch, setStudentSearch] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const savedTeams = JSON.parse(
      localStorage.getItem("hackmateTeams") || "[]"
    );

    const selectedTeam = savedTeams.find(
      (item) => String(item.id) === id
    );

    setTeam(selectedTeam || null);
  }, [id]);

  // Only accepted members count toward team capacity.
  const acceptedCount = team?.members?.length || 0;

  const availableSlots = team
    ? Math.max(0, team.teamSize - acceptedCount)
    : 0;

  // Search students by name, department or skill.
  const filteredStudents = students.filter((student) => {
    const search = studentSearch.trim().toLowerCase();

    if (!search) return true;

    return (
      student.name.toLowerCase().includes(search) ||
      student.department.toLowerCase().includes(search) ||
      student.skills.some((skill) =>
        skill.toLowerCase().includes(search)
      )
    );
  });

  // Invite a student to the team.
  const handleInvite = (student) => {
    if (availableSlots <= 0) {
      setMessage("Your team has reached its maximum capacity.");
      return;
    }

    const alreadyMember = team.members.some(
      (member) => member.studentId === student.id
    );

    const alreadyInvited = team.invitations.some(
      (invitation) =>
        invitation.studentId === student.id &&
        invitation.status === "Pending"
    );

    if (alreadyMember || alreadyInvited) {
      setMessage(
        "This student is already a member or has a pending invitation."
      );
      return;
    }

    const updatedTeam = {
      ...team,
      invitations: [
        ...team.invitations,
        {
          studentId: student.id,
          name: student.name,
          department: student.department,
          status: "Pending",
        },
      ],
    };

    const savedTeams = JSON.parse(
      localStorage.getItem("hackmateTeams") || "[]"
    );

    const updatedTeams = savedTeams.map((item) =>
      String(item.id) === String(team.id)
        ? updatedTeam
        : item
    );

    localStorage.setItem(
      "hackmateTeams",
      JSON.stringify(updatedTeams)
    );

    setTeam(updatedTeam);
    setMessage(`${student.name} has been invited successfully.`);
    setStudentSearch("");
  };

  if (!team) {
    return (
      <div className="td-page">
        <div className="td-empty">
          <h2>Team not found</h2>
          <p>We couldn't find this team.</p>
          <Link to="/teams">Back to My Teams</Link>
        </div>
      </div>
    );
  }

  const pendingInvitations = team.invitations.filter(
    (item) => item.status === "Pending"
  );

  return (
    <div className="td-page">
      <Link to="/teams" className="td-back-link">
        ← Back to My Teams
      </Link>

      <div className="td-header">
        <div>
          <span className="td-eyebrow">TEAM MANAGEMENT</span>
          <h1>{team.name}</h1>
          <p>
            {team.type === "event"
              ? team.eventName
              : "Independent Project Team"}
          </p>
        </div>

        <span className="td-created-status">Created by You</span>
      </div>

      {/* Team statistics */}
      <div className="td-stats">
        <div className="td-stat-card">
          <span>Maximum Capacity</span>
          <strong>{team.teamSize}</strong>
        </div>

        <div className="td-stat-card">
          <span>Accepted Members</span>
          <strong>{acceptedCount}</strong>
        </div>

        <div className="td-stat-card">
          <span>Available Slots</span>
          <strong>{availableSlots}</strong>
        </div>

        <div className="td-stat-card">
          <span>Pending Invitations</span>
          <strong>{pendingInvitations.length}</strong>
        </div>
      </div>

      <div className="td-content">

        {/* Team overview */}
        <section className="td-card">
          <h2>Team Overview</h2>

          <p>{team.description}</p>

          <h3>Required Skills</h3>

          <div className="td-skills">
            {team.skills.length > 0 ? (
              team.skills.map((skill, index) => (
                <span key={index}>{skill}</span>
              ))
            ) : (
              <p>No specific skills added.</p>
            )}
          </div>
        </section>

        {/* Accepted team members */}
        <section className="td-card">
          <h2>Team Members</h2>

          {team.members.map((member, index) => (
            <div className="td-member" key={index}>
              <div>
                <strong>{member.name}</strong>
                <span>{member.role || "Member"}</span>
              </div>

              <span className="td-accepted">
                Accepted
              </span>
            </div>
          ))}
        </section>

        {/* Pending invitations */}
        <section className="td-card">
          <h2>Pending Invitations</h2>

          {pendingInvitations.length > 0 ? (
            pendingInvitations.map((invitation) => (
              <div
                className="td-member"
                key={invitation.studentId}
              >
                <div>
                  <strong>{invitation.name}</strong>
                  <span>{invitation.department}</span>
                </div>

                <span className="td-pending">
                  Pending
                </span>
              </div>
            ))
          ) : (
            <p>No pending invitations.</p>
          )}
        </section>

        {/* Invite more students */}
        <section className="td-card td-invite-section">
          <h2>Invite More Students</h2>

          <p>
            Search for students and invite them to your team.
            Pending invitations do not reserve team capacity.
          </p>

          <div className="td-capacity-info">
            Available positions: <strong>{availableSlots}</strong>
          </div>

          {availableSlots > 0 ? (
            <>
              <input
                type="search"
                className="td-search"
                placeholder="Search by name, department or skill..."
                value={studentSearch}
                onChange={(event) =>
                  setStudentSearch(event.target.value)
                }
              />

              <div className="td-invite-list">
                {filteredStudents.filter((student) => {
                  const isMember = team.members.some(
                    (member) => member.studentId === student.id
                  );

                  const isPending = team.invitations.some(
                    (invitation) =>
                      invitation.studentId === student.id &&
                      invitation.status === "Pending"
                  );

                  return !isMember && !isPending;
                }).length > 0 ? (
                  filteredStudents.map((student) => {
                    const isMember = team.members.some(
                      (member) => member.studentId === student.id
                    );

                    const isPending = team.invitations.some(
                      (invitation) =>
                        invitation.studentId === student.id &&
                        invitation.status === "Pending"
                    );

                    if (isMember || isPending) return null;

                    return (
                      <div
                        className="td-invite-student"
                        key={student.id}
                      >
                        <div>
  <strong>{student.name}</strong>
  <span>{student.department}</span>

  <Link
    to={`/student/${student.id}`}
    state={{ from: `/teams/${team.id}` }}
    className="td-view-profile-link"
  >
    View Profile →
  </Link>
</div>

<button
  type="button"
  onClick={() => handleInvite(student)}
>
  Invite
</button>
                      </div>
                    );
                  })
                ) : (
                  <p>No eligible students found.</p>
                )}
              </div>
            </>
          ) : (
            <p>
              Your team is full. No more invitations can be sent.
            </p>
          )}

          {message && (
            <p className="td-message">{message}</p>
          )}
        </section>

      </div>
    </div>
  );
}

export default TeamDetails;
