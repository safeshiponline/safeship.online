import React from 'react';
import { interpolate, spring } from 'remotion';
import { MOTION_PHYSICS } from '../../constants/physics';

interface SpatialCursorProps {
  x: number;
  y: number;
  label?: string;
  isClicking?: boolean;
  clickFrame?: number; // relative frame since click started
  theme?: 'light' | 'dark';
  opacity?: number;
  color?: string;
}

export const SpatialCursor: React.FC<SpatialCursorProps> = ({
  x,
  y,
  label = 'You',
  isClicking = false,
  clickFrame = 0,
  theme = 'light',
  opacity = 1,
  color,
}) => {
  const isDark = theme === 'dark';
  const cursorColor = color || (isDark ? '#10B981' : '#0F172A');

  // Click bounce animation if clickFrame is provided
  const clickScale = isClicking
    ? 0.88
    : clickFrame > 0 && clickFrame < 30
    ? 1 - 0.15 * Math.sin((clickFrame / 30) * Math.PI)
    : 1;

  // Expanding haptic ripple on click
  const rippleProgress = clickFrame > 0 && clickFrame < 45 ? clickFrame / 45 : 0;
  const rippleScale = interpolate(rippleProgress, [0, 1], [0.5, 2.4]);
  const rippleOpacity = interpolate(rippleProgress, [0, 0.2, 1], [0, 0.6, 0]);

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-2px, -2px) scale(${clickScale})`,
        transformOrigin: '0 0',
        pointerEvents: 'none',
        zIndex: 9999,
        opacity,
        transition: 'transform 0.08s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* Haptic Ripple */}
      {rippleProgress > 0 && (
        <div
          style={{
            position: 'absolute',
            left: -16,
            top: -16,
            width: 32,
            height: 32,
            borderRadius: '50%',
            border: `2px solid ${cursorColor}`,
            transform: `scale(${rippleScale})`,
            opacity: rippleOpacity,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Sleek SVG Cursor */}
      <svg
        width="26"
        height="28"
        viewBox="0 0 24 26"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          filter: isDark
            ? 'drop-shadow(0 4px 12px rgba(0,0,0,0.8)) drop-shadow(0 0 6px rgba(16,185,129,0.3))'
            : 'drop-shadow(0 6px 14px rgba(0,0,0,0.22))',
        }}
      >
        <path
          d="M3 2L11.5 22.5L14.8 14.8L22.5 11.5L3 2Z"
          fill={cursorColor}
          stroke="#FFFFFF"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>

      {/* Floating Tag Pill */}
      {label && (
        <div
          style={{
            position: 'absolute',
            left: 20,
            top: 18,
            padding: '3px 10px',
            borderRadius: 12,
            background: cursorColor,
            color: '#FFFFFF',
            fontSize: 12,
            fontWeight: 700,
            fontFamily: "'Geist', 'Inter', -apple-system, sans-serif",
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)',
            whiteSpace: 'nowrap',
            border: '1px solid rgba(255, 255, 255, 0.3)',
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
};
