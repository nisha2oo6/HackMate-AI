
import "./StudentProfile.css";
import { useState } from "react";
import {
  getStudentById,
  saveStudentProfile,
} from "../data/students";
import { CURRENT_STUDENT_ID } from "../data/currentStudent";
import { Link } from "react-router-dom";
import { DEPARTMENTS } from "../data/departments";
// Get the student's accepted team participations from Local Storage.
function getStudentTeamParticipation(studentId) {
  try {
    const savedTeams = JSON.parse(
      localStorage.getItem("hackmateTeams") || "[]"
    );

    if (!Array.isArray(savedTeams)) return [];

    return savedTeams
      .filter(
        (team) =>
          Array.isArray(team.members) &&
          team.members.some(
            (member) =>
              String(member.studentId) === String(studentId) &&
              String(member.status || "").toLowerCase() === "accepted"
          )
      )
      .map((team) => {
        const member = team.members.find(
          (item) =>
            String(item.studentId) === String(studentId) &&
            String(item.status || "").toLowerCase() === "accepted"
        );

        const isEventTeam =
          team.type === "event" || team.type === "hackathon";

        return {
          id: team.id,
          teamName: team.name || "Unnamed Team",
          type: isEventTeam ? "Event Team" : "Independent Project",
          eventName: team.eventName || "",
          eventYear: team.eventYear || "",
          projectName: team.projectName || team.name || "",
          description: team.description || "",
          role: member?.role || "Member",
        };
      });
  } catch (error) {
    console.error("Unable to load team participation:", error);
    return [];
  }
}

// Convert shared student data into the format used by the profile UI.
function prepareStudentProfile(student) {
  return {
    profileImage: student.profileImage || "",
    name: student.name || "",
    department: student.department || "",
    year: student.year || "",
    section: student.section?.startsWith("Section ")
      ? student.section
      : `Section ${student.section || ""}`,

    bio: student.bio || "",
    availability: student.availability || "Open to teams",
    skills: Array.isArray(student.skills) ? student.skills : [],
    interests: Array.isArray(student.interests)
      ? student.interests
      : [],

    // Projects are displayed here only.
    // Full project management happens in My Projects.
    projects: (student.projects || []).map((project) => ({
      ...project,
      title: project.title || project.name || "",
      status: project.status || "Planned",
    })),

    experience: (student.experience || []).map((item) =>
      typeof item === "string"
        ? {
            title: item,
            organization: "Independent Learning",
            period: "Ongoing",
            description: item,
          }
        : {
            title: item.title || "",
            organization: item.organization || "",
            period: item.period || "",
            description: item.description || "",
          }
    ),

    achievements: Array.isArray(student.achievements)
      ? student.achievements
      : [],

    certifications: (student.certifications || []).map((item) =>
      typeof item === "string"
        ? { name: item, issuer: "" }
        : item
    ),

    collaboration: student.collaboration || {
      lookingFor:
        "I enjoy working with teammates who share ideas, communicate openly, and contribute consistently toward building useful projects.",
      preferredAreas: student.collaborationPreferences || [],
    },

    github: student.github || "",
    linkedin: student.linkedin || "",
    portfolio: student.portfolio || "",
  };
}

// Arun's original detailed sample profile.
// Shared student data takes priority over these defaults.
const ARUN_DEFAULT_PROFILE = {
  profileImage: "",
  name: "Arun Kumar",
  department: "CSE",
  year: "3rd Year",
  section: "Section A",

  bio: "Backend developer interested in building scalable applications and solving real-world problems.",

  skills: [
    "Java",
    "Spring Boot",
    "MySQL",
    "REST API",
  ],

  interests: [
    "Web Development",
    "Hackathons",
    "Problem Solving",
  ],

  projects: [
    {
      title: "Campus Connect",
      description:
        "A student-focused platform designed to help students discover opportunities, connect with peers, and collaborate on projects.",
      role: "Full-Stack Developer",
      contribution:
        "Working on the user interface, page navigation, reusable React components, and planned frontend-backend integration.",
      technologies: ["React", "Java", "MySQL"],
      status: "In Progress",
    },
    {
      title: "Smart Task Planner",
      description:
        "A task management application designed to organize academic assignments, track priorities, and monitor progress.",
      role: "Backend Developer",
      contribution:
        "Worked on the proposed data structure for tasks, task statuses, and the information required to manage task records.",
      technologies: ["Java", "MySQL"],
      status: "Completed",
    },
  ],

  experience: [
    {
      title: "Academic and Personal Development",
      organization: "Independent Learning",
      period: "Ongoing",
      description:
        "Developing programming fundamentals, practicing data structures and algorithms, and learning to build maintainable applications. Current learning areas include Java, React, database concepts, and version control.",
    },
  ],

  achievements: [],

  certifications: [],

  collaboration: {
    lookingFor:
      "I enjoy working with teammates who share ideas, communicate openly, and contribute consistently toward building useful projects.",
    preferredAreas: [
      "Web Development",
      "AI & ML",
      "Backend Development",
    ],
  },

  github: "",
  linkedin: "",
  portfolio: "",
};

// Load the currently selected student's profile.
// getStudentById already merges saved profile information.
function getInitialStudentProfile() {
  const studentId = Number(CURRENT_STUDENT_ID);
  const sharedStudent = getStudentById(studentId);

  if (!sharedStudent) {
    console.error("Student profile not found:", studentId);
    return ARUN_DEFAULT_PROFILE;
  }

  const preparedProfile = prepareStudentProfile(sharedStudent);

  if (studentId === 1) {
    return {
      ...ARUN_DEFAULT_PROFILE,
      ...preparedProfile,

      achievements: preparedProfile.achievements,
      certifications: preparedProfile.certifications,

      projects:
        preparedProfile.projects.length > 0
          ? preparedProfile.projects
          : ARUN_DEFAULT_PROFILE.projects,

      experience:
        preparedProfile.experience.length > 0
          ? preparedProfile.experience
          : ARUN_DEFAULT_PROFILE.experience,
    };
  }

  return preparedProfile;
}

function StudentProfile() {
  const [student, setStudent] = useState(getInitialStudentProfile);

  // Main profile editor state.
  const [editDraft, setEditDraft] = useState(null);

  // Individual section editor state.
  const [sectionDraft, setSectionDraft] = useState(null);
  const [editingSection, setEditingSection] = useState("");

  // Get current team participation.
  const teamParticipation = getStudentTeamParticipation(
    CURRENT_STUDENT_ID
  );

  // Open the profile editor.
  const openEditProfile = () => {
    setEditDraft({
      ...student,
      skills: (student.skills || []).join(", "),
      interests: (student.interests || []).join(", "),
    });
  };

  // Update profile form fields.
  const handleEditChange = (event) => {
    const { name, value } = event.target;

    setEditDraft((previous) => {
      if (!previous) return previous;

      return {
        ...previous,
        [name]: value,
      };
    });
  };

  // Upload and preview a profile photo.
  const handleProfileImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file || !editDraft) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Please upload a JPG, PNG, or WebP image.");
      event.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Please choose an image smaller than 2 MB.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result !== "string") {
        alert("Unable to preview this image. Please try another file.");
        return;
      }

      setEditDraft((previous) => {
        if (!previous) return previous;

        return {
          ...previous,
          profileImage: reader.result,
        };
      });
    };

    reader.onerror = () => {
      alert("Unable to read this image. Please try another file.");
    };

    reader.readAsDataURL(file);

    // Allow selecting the same image again.
    event.target.value = "";
  };

  // Remove profile photo.
  const handleRemoveProfileImage = () => {
    setEditDraft((previous) => {
      if (!previous) return previous;

      return {
        ...previous,
        profileImage: "",
      };
    });
  };

  // Save profile changes without replacing project data.
  const saveProfile = (event) => {
    event.preventDefault();

    if (!editDraft) return;

    const updatedStudent = {
      ...student,
      ...editDraft,

      skills: editDraft.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),

      interests: editDraft.interests
        .split(",")
        .map((interest) => interest.trim())
        .filter(Boolean),

      // Keep the existing projects unchanged.
      projects: student.projects || [],
    };

    setStudent(updatedStudent);

    saveStudentProfile(CURRENT_STUDENT_ID, updatedStudent);

    setEditDraft(null);
  };

  // Open the Experience editor.
  const openExperienceEditor = () => {
    setSectionDraft(
      (student.experience || []).map((item) => ({
        title: item.title || "",
        organization: item.organization || "",
        period: item.period || "",
        description: item.description || "",
      }))
    );

    setEditingSection("experience");
  };

  // Open the collaboration preferences editor.
  const openCollaborationEditor = () => {
    setSectionDraft({
      lookingFor: collaboration.lookingFor || "",
      preferredAreas: (
        collaboration.preferredAreas || []
      ).join(", "),
    });

    setEditingSection("collaboration");
  };

  // Update an experience entry.
  const handleExperienceChange = (index, field, value) => {
    setSectionDraft((previous) =>
      previous.map((item, itemIndex) =>
        itemIndex === index
          ? { ...item, [field]: value }
          : item
      )
    );
  };

  // Add another experience entry.
  const addExperience = () => {
    setSectionDraft((previous) => [
      ...previous,
      {
        title: "",
        organization: "",
        period: "",
        description: "",
      },
    ]);
  };

  // Remove an experience entry.
  const removeExperience = (index) => {
    setSectionDraft((previous) =>
      previous.filter((_, itemIndex) => itemIndex !== index)
    );
  };

  // Close the individual section editor.
  const closeSectionEditor = () => {
    setSectionDraft(null);
    setEditingSection("");
  };

  // Save Experience or Collaboration changes.
  const saveSectionChanges = (event) => {
    event.preventDefault();

    if (!sectionDraft || !editingSection) return;

    let updatedFields = {};

    if (editingSection === "experience") {
      const updatedExperience = sectionDraft
        .map((item) => ({
          title: item.title.trim(),
          organization: item.organization.trim(),
          period: item.period.trim(),
          description: item.description.trim(),
        }))
        .filter(
          (item) =>
            item.title ||
            item.organization ||
            item.description
        );

      updatedFields = {
        experience: updatedExperience,
      };
    }

    if (editingSection === "collaboration") {
      updatedFields = {
        collaboration: {
          lookingFor: sectionDraft.lookingFor.trim(),
          preferredAreas: sectionDraft.preferredAreas
            .split(",")
            .map((area) => area.trim())
            .filter(Boolean),
        },
      };
    }

    const updatedStudent = {
      ...student,
      ...updatedFields,
    };

    setStudent(updatedStudent);

    // Save only the changed section.
    saveStudentProfile(CURRENT_STUDENT_ID, updatedFields);

    closeSectionEditor();
  };

  // Reusable profile avatar.
  const renderAvatar = (image, name, altText) => (
    <div className="profile-avatar">
      {image ? (
        <img src={image} alt={altText} />
      ) : (
        <span>{name?.trim()?.charAt(0).toUpperCase() || "?"}</span>
      )}
    </div>
  );

  const projects = student.projects || [];
  const experience = student.experience || [];
  const achievements = student.achievements || [];
  const certifications = student.certifications || [];

  const collaboration = student.collaboration || {
    lookingFor: "",
    preferredAreas: [],
  };

  return (
    <main className="student-profile-page">
      <div className="student-profile-container">

        {/* 01. Profile header */}
        <header className="profile-intro">
          <div className="profile-identity">
            {renderAvatar(
              student.profileImage,
              student.name,
              "Student profile photo"
            )}

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
                <span>{student.section}</span>

                <span className="profile-availability-status">
                  {student.availability === "Not looking currently"
                    ? "Not Looking Currently"
                    : "Open to Team"}
                </span>
              </div>
            </div>
          </div>

          <button
            className="profile-edit-button"
            type="button"
            onClick={openEditProfile}
          >
            Edit Profile ↗
          </button>
        </header>

        {/* 02. About me */}
        <section className="profile-about">
          <h2 className="profile-section-heading">About Me</h2>

          <p>{student.bio}</p>

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
                {student.section}
              </span>
            </div>
          </div>
        </section>

        {/* 03. Technical skills and interests */}
        <section className="profile-capabilities">
          <div className="profile-capability-group">
            <span className="profile-label">TECHNICAL SKILLS</span>

            <div className="profile-tags">
              {(student.skills || []).map((skill, index) => (
                <span
                  className="profile-tag"
                  key={`${skill}-${index}`}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="profile-capability-group">
            <span className="profile-label">AREAS OF INTEREST</span>

            <div className="profile-tags">
              {(student.interests || []).map((interest, index) => (
                <span
                  className="profile-tag profile-interest-tag"
                  key={`${interest}-${index}`}
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* 04. Project overview - managed in My Projects */}
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

          <div className="profile-overview-project-list">
            {projects.map((project, index) => (
              <article
                className="profile-overview-project"
                key={`${project.title || project.name}-${index}`}
              >
                <div className="profile-overview-project-top">
                  <div className="profile-overview-project-number">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <span
                    className={`profile-project-status ${(project.status || "Planned")
                      .toLowerCase()
                      .replaceAll(" ", "-")}`}
                  >
                    <span className="project-status-dot" />
                    {project.status || "Planned"}
                  </span>
                </div>

                <h3>{project.title || project.name}</h3>

                <p className="profile-overview-description">
                  {project.description || "No project description added yet."}
                </p>

                <div className="profile-overview-role">
                  <span>YOUR ROLE</span>
                  <strong>{project.role || "Not specified"}</strong>
                </div>

                {project.technologies?.length > 0 && (
                  <div className="profile-overview-technologies">
                    {project.technologies.map((technology, techIndex) => (
                      <span key={`${technology}-${techIndex}`}>
                        {technology}
                      </span>
                    ))}
                  </div>
                )}
              </article>
            ))}

            {projects.length === 0 && (
              <div className="profile-project">
                <div className="profile-project-content">
                  <h3>No projects added yet</h3>
                  <p>
                    Your projects will appear here when you add them
                    through My Projects.
                  </p>
                </div>
              </div>
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

            <button
              type="button"
              className="profile-section-edit-button"
              onClick={openExperienceEditor}
            >
              Edit Experience ↗
            </button>
          </div>

          <div className="profile-experience-list">
            {experience.map((item, index) => (
              <article
                className="profile-experience-item"
                key={`${item.title}-${index}`}
              >
                <h3>{item.title}</h3>

                <p className="profile-experience-meta">
                  {item.organization} · {item.period}
                </p>

                <p className="profile-experience-description">
                  {item.description}
                </p>
              </article>
            ))}

            {experience.length === 0 && (
              <div className="profile-team-empty">
                No experience added yet. Use Edit Experience to add your
                learning, internship, or work experience.
              </div>
            )}
          </div>
        </section>

        {/* 06. Achievements and certifications */}
        <section className="profile-additional" id="achievements">
          <div className="profile-additional-group">
            <h2>Achievements and Recognition</h2>

            <Link
              to="/achievements"
              className="manage-achievements-button"
            >
              Manage Achievements
            </Link>

            <ul className="profile-achievement-list">
  {achievements.map((achievement, index) => {
    const title =
      typeof achievement === "string"
        ? achievement
        : achievement.title || achievement.name || "Achievement";

    const description =
      typeof achievement === "string"
        ? ""
        : achievement.description || "";

    return (
      <li
        className="profile-achievement-item"
        key={`achievement-${index}`}
      >
        <h3>{title}</h3>

        {description && <p>{description}</p>}
      </li>
    );
  })}
</ul>

            {achievements.length === 0 && (
              <p>No achievements added yet.</p>
            )}
          </div>

          <div className="profile-additional-group">
            <h2>Certifications</h2>

            {certifications.map((certification, index) => (
              <div
                className="profile-certification-item"
                key={`${certification.name}-${index}`}
              >
                <span className="profile-certification-name">
                  {certification.name}
                </span>

                <span className="profile-certification-issuer">
                  {certification.issuer}
                </span>
              </div>
            ))}

            {certifications.length === 0 && (
              <p>No certifications added yet.</p>
            )}
          </div>
        </section>

        {/* 07. Collaboration preferences */}
        <section className="profile-collaboration">
          <div className="profile-heading">
            <div>
              <span className="profile-eyebrow">
                TEAM COMPATIBILITY
              </span>

              <h2 className="profile-section-heading">
                What I'm Looking For
              </h2>
            </div>

            <button
              type="button"
              className="profile-section-edit-button"
              onClick={openCollaborationEditor}
            >
              Edit Preferences ↗
            </button>
          </div>

          <p>{collaboration.lookingFor}</p>

          <div className="profile-capability-group">
            <span className="profile-label">
              PREFERRED COLLABORATION AREAS
            </span>

            <div className="profile-tags">
              {(collaboration.preferredAreas || []).map((area, index) => (
                <span
                  className="profile-tag"
                  key={`${area}-${index}`}
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* 08. Current team participation */}
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
                  key={team.id}
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

                    <span className="profile-team-category">
                      {team.type}
                    </span>

                    {team.type === "Event Team" ? (
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
              No current team participation.
            </div>
          )}
        </section>

        {/* Connect and collaborate */}
        <footer className="profile-footer">
          <div className="profile-footer-copy">
            <span className="profile-eyebrow">
              CONNECT AND COLLABORATE
            </span>

            <p>
              Explore my work and connect with me for future projects.
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

      {/* Edit Profile modal */}
      {editDraft && (
        <div
          className="profile-edit-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setEditDraft(null);
            }
          }}
        >
          <form className="profile-edit-modal" onSubmit={saveProfile}>
            <div className="profile-edit-header">
              <div>
                <p className="profile-edit-eyebrow">YOUR PROFILE</p>
                <h2>Edit Profile</h2>
                <p>Update the details other students see.</p>
              </div>

              <button
                type="button"
                className="profile-edit-close"
                onClick={() => setEditDraft(null)}
                aria-label="Close edit profile form"
              >
                ×
              </button>
            </div>

            <div className="profile-edit-fields">
              {/* Profile photo */}
              <div className="profile-photo-editor">
                <span className="profile-photo-label">
                  Profile photo
                </span>

                <div className="profile-photo-controls">
                  <div className="profile-photo-preview">
                    {editDraft.profileImage ? (
                      <img
                        src={editDraft.profileImage}
                        alt="Profile preview"
                      />
                    ) : (
                      <span>
                        {editDraft.name?.trim()?.charAt(0).toUpperCase() || "?"}
                      </span>
                    )}
                  </div>

                  <div className="profile-photo-actions">
                    <label className="profile-upload-button">
                      Upload photo
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleProfileImageChange}
                      />
                    </label>

                    {editDraft.profileImage && (
                      <button
                        type="button"
                        className="profile-remove-photo"
                        onClick={handleRemoveProfileImage}
                      >
                        Remove photo
                      </button>
                    )}

                    <span>JPG, PNG or WebP · Maximum 2 MB</span>
                  </div>
                </div>
              </div>

              <label>
                Full name
                <input
                  name="name"
                  value={editDraft.name ?? ""}
                  onChange={handleEditChange}
                  required
                />
              </label>

              <div className="profile-edit-row">
                <label>
  Department
  <select
    name="department"
    value={editDraft.department ?? ""}
    onChange={handleEditChange}
    required
  >
    <option value="">Select Department</option>

    {DEPARTMENTS.map((department) => (
      <option key={department} value={department}>
        {department}
      </option>
    ))}
  </select>
</label>

                <label>
                  Academic year
                  <input
                    name="year"
                    value={editDraft.year ?? ""}
                    onChange={handleEditChange}
                    required
                  />
                </label>
              </div>

              <label>
                Section
                <input
                  name="section"
                  value={editDraft.section ?? ""}
                  onChange={handleEditChange}
                />
              </label>

              <label>
                About me
                <textarea
                  name="bio"
                  value={editDraft.bio ?? ""}
                  onChange={handleEditChange}
                  rows={4}
                  placeholder="Introduce yourself to potential teammates..."
                />
              </label>

              <label>
                Technical skills
                <textarea
                  name="skills"
                  value={editDraft.skills ?? ""}
                  onChange={handleEditChange}
                  rows={3}
                  placeholder="Java, React, MySQL"
                />
                <span>Separate each skill with a comma.</span>
              </label>

              {/* Corrected: Areas of interest has its own label. */}
              <label>
                Areas of interest
                <textarea
                  name="interests"
                  value={editDraft.interests ?? ""}
                  onChange={handleEditChange}
                  rows={3}
                  placeholder="Web development, AI, hackathons"
                />
                <span>Separate each interest with a comma.</span>
              </label>

              {/* Collaboration availability is a separate field. */}
              <label>
                Collaboration Availability
                <select
                  name="availability"
                  value={editDraft.availability || "Open to teams"}
                  onChange={handleEditChange}
                >
                  <option value="Open to teams">Open to Team</option>
                  <option value="Not looking currently">
                    Not Looking Currently
                  </option>
                </select>

                <span>
                  Let other students know whether you're currently open to joining teams.
                </span>
              </label>

              <label>
                GitHub profile URL
                <input
                  type="url"
                  name="github"
                  value={editDraft.github ?? ""}
                  onChange={handleEditChange}
                  placeholder="https://github.com/your-username"
                />
              </label>

              <label>
                LinkedIn profile URL
                <input
                  type="url"
                  name="linkedin"
                  value={editDraft.linkedin ?? ""}
                  onChange={handleEditChange}
                  placeholder="https://www.linkedin.com/in/your-username"
                />
              </label>

              <label>
                Portfolio URL
                <input
                  type="url"
                  name="portfolio"
                  value={editDraft.portfolio ?? ""}
                  onChange={handleEditChange}
                  placeholder="https://your-portfolio.com"
                />
              </label>
            </div>

            <div className="profile-edit-actions">
              <button
                type="button"
                className="profile-cancel-button"
                onClick={() => setEditDraft(null)}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="profile-save-button"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Experience and Collaboration editor */}
      {sectionDraft && (
        <div
          className="profile-edit-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeSectionEditor();
            }
          }}
        >
          <form
            className="profile-edit-modal"
            onSubmit={saveSectionChanges}
          >
            <div className="profile-edit-header">
              <div>
                <p className="profile-edit-eyebrow">
                  UPDATE YOUR PROFILE
                </p>

                <h2>
                  {editingSection === "experience"
                    ? "Edit Experience"
                    : "Edit Collaboration Preferences"}
                </h2>

                <p>
                  {editingSection === "experience"
                    ? "Add your learning, internship, work, or project experience."
                    : "Tell other students what kind of teammates and projects you're looking for."}
                </p>
              </div>

              <button
                type="button"
                className="profile-edit-close"
                onClick={closeSectionEditor}
                aria-label="Close editor"
              >
                ×
              </button>
            </div>

            <div className="profile-edit-fields">
              {editingSection === "experience" && (
                <>
                  {sectionDraft.map((item, index) => (
                    <div
                      className="profile-experience-editor-item"
                      key={index}
                    >
                      <div className="profile-experience-editor-heading">
                        <strong>Experience {index + 1}</strong>

                        <button
                          type="button"
                          className="profile-remove-photo"
                          onClick={() => removeExperience(index)}
                        >
                          Remove
                        </button>
                      </div>

                      <label>
                        Title
                        <input
                          value={item.title}
                          onChange={(event) =>
                            handleExperienceChange(
                              index,
                              "title",
                              event.target.value
                            )
                          }
                          placeholder="e.g. Web Development Intern"
                        />
                      </label>

                      <label>
                        Organization
                        <input
                          value={item.organization}
                          onChange={(event) =>
                            handleExperienceChange(
                              index,
                              "organization",
                              event.target.value
                            )
                          }
                          placeholder="Company, college, or self-learning"
                        />
                      </label>

                      <label>
                        Duration
                        <input
                          value={item.period}
                          onChange={(event) =>
                            handleExperienceChange(
                              index,
                              "period",
                              event.target.value
                            )
                          }
                          placeholder="e.g. June 2026 – August 2026"
                        />
                      </label>

                      <label>
                        Description
                        <textarea
                          value={item.description}
                          onChange={(event) =>
                            handleExperienceChange(
                              index,
                              "description",
                              event.target.value
                            )
                          }
                          rows={4}
                          placeholder="Describe what you learned or contributed..."
                        />
                      </label>
                    </div>
                  ))}

                  <button
                    type="button"
                    className="profile-add-experience-button"
                    onClick={addExperience}
                  >
                    + Add another experience
                  </button>
                </>
              )}

              {editingSection === "collaboration" && (
                <>
                  <label>
                    What kind of teammates or projects are you looking for?
                    <textarea
                      value={sectionDraft.lookingFor}
                      onChange={(event) =>
                        setSectionDraft((previous) => ({
                          ...previous,
                          lookingFor: event.target.value,
                        }))
                      }
                      rows={5}
                      placeholder="Describe your ideal team and collaboration style..."
                    />
                  </label>

                  <label>
                    Preferred collaboration areas
                    <textarea
                      value={sectionDraft.preferredAreas}
                      onChange={(event) =>
                        setSectionDraft((previous) => ({
                          ...previous,
                          preferredAreas: event.target.value,
                        }))
                      }
                      rows={3}
                      placeholder="Web Development, AI & ML, Backend Development"
                    />
                    <span>Separate each area with a comma.</span>
                  </label>
                </>
              )}
            </div>

            <div className="profile-edit-actions">
              <button
                type="button"
                className="profile-cancel-button"
                onClick={closeSectionEditor}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="profile-save-button"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}

export default StudentProfile;
