import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export const BackgroundCinematic: React.FC = () => {
  const frame = useCurrentFrame();

  // Slow ambient drift
  const lightX = Math.sin(frame * 0.015) * 150;
  const lightY = Math.cos(frame * 0.02) * 80;

  // Horizon lens flare sweep
  const flareX = ((frame * 2.5) % 2400) - 200;

  // Floating dust particles
  const particles = React.useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => ({
      baseX: (i * 67) % 1920,
      baseY: (i * 93) % 1080,
      speedY: 0.4 + (i % 5) * 0.2,
      speedX: ((i % 3) - 1) * 0.15,
      size: 1.5 + (i % 4) * 0.8,
      opacity: 0.2 + (i % 6) * 0.12,
    }));
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: '#030712',
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      {/* 1. Deep Volumetric Ambient Glows */}
      <div
        style={{
          position: 'absolute',
          top: `calc(30% + ${lightY}px)`,
          left: `calc(50% + ${lightX}px)`,
          width: '1000px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(0, 102, 255, 0.2) 0%, rgba(2, 6, 23, 0) 70%)',
          transform: 'translate(-50%, -50%)',
          filter: 'blur(100px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '10%',
          left: '50%',
          width: '1200px',
          height: '350px',
          background: 'radial-gradient(ellipse, rgba(56, 189, 248, 0.1) 0%, transparent 70%)',
          transform: 'translateX(-50%)',
          filter: 'blur(80px)',
        }}
      />

      {/* 2. Anamorphic Horizontal Horizon Flare */}
      <div
        style={{
          position: 'absolute',
          top: '46%',
          left: '0',
          right: '0',
          height: '2px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(56, 189, 248, 0.4) 50%, transparent 100%)',
          filter: 'blur(1px)',
          opacity: 0.6 + Math.sin(frame * 0.05) * 0.2,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '46%',
          left: `${flareX}px`,
          width: '300px',
          height: '60px',
          background: 'radial-gradient(ellipse, rgba(56, 189, 248, 0.3) 0%, transparent 70%)',
          transform: 'translate(-50%, -50%)',
          filter: 'blur(12px)',
        }}
      />

      {/* 3. Floating 3D Motes / Dust Particles */}
      {particles.map((p, idx) => {
        const curY = (p.baseY - frame * p.speedY) % 1080;
        const finalY = curY < 0 ? curY + 1080 : curY;
        const curX = (p.baseX + frame * p.speedX) % 1920;
        const finalX = curX < 0 ? curX + 1920 : curX;

        return (
          <div
            key={idx}
            style={{
              position: 'absolute',
              top: `${finalY}px`,
              left: `${finalX}px`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              borderRadius: '50%',
              backgroundColor: '#38BDF8',
              opacity: p.opacity,
              boxShadow: '0 0 6px rgba(56, 189, 248, 0.8)',
            }}
          />
        );
      })}

      {/* 4. Luxury Dark Vignette Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 50% 50%, transparent 40%, #02040A 100%)',
        }}
      />
    </div>
  );
};
