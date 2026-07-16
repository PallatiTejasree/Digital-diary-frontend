import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE from "../api";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [memoryCount, setMemoryCount] = useState(0);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        // User data
        const response = await fetch(
          `${API_BASE}/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        setUser(data);

        // Diary data
        const diaryResponse = await fetch(
          "http://127.0.0.1:8000/diary/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (diaryResponse.ok) {
          const memories = await diaryResponse.json();
          setMemoryCount(memories.length);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchUser();
  }, [navigate]);

  if (!user) return <h2>Loading...</h2>;

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px",
        background:
          "linear-gradient(135deg, #fffdf8, #f8f1ff, #fff7eb)",
      }}
    >
      <div
        style={{
          maxWidth: "700px",
          margin: "0 auto",
          background: "rgba(255,255,255,0.8)",
          padding: "40px",
          borderRadius: "30px",
          boxShadow: "0 15px 35px rgba(0,0,0,0.08)",
          textAlign: "center",
        }}
      >
        <h1>👤 Profile</h1>

        <h2>{user.name}</h2>

        <p>Email: {user.email || "Not Available"}</p>

        <hr style={{ margin: "25px 0" }} />

        <h3>Total Memories: {memoryCount}</h3>

        <h3>📖 Digital Diary User</h3>

        <p>
          Thank you for capturing your memories and
          reflections.
        </p>

        <div style={{ marginTop: "30px" }}>
          <button
            onClick={() => navigate("/editor")}
            style={{
              padding: "12px 25px",
              border: "none",
              borderRadius: "12px",
              background: "#7b4b94",
              color: "white",
              cursor: "pointer",
              marginRight: "10px",
            }}
          >
            📖 Back to Diary
          </button>

          <button
            onClick={() => navigate("/reflection")}
            style={{
              padding: "12px 25px",
              border: "none",
              borderRadius: "12px",
              background: "#f3d8ff",
              color: "#7b4b94",
              cursor: "pointer",
            }}
          >
            🌸 Reflection
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;