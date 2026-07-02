import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/reflection.css";

function Reflection() {
  const navigate = useNavigate();

  // -----------------------------
  // STATES
  // -----------------------------

  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);

  // -----------------------------
  // FETCH MEMORIES FROM BACKEND
  // -----------------------------

  useEffect(() => {
    fetchMemories();
  }, []);

  const fetchMemories = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/diary/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        navigate("/login");
        return;
      }

      const data = await response.json();

      setMemories(data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  if (loading) {
    return <h2>Loading...</h2>;
  }

  // -----------------------------
  // MOOD NAMES
  // -----------------------------

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

  // -----------------------------
  // MOOD QUOTES
  // -----------------------------

  const moodQuotes = {
    "😊": "Keep smiling. Your joy brightens more lives than you know.",
    "😌": "Peace is found in slowing down.",
    "🤩": "Excitement today becomes tomorrow's memories.",
    "🥹": "Gratitude turns little moments into treasures.",
    "💜": "Love leaves beautiful footprints forever.",
    "😢": "Even the darkest nights welcome the sunrise.",
    "😡": "Strength is choosing peace.",
    "😰": "You've survived every hard day so far.",
    "😴": "Rest prepares you for tomorrow.",
    "🤔": "Reflection creates wisdom.",
    "✨": "Small steps create extraordinary journeys.",
    "🌸": "Growth happens quietly.",
  };

  // -----------------------------
  // LATEST MEMORY
  // -----------------------------

  const latestMemory =
    memories.length > 0 ? memories[0] : null;

  const latestMood = latestMemory?.mood || "";

  // -----------------------------
  // FIRST MEMORY
  // -----------------------------

  const firstMemory =
    memories.length > 0
      ? memories[memories.length - 1]
      : null;

  // -----------------------------
  // THIS MONTH ENTRIES
  // -----------------------------

  const thisMonthEntries = memories.filter((m) => {
    const d = new Date(m.created_at);
    const today = new Date();

    return (
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  }).length;

  // -----------------------------
  // TOTAL WORDS
  // -----------------------------

  const totalWords = memories.reduce(
    (sum, m) =>
      sum +
      (m.content
        ? m.content.trim().split(/\s+/).length
        : 0),
    0
  );

  // -----------------------------
  // MOOD COUNTS
  // -----------------------------

  const moodStats = {};

  memories.forEach((memory) => {
    if (memory.mood) {
      moodStats[memory.mood] =
        (moodStats[memory.mood] || 0) + 1;
    }
  });

  const mostUsedMood =
    Object.keys(moodStats).length > 0
      ? Object.keys(moodStats).sort(
          (a, b) => moodStats[b] - moodStats[a]
        )[0]
      : "";
const categoryStats = {};

memories.forEach((memory) => {
  if (memory.category) {
    categoryStats[memory.category] =
      (categoryStats[memory.category] || 0) + 1;
  }
});

const topCategory =
  Object.keys(categoryStats).length > 0
    ? Object.keys(categoryStats).sort(
        (a, b) =>
          categoryStats[b] - categoryStats[a]
      )[0]
    : "General";
  // -----------------------------
  // LOGOUT
  // -----------------------------

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("email");

    navigate("/");
  }
    return (
    <div className="reflectionPage">
      <h1>🌸 Reflection</h1>

      <p className="subtitle">
        Every page you write becomes a piece of your journey.
      </p>

      {/* HERO */}

      <div className="heroCard">
        <h2>{latestMood || "🌸"}</h2>

        <h3>{moodNames[latestMood] || "No Mood Yet"}</h3>

        <span className="heroSmall">
          {latestMood ? "Current Mood" : "Write your first memory"}
        </span>

        <p>
          {moodQuotes[latestMood] ||
            "Every masterpiece begins with a single blank page."}
        </p>
      </div>

      {/* STATS */}

      <div className="statsGrid">
        <div className="statBox">
          <h2>📖</h2>
          <h3>{memories.length}</h3>
          <p>Total Memories</p>
        </div>

        <div className="statBox">
          <h2>📅</h2>
          <h3>{thisMonthEntries}</h3>
          <p>This Month</p>
        </div>

        <div className="statBox">
          <h2>{latestMood || "🌸"}</h2>
          <h3>{moodNames[latestMood] || "None"}</h3>
          <p>Current Mood</p>
        </div>

        <div className="statBox">
          <h2>{mostUsedMood || "🌸"}</h2>
          <h3>{moodNames[mostUsedMood] || "None"}</h3>
          <p>Most Frequent Mood</p>
        </div>
      </div>

      {/* MOOD SUMMARY */}

      <div className="moodSummary">
        <h2>🌈 Mood Journey</h2>

        {Object.keys(moodStats).length === 0 ? (
          <p>No moods recorded yet.</p>
        ) : (
          Object.entries(moodStats)
            .sort((a, b) => b[1] - a[1])
            .map(([emoji, count]) => (
              <div className="moodRow" key={emoji}>
                <span className="moodLeft">
                  {emoji} {moodNames[emoji]}
                </span>

                <span className="moodRight">
                  {count}
                </span>
              </div>
            ))
        )}
      </div>

<div className="journeyCard">
  <h2>📊 Mood Analytics</h2>

  <p>
    Total Different Moods:
    <strong>
      {" "}
      {Object.keys(moodStats).length}
    </strong>
  </p>

  <p>
    Most Used Mood:
    <strong>
      {" "}
      {mostUsedMood}{" "}
      {moodNames[mostUsedMood]}
    </strong>
  </p>

  <p>
    Total Words Written:
    <strong> {totalWords}</strong>
  </p>

  <p>
    Memories This Month:
    <strong> {thisMonthEntries}</strong>
  </p>
</div>

      {/* LATEST MEMORY */}

      <div className="latestCard">
        <h2>📝 Latest Memory</h2>

        {latestMemory ? (
          <>
            <h3>{latestMemory.title}</h3>

            <p className="latestPreview">
              {latestMemory.content.length > 250
                ? latestMemory.content.substring(
                    0,
                    250
                  ) + "..."
                : latestMemory.content}
            </p>

            <span>
              {new Date(
                latestMemory.created_at
              ).toLocaleString()}
            </span>
          </>
        ) : (
          <p>Your latest memory will appear here.</p>
        )}
      </div>

      {/* RECENT MEMORIES */}

      {memories.length > 0 && (
        <div className="recentSection">
          <h2>📚 Recent Memories</h2>

          {memories.slice(0, 5).map((memory) => (
            <div
              key={memory.id}
              className="recentItem"
            >
              <span className="recentEmoji">
                {memory.mood || "📖"}
              </span>

              <div className="recentContent">
                <h4>{memory.title}</h4>

                <p>
                  {memory.content.length > 80
                    ? memory.content.substring(
                        0,
                        80
                      ) + "..."
                    : memory.content}
                </p>

                <small>
                  {new Date(
                    memory.created_at
                  ).toLocaleString()}
                </small>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* WRITING INSIGHT */}

      {/* WRITING INSIGHT */}

<div className="quote">
  <h2>🤖 AI Reflection Insight</h2>

  {memories.length === 0 ? (
    <p>
      Your diary is waiting for its first page.
      Start writing to discover patterns in your
      emotions and experiences.
    </p>
  ) : (
    <>
      <p>
        You have written{" "}
        <strong>{memories.length}</strong>{" "}
        memories containing{" "}
        <strong>{totalWords}</strong> words.
      </p>

      <p>
        Your most common mood is{" "}
        <strong>
          {mostUsedMood}{" "}
          {moodNames[mostUsedMood]}
        </strong>.
      </p>

      <p>
        Your most common category is{" "}
        <strong>{topCategory}</strong>.
      </p>

      <p>
        {mostUsedMood === "😊" &&
          "You generally write from a positive and optimistic mindset."}

        {mostUsedMood === "✨" &&
          "Your journal reflects ambition, motivation and personal growth."}

        {mostUsedMood === "😌" &&
          "Your entries suggest a calm and balanced emotional state."}

        {mostUsedMood === "💜" &&
          "Relationships and meaningful connections seem important to you."}

        {mostUsedMood === "🤔" &&
          "You spend time reflecting deeply on your experiences and decisions."}

        {mostUsedMood === "🥹" &&
          "Your writing often highlights gratitude and appreciation."}
      </p>

      <p>
        Keep writing consistently. Over time,
        your diary will reveal valuable patterns
        about your emotions, goals and growth.
      </p>
    </>
  )}
</div>

      {/* BUTTONS */}

      <div className="buttons">
        <button
          className="writeBtn"
          onClick={() => navigate("/editor")}
        >
          ✨ Write New Memory
        </button>

        <button
          className="logoutBtn"
          onClick={handleLogout}
        >
          🚪 Sign Out
        </button>
      </div>
    </div>
  );
}

export default Reflection;