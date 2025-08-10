'use client';

import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';
import { useCallback } from 'react';

export default function ParticlesAnimation() {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <div className="flex-1 relative overflow-hidden bg-[#0f0c29]">
      <div className="absolute w-full h-full bg-gradient-to-b from-[#250042] to-black blur-[2px] z-0" />
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          fullScreen: false,
          background: {
            color: { value: 'transparent' },
          },
          particles: {
            number: {
              value: 80,
              density: {
                enable: true,
                value_area: 800,
              },
            },
            color: { value: '#aaccff' },
            shape: { type: 'circle' },
            opacity: {
              value: { min: 0.2, max: 0.6 },
              animation: {
                enable: true,
                speed: 0.5,
                minimumValue: 0.2,
                sync: false,
              },
            },
            size: {
              value: { min: 1, max: 5 },
              animation: {
                enable: true,
                speed: 2,
                minimumValue: 1,
                sync: false,
              },
            },
            links: {
              enable: true,
              distance: 160,
              color: '#aaccff',
              opacity: 0.25,
              width: 1,
              triangles: {
                enable: true,
                color: '#aaccff',
                opacity: 0.05,
              },
            },
            move: {
              enable: true,
              speed: { min: 0.2, max: 1.2 },
              direction: 'none',
              outModes: {
                default: 'bounce',
              },
            },
          },
          detectRetina: true,
        }}
        className="absolute top-0 left-0 w-full h-full z-10 backdrop-blur-[1px]"
      />
    </div>
  );
}
