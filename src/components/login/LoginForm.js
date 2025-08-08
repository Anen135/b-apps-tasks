'use client';

import { Button } from '@/components/ui/button';

export default function LoginForm({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}) {
  return (
    <form onSubmit={onSubmit} style={styles.form}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={onEmailChange}
        style={styles.input}
        required
      />
      <input
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={onPasswordChange}
        style={styles.input}
        required
      />
      <Button style={styles.button}>Войти</Button>
    </form>
  );
}

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  input: {
    padding: '12px',
    marginBottom: '16px',
    border: '1px solid #ccc',
    fontSize: '16px',
  },
  button: {
    padding: '12px',
    fontSize: '16px',
    cursor: 'pointer',
    height: '50px',
  },
};
