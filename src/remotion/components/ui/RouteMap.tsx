import React from 'react';
import { interpolate, spring } from 'remotion';
import { MOTION_PHYSICS } from '../../constants/physics';
import { Smartphone, Zap } from 'lucide-react';

interface RouteMapProps {
  frame: number;
  isFractured?: boolean;
  fractureProgress?: number;
  theme?: 'light' | 'dark';
}

export const RouteMap: React.FC<RouteMapProps> = ({
  frame,
  isFractured = false,
  theme = 'light',
}) => {
  const isDark = theme === 'dark';

  // Entry animation for nodes
  const nodeSpring = spring({
    frame: frame - 15,
    fps: 60,
    config: MOTION_PHYSICS.SNAPPY_SPRING,
  });

  // Animated pulse progress along the route (repeating loop)
  const pulseProg = (frame % 80) / 80;

  // Path coordinates between Delhi (left) and Bangalore (right)
  const p1 = { x: 100, y: 70 };
  const p2 = { x: 780, y: 150 };
  const cp1 = { x: 320, y: 20 };
  const cp2 = { x: 560, y: 200 };
  const pathD = `M ${p1.x} ${p1.y} C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${p2.x} ${p2.y}`;

  // Bezier position for traveling bead
  const t = pulseProg;
  const beadX =
    Math.pow(1 - t, 3) * p1.x +
    3 * Math.pow(1 - t, 2) * t * cp1.x +
    3 * (1 - t) * Math.pow(t, 2) * cp2.x +
    Math.pow(t, 3) * p2.x;
  const beadY =
    Math.pow(1 - t, 3) * p1.y +
    3 * Math.pow(1 - t, 2) * t * cp1.y +
    3 * (1 - t) * Math.pow(t, 2) * cp2.y +
    Math.pow(t, 3) * p2.y;

  return (
    <div
      style={{
        position: 'relative',
        width: 880,
        height: 220,
        margin: '0 auto',
      }}
    >
      <svg
        width="880"
        height="220"
        viewBox="0 0 880 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id="fracturedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#EF4444" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#DC2626" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* Background Guide Line */}
        <path
          d={pathD}
          stroke={isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'}
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Active Route Thread or Fractured Thread */}
        <path
          d={pathD}
          stroke={isFractured ? 'url(#fracturedGradient)' : 'url(#routeGradient)'}
          strokeWidth={isFractured ? 3.5 : 4}
          strokeDasharray={isFractured ? '10 8' : undefined}
          strokeLinecap="round"
          style={{
            filter: isFractured
              ? 'drop-shadow(0 0 10px rgba(239, 68, 68, 0.8))'
              : 'drop-shadow(0 0 12px rgba(59, 130, 246, 0.6))',
          }}
        />

        {/* Traveling Light Pulse Bead (only if not fractured) */}
        {!isFractured && (
          <g transform={`translate(${beadX}, ${beadY})`}>
            <circle r="7" fill="#3B82F6" style={{ filter: 'drop-shadow(0 0 10px #60A5FA)' }} />
            <circle r="14" fill="none" stroke="#60A5FA" strokeWidth="1.5" opacity="0.6" />
          </g>
        )}

        {/* Fractured Sparks if fractured */}
        {isFractured && (
          <g transform={`translate(${440 + Math.sin(frame) * 8}, ${95 + Math.cos(frame) * 6})`}>
            <circle r="5" fill="#EF4444" style={{ filter: 'drop-shadow(0 0 12px #EF4444)' }} />
            <line x1="-16" y1="-10" x2="14" y2="16" stroke="#F87171" strokeWidth="2.5" />
            <line x1="10" y1="-14" x2="-12" y2="12" stroke="#EF4444" strokeWidth="2" />
          </g>
        )}
      </svg>

      {/* Floating Center Tech Pill */}
      <div
        style={{
          position: 'absolute',
          left: 440,
          top: 95,
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '6px 14px',
          borderRadius: 9999,
          background: isFractured ? 'rgba(239, 68, 68, 0.1)' : '#FFFFFF',
          border: `1.5px solid ${isFractured ? 'rgba(239, 68, 68, 0.4)' : 'rgba(0, 0, 0, 0.08)'}`,
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.06)',
          backdropFilter: 'blur(16px)',
          transition: 'all 0.2s ease',
        }}
      >
        <Smartphone size={14} color={isFractured ? '#EF4444' : '#0066FF'} />
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            fontFamily: "'Geist', monospace",
            color: isFractured ? '#DC2626' : '#0F172A',
            letterSpacing: '0.04em',
          }}
        >
          {isFractured ? '⚠️ CONNECTION SEVERED' : '2,170 KM • P2P LISTING'}
        </span>
      </div>

      {/* Node 1: DELHI (North / Buyer) */}
      <div
        style={{
          position: 'absolute',
          left: p1.x - 70,
          top: p1.y - 45,
          transform: `scale(${nodeSpring})`,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '8px 16px',
          borderRadius: 9999,
          background: '#FFFFFF',
          border: '1.5px solid rgba(0, 0, 0, 0.08)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
          backdropFilter: 'blur(16px)',
        }}
      >
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: '#3B82F6',
            boxShadow: '0 0 10px #3B82F6',
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span
            style={{
              fontSize: 13,
              fontWeight: 800,
              fontFamily: "'Geist', 'Inter', sans-serif",
              letterSpacing: '0.06em',
              color: '#0F172A',
            }}
          >
            DELHI
          </span>
          <span style={{ fontSize: 10, color: '#64748B', fontWeight: 500 }}>BUYER • 28.61° N</span>
        </div>
      </div>

      {/* Node 2: BANGALORE (South / Seller) */}
      <div
        style={{
          position: 'absolute',
          left: p2.x - 70,
          top: p2.y - 10,
          transform: `scale(${nodeSpring})`,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '8px 16px',
          borderRadius: 9999,
          background: '#FFFFFF',
          border: `1.5px solid ${isFractured ? 'rgba(239, 68, 68, 0.4)' : 'rgba(0, 0, 0, 0.08)'}`,
          boxShadow: isFractured
            ? '0 8px 30px rgba(239, 68, 68, 0.25)'
            : '0 8px 24px rgba(0, 0, 0, 0.08)',
          backdropFilter: 'blur(16px)',
        }}
      >
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: isFractured ? '#EF4444' : '#10B981',
            boxShadow: isFractured ? '0 0 10px #EF4444' : '0 0 10px #10B981',
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span
            style={{
              fontSize: 13,
              fontWeight: 800,
              fontFamily: "'Geist', 'Inter', sans-serif",
              letterSpacing: '0.06em',
              color: '#0F172A',
            }}
          >
            BANGALORE
          </span>
          <span style={{ fontSize: 10, color: '#64748B', fontWeight: 500 }}>
            {isFractured ? 'UNKNOWN SELLER' : 'SELLER • 12.97° N'}
          </span>
        </div>
      </div>
    </div>
  );
};
