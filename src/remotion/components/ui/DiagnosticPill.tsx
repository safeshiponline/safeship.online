import React from 'react';
import { interpolate, spring } from 'remotion';
import { MOTION_PHYSICS } from '../../constants/physics';
import { CheckCircle2, ShieldCheck, Sparkles, Smartphone } from 'lucide-react';

interface DiagnosticPillProps {
  label: string;
  metric: string;
  status?: string;
  icon?: 'display' | 'hardware' | 'condition' | 'default';
  frame: number;
  delay?: number;
  rotation?: number; // degree for 3D fan out
  theme?: 'light' | 'dark';
}

export const DiagnosticPill: React.FC<DiagnosticPillProps> = ({
  label,
  metric,
  status = 'PASSED',
  icon = 'default',
  frame,
  delay = 0,
  rotation = 0,
  theme = 'light',
}) => {
  const isDark = theme === 'dark';

  const entrySpring = spring({
    frame: frame - delay,
    fps: 60,
    config: MOTION_PHYSICS.SNAPPY_SPRING,
  });

  const getIcon = () => {
    switch (icon) {
      case 'display':
        return <Sparkles size={20} color="#10B981" />;
      case 'hardware':
        return <ShieldCheck size={20} color="#3B82F6" />;
      case 'condition':
        return <Smartphone size={20} color="#8B5CF6" />;
      default:
        return <CheckCircle2 size={20} color="#10B981" />;
    }
  };

  return (
    <div
      style={{
        transform: `perspective(1000px) rotateZ(${rotation * entrySpring}deg) scale(${entrySpring}) translateY(${(1 - entrySpring) * 40}px)`,
        transformOrigin: 'center center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: 440,
        padding: '16px 24px',
        borderRadius: 20,
        background: isDark
          ? 'linear-gradient(135deg, rgba(26, 26, 26, 0.9) 0%, rgba(15, 15, 15, 0.95) 100%)'
          : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)',
        border: `1.5px solid ${isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)'}`,
        boxShadow: isDark
          ? '0 20px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(16, 185, 129, 0.15)'
          : '0 16px 40px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.03)',
        backdropFilter: 'blur(20px)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            background: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)'}`,
          }}
        >
          {getIcon()}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span
            style={{
              fontSize: 15,
              fontWeight: 700,
              fontFamily: "'Geist', 'Inter', sans-serif",
              color: isDark ? '#FFFFFF' : '#0F172A',
              letterSpacing: '-0.02em',
            }}
          >
            {label}
          </span>
          <span
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: isDark ? '#94A3B8' : '#64748B',
            }}
          >
            {metric}
          </span>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '4px 12px',
          borderRadius: 9999,
          background: 'rgba(16, 185, 129, 0.14)',
          border: '1px solid rgba(16, 185, 129, 0.35)',
          color: '#10B981',
          fontSize: 11,
          fontWeight: 800,
          fontFamily: "'Geist', 'Inter', sans-serif",
          letterSpacing: '0.06em',
          boxShadow: '0 0 14px rgba(16, 185, 129, 0.2)',
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: '#10B981',
            boxShadow: '0 0 6px #10B981',
          }}
        />
        {status}
      </div>
    </div>
  );
};
