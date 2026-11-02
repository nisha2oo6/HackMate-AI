
import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./FindTeammates.css";
import { getAllStudents } from "../data/students";
import { CURRENT_STUDENT_ID } from "../data/currentStudent";

function FindTeammates() {
  const location = useLocation();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] =
    useState("All Departments");
  const [selectedSkill, setSelectedSkill] = useState("All Skills");
  const [selectedAvailability, setSelectedAvailability] = useState("All");

  const [requestTarget, setRequestTarget] = useState(null);
  const [requestMessage, setRequestMessage] = useState("");
  const [confirmation, setConfirmation] = useState("");

  const departments = [
    "All Departments",
    "CSE",
    "IT",
    "AI & DS",
    "ECE",
  ];

  const allSkills = [
    "Java",
    "Spring Boot",
    "MySQL",
    "React",
    "JavaScript",
    "Python",
    "Machine Learning",
    "UI/UX",
    "Figma",
    "SQL",
    "IoT",
    "Arduino",
    "Testing",
    "HTML",
    "CSS",
  ];

  const filteredStudents = useMemo(() => {
    return getAllStudents().filter((student) => {
      if (student.id === Number(CURRENT_STUDENT_ID)) {
        return false;
      }

      const search = searchTerm.toLowerCase();

      const matchesSearch =
        student.name.toLowerCase().includes(search) ||
        student.department.toLowerCase().includes(search) ||
        student.bio.toLowerCase().includes(search) ||
        student.skills.some((skill) =>
          skill.toLowerCase().includes(search)
        ) ||
        student.interests.some((interest) =>
          interest.toLowerCase().includes(search)
        );

      const matchesDepartment =
        selectedDepartment === "All Departments" ||
        student.department === selectedDepartment;

      const matchesSkill =
        selectedSkill === "All Skills" ||
        student.skills.includes(selectedSkill);

      const availability = student.availability || "Open to teams";

      const matchesAvailability =
        selectedAvailability === "All" ||
        (selectedAvailability === "Open to teams"
          ? availability === "Open to teams"
          : availability === "Not looking currently");

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesSkill &&
        matchesAvailability
      );
    });
  }, [
    searchTerm,
    selectedDepartment,
    selectedSkill,
    selectedAvailability,
    location.key,
  ]);

  const openRequestModal = (student) => {
    setRequestTarget(student);
    setRequestMessage("");
    setConfirmation("");
  };

  const closeRequestModal = () => {
    setRequestTarget(null);
    setRequestMessage("");
  };

  const handleDemoRequest = () => {
    if (!requestTarget) return;

    setConfirmation(
      `Demo only: Your connection request to ${requestTarget.name} is ready. It has not been sent or saved.`
    );

    closeRequestModal();
  };

  return (
    <div className="fm-page">
      <div className="fm-header">
        <div>
          <p className="fm-eyebrow">BUILD YOUR NETWORK</p>
          <h1>Find Your Teammates</h1>
          <p>
            Discover students with the skills and interests that complement
            your ideas.
          </p>
        </div>
      </div>

      <div className="fm-tabs">
        <button className="fm-tab active" type="button">
          Discover Students
        </button>
      </div>

      {confirmation && (
        <div className="fm-demo-notice" role="status">
          {confirmation}
          <button
            type="button"
            onClick={() => setConfirmation("")}
            aria-label="Dismiss notification"
          >
            ×
          </button>
        </div>
      )}

      <div className="fm-filters">
        <div className="fm-search">
          <input
            type="text"
            placeholder="Search by name, department, skill or interest..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

        <div className="fm-filter-field">
          <select
            value={selectedDepartment}
            onChange={(event) => setSelectedDepartment(event.target.value)}
          >
            {departments.map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </select>
        </div>

        <div className="fm-filter-field">
          <select
            value={selectedSkill}
            onChange={(event) => setSelectedSkill(event.target.value)}
          >
            <option value="All Skills">All Skills</option>
            {allSkills.map((skill) => (
              <option key={skill} value={skill}>
                {skill}
              </option>
            ))}
          </select>
        </div>

        <div className="fm-filter-field">
          <select
            value={selectedAvailability}
            onChange={(event) => setSelectedAvailability(event.target.value)}
          >
            <option value="All">All Availability</option>
            <option value="Open to teams">Open to Team</option>
            <option value="Not looking">Not Looking Currently</option>
          </select>
        </div>

        {(searchTerm ||
          selectedDepartment !== "All Departments" ||
          selectedSkill !== "All Skills" ||
          selectedAvailability !== "All") && (
          <button
            className="fm-clear-button"
            onClick={() => {
              setSearchTerm("");
              setSelectedDepartment("All Departments");
              setSelectedSkill("All Skills");
              setSelectedAvailability("All");
            }}
          >
            Clear
          </button>
        )}
      </div>

      <div className="fm-results-heading">
        <h2>Students</h2>
        <span>{filteredStudents.length} profiles found</span>
      </div>

      <div className="fm-grid">
        {filteredStudents.map((student) => {
          const availability = student.availability || "Open to teams";
          const isOpenToTeam = availability === "Open to teams";

          return (
            <article className="fm-card" key={student.id}>
              <div className="fm-card-top">
                <div className="fm-avatar">{student.initials}</div>

                <span
                  className={
                    isOpenToTeam
                      ? "fm-status fm-status-open"
                      : "fm-status fm-status-busy"
                  }
                >
                  {isOpenToTeam
                    ? "Open to Team"
                    : "Not Looking Currently"}
                </span>
              </div>

              <h3>{student.name}</h3>

              <p className="fm-academic">
                {student.department} · {student.year} · Section{" "}
                {student.section}
              </p>

              <p className="fm-bio">{student.bio}</p>

              <div className="fm-card-section">
                <span className="fm-label">SKILLS</span>
                <div className="fm-tags">
                  {student.skills.map((skill) => (
                    <span className="fm-tag" key={skill}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="fm-card-section fm-interests">
                <span className="fm-label">INTERESTS</span>
                <div className="fm-tags">
                  {student.interests.slice(0, 3).map((interest) => (
                    <span className="fm-tag fm-interest-tag" key={interest}>
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              <div className="fm-card-actions">
                <Link
                  to={`/student/${student.id}`}
                  className="fm-view-button"
                >
                  View Profile
                </Link>

                <button
                  type="button"
                  className="fm-connect-button"
                  onClick={() => openRequestModal(student)}
                >
                  Connect +
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {filteredStudents.length === 0 && (
        <div className="fm-empty-state">
          <h3>No students found</h3>
          <p>Try changing your search or filters.</p>
        </div>
      )}

      {/* CONNECTION REQUEST DEMO MODAL */}
      {requestTarget && (
        <div
          className="fm-modal-overlay"
          onClick={closeRequestModal}
        >
          <div
            className="fm-modal fm-request-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="fm-modal-close"
              onClick={closeRequestModal}
            >
              ×
            </button>

            <h2>Send Connection Request</h2>

            <p>
              You're preparing a connection request to{" "}
              <strong>{requestTarget.name}</strong>.
            </p>

            <label
              className="fm-label"
              htmlFor="connection-message"
            >
              PERSONAL MESSAGE (OPTIONAL)
            </label>

            <textarea
              id="connection-message"
              className="fm-request-textarea"
              placeholder="Introduce yourself and tell them why you'd like to connect..."
              value={requestMessage}
              onChange={(event) => setRequestMessage(event.target.value)}
              maxLength={300}
              rows={4}
            />

            <p className="fm-character-count">
              {requestMessage.length}/300 characters
            </p>

            <p className="fm-demo-hint">
              Connection requests will be enabled when the backend is
              integrated. This is currently a frontend demonstration.
            </p>

            <div className="fm-request-modal-actions">
              <button
                type="button"
                className="fm-view-button"
                onClick={closeRequestModal}
              >
                Cancel
              </button>

              <button
                type="button"
                className="fm-connect-button"
                onClick={handleDemoRequest}
              >
                Preview Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FindTeammates;
