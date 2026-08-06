"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { STATS } from "@/lib/siteConfig";
import type { GlobeMarker } from "@/components/ui/3d-globe";

const Globe3D = dynamic(
  () => import("@/components/ui/3d-globe").then((mod) => mod.Globe3D),
  { ssr: false }
);

// Illustrated people avatars (self-hosted, ~7KB each) — generic icons, so
// they never imply a specific real customer.
const AVATARS = Array.from({ length: 8 }, (_, i) => `/images/avatars/person-${i + 1}.png`);

// Cities CLINI WHITE ships to, each marked by a person icon.
const MARKERS: GlobeMarker[] = [
  { lat: 51.5074, lng: -0.1278, label: "London", src: AVATARS[0], size: 26 },
  { lat: 48.8566, lng: 2.3522, label: "Paris", src: AVATARS[1], size: 22 },
  { lat: 52.52, lng: 13.405, label: "Berlin", src: AVATARS[2], size: 22 },
  { lat: 40.4168, lng: -3.7038, label: "Madrid", src: AVATARS[3], size: 20 },
  { lat: 41.9028, lng: 12.4964, label: "Rome", src: AVATARS[4], size: 20 },
  { lat: 52.3676, lng: 4.9041, label: "Amsterdam", src: AVATARS[5], size: 20 },
  { lat: 40.7128, lng: -74.006, label: "New York", src: AVATARS[6], size: 26 },
  { lat: 43.6532, lng: -79.3832, label: "Toronto", src: AVATARS[7], size: 20 },
  { lat: -33.8688, lng: 151.2093, label: "Sydney", src: AVATARS[2], size: 22 },
  { lat: 25.2048, lng: 55.2708, label: "Dubai", src: AVATARS[4], size: 20 },
  { lat: 1.3521, lng: 103.8198, label: "Singapore", src: AVATARS[1], size: 20 },
];

const WORLD_STATS = [
  { value: STATS.countries, label: "Countries shipped to" },
  { value: STATS.customers, label: "Happy customers" },
  { value: STATS.wouldRecommend, label: "Would recommend" },
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
    <section className="py-16 bg-[#F3F6F9] overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-[#231b50] text-xs font-black tracking-[0.3em] uppercase mb-4">
            GLOBAL COMMUNITY
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-[#1A1A1A] tracking-tight mb-4 uppercase">
            We Are <span className="text-[#231b50]">Worldwide</span>
          </h2>
          <p className="text-gray-600 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Trusted by customers across {STATS.countries} countries. Experience CLINI WHITE
            wherever you are.
          </p>

          {/* Customer avatar stack + rating */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-8">
            <div className="flex -space-x-3">
              {AVATARS.slice(0, 6).map((avatar, i) => (
                <Image
                  key={avatar}
                  src={avatar}
                  alt=""
                  aria-hidden
                  width={44}
                  height={44}
                  style={{ zIndex: 6 - i }}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-white shadow-sm relative"
                />
              ))}
            </div>
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-0.5" aria-hidden>
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width={14} height={14} viewBox="0 0 24 24" className="text-[#231b50]">
                    <path fill="currentColor" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
              <p className="text-xs text-gray-600 font-bold mt-1">
                Rated {STATS.ratingLabel} by {STATS.customers} customers worldwide
              </p>
            </div>
          </div>
        </div>

        <div
          ref={containerRef}
          className="w-full aspect-[4/3] md:aspect-[16/9] max-h-[560px] mx-auto overflow-hidden"
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

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto mt-10">
          {WORLD_STATS.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl border border-violet-100 px-6 py-5 text-center shadow-sm"
            >
              <p className="font-display text-2xl font-extrabold text-[#231b50] leading-none">
                {stat.value}
              </p>
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mt-2">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
