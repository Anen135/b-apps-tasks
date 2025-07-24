'use client';

import { useState } from 'react';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Email:', email);
    console.log('Password:', password);
  };

  const particlesInit = async (engine) => {
    await loadSlim(engine);
  };

  return (
    <div style={styles.wrapper}>
      {/* Левая часть: форма входа */}
      <div style={styles.left}>
        <h1 style={styles.title}>Вход</h1>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
          <button type="submit" style={styles.button}>
            Войти
          </button>
        </form>
      </div>

      {/* Правая часть: визуальная анимация */}
      <div style={styles.right}>
        <div style={styles.gradientOverlay}></div>
        <Particles
          id="tsparticles"
          init={particlesInit}
          options={{
            fullScreen: false,
            background: {
              color: {
                value: 'transparent',
              },
            },
            particles: {
              number: {
                value: 80,
                density: {
                  enable: true,
                  value_area: 800,
                },
              },
              color: {
                value: '#ffffff',
              },
              shape: {
                type: 'circle',
              },
              opacity: {
                value: { min: 0.2, max: 0.8 },
                animation: {
                  enable: true,
                  speed: 0.5,
                  minimumValue: 0.2,
                  sync: false,
                },
              },
              size: {
                value: { min: 1, max: 5 }, // разные размеры создают эффект глубины
                animation: {
                  enable: true,
                  speed: 2,
                  minimumValue: 1,
                  sync: false,
                },
              },
              links: {
                enable: true,
                distance: 120,
                color: '#ffffff',
                opacity: 0.2,
                width: 1,
              },
              move: {
                enable: true,
                speed: { min: 0.2, max: 1.5 }, // разная скорость создаёт 3D-ощущение
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
    </div>
  );
}

const styles = {
  wrapper: {
    display: 'flex',
    height: '100vh',
    width: '100vw',
    overflow: 'hidden',
  },
  left: {
    flex: 1,
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#fff',
    boxShadow: '2px 0 12px rgba(0,0,0,0.05)',
    zIndex: 1,
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    marginBottom: '2rem',
    color: '#000',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  input: {
    padding: '12px',
    marginBottom: '16px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '16px',
  },
  button: {
    padding: '12px',
    backgroundColor: '#0070f3',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    cursor: 'pointer',
  },
  right: {
    flex: 2,
    position: 'relative',
    overflow: 'hidden',
  },
  gradientOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(to bottom, #0f2027, #203a43, #2c5364)', // подводный градиент
    filter: 'blur(2px)', // легкий блюр фона
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
