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
    <section className="py-16 bg-[#F0F4F8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 
          className="text-3xl md:text-4xl font-bold text-center text-[#1A1A1A] mb-12 tracking-tight"
          style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif' }}
        >
          WHY IT WORKS
        </h2>
        
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
