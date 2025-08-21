import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { signIn } from 'next-auth/react';
import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

export function GitHubLoginButton() {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      await signIn('github');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={loading}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        height: '50px',
        padding: '12px 16px',
        fontSize: '16px',
        backgroundColor: '#24292e',
        color: '#ffffff',
        cursor: loading ? 'not-allowed' : 'pointer',
      }}
    >
      <FaGithub size={20} />
      {loading ? 'Загрузка...' : 'Войти через GitHub'}
    </Button>
  );
}

export function GoogleLoginButton() {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      await signIn('google');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={loading}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        height: '50px',
        padding: '12px 16px',
        fontSize: '16px',
        backgroundColor: '#4285F4',
        color: '#ffffff',
        cursor: loading ? 'not-allowed' : 'pointer',
      }}
    >
      <FcGoogle size={20} />
      {loading ? 'Загрузка...' : 'Войти через Google'}
    </Button>
  );
}
