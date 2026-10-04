import React from 'react';
import { interpolate, spring, useCurrentFrame } from 'remotion';

export const Scene2_TheSolution: React.FC = () => {
  const frame = useCurrentFrame();

  // Active window: frames 238 to 395
  if (frame < 238 || frame > 395) return null;

  const localFrame = frame - 240;

  // 1. Rapid Radial Shutter Wipe / Inverted Snap (frames 0 to 20 local)
  const shutterProgress = interpolate(localFrame, [0, 18], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Scene fade out into Scene 3 (frames 140 to 150 local)
  const sceneOpacity = interpolate(localFrame, [0, 8, 140, 150], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 2. Camera Rapid Forward Push
  const cameraZoom = interpolate(localFrame, [0, 60, 150], [0.85, 1.05, 1.12], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 3. 3D Isometric Glass Crate Spring & Morph into Shield Emblem (frames 5 to 65 local)
  const crateSpring = spring({
    frame: localFrame - 5,
    fps: 30,
    config: { mass: 0.5, damping: 12, stiffness: 140 },
  });

  const crateRotateY = interpolate(localFrame, [5, 60], [-45, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const crateRotateX = interpolate(localFrame, [5, 60], [25, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 4. "SafeShip" Typography Scale & Letter-Spacing Tracking-In (frames 50 to 120 local)
  const titleSpring = spring({
    frame: localFrame - 45,
    fps: 30,
    config: { mass: 0.5, damping: 12, stiffness: 140 },
  });

  const letterSpacing = interpolate(localFrame, [45, 95], [0.15, 0.02], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 5. Diagonal Light Sweep Reflection across Typography (frames 70 to 115 local)
  const lightSweep = interpolate(localFrame, [70, 115], [-120, 220], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: '#0A0A0A',
        opacity: sceneOpacity,
        clipPath: `circle(${shutterProgress}% at 50% 50%)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        zIndex: 50,
      }}
    >
      {/* Background Radial Glow */}
      <div
        style={{
          position: 'absolute',
          width: 900,
          height: 900,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, rgba(0, 102, 255, 0.12) 40%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />

      {/* Main 3D Container with Camera Zoom */}
      <div
        style={{
          transform: `scale(${cameraZoom})`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          perspective: 1200,
        }}
      >
        {/* 3D Glass Shipping Crate / Morphing Shield Icon */}
        <div
          style={{
            width: 140,
            height: 140,
            transform: `rotateX(${crateRotateX}deg) rotateY(${crateRotateY}deg) scale(${crateSpring})`,
            position: 'relative',
            marginBottom: 36,
          }}
        >
          {/* Glass Outer Shield Housing */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 32,
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0.04) 100%)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.4), 0 0 40px rgba(16, 185, 129, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* SVG Interlocking Security Shield Emblem */}
            <svg width="72" height="72" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L4 6V12C4 17.5 7.5 22.5 12 24C16.5 22.5 20 17.5 20 12V6L12 2Z"
                fill="url(#shieldGrad)"
                stroke="#10B981"
                strokeWidth="1.5"
              />
              <path
                d="M9 12L11 14L15 10"
                stroke="#FFFFFF"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <defs>
                <linearGradient id="shieldGrad" x1="4" y1="2" x2="20" y2="24" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#0066FF" />
                  <stop offset="1" stopColor="#10B981" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Glowing Corner Accents */}
          <span style={{ position: 'absolute', top: -3, left: -3, width: 8, height: 8, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 10px #10B981' }} />
          <span style={{ position: 'absolute', bottom: -3, right: -3, width: 8, height: 8, borderRadius: '50%', background: '#0066FF', boxShadow: '0 0 10px #0066FF' }} />
        </div>

        {/* Brand Typography: SafeShip with Light Sweep */}
        <div style={{ position: 'relative', overflow: 'hidden', padding: '8px 24px' }}>
          <h1
            className="font-sans-ui"
            style={{
              fontSize: 94,
              fontWeight: 800,
              color: '#FFFFFF',
              letterSpacing: `${letterSpacing}em`,
              margin: 0,
              transform: `scale(${titleSpring})`,
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <span>Safe</span>
            <span style={{ color: '#0066FF' }}>Ship</span>
          </h1>

          {/* Light Sweep Sheen */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: `${lightSweep}%`,
              width: 100,
              background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
              transform: 'skewX(-25deg)',
              pointerEvents: 'none',
            }}
          />
        </div>

        {/* Tactical Subtitle Tag */}
        <div
          style={{
            marginTop: 18,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            opacity: interpolate(localFrame, [55, 80], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
            transform: `translateY(${interpolate(localFrame, [55, 80], [15, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}px)`,
          }}
        >
          <span
            className="micro-tag"
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: '#10B981',
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              padding: '6px 18px',
              borderRadius: 999,
              letterSpacing: '0.1em',
            }}
          >
            VERIFY THEN PAY
          </span>
          <span style={{ color: 'rgba(255, 255, 255, 0.3)' }}>•</span>
          <span
            className="micro-tag"
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: 'rgba(255, 255, 255, 0.8)',
              letterSpacing: '0.08em',
            }}
          >
            0% ADVANCE RISK
          </span>
        </div>
      </div>
    </div>
  );
};
