import { useEffect } from "react";
import "./MemoryTransition.css";

function MemoryTransition({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2200);

    return () => clearTimeout(timer);
  }, [onComplete]);

  const stars = Array.from({ length: 250 });

  return (
    <div className="memoryOverlay">
      {stars.map((_, index) => (
        <span
          key={index}
          className="star"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 1.5}s`,
            animationDuration: `${1.5 + Math.random()}s`,
          }}
        />
      ))}

      <div className="memoryText">Every memory begins with a single word.</div>
    </div>
  );
}

export default MemoryTransition;
