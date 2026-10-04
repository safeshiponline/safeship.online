import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  theme?: 'light' | 'dark';
  className?: string;
  style?: React.CSSProperties;
  glowColor?: string;
  borderColor?: string;
  rounded?: number;
  padding?: string | number;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  theme = 'light',
  style,
  glowColor,
  borderColor,
  rounded = 28,
  padding = '32px 36px',
}) => {
  const isDark = theme === 'dark';

  const defaultBg = isDark
    ? 'linear-gradient(135deg, rgba(20, 20, 20, 0.85) 0%, rgba(10, 10, 10, 0.95) 100%)'
    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.92) 0%, rgba(248, 250, 252, 0.85) 100%)';

  const defaultBorder = borderColor || (isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)');

  const defaultShadow = isDark
    ? `0 30px 80px rgba(0, 0, 0, 0.75), inset 0 1px 1px rgba(255, 255, 255, 0.15) ${glowColor ? `, 0 0 50px ${glowColor}` : ''}`
    : `0 24px 60px rgba(0, 0, 0, 0.07), 0 4px 16px rgba(0, 0, 0, 0.03), inset 0 1px 1px rgba(255, 255, 255, 0.9) ${glowColor ? `, 0 0 40px ${glowColor}` : ''}`;

  return (
    <div
      style={{
        position: 'relative',
        background: defaultBg,
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        border: `1px solid ${defaultBorder}`,
        borderRadius: rounded,
        padding,
        boxShadow: defaultShadow,
        overflow: 'hidden',
        ...style,
      }}
    >
      {/* Specular hairline top sheen reflection */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '10%',
          right: '10%',
          height: 1,
          background: isDark
            ? 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.35), transparent)'
            : 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent)',
          pointerEvents: 'none',
        }}
      />
      {children}
    </div>
  );
};
