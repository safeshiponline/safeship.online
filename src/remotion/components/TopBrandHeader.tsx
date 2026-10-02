import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { SafeShipOfficialLogo } from './SafeShipOfficialLogo';

export const TopBrandHeader: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const progress = (frame / durationInFrames) * 100;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 40,
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Precision Hairline Progress Bar */}
      <div
        style={{
          width: '100%',
          height: '3px',
          background: 'rgba(255, 255, 255, 0.08)',
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #0066FF 0%, #38BDF8 60%, #10B981 100%)',
            boxShadow: '0 0 12px rgba(56, 189, 248, 0.6)',
          }}
        />
      </div>

      {/* Floating Top Nav Strip */}
      <div
        style={{
          padding: '28px 56px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Official SafeShip Logo & Wordmark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <SafeShipOfficialLogo size={36} glow={true} />
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span style={{ color: '#FFFFFF', fontSize: '22px', fontWeight: 900, letterSpacing: '-0.5px' }}>
              Safe<span style={{ color: '#38BDF8' }}>Ship</span>
            </span>
            <span style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '13px', fontWeight: 600 }}>
              INDIA
            </span>
          </div>
        </div>

        {/* Minimalist Trust Indicator */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '7px 16px',
            borderRadius: '999px',
          }}
        >
          <span
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: '#10B981',
              boxShadow: '0 0 8px #10B981',
            }}
          />
          <span style={{ color: '#E2E8F0', fontSize: '12px', fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase' }}>
            RBI Nodal Escrow Protected
          </span>
        </div>
      </div>
    </div>
  );
};
