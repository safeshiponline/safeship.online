import React from 'react';
import { interpolate, spring, useCurrentFrame } from 'remotion';

export const Scene5_Outro: React.FC = () => {
  const frame = useCurrentFrame();

  // Active window: frames 955 to 1050
  if (frame < 955) return null;

  const localFrame = frame - 960;

  // Scene fade in
  const sceneOpacity = interpolate(localFrame, [0, 8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Typography 1 entrance: "Verify first." (localFrame 5 to 35)
  const title1Spring = spring({
    frame: localFrame - 5,
    fps: 30,
    config: { mass: 0.5, damping: 12, stiffness: 140 },
  });

  // Typography 2 entrance: "Pay only when satisfied." (localFrame 18 to 48)
  const title2Spring = spring({
    frame: localFrame - 18,
    fps: 30,
    config: { mass: 0.5, damping: 12, stiffness: 140 },
  });

  // Delicate emerald underline draw in from left to right (localFrame 25 to 60)
  const underlineProgress = interpolate(localFrame, [25, 55], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Floating Micro-Badges Entrance (localFrame 30 to 60)
  const badgesSpring = spring({
    frame: localFrame - 30,
    fps: 30,
    config: { mass: 0.5, damping: 12, stiffness: 140 },
  });

  // Black Pill Button Lands in Lower-Third (localFrame 45 to 75)
  const buttonSpring = spring({
    frame: localFrame - 45,
    fps: 30,
    config: { mass: 0.5, damping: 12, stiffness: 140 },
  });

  // High-gloss Light Beam Reflection Sweep (localFrame 55 to 80)
  const lightSweep = interpolate(localFrame, [55, 80], [-100, 200], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Cursor Click and Soft Radial Pulse (localFrame 68 to 85)
  const clickScale = interpolate(localFrame, [68, 72, 78], [1, 0.94, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const pulseScale = interpolate(localFrame, [72, 88], [0.8, 1.6], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const pulseOpacity = interpolate(localFrame, [72, 88], [0.5, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: '#F8F7F4',
        opacity: sceneOpacity,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 100px',
        color: '#111111',
        zIndex: 60,
      }}
    >
      {/* Floating Micro-Badges in Margins */}
      <div
        style={{
          position: 'absolute',
          top: 100,
          left: 120,
          transform: `scale(${badgesSpring})`,
          background: '#FFFFFF',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          padding: '10px 20px',
          borderRadius: 999,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.04)',
        }}
      >
        <span style={{ color: '#10B981' }}>✓</span>
        <span className="micro-tag" style={{ fontSize: 12, fontWeight: 700, color: '#0F172A' }}>
          0% Advance Risk
        </span>
      </div>

      <div
        style={{
          position: 'absolute',
          top: 100,
          right: 120,
          transform: `scale(${badgesSpring})`,
          background: '#FFFFFF',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          padding: '10px 20px',
          borderRadius: 999,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.04)',
        }}
      >
        <span style={{ color: '#0066FF' }}>🛡️</span>
        <span className="micro-tag" style={{ fontSize: 12, fontWeight: 700, color: '#0F172A' }}>
          Open-Box Verified
        </span>
      </div>

      {/* Main Center Typography Showcase */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          marginBottom: 48,
        }}
      >
        {/* Line 1: Verify first. */}
        <h1
          className="font-sans-ui"
          style={{
            fontSize: 78,
            fontWeight: 800,
            color: '#0F172A',
            letterSpacing: '-0.04em',
            margin: 0,
            transform: `scale(${title1Spring}) translateY(${(1 - title1Spring) * 20}px)`,
          }}
        >
          Verify first.
        </h1>

        {/* Line 2: Pay only when satisfied. with Emerald Underline */}
        <div style={{ position: 'relative', marginTop: 12 }}>
          <h2
            className="font-editorial"
            style={{
              fontSize: 82,
              fontWeight: 400,
              color: '#0066FF',
              margin: 0,
              transform: `scale(${title2Spring}) translateY(${(1 - title2Spring) * 20}px)`,
            }}
          >
            Pay only when <span style={{ color: '#10B981' }}>satisfied.</span>
          </h2>

          {/* Drawing Emerald Underline */}
          <div
            style={{
              position: 'absolute',
              bottom: -4,
              left: '10%',
              width: '80%',
              height: 4,
              borderRadius: 2,
              background: '#10B981',
              clipPath: `polygon(0 0, ${underlineProgress}% 0, ${underlineProgress}% 100%, 0 100%)`,
            }}
          />
        </div>
      </div>

      {/* Lower-Third Sleek Black Pill Button: safeship.online */}
      <div
        style={{
          position: 'relative',
          transform: `scale(${buttonSpring}) scale(${clickScale})`,
        }}
      >
        {/* Soft Radial Click Pulse */}
        {localFrame >= 72 && (
          <div
            style={{
              position: 'absolute',
              inset: -15,
              borderRadius: 999,
              background: '#0066FF',
              transform: `scale(${pulseScale})`,
              opacity: pulseOpacity,
              pointerEvents: 'none',
            }}
          />
        )}

        {/* Black Pill Core */}
        <div
          style={{
            background: '#0F172A',
            color: '#FFFFFF',
            padding: '18px 48px',
            borderRadius: 999,
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            boxShadow: '0 20px 50px rgba(15, 23, 42, 0.25)',
            position: 'relative',
            overflow: 'hidden',
            cursor: 'pointer',
          }}
        >
          {/* Logo Dot */}
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: '#10B981',
              boxShadow: '0 0 10px #10B981',
            }}
          />
          <span
            className="font-sans-ui"
            style={{
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: '-0.02em',
            }}
          >
            safeship.online
          </span>
          <span style={{ fontSize: 20, color: '#38BDF8' }}>→</span>

          {/* Diagonal Light Beam Reflection Sweep */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: `${lightSweep}%`,
              width: 60,
              background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.35), transparent)',
              transform: 'skewX(-25deg)',
              pointerEvents: 'none',
            }}
          />
        </div>
      </div>

      {/* Subtle Brand Tagline */}
      <div
        style={{
          marginTop: 24,
          fontSize: 13,
          fontWeight: 600,
          color: '#64748B',
          letterSpacing: '0.04em',
        }}
      >
        India&apos;s #1 Doorstep Open-Box &amp; Safe Shipping Platform
      </div>
    </div>
  );
};
