// src/app/login/page.js
'use client';

import ParticlesAnimation from '@/components/login/ParticlesAnimation';
import {GitHubLoginButton, GoogleLoginButton} from '@/components/login/LoginButtons';

export default function LoginPage() {
  return (
    <main className="flex h-screen overflow-hidden">
<<<<<<< HEAD
      <div className="flex flex-col justify-center absolute p-8 bg-white/50 backdrop-blur-xl h-screen z-50 shadow-[2px_0_12px_rgba(0,0,0,0.05)] w-full max-w-[500px]">
        <h1 className="text-2xl md:text-[32px] font-bold mb-8 text-black">Вход</h1>
=======
      <div className="gap-3 flex flex-col justify-center absolute p-8 bg-white/70 backdrop-blur-xl h-screen z-20 shadow-[2px_0_12px_rgba(0,0,0,0.05)] w-full max-w-[500px]">
        <h1 className="text-2xl md:text-[32px] font-bold text-primary">Вход</h1>
>>>>>>> 126eed38afde05aca9c203451cc3c9d9374e5e0e
        <GitHubLoginButton />
        <GoogleLoginButton />
      </div>
      <ParticlesAnimation />
    </main>
  );
}
