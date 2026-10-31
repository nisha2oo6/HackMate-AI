
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { students } from "./FindTeammates";
import "./CreateTeam.css";
import { CURRENT_STUDENT_ID } from "../data/currentStudent";

// Clean extra spaces while preserving the official name's capitalization.
const cleanEventName = (name) => {
  return name.trim().replace(/\s+/g, " ");
};

// Generate a consistent internal identity for event comparison.
const normalizeEventName = (name) => {
  return cleanEventName(name).toLowerCase().replace(/[^a-z0-9]/g, "");
};

// Map known event abbreviations and alternative names to one identity.
const EVENT_ALIASES = {
  sih: "smartindiahackathon",
  smartindiahackathon: "smartindiahackathon",
};

// Return the canonical event name used for comparison.
const getCanonicalEventName = (name) => {
  const normalizedName = normalizeEventName(name);
  return EVENT_ALIASES[normalizedName] || normalizedName;
};

// Generate a consistent event identity using its name and year.
const getEventKey = (name, year) => {
  return `${getCanonicalEventName(name)}-${year.trim()}`;
};

// Check whether a student is an accepted member of a team.
const isAcceptedMember = (team, studentId) => {
  return (team.members || []).some(
    (member) =>
      Number(member.studentId) === Number(studentId) &&
      member.status?.toLowerCase() === "accepted"
  );
};

// Get the event identity from an existing team.
// Supports both newer records and older records with only eventKey.
const getExistingTeamEventKey = (team) => {
  if (team.eventName) {
    return getEventKey(
      team.eventName,
      String(team.eventYear || "")
    );
  }

  if (team.eventKey) {
    const separatorIndex = team.eventKey.lastIndexOf("-");

    if (separatorIndex === -1) {
      return team.eventKey;
    }

    const existingName = team.eventKey.slice(0, separatorIndex);
    const existingYear = team.eventKey.slice(separatorIndex + 1);

    return getEventKey(existingName, existingYear);
  }

  return "";
};

function CreateTeam() {
  const [teamType, setTeamType] = useState("event");
  const [teamName, setTeamName] = useState("");
  const [eventName, setEventName] = useState("");
  const [eventYear, setEventYear] = useState("");
  const [description, setDescription] = useState("");
  const [requiredSkills, setRequiredSkills] = useState("");
  const [teamSize, setTeamSize] = useState("4");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [createdTeam, setCreatedTeam] = useState(null);
  const [showReview, setShowReview] = useState(false);
  const [error, setError] = useState("");
  const [copyMessage, setCopyMessage] = useState("");
  const [studentSearch, setStudentSearch] = useState("");

  // Reference to the error message for automatic scrolling.
  const errorRef = useRef(null);

  // Automatically scroll to the error message whenever an error occurs.
  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [error]);

  const maxMembers = Number(teamSize);
  const availableSlots = maxMembers - 1;

  const cleanedEventName = cleanEventName(eventName);
  const cleanedEventYear = eventYear.trim();

  // Search students by name, department, skills or interests.
  const filteredStudents = students.filter((student) => {
    const search = studentSearch.trim().toLowerCase();

    if (!search) return true;

    return (
      student.name.toLowerCase().includes(search) ||
      student.department.toLowerCase().includes(search) ||
      student.skills.some((skill) =>
        skill.toLowerCase().includes(search)
      ) ||
      (student.interests || []).some((interest) =>
        interest.toLowerCase().includes(search)
      )
    );
  });

  // Select or deselect teammates.
  const toggleMember = (studentId) => {
    setSelectedMembers((previous) => {
      if (previous.includes(studentId)) {
        setError("");
        return previous.filter((id) => id !== studentId);
      }

      if (previous.length >= availableSlots) {
        setError(
          `You can select only ${availableSlots} teammates for a team of ${maxMembers}.`
        );
        return previous;
      }

      setError("");
      return [...previous, studentId];
    });
  };

  // Create team.
  const handleCreateTeam = (event) => {
    event.preventDefault();

    if (!teamName.trim()) {
      setError("Please enter a team name.");
      return;
    }

    if (teamType === "event" && !cleanedEventName) {
      setError("Please enter the official event or hackathon name.");
      return;
    }

    if (teamType === "event" && !cleanedEventYear) {
      setError("Please enter the event year or edition.");
      return;
    }

    if (
      teamType === "event" &&
      (!/^\d{4}$/.test(cleanedEventYear) ||
        Number(cleanedEventYear) < 2000 ||
        Number(cleanedEventYear) > 2100)
    ) {
      setError("Please enter a valid event year between 2000 and 2100.");
      return;
    }

    if (!description.trim()) {
      setError("Please provide a short team description.");
      return;
    }

    // Read existing teams before creating a new one.
    const existingTeams = JSON.parse(
      localStorage.getItem("hackmateTeams") || "[]"
    );

    // Prevent the leader from creating another team
    // for an event they already belong to.
    if (teamType === "event") {
      const currentEventKey = getEventKey(
        cleanedEventName,
        cleanedEventYear
      );

      const alreadyInEventTeam = existingTeams.some((team) => {
        if (team.type !== "event") return false;

        const existingEventKey = getExistingTeamEventKey(team);

        return (
          existingEventKey === currentEventKey &&
          isAcceptedMember(team, CURRENT_STUDENT_ID)
        );
      });

      if (alreadyInEventTeam) {
        setError(
          `You are already a member of a team for ${cleanedEventName} — ${cleanedEventYear}. You cannot create another team for the same event edition.`
        );
        return;
      }
    }

    const inviteCode = Math.random().toString(36).substring(2, 10);

    const invitations = students
      .filter((student) => selectedMembers.includes(student.id))
      .map((student) => ({
        studentId: student.id,
        name: student.name,
        department: student.department,
        status: "Pending",
      }));

    const leader = students.find(
      (student) => student.id === CURRENT_STUDENT_ID
    );

    const team = {
      id: Date.now(),
      inviteCode,
      type: teamType,
      name: teamName.trim(),

      eventName:
        teamType === "event" ? cleanedEventName : "",

      eventYear:
        teamType === "event" ? cleanedEventYear : "",

      eventKey:
        teamType === "event"
          ? getEventKey(cleanedEventName, cleanedEventYear)
          : "",

      description: description.trim(),

      skills: requiredSkills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),

      teamSize: maxMembers,

      leader: leader?.name,

      members: [
        {
          studentId: CURRENT_STUDENT_ID,
          name: leader?.name,
          status: "Accepted",
          role: "Leader",
        },
      ],

      invitations,
    };

    // Save the created team in browser storage.
    localStorage.setItem(
      "hackmateTeams",
      JSON.stringify([...existingTeams, team])
    );

    setCreatedTeam(team);
    setShowReview(false);
    setCopyMessage("");
    setError("");
  };

  // Generate invitation link.
  const inviteLink = createdTeam
    ? `${window.location.origin}/join/team/${createdTeam.inviteCode}`
    : "";

  // Copy invitation link.
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopyMessage("Invitation link copied!");
    } catch {
      setCopyMessage(
        "Unable to copy the link. Please copy it manually."
      );
    }
  };

  // Team creation success screen.
  if (createdTeam && !showReview) {
    return (
      <div className="ct-page">
        <div className="ct-success-card">
          <div className="ct-success-icon">✓</div>

          <h1>Your Team Has Been Created!</h1>

          <p>
            Your team <strong>{createdTeam.name}</strong> has been set up.
            The selected students are listed as pending invitees.
          </p>

          <div className="ct-created-details">
            <div className="ct-summary-row">
              <span>Team Name</span>
              <strong>{createdTeam.name}</strong>
            </div>

            <div className="ct-summary-row">
              <span>Team Type</span>
              <strong>
                {createdTeam.type === "event"
                  ? "Event Team"
                  : "Project Team"}
              </strong>
            </div>

            {createdTeam.type === "event" && (
              <div className="ct-summary-row">
                <span>Event</span>
                <strong>
                  {createdTeam.eventName.toUpperCase()} — {createdTeam.eventYear}
                </strong>
              </div>
            )}

            <div className="ct-summary-row">
              <span>Team Capacity</span>
              <strong>{createdTeam.teamSize} members</strong>
            </div>

            <div className="ct-summary-row">
              <span>Pending Invitations</span>
              <strong>{createdTeam.invitations.length}</strong>
            </div>
          </div>

          <div className="ct-success-actions">
            <button
              type="button"
              className="ct-primary-button"
              onClick={() => setShowReview(true)}
            >
              Review Team
            </button>

            <button
              type="button"
              className="ct-secondary-button"
              onClick={() => {
                window.location.href = "/teams";
              }}
            >
              Go to My Teams
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Team review screen.
  if (createdTeam && showReview) {
    return (
      <div className="ct-page">
        <div className="ct-review-card">
          <div className="ct-review-header">
            <div>
              <span className="ct-preview-label">TEAM OVERVIEW</span>

              <h1>{createdTeam.name}</h1>

              <p>
                {createdTeam.type === "event"
                  ? `${createdTeam.eventName.toUpperCase()} — ${createdTeam.eventYear}`
                  : "Independent Project Team"}
              </p>
            </div>

            <span className="ct-status-accepted">Created</span>
          </div>

          <div className="ct-review-stats">
            <div>
              <strong>1</strong>
              <span>Accepted Members</span>
            </div>

            <div>
              <strong>{createdTeam.invitations.length}</strong>
              <span>Pending Invitations</span>
            </div>

            <div>
              <strong>{createdTeam.teamSize}</strong>
              <span>Maximum Capacity</span>
            </div>
          </div>

          <div className="ct-summary-section">
            <h3>Team Description</h3>
            <p>{createdTeam.description}</p>
          </div>

          <div className="ct-summary-section">
            <h3>Required Skills</h3>

            <div className="ct-tags">
              {createdTeam.skills.length > 0 ? (
                createdTeam.skills.map((skill, index) => (
                  <span className="ct-tag" key={index}>
                    {skill}
                  </span>
                ))
              ) : (
                <p>No specific skills added.</p>
              )}
            </div>
          </div>

          <div className="ct-summary-section">
            <h3>Pending Invitations</h3>

            {createdTeam.invitations.length > 0 ? (
              createdTeam.invitations.map((invitation) => (
                <div
                  className="ct-selected-member"
                  key={invitation.studentId}
                >
                  <div>
                    <strong>{invitation.name}</strong>
                    <small>{invitation.department}</small>
                  </div>

                  <span className="ct-status-pending">
                    {invitation.status}
                  </span>
                </div>
              ))
            ) : (
              <p>No invitations have been selected yet.</p>
            )}

            <p className="ct-review-note">
              Students become team members only after accepting their
              invitations. Pending invitations do not reserve team capacity.
            </p>
          </div>

          <div className="ct-summary-section">
            <h3>Share Team Invitation</h3>

            <p>
              Share this link with students you want to invite.
            </p>

            <div className="ct-invite-link-box">
              <input type="text" value={inviteLink} readOnly />

              <button type="button" onClick={handleCopyLink}>
                Copy Link
              </button>
            </div>

            {copyMessage && (
              <p className="ct-copy-message">{copyMessage}</p>
            )}
          </div>

          <button
            type="button"
            className="ct-secondary-button"
            onClick={() => setShowReview(false)}
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  // Main Create Team screen - Original two-column design.
  return (
    <div className="ct-page">
      <div className="ct-header">
        <span className="ct-eyebrow">BUILD YOUR TEAM</span>

        <h1>Create Your Team</h1>

        <p>
          Bring together the right people and turn your ideas into something
          meaningful.
        </p>

        {error && (
          <p className="ct-error" role="alert" ref={errorRef}>
            {error}
          </p>
        )}
      </div>

      <form className="ct-layout" onSubmit={handleCreateTeam}>
        {/* LEFT SIDE */}
        <div className="ct-main">
          {/* Team Information */}
          <section className="ct-section">
            <div className="ct-section-heading">
              <span className="ct-step">01</span>

              <div>
                <h2>Team Information</h2>
                <p>Start by telling us about your team and its goals.</p>
              </div>
            </div>

            <div className="ct-field">
              <label>Choose Your Team Type</label>

              <div className="ct-type-options">
                <button
                  type="button"
                  className={`ct-type-card ${
                    teamType === "event" ? "active" : ""
                  }`}
                  onClick={() => setTeamType("event")}
                >
                  <span className="ct-type-icon">🏆</span>

                  <strong>Event / Hackathon Team</strong>

                  <small>
                    Find teammates to participate in hackathons,
                    competitions and innovation events.
                  </small>

                  <span className="ct-radio-dot" />
                </button>

                <button
                  type="button"
                  className={`ct-type-card ${
                    teamType === "project" ? "active" : ""
                  }`}
                  onClick={() => setTeamType("project")}
                >
                  <span className="ct-type-icon">💡</span>

                  <strong>Independent Project Team</strong>

                  <small>
                    Build a team to work on your own project ideas
                    and long-term goals.
                  </small>

                  <span className="ct-radio-dot" />
                </button>
              </div>
            </div>

            <div className="ct-field">
              <label htmlFor="teamName">Team Name</label>

              <input
                id="teamName"
                type="text"
                placeholder="Enter your team name"
                value={teamName}
                onChange={(event) => setTeamName(event.target.value)}
              />
            </div>

            {teamType === "event" && (
              <>
                <div className="ct-field">
                  <label htmlFor="eventName">
                    Official Event / Hackathon Name
                  </label>

                  <input
                    id="eventName"
                    type="text"
                    placeholder="Example: Smart India Hackathon"
                    value={eventName}
                    onChange={(event) => setEventName(event.target.value)}
                  />

                  <small>
                    Enter the complete official event name with correct
                    spelling and spacing. Avoid abbreviations.
                  </small>
                </div>

                <div className="ct-field">
                  <label htmlFor="eventYear">
                    Event Year / Edition
                  </label>

                  <input
                    id="eventYear"
                    type="number"
                    min="2000"
                    max="2100"
                    placeholder="Example: 2026"
                    value={eventYear}
                    onChange={(event) => setEventYear(event.target.value)}
                  />

                  <small>
                    Enter the year of the event you are participating in.
                  </small>
                </div>
              </>
            )}

            <div className="ct-field">
              <label htmlFor="description">Team Description</label>

              <textarea
                id="description"
                placeholder="Describe your project idea or team goal..."
                rows="4"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>

            <div className="ct-field">
              <label htmlFor="requiredSkills">Required Skills</label>

              <input
                id="requiredSkills"
                type="text"
                placeholder="Example: Java, React, UI/UX, Python"
                value={requiredSkills}
                onChange={(event) => setRequiredSkills(event.target.value)}
              />

              <small>Separate skills using commas.</small>
            </div>

            <div className="ct-field ct-size-field">
              <label htmlFor="teamSize">Maximum Team Size</label>

              <select
                id="teamSize"
                value={teamSize}
                onChange={(event) => {
                  const newSize = Number(event.target.value);

                  setTeamSize(event.target.value);

                  if (selectedMembers.length > newSize - 1) {
                    setSelectedMembers((previous) =>
                      previous.slice(0, newSize - 1)
                    );
                  }

                  setError("");
                }}
              >
                {[2, 3, 4, 5, 6].map((size) => (
                  <option value={size} key={size}>
                    {size} Members
                  </option>
                ))}
              </select>

              <small>
                You are counted as the first member and team leader.
              </small>
            </div>
          </section>

          {/* Invite Teammates */}
          <section className="ct-section">
            <div className="ct-section-heading">
              <span className="ct-step">02</span>

              <div>
                <h2>Find Your Teammates</h2>
                <p>
                  Discover students, explore their skills and invite
                  the right people.
                </p>
              </div>
            </div>

            <div className="ct-invite-info">
              <span>ⓘ</span>

              <span>
                You can invite up to {availableSlots} students.
                Invitations remain pending until students accept.
              </span>
            </div>

            {/* Student Search */}
            <div className="ct-student-search">
              <input
                type="search"
                placeholder="Search by name, department or skill..."
                value={studentSearch}
                onChange={(event) => setStudentSearch(event.target.value)}
              />
            </div>

            {/* Student List */}
            <div className="ct-connection-list">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((member) => {
                  const selected = selectedMembers.includes(member.id);

                  return (
                    <div
                      className={`ct-connection ${
                        selected ? "selected" : ""
                      }`}
                      key={member.id}
                    >
                      <input
                        id={`member-${member.id}`}
                        type="checkbox"
                        checked={selected}
                        onChange={() => toggleMember(member.id)}
                        aria-label={`Select ${member.name} for your team`}
                      />

                      <span className="ct-avatar">
                        {member.initials}
                      </span>

                      <label
                        className="ct-member-info"
                        htmlFor={`member-${member.id}`}
                      >
                        <strong>{member.name}</strong>

                        <small>
                          {member.department} · {member.year}
                        </small>

                        <span className="ct-member-skills">
                          {member.skills.join(" · ")}
                        </span>
                      </label>

                      <Link
                        to={`/student/${member.id}`}
                        state={{ from: "/create-team" }}
                        className="ct-view-profile-link"
                      >
                        View Profile
                      </Link>

                      <span className="ct-select-label">
                        {selected ? "Selected" : "Select"}
                      </span>
                    </div>
                  );
                })
              ) : (
                <p className="ct-no-results">
                  No students found. Try another name, department or skill.
                </p>
              )}
            </div>
          </section>
        </div>

        {/* RIGHT SIDE - TEAM OVERVIEW */}
        <aside className="ct-sidebar">
          <div className="ct-preview-card">
            <span className="ct-preview-label">YOUR TEAM</span>

            <h3>{teamName.trim() || "Your Team Name"}</h3>

            <p>
              {teamType === "event"
                ? cleanedEventName
                  ? `${cleanedEventName.toUpperCase()}${
                      cleanedEventYear ? ` — ${cleanedEventYear}` : ""
                    }`
                  : "Event / Hackathon Team"
                : "Independent Project Team"}
            </p>

            <div className="ct-preview-divider" />

            <div className="ct-preview-item">
              <span>Team Type</span>
              <strong>
                {teamType === "event" ? "Event Team" : "Project Team"}
              </strong>
            </div>

            <div className="ct-preview-item">
              <span>Team Leader</span>
              <strong>You</strong>
            </div>

            <div className="ct-preview-item">
              <span>Maximum Capacity</span>
              <strong>{maxMembers} Members</strong>
            </div>

            <div className="ct-preview-item">
              <span>Selected Teammates</span>
              <strong>{selectedMembers.length}</strong>
            </div>

            <div className="ct-preview-divider" />

            <div className="ct-capacity">
              <div className="ct-capacity-heading">
                <span>Team Capacity</span>

                <strong>
                  {selectedMembers.length + 1}/{maxMembers}
                </strong>
              </div>

              <div className="ct-capacity-track">
                <div
                  className="ct-capacity-fill"
                  style={{
                    width: `${
                      ((selectedMembers.length + 1) / maxMembers) * 100
                    }%`,
                  }}
                />
              </div>

              <small>
                {availableSlots - selectedMembers.length} invitation
                {availableSlots - selectedMembers.length === 1 ? "" : "s"}{" "}
                available.
              </small>
            </div>

            <div className="ct-preview-divider" />

            <span className="ct-preview-label">INVITED STUDENTS</span>

            {selectedMembers.length > 0 ? (
              <div className="ct-selected-list">
                {students
                  .filter((student) => selectedMembers.includes(student.id))
                  .map((student) => (
                    <div className="ct-selected-member" key={student.id}>
                      <span className="ct-avatar">
                        {student.initials}
                      </span>

                      <div>
                        <strong>{student.name}</strong>
                        <small>{student.department}</small>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="ct-private-note">
                Your selected teammates will appear here.
              </p>
            )}

            <button
              type="submit"
              className="ct-primary-button"
            >
              Create Team & Send Invitations
            </button>

            <p className="ct-private-note">
              Selected students will receive invitations. They become
              members only after accepting.
            </p>
          </div>
        </aside>
      </form>
    </div>
  );
}

export default CreateTeam;
