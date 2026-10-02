import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const Scene3_VaultMechanism: React.FC = () => {
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

  // Dynamic Vault Locking Wheel (rotates smoothly and locks)
  const vaultLockRot = interpolate(sceneFrame, [85, 150], [0, 360], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Locking pins animation (clamp inward)
  const pinOffset = interpolate(sceneFrame, [140, 165], [12, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Reassurance Pill entrance (sceneFrame 175)
  const pillSpring = spring({
    frame: sceneFrame - 175,
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
          marginBottom: '44px',
        }}
      >
        <div style={{ fontSize: '56px', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-2px' }}>
          2-Stage Escrow Architecture
        </div>
        <div style={{ color: '#94A3B8', fontSize: '22px', fontWeight: 500, marginTop: '8px', letterSpacing: '-0.3px' }}>
          You only pay the delivery fee to dispatch. The merchandise is locked in bank custody.
        </div>
      </div>

      {/* Main 2-Stage Fintech Bridge */}
      <div
        style={{
          display: 'flex',
          gap: '32px',
          alignItems: 'center',
          justifyContent: 'center',
          width: '1100px',
          marginBottom: '38px',
        }}
      >
        {/* Stage 01: Courier Fee Card */}
        <div
          style={{
            flex: 1,
            transform: `scale(${step1Spring}) translateX(${interpolate(step1Spring, [0, 1], [-35, 0])}px)`,
            opacity: step1Spring,
            background: 'rgba(15, 23, 42, 0.88)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(16, 185, 129, 0.45)',
            borderRadius: '28px',
            padding: '38px 34px',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(16, 185, 129, 0.12)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <span style={{ color: '#10B981', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
              Stage 01 • Dispatch
            </span>
            <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34D399', fontSize: '12px', fontWeight: 800, padding: '5px 12px', borderRadius: '8px' }}>
              ✓ PAID TO DISPATCH
            </span>
          </div>

          <div style={{ color: '#FFFFFF', fontSize: '30px', fontWeight: 800, letterSpacing: '-0.5px' }}>
            Courier Delivery Fee
          </div>
          <div style={{ color: '#34D399', fontSize: '48px', fontWeight: 900, margin: '14px 0' }}>
            ₹199
          </div>
          <div style={{ color: '#94A3B8', fontSize: '16px', lineHeight: 1.5 }}>
            Only the nominal shipping fee is charged first to schedule and dispatch our bonded courier agent.
          </div>
        </div>

        {/* Central Luminous Signal Bridge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '44px',
            opacity: step2Spring,
          }}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 12H19M19 12L13 6M19 12L13 18"
              stroke="#38BDF8"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Stage 02: Bank Nodal Vault Card */}
        <div
          style={{
            flex: 1.2,
            transform: `scale(${step2Spring}) translateX(${interpolate(step2Spring, [0, 1], [35, 0])}px)`,
            opacity: step2Spring,
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(10, 25, 60, 0.95) 100%)',
            backdropFilter: 'blur(24px)',
            border: '2px solid rgba(0, 102, 255, 0.65)',
            borderRadius: '28px',
            padding: '38px 36px',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 45px rgba(0, 102, 255, 0.3)',
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <span style={{ color: '#38BDF8', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
              Stage 02 • Escrow Hold
            </span>
            <span style={{ background: 'rgba(0, 102, 255, 0.25)', color: '#93C5FD', fontSize: '12px', fontWeight: 800, padding: '5px 12px', borderRadius: '8px' }}>
              🔒 RBI NODAL VAULT
            </span>
          </div>

          <div style={{ color: '#FFFFFF', fontSize: '30px', fontWeight: 800, letterSpacing: '-0.5px' }}>
            Merchandise Escrow
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', margin: '14px 0' }}>
            <div style={{ color: '#60A5FA', fontSize: '48px', fontWeight: 900 }}>
              ₹45,000
            </div>

            {/* High-Tech Animated Vault Lock Dial */}
            <div
              style={{
                position: 'relative',
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                border: '3px solid #38BDF8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(0, 102, 255, 0.25)',
                boxShadow: '0 0 25px rgba(56, 189, 248, 0.5)',
              }}
            >
              {/* Rotating Gear Teeth */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  transform: `rotate(${vaultLockRot}deg)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div style={{ position: 'absolute', top: `${pinOffset}px`, width: '4px', height: '8px', backgroundColor: '#38BDF8', borderRadius: '2px' }} />
                <div style={{ position: 'absolute', bottom: `${pinOffset}px`, width: '4px', height: '8px', backgroundColor: '#38BDF8', borderRadius: '2px' }} />
                <div style={{ position: 'absolute', left: `${pinOffset}px`, width: '8px', height: '4px', backgroundColor: '#38BDF8', borderRadius: '2px' }} />
                <div style={{ position: 'absolute', right: `${pinOffset}px`, width: '8px', height: '4px', backgroundColor: '#38BDF8', borderRadius: '2px' }} />
              </div>

              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <rect x="5" y="11" width="14" height="10" rx="2" stroke="#FFFFFF" strokeWidth="2.5" />
                <path d="M8 11V7C8 4.79 9.79 3 12 3C14.21 3 16 4.79 16 7V11" stroke="#FFFFFF" strokeWidth="2.5" />
              </svg>
            </div>
          </div>

          <div style={{ color: '#94A3B8', fontSize: '16px', lineHeight: 1.5 }}>
            Merchandise funds are held in an RBI-compliant bank nodal account. Release triggers solely upon doorstep OTP unboxing.
          </div>
        </div>
      </div>

      {/* Reassurance Pill */}
      <div
        style={{
          transform: `scale(${pillSpring}) translateY(${interpolate(pillSpring, [0, 1], [20, 0])}px)`,
          opacity: pillSpring,
          background: 'rgba(255, 255, 255, 0.06)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '999px',
          padding: '14px 38px',
          color: '#E2E8F0',
          fontSize: '18px',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          boxShadow: '0 15px 30px rgba(0, 0, 0, 0.4)',
        }}
      >
        <span style={{ color: '#38BDF8', fontSize: '20px' }}>🔒</span>
        <span>Neither party can touch the money in transit. 100% Tamper-Proof.</span>
      </div>
    </div>
  );
};
