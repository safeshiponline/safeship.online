import React from 'react';
import { interpolate, spring, useCurrentFrame } from 'remotion';
import { MOTION_PHYSICS, PALETTE } from '../constants/physics';
import { GlassCard } from '../components/ui/GlassCard';
import { KineticHeader } from '../components/ui/KineticHeader';
import { SpatialCursor } from '../components/ui/SpatialCursor';
import { Badge } from '../components/ui/Badge';
import {
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  RefreshCw,
  Sparkles,
  Lock,
  Truck,
} from 'lucide-react';

export const Scene4Settlement: React.FC = () => {
  const frame = useCurrentFrame();

  // Scene 4 runs for 375 frames total (master frames 1465 to 1840)
  // Beat A (Release): frames 0 to 155 ("Happy? You release the payment to the seller.")
  // Beat B (Refund): frames 155 to 375 ("Something wrong? You get 100% of your money right back.")

  const isBeatB = frame >= 155;

  // Camera drift
  const cameraZoom = interpolate(frame, [0, 375], [0.98, 1.05], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Scene fade in / out
  const sceneOpacity = interpolate(frame, [0, 15, 360, 375], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Beat A Springs & Cursor
  const beatASpring = spring({
    frame: frame - 10,
    fps: 60,
    config: MOTION_PHYSICS.SNAPPY_SPRING,
  });

  // Cursor gliding toward "Release Payment" (frames 40 - 85)
  const cursorX = interpolate(frame, [40, 80], [780, 960], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const cursorY = interpolate(frame, [40, 80], [840, 660], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const isClickingA = frame >= 80 && frame <= 95;
  const isReleased = frame >= 85;

  const releaseSpring = spring({
    frame: frame - 85,
    fps: 60,
    config: MOTION_PHYSICS.SNAPPY_SPRING,
  });

  // Beat B Springs & Card Flip (Frame 155 onwards)
  const cardFlipSpring = spring({
    frame: frame - 155,
    fps: 60,
    config: MOTION_PHYSICS.CARD_FLIP_SPRING,
  });

  const cardRotateY = interpolate(cardFlipSpring, [0, 1], [0, 180]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: '#080808',
        opacity: sceneOpacity,
        transform: `scale(${cameraZoom})`,
        transformOrigin: 'center center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '50px 80px',
        overflow: 'hidden',
        fontFamily: "'Geist', 'Inter', -apple-system, sans-serif",
      }}
    >
      {/* Dynamic Background Volumetric Glow */}
      <div
        style={{
          position: 'absolute',
          top: '40%',
          left: '50%',
          width: 900,
          height: 600,
          transform: 'translate(-50%, -50%)',
          background: isBeatB
            ? 'radial-gradient(circle, rgba(0, 102, 255, 0.18) 0%, rgba(16, 185, 129, 0.12) 50%, transparent 75%)'
            : 'radial-gradient(circle, rgba(16, 185, 129, 0.22) 0%, rgba(0, 102, 255, 0.12) 50%, transparent 75%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
        }}
      />

      {/* Cybernetic Grid Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
          maskImage: 'radial-gradient(circle at center, black 40%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 80%)',
          pointerEvents: 'none',
        }}
      />

      {/* KINETIC EDITORIAL HEADLINE */}
      <div style={{ textAlign: 'center', marginBottom: 32, zIndex: 10 }}>
        {!isBeatB ? (
          <KineticHeader
            words={[
              { text: 'Happy?', isAccent: true, accentColor: '#10B981' },
              { text: 'You', isAccent: false },
              { text: 'release', isAccent: true, accentColor: '#FFFFFF' },
              { text: 'the', isAccent: false },
              { text: 'payment', isAccent: false },
              { text: 'to', isAccent: false },
              { text: 'the', isAccent: false },
              { text: 'seller.', isAccent: false },
            ]}
            frame={frame}
            startFrame={5}
            stagger={4}
            fontSize={44}
            accentFontSize={56}
            theme="dark"
          />
        ) : (
          <KineticHeader
            words={[
              { text: 'Something', isAccent: false },
              { text: 'wrong?', isAccent: true, accentColor: '#EF4444' },
              { text: 'You', isAccent: false },
              { text: 'get', isAccent: false },
              { text: '100%', isAccent: true, accentColor: '#10B981' },
              { text: 'of', isAccent: false },
              { text: 'your', isAccent: false },
              { text: 'money', isAccent: false },
              { text: 'right', isAccent: true, accentColor: '#10B981' },
              { text: 'back.', isAccent: false },
            ]}
            frame={frame - 155}
            startFrame={5}
            stagger={4}
            fontSize={44}
            accentFontSize={56}
            theme="dark"
          />
        )}
      </div>

      {/* 3D PERSPECTIVE CARD STAGE */}
      <div
        style={{
          perspective: 1200,
          width: 720,
          minHeight: 440,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 10,
        }}
      >
        {/* BEAT A: RELEASE PAYMENT CARD (Frames 0 - 155) */}
        {!isBeatB && (
          <div
            style={{
              width: '100%',
              transform: `perspective(1200px) rotateX(4deg) translateY(${(1 - beatASpring) * 40}px) scale(${beatASpring})`,
            }}
          >
            <GlassCard
              theme="dark"
              rounded={28}
              padding="36px 44px"
              borderColor={isReleased ? 'rgba(16, 185, 129, 0.5)' : undefined}
              glowColor={isReleased ? 'rgba(16, 185, 129, 0.3)' : undefined}
            >
              {/* Top Row: Device Verified Badge */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 14,
                      background: 'rgba(16, 185, 129, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                    }}
                  >
                    <CheckCircle2 size={24} color="#10B981" />
                  </div>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: '#FFFFFF' }}>
                      Doorstep Inspection Approved
                    </div>
                    <div style={{ fontSize: 13, color: '#94A3B8' }}>Buyer: "Device authentic & flawless"</div>
                  </div>
                </div>

                <Badge variant="success" size="md" dot>
                  Ready For Payout
                </Badge>
              </div>

              {/* Amount Display */}
              <div
                style={{
                  padding: '20px 24px',
                  borderRadius: 20,
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 24,
                }}
              >
                <div>
                  <span style={{ fontSize: 12, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Seller Payout Authorization
                  </span>
                  <div
                    style={{
                      fontSize: 42,
                      fontWeight: 900,
                      fontFamily: "'Geist', monospace",
                      color: '#FFFFFF',
                      letterSpacing: '-0.03em',
                      marginTop: 2,
                    }}
                  >
                    ₹65,000.00
                  </div>
                </div>

                <div
                  style={{
                    padding: '8px 16px',
                    borderRadius: 12,
                    background: isReleased ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                    color: isReleased ? '#10B981' : '#FFFFFF',
                    fontWeight: 700,
                    fontSize: 13,
                  }}
                >
                  {isReleased ? 'DISPATCHED ⚡' : 'LOCKED IN VAULT'}
                </div>
              </div>

              {/* Release Button with Click Action */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 12,
                  width: '100%',
                  padding: '16px 24px',
                  borderRadius: 18,
                  background: isReleased
                    ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                    : 'linear-gradient(135deg, #0066FF 0%, #0044BB 100%)',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: 16,
                  boxShadow: isReleased
                    ? '0 10px 30px rgba(16, 185, 129, 0.4)'
                    : '0 10px 30px rgba(0, 102, 255, 0.35)',
                  transform: `scale(${isClickingA ? 0.96 : 1})`,
                  transition: 'all 0.12s ease',
                }}
              >
                {isReleased ? (
                  <>
                    <Sparkles size={20} />
                    <span>₹65,000 DISPATCHED TO SELLER INSTANTLY</span>
                  </>
                ) : (
                  <>
                    <span>Release Payment to Seller</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </div>
            </GlassCard>
          </div>
        )}

        {/* BEAT B: 100% REFUND & REVERSE RETURN (Frames 155 - 375) */}
        {isBeatB && (
          <div
            style={{
              width: '100%',
              transform: `perspective(1200px) rotateX(4deg) scale(${interpolate(cardFlipSpring, [0, 1], [0.92, 1])})`,
            }}
          >
            <GlassCard
              theme="dark"
              rounded={28}
              padding="36px 44px"
              borderColor="rgba(16, 185, 129, 0.4)"
              glowColor="rgba(16, 185, 129, 0.2)"
            >
              {/* Header: Disputed / Failed Inspection Protection */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 14,
                      background: 'rgba(239, 68, 68, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                    }}
                  >
                    <RotateCcw size={22} color="#EF4444" />
                  </div>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: '#FFFFFF' }}>
                      Device Rejected at Doorstep
                    </div>
                    <div style={{ fontSize: 13, color: '#94A3B8' }}>
                      Reason: Screen flicker / mismatched specs
                    </div>
                  </div>
                </div>

                <Badge variant="success" size="md" dot>
                  Instant Refund
                </Badge>
              </div>

              {/* 100% Money Back Display */}
              <div
                style={{
                  padding: '20px 24px',
                  borderRadius: 20,
                  background: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 20,
                }}
              >
                <div>
                  <span style={{ fontSize: 12, color: '#10B981', fontWeight: 700, textTransform: 'uppercase' }}>
                    100% Buyer Refund Credited Back
                  </span>
                  <div
                    style={{
                      fontSize: 42,
                      fontWeight: 900,
                      fontFamily: "'Geist', monospace",
                      color: '#FFFFFF',
                      letterSpacing: '-0.03em',
                      marginTop: 2,
                    }}
                  >
                    ₹65,000.00
                  </div>
                </div>

                <div
                  style={{
                    padding: '8px 16px',
                    borderRadius: 12,
                    background: 'rgba(16, 185, 129, 0.2)',
                    color: '#10B981',
                    fontWeight: 800,
                    fontSize: 13,
                  }}
                >
                  FULL REFUND ✓
                </div>
              </div>

              {/* Automated Return Label Card */}
              <div
                style={{
                  padding: '16px 20px',
                  borderRadius: 16,
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Truck size={20} color="#60A5FA" />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#FFFFFF' }}>
                      Automated Reverse Pickup
                    </div>
                    <div style={{ fontSize: 12, color: '#94A3B8' }}>
                      Prepaid return shipping label generated • Item goes right back
                    </div>
                  </div>
                </div>
                <Badge variant="obsidian" size="sm">
                  Prepaid
                </Badge>
              </div>
            </GlassCard>
          </div>
        )}
      </div>

      {/* Tactile Cursor in Beat A */}
      {frame >= 40 && frame < 155 && (
        <SpatialCursor
          x={cursorX}
          y={cursorY}
          label="You"
          isClicking={isClickingA}
          clickFrame={frame >= 80 ? frame - 80 : 0}
          theme="dark"
          color="#10B981"
        />
      )}
    </div>
  );
};
