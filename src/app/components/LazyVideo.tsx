'use client';

import { useEffect, useRef } from 'react';

// Defers the video download until the element nears the viewport, then
// autoplays muted; pauses again when scrolled away. Keeps multi-MB clips
// off the critical path.
//
// Every clip in /public/videos ships with a same-named .webp poster frame, so
// the tile shows a real still instead of a black box while the clip loads.
export default function LazyVideo({ src, className }: { src: string; className?: string }) {
  const poster = src.replace(/\.mp4$/, '.webp');
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (!video.src) video.src = src;
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        }
      },
      { rootMargin: '200px' }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [src]);

  return <video ref={ref} muted loop playsInline preload="none" poster={poster} className={className} />;
}
