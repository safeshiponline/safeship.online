import React from 'react';
import { Audio, Sequence, staticFile, useCurrentFrame, interpolate } from 'remotion';
import { TIMELINE_60FPS } from './constants/physics';
import { Scene1Hook } from './scenes/Scene1Hook';
import { Scene2Brand } from './scenes/Scene2Brand';
import { Scene3TrustLoop } from './scenes/Scene3TrustLoop';
import { Scene4Settlement } from './scenes/Scene4Settlement';
import { Scene5Outro } from './scenes/Scene5Outro';

export const SafeShipMasterPromo: React.FC = () => {
  const frame = useCurrentFrame();

  // Subtle background music volume curve that ducks smoothly under voiceover
  const bgMusicVolume = (f: number) => {
    return interpolate(
      f,
      [0, 60, 565, 740, 1465, 1840, 2040, 2100],
      [0.18, 0.12, 0.16, 0.12, 0.14, 0.12, 0.2, 0.0],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );
  };

  return (
    <div
      style={{
        width: 1920,
        height: 1080,
        position: 'relative',
        backgroundColor: '#F8F7F4',
        overflow: 'hidden',
      }}
    >
      {/* 1. Primary Voiceover Audio Track (safeshippromo 35.wav) */}
      <Audio src={staticFile('audio/safeshippromo_35.wav')} volume={1.0} />

      {/* 2. Layered Ambient Cinematic Background Music */}
      <Audio src={staticFile('audio/bg-music.mp3')} volume={bgMusicVolume} />

      {/* 3. Scene 1: The Hook (00:00 - 00:09.42 | Frames 0 to 565) */}
      <Sequence
        from={TIMELINE_60FPS.SCENE_1.start}
        durationInFrames={TIMELINE_60FPS.SCENE_1.duration}
        name="Scene 1: The Hook"
      >
        <Scene1Hook />
      </Sequence>

      {/* 4. Scene 2: The Solution / Brand Arrival (00:09.42 - 00:12.30 | Frames 565 to 740) */}
      <Sequence
        from={TIMELINE_60FPS.SCENE_2.start}
        durationInFrames={TIMELINE_60FPS.SCENE_2.duration}
        name="Scene 2: The Solution"
      >
        <Scene2Brand />
      </Sequence>

      {/* 5. Scene 3: The 3-Step Trust Loop (00:12.30 - 00:24.40 | Frames 740 to 1465) */}
      <Sequence
        from={TIMELINE_60FPS.SCENE_3.start}
        durationInFrames={TIMELINE_60FPS.SCENE_3.duration}
        name="Scene 3: The Trust Loop"
      >
        <Scene3TrustLoop />
      </Sequence>

      {/* 6. Scene 4: Dual-Path Settlement (00:24.40 - 00:30.64 | Frames 1465 to 1840) */}
      <Sequence
        from={TIMELINE_60FPS.SCENE_4.start}
        durationInFrames={TIMELINE_60FPS.SCENE_4.duration}
        name="Scene 4: Settlement"
      >
        <Scene4Settlement />
      </Sequence>

      {/* 7. Scene 5: Outro & Call to Action (00:30.64 - 00:35.00 | Frames 1840 to 2100) */}
      <Sequence
        from={TIMELINE_60FPS.SCENE_5.start}
        durationInFrames={TIMELINE_60FPS.SCENE_5.duration}
        name="Scene 5: Outro & CTA"
      >
        <Scene5Outro />
      </Sequence>
    </div>
  );
};
