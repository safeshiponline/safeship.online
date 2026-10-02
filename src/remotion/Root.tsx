import React from 'react';
import { Composition } from 'remotion';
import { SafeShipPromo } from './SafeShipPromo';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* 
        SafeShip 60-Second Master Promo Video
        1080p @ 30 FPS = 1860 Frames (~62 seconds matching audio duration)
      */}
      <Composition
        id="SafeShipPromo"
        component={SafeShipPromo}
        durationInFrames={1860}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
