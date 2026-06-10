import Image from 'next/image';

const features = [
  {
    number: '01',
    title: 'POWERFUL AND PEROXIDE-FREE',
    description: 'Our strips use PAP to target surface stains head-on. No peroxide, no trade-offs. Just a formula that gets to work in 30 minutes flat.',
    image: '/why-1.jpg',
  },
  {
    number: '02',
    title: 'RIDICULOUSLY EASY',
    description: 'One strip. 30 minutes. Done. Wear them while you get ready, on your commute, or doing absolutely nothing. The easiest thing you\'ll do for yourself all week.',
    image: '/why-2.jpg',
  },
  {
    number: '03',
    title: 'QUALITY THAT\'S NOT NEGOTIABLE',
    description: 'Every batch produced in GMP-certified, FDA-registered facilities. We\'d rather over-invest in quality than cut a single corner.',
    image: '/why-3.jpg',
  },
];

export default function WhyItWorks() {
  return (
    <section className="py-12 bg-[#F0F4F8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-[#1A1A1A] text-xs font-black tracking-[0.3em] uppercase mb-4">
            SCIENCE & RESULTS
          </p>
          <h2 
            className="text-4xl md:text-5xl font-black text-[#1A1A1A] leading-none uppercase tracking-tighter"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            WHY IT <span className="text-[#0047AB]">WORKS</span>
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {features.map((feature) => (
            <div key={feature.number}>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-sm font-medium text-[#1A1A1A] shrink-0">
                  {feature.number}
                </span>
                <h3 
                  className="text-sm font-bold text-[#1A1A1A] uppercase tracking-wide"
                  style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                >
                  {feature.title}
                </h3>
              </div>
              <p className="text-sm text-[#4A4A4A] leading-relaxed mb-4">
                {feature.description}
              </p>
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
                <Image
                  src={feature.image}
                  alt={feature.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
