// src/components/Box9ModeSlider.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Import ảnh nền
import bt1 from "../assets/images/bt1.png";
import bt2 from "../assets/images/bt2.png";
import bt3 from "../assets/images/bt3.png";
import bt4 from "../assets/images/bt4.png";

const modes = [
  { key: "story",      name: "Cốt Chuyện\n(PvE)",       bg: bt1 },
  { key: "online",     name: "Online\n(PvP)",           bg: bt2 },
  { key: "challenge",  name: "Thử Thách\n(PvE Boss)",   bg: bt3 },
  { key: "entertain",  name: "Giải Trí\n(PvE)",         bg: bt4 },
];

const ROUTES = {
  story:      "/game/story",
  online:     "/game/online",
  challenge:  "/game/challenge",
  entertain:  "/game/entertain",
};

const Box9ModeSlider = () => {
  const [slideIndex, setSlideIndex] = useState(0);
  const navigate = useNavigate();

  const goToMode = (key) => {
    const path = ROUTES[key];
    if (path) navigate(path);
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Slide Container */}
      <div className="absolute inset-0">
        <div
          className="flex h-full transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${slideIndex * 100}%)` }}
        >
          {modes.map((mode) => (
            <div
              key={mode.key}
              className="w-full h-full flex-shrink-0 relative group cursor-pointer"
              onClick={() => goToMode(mode.key)}
            >
              {/* Ảnh nền - Thu nhỏ, vừa khung */}
              <img
                src={mode.bg}
                alt={mode.name}
                className="absolute inset-0 w-full h-full object-contain scale-140"
              />

              {/* Overlay */}
              {/* <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-all duration-300" /> */}

              {/* Chữ - Nhỏ hơn, xuống dòng, vừa khung */}
              <div className="absolute inset-0 flex items-center justify-center px-3">
                <span
                  className="glitch-text text-center text-white font-bold tracking-wide leading-tight whitespace-pre-line"
                  data-text={mode.name}
                  style={{
                    fontSize: "clamp(0.75rem, 2.8vw, 1.3rem)", // Nhỏ hơn, responsive
                    textShadow: "1px 1px 6px rgba(0,0,0,0.9)",
                  }}
                >
                  {mode.name}
                </span>
              </div>

              {/* Hover Glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-t from-cyan-600/25 to-transparent" />
                <div className="absolute -inset-1.5 bg-cyan-400/30 blur-xl" />
              </div>

              {/* Rung nhẹ */}
              <div className="absolute inset-0 animate-pulse-slight" />
            </div>
          ))}
        </div>
      </div>

      {/* Nút điều hướng - Nhỏ lại, vẫn nổi bật */}
      <>
        <button
          onClick={() => setSlideIndex((prev) => (prev - 1 + modes.length) % modes.length)}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-30 
                     w-8 h-8 lg:w-10 lg:h-10 
                     bg-black/70 backdrop-blur-sm rounded-full 
                     flex items-center justify-center 
                     border border-cyan-500 
                     shadow-md shadow-cyan-500/40 
                     hover:bg-cyan-700 hover:border-white 
                     hover:scale-105 transition-all duration-200"
        >
          <svg className="w-4 h-4 lg:w-5 lg:h-5 text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={() => setSlideIndex((prev) => (prev + 1) % modes.length)}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-30 
                     w-8 h-8 lg:w-10 lg:h-10 
                     bg-black/70 backdrop-blur-sm rounded-full 
                     flex items-center justify-center 
                     border border-cyan-500 
                     shadow-md shadow-cyan-500/40 
                     hover:bg-cyan-700 hover:border-white 
                     hover:scale-105 transition-all duration-200"
        >
          <svg className="w-4 h-4 lg:w-5 lg:h-5 text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </>

      {/* Dots - Nhỏ hơn */}
      <div className="absolute bottom-1.5 left-0 right-0 flex justify-center gap-1 z-30">
        {modes.map((_, i) => (
          <div
            key={i}
            className={`transition-all duration-300 rounded-full ${
              i === slideIndex
                ? "w-5 h-1 bg-cyan-400 shadow-sm"
                : "w-1 h-1 bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Box9ModeSlider;