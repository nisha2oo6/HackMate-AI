
import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { getAllStudents } from "../data/students";
import { CURRENT_STUDENT_ID } from "../data/currentStudent";
import "./TeamDetails.css";

// Normalize event names.
const cleanEventName = (name = "") =>
  name.trim().replace(/\s+/g, " ");

const normalizeEventName = (name) =>
  cleanEventName(name).toLowerCase().replace(/[^a-z0-9]/g, "");

const EVENT_ALIASES = {
  sih: "smartindiahackathon",
  smartindiahackathon: "smartindiahackathon",
};

const getCanonicalEventName = (name) => {
  const normalizedName = normalizeEventName(name);
  return EVENT_ALIASES[normalizedName] || normalizedName;
};

const getEventKey = (name, year) =>
  `${getCanonicalEventName(name)}-${String(year || "").trim()}`;

// Support newer records and older records with eventKey.
const getExistingTeamEventKey = (team) => {
  if (team.eventName) {
    return getEventKey(team.eventName, team.eventYear);
  }

  if (team.eventKey) {
    const separatorIndex = team.eventKey.lastIndexOf("-");

    if (separatorIndex === -1) return team.eventKey;

    return getEventKey(
      team.eventKey.slice(0, separatorIndex),
      team.eventKey.slice(separatorIndex + 1)
    );
  }

  return "";
};

// Check whether a student has already joined another team
// for the same event and year.
const isAlreadyInSameEventTeam = (
  teams,
  studentId,
  currentTeam
) => {
  if (currentTeam?.type !== "event") return false;

  const currentEventKey = getExistingTeamEventKey(currentTeam);

  if (!currentEventKey) return false;

  return teams.some((otherTeam) => {
    if (
      String(otherTeam.id) === String(currentTeam.id) ||
      otherTeam.type !== "event"
    ) {
      return false;
    }

    const sameEvent =
      getExistingTeamEventKey(otherTeam) === currentEventKey;

    const alreadyAccepted = (otherTeam.members || []).some(
      (member) =>
        Number(member.studentId) === Number(studentId) &&
        member.status?.toLowerCase() === "accepted"
    );

    return sameEvent && alreadyAccepted;
  });
};

const DESCRIPTION_SECTIONS = [
  {
    key: "overview",
    title: "Project / Event Overview",
  },
  {
    key: "problemStatement",
    title: "Problem Statement",
  },
  {
    key: "proposedSolution",
    title: "Proposed Solution",
  },
  {
    key: "expectedContribution",
    title: "Expected Contribution",
  },
  {
    key: "timeCommitment",
    title: "Time Commitment",
  },
];

function TeamDetails() {
  const { id } = useParams();
  const location = useLocation();

  const backPath = location.state?.from || "/teams";

  const backText =
    backPath === "/invitations"
      ? "← Back to Requests & Invitations"
      : "← Back to My Teams";

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

  const allStudents = getAllStudents();

  const savedTeams = JSON.parse(
    localStorage.getItem("hackmateTeams") || "[]"
  );

  const members = team?.members || [];
  const invitations = team?.invitations || [];

  // Identify the current student as the team leader.
  const isLeader = members.some(
    (member) =>
      Number(member.studentId) === Number(CURRENT_STUDENT_ID) &&
      member.role === "Leader" &&
      member.status === "Accepted"
  );

  const isMember = members.some(
    (member) =>
      Number(member.studentId) === Number(CURRENT_STUDENT_ID) &&
      member.status === "Accepted"
  );

  // Only accepted members count toward team capacity.
  const acceptedCount = members.filter(
    (member) => member.status === "Accepted"
  ).length;

  const availableSlots = team
    ? Math.max(0, team.teamSize - acceptedCount)
    : 0;

  const pendingInvitations = invitations.filter(
    (item) => item.status === "Pending"
  );

  // Search students by name, department or skill.
  const filteredStudents = allStudents.filter((student) => {
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

  // Exclude students who are not eligible for this team.
  const eligibleStudents = filteredStudents.filter((student) => {
    const isCurrentStudent =
      Number(student.id) === Number(CURRENT_STUDENT_ID);

    const isAlreadyMember = members.some(
      (member) =>
        Number(member.studentId) === Number(student.id)
    );

    const isAlreadyInvited = invitations.some(
      (invitation) =>
        Number(invitation.studentId) === Number(student.id) &&
        invitation.status === "Pending"
    );

    const isInAnotherSameEventTeam = isAlreadyInSameEventTeam(
      savedTeams,
      student.id,
      team
    );

    return (
      !isCurrentStudent &&
      !isAlreadyMember &&
      !isAlreadyInvited &&
      !isInAnotherSameEventTeam
    );
  });

  // Invite a student to the team.
  const handleInvite = (student) => {
    if (!isLeader || !team) return;

    // Always read the latest saved team data.
    const latestTeams = JSON.parse(
      localStorage.getItem("hackmateTeams") || "[]"
    );

    const latestTeam = latestTeams.find(
      (item) => String(item.id) === String(team.id)
    );

    if (!latestTeam) {
      setMessage("Team not found. Please refresh the page.");
      return;
    }

    const latestMembers = latestTeam.members || [];
    const latestInvitations = latestTeam.invitations || [];

    const latestAcceptedCount = latestMembers.filter(
      (member) => member.status === "Accepted"
    ).length;

    if (latestAcceptedCount >= latestTeam.teamSize) {
      setMessage("Your team has reached its maximum capacity.");
      return;
    }

    const alreadyMember = latestMembers.some(
      (member) =>
        Number(member.studentId) === Number(student.id)
    );

    const alreadyInvited = latestInvitations.some(
      (invitation) =>
        Number(invitation.studentId) === Number(student.id) &&
        invitation.status === "Pending"
    );

    // Recheck same-event membership immediately before inviting.
    const alreadyInSameEvent = isAlreadyInSameEventTeam(
      latestTeams,
      student.id,
      latestTeam
    );

    if (alreadyInSameEvent) {
      setMessage(
        `${student.name} has already joined another team for this event.`
      );
      return;
    }

    if (alreadyMember || alreadyInvited) {
      setMessage(
        "This student is already a member or has a pending invitation."
      );
      return;
    }

    const updatedTeam = {
      ...latestTeam,
      invitations: [
        ...latestInvitations,
        {
          id: Date.now(),
          studentId: student.id,
          name: student.name,
          department: student.department,
          status: "Pending",
        },
      ],
    };

    const updatedTeams = latestTeams.map((item) =>
      String(item.id) === String(latestTeam.id)
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

  return (
    <div className="td-page">
      <Link to={backPath} className="td-back-link">
        {backText}
      </Link>

      <div className="td-header">
        <div>
          <span className="td-eyebrow">TEAM MANAGEMENT</span>
          <h1>{team.name || "Untitled Team"}</h1>
          <p>
            {team.type === "event"
              ? team.eventName || "Event Team"
              : "Independent Project Team"}
            {team.type === "event" && team.eventYear
              ? ` · ${team.eventYear}`
              : ""}
          </p>
        </div>

        <span className="td-created-status">
          {isLeader
            ? "Team Leader"
            : isMember
              ? "Team Member"
              : "Team Details"}
        </span>
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
        {/* Team overview and detailed description */}
        <section className="td-card">
          <h2>Team Overview</h2>

          {team.descriptionDetails ? (
            <div className="td-description-details">
              {DESCRIPTION_SECTIONS.map((section) => {
                const value =
                  team.descriptionDetails[section.key];

                if (!value) return null;

                return (
                  <div
                    className="td-description-item"
                    key={section.key}
                  >
                    <h3>{section.title}</h3>
                    <p>{value}</p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="td-legacy-description">
              {team.description || "No team description provided."}
            </p>
          )}

          <h3>Required Skills</h3>

          <div className="td-skills">
            {team.skills?.length > 0 ? (
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

          {members
            .filter((member) => member.status === "Accepted")
            .map((member, index) => (
              <div
                className="td-member"
                key={member.studentId || index}
              >
                <div>
                  <strong>{member.name}</strong>
                  <span>{member.role || "Member"}</span>
                </div>

                <span className="td-accepted">Accepted</span>
              </div>
            ))}
        </section>

        {/* Pending invitations */}
        {isLeader && (
          <section className="td-card">
            <h2>Pending Invitations</h2>

            {pendingInvitations.length > 0 ? (
              pendingInvitations.map((invitation) => (
                <div
                  className="td-member"
                  key={invitation.id || invitation.studentId}
                >
                  <div>
                    <strong>{invitation.name}</strong>
                    <span>{invitation.department}</span>
                  </div>

                  <span className="td-pending">Pending</span>
                </div>
              ))
            ) : (
              <p>No pending invitations.</p>
            )}
          </section>
        )}

        {/* Invite more students - leader only */}
        {isLeader && (
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
                  {eligibleStudents.length > 0 ? (
                    eligibleStudents.map((student) => (
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
                    ))
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
              <p className="td-message" role="status">
                {message}
              </p>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

export default TeamDetails;
