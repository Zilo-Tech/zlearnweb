// components/HomeTutorsSection.tsx

import { topTutors } from "@/components/Tutors/data";
import TutorCard from "@/components/Tutors/TutorCard";
import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";

export default function HomeTutorsSection() {
    return (
        <section className="py-12 bg-white">
            <div className="container max-w-7xl  mx-auto px-4">
                {/* Section Header */}
                <div className="flex flex-col gap-4 md:flex-row justify-between items-start mb-12">
                    <div className="">
                        <h2 className="text-3xl md:text-4xl xl:text-6xl font-bold text-gray-900 mb-2">
                            Our Top Tutors
                        </h2>
                        <p className="text-gray-600 text-xl">
                            Learn from our most experienced educators
                        </p>
                    </div>
                    <div className="text-center ">
                        <Link href="/#" className="text-default font-bold flex items-center gap-2">
                            <Icon icon="iwwa:add" className='size-6 md:size-7 ' />
                            <span className="underline">View All Tutors</span>
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
                    <div className=" font-medium">
                        Want to help people learn, grow and achieve more in life? 
                        <Link href="/#" className="text-primary-900 font-bold underline ml-1">
                            Become a Tutor
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}