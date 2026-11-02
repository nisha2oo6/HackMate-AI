
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  getStudentById,
  saveStudentProfile,
} from "../data/students";
import { CURRENT_STUDENT_ID } from "../data/currentStudent";
import "./MyProjects.css";

const PROJECT_STATUSES = [
  "Planned",
  "In Progress",
  "Completed",
  "On Hold",
];

const EMPTY_PROJECT = {
  title: "",
  description: "",
  category: "",
  role: "",
  contribution: "",
  technologies: "",
  status: "Planned",
  projectType: "Individual",
  repositoryUrl: "",
  liveUrl: "",
  startDate: "",
  completionDate: "",
};

function normalizeProject(project = {}) {
  return {
    ...project,
    title: project.title || project.name || "",
    description: project.description || "",
    category: project.category || "",
    role: project.role || "",
    contribution: project.contribution || "",
    technologies: Array.isArray(project.technologies)
      ? project.technologies
      : [],
    status: PROJECT_STATUSES.includes(project.status)
      ? project.status
      : "Planned",
    projectType: project.projectType || "Individual",
    repositoryUrl: project.repositoryUrl || project.github || "",
    liveUrl: project.liveUrl || project.demoUrl || "",
    startDate: project.startDate || "",
    completionDate: project.completionDate || "",
  };
}

function MyProjects() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [student, setStudent] = useState(() =>
    getStudentById(Number(CURRENT_STUDENT_ID))
  );

  const [projects, setProjects] = useState(() => {
    const currentStudent = getStudentById(
      Number(CURRENT_STUDENT_ID)
    );

    return (currentStudent?.projects || []).map(normalizeProject);
  });

  const [activeFilter, setActiveFilter] = useState(
    searchParams.get("status") || "All"
  );

  const [searchText, setSearchText] = useState("");

  // Add/Edit modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [projectDraft, setProjectDraft] = useState({
    ...EMPTY_PROJECT,
  });

  // View Details modal states
  const [isDetailsModalOpen, setIsDetailsModalOpen] =
    useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  // Keep the filter synchronized with dashboard links.
  useEffect(() => {
    const requestedStatus = searchParams.get("status") || "All";

    setActiveFilter(
      [...PROJECT_STATUSES, "All"].includes(requestedStatus)
        ? requestedStatus
        : "All"
    );
  }, [searchParams]);

  // Project counts
  const projectCounts = useMemo(() => {
    return {
      All: projects.length,

      Planned: projects.filter(
        (project) => project.status === "Planned"
      ).length,

      "In Progress": projects.filter(
        (project) => project.status === "In Progress"
      ).length,

      Completed: projects.filter(
        (project) => project.status === "Completed"
      ).length,

      "On Hold": projects.filter(
        (project) => project.status === "On Hold"
      ).length,
    };
  }, [projects]);

  // Search and filter projects
  const filteredProjects = useMemo(() => {
    const search = searchText.trim().toLowerCase();

    return projects
      .map((project, index) => ({
        ...project,
        originalIndex: index,
      }))
      .filter((project) => {
        const matchesStatus =
          activeFilter === "All" ||
          project.status === activeFilter;

        const searchableText = [
          project.title,
          project.description,
          project.category,
          project.role,
          project.contribution,
          project.repositoryUrl,
          project.liveUrl,
          ...project.technologies,
        ]
          .join(" ")
          .toLowerCase();

        return (
          matchesStatus &&
          (!search || searchableText.includes(search))
        );
      });
  }, [projects, activeFilter, searchText]);

  // Change project status filter
  const changeFilter = (filter) => {
    setActiveFilter(filter);

    if (filter === "All") {
      setSearchParams({});
    } else {
      setSearchParams({ status: filter });
    }
  };

  // Open Add Project modal
  const openAddProject = () => {
    setEditingIndex(null);
    setProjectDraft({ ...EMPTY_PROJECT });
    setIsModalOpen(true);
  };

  // Open Edit Project modal
  const openEditProject = (project, index) => {
    const normalizedProject = normalizeProject(project);

    setEditingIndex(index);

    setProjectDraft({
      ...normalizedProject,
      technologies: normalizedProject.technologies.join(", "),
    });

    setIsModalOpen(true);
  };

  // Open View Details modal
  const openProjectDetails = (project) => {
    setSelectedProject(project);
    setIsDetailsModalOpen(true);
  };

  // Close View Details modal
  const closeDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedProject(null);
  };

  // Handle Add/Edit form changes
  const handleDraftChange = (event) => {
    const { name, value } = event.target;

    setProjectDraft((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Close Add/Edit modal
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingIndex(null);
    setProjectDraft({ ...EMPTY_PROJECT });
  };

  // Save project
  const saveProject = (event) => {
    event.preventDefault();

    if (!projectDraft.title.trim()) {
      alert("Please enter a project title.");
      return;
    }

    const {
      originalIndex,
      ...projectFields
    } = projectDraft;

    const updatedProject = {
      ...projectFields,
      title: projectDraft.title.trim(),
      description: projectDraft.description.trim(),
      category: projectDraft.category.trim(),
      role: projectDraft.role.trim(),
      contribution: projectDraft.contribution.trim(),

      technologies: projectDraft.technologies
        .split(",")
        .map((technology) => technology.trim())
        .filter(Boolean),

      repositoryUrl: projectDraft.repositoryUrl.trim(),
      liveUrl: projectDraft.liveUrl.trim(),
    };

    const updatedProjects = [...projects];

    if (editingIndex === null) {
      updatedProjects.push(updatedProject);
    } else {
      updatedProjects[editingIndex] = updatedProject;
    }

    const currentStudent =
      student || getStudentById(Number(CURRENT_STUDENT_ID));

    if (!currentStudent) {
      alert("Unable to find the current student profile.");
      return;
    }

    const updatedStudent = {
      ...currentStudent,
      projects: updatedProjects,
    };

    saveStudentProfile(CURRENT_STUDENT_ID, updatedStudent);

    setStudent(updatedStudent);
    setProjects(updatedProjects);

    closeModal();
  };

  // Delete project
  const deleteProject = (index) => {
    const project = projects[index];

    if (!project) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${project.title}"?`
    );

    if (!confirmed) return;

    const updatedProjects = projects.filter(
      (_, projectIndex) => projectIndex !== index
    );

    const currentStudent =
      student || getStudentById(Number(CURRENT_STUDENT_ID));

    if (!currentStudent) return;

    const updatedStudent = {
      ...currentStudent,
      projects: updatedProjects,
    };

    saveStudentProfile(CURRENT_STUDENT_ID, updatedStudent);

    setStudent(updatedStudent);
    setProjects(updatedProjects);

    if (
      selectedProject &&
      selectedProject.originalIndex === index
    ) {
      closeDetailsModal();
    }
  };

  // Edit directly from View Details
  const editSelectedProject = () => {
    if (!selectedProject) return;

    const projectToEdit = selectedProject;
    const projectIndex = projectToEdit.originalIndex;

    closeDetailsModal();
    openEditProject(projectToEdit, projectIndex);
  };

  return (
    <main className="my-projects-page">
      <div className="my-projects-container">

        {/* Page Header */}
        <header className="my-projects-header">
          <div>
            <span className="mp-eyebrow">YOUR WORKSPACE</span>
            <h1>My Projects</h1>
            <p>
              Organize your work, track progress, and showcase what
              you're building.
            </p>
          </div>

          <button
            type="button"
            className="mp-primary-button"
            onClick={openAddProject}
          >
            <span>＋</span> Add Project
          </button>
        </header>

        {/* Project Summary */}
        <section className="mp-summary-grid">
          <article className="mp-summary-card">
            <span className="mp-summary-label">Total Projects</span>
            <strong>{projectCounts.All}</strong>
            <span className="mp-summary-note">All your projects</span>
          </article>

          <article className="mp-summary-card">
            <span className="mp-summary-label">In Progress</span>
            <strong>{projectCounts["In Progress"]}</strong>
            <span className="mp-summary-note">Currently building</span>
          </article>

          <article className="mp-summary-card">
            <span className="mp-summary-label">Completed</span>
            <strong>{projectCounts.Completed}</strong>
            <span className="mp-summary-note">Finished projects</span>
          </article>

          <article className="mp-summary-card">
            <span className="mp-summary-label">Planned</span>
            <strong>{projectCounts.Planned}</strong>
            <span className="mp-summary-note">Ideas to work on</span>
          </article>
        </section>

        {/* Projects Section */}
        <section className="mp-project-section">

          <div className="mp-section-heading">
            <div>
              <span className="mp-eyebrow">PROJECT PORTFOLIO</span>
              <h2>Your Projects</h2>
            </div>

            <span className="mp-result-count">
              {filteredProjects.length} shown
            </span>
          </div>

          {/* Search and Filters */}
          <div className="mp-toolbar">
            <div className="mp-filter-list">
              {["All", ...PROJECT_STATUSES].map((filter) => (
                <button
                  type="button"
                  key={filter}
                  className={`mp-filter-button ${
                    activeFilter === filter ? "active" : ""
                  }`}
                  onClick={() => changeFilter(filter)}
                >
                  {filter}
                  <span>{projectCounts[filter]}</span>
                </button>
              ))}
            </div>

            <input
              className="mp-search-input"
              type="search"
              placeholder="Search your projects..."
              value={searchText}
              onChange={(event) =>
                setSearchText(event.target.value)
              }
            />
          </div>

          {/* Project Cards */}
          {filteredProjects.length > 0 ? (
            <div className="mp-project-grid">

              {filteredProjects.map((project) => (
                <article
                  className="mp-project-card"
                  key={`${project.originalIndex}-${project.title}`}
                >

                  <div className="mp-card-top">
                    <span className="mp-project-category">
                      {project.category || "General Project"}
                    </span>

                    <span
                      className={`mp-status ${project.status
                        .toLowerCase()
                        .replaceAll(" ", "-")}`}
                    >
                      <span className="mp-status-dot" />
                      {project.status}
                    </span>
                  </div>

                  <h3>{project.title}</h3>

                  <p className="mp-project-description">
                    {project.description || "No description added yet."}
                  </p>

                  <div className="mp-project-meta">
                    <span>
                      <strong>Role:</strong>{" "}
                      {project.role || "Not specified"}
                    </span>

                    <span>
                      <strong>Type:</strong>{" "}
                      {project.projectType || "Individual"}
                    </span>
                  </div>

                  {project.technologies.length > 0 && (
                    <div className="mp-technology-list">
                      {project.technologies.map(
                        (technology, index) => (
                          <span key={`${technology}-${index}`}>
                            {technology}
                          </span>
                        )
                      )}
                    </div>
                  )}

                  {/* Project Links */}
                  {(project.repositoryUrl || project.liveUrl) && (
                    <div className="mp-project-links">

                      {project.repositoryUrl && (
                        <div className="mp-project-link-item">
                          <strong>Repository</strong>

                          <a
                            href={project.repositoryUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {project.repositoryUrl} ↗
                          </a>
                        </div>
                      )}

                      {project.liveUrl && (
                        <div className="mp-project-link-item">
                          <strong>Live Project</strong>

                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {project.liveUrl} ↗
                          </a>
                        </div>
                      )}

                    </div>
                  )}

                  {/* Card Actions */}
                  <div className="mp-card-actions">

                    <button
                      type="button"
                      onClick={() => openProjectDetails(project)}
                    >
                      View Details
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        openEditProject(
                          project,
                          project.originalIndex
                        )
                      }
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="mp-delete-button"
                      onClick={() =>
                        deleteProject(project.originalIndex)
                      }
                    >
                      Delete
                    </button>

                  </div>
                </article>
              ))}

            </div>
          ) : (

            /* Empty State */
            <div className="mp-empty-state">
              <div className="mp-empty-icon">◇</div>

              <h3>
                {searchText
                  ? "No matching projects"
                  : activeFilter === "All"
                    ? "Your project space is ready"
                    : `No ${activeFilter.toLowerCase()} projects`}
              </h3>

              <p>
                {searchText
                  ? "Try another search term or clear your search."
                  : activeFilter === "All"
                    ? "Add your first project and start building your portfolio."
                    : "Projects with this status will appear here."}
              </p>

              {!searchText && activeFilter === "All" && (
                <button
                  type="button"
                  className="mp-primary-button"
                  onClick={openAddProject}
                >
                  ＋ Add Your First Project
                </button>
              )}
            </div>
          )}

        </section>
      </div>

      {/* Add / Edit Project Modal */}
      {isModalOpen && (
        <div
          className="mp-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <form className="mp-modal" onSubmit={saveProject}>

            <div className="mp-modal-header">
              <div>
                <span className="mp-eyebrow">PROJECT DETAILS</span>

                <h2>
                  {editingIndex === null
                    ? "Add Project"
                    : "Edit Project"}
                </h2>

                <p>
                  Add details about the project and your contribution.
                </p>
              </div>

              <button
                type="button"
                className="mp-modal-close"
                onClick={closeModal}
                aria-label="Close project form"
              >
                ×
              </button>
            </div>

            <div className="mp-form-fields">

              <label>
                Project title *
                <input
                  name="title"
                  value={projectDraft.title}
                  onChange={handleDraftChange}
                  placeholder="e.g. HackMate AI"
                  required
                />
              </label>

              <label>
                Project description *
                <textarea
                  name="description"
                  value={projectDraft.description}
                  onChange={handleDraftChange}
                  rows={4}
                  placeholder="What problem does your project solve?"
                  required
                />
              </label>

              <div className="mp-form-row">
                <label>
                  Category
                  <input
                    name="category"
                    value={projectDraft.category}
                    onChange={handleDraftChange}
                    placeholder="e.g. Web Development"
                  />
                </label>

                <label>
                  Your role
                  <input
                    name="role"
                    value={projectDraft.role}
                    onChange={handleDraftChange}
                    placeholder="e.g. Full-Stack Developer"
                  />
                </label>
              </div>

              <label>
                Your contribution
                <textarea
                  name="contribution"
                  value={projectDraft.contribution}
                  onChange={handleDraftChange}
                  rows={3}
                  placeholder="What have you worked on?"
                />
              </label>

              <label>
                Technologies
                <input
                  name="technologies"
                  value={projectDraft.technologies}
                  onChange={handleDraftChange}
                  placeholder="React, Java, MySQL"
                />
                <span>Separate technologies with commas.</span>
              </label>

              <div className="mp-form-row">
                <label>
                  Project status
                  <select
                    name="status"
                    value={projectDraft.status}
                    onChange={handleDraftChange}
                  >
                    {PROJECT_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Project type
                  <select
                    name="projectType"
                    value={projectDraft.projectType}
                    onChange={handleDraftChange}
                  >
                    <option value="Individual">Individual</option>
                    <option value="Team">Team</option>
                  </select>
                </label>
              </div>

              <div className="mp-form-row">
                <label>
                  Start date
                  <input
                    type="date"
                    name="startDate"
                    value={projectDraft.startDate}
                    onChange={handleDraftChange}
                  />
                </label>

                <label>
                  Completion date
                  <input
                    type="date"
                    name="completionDate"
                    value={projectDraft.completionDate}
                    onChange={handleDraftChange}
                  />
                </label>
              </div>

              <label>
                Repository URL
                <input
                  type="url"
                  name="repositoryUrl"
                  value={projectDraft.repositoryUrl}
                  onChange={handleDraftChange}
                  placeholder="https://github.com/username/project"
                />
              </label>

              <label>
                Live project URL
                <input
                  type="url"
                  name="liveUrl"
                  value={projectDraft.liveUrl}
                  onChange={handleDraftChange}
                  placeholder="https://your-project.com"
                />
              </label>

            </div>

            <div className="mp-modal-actions">
              <button
                type="button"
                className="mp-cancel-button"
                onClick={closeModal}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="mp-primary-button"
              >
                {editingIndex === null
                  ? "Save Project"
                  : "Update Project"}
              </button>
            </div>

          </form>
        </div>
      )}

      {/* View Project Details Modal */}
      {isDetailsModalOpen && selectedProject && (
        <div
          className="mp-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeDetailsModal();
            }
          }}
        >
          <div className="mp-modal mp-details-modal">

            <div className="mp-modal-header">
              <div>
                <span className="mp-eyebrow">
                  PROJECT OVERVIEW
                </span>

                <h2>{selectedProject.title}</h2>

                <p>
                  {selectedProject.category || "General Project"}
                </p>
              </div>

              <button
                type="button"
                className="mp-modal-close"
                onClick={closeDetailsModal}
                aria-label="Close project details"
              >
                ×
              </button>
            </div>

            <div className="mp-details-content">

              <div className="mp-details-status">
                <span className="mp-details-label">
                  Project Status
                </span>

                <span
                  className={`mp-status ${selectedProject.status
                    .toLowerCase()
                    .replaceAll(" ", "-")}`}
                >
                  <span className="mp-status-dot" />
                  {selectedProject.status}
                </span>
              </div>

              <div className="mp-detail-item">
                <h3>Description</h3>
                <p>
                  {selectedProject.description || "Not provided"}
                </p>
              </div>

              <div className="mp-details-grid">

                <div className="mp-detail-item">
                  <h3>Your Role</h3>
                  <p>
                    {selectedProject.role || "Not specified"}
                  </p>
                </div>

                <div className="mp-detail-item">
                  <h3>Project Type</h3>
                  <p>
                    {selectedProject.projectType || "Individual"}
                  </p>
                </div>

              </div>

              <div className="mp-detail-item">
                <h3>Your Contribution</h3>
                <p>
                  {selectedProject.contribution || "Not provided"}
                </p>
              </div>

              <div className="mp-detail-item">
                <h3>Technologies Used</h3>

                {selectedProject.technologies?.length > 0 ? (
                  <div className="mp-technology-list">
                    {selectedProject.technologies.map(
                      (technology, index) => (
                        <span key={`${technology}-${index}`}>
                          {technology}
                        </span>
                      )
                    )}
                  </div>
                ) : (
                  <p>Not provided</p>
                )}
              </div>

              <div className="mp-details-grid">

                <div className="mp-detail-item">
                  <h3>Start Date</h3>
                  <p>
                    {selectedProject.startDate || "Not provided"}
                  </p>
                </div>

                <div className="mp-detail-item">
                  <h3>Completion Date</h3>
                  <p>
                    {selectedProject.completionDate || "Not provided"}
                  </p>
                </div>

              </div>

              <div className="mp-detail-item">
                <h3>Project Links</h3>

                {selectedProject.repositoryUrl && (
                  <p>
                    <strong>Repository: </strong>

                    <a
                      href={selectedProject.repositoryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open Repository ↗
                    </a>
                  </p>
                )}

                {selectedProject.liveUrl && (
                  <p>
                    <strong>Live Project: </strong>

                    <a
                      href={selectedProject.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open Live Project ↗
                    </a>
                  </p>
                )}

                {!selectedProject.repositoryUrl &&
                  !selectedProject.liveUrl && (
                    <p>No project links added.</p>
                  )}
              </div>

            </div>

            <div className="mp-modal-actions">

              <button
                type="button"
                className="mp-cancel-button"
                onClick={closeDetailsModal}
              >
                Close
              </button>

              <button
                type="button"
                className="mp-primary-button"
                onClick={editSelectedProject}
              >
                Edit Project
              </button>

            </div>

          </div>
        </div>
      )}

    </main>
  );
}

export default MyProjects;
