import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/splash.css";

import cloud from "../assets/images/cloud1.png";
// <-- your cloud image
function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 6000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="splashPage">
      {/* Stars */}

      <div className="stars"></div>

      {/* Clouds */}

      <img src={cloud} className="cloud cloud1" alt="" />
      <img src={cloud} className="cloud cloud2" alt="" />
      <img src={cloud} className="cloud cloud3" alt="" />
      <img src={cloud} className="cloud cloud4" alt="" />
      <img src={cloud} className="cloud cloud5" alt="" />

      {/* Center */}

      <div className="centerContent">
        <div className="bookIcon">📖</div>

        <h1>Whisper Pages</h1>

        <p className="subtitle">Small moments become beautiful stories.</p>

        <p className="loadingText">✨ Opening your diary...</p>
      </div>
    </div>
  );
}

export default Splash;
