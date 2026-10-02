import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const Scene1_TheStandOff: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance springs for the 3 devices
  const phoneSpring = spring({ frame: frame - 6, fps, config: { damping: 14, stiffness: 90 } });
  const laptopSpring = spring({ frame: frame - 18, fps, config: { damping: 14, stiffness: 90 } });
  const cameraSpring = spring({ frame: frame - 30, fps, config: { damping: 14, stiffness: 90 } });

  // Staggered chat bubbles (frame 65 & 90)
  const chatLeftSpring = spring({ frame: frame - 70, fps, config: { damping: 13, stiffness: 100 } });
  const chatRightSpring = spring({ frame: frame - 95, fps, config: { damping: 13, stiffness: 100 } });

  // Climax Question explosion (frame 135)
  const questionSpring = spring({ frame: frame - 138, fps, config: { damping: 11, stiffness: 130 } });

  // Stage pullback on question explosion
  const stagePushback = interpolate(frame, [136, 160], [1, 0.68], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const stageOpacity = interpolate(frame, [136, 155], [1, 0.12], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Exit transition (frame 245 - 264)
  const exitSpring = spring({ frame: frame - 245, fps, config: { damping: 15, stiffness: 100 } });
  const sceneOpacity = interpolate(exitSpring, [0, 1], [1, 0]);
  const sceneScale = interpolate(exitSpring, [0, 1], [1, 0.94]);

  const hoverY1 = Math.sin(frame * 0.05) * 8;
  const hoverY2 = Math.cos(frame * 0.04) * 8;
  const hoverY3 = Math.sin(frame * 0.045 + 1) * 8;

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
      {/* 3D Hardware Showcase Stage */}
      <div
        style={{
          position: 'relative',
          width: '1280px',
          height: '620px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scale(${stagePushback})`,
          opacity: stageOpacity,
        }}
      >
        {/* Device 1: Titanium Phone (Left) */}
        <div
          style={{
            position: 'absolute',
            left: '120px',
            transform: `scale(${phoneSpring}) translateY(${hoverY1}px) rotate(-6deg)`,
            opacity: phoneSpring,
            width: '240px',
            height: '460px',
            borderRadius: '44px',
            background: 'linear-gradient(150deg, #1E293B 0%, #0F172A 100%)',
            border: '3px solid rgba(255, 255, 255, 0.18)',
            boxShadow: '0 35px 70px rgba(0, 0, 0, 0.8), 0 0 40px rgba(56, 189, 248, 0.15)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '16px',
            zIndex: 1,
          }}
        >
          {/* Dynamic Island */}
          <div style={{ width: '74px', height: '18px', backgroundColor: '#000000', borderRadius: '999px', marginBottom: '20px' }} />
          {/* Screen Content */}
          <div
            style={{
              width: '100%',
              flex: 1,
              borderRadius: '28px',
              background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.95) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '20px 16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <span style={{ fontSize: '10px', fontWeight: 800, color: '#38BDF8', letterSpacing: '1px', textTransform: 'uppercase' }}>
                Flagship Phone
              </span>
              <div style={{ color: '#FFFFFF', fontSize: '18px', fontWeight: 800, marginTop: '4px' }}>
                iPhone 16 Pro
              </div>
              <div style={{ color: '#F1F5F9', fontSize: '24px', fontWeight: 900, marginTop: '6px' }}>
                ₹1,19,900
              </div>
            </div>
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.18)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                borderRadius: '12px',
                padding: '10px 12px',
              }}
            >
              <div style={{ color: '#FCA5A5', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase' }}>
                Online P2P Deal
              </div>
              <div style={{ color: '#E2E8F0', fontSize: '12px', fontWeight: 600, marginTop: '2px' }}>
                High Scam Risk
              </div>
            </div>
          </div>
        </div>

        {/* Device 2: MacBook Pro (Center, Majestic) */}
        <div
          style={{
            position: 'absolute',
            transform: `scale(${laptopSpring}) translateY(${hoverY2}px)`,
            opacity: laptopSpring,
            width: '460px',
            height: '310px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            zIndex: 2,
          }}
        >
          {/* Laptop Screen */}
          <div
            style={{
              width: '420px',
              height: '270px',
              background: 'linear-gradient(145deg, #1E293B 0%, #090D16 100%)',
              borderRadius: '20px 20px 4px 4px',
              border: '3px solid rgba(255, 255, 255, 0.22)',
              boxShadow: '0 40px 90px rgba(0, 0, 0, 0.9), 0 0 60px rgba(0, 102, 255, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              padding: '16px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Notch */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '60px',
                height: '10px',
                backgroundColor: '#000000',
                borderRadius: '0 0 8px 8px',
              }}
            />
            <div style={{ marginTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#38BDF8', letterSpacing: '1px' }}>
                CREATOR WORKSTATION
              </span>
              <span style={{ fontSize: '11px', color: '#94A3B8' }}>M3 Max &bull; 64GB</span>
            </div>
            <div style={{ color: '#FFFFFF', fontSize: '26px', fontWeight: 900, marginTop: '12px' }}>
              MacBook Pro 16"
            </div>
            <div style={{ color: '#38BDF8', fontSize: '32px', fontWeight: 900, marginTop: '4px' }}>
              ₹2,49,000
            </div>
            <div
              style={{
                marginTop: 'auto',
                padding: '12px 14px',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <span style={{ fontSize: '16px' }}>⚠️</span>
              <span style={{ color: '#FCA5A5', fontSize: '13px', fontWeight: 600 }}>
                Unverified Courier Delivery Risk
              </span>
            </div>
          </div>
          {/* Laptop Base */}
          <div
            style={{
              width: '460px',
              height: '14px',
              background: 'linear-gradient(180deg, #334155 0%, #1E293B 100%)',
              borderRadius: '2px 2px 10px 10px',
              borderTop: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 10px 25px rgba(0,0,0,0.8)',
            }}
          />
        </div>

        {/* Device 3: Mirrorless Camera (Right) */}
        <div
          style={{
            position: 'absolute',
            right: '120px',
            transform: `scale(${cameraSpring}) translateY(${hoverY3}px) rotate(6deg)`,
            opacity: cameraSpring,
            width: '270px',
            height: '220px',
            borderRadius: '28px',
            background: 'linear-gradient(150deg, #1E293B 0%, #0B1120 100%)',
            border: '3px solid rgba(255, 255, 255, 0.18)',
            boxShadow: '0 35px 70px rgba(0, 0, 0, 0.8), 0 0 40px rgba(56, 189, 248, 0.15)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            zIndex: 1,
          }}
        >
          {/* Camera Lens Circle with Blue Coated Reflection */}
          <div
            style={{
              width: '110px',
              height: '110px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, #0284C7 0%, #0F172A 70%, #020617 100%)',
              border: '6px solid #334155',
              boxShadow: 'inset 0 0 25px rgba(56, 189, 248, 0.6), 0 10px 20px rgba(0,0,0,0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#020617', border: '2px solid rgba(255,255,255,0.2)' }} />
          </div>
          <div style={{ color: '#FFFFFF', fontSize: '18px', fontWeight: 800, marginTop: '12px' }}>
            Sony Alpha A7 IV
          </div>
          <div style={{ color: '#38BDF8', fontSize: '20px', fontWeight: 900, marginTop: '2px' }}>
            ₹1,85,000
          </div>
        </div>

        {/* Left Dilemma Chat Bubble */}
        <div
          style={{
            position: 'absolute',
            left: '40px',
            top: '70px',
            transform: `scale(${chatLeftSpring}) translateX(${interpolate(chatLeftSpring, [0, 1], [-50, 0])}px)`,
            opacity: chatLeftSpring,
            background: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(28px)',
            border: '1.5px solid rgba(239, 68, 68, 0.5)',
            borderRadius: '24px 24px 24px 6px',
            padding: '20px 26px',
            maxWidth: '340px',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 35px rgba(239, 68, 68, 0.25)',
            zIndex: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#EF4444', boxShadow: '0 0 10px #EF4444' }} />
            <span style={{ color: '#F87171', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
              Buyer Risk Dilemma
            </span>
          </div>
          <div style={{ color: '#FFFFFF', fontSize: '18px', fontWeight: 600, lineHeight: 1.4 }}>
            "Pay ₹20,000 advance first or I won't ship the parcel."
          </div>
        </div>

        {/* Right Dilemma Chat Bubble */}
        <div
          style={{
            position: 'absolute',
            right: '40px',
            bottom: '70px',
            transform: `scale(${chatRightSpring}) translateX(${interpolate(chatRightSpring, [0, 1], [50, 0])}px)`,
            opacity: chatRightSpring,
            background: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(28px)',
            border: '1.5px solid rgba(239, 68, 68, 0.5)',
            borderRadius: '24px 24px 6px 24px',
            padding: '20px 26px',
            maxWidth: '340px',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 35px rgba(239, 68, 68, 0.25)',
            zIndex: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#EF4444', boxShadow: '0 0 10px #EF4444' }} />
            <span style={{ color: '#F87171', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
              Seller Risk Dilemma
            </span>
          </div>
          <div style={{ color: '#FFFFFF', fontSize: '18px', fontWeight: 600, lineHeight: 1.4 }}>
            "Ship first bro, I promise I'll UPI after delivery."
          </div>
        </div>
      </div>

      {/* Explosive Kinetic Question Climax */}
      {frame > 132 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `scale(${questionSpring}) translateY(${interpolate(questionSpring, [0, 1], [30, 0])}px)`,
            opacity: questionSpring,
            textAlign: 'center',
            pointerEvents: 'none',
            zIndex: 20,
          }}
        >
          {/* Crimson Horizon Ambient Backlight */}
          <div
            style={{
              position: 'absolute',
              width: '1000px',
              height: '400px',
              background: 'radial-gradient(ellipse, rgba(239, 68, 68, 0.28) 0%, transparent 70%)',
              filter: 'blur(90px)',
            }}
          />

          <div
            style={{
              fontSize: '92px',
              fontWeight: 900,
              color: '#FFFFFF',
              letterSpacing: '-3.5px',
              lineHeight: 1.05,
              textTransform: 'uppercase',
              textShadow: '0 0 70px rgba(239, 68, 68, 0.9), 0 10px 40px rgba(0,0,0,0.95)',
              position: 'relative',
            }}
          >
            Who Trusts <br />
            <span style={{ color: '#F87171' }}>Who First?</span>
          </div>

          <div
            style={{
              color: '#CBD5E1',
              fontSize: '26px',
              fontWeight: 600,
              marginTop: '24px',
              letterSpacing: '-0.3px',
              position: 'relative',
              display: 'flex',
              gap: '16px',
              alignItems: 'center',
            }}
          >
            <span style={{ color: '#F87171' }}>✕ Zero Escrow</span>
            <span>&bull;</span>
            <span style={{ color: '#F87171' }}>✕ Zero Custody Audit</span>
            <span>&bull;</span>
            <span style={{ color: '#F87171' }}>✕ 100% Advance Risk</span>
          </div>
        </div>
      )}
    </div>
  );
};
