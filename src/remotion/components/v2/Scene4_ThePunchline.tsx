import React from 'react';
import { interpolate, spring, useCurrentFrame } from 'remotion';

export const Scene4_ThePunchline: React.FC = () => {
  const frame = useCurrentFrame();

  // Active window: frames 778 to 965
  if (frame < 778 || frame > 965) return null;

  const localFrame = frame - 780;

  // Scene fade in / fade out
  const sceneOpacity = interpolate(localFrame, [0, 8, 172, 180], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Approval Path (localFrame 0 - 90) vs Alternate Safety Path (localFrame 90 - 180)
  const isAlternatePath = localFrame >= 90;

  // Modal Arrival Spring (localFrame 0 to 30)
  const modalSpring = spring({
    frame: localFrame - 2,
    fps: 30,
    config: { mass: 0.5, damping: 12, stiffness: 140 },
  });

  // Cursor Bezier Swoop over "Release Payment" (localFrame 10 to 38)
  const cursorX = interpolate(localFrame, [10, 36], [750, 240], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const cursorY = interpolate(localFrame, [10, 36], [480, 410], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Button Click Micro-scale Bounce (at localFrame 36 - 48)
  const btnClickScale = interpolate(localFrame, [34, 38, 44], [1, 0.93, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Emerald Radial Wave Ripple (localFrame 38 to 75)
  const rippleScale = interpolate(localFrame, [38, 75], [0, 2.5], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const rippleOpacity = interpolate(localFrame, [38, 75], [0.8, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Success Notification fly up (localFrame 50 to 80)
  const successSpring = spring({
    frame: localFrame - 50,
    fps: 30,
    config: { mass: 0.5, damping: 12, stiffness: 140 },
  });

  // Card 3D Flip on Y-axis into Alternate Safety Path (localFrame 90 to 125)
  const flipRotation = interpolate(localFrame, [90, 120], [0, 180], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Refund reversal progress (localFrame 125 to 165)
  const refundProgress = interpolate(localFrame, [125, 160], [0, 100], {
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
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '50px 100px',
        color: '#FFFFFF',
        overflow: 'hidden',
        zIndex: 55,
      }}
    >
      {/* Background Ambient Glow */}
      <div
        style={{
          position: 'absolute',
          width: 800,
          height: 800,
          borderRadius: '50%',
          background: isAlternatePath
            ? 'radial-gradient(circle, rgba(239, 68, 68, 0.12) 0%, transparent 65%)'
            : 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 65%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />

      {/* Top Punchline Voiceover Header */}
      <div
        style={{
          position: 'absolute',
          top: 60,
          textAlign: 'center',
        }}
      >
        <span
          className="micro-tag"
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: isAlternatePath ? '#EF4444' : '#10B981',
            background: isAlternatePath ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
            border: isAlternatePath ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)',
            padding: '5px 16px',
            borderRadius: 999,
          }}
        >
          {isAlternatePath ? 'SCENARIO B: INSTANT REFUND SAFETY NET' : 'SCENARIO A: MUTUAL APPROVAL'}
        </span>
        <h2
          className="font-sans-ui"
          style={{
            fontSize: 42,
            fontWeight: 800,
            marginTop: 10,
            letterSpacing: '-0.03em',
          }}
        >
          {!isAlternatePath ? (
            <span>
              Happy? You <span className="font-editorial" style={{ color: '#10B981', fontSize: 50 }}>release</span> the payment.
            </span>
          ) : (
            <span>
              Something wrong? You get <span className="font-editorial" style={{ color: '#38BDF8', fontSize: 50 }}>100%</span> refunded.
            </span>
          )}
        </h2>
      </div>

      {/* 3D Perspective Card Arena */}
      <div
        style={{
          perspective: 1200,
          width: 820,
          height: 480,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            transformStyle: 'preserve-3d',
            transform: `scale(${modalSpring}) rotateY(${flipRotation}deg)`,
            position: 'relative',
          }}
        >
          {/* ========================================================================= */}
          {/* FRONT FACE: THE APPROVAL PATH (00:26 - 00:29)                             */}
          {/* ========================================================================= */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backfaceVisibility: 'hidden',
              background: 'rgba(23, 23, 23, 0.85)',
              backdropFilter: 'blur(28px)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: 32,
              padding: '36px 44px',
              boxShadow: '0 30px 80px rgba(0, 0, 0, 0.7)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              overflow: 'hidden',
            }}
          >
            {/* Header: Deal settlement summary */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span className="micro-tag" style={{ fontSize: 11, color: '#10B981', fontWeight: 700 }}>
                  INSPECTION VERIFIED
                </span>
                <div className="font-sans-ui" style={{ fontSize: 26, fontWeight: 800, color: '#FFFFFF', marginTop: 2 }}>
                  iPhone 15 Pro • Passed 10-Min Check
                </div>
              </div>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                  color: '#FFFFFF',
                  letterSpacing: '-0.02em',
                }}
              >
                ₹65,000
              </div>
            </div>

            {/* Escrow Hold Visual Status */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 20,
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{ fontSize: 28 }}>{localFrame >= 38 ? '🔓' : '🔒'}</span>
                <div>
                  <div className="font-sans-ui" style={{ fontSize: 16, fontWeight: 700 }}>
                    {localFrame >= 38 ? 'Escrow Vault Unlocked' : 'Funds Secured in Escrow Vault'}
                  </div>
                  <div style={{ fontSize: 12, color: '#94A3B8' }}>
                    {localFrame >= 38 ? 'Transferring ₹65,000 to Seller UPI ID...' : 'Awaiting your 1-tap final payout approval'}
                  </div>
                </div>
              </div>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: localFrame >= 38 ? '#10B981' : '#F59E0B',
                  background: localFrame >= 38 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                  padding: '6px 14px',
                  borderRadius: 999,
                }}
              >
                {localFrame >= 38 ? '✓ Settled' : 'Pending Action'}
              </span>
            </div>

            {/* Master Dual Action Pills */}
            <div style={{ display: 'flex', gap: 16, position: 'relative' }}>
              {/* Emerald Wave Ripple behind Release button */}
              {localFrame >= 38 && (
                <div
                  style={{
                    position: 'absolute',
                    left: 20,
                    top: -10,
                    width: 320,
                    height: 80,
                    borderRadius: 999,
                    background: '#10B981',
                    transform: `scale(${rippleScale})`,
                    opacity: rippleOpacity,
                    pointerEvents: 'none',
                  }}
                />
              )}

              {/* [Release Payment] Button */}
              <div
                style={{
                  flex: 1.6,
                  padding: '18px 24px',
                  borderRadius: 18,
                  background: '#10B981',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  fontSize: 16,
                  fontWeight: 700,
                  transform: `scale(${btnClickScale})`,
                  boxShadow: '0 12px 30px rgba(16, 185, 129, 0.35)',
                  cursor: 'pointer',
                }}
              >
                <span>✓</span>
                <span>Release Payment to Seller</span>
              </div>

              {/* [Reject & Return] Button */}
              <div
                style={{
                  flex: 1,
                  padding: '18px 20px',
                  borderRadius: 18,
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#94A3B8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  fontSize: 15,
                  fontWeight: 600,
                }}
              >
                <span>✕</span>
                <span>Reject &amp; Return</span>
              </div>
            </div>

            {/* Flying Success Notification Modal (Local Frame 50+) */}
            {localFrame >= 50 && localFrame < 90 && (
              <div
                style={{
                  position: 'absolute',
                  inset: 20,
                  borderRadius: 24,
                  background: 'rgba(16, 185, 129, 0.95)',
                  backdropFilter: 'blur(20px)',
                  color: '#FFFFFF',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: `scale(${successSpring})`,
                  boxShadow: '0 24px 70px rgba(16, 185, 129, 0.45)',
                  zIndex: 40,
                }}
              >
                <div style={{ fontSize: 48, marginBottom: 8 }}>⚡</div>
                <div className="font-sans-ui" style={{ fontSize: 26, fontWeight: 800 }}>
                  ₹65,000 Transferred Instantly!
                </div>
                <div style={{ fontSize: 14, opacity: 0.95, marginTop: 4 }}>
                  Payout settled to Seller Bank (IMPS/UPI) • SafeShip Transaction Complete
                </div>
              </div>
            )}
          </div>

          {/* ========================================================================= */}
          {/* BACK FACE: THE ALTERNATE SAFETY / REFUND PATH (00:29 - 00:32)             */}
          {/* ========================================================================= */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              background: 'rgba(23, 23, 23, 0.9)',
              backdropFilter: 'blur(28px)',
              border: '1.5px solid rgba(239, 68, 68, 0.4)',
              borderRadius: 32,
              padding: '36px 44px',
              boxShadow: '0 30px 80px rgba(239, 68, 68, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            {/* Header: Alert Flagged */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 28 }}>⚠️</span>
                <div>
                  <span className="micro-tag" style={{ fontSize: 11, color: '#EF4444', fontWeight: 800 }}>
                    DISPUTE / ISSUE FLAGGED
                  </span>
                  <div className="font-sans-ui" style={{ fontSize: 24, fontWeight: 800, color: '#FFFFFF' }}>
                    Issue Flagged: Mismatched Item
                  </div>
                </div>
              </div>
              <span
                style={{
                  background: '#EF4444',
                  color: '#FFFFFF',
                  padding: '6px 14px',
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 800,
                }}
              >
                Escrow Protected
              </span>
            </div>

            {/* Reverse Payout Animation to Buyer */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 20,
                padding: '24px 28px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 14, fontWeight: 700 }}>
                <span>Seller Payout Cancelled</span>
                <span style={{ color: '#38BDF8' }}>100% Refund Returning to Buyer...</span>
              </div>
              <div style={{ width: '100%', height: 8, background: 'rgba(255, 255, 255, 0.1)', borderRadius: 4, overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${refundProgress}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #38BDF8, #10B981)',
                  }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, fontSize: 13, color: '#94A3B8' }}>
                <span>Seller receives ₹0</span>
                <span style={{ color: '#FFFFFF', fontWeight: 700 }}>Full ₹65,000 Credited to Your Account</span>
              </div>
            </div>

            {/* Automated Return Courier Label */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px dashed rgba(255, 255, 255, 0.2)',
                borderRadius: 16,
                padding: '14px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span>📦</span>
                <div style={{ fontSize: 13, color: '#E2E8F0' }}>
                  Prepaid Return Courier Dispatched • Zero Cost to Buyer
                </div>
              </div>
              <span className="micro-tag" style={{ fontSize: 11, color: '#10B981', fontWeight: 700 }}>
                ✓ RETURN ACTIVE
              </span>
            </div>
          </div>
        </div>

        {/* Animated "You" Cursor Swoop (localFrame 10 to 45) */}
        {!isAlternatePath && localFrame >= 10 && localFrame < 45 && (
          <div
            style={{
              position: 'absolute',
              left: cursorX,
              top: cursorY,
              zIndex: 50,
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 3L11 20L14 13L21 10L4 3Z"
                fill="#10B981"
                stroke="#FFFFFF"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </svg>
            <span
              style={{
                background: '#10B981',
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
    </div>
  );
};
