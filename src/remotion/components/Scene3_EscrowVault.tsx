import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const Scene3_EscrowVault: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneFrame = frame - 540;

  // Title entrance
  const titleSpring = spring({
    frame: sceneFrame - 5,
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  // Step 1: Courier Fee card entrance (sceneFrame 25)
  const step1Spring = spring({
    frame: sceneFrame - 25,
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  // Step 2: Escrow Vault entrance (sceneFrame 75)
  const step2Spring = spring({
    frame: sceneFrame - 75,
    fps,
    config: { damping: 14, stiffness: 95 },
  });

  // Vault Lock rotation (sceneFrame 110 - 180)
  const vaultLockRot = interpolate(sceneFrame, [110, 170], [0, 180], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Reassurance Pill entrance (sceneFrame 180)
  const pillSpring = spring({
    frame: sceneFrame - 180,
    fps,
    config: { damping: 14, stiffness: 110 },
  });

  // Exit transition (sceneFrame 320 - 342)
  const exitSpring = spring({
    frame: sceneFrame - 320,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  const sceneOpacity = interpolate(exitSpring, [0, 1], [1, 0]);
  const sceneScale = interpolate(exitSpring, [0, 1], [1, 0.95]);

  if (frame < 535 || frame > 885) return null;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        opacity: sceneOpacity,
        transform: `scale(${sceneScale})`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Title */}
      <div
        style={{
          transform: `scale(${titleSpring}) translateY(${interpolate(titleSpring, [0, 1], [25, 0])}px)`,
          opacity: titleSpring,
          textAlign: 'center',
          marginBottom: '40px',
        }}
      >
        <div style={{ fontSize: '52px', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-1.5px' }}>
          2-Stage Escrow Architecture
        </div>
        <div style={{ color: '#94A3B8', fontSize: '20px', fontWeight: 500, marginTop: '8px' }}>
          Zero Advance Risk. Funds Inviolable in Bank Custody.
        </div>
      </div>

      {/* Main 2-Module Layout */}
      <div
        style={{
          display: 'flex',
          gap: '32px',
          alignItems: 'center',
          justifyContent: 'center',
          width: '1060px',
          marginBottom: '36px',
        }}
      >
        {/* Module 1: Courier Delivery Fee */}
        <div
          style={{
            flex: 1,
            transform: `scale(${step1Spring}) translateX(${interpolate(step1Spring, [0, 1], [-30, 0])}px)`,
            opacity: step1Spring,
            background: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            borderRadius: '28px',
            padding: '36px 32px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5), 0 0 30px rgba(16, 185, 129, 0.1)',
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <span style={{ color: '#10B981', fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
              Stage 01 • Dispatch
            </span>
            <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34D399', fontSize: '12px', fontWeight: 800, padding: '4px 10px', borderRadius: '6px' }}>
              ✓ PAID TO DISPATCH
            </span>
          </div>

          <div style={{ color: '#FFFFFF', fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px' }}>
            Courier Delivery Fee
          </div>
          <div style={{ color: '#34D399', fontSize: '46px', fontWeight: 900, margin: '12px 0' }}>
            ₹199
          </div>
          <div style={{ color: '#94A3B8', fontSize: '16px', lineHeight: 1.5 }}>
            Only the nominal courier charge is paid upfront to schedule &amp; dispatch our bonded agent.
          </div>
        </div>

        {/* Dynamic Glowing Data Arrow */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            opacity: step2Spring,
          }}
        >
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 12H19M19 12L13 6M19 12L13 18"
              stroke="#38BDF8"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Module 2: Merchandise Escrow Hold */}
        <div
          style={{
            flex: 1.15,
            transform: `scale(${step2Spring}) translateX(${interpolate(step2Spring, [0, 1], [30, 0])}px)`,
            opacity: step2Spring,
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(10, 25, 60, 0.9) 100%)',
            backdropFilter: 'blur(20px)',
            border: '2px solid rgba(0, 102, 255, 0.6)',
            borderRadius: '28px',
            padding: '36px 36px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 40px rgba(0, 102, 255, 0.25)',
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <span style={{ color: '#38BDF8', fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
              Stage 02 • Escrow Lock
            </span>
            <span style={{ background: 'rgba(0, 102, 255, 0.25)', color: '#93C5FD', fontSize: '12px', fontWeight: 800, padding: '4px 10px', borderRadius: '6px' }}>
              🔒 RBI NODAL VAULT
            </span>
          </div>

          <div style={{ color: '#FFFFFF', fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px' }}>
            Merchandise Escrow
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '12px 0' }}>
            <div style={{ color: '#60A5FA', fontSize: '46px', fontWeight: 900 }}>
              ₹45,000
            </div>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                border: '2px solid #38BDF8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: `rotate(${vaultLockRot}deg)`,
                background: 'rgba(0, 102, 255, 0.2)',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect x="5" y="11" width="14" height="10" rx="2" stroke="#FFFFFF" strokeWidth="2" />
                <path d="M8 11V7C8 4.79 9.79 3 12 3C14.21 3 16 4.79 16 7V11" stroke="#FFFFFF" strokeWidth="2" />
              </svg>
            </div>
          </div>
          <div style={{ color: '#94A3B8', fontSize: '16px', lineHeight: 1.5 }}>
            Item funds remain safely locked in bank escrow. Release is contingent on doorstep unboxing approval.
          </div>
        </div>
      </div>

      {/* Centered Inviolable Callout */}
      <div
        style={{
          transform: `scale(${pillSpring}) translateY(${interpolate(pillSpring, [0, 1], [20, 0])}px)`,
          opacity: pillSpring,
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '999px',
          padding: '12px 32px',
          color: '#E2E8F0',
          fontSize: '17px',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <span style={{ color: '#38BDF8' }}>🔒</span>
        <span>Neither party can touch the money in transit.</span>
      </div>
    </div>
  );
};
