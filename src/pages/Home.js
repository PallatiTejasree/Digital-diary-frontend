import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "../styles/home.css";
import IntroAnimation from "../components/IntroAnimation";

function Home() {
  const navigate = useNavigate();

  const [playIntro, setPlayIntro] = useState(false);
  const [username, setUsername] = useState("Friend");

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(
          "http://127.0.0.1:8000/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          navigate("/login");
          return;
        }

        const data = await response.json();

        setUsername(data.name);
      } catch (error) {
        console.error(error);
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

  function capitalize(name) {
    if (!name) return "Friend";

    return (
      name.charAt(0).toUpperCase() +
      name.slice(1).toLowerCase()
    );
  }

  function getGreeting() {
    const hour = new Date().getHours();

    if (hour < 12) return "Good Morning ☀️";
    if (hour < 17) return "Good Afternoon 🌤️";
    if (hour < 21) return "Good Evening 🌸";

    return "Good Night 🌙";
  }

  const quotes = [
    "Every story deserves a beautiful beginning.",
    "Some memories deserve forever.",
    "Write honestly. Your diary is listening.",
    "Your thoughts are always welcome here.",
    "Today is another page waiting to be written.",
  ];

  const randomQuote =
    quotes[new Date().getDate() % quotes.length];

  return (
    <>
      <div
        className="home"
        style={{
          filter: playIntro ? "blur(8px)" : "none",
          transition: "0.5s",
        }}
      >
        {/* HERO */}

        <div className="hero">
          <h1>{getGreeting()}</h1>

          <h2>
            Welcome back, {capitalize(username)}
          </h2>

          <p className="subtitle">
            {randomQuote}
          </p>
        </div>

        {/* MAIN CARD */}

        <div className="centerCard">
          <div className="bookEmoji">
            📖
          </div>

          <h2>Your diary is waiting.</h2>

          <p>
            Every great story begins with a blank
            page. Write your dreams, victories,
            fears and memories.
          </p>

          <button
            className="startButton"
            onClick={() => setPlayIntro(true)}
          >
            Begin a New Memory ✨
          </button>
        </div>

        {/* TIMELINE */}

        <div
          className="timelineCard"
          onClick={() => navigate("/editor")}
          style={{ cursor: "pointer" }}
        >
          📅 View Timeline
        </div>
      </div>

      {/* INTRO ANIMATION */}

      {playIntro && (
        <IntroAnimation
          onFinish={() =>
            navigate("/editor?new=true")
          }
        />
      )}
    </>
  );
}

export default Home;