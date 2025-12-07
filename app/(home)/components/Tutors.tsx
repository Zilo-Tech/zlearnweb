// components/HomeTutorsSection.tsx

import { topTutors } from "@/components/Tutors/data";
import TutorCard from "@/components/Tutors/TutorCard";
import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";

export default function HomeTutorsSection() {
    return (
        <section className="py-12 bg-white">
            <div className="container max-w-7xl  mx-auto px-4">
            <p className='text-sm text-primary-600 uppercase tracking-widest mb-2 font-bold'>EXPERT INSTRUCTORS</p>

                {/* Section Header */}
                <div className="flex flex-col gap-4 md:flex-row justify-between items-start mb-12">
                    <div className="">
                        <h2 className="text-3xl md:text-4xl xl:text-6xl font-black text-gray-900 mb-2 tracking-tight">
                            LEARN FROM THE BEST IN THE BUSINESS
                        </h2>
                        <p className="text-gray-700 text-xl font-medium max-w-2xl">
                            Get mentored by industry leaders who've built real companies and earned real results. These aren't just teachers — they're proven professionals.
                        </p>
                    </div>
                    <div className="text-center ">
                        <Link href="/#" className="text-default font-bold flex items-center gap-2">
                            <Icon icon="iwwa:add" className='size-6 md:size-7 ' />
                            <span className="underline text-nowrap">View All Tutors</span>
                        </Link>
                    </div>
                </div>

                {/* Tutors Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {topTutors.map((tutor) => (
                        <TutorCard key={tutor.id} tutor={tutor} />
                    ))}
                </div>

                {/* Optional View All Button */}
                <div className="text-center mt-8">
                    <div className=" font-medium text-base md:text-lg text-gray-700">
                        Ready to share your expertise and earn while teaching? 
                        <Link href="/#" className="text-primary-600 font-black underline ml-1 text-xl md:text-2xl xl:text-4xl hover:text-primary-800 transition">
                            Become a Tutor & Start Earning 
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}