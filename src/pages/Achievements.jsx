import { useState } from "react";
import { Link } from "react-router-dom";
import {
  getStudentById,
  saveStudentProfile,
} from "../data/students";
import { CURRENT_STUDENT_ID } from "../data/currentStudent";
import "./Achievements.css";

function normalizeAchievements(items = []) {
  return items.map((item, index) => {
    if (typeof item === "string") {
      return {
        id: `achievement-${index}`,
        title: item,
        description: "",
        date: "",
      };
    }

    return {
      id: item.id || `achievement-${index}`,
      title: item.title || item.name || "",
      description: item.description || "",
      date: item.date || "",
    };
  });
}

function normalizeCertifications(items = []) {
  return items.map((item, index) => {
    if (typeof item === "string") {
      return {
        id: `certification-${index}`,
        name: item,
        issuer: "",
        date: "",
      };
    }

    return {
      id: item.id || `certification-${index}`,
      name: item.name || item.title || "",
      issuer: item.issuer || "",
      date: item.date || "",
    };
  });
}

function Achievements() {
  const student = getStudentById(Number(CURRENT_STUDENT_ID));

  const [achievements, setAchievements] = useState(() =>
    normalizeAchievements(student?.achievements || [])
  );

  const [certifications, setCertifications] = useState(() =>
    normalizeCertifications(student?.certifications || [])
  );

  const [activeTab, setActiveTab] = useState("achievements");
  const [editingId, setEditingId] = useState(null);
  const [formOpen, setFormOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    name: "",
    issuer: "",
    date: "",
  });

  const isAchievement = activeTab === "achievements";

  function resetForm() {
    setFormData({
      title: "",
      description: "",
      name: "",
      issuer: "",
      date: "",
    });
    setEditingId(null);
    setFormOpen(false);
  }

  function openAddForm() {
    resetForm();
    setFormOpen(true);
  }

  function openEditForm(item) {
    setEditingId(item.id);
    setFormData({
      title: item.title || "",
      description: item.description || "",
      name: item.name || "",
      issuer: item.issuer || "",
      date: item.date || "",
    });
    setFormOpen(true);
  }

  function handleInputChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (isAchievement) {
      const updatedAchievements = editingId
        ? achievements.map((item) =>
            item.id === editingId
              ? { ...item, ...formData, title: formData.title.trim() }
              : item
          )
        : [
            ...achievements,
            {
              id: `achievement-${Date.now()}`,
              title: formData.title.trim(),
              description: formData.description.trim(),
              date: formData.date,
            },
          ];

      setAchievements(updatedAchievements);
      saveStudentProfile(CURRENT_STUDENT_ID, {
        achievements: updatedAchievements,
      });
    } else {
      const updatedCertifications = editingId
        ? certifications.map((item) =>
            item.id === editingId
              ? { ...item, ...formData, name: formData.name.trim() }
              : item
          )
        : [
            ...certifications,
            {
              id: `certification-${Date.now()}`,
              name: formData.name.trim(),
              issuer: formData.issuer.trim(),
              date: formData.date,
            },
          ];

      setCertifications(updatedCertifications);
      saveStudentProfile(CURRENT_STUDENT_ID, {
        certifications: updatedCertifications,
      });
    }

    resetForm();
  }

  function handleDelete(id) {
    const confirmed = window.confirm(
      `Are you sure you want to delete this ${
        isAchievement ? "achievement" : "certification"
      }?`
    );

    if (!confirmed) return;

    if (isAchievement) {
      const updatedAchievements = achievements.filter(
        (item) => item.id !== id
      );

      setAchievements(updatedAchievements);
      saveStudentProfile(CURRENT_STUDENT_ID, {
        achievements: updatedAchievements,
      });
    } else {
      const updatedCertifications = certifications.filter(
        (item) => item.id !== id
      );

      setCertifications(updatedCertifications);
      saveStudentProfile(CURRENT_STUDENT_ID, {
        certifications: updatedCertifications,
      });
    }

    if (editingId === id) resetForm();
  }

  return (
    <main className="achievements-page">
      <div className="achievements-container">
        <Link to="/profile" className="achievements-back-link">
          ← Back to Profile
        </Link>

        <div className="achievements-header">
          <div>
            <p className="achievements-eyebrow">YOUR PROFILE</p>
            <h1>Achievements & Certifications</h1>
            <p>
              Showcase your accomplishments, recognitions and learning
              milestones.
            </p>
          </div>
        </div>

        <div className="achievements-tabs">
          <button
            className={isAchievement ? "active" : ""}
            onClick={() => {
              setActiveTab("achievements");
              resetForm();
            }}
          >
            Achievements
            <span>{achievements.length}</span>
          </button>

          <button
            className={!isAchievement ? "active" : ""}
            onClick={() => {
              setActiveTab("certifications");
              resetForm();
            }}
          >
            Certifications
            <span>{certifications.length}</span>
          </button>
        </div>

        <section className="achievements-content">
          <div className="achievements-section-heading">
            <div>
              <h2>
                {isAchievement ? "Your Achievements" : "Your Certifications"}
              </h2>
              <p>
                {isAchievement
                  ? "Add awards, hackathon participation and other accomplishments."
                  : "Add certificates and courses you have completed."}
              </p>
            </div>

            <button
              className="achievement-add-button"
              onClick={openAddForm}
            >
              + Add {isAchievement ? "Achievement" : "Certification"}
            </button>
          </div>

          {formOpen && (
            <form className="achievement-form" onSubmit={handleSubmit}>
              <h3>
                {editingId ? "Edit" : "Add"}{" "}
                {isAchievement ? "Achievement" : "Certification"}
              </h3>

              {isAchievement ? (
                <>
                  <label>
                    Achievement title *
                    <input
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="e.g. First Prize - National Hackathon"
                      required
                    />
                  </label>

                  <label>
                    Description
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Briefly describe your achievement"
                      rows="3"
                    />
                  </label>
                </>
              ) : (
                <>
                  <label>
                    Certification name *
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Java Programming"
                      required
                    />
                  </label>

                  <label>
                    Issuing organisation
                    <input
                      name="issuer"
                      value={formData.issuer}
                      onChange={handleInputChange}
                      placeholder="e.g. Oracle, Coursera"
                    />
                  </label>
                </>
              )}

              <label>
                Date
                <input
                  type="month"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                />
              </label>

              <div className="achievement-form-actions">
                <button type="submit" className="achievement-save-button">
                  {editingId ? "Save Changes" : "Add"}
                </button>

                <button
                  type="button"
                  className="achievement-cancel-button"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {isAchievement ? (
            achievements.length > 0 ? (
              <div className="achievement-list">
                {achievements.map((item) => (
                  <article className="achievement-card" key={item.id}>
                    <div className="achievement-card-icon">🏆</div>

                    <div className="achievement-card-info">
                      <h3>{item.title}</h3>
                      {item.description && <p>{item.description}</p>}
                      {item.date && (
                        <span>
                          {new Date(`${item.date}-01T00:00:00`).toLocaleDateString(
                            "en-US",
                            { month: "long", year: "numeric" }
                          )}
                        </span>
                      )}
                    </div>

                    <div className="achievement-card-actions">
                      <button onClick={() => openEditForm(item)}>Edit</button>
                      <button onClick={() => handleDelete(item.id)}>
                        Delete
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="achievement-empty-state">
                <div>🏆</div>
                <h3>No achievements added yet</h3>
                <p>
                  Your awards, recognitions and accomplishments will appear
                  here.
                </p>
                <button onClick={openAddForm}>Add Your First Achievement</button>
              </div>
            )
          ) : certifications.length > 0 ? (
            <div className="achievement-list">
              {certifications.map((item) => (
                <article className="achievement-card" key={item.id}>
                  <div className="achievement-card-icon">📜</div>

                  <div className="achievement-card-info">
                    <h3>{item.name}</h3>
                    {item.issuer && <p>{item.issuer}</p>}
                    {item.date && (
                      <span>
                        {new Date(`${item.date}-01T00:00:00`).toLocaleDateString(
                          "en-US",
                          { month: "long", year: "numeric" }
                        )}
                      </span>
                    )}
                  </div>

                  <div className="achievement-card-actions">
                    <button onClick={() => openEditForm(item)}>Edit</button>
                    <button onClick={() => handleDelete(item.id)}>
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="achievement-empty-state">
              <div>📜</div>
              <h3>No certifications added yet</h3>
              <p>
                Add your completed courses and certifications to showcase
                your learning.
              </p>
              <button onClick={openAddForm}>Add Your First Certification</button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default Achievements;