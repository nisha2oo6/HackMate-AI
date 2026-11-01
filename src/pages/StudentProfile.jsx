
import "./StudentProfile.css";
import { useState } from "react";
import {
  getStudentById,
  saveStudentProfile,
} from "../data/students";
import { CURRENT_STUDENT_ID } from "../data/currentStudent";

// Get the student's accepted team participations from Local Storage.
function getStudentTeamParticipation(studentId) {
  try {
    const savedTeams = JSON.parse(
      localStorage.getItem("hackmateTeams") || "[]"
    );

    if (!Array.isArray(savedTeams)) return [];

    return savedTeams
      .filter((team) =>
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

    skills: student.skills || [],
    interests: student.interests || [],

    projects: (student.projects || []).map((project) => ({
      title: project.title || project.name || "",
      description: project.description || "",
      role: project.role || "",
      contribution: project.contribution || "",
      technologies: project.technologies || [],
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
        : item
    ),

    achievements: student.achievements || [],

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

// Arun's original detailed profile.
// This is preserved rather than replacing it with the shorter sample record.
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
        "A student-focused platform designed to help students discover opportunities, connect with peers, and collaborate on projects. The concept brings student information and collaboration activities into one accessible place.",
      role: "Full-Stack Developer",
      contribution:
        "Working on the user interface, page navigation, reusable React components, and planned frontend-backend integration.",
      technologies: ["React", "Java", "MySQL"],
      status: "In Progress",
    },
    {
      title: "Smart Task Planner",
      description:
        "A task management application designed to organize academic assignments, track priorities, and keep upcoming deadlines visible. The goal is to make it easier to manage multiple tasks and monitor progress.",
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

  achievements: [
    "Add verified hackathon participation and the event name.",
    "Add awards, competition results, or project recognition.",
    "Describe a technical challenge you solved and its impact.",
  ],

  certifications: [
    {
      name: "Java Programming",
      issuer: "Example certification — replace with actual details",
    },
    {
      name: "Web Development",
      issuer: "Example certification — replace with actual details",
    },
  ],

  collaboration: {
    lookingFor:
      "I enjoy working with teammates who share ideas, communicate openly, and contribute consistently toward building useful projects.",
    preferredAreas: [
      "Web Development",
      "AI & ML",
      "Backend Development",
    ],
  },

  github: "https://github.com/your-username",
  linkedin: "https://www.linkedin.com/in/your-username",
  portfolio: "",
};

// Load the correct profile for the currently selected student.
function getInitialStudentProfile() {
  const studentId = Number(CURRENT_STUDENT_ID);
  const sharedStudent = getStudentById(studentId);

  if (!sharedStudent) {
    console.error("Student profile not found:", studentId);
    return ARUN_DEFAULT_PROFILE;
  }

  // Preserve Arun's original detailed profile.
  // Saved edits, if present, take priority over the defaults.
  if (studentId === 1) {
    return {
      ...ARUN_DEFAULT_PROFILE,
      ...(JSON.parse(
        localStorage.getItem("hackmateStudentProfiles") || "{}"
      )[studentId] || {}),
    };
  }

  // Other students use their shared sample profile and saved edits.
  return prepareStudentProfile(sharedStudent);
}

function StudentProfile() {
  const [student, setStudent] = useState(getInitialStudentProfile);

  // Profile editor state
  const [editDraft, setEditDraft] = useState(null);

  // Project editor state
  const [projectDraft, setProjectDraft] = useState(null);
  const [editingProjectIndex, setEditingProjectIndex] = useState(null);

  // Get current team participation
  const teamParticipation = getStudentTeamParticipation(
    CURRENT_STUDENT_ID
  );

  // Open the profile editor
  const openEditProfile = () => {
    setEditDraft({
      ...student,
      skills: student.skills.join(", "),
      interests: student.interests.join(", "),
    });
  };

  // Update profile form fields
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

  // Upload and preview a profile photo
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

      const imageData = reader.result;

      setEditDraft((previous) => {
        if (!previous) return previous;

        return {
          ...previous,
          profileImage: imageData,
        };
      });
    };

    reader.onerror = () => {
      alert("Unable to read this image. Please try another file.");
    };

    reader.readAsDataURL(file);

    // Allow selecting the same image again
    event.target.value = "";
  };

  // Remove profile photo
  const handleRemoveProfileImage = () => {
    setEditDraft((previous) => {
      if (!previous) return previous;

      return {
        ...previous,
        profileImage: "",
      };
    });
  };

  // Save profile changes
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
    };

    setStudent(updatedStudent);

    saveStudentProfile(CURRENT_STUDENT_ID, updatedStudent);

    setEditDraft(null);
  };

  // Open a blank form to add a project
  const openAddProject = () => {
    setEditingProjectIndex(null);

    setProjectDraft({
      title: "",
      description: "",
      role: "",
      contribution: "",
      technologies: "",
      status: "Planned",
    });
  };

  // Open an existing project for editing
  const openEditProject = (project, index) => {
    setEditingProjectIndex(index);

    setProjectDraft({
      ...project,
      technologies: project.technologies.join(", "),
    });
  };

  // Update project form fields
  const handleProjectChange = (event) => {
    const { name, value } = event.target;

    setProjectDraft((previous) => {
      if (!previous) return previous;

      return {
        ...previous,
        [name]: value,
      };
    });
  };

  // Save a new or edited project
  const saveProject = (event) => {
    event.preventDefault();

    if (!projectDraft) return;

    if (!projectDraft.title.trim()) {
      alert("Please enter a project title.");
      return;
    }

    const updatedProject = {
      ...projectDraft,
      title: projectDraft.title.trim(),
      description: projectDraft.description.trim(),
      role: projectDraft.role.trim(),
      contribution: projectDraft.contribution.trim(),

      technologies: projectDraft.technologies
        .split(",")
        .map((technology) => technology.trim())
        .filter(Boolean),
    };

    const updatedProjects = [...student.projects];

    if (editingProjectIndex === null) {
      updatedProjects.push(updatedProject);
    } else {
      updatedProjects[editingProjectIndex] = updatedProject;
    }

    const updatedStudent = {
      ...student,
      projects: updatedProjects,
    };

    setStudent(updatedStudent);
    saveStudentProfile(CURRENT_STUDENT_ID, updatedStudent);

    setProjectDraft(null);
    setEditingProjectIndex(null);
  };

  // Delete a project after confirmation
  const deleteProject = (index) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmed) return;

    const updatedStudent = {
      ...student,
      projects: student.projects.filter(
        (_, projectIndex) => projectIndex !== index
      ),
    };

    setStudent(updatedStudent);
    saveStudentProfile(CURRENT_STUDENT_ID, updatedStudent);
  };

  // Reusable profile avatar
  const renderAvatar = (image, name, altText) => (
    <div className="profile-avatar">
      {image ? (
        <img src={image} alt={altText} />
      ) : (
        <span>{name?.trim()?.charAt(0).toUpperCase() || "?"}</span>
      )}
    </div>
  );

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

        {/* 03. Technical skills */}
        <section className="profile-capabilities">
          <div className="profile-capability-group">
            <span className="profile-label">TECHNICAL SKILLS</span>

            <div className="profile-tags">
              {student.skills.map((skill, index) => (
                <span className="profile-tag" key={`${skill}-${index}`}>
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* 04. Areas of interest */}
          <div className="profile-capability-group">
            <span className="profile-label">AREAS OF INTEREST</span>

            <div className="profile-tags">
              {student.interests.map((interest, index) => (
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

        {/* 05. Projects */}
        <section className="profile-projects">
          <div className="profile-heading">
            <div>
              <span className="profile-eyebrow">
                WORK AND CONTRIBUTIONS
              </span>
              <h2>Projects</h2>
            </div>

            <div className="profile-project-heading-actions">
              <span className="profile-project-count">
                {String(student.projects.length).padStart(2, "0")} projects
              </span>

              <button
                type="button"
                className="profile-add-project-button"
                onClick={openAddProject}
              >
                + Add Project
              </button>
            </div>
          </div>

          <div className="profile-project-list">
            {student.projects.map((project, index) => (
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

                    <div className="profile-project-heading-actions">
                      <span
                        className={`profile-project-status ${project.status
                          .toLowerCase()
                          .replaceAll(" ", "-")}`}
                      >
                        <span className="project-status-dot" />
                        {project.status}
                      </span>

                      <button
                        type="button"
                        className="profile-project-action"
                        onClick={() => openEditProject(project, index)}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="profile-project-action profile-project-delete"
                        onClick={() => deleteProject(index)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <p className="profile-project-description">
                    {project.description}
                  </p>

                  <p className="profile-project-role">
                    <strong>Role:</strong> {project.role || "Not specified"}
                  </p>

                  <p className="profile-project-description">
                    <strong>Contribution:</strong>{" "}
                    {project.contribution || "Not specified"}
                  </p>

                  <div className="profile-tags">
                    {project.technologies.map((technology, techIndex) => (
                      <span
                        className="profile-technology"
                        key={`${technology}-${techIndex}`}
                      >
                        {technology}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}

            {student.projects.length === 0 && (
              <div className="profile-project">
                <div className="profile-project-content">
                  <h3>No projects added yet</h3>
                  <p>
                    Add your first project to show other students
                    what you're building.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 06. Experience */}
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
            {student.experience.map((item, index) => (
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
          </div>
        </section>

        {/* 07. Achievements and certifications */}
        <section className="profile-additional">
          <div className="profile-additional-group">
            <h2>Achievements and Recognition</h2>

            <ul className="profile-achievement-list">
              {student.achievements.map((achievement, index) => (
                <li key={`${achievement}-${index}`}>
                  {achievement}
                </li>
              ))}
            </ul>
          </div>

          <div className="profile-additional-group">
            <h2>Certifications</h2>

            {student.certifications.map((certification, index) => (
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
          </div>
        </section>

        {/* 08. Collaboration preferences */}
        <section className="profile-collaboration">
          <span className="profile-eyebrow">TEAM COMPATIBILITY</span>

          <h2 className="profile-section-heading">
            What I'm Looking For
          </h2>

          <p>{student.collaboration.lookingFor}</p>

          <div className="profile-capability-group">
            <span className="profile-label">
              PREFERRED COLLABORATION AREAS
            </span>

            <div className="profile-tags">
              {student.collaboration.preferredAreas.map((area, index) => (
                <span className="profile-tag" key={`${area}-${index}`}>
                  {area}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* 09. Current team participation */}
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
                  <input
                    name="department"
                    value={editDraft.department ?? ""}
                    onChange={handleEditChange}
                    required
                  />
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

              <button type="submit" className="profile-save-button">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add/Edit Project modal */}
      {projectDraft && (
        <div
          className="profile-edit-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setProjectDraft(null);
              setEditingProjectIndex(null);
            }
          }}
        >
          <form
            className="profile-edit-modal"
            onSubmit={saveProject}
          >
            <div className="profile-edit-header">
              <div>
                <p className="profile-edit-eyebrow">YOUR WORK</p>

                <h2>
                  {editingProjectIndex === null
                    ? "Add Project"
                    : "Edit Project"}
                </h2>

                <p>
                  Share what you've built and your contribution.
                </p>
              </div>

              <button
                type="button"
                className="profile-edit-close"
                onClick={() => {
                  setProjectDraft(null);
                  setEditingProjectIndex(null);
                }}
                aria-label="Close project form"
              >
                ×
              </button>
            </div>

            <div className="profile-edit-fields">
              <label>
                Project title
                <input
                  name="title"
                  value={projectDraft.title}
                  onChange={handleProjectChange}
                  placeholder="e.g. HackMate AI"
                  required
                />
              </label>

              <label>
                Project description
                <textarea
                  name="description"
                  value={projectDraft.description}
                  onChange={handleProjectChange}
                  rows={4}
                  placeholder="What problem does your project solve?"
                  required
                />
              </label>

              <label>
                Your role
                <input
                  name="role"
                  value={projectDraft.role}
                  onChange={handleProjectChange}
                  placeholder="e.g. Frontend Developer"
                />
              </label>

              <label>
                Your contribution
                <textarea
                  name="contribution"
                  value={projectDraft.contribution}
                  onChange={handleProjectChange}
                  rows={3}
                  placeholder="What did you build or contribute?"
                />
              </label>

              <label>
                Technologies
                <input
                  name="technologies"
                  value={projectDraft.technologies}
                  onChange={handleProjectChange}
                  placeholder="React, Java, MySQL"
                />
                <span>Separate technologies with commas.</span>
              </label>

              <label>
                Project status
                <select
                  name="status"
                  value={projectDraft.status}
                  onChange={handleProjectChange}
                >
                  <option value="Planned">Planned</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="On Hold">On Hold</option>
                </select>
              </label>
            </div>

            <div className="profile-edit-actions">
              <button
                type="button"
                className="profile-cancel-button"
                onClick={() => {
                  setProjectDraft(null);
                  setEditingProjectIndex(null);
                }}
              >
                Cancel
              </button>

              <button type="submit" className="profile-save-button">
                Save Project
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}

export default StudentProfile;
