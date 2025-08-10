import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { signIn } from 'next-auth/react';
import { FaGithub } from 'react-icons/fa';

export default function GitHubLoginButton() {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    await signIn('github');
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
