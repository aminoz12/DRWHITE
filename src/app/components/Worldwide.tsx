"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { GlobeMarker } from "@/components/ui/3d-globe";

const Globe3D = dynamic(
  () => import("@/components/ui/3d-globe").then((mod) => mod.Globe3D),
  { ssr: false }
);

// Cities CLINI WHITE ships to — plain markers, no third-party avatars.
const MARKERS: GlobeMarker[] = [
  { lat: 51.5074, lng: -0.1278, label: "London" },
  { lat: 48.8566, lng: 2.3522, label: "Paris" },
  { lat: 52.52, lng: 13.405, label: "Berlin" },
  { lat: 40.4168, lng: -3.7038, label: "Madrid" },
  { lat: 41.9028, lng: 12.4964, label: "Rome" },
  { lat: 52.3676, lng: 4.9041, label: "Amsterdam" },
  { lat: 40.7128, lng: -74.006, label: "New York" },
  { lat: 43.6532, lng: -79.3832, label: "Toronto" },
  { lat: -33.8688, lng: 151.2093, label: "Sydney" },
  { lat: 25.2048, lng: 55.2708, label: "Dubai" },
  { lat: 1.3521, lng: 103.8198, label: "Singapore" },
];

export default function Worldwide() {
  // The 3D globe pulls a ~900 KB three.js chunk — only load it once the
  // section is actually about to enter the viewport.
  const containerRef = useRef<HTMLDivElement>(null);
  const [showGlobe, setShowGlobe] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShowGlobe(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-12 bg-[#F3F6F9]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-[#1A1A1A] tracking-tight mb-4 uppercase">
            We Are <span className="text-[#231b50]">Worldwide</span>
          </h2>
          <p className="text-[#4A4A4A] font-bold tracking-[0.15em] text-sm uppercase text-center max-w-2xl mx-auto">
            Trusted by customers across 50+ countries. Experience CLINI WHITE wherever you are.
          </p>
        </div>

        <div
          ref={containerRef}
          className="w-full aspect-[4/3] md:aspect-[16/9] max-h-[600px] mx-auto overflow-hidden"
        >
          {showGlobe && (
            <Globe3D
              markers={MARKERS}
              config={{
                atmosphereColor: "#4da6ff",
                atmosphereIntensity: 20,
                bumpScale: 5,
                autoRotateSpeed: 0.3,
                showAtmosphere: false,
              }}
            />
          )}
        </div>
      </div>
    </section>
  );
}
