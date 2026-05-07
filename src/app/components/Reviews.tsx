'use client';

import { Star, User } from 'lucide-react';

const reviews = [
  {
    id: 1,
    author: "Ruby P",
    text: "So easy to use and actually enjoyable. The taste is mild and fresh, which makes me want to stick with it.",
    time: "2 WEEKS AGO",
    beforeImg: "/images/reviews/before1.png",
    afterImg: "/images/reviews/after1.png",
  },
  {
    id: 2,
    author: "James L",
    text: "No pain or tingling, which is rare for whitening. Definitely gentle.",
    time: "1 WEEK AGO",
    beforeImg: "/images/reviews/before2.png",
    afterImg: "/images/reviews/after2.png",
  },
  {
    id: 3,
    author: "Grace F",
    text: "No sensitivity at all and my smile looks great. Definitely something I'll recommend to friends.",
    time: "2 WEEKS AGO",
    beforeImg: "/images/reviews/before1.png",
    afterImg: "/images/reviews/after1.png",
  },
  {
    id: 4,
    author: "Emily C",
    product: "WHITENING STRIPS",
    text: "I was skeptical, but results showed fast. I drink coffee daily and had zero sensitivity. Strips stay put and peel off clean. Feels like a smart buy.",
    time: "3 WEEKS AGO",
    tags: ["NO SENSITIVITY", "EASY TO USE", "FAST RESULTS"],
    beforeImg: "/images/reviews/before2.png",
    afterImg: "/images/reviews/after2.png",
  },
];

export default function Reviews() {
  return (
    <section className="py-20 bg-[#f4f7f9]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-[#0d4a8c] font-bold tracking-[0.15em] text-sm uppercase mb-4">
            Don't take our word for it
          </p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-black tracking-tight mb-4 uppercase">
            WHAT 5,600+ CUSTOMERS ARE SAYING
          </h2>
          <p className="text-[#0d4a8c] font-bold tracking-[0.15em] text-sm uppercase text-center mb-10 max-w-2xl mx-auto">
            Real reviews. Real photos. See what DR.WHITE customers have to say about their experience.
          </p>

          <div className="flex justify-center items-center gap-16">
            <div className="flex flex-col items-center">
              <span className="text-4xl font-extrabold text-black mb-1">5,642+</span>
              <span className="text-xs font-semibold text-gray-400 tracking-wider">VERIFIED REVIEWS</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-4xl font-extrabold text-black mb-1">4.4</span>
              <span className="text-xs font-semibold text-gray-400 tracking-wider">AVERAGE RATING</span>
            </div>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 flex flex-col">
              <div className="flex flex-col">
                <div className="relative h-32 w-full">
                  <img src={review.beforeImg} alt="Before" className="w-full h-full object-cover" />
                  <span className="absolute top-2 left-3 text-white font-bold drop-shadow-md text-sm">Before</span>
                </div>
                <div className="relative h-32 w-full border-t-2 border-white">
                  <img src={review.afterImg} alt="After" className="w-full h-full object-cover" />
                  <span className="absolute top-2 left-3 text-white font-bold drop-shadow-md text-sm">After</span>
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#0d4a8c] rounded-full flex items-center justify-center text-white shrink-0">
                    <User className="w-6 h-6 fill-current" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-gray-900">{review.author}</p>
                    {review.product && (
                      <p className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mt-0.5">{review.product}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex text-[#0d4a8c] mb-4 gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  {review.text}
                </p>
                
                <div className="mt-auto">
                  <p className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-4">
                    {review.time}
                  </p>
                  
                  {review.tags && (
                    <div className="flex flex-wrap gap-2">
                      {review.tags.map((tag, i) => (
                        <span key={i} className="bg-[#f4f7f9] text-[#6b7b8c] text-[10px] font-bold px-2 py-1 rounded tracking-wider uppercase">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
