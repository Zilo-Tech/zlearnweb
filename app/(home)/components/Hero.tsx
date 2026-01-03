import React from 'react';
import Link from 'next/link';

const HeroSection: React.FC = () => {
  return (
    <div className="bg-primary-950">
      <div className="container max-w-7xl mx-auto px-6 ">
        <div className="grid md:grid-cols-2  items-center">
          {/* Left Content */}
          <div className="max-w-2xl py-4 md:py-8 order-2 md:order-1">
            <div className="mb-2 md:mb-3">
              <div className="inline-block mb-2">
                <p className="text-lg md:text-2xl font-black text-yellow-500">
                  FREE
                </p>
                <p className="text-xs md:text-sm text-primary-100 font-bold uppercase tracking-wider">
                  Limited Time Offer
                </p>
              </div>
            </div>
            <h1 className="text-[28px] md:text-[52px] font-black text-primary-100 mb-3 md:mb-4 leading-tight max-w-md tracking-tight">
              TRANSFORM YOUR CAREER TODAY
            </h1>
            <p className="text-sm md:text-xl text-white mb-4 md:mb-6 pr-6 hidden md:block max-w-xl  leading-relaxed">
              Join 50,000+ professionals earning more with expert-led courses and recognized certifications.
            </p>
            <div className="flex gap-4 max-w-sm mb-2">
              <Link href="/auth/register" className="w-full">
                <button className="px-8 w-full py-3 md:py-4 bg-primary-500 text-white md:text-lg font-bold rounded hover:bg-[#253F3F] transition">
                  START YOUR SUCCESS NOW
                </button>
              </Link>
            </div>
            <p className="text-xs md:text-sm text-primary-200 font-bold">
              First 10 students only — Act fast!
            </p>
          </div>

          {/* Right Image */}
          <div className="relative order-1 md:order-2 h-full">
            <div className="overflow-hidden h-full ">
              <img
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=600&fit=crop&q=80"
                alt="Students learning together"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;