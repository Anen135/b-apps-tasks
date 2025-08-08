'use client';

import { useState } from 'react';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';
import { Button } from '@/components/ui/button';
import { signIn } from "next-auth/react"

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
          <Button style={styles.button} onClick={() => signIn()}>Войти</Button>
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
          <Button
            style={styles.button}
          >Войти</Button>
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
                value: '#aaccff', // светло-синий/фиолетовый
              },
              shape: {
                type: 'circle',
              },
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
                distance: 160, // увеличение расстояния между линиями
                color: '#aaccff',
                opacity: 0.25,
                width: 1,
                triangles: {
                  enable: true,              // 🔺 Включить "плёнку" между 3 точками
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
    </div>
  );
}

const styles = {
  wrapper: {
    display: 'flex',
    height: '100vh',
    // width: '100vw',
    overflow: 'hidden',
  },
  left: {
    // flex: 1,
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#fff',
    boxShadow: '2px 0 12px rgba(0,0,0,0.05)',
    zIndex: 1,
    width: '100%',
    maxWidth: 500,
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
    // borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '16px',
  },
  button: {
    padding: '12px',
    fontSize: '16px',
    cursor: 'pointer',
    height: '50px',
  },
  right: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#0f0c29', // fallback
  },
  gradientOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(to bottom, #250042ff, #000000ff)', // светлый верх, глубокий низ
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
