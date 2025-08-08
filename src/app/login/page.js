'use client';

import ParticlesAnimation from '@/components/login/ParticlesAnimation';
import GitHubLoginButton from '@/components/login/GitHubLoginButton';

export default function LoginPage() {
  return (
    <div style={styles.wrapper}>
      <div style={styles.left}>
        <h1 style={styles.title}>Вход</h1>
        <GitHubLoginButton />
      </div>
      <ParticlesAnimation />
    </div>
  );
}

const styles = {
  wrapper: {
    display: 'flex',
    height: '100vh',
    overflow: 'hidden',
  },
  left: {
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
};
