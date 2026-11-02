
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import { getStudentById } from "../data/students";
import "./StudentProfile.css";

// Read accepted team memberships from Local Storage.
function getStudentTeamParticipation(studentId) {
  try {
    const savedTeams = JSON.parse(
      localStorage.getItem("hackmateTeams") || "[]"
    );

    if (!Array.isArray(savedTeams)) return [];

    return savedTeams
      .filter((team) => {
        const members = Array.isArray(team.members) ? team.members : [];

        return members.some(
          (member) =>
            String(member.studentId) === String(studentId) &&
            String(member.status || "").toLowerCase() === "accepted"
        );
      })
      .map((team) => {
        const members = Array.isArray(team.members) ? team.members : [];

        const member = members.find(
          (item) =>
            String(item.studentId) === String(studentId) &&
            String(item.status || "").toLowerCase() === "accepted"
        );

        const teamType = String(team.type || "").toLowerCase();

        const isEventTeam =
          teamType === "event" ||
          teamType === "hackathon" ||
          Boolean(team.eventName);

        return {
          id: team.id || team.teamId || team.name,
          teamName: team.name || "Unnamed Team",
          category: isEventTeam ? "Event Team" : "Independent Project",
          eventName: team.eventName || "",
          eventYear: team.eventYear || "",
          projectName: team.projectName || team.projectTitle || "",
          role: member?.role || "Member",
          description: team.description || "",
        };
      });
  } catch (error) {
    console.error("Unable to read team participation:", error);
    return [];
  }
}

// Safely extract readable text from achievement or experience entries.
function getDetailText(item) {
  if (typeof item === "string") return item;

  return (
    item?.description ||
    item?.title ||
    item?.name ||
    ""
  );
}

// Normalize experience entries to the format used by the profile UI.
function prepareExperience(experience) {
  if (!Array.isArray(experience)) return [];

  return experience.map((item) =>
    typeof item === "string"
      ? {
          title: item,
          organization: "Independent Learning",
          period: "Ongoing",
          description: item,
        }
      : {
          title: item.title || item.name || "",
          organization: item.organization || "",
          period: item.period || "",
          description: item.description || "",
        }
  );
}

// Normalize project entries from shared student data.
function prepareProjects(projects) {
  if (!Array.isArray(projects)) return [];

  return projects.map((project) => ({
    ...project,
    title: project.title || project.name || "",
    status: project.status || "Planned",
    technologies: Array.isArray(project.technologies)
      ? project.technologies
      : [],
  }));
}

// Normalize certification entries.
function prepareCertifications(certifications) {
  if (!Array.isArray(certifications)) return [];

  return certifications.map((item) =>
    typeof item === "string"
      ? { name: item, issuer: "" }
      : {
          name: item.name || item.title || "",
          issuer: item.issuer || "",
        }
  );
}

function StudentPublicProfile() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.state?.idx > 0) {
      navigate(-1);
    } else {
      navigate(location.state?.from || "/find-teammates");
    }
  };

  // getStudentById includes saved profile changes.
  const student = getStudentById(Number(id));

  if (!student) {
    return (
      <main className="student-profile-page">
        <div className="student-profile-container">
          <h2>Student Profile Not Found</h2>
          <p>This student profile is unavailable.</p>
          <Link to="/find-teammates">
            Back to Find Teammates
          </Link>
        </div>
      </main>
    );
  }

  // Prepare shared student information.
  const skills = Array.isArray(student.skills) ? student.skills : [];
  const interests = Array.isArray(student.interests)
    ? student.interests
    : [];

  const projects = prepareProjects(student.projects);
  const experience = prepareExperience(student.experience);

  const achievements = Array.isArray(student.achievements)
    ? student.achievements
    : [];

  const certifications = prepareCertifications(student.certifications);

  // Use the same collaboration structure as StudentProfile.jsx.
  const collaboration = student.collaboration || {};

  const collaborationDescription =
    collaboration.lookingFor ||
    student.collaborationDescription ||
    "";

  const preferredAreas = Array.isArray(collaboration.preferredAreas)
    ? collaboration.preferredAreas
    : Array.isArray(student.collaborationPreferences)
      ? student.collaborationPreferences
      : [];

  // Only accepted team memberships are displayed.
  const teamParticipation = getStudentTeamParticipation(student.id);

  const section = student.section
    ? String(student.section).startsWith("Section ")
      ? student.section
      : `Section ${student.section}`
    : "";

  const renderAvatar = () => (
    <div className="profile-avatar">
      {student.profileImage ? (
        <img src={student.profileImage} alt={student.name} />
      ) : (
        <span>
          {student.initials ||
            student.name?.trim()?.charAt(0).toUpperCase() ||
            "?"}
        </span>
      )}
    </div>
  );

  return (
    <main className="student-profile-page">
      <div className="student-profile-container">

        {/* Back navigation */}
        <button
          type="button"
          onClick={handleBack}
          className="public-profile-back-link"
        >
          ← Go Back
        </button>

        {/* 01. Profile Header */}
        <header className="profile-intro">
          <div className="profile-identity">
            {renderAvatar()}

            <div className="profile-identity-details">
              <span className="profile-eyebrow">
                STUDENT PROFILE
              </span>

              <h1>{student.name}</h1>

              <p className="profile-academic-details">
                {student.department}
                <span>·</span>
                {student.year}
              </p>

              <div className="profile-extra-details">
  {section && <span>{section}</span>}

  <span className="profile-availability-status">
    {student.availability === "Not looking currently"
      ? "Not Looking Currently"
      : "Open to Team"}
  </span>
</div>
            </div>
          </div>
        </header>

        {/* 02. About Me */}
        <section className="profile-about">
          <h2 className="profile-section-heading">
            About Me
          </h2>

          <p>
            {student.bio || "No introduction added yet."}
          </p>

          <div className="profile-detail-line">
            <div className="profile-detail-item">
              <span className="profile-detail-label">
                Department
              </span>
              <span className="profile-detail-value">
                {student.department || "Not specified"}
              </span>
            </div>

            <div className="profile-detail-item">
              <span className="profile-detail-label">
                Academic Year
              </span>
              <span className="profile-detail-value">
                {student.year || "Not specified"}
              </span>
            </div>

            <div className="profile-detail-item">
              <span className="profile-detail-label">
                Section
              </span>
              <span className="profile-detail-value">
                {section || "Not specified"}
              </span>
            </div>
          </div>
        </section>

        {/* 03. Technical Skills and Areas of Interest */}
        <section className="profile-capabilities">
          <div className="profile-capability-group">
            <span className="profile-label">
              TECHNICAL SKILLS
            </span>

            <div className="profile-tags">
              {skills.length ? (
                skills.map((skill, index) => (
                  <span
                    className="profile-tag"
                    key={`${skill}-${index}`}
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p>No skills added yet.</p>
              )}
            </div>
          </div>

          <div className="profile-capability-group">
            <span className="profile-label">
              AREAS OF INTEREST
            </span>

            <div className="profile-tags">
              {interests.length ? (
                interests.map((interest, index) => (
                  <span
                    className="profile-tag profile-interest-tag"
                    key={`${interest}-${index}`}
                  >
                    {interest}
                  </span>
                ))
              ) : (
                <p>No interests added yet.</p>
              )}
            </div>
          </div>
        </section>

        {/* 04. Projects */}
        <section className="profile-projects">
          <div className="profile-heading">
            <div>
              <span className="profile-eyebrow">
                WORK AND CONTRIBUTIONS
              </span>
              <h2>Projects</h2>
            </div>

            <span className="profile-project-count">
              {String(projects.length).padStart(2, "0")} projects
            </span>
          </div>

          <div className="profile-project-list">
            {projects.length ? (
              projects.map((project, index) => (
                <article
                  className="profile-project"
                  key={`${project.title}-${index}`}
                >
                  <div className="profile-project-index">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div className="profile-project-content">
                    <div className="profile-project-heading">
                      <h3>{project.title || "Untitled Project"}</h3>

                      {project.status && (
                        <span
                          className={`profile-project-status ${
                            project.status.toLowerCase().replaceAll(" ", "-")
                          }`}
                        >
                          <span className="project-status-dot" />
                          {project.status}
                        </span>
                      )}
                    </div>

                    <p className="profile-project-description">
                      {project.description || "No project description added yet."}
                    </p>

                    {project.role && (
                      <p className="profile-project-role">
                        <strong>Role:</strong> {project.role}
                      </p>
                    )}

                    {project.contribution && (
                      <p className="profile-project-description">
                        <strong>Contribution:</strong>{" "}
                        {project.contribution}
                      </p>
                    )}

                    {project.technologies.length > 0 && (
                      <div className="profile-tags">
                        {project.technologies.map(
                          (technology, techIndex) => (
                            <span
                              className="profile-technology"
                              key={`${technology}-${techIndex}`}
                            >
                              {technology}
                            </span>
                          )
                        )}
                      </div>
                    )}
                  </div>
                </article>
              ))
            ) : (
              <p>No projects added yet.</p>
            )}
          </div>
        </section>

        {/* 05. Experience */}
        <section className="profile-experience">
          <div className="profile-heading">
            <div>
              <span className="profile-eyebrow">
                LEARNING AND EXPERIENCE
              </span>
              <h2>Experience</h2>
            </div>
          </div>

          <div className="profile-experience-list">
            {experience.length ? (
              experience.map((item, index) => (
                <article
                  className="profile-experience-item"
                  key={`${item.title}-${index}`}
                >
                  <h3>{item.title || "Experience"}</h3>

                  {(item.organization || item.period) && (
                    <p className="profile-experience-meta">
                      {item.organization}
                      {item.organization && item.period ? " · " : ""}
                      {item.period}
                    </p>
                  )}

                  {item.description && (
                    <p className="profile-experience-description">
                      {item.description}
                    </p>
                  )}
                </article>
              ))
            ) : (
              <p>No experience added yet.</p>
            )}
          </div>
        </section>

        {/* 06. Achievements and Certifications */}
        <section className="profile-additional">
          <div className="profile-additional-group">
            <h2>Achievements and Recognition</h2>

            {achievements.length ? (
              <ul className="profile-achievement-list">
                {achievements.map((item, index) => (
                  <li key={`achievement-${index}`}>
                    {getDetailText(item)}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No achievements added yet.</p>
            )}
          </div>

          <div className="profile-additional-group">
            <h2>Certifications</h2>

            {certifications.length ? (
              certifications.map((item, index) => (
                <div
                  className="profile-certification-item"
                  key={`certification-${index}`}
                >
                  <span className="profile-certification-name">
                    {item.name}
                  </span>

                  {item.issuer && (
                    <span className="profile-certification-issuer">
                      {item.issuer}
                    </span>
                  )}
                </div>
              ))
            ) : (
              <p>No certifications added yet.</p>
            )}
          </div>
        </section>

        {/* 07. Collaboration Preferences */}
        <section className="profile-collaboration">
          <span className="profile-eyebrow">
            TEAM COMPATIBILITY
          </span>

          <h2 className="profile-section-heading">
            What I'm Looking For
          </h2>

          <p>
            {collaborationDescription ||
              "Collaboration information has not been added yet."}
          </p>

          <div className="profile-capability-group">
            <span className="profile-label">
              PREFERRED COLLABORATION AREAS
            </span>

            <div className="profile-tags">
              {preferredAreas.length ? (
                preferredAreas.map((area, index) => (
                  <span
                    className="profile-tag"
                    key={`area-${index}`}
                  >
                    {typeof area === "string" ? area : getDetailText(area)}
                  </span>
                ))
              ) : (
                <p>No preferences added yet.</p>
              )}
            </div>
          </div>
        </section>

        {/* 08. Current Team Participation */}
        <section className="profile-team-participation">
          <div className="profile-heading">
            <div>
              <span className="profile-eyebrow">
                CURRENT COLLABORATIONS
              </span>
              <h2>Team Participation</h2>
            </div>

            <span className="profile-project-count">
              {String(teamParticipation.length).padStart(2, "0")} teams
            </span>
          </div>

          {teamParticipation.length > 0 ? (
            <div className="profile-team-list">
              {teamParticipation.map((team, index) => (
                <article
                  className="profile-team-card"
                  key={`${team.id}-${index}`}
                >
                  <div className="profile-team-index">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div className="profile-team-content">
                    <div className="profile-team-heading">
                      <h3>{team.teamName}</h3>

                      <span className="profile-team-role">
                        {team.role}
                      </span>
                    </div>

                    <p className="profile-team-category">
                      {team.category}
                    </p>

                    {team.category === "Event Team" ? (
                      <p className="profile-team-detail">
                        <strong>Event:</strong>{" "}
                        {team.eventName || "Event name not specified"}
                        {team.eventYear && ` · ${team.eventYear}`}
                      </p>
                    ) : (
                      <p className="profile-team-detail">
                        <strong>Project:</strong>{" "}
                        {team.projectName || team.teamName}
                      </p>
                    )}

                    {team.description && (
                      <p className="profile-team-description">
                        {team.description}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="profile-team-empty">
              <p>No current team participation.</p>
              <span>
                This student has not joined any team yet.
              </span>
            </div>
          )}
        </section>

        {/* 09. Social Links */}
        <footer className="profile-footer">
          <div className="profile-footer-copy">
            <span className="profile-eyebrow">
              CONNECT AND COLLABORATE
            </span>

            <p>
              Explore this student's work and connect for future projects.
            </p>
          </div>

          <div className="profile-footer-links">
            {student.github && (
              <a
                href={student.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub <span>↗</span>
              </a>
            )}

            {student.linkedin && (
              <a
                href={student.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn <span>↗</span>
              </a>
            )}

            {student.portfolio && (
              <a
                href={student.portfolio}
                target="_blank"
                rel="noopener noreferrer"
              >
                Portfolio <span>↗</span>
              </a>
            )}
          </div>
        </footer>

      </div>
    </main>
  );
}

export default StudentPublicProfile;
