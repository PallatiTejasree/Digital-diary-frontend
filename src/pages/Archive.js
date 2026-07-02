import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/archive.css";

function Archive() {
  const navigate = useNavigate();

  const [memories, setMemories] = useState([]);

  useEffect(() => {
    fetchArchivedMemories();
  }, []);

  const fetchArchivedMemories = async () => {
    const token = localStorage.getItem("token");

    const response = await fetch(
      "http://127.0.0.1:8000/diary/",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    const archived = data.filter(
      (memory) => memory.is_archived
    );

    setMemories(archived);
  };

  return (
    <div className="archivePage">
      <div className="archiveHeader">
        <div>
          <h1 className="archiveTitle">
            📦 Archived Memories
          </h1>

          <p className="archiveSubtitle">
            Memories safely stored for later.
          </p>
        </div>

        <button
          className="backBtn"
          onClick={() => navigate("/editor")}
        >
          ← Back
        </button>
      </div>

      {memories.length === 0 ? (
        <div className="emptyArchive">
          <h1>📦</h1>

          <h2>No Archived Memories</h2>

          <p>
            Archive a memory and it will appear here.
          </p>
        </div>
      ) : (
        <div className="archiveGrid">
          {memories.map((memory) => (
            <div
              key={memory.id}
              className="archiveCard"
            >
              <h3>{memory.title}</h3>

              <p>{memory.content}</p>

              <div className="archiveCategory">
                📂 {memory.category || "Uncategorized"}
              </div>
              <button
  className="backBtn"
  style={{
    marginTop: "15px",
  }}
  onClick={async () => {
    const token = localStorage.getItem("token");

    await fetch(
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
          is_archived: false,
        }),
      }
    );

    fetchArchivedMemories();
  }}
>
  📂 Restore
</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Archive;