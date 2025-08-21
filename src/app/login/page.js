// src/app/login/page.js
'use client';

import ParticlesAnimation from '@/components/login/ParticlesAnimation';
import GitHubLoginButton from '@/components/login/GitHubLoginButton';

export default function LoginPage() {
  return (
    <main className="flex h-screen overflow-hidden">
      <div className="flex flex-col justify-center absolute p-8 bg-white/70 backdrop-blur-xl h-screen z-20 shadow-[2px_0_12px_rgba(0,0,0,0.05)] w-full max-w-[500px]">
        <h1 className="text-2xl md:text-[32px] font-bold mb-8 text-primary">Вход</h1>
        <GitHubLoginButton />
      </div>
      <ParticlesAnimation />
    </main>
  );
}
