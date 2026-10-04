import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

interface SubtitleItem {
  startFrame: number;
  endFrame: number;
  text: string;
  highlightWords?: string[];
}

const SUBTITLES_35: SubtitleItem[] = [
  {
    startFrame: 5,
    endFrame: 90,
    text: "Buying an iPhone from someone in Bangalore while sitting in Delhi?",
    highlightWords: ["Bangalore", "Delhi?"],
  },
  {
    startFrame: 92,
    endFrame: 175,
    text: "Never send advance money on UPI.",
    highlightWords: ["Never", "advance", "money", "UPI."],
  },
  {
    startFrame: 178,
    endFrame: 238,
    text: "And never ship your phone hoping a stranger will pay.",
    highlightWords: ["never", "ship", "stranger", "pay."],
  },
  {
    startFrame: 245,
    endFrame: 385,
    text: "Use SafeShip.",
    highlightWords: ["SafeShip."],
  },
  {
    startFrame: 395,
    endFrame: 505,
    text: "1. You pay, but your money stays safely locked with us. The seller can't touch it yet.",
    highlightWords: ["safely", "locked", "seller", "can't", "touch"],
  },
  {
    startFrame: 512,
    endFrame: 625,
    text: "2. The seller ships your gadget with express tracking.",
    highlightWords: ["seller", "ships", "express", "tracking."],
  },
  {
    startFrame: 632,
    endFrame: 775,
    text: "3. When it reaches your door: open the box, turn on the screen, and test the phone.",
    highlightWords: ["open", "box,", "turn", "on", "test", "phone."],
  },
  {
    startFrame: 785,
    endFrame: 868,
    text: "Happy? You release the payment to the seller.",
    highlightWords: ["Happy?", "release", "payment", "seller."],
  },
  {
    startFrame: 872,
    endFrame: 955,
    text: "Something wrong? You get 100% of your money right back.",
    highlightWords: ["wrong?", "100%", "money", "back."],
  },
  {
    startFrame: 965,
    endFrame: 1045,
    text: "Verify first. Pay only when satisfied. SafeShip online.",
    highlightWords: ["Verify", "first.", "satisfied.", "SafeShip"],
  },
];

export const SubtitlesHUD35: React.FC = () => {
  const frame = useCurrentFrame();

  const currentItem = SUBTITLES_35.find(
    (item) => frame >= item.startFrame && frame <= item.endFrame
  );

  if (!currentItem) return null;

  const duration = currentItem.endFrame - currentItem.startFrame;
  const progress = (frame - currentItem.startFrame) / duration;

  // Staggered word animation
  const words = currentItem.text.split(' ');
  const activeWordIdx = Math.min(
    words.length - 1,
    Math.floor(progress * words.length * 1.1)
  );

  const isDarkMode = (frame >= 240 && frame < 390) || (frame >= 780 && frame < 960);

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          background: isDarkMode ? 'rgba(15, 23, 42, 0.88)' : 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(24px)',
          border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid rgba(0, 0, 0, 0.08)',
          borderRadius: 999,
          padding: '12px 32px',
          boxShadow: isDarkMode ? '0 16px 40px rgba(0, 0, 0, 0.6)' : '0 16px 40px rgba(0, 0, 0, 0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          maxWidth: 1200,
          transition: 'all 0.2s ease',
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: '#0066FF',
            boxShadow: '0 0 10px #0066FF',
          }}
        />

        <div
          style={{
            fontFamily: "'Geist', 'Inter', -apple-system, sans-serif",
            fontSize: 20,
            fontWeight: 600,
            letterSpacing: '-0.02em',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8,
          }}
        >
          {words.map((word, idx) => {
            const isHighlighted = currentItem.highlightWords?.some((hw) =>
              word.toLowerCase().includes(hw.toLowerCase().replace(/[^a-z0-9]/g, ''))
            );
            const isCurrentActive = idx <= activeWordIdx;

            let textColor = isDarkMode ? 'rgba(255, 255, 255, 0.45)' : 'rgba(15, 23, 42, 0.45)';
            if (isCurrentActive) {
              if (isHighlighted) {
                textColor = isDarkMode ? '#10B981' : '#0066FF';
              } else {
                textColor = isDarkMode ? '#FFFFFF' : '#0F172A';
              }
            }

            return (
              <span
                key={idx}
                style={{
                  color: textColor,
                  fontWeight: isHighlighted ? 700 : 600,
                  transition: 'color 0.1s ease',
                }}
              >
                {word}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};
