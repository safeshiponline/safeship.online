export const MOTION_PHYSICS = {
  // Snappy UI pop-ins with 2-3% overshoot (Outship/OpenAI standard)
  SNAPPY_SPRING: {
    mass: 0.5,
    damping: 12,
    stiffness: 140,
    overshootClamping: false,
  },
  // Heavy impactful card drops with subtle rebound
  HEAVY_DROP_SPRING: {
    mass: 0.8,
    damping: 14,
    stiffness: 100,
    overshootClamping: false,
  },
  // Smooth, weighted 3D Y-axis card flips
  CARD_FLIP_SPRING: {
    mass: 0.6,
    damping: 15,
    stiffness: 110,
    overshootClamping: false,
  },
  // Quick tactile button clicks
  TACTILE_CLICK: {
    mass: 0.3,
    damping: 8,
    stiffness: 220,
    overshootClamping: false,
  },
} as const;

export const PALETTE = {
  // Canvases
  porcelain: '#F8F7F4',
  porcelainMuted: '#EFECE6',
  obsidian: '#080808',
  obsidianCard: '#111111',
  obsidianBorder: 'rgba(255, 255, 255, 0.12)',
  
  // Accents
  emerald: '#10B981',
  emeraldGlow: 'rgba(16, 185, 129, 0.4)',
  emeraldSubtle: 'rgba(16, 185, 129, 0.12)',
  
  crimson: '#EF4444',
  crimsonGlow: 'rgba(239, 68, 68, 0.4)',
  crimsonSubtle: 'rgba(239, 68, 68, 0.12)',
  
  electricBlue: '#3B82F6',
  electricBlueGlow: 'rgba(59, 130, 246, 0.4)',
  electricBlueSubtle: 'rgba(59, 130, 246, 0.12)',
  
  // Text
  charcoal: '#111111',
  slateDark: '#0F172A',
  slateMuted: '#64748B',
  white: '#FFFFFF',
} as const;

export const TIMELINE_60FPS = {
  FPS: 60,
  TOTAL_FRAMES: 2100, // 35 seconds @ 60 FPS
  
  SCENE_1: { start: 0, duration: 565, end: 565 },        // 00:00 - 00:09.42 (Hook & Stranger Threat)
    PHASE_1_UPI: { start: 0, duration: 375, end: 375 },  // 00:00 - 00:06.26 (Bangalore/Delhi & UPI risk)
    PHASE_2_SHIP: { start: 375, duration: 190, end: 565 }, // 00:06.26 - 00:09.42 (Never ship hoping a stranger pays)
  SCENE_2: { start: 565, duration: 175, end: 740 },      // 00:09.42 - 00:12.30 (Use SafeShip. Here's how it works)
  SCENE_3: { start: 740, duration: 725, end: 1465 },     // 00:12.30 - 00:24.40 (The 3-Step Trust Loop)
    STEP_1: { start: 740, duration: 295, end: 1035 },    // 00:12.30 - 00:17.26 (Locked Vault)
    STEP_2: { start: 1035, duration: 180, end: 1215 },   // 00:17.26 - 00:20.24 (Express Tracking)
    STEP_3: { start: 1215, duration: 250, end: 1465 },   // 00:20.24 - 00:24.40 (Open Box, Screen On, Test Phone)
  SCENE_4: { start: 1465, duration: 375, end: 1840 },    // 00:24.40 - 00:30.64 (Happy / Wrong Dual-Path)
    BEAT_A: { start: 1465, duration: 155, end: 1620 },   // 00:24.40 - 00:27.00 (Happy: Release Payment)
    BEAT_B: { start: 1620, duration: 220, end: 1840 },   // 00:27.00 - 00:30.64 (Something Wrong: 100% Refund)
  SCENE_5: { start: 1840, duration: 260, end: 2100 },    // 00:30.64 - 00:35.00 (Verify First, Pay When Satisfied)
} as const;
