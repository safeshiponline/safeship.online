import React from 'react';
import { interpolate, spring, useCurrentFrame } from 'remotion';
import { MOTION_PHYSICS, PALETTE } from '../constants/physics';
import { KineticHeader } from '../components/ui/KineticHeader';
import { SpatialCursor } from '../components/ui/SpatialCursor';
import { Badge } from '../components/ui/Badge';
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles, Globe } from 'lucide-react';

export const Scene5Outro: React.FC = () => {
  const frame = useCurrentFrame();

  // Scene 5 runs for 260 frames total (master frames 1840 to 2100)
  // Continuous gentle camera drift
  const cameraZoom = interpolate(frame, [0, 260], [0.98, 1.04], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Scene fade in (and subtle end hold)
  const sceneOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Headline words
  const outroWords = [
    { text: 'Verify', isAccent: true, accentColor: '#0066FF' },
    { text: 'first.', isAccent: true, accentColor: '#0066FF' },
    { text: 'Pay', isAccent: false },
    { text: 'only', isAccent: false },
    { text: 'when', isAccent: false },
    { text: 'satisfied.', isAccent: true, accentColor: '#10B981' },
  ];

  // CTA Pill Button Spring (frame 40 onwards)
  const ctaSpring = spring({
    frame: frame - 40,
    fps: 60,
    config: MOTION_PHYSICS.SNAPPY_SPRING,
  });

  // Light sweep reflection position across the CTA pill
  const lightSweep = interpolate(frame, [70, 140], [-100, 200], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Cursor gliding to CTA button (frames 80 to 135)
  const cursorX = interpolate(frame, [80, 125], [780, 960], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const cursorY = interpolate(frame, [80, 125], [800, 632], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const isClicking = frame >= 125 && frame <= 145;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: '#F8F7F4',
        opacity: sceneOpacity,
        transform: `scale(${cameraZoom})`,
        transformOrigin: 'center center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '50px 80px',
        overflow: 'hidden',
        fontFamily: "'Geist', 'Inter', -apple-system, sans-serif",
      }}
    >
      {/* Background Dot Matrix */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'radial-gradient(circle, rgba(0, 0, 0, 0.08) 1.2px, transparent 1.2px)',
          backgroundSize: '28px 28px',
          opacity: 0.65,
          pointerEvents: 'none',
        }}
      />

      {/* Volumetric Radial Glow */}
      <div
        style={{
          position: 'absolute',
          top: '40%',
          left: '50%',
          width: 800,
          height: 600,
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(0, 102, 255, 0.09) 0%, rgba(16, 185, 129, 0.07) 50%, transparent 75%)',
          pointerEvents: 'none',
        }}
      />

      {/* Brand Icon Mini Lockup */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          marginBottom: 36,
          transform: `scale(${interpolate(frame, [0, 30], [0.8, 1], { extrapolateRight: 'clamp' })})`,
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            background: '#0066FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(0, 102, 255, 0.35)',
          }}
        >
          <svg viewBox="0 0 48 48" width="32" height="32" fill="none">
            <g transform="translate(24, 24) scale(0.92) translate(-24, -24.6)">
              <path d="M24 9L37.5 16.8V32.4L24 40.2L10.5 32.4V16.8L24 9Z" fill="white" />
              <path d="M24 9L37.5 16.8L30 21.2L24 17.7L18 21.2L10.5 16.8L24 9Z" fill="#FFFFFF" />
              <path d="M10.5 16.8L18 21.2V27.9L10.5 32.4V16.8Z" fill="#E0E7FF" />
              <path d="M37.5 16.8L30 21.2V27.9L37.5 32.4V16.8Z" fill="#F1F5F9" />
              <path d="M24 40.2L10.5 32.4L18 27.9L24 31.4L30 27.9L37.5 32.4L24 40.2Z" fill="#CBD5E1" />
              <path d="M24 18L30 21.5V28.5L24 32L18 28.5V21.5L24 18Z" fill="#0066FF" />
            </g>
          </svg>
        </div>
        <span
          style={{
            fontSize: 32,
            fontWeight: 900,
            color: '#0F172A',
            letterSpacing: '-0.04em',
            fontFamily: "'Geist', -apple-system, BlinkMacSystemFont, sans-serif",
          }}
        >
          SafeShip
        </span>
      </div>

      {/* Kinetic Headline: "Verify first. Pay only when satisfied." */}
      <KineticHeader
        words={outroWords}
        frame={frame}
        startFrame={5}
        stagger={5}
        fontSize={56}
        accentFontSize={72}
        style={{ marginBottom: 44 }}
      />

      {/* Interactive CTA Pill: safeship.online */}
      <div
        style={{
          transform: `perspective(1000px) rotateX(4deg) translateY(${(1 - ctaSpring) * 35}px) scale(${ctaSpring})`,
          zIndex: 30,
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            padding: '20px 42px',
            borderRadius: 9999,
            background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
            color: '#FFFFFF',
            boxShadow:
              '0 24px 60px rgba(15, 23, 42, 0.35), 0 0 40px rgba(0, 102, 255, 0.25)',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            transform: `scale(${isClicking ? 0.95 : 1})`,
            transition: 'transform 0.1s ease',
            overflow: 'hidden',
          }}
        >
          {/* Light Sweep Sheen */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: `${lightSweep}%`,
              width: 120,
              height: '100%',
              background:
                'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.35), transparent)',
              transform: 'skewX(-25deg)',
              pointerEvents: 'none',
            }}
          />

          <Globe size={24} color="#60A5FA" />
          <span
            style={{
              fontSize: 28,
              fontWeight: 800,
              fontFamily: "'Geist', monospace",
              letterSpacing: '-0.02em',
            }}
          >
            safeship.online
          </span>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              background: '#0066FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: 8,
              boxShadow: '0 4px 14px rgba(0, 102, 255, 0.5)',
            }}
          >
            <ArrowRight size={20} color="#FFFFFF" />
          </div>
        </div>
      </div>

      {/* Spatial Cursor gliding in to click */}
      {frame >= 80 && (
        <SpatialCursor
          x={cursorX}
          y={cursorY}
          label="Launch"
          isClicking={isClicking}
          clickFrame={frame >= 125 ? frame - 125 : 0}
          color="#0066FF"
        />
      )}

      {/* Trust Badges Footer */}
      <div
        style={{
          display: 'flex',
          gap: 24,
          alignItems: 'center',
          marginTop: 48,
          opacity: interpolate(frame, [50, 75], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      >
        <Badge variant="default" size="md" dot icon={<ShieldCheck size={16} color="#10B981" />}>
          RBI-Compliant Escrow
        </Badge>
        <Badge variant="default" size="md" dot icon={<CheckCircle2 size={16} color="#0066FF" />}>
          Verified Doorstep Open-Box
        </Badge>
        <Badge variant="default" size="md" dot icon={<Sparkles size={16} color="#8B5CF6" />}>
          100% Guaranteed Refund
        </Badge>
      </div>
    </div>
  );
};
