import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const Scene4_CustodyPickup: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneFrame = frame - 882;

  // Title entrance
  const titleSpring = spring({
    frame: sceneFrame - 5,
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  // Left Officer card entrance (sceneFrame 20)
  const officerSpring = spring({
    frame: sceneFrame - 20,
    fps,
    config: { damping: 14, stiffness: 95 },
  });

  // Call ring pulse
  const callWave = (Math.sin(sceneFrame * 0.25) + 1) * 0.5;

  // Right Audit & Seal card entrance (sceneFrame 75)
  const auditSpring = spring({
    frame: sceneFrame - 75,
    fps,
    config: { damping: 14, stiffness: 95 },
  });

  // Laser scanner
  const laserY = interpolate((sceneFrame - 80) % 50, [0, 50], [0, 110]);

  // Tamper bag barcode entrance (sceneFrame 150)
  const bagSpring = spring({
    frame: sceneFrame - 150,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  // 4-Digit OTP entrance (sceneFrame 220)
  const otpSpring = spring({
    frame: sceneFrame - 220,
    fps,
    config: { damping: 12, stiffness: 120 },
  });

  // Exit transition (sceneFrame 330 - 354)
  const exitSpring = spring({
    frame: sceneFrame - 330,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  const sceneOpacity = interpolate(exitSpring, [0, 1], [1, 0]);
  const sceneScale = interpolate(exitSpring, [0, 1], [1, 0.95]);

  if (frame < 875 || frame > 1240) return null;

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
          marginBottom: '38px',
        }}
      >
        <div style={{ fontSize: '52px', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-1.5px' }}>
          Bonded Doorstep Handshake
        </div>
        <div style={{ color: '#94A3B8', fontSize: '20px', fontWeight: 500, marginTop: '8px' }}>
          Physical Serial Audit &bull; Barcoded Tamper-Evident Custody
        </div>
      </div>

      {/* Main Split Console */}
      <div
        style={{
          display: 'flex',
          gap: '36px',
          alignItems: 'stretch',
          justifyContent: 'center',
          width: '1060px',
        }}
      >
        {/* Left Card: Officer & Time-Synchronized Call */}
        <div
          style={{
            flex: 1,
            transform: `scale(${officerSpring}) translateX(${interpolate(officerSpring, [0, 1], [-30, 0])}px)`,
            opacity: officerSpring,
            background: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '28px',
            padding: '36px 32px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '18px',
                  background: 'linear-gradient(135deg, #0066FF, #0047BA)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  fontWeight: 900,
                  fontSize: '22px',
                  boxShadow: '0 8px 20px rgba(0, 102, 255, 0.4)',
                }}
              >
                RK
              </div>
              <div>
                <div style={{ color: '#FFFFFF', fontSize: '22px', fontWeight: 800 }}>Rahul K.</div>
                <div style={{ color: '#38BDF8', fontSize: '14px', fontWeight: 600 }}>Bonded SafeShip Officer #4012</div>
              </div>
            </div>

            <div
              style={{
                background: 'rgba(0, 102, 255, 0.1)',
                border: '1px solid rgba(0, 102, 255, 0.3)',
                borderRadius: '18px',
                padding: '18px 20px',
                marginBottom: '20px',
              }}
            >
              <div style={{ color: '#94A3B8', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                Synchronized Window
              </div>
              <div style={{ color: '#FFFFFF', fontSize: '20px', fontWeight: 800, marginTop: '4px' }}>
                10:00 AM – 01:00 PM
              </div>
            </div>

            <div style={{ color: '#94A3B8', fontSize: '15px', lineHeight: 1.5 }}>
              Calls the seller at their scheduled time window. Zero surprise visits.
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: '#34D399',
              fontSize: '15px',
              fontWeight: 700,
              paddingTop: '20px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <span
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: '#10B981',
                boxShadow: `0 0 ${10 + callWave * 10}px #10B981`,
              }}
            />
            <span>Time-Synchronized Phone Call Active</span>
          </div>
        </div>

        {/* Right Card: Serial Audit & Tamper Bag Handshake */}
        <div
          style={{
            flex: 1.15,
            transform: `scale(${auditSpring}) translateX(${interpolate(auditSpring, [0, 1], [30, 0])}px)`,
            opacity: auditSpring,
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(20, 30, 55, 0.9) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(56, 189, 248, 0.4)',
            borderRadius: '28px',
            padding: '36px 36px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5), 0 0 30px rgba(0, 102, 255, 0.15)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          {/* Laser Scanner Viewfinder */}
          <div
            style={{
              position: 'relative',
              height: '110px',
              background: 'rgba(0, 0, 0, 0.5)',
              borderRadius: '16px',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: `${laserY}px`,
                left: 0,
                right: 0,
                height: '2px',
                backgroundColor: '#10B981',
                boxShadow: '0 0 10px #10B981',
              }}
            />
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#34D399', fontSize: '11px', fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                Optical Serial &bull; IMEI Scan
              </div>
              <div style={{ color: '#FFFFFF', fontSize: '18px', fontWeight: 800, marginTop: '4px', letterSpacing: '2px' }}>
                IMEI: 356891048291045
              </div>
              <div style={{ color: '#10B981', fontSize: '12px', fontWeight: 800, marginTop: '2px' }}>
                ✓ MATCHED 100%
              </div>
            </div>
          </div>

          {/* Barcoded Tamper Bag Seal */}
          <div
            style={{
              transform: `scale(${bagSpring})`,
              opacity: bagSpring,
              background: 'rgba(0, 102, 255, 0.15)',
              border: '1px dashed #38BDF8',
              borderRadius: '16px',
              padding: '14px 20px',
              marginBottom: '16px',
              textAlign: 'center',
            }}
          >
            <div style={{ color: '#93C5FD', fontSize: '11px', fontWeight: 700, letterSpacing: '1px' }}>
              SECURITY SEAL BARCODE
            </div>
            <div style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: 900, marginTop: '3px', letterSpacing: '1px' }}>
              SSP-48291-TAMPER-SAFE
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '3px', marginTop: '6px', opacity: 0.85 }}>
              {[3, 1, 4, 2, 1, 3, 2, 4, 1, 3, 1, 4, 2, 1].map((w, i) => (
                <div key={i} style={{ width: `${w * 2}px`, height: '18px', backgroundColor: '#60A5FA' }} />
              ))}
            </div>
          </div>

          {/* 4-Digit OTP Handshake */}
          <div
            style={{
              transform: `scale(${otpSpring})`,
              opacity: otpSpring,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '12px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <span style={{ color: '#E2E8F0', fontSize: '13px', fontWeight: 700 }}>
              Pickup Verification OTP:
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['8', '4', '2', '1'].map((num, i) => (
                <div
                  key={i}
                  style={{
                    width: '32px',
                    height: '38px',
                    borderRadius: '8px',
                    background: '#0B1120',
                    border: '1.5px solid #10B981',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    fontSize: '17px',
                    fontWeight: 900,
                  }}
                >
                  {num}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
