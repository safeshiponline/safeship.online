import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  variant?: 'default' | 'success' | 'danger' | 'warning' | 'info' | 'obsidian';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
  style?: React.CSSProperties;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  icon,
  variant = 'default',
  size = 'md',
  dot = false,
  style,
}) => {
  const getColors = () => {
    switch (variant) {
      case 'success':
        return {
          bg: 'rgba(16, 185, 129, 0.12)',
          border: 'rgba(16, 185, 129, 0.3)',
          text: '#059669',
          dot: '#10B981',
          shadow: '0 0 16px rgba(16, 185, 129, 0.15)',
        };
      case 'danger':
        return {
          bg: 'rgba(239, 68, 68, 0.12)',
          border: 'rgba(239, 68, 68, 0.35)',
          text: '#DC2626',
          dot: '#EF4444',
          shadow: '0 0 16px rgba(239, 68, 68, 0.2)',
        };
      case 'warning':
        return {
          bg: 'rgba(245, 158, 11, 0.12)',
          border: 'rgba(245, 158, 11, 0.35)',
          text: '#D97706',
          dot: '#F59E0B',
          shadow: '0 0 16px rgba(245, 158, 11, 0.15)',
        };
      case 'info':
        return {
          bg: 'rgba(59, 130, 246, 0.12)',
          border: 'rgba(59, 130, 246, 0.35)',
          text: '#2563EB',
          dot: '#3B82F6',
          shadow: '0 0 16px rgba(59, 130, 246, 0.2)',
        };
      case 'obsidian':
        return {
          bg: 'rgba(15, 23, 42, 0.7)',
          border: 'rgba(255, 255, 255, 0.15)',
          text: '#F8FAFC',
          dot: '#10B981',
          shadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
        };
      case 'default':
      default:
        return {
          bg: 'rgba(0, 0, 0, 0.05)',
          border: 'rgba(0, 0, 0, 0.09)',
          text: '#334155',
          dot: '#64748B',
          shadow: 'none',
        };
    }
  };

  const getPaddingAndFont = () => {
    switch (size) {
      case 'sm':
        return { padding: '4px 10px', fontSize: 11, iconSize: 12 };
      case 'lg':
        return { padding: '8px 18px', fontSize: 14, iconSize: 16 };
      case 'md':
      default:
        return { padding: '6px 14px', fontSize: 12, iconSize: 14 };
    }
  };

  const colors = getColors();
  const sizes = getPaddingAndFont();

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        padding: sizes.padding,
        borderRadius: 9999,
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        boxShadow: colors.shadow,
        color: colors.text,
        fontSize: sizes.fontSize,
        fontWeight: 600,
        fontFamily: "'Geist', 'Inter', -apple-system, sans-serif",
        letterSpacing: '0.03em',
        textTransform: 'uppercase',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        ...style,
      }}
    >
      {dot && (
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: colors.dot,
            boxShadow: `0 0 8px ${colors.dot}`,
            display: 'inline-block',
          }}
        />
      )}
      {icon && <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>}
      <span>{children}</span>
    </div>
  );
};
