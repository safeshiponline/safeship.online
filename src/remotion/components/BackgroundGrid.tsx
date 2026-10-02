import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export const BackgroundGrid: React.FC<{ theme?: 'dark' | 'light' | 'blue' }> = ({ theme = 'dark' }) => {
  const frame = useCurrentFrame();

  // Subtle floating ambient motion
  const pulse = Math.sin(frame * 0.05) * 0.08 + 1;
  const gridOffsetY = (frame * 0.5) % 60;
  const orb1X = Math.sin(frame * 0.02) * 120;
  const orb1Y = Math.cos(frame * 0.02) * 80;
  const orb2X = Math.cos(frame * 0.015) * 150;
  const orb2Y = Math.sin(frame * 0.025) * 100;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: '#070B14',
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      {/* Dynamic Radial Glow Orbs */}
      <div
        style={{
          position: 'absolute',
          top: `calc(20% + ${orb1Y}px)`,
          left: `calc(50% + ${orb1X}px)`,
          width: '900px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(0, 102, 255, 0.22) 0%, rgba(0, 102, 255, 0) 70%)',
          transform: `translate(-50%, -50%) scale(${pulse})`,
          filter: 'blur(90px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: `calc(10% + ${orb2Y}px)`,
          right: `calc(25% + ${orb2X}px)`,
          width: '700px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, rgba(16, 185, 129, 0) 70%)',
          transform: 'translate(50%, 50%)',
          filter: 'blur(80px)',
        }}
      />

      {/* Cyber Grid Lines */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          opacity: 0.16,
          transform: `translateY(${gridOffsetY}px)`,
        }}
      >
        <defs>
          <pattern id="safeship-grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path
              d="M 60 0 L 0 0 0 60"
              fill="none"
              stroke="#38BDF8"
              strokeWidth="0.8"
              strokeDasharray="2 4"
            />
            <circle cx="60" cy="0" r="1.5" fill="#38BDF8" opacity="0.6" />
          </pattern>
        </defs>
        <rect width="100%" height="120%" y="-10%" fill="url(#safeship-grid)" />
      </svg>

      {/* Vignette Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 50% 50%, transparent 45%, #050811 100%)',
        }}
      />
    </div>
  );
};
