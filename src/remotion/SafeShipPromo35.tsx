import React from 'react';
import { Audio, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { DotMatrixCanvas } from './components/v2/DotMatrixCanvas';
import { Scene1_TheHook } from './components/v2/Scene1_TheHook';
import { Scene2_TheSolution } from './components/v2/Scene2_TheSolution';
import { Scene3_TheTrustLoop } from './components/v2/Scene3_TheTrustLoop';
import { Scene4_ThePunchline } from './components/v2/Scene4_ThePunchline';
import { Scene5_Outro } from './components/v2/Scene5_Outro';
import { SubtitlesHUD35 } from './components/v2/SubtitlesHUD35';

export const SafeShipPromo35: React.FC = () => {
  const frame = useCurrentFrame();

  // Determine current active canvas theme (light vs dark)
  // Scene 1 (0-240): Light (Porcelain #F8F7F4)
  // Scene 2 (240-390): Dark (Obsidian #0A0A0A)
  // Scene 3 (390-780): Light (Porcelain #F8F7F4)
  // Scene 4 (780-960): Dark (Obsidian #0A0A0A)
  // Scene 5 (960-1050): Light (Porcelain #F8F7F4)
  const isDark = (frame >= 240 && frame < 390) || (frame >= 780 && frame < 960);

  // Background music volume curve (35 seconds = 1050 frames)
  const musicVolume = (f: number) => {
    return interpolate(
      f,
      [0, 30, 240, 270, 780, 810, 960, 1020, 1050],
      [0.22, 0.16, 0.16, 0.22, 0.16, 0.22, 0.18, 0.25, 0.0],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );
  };

  return (
    <DotMatrixCanvas theme={isDark ? 'dark' : 'light'}>
      {/* 1. Optional Layered Background Music */}
      <Audio src={staticFile('audio/bg-music.mp3')} volume={musicVolume} />

      {/* 2. Scene 1: The Hook (00:00 - 00:08 | Frames 0 to 240) */}
      <Scene1_TheHook />

      {/* 3. Scene 2: The Solution (00:08 - 00:13 | Frames 240 to 390) */}
      <Scene2_TheSolution />

      {/* 4. Scene 3: The 3-Step Trust Loop (00:13 - 00:26 | Frames 390 to 780) */}
      <Scene3_TheTrustLoop />

      {/* 5. Scene 4: The Punchline (00:26 - 00:32 | Frames 780 to 960) */}
      <Scene4_ThePunchline />

      {/* 6. Scene 5: Outro (00:32 - 00:35 | Frames 960 to 1050) */}
      <Scene5_Outro />

      {/* 7. Apple Keynote Synchronized Subtitles HUD */}
      <SubtitlesHUD35 />
    </DotMatrixCanvas>
  );
};
