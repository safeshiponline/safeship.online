import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { SafeShip3DLogoAnimated } from './SafeShip3DLogoAnimated';

export const Scene6_GrandOutro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneFrame = frame - 1560;

  // Master camera push
  const camZoom = 1 + sceneFrame * 0.00025;

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
    frame: sceneFrame - 50,
    fps,
    config: { damping: 12, stiffness: 110 },
  });

  // Badges entrance
  const badgesSpring = spring({
    frame: sceneFrame - 85,
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  // Continuous shimmer light sweep across button
  const shimmerPos = (sceneFrame * 6) % 600 - 150;

  // Gentle breathing pulse
  const pulse = Math.sin(sceneFrame * 0.08) * 0.03 + 1;

  if (frame < 1555) return null;

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
        transform: `scale(${camZoom})`,
      }}
    >
      {/* Background Volumetric Blue Flare */}
      <div
        style={{
          position: 'absolute',
          width: '1000px',
          height: '1000px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 102, 255, 0.35) 0%, transparent 65%)',
          filter: 'blur(100px)',
          pointerEvents: 'none',
        }}
      />

      {/* Official 3D SafeShip Logo with Radial Core */}
      <div
        style={{
          transform: `scale(${logoSpring}) translateY(${interpolate(logoSpring, [0, 1], [30, 0])}px)`,
          opacity: logoSpring,
          marginBottom: '30px',
        }}
      >
        <SafeShip3DLogoAnimated size={150} assembleDelay={1565} glow={true} />
      </div>

      {/* Grand Kinetic Headline */}
      <div
        style={{
          transform: `scale(${textSpring}) translateY(${interpolate(textSpring, [0, 1], [25, 0])}px)`,
          opacity: textSpring,
          textAlign: 'center',
          marginBottom: '38px',
        }}
      >
        <div
          style={{
            fontSize: '66px',
            fontWeight: 900,
            color: '#FFFFFF',
            letterSpacing: '-2.5px',
            textShadow: '0 0 60px rgba(0, 102, 255, 0.7), 0 10px 40px rgba(0,0,0,0.9)',
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
          Ship Verified with SafeShip &bull; Book Your Consignment Today
        </div>
      </div>

      {/* Shimmering Hero Action Button */}
      <div
        style={{
          transform: `scale(${ctaSpring * pulse}) translateY(${interpolate(ctaSpring, [0, 1], [25, 0])}px)`,
          opacity: ctaSpring,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '42px',
        }}
      >
        <div
          style={{
            position: 'relative',
            background: 'linear-gradient(135deg, #0066FF 0%, #0047BA 100%)',
            border: '2px solid rgba(255, 255, 255, 0.4)',
            borderRadius: '26px',
            padding: '24px 68px',
            display: 'flex',
            alignItems: 'center',
            gap: '18px',
            boxShadow: '0 0 60px rgba(0, 102, 255, 0.7), 0 25px 50px rgba(0, 0, 0, 0.7)',
            overflow: 'hidden',
          }}
        >
          {/* Shimmer light sweep */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              width: '80px',
              left: `${shimmerPos}px`,
              background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%)',
              transform: 'skewX(-25deg)',
              pointerEvents: 'none',
            }}
          />

          <span style={{ color: '#FFFFFF', fontSize: '38px', fontWeight: 900, letterSpacing: '-0.5px' }}>
            SafeShip.online
          </span>

          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Promo Incentive */}
        <div
          style={{
            background: 'rgba(16, 185, 129, 0.16)',
            border: '1px solid rgba(16, 185, 129, 0.45)',
            borderRadius: '999px',
            padding: '8px 26px',
            color: '#34D399',
            fontSize: '15px',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
          }}
        >
          <span>🏷️</span> Book Your First Shipment &bull; ₹99 Instant Off
        </div>
      </div>

      {/* Prestige Trust Credentials */}
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
            background: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '16px',
            padding: '12px 24px',
            color: '#F1F5F9',
            fontSize: '15px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
          }}
        >
          <span>🏦</span> RBI-Regulated Bank Escrow
        </div>

        <div
          style={{
            background: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '16px',
            padding: '12px 24px',
            color: '#F1F5F9',
            fontSize: '15px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
          }}
        >
          <span>🛡️</span> ₹10,00,000 Transit Insurance
        </div>

        <div
          style={{
            background: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '16px',
            padding: '12px 24px',
            color: '#F1F5F9',
            fontSize: '15px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
          }}
        >
          <span>🔍</span> Doorstep Open-Box Inspection
        </div>
      </div>
    </div>
  );
};
