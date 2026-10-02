import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const Scene4_BondedPickup: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneFrame = frame - 875;

  // Title entrance
  const titleSpring = spring({
    frame: sceneFrame - 5,
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  // Left Module: Incoming Phone Call & Officer
  const callSpring = spring({
    frame: sceneFrame - 20,
    fps,
    config: { damping: 14, stiffness: 95 },
  });

  // Right Module: Laser Audit & Reticle
  const auditSpring = spring({
    frame: sceneFrame - 70,
    fps,
    config: { damping: 14, stiffness: 95 },
  });

  // Tamper Bag Barcode reveal
  const bagSpring = spring({
    frame: sceneFrame - 145,
    fps,
    config: { damping: 13, stiffness: 105 },
  });

  // 4-Digit Tumbler OTP entrance
  const otpSpring = spring({
    frame: sceneFrame - 215,
    fps,
    config: { damping: 12, stiffness: 120 },
  });

  // Laser scanner vertical oscillation
  const laserY = interpolate((sceneFrame - 75) % 45, [0, 45], [0, 95]);

  // Acoustic audio bars for incoming call
  const waveBars = [0.4, 0.9, 0.6, 1.0, 0.7, 0.95, 0.5, 0.8, 0.4];

  // Exit transition (sceneFrame 335 - 355)
  const exitSpring = spring({
    frame: sceneFrame - 335,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  const sceneOpacity = interpolate(exitSpring, [0, 1], [1, 0]);
  const sceneScale = interpolate(exitSpring, [0, 1], [1, 0.95]);

  if (frame < 870 || frame > 1240) return null;

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
          marginBottom: '36px',
        }}
      >
        <div style={{ fontSize: '54px', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-2px' }}>
          Bonded Doorstep Custody
        </div>
        <div style={{ color: '#94A3B8', fontSize: '20px', fontWeight: 500, marginTop: '6px', letterSpacing: '-0.3px' }}>
          Scheduled Verification &bull; Optical Serial Audit &bull; Barcoded Tamper Custody
        </div>
      </div>

      {/* Main Dual Command Interface */}
      <div
        style={{
          display: 'flex',
          gap: '32px',
          alignItems: 'stretch',
          justifyContent: 'center',
          maxWidth: '1240px',
          width: '92%',
        }}
      >
        {/* Module 1: The Scheduled Call HUD (Left) */}
        <div
          style={{
            flex: 0.95,
            transform: `scale(${callSpring}) translateX(${interpolate(callSpring, [0, 1], [-30, 0])}px)`,
            opacity: callSpring,
            background: 'linear-gradient(160deg, rgba(15, 23, 42, 0.92) 0%, rgba(8, 14, 28, 0.96) 100%)',
            backdropFilter: 'blur(28px)',
            border: '1.5px solid rgba(56, 189, 248, 0.35)',
            borderRadius: '28px',
            padding: '32px 28px',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(56, 189, 248, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <span style={{ color: '#38BDF8', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
                Pickup Day &bull; Step 01
              </span>
              <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34D399', fontSize: '11px', fontWeight: 800, padding: '4px 10px', borderRadius: '8px' }}>
                ● ON TIME (10:15 AM)
              </span>
            </div>

            {/* Officer Profile Card */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '20px',
                  background: 'linear-gradient(135deg, #0066FF 0%, #0284C7 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  fontSize: '24px',
                  fontWeight: 900,
                  boxShadow: '0 10px 25px rgba(0, 102, 255, 0.4)',
                }}
              >
                RK
              </div>
              <div>
                <div style={{ color: '#FFFFFF', fontSize: '22px', fontWeight: 800 }}>
                  Rahul K.
                </div>
                <div style={{ color: '#38BDF8', fontSize: '13px', fontWeight: 600, marginTop: '2px' }}>
                  Bonded SafeShip Officer &bull; ID #4012
                </div>
              </div>
            </div>

            {/* Live Audio Acoustic Waveform Visualizer */}
            <div
              style={{
                background: 'rgba(2, 6, 23, 0.65)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '16px 20px',
                marginBottom: '20px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ color: '#94A3B8', fontSize: '12px', fontWeight: 600 }}>
                  Encrypted Call Connected
                </span>
                <span style={{ color: '#10B981', fontSize: '12px', fontWeight: 700 }}>
                  00:42
                </span>
              </div>
              {/* Animated wave bars */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', height: '36px' }}>
                {waveBars.map((multiplier, idx) => {
                  const barH = 8 + Math.abs(Math.sin((sceneFrame * 0.2) + idx * 0.6)) * 26 * multiplier;
                  return (
                    <div
                      key={idx}
                      style={{
                        width: '5px',
                        height: `${barH}px`,
                        backgroundColor: '#38BDF8',
                        borderRadius: '999px',
                        boxShadow: '0 0 8px rgba(56, 189, 248, 0.6)',
                        transition: 'height 0.08s ease',
                      }}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          <div style={{ color: '#94A3B8', fontSize: '14px', lineHeight: 1.5 }}>
            Officer arrives directly at seller's door at the booked slot, equipped with tamper-proof sealing kit.
          </div>
        </div>

        {/* Module 2: Optical Laser Audit & Tamper Seal (Right) */}
        <div
          style={{
            flex: 1.35,
            transform: `scale(${auditSpring}) translateX(${interpolate(auditSpring, [0, 1], [30, 0])}px)`,
            opacity: auditSpring,
            background: 'linear-gradient(160deg, rgba(15, 23, 42, 0.92) 0%, rgba(8, 14, 28, 0.96) 100%)',
            backdropFilter: 'blur(28px)',
            border: '1.5px solid rgba(0, 102, 255, 0.45)',
            borderRadius: '28px',
            padding: '32px 30px',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.7), 0 0 35px rgba(0, 102, 255, 0.15)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          {/* Step 2: Optical Reticle Serial Audit */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ color: '#38BDF8', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
                On-Site Serial Audit &bull; Step 02
              </span>
              <span style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', fontSize: '11px', fontWeight: 800, padding: '4px 10px', borderRadius: '8px' }}>
                LASER RETICLE ACTIVE
              </span>
            </div>

            {/* Reticle Scanner HUD Box */}
            <div
              style={{
                position: 'relative',
                background: 'rgba(2, 6, 23, 0.75)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                borderRadius: '16px',
                padding: '18px 22px',
                overflow: 'hidden',
                marginBottom: '18px',
              }}
            >
              {/* Sweeping Laser Line */}
              <div
                style={{
                  position: 'absolute',
                  top: `${laserY}px`,
                  left: 0,
                  right: 0,
                  height: '2px',
                  backgroundColor: '#38BDF8',
                  boxShadow: '0 0 15px #38BDF8, 0 0 30px #0066FF',
                }}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ color: '#94A3B8', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                    *#06# Physical Serial Audit
                  </div>
                  <div style={{ color: '#FFFFFF', fontSize: '20px', fontWeight: 900, fontFamily: 'monospace', marginTop: '4px' }}>
                    IMEI: 356891-04-829104-5
                  </div>
                </div>
                <div
                  style={{
                    background: 'rgba(16, 185, 129, 0.2)',
                    border: '1px solid #10B981',
                    borderRadius: '10px',
                    padding: '8px 14px',
                    color: '#34D399',
                    fontSize: '13px',
                    fontWeight: 800,
                  }}
                >
                  ✓ MATCHED 100%
                </div>
              </div>
            </div>

            {/* Step 3: Tamper Bag Barcode */}
            <div
              style={{
                transform: `scale(${bagSpring})`,
                opacity: bagSpring,
                background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.8) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '16px',
                padding: '16px 20px',
                marginBottom: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ color: '#38BDF8', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase' }}>
                  Barcoded Security Pouch
                </div>
                <div style={{ color: '#FFFFFF', fontSize: '17px', fontWeight: 800, marginTop: '2px', fontFamily: 'monospace' }}>
                  SSP-48291-TAMPER-SAFE
                </div>
              </div>
              {/* Stylized Barcode SVG */}
              <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
                {[3, 1, 4, 2, 5, 2, 1, 4, 2, 5, 3, 2, 4, 1, 3].map((w, idx) => (
                  <div key={idx} style={{ width: `${w}px`, height: '28px', backgroundColor: '#38BDF8' }} />
                ))}
              </div>
            </div>
          </div>

          {/* Step 4: 4-Digit Tumbler Handshake */}
          <div
            style={{
              transform: `scale(${otpSpring})`,
              opacity: otpSpring,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(0, 102, 255, 0.18)',
              border: '1px solid rgba(0, 102, 255, 0.45)',
              borderRadius: '16px',
              padding: '14px 22px',
            }}
          >
            <div>
              <div style={{ color: '#38BDF8', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase' }}>
                Pickup Verification Handshake
              </div>
              <div style={{ color: '#FFFFFF', fontSize: '15px', fontWeight: 700, marginTop: '2px' }}>
                4-Digit Seller Code Verified
              </div>
            </div>

            {/* 4 Tumblers */}
            <div style={{ display: 'flex', gap: '10px' }}>
              {['8', '4', '2', '1'].map((digit, idx) => (
                <div
                  key={idx}
                  style={{
                    width: '38px',
                    height: '44px',
                    background: '#0B1120',
                    border: '1.5px solid #38BDF8',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#38BDF8',
                    fontSize: '22px',
                    fontWeight: 900,
                    boxShadow: '0 0 12px rgba(56, 189, 248, 0.35)',
                  }}
                >
                  {digit}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
