import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { SafeShipOfficialLogo } from './SafeShipOfficialLogo';

export const Scene2_Solution: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneFrame = frame - 260;

  // Logo entrance (sceneFrame 5 - 40)
  const logoSpring = spring({
    frame: sceneFrame - 5,
    fps,
    config: { damping: 13, stiffness: 95 },
  });

  // Title entrance (sceneFrame 30 - 65)
  const titleSpring = spring({
    frame: sceneFrame - 30,
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  // 3 Chips staggered
  const chip1Spring = spring({ frame: sceneFrame - 65, fps, config: { damping: 14, stiffness: 110 } });
  const chip2Spring = spring({ frame: sceneFrame - 85, fps, config: { damping: 14, stiffness: 110 } });
  const chip3Spring = spring({ frame: sceneFrame - 105, fps, config: { damping: 14, stiffness: 110 } });

  // Exit transition (sceneFrame 250 - 275)
  const exitSpring = spring({
    frame: sceneFrame - 250,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  const sceneOpacity = interpolate(exitSpring, [0, 1], [1, 0]);
  const sceneScale = interpolate(exitSpring, [0, 1], [1, 0.95]);

  // Subtle continuous camera drift
  const cameraZoom = 1 + sceneFrame * 0.0003;

  if (frame < 255 || frame > 545) return null;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        opacity: sceneOpacity,
        transform: `scale(${sceneScale * cameraZoom})`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Dynamic Cobalt Light Aura */}
      <div
        style={{
          position: 'absolute',
          width: '800px',
          height: '800px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 102, 255, 0.22) 0%, transparent 65%)',
          filter: 'blur(90px)',
          pointerEvents: 'none',
        }}
      />

      {/* Official SafeShip 3D Geometric Logo Centerpiece */}
      <div
        style={{
          transform: `scale(${logoSpring}) translateY(${interpolate(logoSpring, [0, 1], [40, 0])}px)`,
          opacity: logoSpring,
          marginBottom: '28px',
        }}
      >
        <SafeShipOfficialLogo size={140} glow={true} />
      </div>

      {/* Hero Title */}
      <div
        style={{
          transform: `scale(${titleSpring}) translateY(${interpolate(titleSpring, [0, 1], [30, 0])}px)`,
          opacity: titleSpring,
          textAlign: 'center',
          marginBottom: '44px',
        }}
      >
        <div
          style={{
            fontSize: '68px',
            fontWeight: 900,
            letterSpacing: '-2.5px',
            color: '#FFFFFF',
            textShadow: '0 0 50px rgba(0, 102, 255, 0.5)',
          }}
        >
          Meet Safe<span style={{ color: '#38BDF8' }}>Ship</span>.
        </div>
        <div
          style={{
            color: '#94A3B8',
            fontSize: '24px',
            fontWeight: 600,
            marginTop: '10px',
            letterSpacing: '-0.3px',
          }}
        >
          India's 1st Verified Open-Box Escrow Platform
        </div>
      </div>

      {/* 3 Streamlined Trust Chips */}
      <div
        style={{
          display: 'flex',
          gap: '20px',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Chip 1 */}
        <div
          style={{
            transform: `scale(${chip1Spring}) translateY(${interpolate(chip1Spring, [0, 1], [25, 0])}px)`,
            opacity: chip1Spring,
            background: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(56, 189, 248, 0.4)',
            borderRadius: '999px',
            padding: '16px 32px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 15px 30px rgba(0, 0, 0, 0.4)',
          }}
        >
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#38BDF8' }} />
          <span style={{ color: '#FFFFFF', fontSize: '18px', fontWeight: 800, letterSpacing: '-0.2px' }}>
            Zero Scams
          </span>
        </div>

        {/* Chip 2 */}
        <div
          style={{
            transform: `scale(${chip2Spring}) translateY(${interpolate(chip2Spring, [0, 1], [25, 0])}px)`,
            opacity: chip2Spring,
            background: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(56, 189, 248, 0.4)',
            borderRadius: '999px',
            padding: '16px 32px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 15px 30px rgba(0, 0, 0, 0.4)',
          }}
        >
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }} />
          <span style={{ color: '#FFFFFF', fontSize: '18px', fontWeight: 800, letterSpacing: '-0.2px' }}>
            Zero Advance Risk
          </span>
        </div>

        {/* Chip 3 */}
        <div
          style={{
            transform: `scale(${chip3Spring}) translateY(${interpolate(chip3Spring, [0, 1], [25, 0])}px)`,
            opacity: chip3Spring,
            background: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(56, 189, 248, 0.4)',
            borderRadius: '999px',
            padding: '16px 32px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 15px 30px rgba(0, 0, 0, 0.4)',
          }}
        >
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#0066FF' }} />
          <span style={{ color: '#FFFFFF', fontSize: '18px', fontWeight: 800, letterSpacing: '-0.2px' }}>
            100% Guaranteed Delivery
          </span>
        </div>
      </div>
    </div>
  );
};
