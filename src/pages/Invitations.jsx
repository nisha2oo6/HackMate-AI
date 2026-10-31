
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CURRENT_STUDENT_ID } from "../data/currentStudent";
import "./Invitations.css";

// Normalize event names consistently.
const normalizeEventName = (name) => {
  return (name || "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
};

// Get an event's identity.
// The fallback supports older teams that do not have eventKey saved.
const getEventKey = (team) => {
  if (team.type !== "event") return "";

  if (team.eventKey) {
    return team.eventKey;
  }

  const eventName = normalizeEventName(team.eventName);
  const eventYear = String(team.eventYear || "").trim();

  if (!eventName || !eventYear) return "";

  return `${eventName}-${eventYear}`;
};

function Invitations() {
  const [teams, setTeams] = useState([]);
  const [message, setMessage] = useState("");

  // Load saved team invitations.
  useEffect(() => {
    const savedTeams = JSON.parse(
      localStorage.getItem("hackmateTeams") || "[]"
    );

    setTeams(savedTeams);
  }, []);

  // Find invitations addressed to the current student.
  const myInvitations = teams.flatMap((team) =>
    (team.invitations || [])
      .filter(
        (invitation) =>
          String(invitation.studentId) === String(CURRENT_STUDENT_ID) &&
          invitation.status === "Pending"
      )
      .map((invitation) => ({
        ...invitation,
        teamId: team.id,
        teamName: team.name,
        teamType: team.type,
        eventName: team.eventName,
        eventYear: team.eventYear,
        eventKey: getEventKey(team),
        description: team.description,
        teamSize: team.teamSize,
        acceptedCount: (team.members || []).filter(
          (member) => member.status === "Accepted"
        ).length,
        leader:
          team.leader ||
          team.members?.find((member) => member.role === "Leader")?.name ||
          "Team Leader",
      }))
  );

  // Save updated teams to localStorage and refresh page data.
  const saveTeams = (updatedTeams) => {
    localStorage.setItem(
      "hackmateTeams",
      JSON.stringify(updatedTeams)
    );

    setTeams(updatedTeams);
  };

  // Accept an invitation.
  const handleAccept = (teamId, invitationId) => {
    const savedTeams = JSON.parse(
      localStorage.getItem("hackmateTeams") || "[]"
    );

    const targetTeam = savedTeams.find(
      (team) => String(team.id) === String(teamId)
    );

    if (!targetTeam) {
      setMessage("This team is no longer available.");
      return;
    }

    const invitation = (targetTeam.invitations || []).find(
      (item) =>
        String(item.id) === String(invitationId) &&
        String(item.studentId) === String(CURRENT_STUDENT_ID) &&
        item.status === "Pending"
    );

    if (!invitation) {
      setMessage("This invitation is no longer available.");
      return;
    }

    const targetMembers = targetTeam.members || [];

    // Prevent duplicate membership in the same team.
    const alreadyMember = targetMembers.some(
      (member) =>
        String(member.studentId) === String(CURRENT_STUDENT_ID) &&
        member.status === "Accepted"
    );

    if (alreadyMember) {
      const updatedTeams = savedTeams.map((team) => {
        if (String(team.id) !== String(teamId)) return team;

        return {
          ...team,
          invitations: (team.invitations || []).map((item) =>
            String(item.studentId) === String(CURRENT_STUDENT_ID) &&
            item.status === "Pending"
              ? { ...item, status: "Expired" }
              : item
          ),
        };
      });

      saveTeams(updatedTeams);
      setMessage("You are already a member of this team.");
      return;
    }

    // Prevent joining or leading another team for the same event.
    if (targetTeam.type === "event") {
      const targetEventKey = getEventKey(targetTeam);

      const existingEventTeam = savedTeams.find((team) => {
        if (String(team.id) === String(teamId)) return false;

        if (team.type !== "event") return false;

        const sameEvent = getEventKey(team) === targetEventKey;

        const alreadyParticipating = (team.members || []).some(
          (member) =>
            String(member.studentId) === String(CURRENT_STUDENT_ID) &&
            member.status === "Accepted"
        );

        return (
          targetEventKey &&
          sameEvent &&
          alreadyParticipating
        );
      });

      if (existingEventTeam) {
        setMessage(
          `You are already part of another team for ${targetTeam.eventName} — ${targetTeam.eventYear}. You cannot join or lead a second team for the same event.`
        );
        return;
      }
    }

    const acceptedCount = targetMembers.filter(
      (member) => member.status === "Accepted"
    ).length;

    const capacity = Number(targetTeam.teamSize);

    // Check team capacity before accepting.
    if (acceptedCount >= capacity) {
      const updatedTeams = savedTeams.map((team) => {
        if (String(team.id) !== String(teamId)) return team;

        return {
          ...team,
          invitations: (team.invitations || []).map((item) =>
            item.status === "Pending"
              ? { ...item, status: "Expired" }
              : item
          ),
        };
      });

      saveTeams(updatedTeams);
      setMessage(
        "This team is already full. The invitation has expired."
      );
      return;
    }

    // Accept the selected invitation.
    const updatedTeams = savedTeams.map((team) => {
      if (String(team.id) !== String(teamId)) return team;

      const updatedInvitations = (team.invitations || []).map((item) => {
        if (String(item.id) === String(invitationId)) {
          return { ...item, status: "Accepted" };
        }

        return item;
      });

      const updatedMembers = [
        ...(team.members || []),
        {
          studentId: CURRENT_STUDENT_ID,
          name: invitation.name,
          department: invitation.department,
          status: "Accepted",
          role: "Member",
        },
      ];

      const newAcceptedCount = updatedMembers.filter(
        (member) => member.status === "Accepted"
      ).length;

      // If the team becomes full, expire all remaining pending invitations.
      const finalInvitations =
        newAcceptedCount >= capacity
          ? updatedInvitations.map((item) =>
              item.status === "Pending"
                ? { ...item, status: "Expired" }
                : item
            )
          : updatedInvitations;

      return {
        ...team,
        members: updatedMembers,
        invitations: finalInvitations,
      };
    });

    saveTeams(updatedTeams);

    setMessage(
      acceptedCount + 1 >= capacity
        ? "Invitation accepted! Your team is now full."
        : "Invitation accepted! You have joined the team."
    );
  };

  // Decline an invitation.
  const handleDecline = (teamId, invitationId) => {
    const savedTeams = JSON.parse(
      localStorage.getItem("hackmateTeams") || "[]"
    );

    let declined = false;

    const updatedTeams = savedTeams.map((team) => {
      if (String(team.id) !== String(teamId)) {
        return team;
      }

      const updatedInvitations = (team.invitations || []).map(
        (invitation) => {
          if (
            String(invitation.id) === String(invitationId) &&
            String(invitation.studentId) === String(CURRENT_STUDENT_ID) &&
            invitation.status === "Pending"
          ) {
            declined = true;
            return { ...invitation, status: "Declined" };
          }

          return invitation;
        }
      );

      return {
        ...team,
        invitations: updatedInvitations,
      };
    });

    saveTeams(updatedTeams);

    setMessage(
      declined
        ? "Invitation declined."
        : "This invitation is no longer available."
    );
  };

  return (
    <div className="inv-page">
      <div className="inv-header">
        <span className="inv-eyebrow">YOUR WORKSPACE</span>

        <h1>Requests & Invitations</h1>

        <p>
          View and manage invitations from students who want you
          to join their project teams and hackathon teams.
        </p>
      </div>

      {message && (
        <div className="inv-message">
          {message}
        </div>
      )}

      <section className="inv-section">
        <div className="inv-section-heading">
          <div>
            <h2>Team Invitations</h2>

            <p>
              Invitations from students who want you to join
              their teams.
            </p>
          </div>

          <span className="inv-count">
            {myInvitations.length} Pending
          </span>
        </div>

        {myInvitations.length > 0 ? (
          <div className="inv-list">
            {myInvitations.map((invitation) => (
              <div
                className="inv-card"
                key={`${invitation.teamId}-${invitation.id}`}
              >
                <div className="inv-card-top">
                  <span className="inv-team-type">
                    {invitation.teamType === "event"
                      ? "🏆 Event Team"
                      : "💡 Project Team"}
                  </span>

                  <span className="inv-pending">
                    Pending
                  </span>
                </div>

                <h3>{invitation.teamName}</h3>

                <p className="inv-event-name">
                  {invitation.teamType === "event"
                    ? `${invitation.eventName?.toUpperCase() || ""} — ${
                        invitation.eventYear || ""
                      }`
                    : "Independent Project"}
                </p>

                <p className="inv-description">
                  {invitation.description}
                </p>

                <div className="inv-details">
                  <span>
                    Invited by: <strong>{invitation.leader}</strong>
                  </span>

                  <span>
                    Team members:{" "}
                    <strong>
                      {invitation.acceptedCount} / {invitation.teamSize}
                    </strong>
                  </span>
                </div>

                <div className="inv-actions">
                  <Link
                    to={`/teams/${invitation.teamId}`}
                    state={{ from: "/invitations" }}
                    className="inv-view-button"
                  >
                    View Team
                  </Link>

                  <button
                    type="button"
                    className="inv-decline-button"
                    onClick={() =>
                      handleDecline(
                        invitation.teamId,
                        invitation.id
                      )
                    }
                  >
                    Decline
                  </button>

                  <button
                    type="button"
                    className="inv-accept-button"
                    onClick={() =>
                      handleAccept(
                        invitation.teamId,
                        invitation.id
                      )
                    }
                  >
                    Accept Invitation
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="inv-empty">
            <div className="inv-empty-icon">✉️</div>

            <h3>No pending team invitations</h3>

            <p>
              When another student invites you to join a team,
              the invitation will appear here.
            </p>

            <Link
              to="/find-teammates"
              className="inv-find-button"
            >
              Find Teammates
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}

export default Invitations;
