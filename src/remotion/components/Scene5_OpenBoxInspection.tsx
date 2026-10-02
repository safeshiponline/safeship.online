import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const Scene5_OpenBoxInspection: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneFrame = frame - 1230;

  // Title entrance
  const titleSpring = spring({
    frame: sceneFrame - 5,
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  // Inspection Stage entrance
  const stageSpring = spring({
    frame: sceneFrame - 15,
    fps,
    config: { damping: 14, stiffness: 95 },
  });

  // 3 Diagnostic ticks
  const tick1 = spring({ frame: sceneFrame - 50, fps, config: { damping: 12, stiffness: 130 } });
  const tick2 = spring({ frame: sceneFrame - 75, fps, config: { damping: 12, stiffness: 130 } });
  const tick3 = spring({ frame: sceneFrame - 100, fps, config: { damping: 12, stiffness: 130 } });

  // Payout explosion (voiceover: "Once approved via OTP, seller receives payout immediately!")
  const payoutSpring = spring({
    frame: sceneFrame - 155,
    fps,
    config: { damping: 12, stiffness: 120 },
  });

  // Refund reassurance badge
  const refundSpring = spring({
    frame: sceneFrame - 215,
    fps,
    config: { damping: 12, stiffness: 110 },
  });

  // Countdown timer: 10:00 -> 09:24
  const secondsLeft = Math.max(0, 600 - Math.floor(sceneFrame * 0.8));
  const mins = Math.floor(secondsLeft / 60);
  const secs = (secondsLeft % 60).toString().padStart(2, '0');

  // Box unboxing / lid lift
  const lidY = interpolate(sceneFrame, [20, 65], [0, -45], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Exit transition (sceneFrame 320 - 340)
  const exitSpring = spring({
    frame: sceneFrame - 320,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  const sceneOpacity = interpolate(exitSpring, [0, 1], [1, 0]);
  const sceneScale = interpolate(exitSpring, [0, 1], [1, 0.95]);

  if (frame < 1225 || frame > 1565) return null;

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
          marginBottom: '34px',
        }}
      >
        <div style={{ fontSize: '54px', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-2px' }}>
          10-Minute Doorstep Open-Box Window
        </div>
        <div style={{ color: '#94A3B8', fontSize: '20px', fontWeight: 500, marginTop: '6px' }}>
          Power On &bull; Test Features &bull; Instant Bank Payout Upon OTP Approval
        </div>
      </div>

      {/* Main Split Stage */}
      <div
        style={{
          display: 'flex',
          gap: '34px',
          alignItems: 'stretch',
          justifyContent: 'center',
          maxWidth: '1240px',
          width: '92%',
        }}
      >
        {/* Left Side: Doorstep 10-Min Testing Lab */}
        <div
          style={{
            flex: 1.15,
            transform: `scale(${stageSpring}) translateX(${interpolate(stageSpring, [0, 1], [-30, 0])}px)`,
            opacity: stageSpring,
            background: 'linear-gradient(160deg, rgba(15, 23, 42, 0.94) 0%, rgba(8, 14, 28, 0.98) 100%)',
            backdropFilter: 'blur(28px)',
            border: '1.5px solid rgba(56, 189, 248, 0.4)',
            borderRadius: '28px',
            padding: '34px 30px',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.7), 0 0 35px rgba(56, 189, 248, 0.12)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          {/* Circular Countdown HUD Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '22px',
              padding: '18px 24px',
              background: 'rgba(2, 6, 23, 0.75)',
              borderRadius: '20px',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              marginBottom: '22px',
            }}
          >
            <div
              style={{
                width: '68px',
                height: '68px',
                borderRadius: '50%',
                border: '3px solid #38BDF8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 25px rgba(56, 189, 248, 0.5)',
                background: 'rgba(56, 189, 248, 0.1)',
              }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="#38BDF8" strokeWidth="2" />
                <path d="M12 7V12L15 15" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <div style={{ color: '#FFFFFF', fontSize: '42px', fontWeight: 900, letterSpacing: '1px', fontFamily: 'monospace' }}>
                {mins}:{secs}
              </div>
              <div style={{ color: '#38BDF8', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                Active Inspection Window
              </div>
            </div>
          </div>

          {/* 3 Diagnostic Telemetry Checks */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '16px' }}>
            {/* Check 1 */}
            <div
              style={{
                transform: `scale(${tick1}) translateX(${interpolate(tick1, [0, 1], [-20, 0])}px)`,
                opacity: tick1,
                background: 'rgba(2, 6, 23, 0.6)',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                borderRadius: '14px',
                padding: '12px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: '#10B981', fontSize: '18px', fontWeight: 900 }}>✓</span>
                <span style={{ color: '#F1F5F9', fontSize: '15px', fontWeight: 600 }}>
                  Power On &amp; Touch Display Tested
                </span>
              </div>
              <span style={{ color: '#34D399', fontSize: '11px', fontWeight: 800, background: 'rgba(16, 185, 129, 0.15)', padding: '3px 8px', borderRadius: '6px' }}>
                PASSED
              </span>
            </div>

            {/* Check 2 */}
            <div
              style={{
                transform: `scale(${tick2}) translateX(${interpolate(tick2, [0, 1], [-20, 0])}px)`,
                opacity: tick2,
                background: 'rgba(2, 6, 23, 0.6)',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                borderRadius: '14px',
                padding: '12px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: '#10B981', fontSize: '18px', fontWeight: 900 }}>✓</span>
                <span style={{ color: '#F1F5F9', fontSize: '15px', fontWeight: 600 }}>
                  Camera, Microphone &amp; Battery Verified
                </span>
              </div>
              <span style={{ color: '#34D399', fontSize: '11px', fontWeight: 800, background: 'rgba(16, 185, 129, 0.15)', padding: '3px 8px', borderRadius: '6px' }}>
                PASSED
              </span>
            </div>

            {/* Check 3 */}
            <div
              style={{
                transform: `scale(${tick3}) translateX(${interpolate(tick3, [0, 1], [-20, 0])}px)`,
                opacity: tick3,
                background: 'rgba(2, 6, 23, 0.6)',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                borderRadius: '14px',
                padding: '12px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: '#10B981', fontSize: '18px', fontWeight: 900 }}>✓</span>
                <span style={{ color: '#F1F5F9', fontSize: '15px', fontWeight: 600 }}>
                  Physical IMEI Matches Security Seal
                </span>
              </div>
              <span style={{ color: '#34D399', fontSize: '11px', fontWeight: 800, background: 'rgba(16, 185, 129, 0.15)', padding: '3px 8px', borderRadius: '6px' }}>
                MATCHED
              </span>
            </div>
          </div>

          <div style={{ color: '#94A3B8', fontSize: '14px', lineHeight: 1.5 }}>
            Buyer tests device thoroughly at their doorstep before sharing the delivery confirmation OTP.
          </div>
        </div>

        {/* Right Side: Dual Settlement Outcomes */}
        <div
          style={{
            flex: 1.1,
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          {/* Outcome A: OTP Approved -> Instant Payout to Seller */}
          <div
            style={{
              flex: 1,
              transform: `scale(${payoutSpring}) translateX(${interpolate(payoutSpring, [0, 1], [30, 0])}px)`,
              opacity: payoutSpring,
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.18) 0%, rgba(15, 23, 42, 0.95) 100%)',
              border: '2px solid #10B981',
              borderRadius: '26px',
              padding: '28px 28px',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.7), 0 0 40px rgba(16, 185, 129, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ background: '#10B981', color: '#022C22', fontSize: '11px', fontWeight: 900, padding: '4px 10px', borderRadius: '8px' }}>
                  APPROVED VIA OTP
                </span>
                <span style={{ color: '#34D399', fontSize: '14px', fontWeight: 800 }}>⚡ INSTANT BANK PAYOUT</span>
              </div>
              <div style={{ color: '#FFFFFF', fontSize: '26px', fontWeight: 900, letterSpacing: '-0.5px' }}>
                Seller Receives Payout Immediately
              </div>
              <div style={{ color: '#34D399', fontSize: '38px', fontWeight: 900, marginTop: '8px' }}>
                ₹45,000 Transferred
              </div>
              <div style={{ color: '#94A3B8', fontSize: '14px', lineHeight: 1.5, marginTop: '6px' }}>
                Escrow funds unlock in real time. Direct UPI or IMPS wire credit into seller's bank account.
              </div>
            </div>
          </div>

          {/* Outcome B: Mismatch -> 100% Refund */}
          <div
            style={{
              transform: `scale(${refundSpring}) translateX(${interpolate(refundSpring, [0, 1], [30, 0])}px)`,
              opacity: refundSpring,
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.14) 0%, rgba(15, 23, 42, 0.95) 100%)',
              border: '1.5px solid rgba(239, 68, 68, 0.6)',
              borderRadius: '24px',
              padding: '22px 28px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6), 0 0 30px rgba(239, 68, 68, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ color: '#EF4444', fontSize: '16px' }}>🛡️</span>
                <span style={{ color: '#F87171', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Mismatch Protection
                </span>
              </div>
              <div style={{ color: '#FFFFFF', fontSize: '18px', fontWeight: 800 }}>
                Mismatched? Pay ₹0 &amp; 100% Refunded
              </div>
              <div style={{ color: '#94A3B8', fontSize: '13px', marginTop: '2px' }}>
                Courier brings it back. Your escrow funds are returned instantly.
              </div>
            </div>

            <div
              style={{
                background: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid #EF4444',
                borderRadius: '12px',
                padding: '8px 16px',
                color: '#FCA5A5',
                fontSize: '14px',
                fontWeight: 800,
                whiteSpace: 'nowrap',
              }}
            >
              ZERO RISK
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
