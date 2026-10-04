import React from 'react';
import { interpolate, spring, useCurrentFrame } from 'remotion';
import { MOTION_PHYSICS, PALETTE } from '../constants/physics';
import { GlassCard } from '../components/ui/GlassCard';
import { KineticHeader } from '../components/ui/KineticHeader';
import { RouteMap } from '../components/ui/RouteMap';
import { SpatialCursor } from '../components/ui/SpatialCursor';
import { Badge } from '../components/ui/Badge';
import { AlertTriangle, ArrowRight, ShieldAlert, XCircle, Smartphone, Send } from 'lucide-react';

export const Scene1Hook: React.FC = () => {
  const frame = useCurrentFrame();

  // Active duration: 0 to 565 frames
  // Continuous cinematic camera push
  const cameraScale = interpolate(frame, [0, 565], [1.0, 1.05], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Scene fade out into Scene 2 radial transition (frame 545 - 565)
  const sceneOpacity = interpolate(frame, [0, 15, 545, 565], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Phase switch: frame 360 switches from Buyer UPI risk to Seller Ship risk
  const isPhase2 = frame >= 360;

  // Phase 1 Header Words
  const hookWords = [
    { text: 'Buying', isAccent: false },
    { text: 'an', isAccent: false },
    { text: 'iPhone', isAccent: false },
    { text: 'from', isAccent: false },
    { text: 'someone', isAccent: false },
    { text: 'in', isAccent: false },
    { text: 'Bangalore', isAccent: true, accentColor: '#2563EB' },
    { text: 'while', isAccent: false },
    { text: 'sitting', isAccent: false },
    { text: 'in', isAccent: false },
    { text: 'Delhi?', isAccent: true, accentColor: '#10B981' },
  ];

  // Warning subhead (frames 135 - 360)
  const upiWarningSpring = spring({
    frame: frame - 135,
    fps: 60,
    config: MOTION_PHYSICS.HEAVY_DROP_SPRING,
  });

  // UPI Card Drop (frames 160 - 360)
  const upiCardSpring = spring({
    frame: frame - 160,
    fps: 60,
    config: MOTION_PHYSICS.HEAVY_DROP_SPRING,
  });

  // Fraud Slam / Fracture (frame 270 onwards)
  const isFractured = frame >= 270;
  const fractureSpring = spring({
    frame: frame - 270,
    fps: 60,
    config: MOTION_PHYSICS.SNAPPY_SPRING,
  });

  // Cursor glide toward "Pay via UPI PIN" button center (X: 600, Y: 505)
  const cursorX = interpolate(frame, [200, 260], [420, 600], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const cursorY = interpolate(frame, [200, 260], [680, 505], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const isClicking = frame >= 260 && frame <= 275;

  // Phase 2: Seller Risk (frames 360 - 565)
  const sellerWords = [
    { text: 'And', isAccent: false },
    { text: 'never', isAccent: true, accentColor: '#EF4444' },
    { text: 'ship', isAccent: false },
    { text: 'your', isAccent: false },
    { text: 'phone', isAccent: false },
    { text: 'hoping', isAccent: false },
    { text: 'a', isAccent: false },
    { text: 'stranger', isAccent: true, accentColor: '#EF4444' },
    { text: 'will', isAccent: false },
    { text: 'pay.', isAccent: false },
  ];

  const sellerCardSpring = spring({
    frame: frame - 375,
    fps: 60,
    config: MOTION_PHYSICS.HEAVY_DROP_SPRING,
  });

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: '#F8F7F4',
        opacity: sceneOpacity,
        transform: `scale(${cameraScale})`,
        transformOrigin: 'center center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 80px',
        overflow: 'hidden',
        fontFamily: "'Geist', 'Inter', -apple-system, sans-serif",
      }}
    >
      {/* Background Dot Matrix Grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'radial-gradient(circle, rgba(0, 0, 0, 0.08) 1.2px, transparent 1.2px)',
          backgroundSize: '28px 28px',
          opacity: 0.65,
          pointerEvents: 'none',
        }}
      />

      {/* Ambient radial glow */}
      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          width: 850,
          height: 600,
          transform: 'translate(-50%, -50%)',
          background: isFractured
            ? 'radial-gradient(circle, rgba(239, 68, 68, 0.09) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* PHASE 1: BUYER UPI FRAUD RISK (Frames 0 - 360) */}
      {!isPhase2 && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            maxWidth: 1200,
            position: 'relative',
            zIndex: 10,
          }}
        >
          {/* Top Kinetic Headline */}
          <KineticHeader
            words={hookWords}
            frame={frame}
            startFrame={10}
            stagger={5}
            fontSize={44}
            accentFontSize={56}
            style={{ marginBottom: 16 }}
          />

          {/* Sub-warning on voiceover: "Never send advance money on UPI" */}
          <div
            style={{
              height: 40,
              display: 'flex',
              alignItems: 'center',
              marginBottom: 20,
            }}
          >
            {frame >= 135 && (
              <div
                style={{
                  transform: `scale(${upiWarningSpring}) translateY(${(1 - upiWarningSpring) * 15}px)`,
                }}
              >
                <Badge variant="danger" size="lg" dot icon={<AlertTriangle size={16} />}>
                  Never send advance money on UPI
                </Badge>
              </div>
            )}
          </div>

          {/* Delhi to Bangalore Kinetic Route Line */}
          <div
            style={{
              transform: `scale(${frame >= 160 ? 0.92 : 1.0}) translateY(${frame >= 160 ? -30 : 0}px)`,
              transition: 'all 0.3s ease',
              opacity: frame >= 160 ? 0.85 : 1.0,
              marginBottom: 10,
            }}
          >
            <RouteMap frame={frame} isFractured={isFractured} />
          </div>

          {/* Floating UPI Payment Simulation Card */}
          {frame >= 160 && (
            <div
              style={{
                position: 'absolute',
                top: 320,
                transform: `perspective(1200px) rotateX(${isFractured ? 6 : 3}deg) translateY(${(1 - upiCardSpring) * 60}px) scale(${upiCardSpring})`,
                zIndex: 50,
                width: 620,
              }}
            >
              <GlassCard
                theme="light"
                rounded={24}
                padding="28px 34px"
                borderColor={isFractured ? 'rgba(239, 68, 68, 0.45)' : undefined}
                glowColor={isFractured ? 'rgba(239, 68, 68, 0.25)' : undefined}
              >
                {/* Header row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: 12,
                        background: '#0F172A',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#FFFFFF',
                        fontWeight: 800,
                        fontSize: 14,
                      }}
                    >
                      UPI
                    </div>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: '#0F172A' }}>
                        P2P Transfer Request
                      </div>
                      <div style={{ fontSize: 13, color: '#64748B' }}>To: stranger_seller99@oksbi</div>
                    </div>
                  </div>

                  <span
                    style={{
                      fontSize: 24,
                      fontWeight: 800,
                      fontFamily: "'Geist', monospace",
                      color: '#0F172A',
                      letterSpacing: '-0.03em',
                    }}
                  >
                    ₹65,000
                  </span>
                </div>

                {/* iPhone 15 Pro item snippet */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '12px 16px',
                    borderRadius: 14,
                    background: 'rgba(0, 0, 0, 0.03)',
                    marginBottom: 18,
                  }}
                >
                  <Smartphone size={20} color="#3B82F6" />
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>
                      iPhone 15 Pro 128GB (Natural Titanium)
                    </span>
                    <span style={{ display: 'block', fontSize: 11, color: '#64748B' }}>
                      Peer-to-Peer Classifieds Listing
                    </span>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#EF4444' }}>UNVERIFIED</span>
                </div>

                {/* Bottom CTA / Button */}
                <div
                  id="pay-button"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                    width: '100%',
                    padding: '15px 20px',
                    borderRadius: 16,
                    background: isFractured
                      ? 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)'
                      : 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: 15,
                    boxShadow: isFractured
                      ? '0 8px 24px rgba(239, 68, 68, 0.4)'
                      : '0 8px 20px rgba(0, 0, 0, 0.15)',
                    transform: `scale(${isClicking ? 0.96 : 1})`,
                    transition: 'all 0.1s ease',
                  }}
                >
                  {isFractured ? (
                    <>
                      <ShieldAlert size={18} />
                      TRANSACTION BLOCKED • HIGH FRAUD RISK
                    </>
                  ) : (
                    <>
                      <span>Pay via UPI PIN</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </div>

                {/* Fraud Alert Badge Overlay */}
                {isFractured && (
                  <div
                    style={{
                      marginTop: 14,
                      padding: '10px 14px',
                      borderRadius: 12,
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      color: '#DC2626',
                      fontSize: 12,
                      fontWeight: 600,
                      transform: `scale(${fractureSpring})`,
                    }}
                  >
                    <XCircle size={16} />
                    <span>Ghosting & fake tracking threat detected. Zero buyer protection.</span>
                  </div>
                )}
              </GlassCard>
            </div>
          )}

          {/* Spatial Cursor gliding to button */}
          {frame >= 200 && frame < 360 && (
            <SpatialCursor
              x={cursorX}
              y={cursorY}
              label="You"
              isClicking={isClicking}
              clickFrame={frame >= 260 ? frame - 260 : 0}
              color={isFractured ? '#EF4444' : '#0F172A'}
            />
          )}
        </div>
      )}

      {/* PHASE 2: SELLER GHOSTING / ADVANCE SHIP RISK (Frames 360 - 565) */}
      {isPhase2 && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            maxWidth: 1200,
            position: 'relative',
            zIndex: 10,
          }}
        >
          {/* Headline for Seller beat */}
          <KineticHeader
            words={sellerWords}
            frame={frame}
            startFrame={365}
            stagger={5}
            fontSize={44}
            accentFontSize={56}
            style={{ marginBottom: 24 }}
          />

          <Badge variant="danger" size="lg" dot icon={<AlertTriangle size={16} />} style={{ marginBottom: 32 }}>
            NEVER SHIP BEFORE SECURED ESCROW
          </Badge>

          {/* Split 3D View: Shipped Box on Left, Ghosted Chat on Right */}
          <div
            style={{
              display: 'flex',
              gap: 36,
              alignItems: 'center',
              transform: `perspective(1200px) rotateX(4deg) translateY(${(1 - sellerCardSpring) * 60}px) scale(${sellerCardSpring})`,
            }}
          >
            {/* Box Sent Into The Void */}
            <GlassCard theme="light" rounded={24} padding="32px 36px" style={{ width: 440 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    background: 'rgba(239, 68, 68, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Smartphone size={22} color="#EF4444" />
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#0F172A' }}>Shipped Gadget</div>
                  <div style={{ fontSize: 12, color: '#64748B' }}>Delhi ➔ Bangalore (Dispatched)</div>
                </div>
              </div>

              <div
                style={{
                  padding: '14px 18px',
                  borderRadius: 14,
                  background: 'rgba(239, 68, 68, 0.06)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  marginBottom: 16,
                }}
              >
                <div style={{ fontSize: 12, color: '#EF4444', fontWeight: 700, textTransform: 'uppercase' }}>
                  Item Status
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', marginTop: 2 }}>
                  Delivered to stranger
                </div>
                <div style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>
                  No escrow protection • Buyer stopped responding
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>Expected Payment</span>
                <span style={{ fontSize: 18, fontWeight: 800, color: '#EF4444' }}>₹0 Received</span>
              </div>
            </GlassCard>

            {/* Ghosted Chat Window */}
            <GlassCard theme="light" rounded={24} padding="32px 36px" style={{ width: 440 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', marginBottom: 14 }}>
                WhatsApp Direct Message
              </div>

              {/* Message 1 from Seller */}
              <div
                style={{
                  alignSelf: 'flex-end',
                  background: '#0F172A',
                  color: '#FFFFFF',
                  padding: '10px 16px',
                  borderRadius: '16px 16px 2px 16px',
                  fontSize: 13,
                  marginBottom: 12,
                  maxWidth: '85%',
                  marginLeft: 'auto',
                }}
              >
                <div>Hey, tracking says phone was delivered. Please UPI ₹65,000!</div>
                <div style={{ fontSize: 10, opacity: 0.7, textAlign: 'right', marginTop: 4 }}>✓✓ Delivered</div>
              </div>

              {/* Ghosted state */}
              <div
                style={{
                  padding: '12px 16px',
                  borderRadius: 12,
                  background: 'rgba(0, 0, 0, 0.04)',
                  fontSize: 12,
                  color: '#64748B',
                  fontStyle: 'italic',
                  textAlign: 'center',
                  marginTop: 20,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                }}
              >
                <XCircle size={14} color="#EF4444" />
                <span>Buyer blocked your number • 0 recourse</span>
              </div>
            </GlassCard>
          </div>
        </div>
      )}
    </div>
  );
};
