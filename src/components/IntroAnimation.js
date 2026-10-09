import { useEffect, useState } from "react";
import "./IntroAnimation.css";

import closedDesk from "../assets/images/desk_close.png";
import openDesk from "../assets/images/desk_open.png";

function IntroAnimation({ onFinish }) {
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    // Let the closed diary zoom in before revealing the open diary.
    const openTimer = setTimeout(() => {
      setOpened(true);
    }, 3200);

    // Keep the opened diary on screen long enough to be seen.
    const finishTimer = setTimeout(() => {
      onFinish();
    }, 7000);

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
