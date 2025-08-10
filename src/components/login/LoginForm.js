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
    <form onSubmit={onSubmit} className="flex flex-col justify-center">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={onEmailChange}
        required
        className="p-3 mb-4 border border-gray-300 text-base rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={onPasswordChange}
        required
        className="p-3 mb-4 border border-gray-300 text-base rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <Button className="h-[50px] text-base">Войти</Button>
    </form>
  );
}
