"use client";

import dynamic from "next/dynamic";
import type { GlobeMarker } from "@/components/ui/3d-globe";

const Globe3D = dynamic(
  () => import("@/components/ui/3d-globe").then((mod) => mod.Globe3D),
  { ssr: false }
);

const sampleMarkers: GlobeMarker[] = [
  { lat: 40.7128, lng: -74.006, src: "https://assets.aceternity.com/avatars/1.webp", label: "New York" },
  { lat: 51.5074, lng: -0.1278, src: "https://assets.aceternity.com/avatars/2.webp", label: "London" },
  { lat: 35.6762, lng: 139.6503, src: "https://assets.aceternity.com/avatars/3.webp", label: "Tokyo" },
  { lat: -33.8688, lng: 151.2093, src: "https://assets.aceternity.com/avatars/4.webp", label: "Sydney" },
  { lat: 48.8566, lng: 2.3522, src: "https://assets.aceternity.com/avatars/5.webp", label: "Paris" },
  { lat: 28.6139, lng: 77.209, src: "https://assets.aceternity.com/avatars/6.webp", label: "New Delhi" },
  { lat: 55.7558, lng: 37.6173, src: "https://assets.aceternity.com/avatars/7.webp", label: "Moscow" },
  { lat: -22.9068, lng: -43.1729, src: "https://assets.aceternity.com/avatars/8.webp", label: "Rio de Janeiro" },
  { lat: 31.2304, lng: 121.4737, src: "https://assets.aceternity.com/avatars/9.webp", label: "Shanghai" },
  { lat: 25.2048, lng: 55.2708, src: "https://assets.aceternity.com/avatars/10.webp", label: "Dubai" },
  { lat: -34.6037, lng: -58.3816, src: "https://assets.aceternity.com/avatars/11.webp", label: "Buenos Aires" },
  { lat: 1.3521, lng: 103.8198, src: "https://assets.aceternity.com/avatars/12.webp", label: "Singapore" },
  { lat: 37.5665, lng: 126.978, src: "https://assets.aceternity.com/avatars/13.webp", label: "Seoul" },
];

export default function Worldwide() {
  return (
    <section className="py-20 bg-[#0047AB]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4 uppercase">
            We Are Worldwide
          </h2>
          <p className="text-white/80 font-bold tracking-[0.15em] text-sm uppercase text-center max-w-2xl mx-auto">
            Trusted by customers across 50+ countries. Experience CLINI WHITE wherever you are.
          </p>
        </div>

        <div className="w-full aspect-[4/3] md:aspect-[16/9] max-h-[600px] mx-auto overflow-hidden">
          <Globe3D
            markers={sampleMarkers}
            config={{
              atmosphereColor: "#4da6ff",
              atmosphereIntensity: 20,
              bumpScale: 5,
              autoRotateSpeed: 0.3,
              showAtmosphere: false,
            }}
            onMarkerClick={(marker) => {
              console.log("Clicked marker:", marker.label);
            }}
            onMarkerHover={(marker) => {
              if (marker) {
                console.log("Hovering:", marker.label);
              }
            }}
          />
        </div>
      </div>
    </section>
  );
}
