import { useEffect, useState } from "react";
import "./IntroAnimation.css";

import closedDesk from "../assets/images/desk_close.png";
import openDesk from "../assets/images/desk_open.png";

function IntroAnimation({ onFinish }) {
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    // Zoom into closed diary for 3.5 seconds
    const openTimer = setTimeout(() => {
      setOpened(true);
    }, 3500);

    // Show opened diary briefly and then go to editor
    const finishTimer = setTimeout(() => {
      onFinish();
    }, 4700);

    return () => {
      clearTimeout(openTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div className="introContainer">
      <img
        src={closedDesk}
        alt="Closed Diary"
        className={`deskImage closed ${opened ? "fadeOut" : ""}`}
        draggable={false}
      />

      <img
        src={openDesk}
        alt="Open Diary"
        className={`deskImage open ${opened ? "fadeIn" : ""}`}
        draggable={false}
      />
    </div>
  );
}

export default IntroAnimation;
