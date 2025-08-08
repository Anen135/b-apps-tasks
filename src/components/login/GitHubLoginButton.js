import { Button } from '@/components/ui/button';
import { signIn } from 'next-auth/react';
import { FaGithub } from 'react-icons/fa';

export default function GitHubLoginButton() {
  return (
    <Button
      onClick={() => signIn('github')}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        height: '50px',
        padding: '12px 16px',
        fontSize: '16px',
        backgroundColor: '#24292e',
        color: '#ffffff',
      }}
    >
      <FaGithub size={20} />
      Войти через GitHub
    </Button>
  );
}
