'use client';

import { useRef, useEffect } from 'react';

export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const playVideo = () => {
      video.play().catch((err) => {
        console.error('Video play failed:', err);
      });
    };

    playVideo();
    video.addEventListener('loadedmetadata', playVideo);

    return () => {
      video.removeEventListener('loadedmetadata', playVideo);
    };
  }, []);

  return (
    <div className="relative h-[420px] w-full overflow-visible sm:h-[500px] lg:h-[620px]">
      {/* Ambient glow orb behind video */}
      <div
        className="absolute left-1/2 top-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: 'rgba(91, 95, 239, 0.12)',
          filter: 'blur(120px)',
        }}
      />

      {/* Second smaller orb for depth */}
      <div
        className="absolute right-[10%] top-[20%] -z-10 h-[300px] w-[300px] rounded-full"
        style={{
          background: 'rgba(138, 92, 246, 0.08)',
          filter: 'blur(80px)',
        }}
      />

      {/* Video container - bleeds outside, no hard edges */}
      <div
        className="relative -mx-8 h-full w-[calc(100%+4rem)] overflow-hidden sm:-mx-4 sm:w-[calc(100%+2rem)] lg:-mx-0 lg:w-full"
        style={{
          boxShadow: '0 20px 80px rgba(0, 0, 0, 0.08)',
        }}
      >
        {/* Edge fade masks */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#f2f3ff] to-transparent sm:w-24" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#f2f3ff] to-transparent sm:w-24" />
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-16 bg-gradient-to-b from-[#f8f8fc] to-transparent sm:h-24" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-16 bg-gradient-to-t from-[#f2f3ff] to-transparent sm:h-24" />

        {/* Video with ultra subtle zoom */}
        <video
          ref={videoRef}
          src="/hero.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onError={(e) => console.error('Video load error:', e)}
          className="animate-hero-video-zoom absolute inset-0 h-full w-full object-cover"
          style={{
            mixBlendMode: 'normal',
            filter: 'contrast(1.03) saturate(1.02)',
          }}
        />
      </div>
    </div>
  );
}
