// src/app/login/page.js
'use client';

import ParticlesAnimation from '@/components/login/ParticlesAnimation';
import GitHubLoginButton from '@/components/login/GitHubLoginButton';

export default function LoginPage() {
  return (
    <main className="flex h-screen overflow-hidden">
      <div className="flex flex-col justify-center absolute top-4/12 p-8 bg-transparent z-50 shadow-[2px_0_12px_rgba(0,0,0,0.05)] w-full max-w-[500px]">
        <h1 className="text-2xl md:text-[32px] font-bold mb-8 text-black">Вход</h1>
        <GitHubLoginButton />
      </div>
      <ParticlesAnimation />
    </main>
  );
}
