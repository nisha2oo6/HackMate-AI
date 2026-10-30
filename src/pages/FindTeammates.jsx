
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./FindTeammates.css";

export const students = [
  {
    id: 1,
    initials: "AK",
    name: "Arun Kumar",
    department: "CSE",
    year: "3rd Year",
    section: "A",
    bio: "Backend developer interested in building scalable applications and solving real-world problems.",
    skills: ["Java", "Spring Boot", "MySQL", "REST API"],
    interests: ["Web Development", "Hackathons", "Problem Solving"],
    availability: "Open to teams",
    projects: [
      { name: "Campus Connect", status: "Completed" },
      { name: "Smart Attendance", status: "In Progress" },
    ],
    experience: ["Built REST APIs using Spring Boot", "Worked with relational databases"],
    achievements: ["Participated in college-level coding events"],
    certifications: ["Java Programming"],
    collaborationPreferences: ["Hackathons", "Web Applications", "Backend Development"],
  },
  {
    id: 2,
    initials: "PS",
    name: "Priya Sharma",
    department: "IT",
    year: "3rd Year",
    section: "B",
    bio: "UI/UX enthusiast who enjoys creating clean, accessible, and user-friendly interfaces.",
    skills: ["UI/UX", "Figma", "HTML", "CSS", "Wireframing"],
    interests: ["Design", "Frontend Development", "Creative Projects"],
    availability: "Open to teams",
    projects: [{ name: "HealthTrack UI", status: "Completed" }],
    experience: ["Designed responsive website layouts", "Created prototypes using Figma"],
    achievements: ["Completed multiple UI design projects"],
    certifications: ["UI/UX Design Fundamentals"],
    collaborationPreferences: ["UI/UX Design", "Frontend Projects", "Hackathons"],
  },
  {
    id: 3,
    initials: "RD",
    name: "Rahul Dev",
    department: "AI & DS",
    year: "2nd Year",
    section: "A",
    bio: "Interested in data science, machine learning, and using data to solve practical problems.",
    skills: ["Python", "Machine Learning", "SQL", "Data Analysis"],
    interests: ["Artificial Intelligence", "Data Science", "Research"],
    availability: "Open to teams",
    projects: [{ name: "Student Performance Analyzer", status: "In Progress" }],
    experience: ["Worked with Python data analysis libraries"],
    achievements: ["Completed beginner machine learning projects"],
    certifications: ["Python for Data Science"],
    collaborationPreferences: ["AI/ML Projects", "Research", "Data Analysis"],
  },
  {
    id: 4,
    initials: "MK",
    name: "Meena Krish",
    department: "CSE",
    year: "2nd Year",
    section: "B",
    bio: "Frontend developer who enjoys turning ideas into interactive web applications.",
    skills: ["React", "JavaScript", "CSS", "Git"],
    interests: ["Web Development", "Product Building", "Hackathons"],
    availability: "Open to teams",
    projects: [
      { name: "Task Planner", status: "Completed" },
      { name: "Event Finder", status: "Planned" },
    ],
    experience: ["Built responsive React interfaces"],
    achievements: ["Created independent frontend projects"],
    certifications: ["Frontend Development"],
    collaborationPreferences: ["React Projects", "Frontend Development", "Hackathons"],
  },
  {
    id: 5,
    initials: "KR",
    name: "Karthik Raj",
    department: "ECE",
    year: "3rd Year",
    section: "A",
    bio: "Interested in hardware, IoT, and connecting software with real-world devices.",
    skills: ["C", "Python", "IoT", "Arduino"],
    interests: ["Embedded Systems", "Robotics", "Innovation"],
    availability: "Open to teams",
    projects: [{ name: "Smart Plant Monitor", status: "Completed" }],
    experience: ["Worked with Arduino and basic sensors"],
    achievements: ["Developed an IoT prototype"],
    certifications: ["Introduction to IoT"],
    collaborationPreferences: ["IoT Projects", "Hardware Prototyping", "Innovation Challenges"],
  },
  {
    id: 6,
    initials: "DS",
    name: "Divya S",
    department: "IT",
    year: "2nd Year",
    section: "A",
    bio: "Interested in software testing, database management, and building reliable applications.",
    skills: ["Java", "SQL", "Testing", "HTML"],
    interests: ["Software Development", "Testing", "Database Systems"],
    availability: "Not looking currently",
    projects: [{ name: "Library Manager", status: "In Progress" }],
    experience: ["Practised manual testing and SQL queries"],
    achievements: ["Completed academic software projects"],
    certifications: ["Software Testing Basics"],
    collaborationPreferences: ["Testing", "Java Projects", "Database Applications"],
  },
];

const initialIncomingRequests = [
  {
    id: 101,
    fromStudentId: 5,
    message: "Hi! I am interested in collaborating on an innovation project. Let's connect.",
    status: "Pending",
  },
];

function FindTeammates() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
  const [selectedSkill, setSelectedSkill] = useState("All Skills");
  const [selectedAvailability, setSelectedAvailability] = useState("All");

  const [activeTab, setActiveTab] = useState("discover");

  const [sentRequests, setSentRequests] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState(initialIncomingRequests);

  const [requestTarget, setRequestTarget] = useState(null);
  const [requestMessage, setRequestMessage] = useState("");

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
    return students.filter((student) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        student.name.toLowerCase().includes(search) ||
        student.department.toLowerCase().includes(search) ||
        student.bio.toLowerCase().includes(search) ||
        student.skills.some((skill) => skill.toLowerCase().includes(search)) ||
        student.interests.some((interest) =>
          interest.toLowerCase().includes(search)
        );

      const matchesDepartment =
        selectedDepartment === "All Departments" ||
        student.department === selectedDepartment;

      const matchesSkill =
        selectedSkill === "All Skills" ||
        student.skills.includes(selectedSkill);

      const matchesAvailability =
        selectedAvailability === "All" ||
        (selectedAvailability === "Open to teams"
          ? student.availability === "Open to teams"
          : student.availability !== "Open to teams");

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesSkill &&
        matchesAvailability
      );
    });
  }, [searchTerm, selectedDepartment, selectedSkill, selectedAvailability]);

  const getStudentById = (id) =>
    students.find((student) => student.id === id);

  const getSentRequest = (studentId) =>
    sentRequests.find(
      (request) =>
        request.toStudentId === studentId && request.status === "Pending"
    );

  const isConnected = (studentId) =>
    sentRequests.some(
      (request) =>
        request.toStudentId === studentId && request.status === "Accepted"
    ) ||
    incomingRequests.some(
      (request) =>
        request.fromStudentId === studentId && request.status === "Accepted"
    );

  const pendingSentRequests = sentRequests.filter(
    (request) => request.status === "Pending"
  );

  const pendingIncomingRequests = incomingRequests.filter(
    (request) => request.status === "Pending"
  );

  const acceptedSentRequests = sentRequests.filter(
    (request) => request.status === "Accepted"
  );

  const acceptedIncomingRequests = incomingRequests.filter(
    (request) => request.status === "Accepted"
  );

  const openRequestModal = (student) => {
    setRequestTarget(student);
    setRequestMessage("");
  };

  const sendConnectionRequest = () => {
    if (!requestTarget || isConnected(requestTarget.id)) return;

    const alreadyPending = getSentRequest(requestTarget.id);
    if (alreadyPending) return;

    setSentRequests((previous) => [
      ...previous,
      {
        id: Date.now(),
        toStudentId: requestTarget.id,
        message: requestMessage.trim(),
        status: "Pending",
      },
    ]);

    setRequestTarget(null);
    setRequestMessage("");
  };

  const cancelSentRequest = (requestId) => {
    setSentRequests((previous) =>
      previous.map((request) =>
        request.id === requestId
          ? { ...request, status: "Cancelled" }
          : request
      )
    );
  };

  const acceptIncomingRequest = (requestId) => {
    setIncomingRequests((previous) =>
      previous.map((request) =>
        request.id === requestId
          ? { ...request, status: "Accepted" }
          : request
      )
    );
  };

  const rejectIncomingRequest = (requestId) => {
    setIncomingRequests((previous) =>
      previous.map((request) =>
        request.id === requestId
          ? { ...request, status: "Rejected" }
          : request
      )
    );
  };

  const getRequestButton = (student) => {
    const pendingRequest = getSentRequest(student.id);

    if (isConnected(student.id)) {
      return (
        <button className="fm-connect-button fm-connected-button" disabled>
          Connected ✓
        </button>
      );
    }

    if (pendingRequest) {
      return (
        <button
          className="fm-connect-button fm-request-sent-button"
          onClick={() => cancelSentRequest(pendingRequest.id)}
        >
          Cancel Request
        </button>
      );
    }

    if (student.availability !== "Open to teams") {
      return (
        <button className="fm-connect-button" disabled>
          Not Available
        </button>
      );
    }

    return (
      <button
        className="fm-connect-button fm-send-request-hover"
        onClick={() => openRequestModal(student)}
      >
        Send Request
      </button>
    );
  };

  const acceptedConnectionIds = [
    ...acceptedSentRequests.map((request) => request.toStudentId),
    ...acceptedIncomingRequests.map((request) => request.fromStudentId),
  ].filter((id, index, array) => array.indexOf(id) === index);

  const previousRequests = [
    ...sentRequests
      .filter((request) => request.status !== "Pending")
      .map((request) => ({
        ...request,
        direction: "Sent",
        studentId: request.toStudentId,
      })),
    ...incomingRequests
      .filter((request) => request.status !== "Pending")
      .map((request) => ({
        ...request,
        direction: "Received",
        studentId: request.fromStudentId,
      })),
  ];

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
        <button
          className={activeTab === "discover" ? "fm-tab active" : "fm-tab"}
          onClick={() => setActiveTab("discover")}
        >
          Discover Students
        </button>

        <button
          className={activeTab === "requests" ? "fm-tab active" : "fm-tab"}
          onClick={() => setActiveTab("requests")}
        >
          Requests
          {pendingIncomingRequests.length + pendingSentRequests.length > 0 && (
            <span className="fm-tab-count">
              {pendingIncomingRequests.length + pendingSentRequests.length}
            </span>
          )}
        </button>

        <button
          className={activeTab === "connections" ? "fm-tab active" : "fm-tab"}
          onClick={() => setActiveTab("connections")}
        >
          Connections
        </button>
      </div>

      {/* DISCOVER STUDENTS */}
      {activeTab === "discover" && (
        <>
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
                <option value="Open to teams">Open to teams</option>
                <option value="Not looking">Not looking currently</option>
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
            {filteredStudents.map((student) => (
              <article className="fm-card" key={student.id}>
                <div className="fm-card-top">
                  <div className="fm-avatar">{student.initials}</div>

                  <span
                    className={
                      student.availability === "Open to teams"
                        ? "fm-status fm-status-open"
                        : "fm-status fm-status-busy"
                    }
                  >
                    {student.availability}
                  </span>
                </div>

                <h3>{student.name}</h3>

                <p className="fm-academic">
                  {student.department} · {student.year} · Section {student.section}
                </p>

                <p className="fm-bio">{student.bio}</p>

                <div className="fm-card-section">
                  <span className="fm-label">SKILLS</span>
                  <div className="fm-tags">
                    {student.skills.slice(0, 4).map((skill) => (
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

                  {getRequestButton(student)}
                </div>
              </article>
            ))}
          </div>

          {filteredStudents.length === 0 && (
            <div className="fm-empty-state">
              <h3>No students found</h3>
              <p>Try changing your search or filters.</p>
            </div>
          )}
        </>
      )}

      {/* REQUESTS */}
      {activeTab === "requests" && (
        <div className="fm-request-page">
          <section className="fm-request-section">
            <h2>Incoming Requests</h2>
            <p className="fm-section-description">
              Students who want to connect and collaborate with you.
            </p>

            {pendingIncomingRequests.length === 0 ? (
              <p className="fm-empty-state">
                You don't have any pending incoming requests.
              </p>
            ) : (
              pendingIncomingRequests.map((request) => {
                const student = getStudentById(request.fromStudentId);
                if (!student) return null;

                return (
                  <div className="fm-request-card" key={request.id}>
                    <div className="fm-avatar">{student.initials}</div>

                    <div className="fm-request-details">
                      <h3>{student.name}</h3>
                      <p>{student.department} · {student.year}</p>
                      <p className="fm-request-message">{request.message}</p>
                      <Link
                        to={`/student/${student.id}`}
                        className="fm-view-button"
                      >
                        View Profile
                      </Link>
                    </div>

                    <div className="fm-request-actions">
                      <button
                        className="fm-accept-button"
                        onClick={() => acceptIncomingRequest(request.id)}
                      >
                        Accept
                      </button>

                      <button
                        className="fm-reject-button"
                        onClick={() => rejectIncomingRequest(request.id)}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </section>

          <section className="fm-request-section">
            <h2>Sent Requests</h2>
            <p className="fm-section-description">
              Requests you've sent to other students.
            </p>

            {pendingSentRequests.length === 0 ? (
              <p className="fm-empty-state">
                You haven't sent any pending requests.
              </p>
            ) : (
              pendingSentRequests.map((request) => {
                const student = getStudentById(request.toStudentId);
                if (!student) return null;

                return (
                  <div className="fm-request-card" key={request.id}>
                    <div className="fm-avatar">{student.initials}</div>

                    <div className="fm-request-details">
                      <h3>{student.name}</h3>
                      <p>{student.department} · {student.year}</p>
                      <span className="fm-request-pending">Pending</span>
                      <Link
                        to={`/student/${student.id}`}
                        className="fm-view-button"
                      >
                        View Profile
                      </Link>
                    </div>

                    <button
                      className="fm-reject-button"
                      onClick={() => cancelSentRequest(request.id)}
                    >
                      Cancel Request
                    </button>
                  </div>
                );
              })
            )}
          </section>

          <section className="fm-request-section">
            <h2>Previous Requests</h2>

            {previousRequests.length === 0 ? (
              <p className="fm-empty-state">No previous requests yet.</p>
            ) : (
              previousRequests.map((request) => {
                const student = getStudentById(request.studentId);
                if (!student) return null;

                return (
                  <div className="fm-request-card" key={request.id}>
                    <div className="fm-avatar">{student.initials}</div>

                    <div className="fm-request-details">
                      <h3>{student.name}</h3>
                      <p>{request.direction} request</p>
                      <Link
                        to={`/student/${student.id}`}
                        className="fm-view-button"
                      >
                        View Profile
                      </Link>
                    </div>

                    <span className="fm-request-pending">
                      {request.status}
                    </span>
                  </div>
                );
              })
            )}
          </section>
        </div>
      )}

      {/* CONNECTIONS */}
      {activeTab === "connections" && (
        <section className="fm-request-section">
          <h2>Your Connections</h2>
          <p className="fm-section-description">
            Students whose connection requests have been accepted.
          </p>

          {acceptedConnectionIds.length === 0 ? (
            <p className="fm-empty-state">
              You don't have any connections yet. Start by discovering students!
            </p>
          ) : (
            <div className="fm-grid">
              {acceptedConnectionIds.map((studentId) => {
                const student = getStudentById(studentId);
                if (!student) return null;

                return (
                  <article className="fm-card" key={student.id}>
                    <div className="fm-card-top">
                      <div className="fm-avatar">{student.initials}</div>
                      <span className="fm-status fm-status-open">Connected</span>
                    </div>

                    <h3>{student.name}</h3>
                    <p className="fm-academic">
                      {student.department} · {student.year}
                    </p>
                    <p className="fm-bio">{student.bio}</p>

                    <div className="fm-card-actions">
                      <Link
                        to={`/student/${student.id}`}
                        className="fm-view-button"
                      >
                        View Profile
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* SEND CONNECTION REQUEST MODAL */}
      {requestTarget && (
        <div
          className="fm-modal-overlay"
          onClick={() => setRequestTarget(null)}
        >
          <div
            className="fm-modal fm-request-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="fm-modal-close"
              onClick={() => setRequestTarget(null)}
            >
              ×
            </button>

            <h2>Send Connection Request</h2>
            <p>
              You're sending a connection request to{" "}
              <strong>{requestTarget.name}</strong>.
            </p>

            <label className="fm-label" htmlFor="connection-message">
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

            <div className="fm-request-modal-actions">
              <button
                className="fm-view-button"
                onClick={() => setRequestTarget(null)}
              >
                Cancel
              </button>

              <button
                className="fm-connect-button"
                onClick={sendConnectionRequest}
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FindTeammates;
