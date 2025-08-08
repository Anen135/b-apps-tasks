'use client';

import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';
import { useCallback } from 'react';

export default function ParticlesAnimation() {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <div style={styles.right}>
      <div style={styles.gradientOverlay}></div>
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
        style={styles.particles}
      />
    </div>
  );
}

const styles = {
  right: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#0f0c29',
  },
  gradientOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(to bottom, #250042ff, #000000ff)',
    filter: 'blur(2px)',
    zIndex: 0,
  },
  particles: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
    width: '100%',
    height: '100%',
    backdropFilter: 'blur(1px)',
  },
};
