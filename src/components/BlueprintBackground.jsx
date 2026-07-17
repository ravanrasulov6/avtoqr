import React from 'react';

/**
 * BlueprintBackground component wraps pages with an architectural drafting design style,
 * including a grid pattern, border details, revision titles, and scale markers.
 */
export default function BlueprintBackground({ children, className = '' }) {
  return (
    <div className={`blueprint-grid min-h-screen w-full relative flex items-center justify-center p-4 md:p-8 ${className}`}>
      {/* Blueprint fine lines / border framing */}
      <div className="absolute inset-4 border border-dashed border-[rgba(191,163,122,0.2)] pointer-events-none rounded" />
      
      {/* Main page content wrapper */}
      <div className="relative z-10 w-full max-w-sm flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
}
