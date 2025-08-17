import React from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim"; // Лёгкая версия

const GlitterBackground = () => {
  const particlesInit = async (engine) => {
    await loadSlim(engine); // загружаем минимальный набор фич
  };

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        background: { color: "transparent" },
        fullScreen: { enable: true, zIndex: -1 },
        particles: {
          number: { value: 150, density: { enable: true, area: 800 } },
          color: { value: ["#ffffff", "#ffd700", "#ff69b4", "#00ffff"] },
          shape: { type: "circle" },
          opacity: {
            value: 1,
            random: true,
            animation: { enable: true, speed: 1, minimumValue: 0.3, sync: false }
          },
          size: {
            value: { min: 1, max: 3 },
            animation: { enable: true, speed: 2, minimumValue: 0.5, sync: false }
          },
          twinkle: {
            particles: { enable: true, color: "#ffffff", frequency: 0.2, opacity: 1 }
          },
          move: {
            enable: true,
            speed: 0.5,
            direction: "none",
            random: true,
            straight: false,
            outModes: { default: "out" }
          }
        }
      }}
    />
  );
};

export default GlitterBackground;
