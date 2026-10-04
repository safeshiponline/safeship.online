import React from 'react';
import { interpolate, spring, useCurrentFrame } from 'remotion';

export const Scene3_TheTrustLoop: React.FC = () => {
  const frame = useCurrentFrame();

  // Active window: frames 385 to 785
  if (frame < 385 || frame > 785) return null;

  const localFrame = frame - 390;

  // Scene fade in / out
  const sceneOpacity = interpolate(localFrame, [0, 10, 380, 390], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Active step determination:
  // Step 1: 0 - 120 (frames 390 - 510)
  // Step 2: 120 - 240 (frames 510 - 630)
  // Step 3: 240 - 390 (frames 630 - 780)
  const isStep1 = localFrame < 120;
  const isStep2 = localFrame >= 120 && localFrame < 240;
  const isStep3 = localFrame >= 240;

  // Spring physics for card arrivals (mass: 0.5, damping: 12, stiffness: 140)
  const step1Spring = spring({
    frame: localFrame - 5,
    fps: 30,
    config: { mass: 0.5, damping: 12, stiffness: 140 },
  });

  const step2Spring = spring({
    frame: localFrame - 122,
    fps: 30,
    config: { mass: 0.5, damping: 12, stiffness: 140 },
  });

  const step3Spring = spring({
    frame: localFrame - 242,
    fps: 30,
    config: { mass: 0.5, damping: 12, stiffness: 140 },
  });

  // Step 1: Liquid payment transfer line (0 to 45 local)
  const liquidProgress = interpolate(localFrame, [10, 45], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  // Padlock snap shut at localFrame = 45
  const padlockSnapped = localFrame >= 45;
  const padlockScale = padlockSnapped
    ? interpolate(localFrame, [45, 52, 60], [1.3, 0.95, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 1;

  // Step 2 Transitions: Step 1 card pushes left and blurs
  const step1ShiftX = interpolate(localFrame, [120, 140], [0, -420], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const step1Scale = interpolate(localFrame, [120, 140], [1, 0.82], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const step1Blur = interpolate(localFrame, [120, 140], [0, 4], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Step 2 Route drawing progress (frames 130 to 200 local)
  const routeProgress = interpolate(localFrame, [130, 200], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Step 3 Device screen boot progress (frames 250 to 290 local)
  const bootGlow = interpolate(localFrame, [250, 290], [0, 1], {
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
        padding: '40px 100px',
      }}
    >
      {/* Top Scene Stage Header */}
      <div
        style={{
          position: 'absolute',
          top: 60,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <span
          className="micro-tag"
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: '#0066FF',
            background: 'rgba(0, 102, 255, 0.08)',
            padding: '4px 14px',
            borderRadius: 999,
          }}
        >
          THE 3-STEP TRUST LOOP
        </span>
        <h2
          className="font-sans-ui"
          style={{
            fontSize: 36,
            fontWeight: 700,
            color: '#0F172A',
            margin: 0,
          }}
        >
          {isStep1 && (
            <span>
              1. You pay, but money stays safely <span className="font-editorial" style={{ color: '#10B981', fontSize: 44 }}>locked</span> with us
            </span>
          )}
          {isStep2 && (
            <span>
              2. Seller ships your gadget with <span className="font-editorial" style={{ color: '#0066FF', fontSize: 44 }}>express</span> tracking
            </span>
          )}
          {isStep3 && (
            <span>
              3. Doorstep inspection: test the phone <span className="font-editorial" style={{ color: '#10B981', fontSize: 44 }}>before</span> releasing payment
            </span>
          )}
        </h2>
      </div>

      {/* Central Visual Arena (1400 x 520) */}
      <div
        style={{
          position: 'relative',
          width: 1400,
          height: 520,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* ========================================================================= */}
        {/* STEP 1: ESCROW VAULT DUAL-SIDED SPLIT CARD                                 */}
        {/* ========================================================================= */}
        <div
          style={{
            position: 'absolute',
            width: 980,
            height: 380,
            transform: `translateX(${step1ShiftX}px) scale(${isStep1 ? step1Spring : step1Scale})`,
            filter: `blur(${step1Blur}px)`,
            opacity: isStep3 ? 0 : 1,
            transition: 'opacity 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            borderRadius: 28,
            padding: '36px 44px',
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.06)',
            zIndex: isStep1 ? 20 : 10,
          }}
        >
          {/* Left: Buyer Balance */}
          <div
            style={{
              width: 250,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              padding: '20px 16px',
              borderRadius: 20,
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: '#E0F2FE',
                color: '#0284C7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
                fontWeight: 700,
                marginBottom: 12,
              }}
            >
              👤
            </div>
            <div className="font-sans-ui" style={{ fontSize: 16, fontWeight: 700, color: '#0F172A' }}>
              Buyer (You)
            </div>
            <div style={{ fontSize: 13, color: '#64748B', marginTop: 2 }}>UPI Paid: GPay</div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: '#0F172A',
                marginTop: 8,
              }}
            >
              ₹65,000
            </div>
            <span
              style={{
                fontSize: 11,
                background: '#DCFCE7',
                color: '#15803D',
                padding: '4px 10px',
                borderRadius: 999,
                fontWeight: 700,
                marginTop: 8,
              }}
            >
              ✓ Deposited
            </span>
          </div>

          {/* Center: SafeShip Escrow Vault */}
          <div
            style={{
              width: 340,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              padding: '24px 20px',
              borderRadius: 24,
              background: 'linear-gradient(180deg, #FFFFFF 0%, #F1F5F9 100%)',
              border: '1.5px solid #0066FF',
              boxShadow: '0 16px 40px rgba(0, 102, 255, 0.12)',
              position: 'relative',
            }}
          >
            {/* Animated Liquid Transfer Stroke */}
            <div
              style={{
                position: 'absolute',
                top: 48,
                left: -60,
                width: 60,
                height: 4,
                background: `linear-gradient(90deg, #38BDF8 ${liquidProgress}%, #CBD5E1 ${liquidProgress}%)`,
                borderRadius: 2,
              }}
            />

            {/* Heavy Digital Padlock */}
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                background: padlockSnapped ? '#10B981' : '#0066FF',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 32,
                transform: `scale(${padlockScale})`,
                boxShadow: padlockSnapped ? '0 0 30px rgba(16, 185, 129, 0.4)' : '0 0 20px rgba(0, 102, 255, 0.3)',
                marginBottom: 12,
                transition: 'background 0.3s ease',
              }}
            >
              {padlockSnapped ? '🔒' : '🔓'}
            </div>
            <div className="font-sans-ui" style={{ fontSize: 18, fontWeight: 800, color: '#0F172A' }}>
              SafeShip Escrow Vault
            </div>
            <div style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>
              Funds held neutral in RBI-regulated pool
            </div>
            <div
              style={{
                marginTop: 12,
                padding: '6px 14px',
                borderRadius: 999,
                background: '#ECFDF5',
                border: '1px solid #A7F3D0',
                color: '#065F46',
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              Neither party can touch in transit
            </div>
          </div>

          {/* Right: Seller Balance (Ghosted & Locked) */}
          <div
            style={{
              width: 250,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              padding: '20px 16px',
              borderRadius: 20,
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              opacity: 0.85,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: '#F1F5F9',
                color: '#475569',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
                fontWeight: 700,
                marginBottom: 12,
              }}
            >
              🏪
            </div>
            <div className="font-sans-ui" style={{ fontSize: 16, fontWeight: 700, color: '#0F172A' }}>
              Seller Balance
            </div>
            <div style={{ fontSize: 13, color: '#64748B', marginTop: 2 }}>Expected: ₹65,000</div>
            <div
              style={{
                marginTop: 12,
                padding: '6px 12px',
                borderRadius: 999,
                background: '#FEF2F2',
                border: '1px solid #FECACA',
                color: '#991B1B',
                fontSize: 11,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <span>🔒</span>
              <span>Locked — Pending Inspection</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* STEP 2: EXPRESS LOGISTICS & ROUTE MAP CARD                                */}
        {/* ========================================================================= */}
        {isStep2 && (
          <div
            style={{
              position: 'absolute',
              width: 780,
              height: 420,
              transform: `scale(${step2Spring})`,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              borderRadius: 28,
              padding: '36px 44px',
              boxShadow: '0 30px 70px rgba(0, 0, 0, 0.09)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              zIndex: 30,
            }}
          >
            {/* Header: Carrier & Transit Mode */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span className="micro-tag" style={{ fontSize: 11, color: '#0066FF', fontWeight: 700 }}>
                  AIR CARGO LINEHAUL
                </span>
                <div className="font-sans-ui" style={{ fontSize: 24, fontWeight: 800, color: '#0F172A' }}>
                  Blue Dart Express Transit
                </div>
              </div>
              <div
                style={{
                  background: '#EFF6FF',
                  padding: '6px 14px',
                  borderRadius: 999,
                  border: '1px solid #BFDBFE',
                  fontSize: 12,
                  fontWeight: 700,
                  color: '#1D4ED8',
                }}
              >
                AWB: 8921-4902-IN
              </div>
            </div>

            {/* Dynamic Route Track between Bangalore & Delhi */}
            <div style={{ position: 'relative', margin: '24px 0' }}>
              {/* Base Path */}
              <div style={{ width: '100%', height: 6, background: '#E2E8F0', borderRadius: 3, overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${routeProgress}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #0066FF, #38BDF8)',
                  }}
                />
              </div>

              {/* Moving Parcel Van Icon */}
              <div
                style={{
                  position: 'absolute',
                  top: -18,
                  left: `calc(${routeProgress}% - 20px)`,
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: '#0066FF',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                  boxShadow: '0 6px 18px rgba(0, 102, 255, 0.35)',
                }}
              >
                📦
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16, fontSize: 13, fontWeight: 700 }}>
                <span style={{ color: '#0F172A' }}>Bangalore Hub (Picked)</span>
                <span style={{ color: '#0F172A' }}>Delhi NCR (In Transit)</span>
              </div>
            </div>

            {/* Live Checkmark Status Pills */}
            <div style={{ display: 'flex', gap: 12 }}>
              <div
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: 14,
                  background: localFrame >= 140 ? '#ECFDF5' : '#F8FAFC',
                  border: localFrame >= 140 ? '1px solid #A7F3D0' : '1px solid #E2E8F0',
                  fontSize: 12,
                  fontWeight: 600,
                  color: localFrame >= 140 ? '#065F46' : '#64748B',
                }}
              >
                {localFrame >= 140 ? '✓' : '•'} Tamper Seal Applied
              </div>
              <div
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: 14,
                  background: localFrame >= 170 ? '#ECFDF5' : '#F8FAFC',
                  border: localFrame >= 170 ? '1px solid #A7F3D0' : '1px solid #E2E8F0',
                  fontSize: 12,
                  fontWeight: 600,
                  color: localFrame >= 170 ? '#065F46' : '#64748B',
                }}
              >
                {localFrame >= 170 ? '✓' : '•'} 100% Transit Insured
              </div>
              <div
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: 14,
                  background: localFrame >= 200 ? '#ECFDF5' : '#F8FAFC',
                  border: localFrame >= 200 ? '1px solid #A7F3D0' : '1px solid #E2E8F0',
                  fontSize: 12,
                  fontWeight: 600,
                  color: localFrame >= 200 ? '#065F46' : '#64748B',
                }}
              >
                {localFrame >= 200 ? '✓' : '•'} Out for Delivery
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: OPEN BOX VERIFICATION VIEWPORT + RUBRIC CARDS                     */}
        {/* ========================================================================= */}
        {isStep3 && (
          <div
            style={{
              position: 'absolute',
              width: 1080,
              height: 440,
              transform: `scale(${step3Spring})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              zIndex: 40,
            }}
          >
            {/* Center: Device Mockup with Booted Screen */}
            <div
              style={{
                width: 440,
                height: 400,
                background: '#FFFFFF',
                borderRadius: 32,
                border: '1.5px solid rgba(0, 0, 0, 0.08)',
                boxShadow: '0 24px 60px rgba(0, 0, 0, 0.08)',
                padding: '24px 28px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
              }}
            >
              {/* Top Bar inside Inspection */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="micro-tag" style={{ fontSize: 11, color: '#10B981', fontWeight: 800 }}>
                  DOORSTEP UNBOXING ACTIVE
                </span>
                <span style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>10-Min Timer</span>
              </div>

              {/* Simulated iPhone Screen Lighting Up */}
              <div
                style={{
                  height: 250,
                  borderRadius: 20,
                  background: bootGlow > 0.5 ? '#0F172A' : '#020617',
                  border: '2px solid #E2E8F0',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: `0 0 40px rgba(16, 185, 129, ${bootGlow * 0.25})`,
                }}
              >
                <div style={{ fontSize: 32, marginBottom: 8 }}></div>
                <div className="font-sans-ui" style={{ fontSize: 16, fontWeight: 700 }}>
                  iPhone 15 Pro
                </div>
                <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 4 }}>
                  IMEI: 3562 8901 4821 • Genuine Battery 98%
                </div>
                <div
                  style={{
                    position: 'absolute',
                    bottom: 12,
                    background: 'rgba(16, 185, 129, 0.2)',
                    color: '#34D399',
                    border: '1px solid #059669',
                    padding: '3px 10px',
                    borderRadius: 999,
                    fontSize: 10,
                    fontWeight: 700,
                  }}
                >
                  ✓ Apple Hardware Diagnostics Pass
                </div>
              </div>

              {/* Footnote */}
              <div style={{ fontSize: 12, color: '#64748B', textAlign: 'center', fontWeight: 600 }}>
                Test display, touchscreen, audio, and cameras before approving payout
              </div>
            </div>

            {/* Right: 3 Translucent Inspection Rubric Cards */}
            <div style={{ width: 560, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Rubric Card 1 */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid #A7F3D0',
                  borderRadius: 20,
                  padding: '16px 22px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  boxShadow: '0 12px 30px rgba(16, 185, 129, 0.08)',
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: '#10B981',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 18,
                    fontWeight: 700,
                  }}
                >
                  ✓
                </div>
                <div>
                  <div className="font-sans-ui" style={{ fontSize: 16, fontWeight: 700, color: '#0F172A' }}>
                    Display &amp; Touch: 100% Functional
                  </div>
                  <div style={{ fontSize: 12, color: '#64748B' }}>
                    Super Retina XDR OLED verified, zero dead pixels or touch ghosting
                  </div>
                </div>
              </div>

              {/* Rubric Card 2 */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid #A7F3D0',
                  borderRadius: 20,
                  padding: '16px 22px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  boxShadow: '0 12px 30px rgba(16, 185, 129, 0.08)',
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: '#10B981',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 18,
                    fontWeight: 700,
                  }}
                >
                  ✓
                </div>
                <div>
                  <div className="font-sans-ui" style={{ fontSize: 16, fontWeight: 700, color: '#0F172A' }}>
                    IMEI &amp; Serial: Authentic Match
                  </div>
                  <div style={{ fontSize: 12, color: '#64748B' }}>
                    Hardware IMEI matches original deal manifest &amp; GSMA blacklist clean
                  </div>
                </div>
              </div>

              {/* Rubric Card 3 */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid #A7F3D0',
                  borderRadius: 20,
                  padding: '16px 22px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  boxShadow: '0 12px 30px rgba(16, 185, 129, 0.08)',
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: '#10B981',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 18,
                    fontWeight: 700,
                  }}
                >
                  ✓
                </div>
                <div>
                  <div className="font-sans-ui" style={{ fontSize: 16, fontWeight: 700, color: '#0F172A' }}>
                    Physical Condition: As Described
                  </div>
                  <div style={{ fontSize: 12, color: '#64748B' }}>
                    Titanium frame pristine, zero drops, camera lenses unscratched
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* BOTTOM DOCKED TIMELINE TRACK [01 Vault] — [02 Transit] — [03 Inspect]     */}
      {/* ========================================================================= */}
      <div
        style={{
          position: 'absolute',
          bottom: 112,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          padding: '10px 24px',
          borderRadius: 999,
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
        }}
      >
        <span
          className="font-sans-ui"
          style={{
            fontSize: 13,
            fontWeight: 700,
            padding: '6px 16px',
            borderRadius: 999,
            background: isStep1 ? '#0F172A' : '#F1F5F9',
            color: isStep1 ? '#FFFFFF' : '#64748B',
            transition: 'all 0.2s ease',
          }}
        >
          01 Escrow Vault
        </span>
        <span style={{ color: '#CBD5E1', fontSize: 14 }}>—</span>
        <span
          className="font-sans-ui"
          style={{
            fontSize: 13,
            fontWeight: 700,
            padding: '6px 16px',
            borderRadius: 999,
            background: isStep2 ? '#0066FF' : '#F1F5F9',
            color: isStep2 ? '#FFFFFF' : '#64748B',
            transition: 'all 0.2s ease',
          }}
        >
          02 Express Transit
        </span>
        <span style={{ color: '#CBD5E1', fontSize: 14 }}>—</span>
        <span
          className="font-sans-ui"
          style={{
            fontSize: 13,
            fontWeight: 700,
            padding: '6px 16px',
            borderRadius: 999,
            background: isStep3 ? '#10B981' : '#F1F5F9',
            color: isStep3 ? '#FFFFFF' : '#64748B',
            transition: 'all 0.2s ease',
          }}
        >
          03 Doorstep Inspection
        </span>
      </div>
    </div>
  );
};
