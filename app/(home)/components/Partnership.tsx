// components/PartnershipMarquee.tsx
'use client';

import { Icon } from '@iconify/react';

const companies = [
    { name: 'Netflix', icon: 'simple-icons:netflix', color: 'text-red-600' },
    { name: 'Facebook', icon: 'simple-icons:facebook', color: 'text-blue-600' },
    { name: 'Uber', icon: 'simple-icons:uber', color: 'text-gray-900' },
    { name: 'Google', icon: 'simple-icons:google', color: 'text-[#4285F4]' },
    { name: 'Microsoft', icon: 'simple-icons:microsoft', color: 'text-[#0078D4]' },
    { name: 'NVIDIA', icon: 'simple-icons:nvidia', color: 'text-green-600' },
    { name: 'OpenAI', icon: 'simple-icons:openai', color: 'text-[#412991]' },
    { name: 'Dunkin', icon: 'simple-icons:dunkin', color: 'text-[#D52B1E]' },
    { name: 'LG', icon: 'simple-icons:lg', color: 'text-[#A50034]' },
    { name: 'Adidas', icon: 'simple-icons:adidas', color: 'text-black' },
    { name: 'Samsung', icon: 'simple-icons:samsung', color: 'text-[#1428A0]' },
    { name: 'Guinness', icon: 'simple-icons:guinness', color: 'text-[#000000]' },
    { name: 'Toyota', icon: 'simple-icons:toyota', color: 'text-red-600' },
    { name: 'Git', icon: 'simple-icons:git', color: 'text-[#F05032]' },
    { name: 'Palm', icon: 'simple-icons:palm', color: 'text-[#08354A]' },
];

export default function PartnershipMarquee() {
    return (
        <section className="py-10  to-white">
            <div className="">
                <div className="text-center mb-12 text-white bg-primary-950 p-8 mx-4 md:mx-0 rounded-lg md:rounded-none">
                    <div className='container max-w-7xl mx-auto'>
                        <h2 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold  mb-4">
                            Our Trusted Partners
                        </h2>
                        <p className="text-lg md:text-xl  max-w-2xl mx-auto">
                            Collaborating with industry leaders to deliver exceptional learning experiences
                        </p>
                    </div>
                </div>

                {/* First Marquee Row */}
                <div className="relative overflow-hidden mb-6 container max-w-7xl mx-auto">
                    <div className="flex animate-marquee space-x-8 py-6">
                        {[...companies].map((company, index) => (
                            <div
                                key={`first-${company.name}-${index}`}
                                className="flex-shrink-0 flex items-center justify-center p-4 bg-white  border-gray-100 rounded-full"
                            >
                                <Icon
                                    icon={company.icon}
                                    className={`w-12 h-12 ${company.color}`}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Second Marquee Row (Reverse) */}
                <div className="relative overflow-hidden container max-w-7xl mx-auto">
                    <div className="flex animate-marquee-reverse space-x-8 py-6">
                        {[...companies].reverse().map((company, index) => (
                            <div
                                key={`second-${company.name}-${index}`}
                                className="flex-shrink-0 flex items-center justify-center p-4 bg-white  border-gray-100 rounded-full"
                            >
                                <Icon
                                    icon={company.icon}
                                    className={`w-12 h-12 ${company.color}`}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Marquee Animation Styles */}
                <style jsx>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          @keyframes marquee-reverse {
            0% { transform: translateX(-50%); }
            100% { transform: translateX(0); }
          }
          .animate-marquee {
            animation: marquee 40s linear infinite;
          }
          .animate-marquee-reverse {
            animation: marquee-reverse 40s linear infinite;
          }
        `}</style>
            </div>
        </section>
    );
}