import React from 'react';
import { interpolate, spring, useCurrentFrame } from 'remotion';

export const Scene1_TheHook: React.FC = () => {
  const frame = useCurrentFrame();

  // Active window: frames 0 to 240
  if (frame > 245) return null;

  // Fade out slightly into Scene 2 transition at frame 230-240
  const sceneOpacity = interpolate(frame, [0, 15, 230, 240], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Staggered word-by-word entrance for hook headline (frames 5 to 70)
  const hookWords = [
    { text: "Buying", isEditorial: false },
    { text: "an", isEditorial: false },
    { text: "iPhone", isEditorial: false },
    { text: "from", isEditorial: false },
    { text: "someone", isEditorial: false },
    { text: "in", isEditorial: false },
    { text: "Bangalore", isEditorial: true },
    { text: "while", isEditorial: false },
    { text: "sitting", isEditorial: false },
    { text: "in", isEditorial: false },
    { text: "Delhi?", isEditorial: true },
  ];

  // Location Badges Entrance Spring (frames 20 - 50)
  const badgeSpring = spring({
    frame: frame - 20,
    fps: 30,
    config: { mass: 0.5, damping: 12, stiffness: 140 },
  });

  // Data Thread Light Pulse (frames 30 to 90)
  const threadPulse = interpolate(frame, [30, 85], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Phase 2: "Never send advance money on UPI" (starts frame 90)
  const upiPhaseOpacity = interpolate(frame, [85, 95], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // "You" Cursor Tracking toward Approve button (frames 95 to 140)
  const cursorX = interpolate(frame, [95, 135], [780, 960], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const cursorY = interpolate(frame, [95, 135], [720, 680], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Crimson Hazard Card Drop (frames 130 - 180)
  const hazardSpring = spring({
    frame: frame - 130,
    fps: 30,
    config: { mass: 0.5, damping: 12, stiffness: 140 },
  });

  // Red line shatter & shake (frame 135+)
  const isShattered = frame >= 135;
  const shakeOffset = isShattered && frame < 170
    ? Math.sin(frame * 1.5) * interpolate(frame, [135, 170], [8, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;

  // Phase 3: "And never ship your phone hoping a stranger will pay" (frames 175 to 240)
  const ghostPhaseOpacity = interpolate(frame, [175, 190], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const driftZ = interpolate(frame, [180, 240], [0, -180], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const driftScale = interpolate(frame, [180, 240], [1, 0.88], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        opacity: sceneOpacity,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 100px',
        color: '#111111',
      }}
    >
      {/* 1. Top Editorial Headline with Staggered Word Reveal */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'baseline',
          columnGap: '14px',
          rowGap: '6px',
          maxWidth: 1380,
          textAlign: 'center',
          marginBottom: 44,
          transform: `translateY(${shakeOffset}px)`,
        }}
      >
        {hookWords.map((word, i) => {
          const wordFrame = frame - (8 + i * 4.5);
          const wordSpring = spring({
            frame: wordFrame,
            fps: 30,
            config: { mass: 0.5, damping: 12, stiffness: 140 },
          });
          const wordOpacity = interpolate(wordFrame, [0, 6], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });

          return (
            <span
              key={i}
              className={word.isEditorial ? 'font-editorial' : 'font-sans-ui'}
              style={{
                fontSize: word.isEditorial ? 62 : 48,
                fontWeight: word.isEditorial ? 400 : 600,
                color: word.isEditorial ? '#0066FF' : '#111111',
                opacity: wordOpacity,
                transform: `translateY(${(1 - wordSpring) * 20}px)`,
                display: 'inline-block',
                letterSpacing: word.isEditorial ? '0.01em' : '-0.03em',
              }}
            >
              {word.text}
            </span>
          );
        })}
      </div>

      {/* 2. Middle Interactive Stage: Location Badges + Data Thread + Frosted Modal */}
      <div
        style={{
          position: 'relative',
          width: 1400,
          height: 480,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Horizontal Connecting Data Thread */}
        <div
          style={{
            position: 'absolute',
            left: 180,
            right: 180,
            top: 240,
            height: 2,
            background: isShattered
              ? 'repeating-linear-gradient(90deg, #EF4444, #EF4444 8px, transparent 8px, transparent 16px)'
              : '#E2E8F0',
            transition: 'background 0.2s ease',
          }}
        >
          {/* Traveling Light Pulse (before shatter) */}
          {!isShattered && (
            <div
              style={{
                position: 'absolute',
                top: -3,
                left: `${threadPulse}%`,
                width: 32,
                height: 8,
                borderRadius: 4,
                background: 'linear-gradient(90deg, transparent, #0066FF, transparent)',
                boxShadow: '0 0 12px #0066FF',
              }}
            />
          )}
        </div>

        {/* Left Location Badge: DELHI */}
        <div
          style={{
            position: 'absolute',
            left: 60,
            top: 212,
            transform: `scale(${badgeSpring}) translateX(${(1 - badgeSpring) * -50}px)`,
            background: '#FFFFFF',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            padding: '12px 24px',
            borderRadius: 999,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.04)',
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: '#0066FF',
              boxShadow: '0 0 8px #0066FF',
            }}
          />
          <span className="font-sans-ui" style={{ fontWeight: 700, fontSize: 16, color: '#111111' }}>
            DELHI
          </span>
          <span className="micro-tag" style={{ fontSize: 11, color: '#64748B' }}>
            28.61° N
          </span>
        </div>

        {/* Right Location Badge: BANGALORE */}
        <div
          style={{
            position: 'absolute',
            right: 60,
            top: 212,
            transform: `scale(${badgeSpring}) translateX(${(1 - badgeSpring) * 50}px)`,
            background: '#FFFFFF',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            padding: '12px 24px',
            borderRadius: 999,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.04)',
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: '#10B981',
              boxShadow: '0 0 8px #10B981',
            }}
          />
          <span className="font-sans-ui" style={{ fontWeight: 700, fontSize: 16, color: '#111111' }}>
            BANGALORE
          </span>
          <span className="micro-tag" style={{ fontSize: 11, color: '#64748B' }}>
            12.97° E
          </span>
        </div>

        {/* Central Frosted Glass Deal Modal: iPhone 15 Pro (₹65,000) */}
        <div
          style={{
            width: 480,
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(24px)',
            border: isShattered ? '1.5px solid #EF4444' : '1px solid rgba(0, 0, 0, 0.08)',
            borderRadius: 24,
            padding: '28px 32px',
            boxShadow: isShattered
              ? '0 24px 60px rgba(239, 68, 68, 0.18)'
              : '0 24px 60px rgba(0, 0, 0, 0.07)',
            transform: `perspective(1000px) translateZ(${driftZ}px) scale(${driftScale}) translateY(${shakeOffset}px)`,
            zIndex: 10,
            position: 'relative',
          }}
        >
          {/* Card Header: Device info */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <div className="micro-tag" style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>
                P2P GADGET TRADE
              </div>
              <div className="font-sans-ui" style={{ fontSize: 22, fontWeight: 700, color: '#0F172A', marginTop: 2 }}>
                Apple iPhone 15 Pro
              </div>
            </div>
            <div
              style={{
                fontSize: 24,
                fontWeight: 800,
                color: '#0F172A',
                letterSpacing: '-0.03em',
              }}
            >
              ₹65,000
            </div>
          </div>

          {/* Specs Mini-Pills */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
            <span style={{ fontSize: 12, background: '#F1F5F9', padding: '4px 10px', borderRadius: 6, color: '#475569', fontWeight: 600 }}>
              Natural Titanium
            </span>
            <span style={{ fontSize: 12, background: '#F1F5F9', padding: '4px 10px', borderRadius: 6, color: '#475569', fontWeight: 600 }}>
              256 GB
            </span>
            <span style={{ fontSize: 12, background: '#F1F5F9', padding: '4px 10px', borderRadius: 6, color: '#475569', fontWeight: 600 }}>
              Battery 98%
            </span>
          </div>

          {/* Interactive Mock UPI CTA Button */}
          <div
            style={{
              width: '100%',
              padding: '14px 20px',
              borderRadius: 14,
              background: isShattered ? '#FEE2E2' : '#0F172A',
              color: isShattered ? '#991B1B' : '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: 14,
              fontWeight: 700,
              boxShadow: isShattered ? 'none' : '0 10px 20px rgba(15, 23, 42, 0.15)',
            }}
          >
            <span>{isShattered ? '⚠️ UNPROTECTED PAYMENT BLOCKED' : 'Send Advance via UPI PIN'}</span>
            <span style={{ fontSize: 16 }}>{isShattered ? '✕' : '→'}</span>
          </div>

          {/* Crimson Hazard Alert Card Overhang (Frame 130+) */}
          {frame >= 130 && (
            <div
              style={{
                position: 'absolute',
                top: -24,
                left: 20,
                right: 20,
                background: '#EF4444',
                color: '#FFFFFF',
                borderRadius: 14,
                padding: '12px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                boxShadow: '0 16px 40px rgba(239, 68, 68, 0.35)',
                transform: `scale(${hazardSpring}) translateY(${(1 - hazardSpring) * -30}px)`,
                zIndex: 20,
              }}
            >
              <span style={{ fontSize: 20 }}>⚠️</span>
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  NEVER SEND ADVANCE UPI
                </div>
                <div style={{ fontSize: 11, opacity: 0.95, fontWeight: 500 }}>
                  High Risk • Zero buyer protection • 87% of P2P scams happen here
                </div>
              </div>
            </div>
          )}

          {/* Ghosting Chat Bubble Warning (Frame 175+) */}
          {frame >= 175 && (
            <div
              style={{
                position: 'absolute',
                bottom: -56,
                right: -28,
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: 16,
                padding: '10px 16px',
                boxShadow: '0 14px 35px rgba(0, 0, 0, 0.1)',
                opacity: ghostPhaseOpacity,
                transform: `translateY(${(1 - ghostPhaseOpacity) * 20}px)`,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                zIndex: 25,
              }}
            >
              <span style={{ fontSize: 14 }}>💬</span>
              <div>
                <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>Seller WhatsApp</div>
                <div style={{ fontSize: 12, color: '#0F172A', fontWeight: 700 }}>
                  "Courier dispatched bro..." <span style={{ color: '#94A3B8' }}>✓ (Unread)</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Animated "You" Cursor Tracking */}
        {frame >= 95 && frame < 145 && (
          <div
            style={{
              position: 'absolute',
              left: cursorX,
              top: cursorY,
              zIndex: 30,
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            {/* SVG Cursor Pointer */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 3L11 20L14 13L21 10L4 3Z"
                fill="#0F172A"
                stroke="#FFFFFF"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </svg>
            <span
              style={{
                background: '#0F172A',
                color: '#FFFFFF',
                fontSize: 10,
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: 999,
              }}
            >
              You
            </span>
          </div>
        )}
      </div>

      {/* 3. Bottom Subtitle Cues */}
      <div
        style={{
          marginTop: 20,
          opacity: frame >= 90 ? upiPhaseOpacity : 0.6,
          fontSize: 16,
          fontWeight: 600,
          color: frame >= 135 ? '#EF4444' : '#64748B',
          textAlign: 'center',
        }}
      >
        {frame >= 175
          ? 'And never ship your phone hoping a stranger will pay.'
          : frame >= 90
          ? 'Never send advance money on UPI.'
          : 'P2P Electronic Trading Dilemma • Bangalore ⇄ Delhi'}
      </div>
    </div>
  );
};
