import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const Scene1_Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Intro spring for phone hero (frame 5 - 35)
  const phoneSpring = spring({
    frame: frame - 5,
    fps,
    config: { damping: 14, stiffness: 90 },
  });

  // Chat 1 from left (frame 35 - 65)
  const chat1Spring = spring({
    frame: frame - 35,
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  // Chat 2 from right (frame 75 - 105)
  const chat2Spring = spring({
    frame: frame - 75,
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  // Transition to Climax question (frame 140)
  const climaxSpring = spring({
    frame: frame - 140,
    fps,
    config: { damping: 12, stiffness: 110 },
  });

  // Fade out earlier chat bubbles when question appears
  const chatFadeOut = interpolate(frame, [135, 155], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Exit transition (frame 245 - 264)
  const exitSpring = spring({
    frame: frame - 245,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  const sceneOpacity = interpolate(exitSpring, [0, 1], [1, 0]);
  const sceneScale = interpolate(exitSpring, [0, 1], [1, 0.95]);

  // Subtle floating motion
  const hoverY = Math.sin(frame * 0.06) * 8;
  const hoverRot = Math.sin(frame * 0.04) * 2;

  if (frame > 265) return null;

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
      {/* Background Radial Light Accent */}
      <div
        style={{
          position: 'absolute',
          width: '700px',
          height: '700px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(239, 68, 68, 0.12) 0%, transparent 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />

      {/* Hero Centerpiece: High-End Hardware & P2P Standoff */}
      <div
        style={{
          position: 'relative',
          width: '1000px',
          height: '520px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Central Floating Titanium Phone Mockup */}
        <div
          style={{
            transform: `scale(${phoneSpring}) translateY(${hoverY}px) rotate(${hoverRot}deg)`,
            opacity: phoneSpring,
            position: 'relative',
            width: '240px',
            height: '460px',
            borderRadius: '44px',
            background: 'linear-gradient(145deg, #1E293B 0%, #0F172A 100%)',
            border: '4px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 30px 60px rgba(0, 0, 0, 0.7), 0 0 40px rgba(0, 102, 255, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '16px',
            overflow: 'hidden',
          }}
        >
          {/* Dynamic Island Pill */}
          <div
            style={{
              width: '80px',
              height: '20px',
              backgroundColor: '#000000',
              borderRadius: '999px',
              marginBottom: '20px',
            }}
          />

          {/* Screen Content */}
          <div
            style={{
              width: '100%',
              flex: 1,
              borderRadius: '28px',
              background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.8) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '20px 16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ color: '#94A3B8', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                Item Listed
              </div>
              <div style={{ color: '#FFFFFF', fontSize: '18px', fontWeight: 800, marginTop: '4px' }}>
                iPhone 16 Pro Max
              </div>
              <div style={{ color: '#38BDF8', fontSize: '20px', fontWeight: 900, marginTop: '6px' }}>
                ₹1,29,900
              </div>
            </div>

            {/* Lock Status */}
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '12px',
                padding: '10px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span style={{ fontSize: '14px' }}>⚠️</span>
              <span style={{ color: '#FCA5A5', fontSize: '11px', fontWeight: 700 }}>
                Unverified P2P Deal
              </span>
            </div>
          </div>
        </div>

        {/* Chat Bubble 1: Floating from Left */}
        <div
          style={{
            position: 'absolute',
            left: '20px',
            top: '140px',
            transform: `scale(${chat1Spring}) translateX(${interpolate(chat1Spring, [0, 1], [-50, 0])}px)`,
            opacity: chat1Spring * chatFadeOut,
            background: 'rgba(15, 23, 42, 0.88)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '24px 24px 24px 6px',
            padding: '20px 28px',
            maxWidth: '340px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(239, 68, 68, 0.15)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#EF4444' }} />
            <span style={{ color: '#F87171', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
              Buyer Risk
            </span>
          </div>
          <div style={{ color: '#FFFFFF', fontSize: '18px', fontWeight: 600, lineHeight: 1.4 }}>
            "Pay 50% advance first or I can't ship the parcel."
          </div>
        </div>

        {/* Chat Bubble 2: Floating from Right */}
        <div
          style={{
            position: 'absolute',
            right: '20px',
            bottom: '140px',
            transform: `scale(${chat2Spring}) translateX(${interpolate(chat2Spring, [0, 1], [50, 0])}px)`,
            opacity: chat2Spring * chatFadeOut,
            background: 'rgba(15, 23, 42, 0.88)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '24px 24px 6px 24px',
            padding: '20px 28px',
            maxWidth: '340px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(239, 68, 68, 0.15)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#EF4444' }} />
            <span style={{ color: '#F87171', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
              Seller Risk
            </span>
          </div>
          <div style={{ color: '#FFFFFF', fontSize: '18px', fontWeight: 600, lineHeight: 1.4 }}>
            "Ship first bro, I promise I'll UPI after I receive it."
          </div>
        </div>

        {/* Climax Reveal: WHO TRUSTS WHO FIRST? */}
        {frame > 135 && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              transform: `scale(${climaxSpring}) translateY(${interpolate(climaxSpring, [0, 1], [30, 0])}px)`,
              opacity: climaxSpring,
              background: 'rgba(7, 11, 20, 0.85)',
              backdropFilter: 'blur(16px)',
              borderRadius: '32px',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              boxShadow: '0 0 80px rgba(239, 68, 68, 0.25)',
              padding: '40px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: '64px',
                fontWeight: 900,
                color: '#FFFFFF',
                letterSpacing: '-1.5px',
                textTransform: 'uppercase',
                textShadow: '0 0 40px rgba(239, 68, 68, 0.6)',
              }}
            >
              Who Trusts Who First?
            </div>
            <div
              style={{
                color: '#94A3B8',
                fontSize: '22px',
                fontWeight: 600,
                marginTop: '12px',
                letterSpacing: '0.5px',
              }}
            >
              No Escrow • No Physical Audit • 100% Advance Risk
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
