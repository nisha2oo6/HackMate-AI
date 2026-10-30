import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import { students } from "./FindTeammates";
import "./StudentProfile.css";

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
  const student = students.find(
    (item) => item.id === Number(id)
  );

  if (!student) {
    return (
      <main className="student-profile-page">
        <div className="student-profile-container">
          <h2>Student Profile Not Found</h2>
          <p>This student profile is unavailable.</p>
          <Link to="/find-teammates">Back to Find Teammates</Link>
        </div>
      </main>
    );
  }

  const skills = student.skills || [];
  const interests = student.interests || [];
  const projects = student.projects || [];
  const experience = student.experience || [];
  const achievements = student.achievements || [];
  const certifications = student.certifications || [];

  const preferences = student.collaborationPreferences || [];

  const collaborationStatus =
    student.collaborationStatus ||
    student.availability ||
    "Status not specified";

  const collaborationDescription =
    student.collaboration?.lookingFor ||
    student.collaborationDescription ||
    "";

  const preferredAreas =
    student.collaboration?.preferredAreas ||
    preferences;

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

  const getDetailText = (item) => {
    if (typeof item === "string") return item;

    return (
      item?.description ||
      item?.title ||
      item?.name ||
      ""
    );
  };

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

        {/* Profile Header */}
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
                {student.section && (
                  <span>{student.section}</span>
                )}
              </div>

              <span className="profile-collaboration-status">
                <span className="profile-status-dot" />
                {collaborationStatus}
              </span>
            </div>
          </div>
        </header>

        {/* About Me */}
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
                {student.department}
              </span>
            </div>

            <div className="profile-detail-item">
              <span className="profile-detail-label">
                Academic Year
              </span>
              <span className="profile-detail-value">
                {student.year}
              </span>
            </div>

            <div className="profile-detail-item">
              <span className="profile-detail-label">
                Section
              </span>
              <span className="profile-detail-value">
                {student.section || "Not specified"}
              </span>
            </div>
          </div>
        </section>

        {/* Skills and Interests */}
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

        {/* Projects */}
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
                      <h3>{project.title}</h3>

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
                      {project.description}
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

                    {project.technologies?.length > 0 && (
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

        {/* Experience */}
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
                  key={index}
                >
                  <h3>
                    {item.title || getDetailText(item)}
                  </h3>

                  {item.organization && (
                    <p className="profile-experience-meta">
                      {item.organization}
                      {item.period ? ` · ${item.period}` : ""}
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

        {/* Achievements and Certifications */}
        <section className="profile-additional">

          <div className="profile-additional-group">
            <h2>Achievements and Recognition</h2>

            {achievements.length ? (
              <ul className="profile-achievement-list">
                {achievements.map((item, index) => (
                  <li key={index}>
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
                  key={index}
                >
                  <span className="profile-certification-name">
                    {item.name || getDetailText(item)}
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

        {/* Collaboration Preferences */}
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
                    key={index}
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

        {/* Social Links */}
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
