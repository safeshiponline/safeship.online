import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { SafeShip3DLogoAnimated } from './SafeShip3DLogoAnimated';

export const Scene2_SafeShipArrival: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneFrame = frame - 260;

  // Master camera push
  const camZoom = 1 + sceneFrame * 0.0003;

  // Laser slash wipe entrance
  const laserWidth = interpolate(sceneFrame, [0, 20], [0, 1920], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Headline entrance (sceneFrame 25)
  const titleSpring = spring({
    frame: sceneFrame - 25,
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  // 3 Cards staggered entrance
  const card1Spring = spring({ frame: sceneFrame - 60, fps, config: { damping: 14, stiffness: 105 } });
  const card2Spring = spring({ frame: sceneFrame - 80, fps, config: { damping: 14, stiffness: 105 } });
  const card3Spring = spring({ frame: sceneFrame - 100, fps, config: { damping: 14, stiffness: 105 } });

  // Exit transition (sceneFrame 255 - 275)
  const exitSpring = spring({
    frame: sceneFrame - 255,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  const sceneOpacity = interpolate(exitSpring, [0, 1], [1, 0]);
  const sceneScale = interpolate(exitSpring, [0, 1], [1, 0.94]);

  if (frame < 255 || frame > 545) return null;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        opacity: sceneOpacity,
        transform: `scale(${sceneScale * camZoom})`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Horizontal Laser Wipe Flash on Arrival */}
      {sceneFrame < 25 && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: `${laserWidth}px`,
            height: '4px',
            backgroundColor: '#38BDF8',
            boxShadow: '0 0 50px #0066FF, 0 0 120px #38BDF8',
            pointerEvents: 'none',
            zIndex: 100,
          }}
        />
      )}

      {/* Volumetric Radial Light Aura */}
      <div
        style={{
          position: 'absolute',
          width: '900px',
          height: '900px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 102, 255, 0.32) 0%, transparent 65%)',
          filter: 'blur(95px)',
          pointerEvents: 'none',
        }}
      />

      {/* Official 3D Assembling Geometric Logo */}
      <div style={{ marginBottom: '28px' }}>
        <SafeShip3DLogoAnimated size={160} assembleDelay={265} glow={true} />
      </div>

      {/* Kinetic Headline */}
      <div
        style={{
          transform: `scale(${titleSpring}) translateY(${interpolate(titleSpring, [0, 1], [25, 0])}px)`,
          opacity: titleSpring,
          textAlign: 'center',
          marginBottom: '44px',
        }}
      >
        <div
          style={{
            fontSize: '80px',
            fontWeight: 900,
            letterSpacing: '-3px',
            color: '#FFFFFF',
            textShadow: '0 0 60px rgba(0, 102, 255, 0.6), 0 10px 40px rgba(0,0,0,0.8)',
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
          The only peer-to-peer verification & escrow platform across India
        </div>
      </div>

      {/* 3 Architectural Monolith Cards */}
      <div
        style={{
          display: 'flex',
          gap: '28px',
          alignItems: 'stretch',
          justifyContent: 'center',
          maxWidth: '1200px',
        }}
      >
        {/* Monolith 1: Zero Scams */}
        <div
          style={{
            flex: 1,
            transform: `scale(${card1Spring}) translateY(${interpolate(card1Spring, [0, 1], [30, 0])}px)`,
            opacity: card1Spring,
            background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.9) 0%, rgba(8, 12, 22, 0.95) 100%)',
            backdropFilter: 'blur(28px)',
            border: '1.5px solid rgba(56, 189, 248, 0.35)',
            borderRadius: '26px',
            padding: '28px 24px',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.7), 0 0 35px rgba(56, 189, 248, 0.12)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'rgba(56, 189, 248, 0.15)',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L3 7V12C3 17.5 7 21.5 12 22C17 21.5 21 17.5 21 12V7L12 2Z" stroke="#38BDF8" strokeWidth="2" strokeLinejoin="round" />
                <path d="M9 12L11 14L15 10" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span style={{ color: '#38BDF8', fontSize: '12px', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase' }}>
              Pillar 01
            </span>
          </div>
          <div style={{ color: '#FFFFFF', fontSize: '26px', fontWeight: 900, letterSpacing: '-0.5px' }}>
            Zero Scams
          </div>
          <div style={{ color: '#94A3B8', fontSize: '15px', lineHeight: 1.5, marginTop: '8px' }}>
            Doorstep physical IMEI audit & serialized barcoded tamper seals on pickup and delivery.
          </div>
        </div>

        {/* Monolith 2: Zero Advance Risk */}
        <div
          style={{
            flex: 1,
            transform: `scale(${card2Spring}) translateY(${interpolate(card2Spring, [0, 1], [30, 0])}px)`,
            opacity: card2Spring,
            background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.9) 0%, rgba(8, 12, 22, 0.95) 100%)',
            backdropFilter: 'blur(28px)',
            border: '1.5px solid rgba(16, 185, 129, 0.4)',
            borderRadius: '26px',
            padding: '28px 24px',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.7), 0 0 35px rgba(16, 185, 129, 0.12)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="11" width="18" height="11" rx="2" stroke="#10B981" strokeWidth="2" />
                <path d="M7 11V7C7 4.2 9.2 2 12 2C14.8 2 17 4.2 17 7V11" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <span style={{ color: '#10B981', fontSize: '12px', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase' }}>
              Pillar 02
            </span>
          </div>
          <div style={{ color: '#FFFFFF', fontSize: '26px', fontWeight: 900, letterSpacing: '-0.5px' }}>
            Zero Advance Risk
          </div>
          <div style={{ color: '#94A3B8', fontSize: '15px', lineHeight: 1.5, marginTop: '8px' }}>
            Merchandise funds locked in RBI-regulated bank escrow vaults. Neither party can touch it in transit.
          </div>
        </div>

        {/* Monolith 3: 100% Guaranteed Delivery */}
        <div
          style={{
            flex: 1,
            transform: `scale(${card3Spring}) translateY(${interpolate(card3Spring, [0, 1], [30, 0])}px)`,
            opacity: card3Spring,
            background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.9) 0%, rgba(8, 12, 22, 0.95) 100%)',
            backdropFilter: 'blur(28px)',
            border: '1.5px solid rgba(0, 102, 255, 0.4)',
            borderRadius: '26px',
            padding: '28px 24px',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.7), 0 0 35px rgba(0, 102, 255, 0.15)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'rgba(0, 102, 255, 0.15)',
                border: '1px solid rgba(0, 102, 255, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M1 3H5L7.68 16.39C7.77 16.85 8.02 17.26 8.39 17.55C8.75 17.84 9.21 18 9.68 18H19.4C19.86 18 20.3 17.85 20.66 17.57C21.02 17.29 21.28 16.89 21.39 16.44L23 9H6" stroke="#0066FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span style={{ color: '#38BDF8', fontSize: '12px', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase' }}>
              Pillar 03
            </span>
          </div>
          <div style={{ color: '#FFFFFF', fontSize: '26px', fontWeight: 900, letterSpacing: '-0.5px' }}>
            100% Guaranteed
          </div>
          <div style={{ color: '#94A3B8', fontSize: '15px', lineHeight: 1.5, marginTop: '8px' }}>
            Doorstep open-box power-on verification. Inspect the device before approval or get 100% refunded.
          </div>
        </div>
      </div>
    </div>
  );
};
