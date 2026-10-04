import React from 'react';
import { interpolate, spring } from 'remotion';
import { MOTION_PHYSICS } from '../../constants/physics';

interface WordDef {
  text: string;
  isAccent?: boolean;
  accentColor?: string;
}

interface KineticHeaderProps {
  words: WordDef[];
  frame: number;
  startFrame?: number;
  stagger?: number;
  fontSize?: number;
  accentFontSize?: number;
  theme?: 'light' | 'dark';
  style?: React.CSSProperties;
}

export const KineticHeader: React.FC<KineticHeaderProps> = ({
  words,
  frame,
  startFrame = 0,
  stagger = 4,
  fontSize = 46,
  accentFontSize = 58,
  theme = 'light',
  style,
}) => {
  const isDark = theme === 'dark';
  const defaultTextColor = isDark ? '#FFFFFF' : '#111111';

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'baseline',
        columnGap: 14,
        rowGap: 8,
        maxWidth: 1360,
        textAlign: 'center',
        ...style,
      }}
    >
      {words.map((item, idx) => {
        const wordFrame = frame - (startFrame + idx * stagger);
        const wordSpring = spring({
          frame: wordFrame,
          fps: 60,
          config: MOTION_PHYSICS.SNAPPY_SPRING,
        });
        const opacity = interpolate(wordFrame, [0, 8], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const translateY = (1 - wordSpring) * 24;

        const isAccent = item.isAccent;
        const color = isAccent
          ? item.accentColor || (isDark ? '#10B981' : '#0066FF')
          : defaultTextColor;

        return (
          <span
            key={idx}
            style={{
              display: 'inline-block',
              fontFamily: isAccent
                ? "'Instrument Serif', Georgia, serif"
                : "'Geist', 'Inter', -apple-system, sans-serif",
              fontStyle: isAccent ? 'italic' : 'normal',
              fontWeight: isAccent ? 400 : 700,
              fontSize: isAccent ? accentFontSize : fontSize,
              letterSpacing: isAccent ? '0.01em' : '-0.035em',
              color,
              opacity,
              transform: `translateY(${translateY}px) scale(${0.9 + 0.1 * wordSpring})`,
            }}
          >
            {item.text}
          </span>
        );
      })}
    </div>
  );
};
