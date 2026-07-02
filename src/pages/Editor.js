import { useState, useEffect } from "react";
import {
  useNavigate,
  useLocation,
} from "react-router-dom";

import "../styles/editor.css";

function Editor() {
  const navigate = useNavigate();
  const location = useLocation();

  // =============================
  // STATES
  // =============================

  const [username, setUsername] = useState("Friend");

  const [showPaper, setShowPaper] = useState(false);

  const [selectedMood, setSelectedMood] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [memories, setMemories] = useState([]);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  const [memoryToDelete, setMemoryToDelete] =
    useState(null);

  const [selectedFilterMood, setSelectedFilterMood] =
    useState("All");

  const [
    selectedCategoryFilter,
    setSelectedCategoryFilter,
  ] = useState("All");

  // =============================
  // LOAD USER + MEMORIES
  // =============================

  const fetchData = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      // Current User
      const userRes = await fetch(
        "http://127.0.0.1:8000/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!userRes.ok) {
        navigate("/login");
        return;
      }

      const user = await userRes.json();

      setUsername(user.name);

      // Memories
      const diaryRes = await fetch(
        "http://127.0.0.1:8000/diary/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (diaryRes.ok) {
        const diaryData = await diaryRes.json();

        setMemories(diaryData);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Load once
  useEffect(() => {
    fetchData();
  }, []);

  // Open paper from Home page
  useEffect(() => {
    if (location.search.includes("new=true")) {
      setShowPaper(true);
    }
  }, [location.search]);

  // =============================
  // MOOD NAMES
  // =============================

  const moodNames = {
    "😊": "Happy",
    "😌": "Calm",
    "🤩": "Excited",
    "🥹": "Grateful",
    "💜": "Loved",
    "😢": "Sad",
    "😡": "Angry",
    "😰": "Anxious",
    "😴": "Tired",
    "🤔": "Thoughtful",
    "✨": "Motivated",
    "🌸": "Peaceful",
  };

  // =============================
  // STATS
  // =============================

  const latestMood =
    memories.length > 0
      ? memories[0].mood
      : "";

  const thisMonthEntries = memories.filter(
    (memory) => {
      const date = new Date(memory.created_at);
      const today = new Date();

      return (
        date.getMonth() === today.getMonth() &&
        date.getFullYear() ===
          today.getFullYear()
      );
    }
  ).length;

  // =============================
  // FILTERED MEMORIES
  // =============================

  const filteredMemories = [...memories]
    .sort((a, b) => b.is_favorite - a.is_favorite)
    .filter((memory) => {
      const matchesSearch =
        memory.title
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        memory.content
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesMood =
        selectedFilterMood === "All" ||
        memory.mood === selectedFilterMood;

      const matchesCategory =
        selectedCategoryFilter === "All" ||
        memory.category ===
          selectedCategoryFilter;

      const notArchived =
        !memory.is_archived;

      return (
        matchesSearch &&
        matchesMood &&
        matchesCategory &&
        notArchived
      );
    });

  // =============================
  // HELPERS
  // =============================

  function capitalize(name) {
    if (!name) return "Friend";

    return (
      name.charAt(0).toUpperCase() +
      name.slice(1).toLowerCase()
    );
  }

  function openNewMemory() {
    setEditingId(null);

    setSelectedMood("");
    setSelectedCategory("");

    setTitle("");
    setContent("");

    setShowPaper(true);
  }

  function editMemory(memory) {
    setEditingId(memory.id);

    setSelectedMood(memory.mood || "");
    setSelectedCategory(
      memory.category || ""
    );

    setTitle(memory.title);
    setContent(memory.content);

    setShowPaper(true);
  }
// =============================
// SAVE MEMORY
// =============================

const saveMemory = async () => {
  if (content.trim() === "") {
    alert("Please write something first.");
    return;
  }

  const token = localStorage.getItem("token");

  try {
    let response;

    const payload = {
      title:
        title.trim() === ""
          ? "Untitled Memory"
          : title,
      content,
      mood: selectedMood,
      category: selectedCategory,
    };

    if (editingId) {
      response = await fetch(
        `http://127.0.0.1:8000/diary/${editingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );
    } else {
      response = await fetch(
        "http://127.0.0.1:8000/diary/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );
    }

    if (!response.ok) {
      alert("Failed to save memory.");
      return;
    }

    await fetchData();

    setShowPaper(false);
    setEditingId(null);

    setSelectedMood("");
    setSelectedCategory("");

    setTitle("");
    setContent("");
  } catch (err) {
    console.log(err);
    alert("Server error.");
  }
};

// =============================
// DELETE MEMORY
// =============================

const deleteMemory = async (id) => {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(
      `http://127.0.0.1:8000/diary/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      alert("Failed to delete memory.");
      return;
    }

    await fetchData();
  } catch (err) {
    console.log(err);
    alert("Server error.");
  }
};

// =============================
// FAVORITE
// =============================

const toggleFavorite = async (memory) => {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(
      `http://127.0.0.1:8000/diary/${memory.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: memory.title,
          content: memory.content,
          mood: memory.mood,
          category: memory.category,
          is_favorite: !memory.is_favorite,
          is_archived: memory.is_archived,
        }),
      }
    );

    if (!response.ok) {
      alert("Failed to update favorite.");
      return;
    }

    await fetchData();
  } catch (err) {
    console.log(err);
  }
};

// =============================
// ARCHIVE
// =============================

const toggleArchive = async (memory) => {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(
      `http://127.0.0.1:8000/diary/${memory.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: memory.title,
          content: memory.content,
          mood: memory.mood,
          category: memory.category,
          is_favorite: memory.is_favorite,
          is_archived: !memory.is_archived,
        }),
      }
    );

    if (!response.ok) {
      alert("Failed to archive memory.");
      return;
    }

    await fetchData();
  } catch (err) {
    console.log(err);
  }
};
// -----------------------------
// RETURN
// -----------------------------

return (
  <div className="editorPage">

    {/* ================= HEADER ================= */}

    <div className="header">

      <div className="headerText">
        <h1>Welcome Back</h1>

        <h2>{capitalize(username)}</h2>

        <p>Your memories deserve a beautiful home.</p>
      </div>

      <div className="headerButtons">

        <button
          className="newButton"
          onClick={openNewMemory}
        >
          ✨ New Memory
        </button>

        <button
          className="reflectionButton"
          onClick={() => navigate("/reflection")}
        >
          🌸 Reflection
        </button>

        <button
          className="reflectionButton"
          onClick={() => navigate("/profile")}
        >
          👤 Profile
        </button>

        <button
          className="reflectionButton"
          onClick={() => navigate("/archive")}
        >
          📦 Archive
        </button>

      </div>

    </div>

    {/* ================= STATS ================= */}

    <div className="stats">

      <div className="card">
        <h2 className="cardEmoji">
          {latestMood || "🌸"}
        </h2>

        <h3>
          {moodNames[latestMood] || "No Mood Yet"}
        </h3>

        <p>
          {latestMood
            ? "Based on your latest memory"
            : "Write your first memory"}
        </p>
      </div>

      <div className="card">
  <div className="calendar">
    <div className="calendar-month">
      {new Date().toLocaleString("default", { month: "short" })}
    </div>

    <div className="calendar-date">
      {new Date().getDate()}
    </div>
  </div>

  <h3>
    {new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })}
  </h3>

  <p>{thisMonthEntries} Entries</p>
</div>
      <div className="card">
        <h3>📖 Memories</h3>
        <p>{memories.length}</p>
      </div>

      <div className="card">
        <h3>🔥 Streak</h3>

        <p>
          {memories.length > 0
            ? "Keep Writing"
            : "Start Today"}
        </p>
      </div>

    </div>

    {/* ================= TIMELINE ================= */}

    <div className="timelineSection">

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="🔍 Search your memories..."
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "12px",
            border: "1px solid #ddd",
            fontSize: "16px",
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
          marginBottom: "25px",
        }}
      >
        {[
          "All",
          "😊",
          "😌",
          "🤩",
          "🥹",
          "💜",
          "😢",
          "😡",
          "😰",
          "😴",
          "🤔",
          "✨",
          "🌸",
        ].map((mood) => (

          <button
            key={mood}
            onClick={() =>
              setSelectedFilterMood(mood)
            }
            style={{
              width: "60px",
              height: "60px",
              border: "none",
              borderRadius: "16px",
              cursor: "pointer",

              fontSize:
                mood === "All"
                  ? "14px"
                  : "24px",

              background:
                selectedFilterMood === mood
                  ? "#7d4c9e"
                  : "#f5effc",

              color:
                selectedFilterMood === mood
                  ? "white"
                  : "#7d4c9e",
            }}
          >
            {mood}
          </button>

        ))}
      </div>

      <div
        style={{
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
          marginBottom: "25px",
        }}
      >

        {[
          "All",
          "Personal",
          "Work",
          "Travel",
          "Family",
          "Dreams",
        ].map((category) => (

          <button
            key={category}
            onClick={() =>
              setSelectedCategoryFilter(category)
            }
            style={{
              padding: "10px 20px",
              border: "none",
              borderRadius: "12px",

              cursor: "pointer",

              background:
                selectedCategoryFilter ===
                category
                  ? "#7d4c9e"
                  : "#f5effc",

              color:
                selectedCategoryFilter ===
                category
                  ? "white"
                  : "#7d4c9e",
            }}
          >
            {category}
          </button>

        ))}

      </div>

      <h2>Your Timeline</h2>

      {filteredMemories.length === 0 ? (

        <div className="timelineEmpty">

          <h1>📖</h1>

          <h2>Your story hasn't begun yet</h2>

          <p>
            Press <strong>New Memory</strong>
            <br />
            to write your first page.
          </p>

        </div>

      ) : (

        filteredMemories.map((memory) => (

          <div
            className="timelineItem"
            key={memory.id}
            onClick={() => editMemory(memory)}
          >

            <div className="timelineMood">
              {memory.mood || "📖"}
            </div>

            <div
              className="recentContent"
              style={{ flex: 1 }}
            >

              <h3>

                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(memory);
                  }}
                  style={{
                    cursor: "pointer",
                    marginRight: "8px",
                    fontSize: "24px",
                  }}
                >
                  {memory.is_favorite
                    ? "⭐"
                    : "☆"}
                </span>

                {memory.title}

              </h3>

              {memory.category && (

                <p
                  style={{
                    marginTop: "6px",
                    color: "#7d4c9e",
                    fontWeight: "600",
                    fontSize: "14px",
                  }}
                >
                  📂 {memory.category}
                </p>

              )}

              <p className="preview">

                {memory.content.length > 120
                  ? memory.content.substring(
                      0,
                      120
                    ) + "..."
                  : memory.content}

              </p>

              <small>

                {new Date(
                  memory.created_at
                ).toLocaleDateString()}

                {" • "}

                {new Date(
                  memory.created_at
                ).toLocaleTimeString()}

              </small>

            </div>

            <div
              className="timelineActions"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              <button
                className="reflectionButton"
                onClick={() =>
                  toggleArchive(memory)
                }
              >
                {memory.is_archived
                  ? "📂 Restore"
                  : "📦 Archive"}
              </button>

              <button
                className="deleteBtn"
                onClick={() => {
                  setMemoryToDelete(memory.id);
                  setShowDeleteModal(true);
                }}
              >
                🗑 Delete
              </button>

            </div>

          </div>

        ))

      )}

    </div>
          {/* ================= JOURNEY ================= */}

      {memories.length > 0 && (
        <div className="journeyCard">
          <h2>🌱 Your Writing Journey</h2>

          <p>
            You have written
            <strong> {memories.length} </strong>

            {memories.length === 1
              ? "memory"
              : "memories"}{" "}

            so far.
          </p>

          <p>
            Keep writing consistently to build
            your own collection of beautiful
            moments and reflections.
          </p>
        </div>
      )}

      {/* ================= NEW MEMORY MODAL ================= */}

      {showPaper && (
        <div className="paperOverlay">
          <div className="paper">

            <button
              className="closeBtn"
              onClick={() => {
                setShowPaper(false);
                setEditingId(null);
                setSelectedMood("");
                setSelectedCategory("");
                setTitle("");
                setContent("");
              }}
            >
              ✕
            </button>

            <h1>
              {editingId
                ? "Edit Memory"
                : "New Memory"}
            </h1>

            <p className="moodTitle">
              How are you feeling today?
            </p>

            <div className="moodGrid">
              {[
                "😊",
                "😌",
                "🤩",
                "🥹",
                "💜",
                "😢",
                "😡",
                "😰",
                "😴",
                "🤔",
                "✨",
                "🌸",
              ].map((emoji) => (
                <button
                  key={emoji}
                  className={`moodChip ${
                    selectedMood === emoji
                      ? "selectedMood"
                      : ""
                  }`}
                  onClick={() =>
                    setSelectedMood(emoji)
                  }
                >
                  {emoji}
                </button>
              ))}
            </div>

            <select
              className="titleInput"
              value={selectedCategory}
              onChange={(e) =>
                setSelectedCategory(e.target.value)
              }
            >
              <option value="">
                Select Category
              </option>

              <option value="Personal">
                Personal
              </option>

              <option value="Work">
                Work
              </option>

              <option value="Travel">
                Travel
              </option>

              <option value="Family">
                Family
              </option>

              <option value="Dreams">
                Dreams
              </option>
            </select>

            <input
              className="titleInput"
              placeholder="Give this memory a title..."
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
            />

            <textarea
              className="memoryArea"
              placeholder="Start writing your thoughts..."
              value={content}
              onChange={(e) =>
                setContent(e.target.value)
              }
            />

            <div className="saveSection">
              <button
                className="saveButton"
                onClick={saveMemory}
              >
                {editingId
                  ? "💜 Update Memory"
                  : "💜 Save Memory"}
              </button>
            </div>

            <div
              style={{
                marginTop: "20px",
                textAlign: "center",
                color: "#999",
                fontSize: "14px",
              }}
            >
              {editingId
                ? "Editing an existing memory."
                : "Your memory will be securely saved."}
            </div>

          </div>
        </div>
      )}

      {/* ================= DELETE MODAL ================= */}

      {showDeleteModal && (
        <div className="paperOverlay">

          <div
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "20px",
              width: "400px",
              textAlign: "center",
            }}
          >

            <h2>🗑 Delete Memory?</h2>

            <p>
              This action cannot be undone.
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "15px",
                marginTop: "25px",
              }}
            >

              <button
                className="deleteBtn"
                onClick={() => {
                  deleteMemory(memoryToDelete);
                  setShowDeleteModal(false);
                  setMemoryToDelete(null);
                }}
              >
                Delete
              </button>

              <button
                className="reflectionButton"
                onClick={() => {
                  setShowDeleteModal(false);
                  setMemoryToDelete(null);
                }}
              >
                Cancel
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default Editor;