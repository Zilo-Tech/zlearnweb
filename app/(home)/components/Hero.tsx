import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <div className="bg-primary-950">
      <div className="container max-w-7xl mx-auto px-6 ">
        <div className="grid md:grid-cols-2  items-center">
          {/* Left Content */}
          <div className="max-w-2xl py-2 md:py-20 order-2 md:order-1">
            <h1 className="text-[26px] md:text-[46px] font-bold text-primary-300 mb-6 leading-tight max-w-md mt-4 md:mt-0">
              Unlock Your Potential with Expert-Led  Courses
            </h1>
            <p className="text-sm md:text-lg text-white mb-8 pr-6 hidden md:block max-w-xl">
              Get certified, prepare for major exams, connect with tutors, and receive AI-powered career guidance.
            </p>
            <div className="flex gap-4 max-w-sm">
              <button className="px-6 w-full py-3  bg-primary-500 text-white md:text-lg font-semibold rounded hover:bg-[#253F3F] transition">
                For Business
              </button>
            </div>
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