import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

interface DotMatrixCanvasProps {
  theme?: 'light' | 'dark';
  children: React.ReactNode;
}

export const DotMatrixCanvas: React.FC<DotMatrixCanvasProps> = ({ theme = 'light', children }) => {
  const frame = useCurrentFrame();

  // Subtle continuous forward camera drift (Z-space push: 1.0 -> 1.03 over 35s)
  const cameraScale = interpolate(frame, [0, 1050], [1.0, 1.03], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const isDark = theme === 'dark';
  const bgColor = isDark ? '#0A0A0A' : '#F8F7F4';
  const dotColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)';
  const guideLineColor = isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)';

  return (
    <div
      style={{
        width: 1920,
        height: 1080,
        backgroundColor: bgColor,
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Geist', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* 1. Global Font Injections: Instrument Serif & Inter/Geist */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600;700;800&family=Geist:wght@400;500;600;700&display=swap');
        
        .font-editorial {
          font-family: 'Instrument Serif', Georgia, serif;
          font-style: italic;
        }
        .font-sans-ui {
          font-family: 'Geist', 'Inter', -apple-system, sans-serif;
          letter-spacing: -0.025em;
        }
        .micro-tag {
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
      `}</style>

      {/* 2. Technical 24px Dot-Matrix Grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `radial-gradient(circle, ${dotColor} 1.2px, transparent 1.2px)`,
          backgroundSize: '24px 24px',
          opacity: 0.85,
          pointerEvents: 'none',
        }}
      />

      {/* 3. Subtle Hairline Technical Boundary Crosshairs */}
      <div
        style={{
          position: 'absolute',
          inset: 48,
          border: `1px solid ${guideLineColor}`,
          borderRadius: 24,
          pointerEvents: 'none',
        }}
      >
        {/* Top-Left crosshair */}
        <div style={{ position: 'absolute', top: -6, left: -6, color: dotColor, fontSize: 10 }}>+</div>
        {/* Top-Right crosshair */}
        <div style={{ position: 'absolute', top: -6, right: -6, color: dotColor, fontSize: 10 }}>+</div>
        {/* Bottom-Left crosshair */}
        <div style={{ position: 'absolute', bottom: -6, left: -6, color: dotColor, fontSize: 10 }}>+</div>
        {/* Bottom-Right crosshair */}
        <div style={{ position: 'absolute', bottom: -6, right: -6, color: dotColor, fontSize: 10 }}>+</div>
      </div>

      {/* 4. Camera Parallax Layer Container */}
      <div
        style={{
          width: '100%',
          height: '100%',
          transform: `scale(${cameraScale})`,
          transformOrigin: 'center center',
          transition: 'transform 0.1s linear',
        }}
      >
        {children}
      </div>
    </div>
  );
};
