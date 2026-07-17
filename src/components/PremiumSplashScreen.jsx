import React, { useEffect, useState } from 'react';

/**
 * PremiumSplashScreen shows a simple car icon and AVTO QR branding
 * for 0.8 seconds, then fades out smoothly over 0.4s.
 */
export default function PremiumSplashScreen({ onComplete }) {
  const [visible, setVisible] = useState(true);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    // Speed up splash duration for better UX
    const timerFade = setTimeout(() => {
      setFade(true);
    }, 800);

    const timerComplete = setTimeout(() => {
      setVisible(false);
      if (onComplete) onComplete();
    }, 1200);

    return () => {
      clearTimeout(timerFade);
      clearTimeout(timerComplete);
    };
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#f8fafc] blueprint-grid transition-opacity duration-400 ease-in-out ${
        fade ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Drafting frame corners */}
      <div className="absolute top-6 left-6 w-10 h-10 border-t border-l border-[#bfa37a] opacity-60" />
      <div className="absolute top-6 right-6 w-10 h-10 border-t border-r border-[#bfa37a] opacity-60" />
      <div className="absolute bottom-6 left-6 w-10 h-10 border-b border-l border-[#bfa37a] opacity-60" />
      <div className="absolute bottom-6 right-6 w-10 h-10 border-b border-r border-[#bfa37a] opacity-60" />

      <div className="text-center px-6">
        {/* Simple Car Icon */}
        <svg
          viewBox="0 0 24 24"
          width="48"
          height="48"
          fill="none"
          stroke="#bfa37a"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mx-auto mb-4 animate-fade-in"
        >
          <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
          <circle cx="7" cy="17" r="2" />
          <path d="M9 17h6" />
          <circle cx="17" cy="17" r="2" />
        </svg>

        {/* Branding text */}
        <h1 className="text-2xl font-black tracking-[0.25em] text-[#0f172a] uppercase font-mono">
          AVTO QR
        </h1>
        <div className="w-8 h-[1px] bg-[#bfa37a] mx-auto mt-2" />
      </div>
    </div>
  );
}
