import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

interface SafeShip3DLogoAnimatedProps {
  size?: number;
  assembleDelay?: number;
  glow?: boolean;
}

export const SafeShip3DLogoAnimated: React.FC<SafeShip3DLogoAnimatedProps> = ({
  size = 140,
  assembleDelay = 0,
  glow = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Assembly spring
  const assembleSpring = spring({
    frame: frame - assembleDelay,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  // Shockwave ring pulse on lock
  const shockwaveProgress = interpolate(frame - (assembleDelay + 15), [0, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const shockwaveScale = interpolate(shockwaveProgress, [0, 1], [0.6, 2.4]);
  const shockwaveOpacity = interpolate(shockwaveProgress, [0, 0.2, 1], [0, 0.8, 0]);

  // Light sweep reflection (travels every 60 frames)
  const sheenPos = ((frame * 3) % 240) - 60;

  // Individual facet assembly offsets
  const topFacetY = interpolate(assembleSpring, [0, 1], [-40, 0]);
  const leftFacetX = interpolate(assembleSpring, [0, 1], [-35, 0]);
  const rightFacetX = interpolate(assembleSpring, [0, 1], [35, 0]);
  const bottomFacetY = interpolate(assembleSpring, [0, 1], [40, 0]);
  const centerScale = interpolate(assembleSpring, [0, 1], [0, 1]);

  return (
    <div
      style={{
        position: 'relative',
        width: `${size}px`,
        height: `${size}px`,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Shockwave Ring on Assembly */}
      {shockwaveProgress > 0 && shockwaveProgress < 1 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '32px',
            border: '2px solid #38BDF8',
            transform: `scale(${shockwaveScale})`,
            opacity: shockwaveOpacity,
            boxShadow: '0 0 30px #0066FF',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Volumetric Specular Aura */}
      {glow && (
        <div
          style={{
            position: 'absolute',
            inset: `-${size * 0.35}px`,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0, 102, 255, 0.5) 0%, rgba(56, 189, 248, 0.2) 40%, transparent 70%)',
            filter: 'blur(30px)',
            transform: `scale(${interpolate(assembleSpring, [0, 1], [0.5, 1])})`,
            opacity: assembleSpring,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* 3D Assembling Geometric Mark */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          display: 'block',
          transform: `scale(${assembleSpring})`,
          filter: 'drop-shadow(0 16px 32px rgba(0, 102, 255, 0.45))',
        }}
      >
        <defs>
          <linearGradient id="squircle-grad" x1="3.5" y1="3.5" x2="44.5" y2="44.5" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0066FF" />
            <stop offset="1" stopColor="#003D99" />
          </linearGradient>

          {/* Light sweep clip mask */}
          <linearGradient id="sheen-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="50%" stopColor="rgba(255, 255, 255, 0.6)" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>

        {/* Outer Rounded Squircle */}
        <rect
          x="3.5"
          y="3.5"
          width="41"
          height="41"
          rx="10.5"
          fill="url(#squircle-grad)"
          stroke="rgba(255, 255, 255, 0.3)"
          strokeWidth="1"
        />

        {/* Dynamic Facets assembling in 3D */}
        <g transform="translate(24, 24) scale(0.92) translate(-24, -24.6)">
          {/* Base Hexagon Silhouette */}
          <path
            d="M24 9L37.5 16.8V32.4L24 40.2L10.5 32.4V16.8L24 9Z"
            fill="white"
            opacity={assembleSpring}
          />

          {/* Top Bevel Facet */}
          <path
            d="M24 9L37.5 16.8L30 21.2L24 17.7L18 21.2L10.5 16.8L24 9Z"
            fill="#FFFFFF"
            transform={`translate(0, ${topFacetY})`}
          />

          {/* Left Bevel Facet */}
          <path
            d="M10.5 16.8L18 21.2V27.9L10.5 32.4V16.8Z"
            fill="#E0E7FF"
            transform={`translate(${leftFacetX}, 0)`}
          />

          {/* Right Bevel Facet */}
          <path
            d="M37.5 16.8L30 21.2V27.9L37.5 32.4V16.8Z"
            fill="#F1F5F9"
            transform={`translate(${rightFacetX}, 0)`}
          />

          {/* Bottom Bevel Facet */}
          <path
            d="M24 40.2L10.5 32.4L18 27.9L24 31.4L30 27.9L37.5 32.4L24 40.2Z"
            fill="#CBD5E1"
            transform={`translate(0, ${bottomFacetY})`}
          />

          {/* Center Hexagonal Aperture with scale pop */}
          <g transform={`translate(24, 25) scale(${centerScale}) translate(-24, -25)`}>
            <path
              d="M24 18L30 21.5V28.5L24 32L18 28.5V21.5L24 18Z"
              fill="#0066FF"
            />
          </g>
        </g>
      </svg>
    </div>
  );
};
