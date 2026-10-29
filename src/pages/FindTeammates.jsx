
import { useMemo, useState } from "react";
import "./FindTeammates.css";

const students = [
  {
    id: 1,
    name: "Arun Kumar",
    initials: "AK",
    department: "Computer Science",
    year: "3rd Year",
    section: "A",
    bio: "Interested in building practical applications and solving real-world problems.",
    skills: ["Java", "Spring Boot", "MySQL"],
    interests: ["Web Development", "Hackathons"],
    projects: [
      {
        name: "Campus Connect",
        status: "Completed",
        description: "A platform for students to share campus updates.",
      },
      {
        name: "Smart Attendance",
        status: "In Progress",
        description: "An attendance tracking application.",
      },
    ],
    availability: "Open to teams",
  },
  {
    id: 2,
    name: "Priya Sharma",
    initials: "PS",
    department: "Information Technology",
    year: "3rd Year",
    section: "B",
    bio: "Enjoys designing clean interfaces and creating user-friendly experiences.",
    skills: ["UI/UX Design", "Figma", "HTML", "CSS"],
    interests: ["Product Design", "Innovation"],
    projects: [
      {
        name: "HealthTrack UI",
        status: "Completed",
        description: "A health and wellness dashboard design.",
      },
    ],
    availability: "Open to teams",
  },
  {
    id: 3,
    name: "Rahul Dev",
    initials: "RD",
    department: "Artificial Intelligence and Data Science",
    year: "2nd Year",
    section: "A",
    bio: "Exploring data analysis, machine learning and intelligent applications.",
    skills: ["Python", "Machine Learning", "SQL"],
    interests: ["AI", "Data Analytics"],
    projects: [
      {
        name: "Student Performance Analyzer",
        status: "In Progress",
        description: "Analyzes student performance patterns.",
      },
    ],
    availability: "Open to teams",
  },
  {
    id: 4,
    name: "Meena Krish",
    initials: "MK",
    department: "Computer Science",
    year: "2nd Year",
    section: "B",
    bio: "Learning full-stack development and building useful student tools.",
    skills: ["React", "JavaScript", "CSS", "Git"],
    interests: ["Web Development", "Open Source"],
    projects: [
      {
        name: "Task Planner",
        status: "Completed",
        description: "A simple application for organizing tasks.",
      },
      {
        name: "Event Finder",
        status: "Planned",
        description: "A concept for discovering college events.",
      },
    ],
    availability: "Open to teams",
  },
  {
    id: 5,
    name: "Karthik Raj",
    initials: "KR",
    department: "Electronics and Communication",
    year: "3rd Year",
    section: "A",
    bio: "Interested in combining hardware, software and smart technologies.",
    skills: ["C", "Python", "IoT", "Arduino"],
    interests: ["IoT", "Smart Systems"],
    projects: [
      {
        name: "Smart Plant Monitor",
        status: "Completed",
        description: "Monitors plant conditions using sensors.",
      },
    ],
    availability: "Open to teams",
  },
  {
    id: 6,
    name: "Divya S",
    initials: "DS",
    department: "Information Technology",
    year: "2nd Year",
    section: "A",
    bio: "Interested in application development, testing and collaborative projects.",
    skills: ["Java", "SQL", "Testing", "HTML"],
    interests: ["Software Development", "Hackathons"],
    projects: [
      {
        name: "Library Manager",
        status: "In Progress",
        description: "A tool to manage library records.",
      },
    ],
    availability: "Not currently looking",
  },
];

const departments = [
  ...new Set(students.map((student) => student.department)),
];

const skills = [
  ...new Set(students.flatMap((student) => student.skills)),
].sort();

function FindTeammates() {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All Departments");
  const [skill, setSkill] = useState("All Skills");
  const [availability, setAvailability] = useState("Everyone");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [sentRequests, setSentRequests] = useState([]);

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return students.filter((student) => {
      const searchableText = [
        student.name,
        student.department,
        student.bio,
        ...student.skills,
        ...student.interests,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        query === "" || searchableText.includes(query);

      const matchesDepartment =
        department === "All Departments" ||
        student.department === department;

      const matchesSkill =
        skill === "All Skills" || student.skills.includes(skill);

      const matchesAvailability =
        availability === "Everyone" ||
        student.availability === availability;

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesSkill &&
        matchesAvailability
      );
    });
  }, [search, department, skill, availability]);

  function toggleRequest(studentId) {
    setSentRequests((previous) =>
      previous.includes(studentId)
        ? previous.filter((id) => id !== studentId)
        : [...previous, studentId]
    );
  }

  function clearFilters() {
    setSearch("");
    setDepartment("All Departments");
    setSkill("All Skills");
    setAvailability("Everyone");
  }

  return (
    <main className="fm-page">
      <section className="fm-heading">
        <div>
          <span className="fm-eyebrow">STUDENT COLLABORATION</span>
          <h1>Find Your Teammates</h1>
          <p>
            Discover students with complementary skills, shared
            interests and the motivation to build something great.
          </p>
        </div>

        <div className="fm-count">
          <strong>{filteredStudents.length}</strong>
          <span>
            {filteredStudents.length === 1 ? "student found" : "students found"}
          </span>
        </div>
      </section>

      <section className="fm-filters">
        <label className="fm-search">
          <span aria-hidden="true">⌕</span>
          <input
            type="search"
            placeholder="Search by name, skill or interest..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search students"
          />
        </label>

        <label className="fm-filter-field">
          <span>Department</span>
          <select
            value={department}
            onChange={(event) => setDepartment(event.target.value)}
          >
            <option>All Departments</option>
            {departments.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>

        <label className="fm-filter-field">
          <span>Skill</span>
          <select
            value={skill}
            onChange={(event) => setSkill(event.target.value)}
          >
            <option>All Skills</option>
            {skills.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>

        <label className="fm-filter-field">
          <span>Collaboration</span>
          <select
            value={availability}
            onChange={(event) => setAvailability(event.target.value)}
          >
            <option>Everyone</option>
            <option>Open to teams</option>
            <option>Not currently looking</option>
          </select>
        </label>

        <button
          type="button"
          className="fm-clear-button"
          onClick={clearFilters}
        >
          Clear filters
        </button>
      </section>

      <div className="fm-results-heading">
        <h2>Explore Students</h2>
        <span>Sample profiles for the frontend demo</span>
      </div>

      {filteredStudents.length > 0 ? (
        <section className="fm-grid">
          {filteredStudents.map((student) => {
            const requestSent = sentRequests.includes(student.id);
            const isAvailable =
              student.availability === "Open to teams";

            return (
              <article className="fm-card" key={student.id}>
                <div className="fm-card-top">
                  <div className="fm-avatar" aria-hidden="true">
                    {student.initials}
                  </div>

                  <span
                    className={
                      isAvailable
                        ? "fm-status fm-status-open"
                        : "fm-status fm-status-busy"
                    }
                  >
                    <span className="fm-status-dot" />
                    {student.availability}
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
                    {student.skills.slice(0, 4).map((item) => (
                      <span className="fm-tag" key={item}>
                        {item}
                      </span>
                    ))}
                    {student.skills.length > 4 && (
                      <span className="fm-tag fm-tag-more">
                        +{student.skills.length - 4}
                      </span>
                    )}
                  </div>
                </div>

                <div className="fm-card-section">
                  <span className="fm-label">INTERESTS</span>
                  <p className="fm-interests">
                    {student.interests.join(" · ")}
                  </p>
                </div>

                <div className="fm-card-actions">
                  <button
                    type="button"
                    className="fm-view-button"
                    onClick={() => setSelectedStudent(student)}
                  >
                    View Profile
                  </button>

                  <button
                    type="button"
                    className="fm-connect-button"
                    disabled={!isAvailable}
                    onClick={() => toggleRequest(student.id)}
                  >
                    {requestSent ? "Request Sent ✓" : "Connect +"}
                  </button>
                </div>
              </article>
            );
          })}
        </section>
      ) : (
        <section className="fm-empty">
          <div className="fm-empty-icon" aria-hidden="true">⌕</div>
          <h3>No students found</h3>
          <p>Try another search term or adjust your filters.</p>
          <button
            type="button"
            className="fm-view-button"
            onClick={clearFilters}
          >
            Reset search
          </button>
        </section>
      )}

      {selectedStudent && (
        <div
          className="fm-modal-backdrop"
          onClick={() => setSelectedStudent(null)}
        >
          <section
            className="fm-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="fm-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="fm-modal-close"
              aria-label="Close profile"
              onClick={() => setSelectedStudent(null)}
            >
              ×
            </button>

            <div className="fm-modal-avatar" aria-hidden="true">
              {selectedStudent.initials}
            </div>

            <h2 id="fm-modal-title">{selectedStudent.name}</h2>
            <p className="fm-academic">
              {selectedStudent.department} · {selectedStudent.year} ·
              Section {selectedStudent.section}
            </p>
            <p className="fm-modal-bio">{selectedStudent.bio}</p>

            <div className="fm-modal-section">
              <span className="fm-label">SKILLS</span>
              <div className="fm-tags">
                {selectedStudent.skills.map((item) => (
                  <span className="fm-tag" key={item}>{item}</span>
                ))}
              </div>
            </div>

            <div className="fm-modal-section">
              <span className="fm-label">INTERESTS</span>
              <div className="fm-tags">
                {selectedStudent.interests.map((item) => (
                  <span className="fm-tag" key={item}>{item}</span>
                ))}
              </div>
            </div>

            <div className="fm-modal-section">
              <span className="fm-label">
                PROJECTS ({selectedStudent.projects.length})
              </span>

              {selectedStudent.projects.map((project) => (
                <div className="fm-project" key={project.name}>
                  <div className="fm-project-heading">
                    <strong>{project.name}</strong>
                    <span className="fm-project-status">
                      {project.status}
                    </span>
                  </div>
                  <p>{project.description}</p>
                </div>
              ))}
            </div>

            <div className="fm-modal-footer">
              <span className="fm-modal-availability">
                {selectedStudent.availability}
              </span>

              <button
                type="button"
                className="fm-connect-button"
                disabled={
                  selectedStudent.availability !== "Open to teams"
                }
                onClick={() => toggleRequest(selectedStudent.id)}
              >
                {sentRequests.includes(selectedStudent.id)
                  ? "Request Sent ✓"
                  : "Connect +"}
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

export default FindTeammates;
