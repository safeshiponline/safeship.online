import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { SafeShipOfficialLogo } from './SafeShipOfficialLogo';

export const Scene6_OutroCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneFrame = frame - 1566;

  // Logo entrance
  const logoSpring = spring({
    frame: sceneFrame - 5,
    fps,
    config: { damping: 13, stiffness: 95 },
  });

  // Headline entrance
  const textSpring = spring({
    frame: sceneFrame - 25,
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  // CTA button spring
  const ctaSpring = spring({
    frame: sceneFrame - 55,
    fps,
    config: { damping: 12, stiffness: 110 },
  });

  // Badges entrance
  const badgesSpring = spring({
    frame: sceneFrame - 90,
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  // Gentle pulse
  const pulse = Math.sin(sceneFrame * 0.08) * 0.04 + 1;

  if (frame < 1560) return null;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Background Radial Light */}
      <div
        style={{
          position: 'absolute',
          width: '900px',
          height: '900px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 102, 255, 0.28) 0%, transparent 65%)',
          filter: 'blur(100px)',
          pointerEvents: 'none',
        }}
      />

      {/* Official 3D SafeShip Logo */}
      <div
        style={{
          transform: `scale(${logoSpring}) translateY(${interpolate(logoSpring, [0, 1], [30, 0])}px)`,
          opacity: logoSpring,
          marginBottom: '28px',
        }}
      >
        <SafeShipOfficialLogo size={130} glow={true} />
      </div>

      {/* Grand Headline */}
      <div
        style={{
          transform: `scale(${textSpring}) translateY(${interpolate(textSpring, [0, 1], [25, 0])}px)`,
          opacity: textSpring,
          textAlign: 'center',
          marginBottom: '36px',
        }}
      >
        <div
          style={{
            fontSize: '60px',
            fontWeight: 900,
            color: '#FFFFFF',
            letterSpacing: '-2px',
            textShadow: '0 0 40px rgba(0, 102, 255, 0.6)',
          }}
        >
          Never Risk Your Money or Gadgets Again.
        </div>
        <div
          style={{
            color: '#38BDF8',
            fontSize: '24px',
            fontWeight: 700,
            marginTop: '8px',
            letterSpacing: '-0.3px',
          }}
        >
          Ship Verified with SafeShip
        </div>
      </div>

      {/* Primary CTA Button */}
      <div
        style={{
          transform: `scale(${ctaSpring * pulse}) translateY(${interpolate(ctaSpring, [0, 1], [25, 0])}px)`,
          opacity: ctaSpring,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '14px',
          marginBottom: '40px',
        }}
      >
        <div
          style={{
            background: 'linear-gradient(135deg, #0066FF 0%, #0047BA 100%)',
            border: '2px solid rgba(255, 255, 255, 0.35)',
            borderRadius: '24px',
            padding: '22px 64px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            boxShadow: '0 0 50px rgba(0, 102, 255, 0.6), 0 20px 40px rgba(0, 0, 0, 0.6)',
          }}
        >
          <span style={{ fontSize: '30px' }}>🚀</span>
          <span style={{ color: '#FFFFFF', fontSize: '36px', fontWeight: 900, letterSpacing: '-0.5px' }}>
            SafeShip.online
          </span>
        </div>

        {/* Promo Offer */}
        <div
          style={{
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            borderRadius: '999px',
            padding: '8px 24px',
            color: '#34D399',
            fontSize: '15px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>🏷️</span> Book Your First Consignment &bull; Get ₹99 Off
        </div>
      </div>

      {/* Bottom Trust Strip */}
      <div
        style={{
          opacity: badgesSpring,
          transform: `translateY(${interpolate(badgesSpring, [0, 1], [20, 0])}px)`,
          display: 'flex',
          gap: '24px',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '10px 20px',
            color: '#F1F5F9',
            fontSize: '15px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>🏦</span> RBI Nodal Escrow
        </div>

        <div
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '10px 20px',
            color: '#F1F5F9',
            fontSize: '15px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>🛡️</span> ₹10,00,000 Transit Insurance
        </div>

        <div
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '10px 20px',
            color: '#F1F5F9',
            fontSize: '15px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>🔍</span> 10-Min Doorstep Inspection
        </div>
      </div>
    </div>
  );
};
