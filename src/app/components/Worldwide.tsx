import Image from "next/image";
import { Globe2, Users, ThumbsUp } from "lucide-react";
import { STATS } from "@/lib/siteConfig";

// Customer photos from the reviews gallery, served through the image
// optimizer so each 44px avatar costs a few KB, not the full PNG.
const REVIEW_FACES = [
  "/images/reviews/teeth/1.png",
  "/images/reviews/teeth/2.png",
  "/images/reviews/teeth/3.png",
  "/images/reviews/teeth/5.png",
  "/images/reviews/teeth/7.png",
  "/images/reviews/teeth/9.png",
];

const WORLD_STATS = [
  { icon: Globe2, value: STATS.countries, label: "Countries shipped to", dark: false },
  { icon: Users, value: STATS.customers, label: "Happy customers", dark: true },
  { icon: ThumbsUp, value: STATS.wouldRecommend, label: "Would recommend", dark: false },
];

export default function Worldwide() {
  return (
    <section className="py-16 bg-[#F3F6F9] overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
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
              {REVIEW_FACES.map((face, i) => (
                <Image
                  key={face}
                  src={face}
                  alt=""
                  aria-hidden
                  width={44}
                  height={44}
                  style={{ zIndex: REVIEW_FACES.length - i }}
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

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-3xl mx-auto mt-12">
          {WORLD_STATS.map(({ icon: Icon, value, label, dark }) => (
            <div
              key={label}
              className={`group rounded-2xl px-6 py-8 text-center border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                dark
                  ? "bg-[#231b50] border-[#231b50] hover:shadow-[#231b50]/25"
                  : "bg-white border-violet-100 shadow-sm hover:shadow-violet-100"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-5 transition-colors ${
                  dark
                    ? "bg-white/10"
                    : "bg-[#F5F3FF] group-hover:bg-[#231b50]"
                }`}
              >
                <Icon
                  className={`w-5 h-5 transition-colors ${
                    dark ? "text-[#C4B5FD]" : "text-[#231b50] group-hover:text-white"
                  }`}
                />
              </div>
              <p
                className={`font-display text-3xl font-extrabold leading-none ${
                  dark ? "text-white" : "text-[#231b50]"
                }`}
              >
                {value}
              </p>
              <p
                className={`text-[11px] font-bold uppercase tracking-wider mt-2.5 ${
                  dark ? "text-white/60" : "text-gray-500"
                }`}
              >
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
