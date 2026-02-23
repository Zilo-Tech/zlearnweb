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
                            LEARN FROM EXPERTS WHO GET RESULTS
                        </h2>
                        <p className="text-gray-700 text-xl max-w-2xl leading-relaxed">
                            Instructors who teach our professional courses, curriculum content, and exam prep. Real expertise — from industry and the classroom.
                        </p>
                    </div>
                    <div className="text-center ">
                        <Link href="/app/courses" className="text-default font-bold flex items-center gap-2">
                            <Icon icon="iwwa:add" className='size-6 md:size-7' />
                            <span className="underline text-nowrap">Browse Courses</span>
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
                    <div className="text-base md:text-lg text-gray-700 leading-relaxed">
                        Want to teach on Z-Learn? 
                        <Link href="/contact" className="text-primary-600 font-black underline ml-1 text-xl md:text-2xl xl:text-4xl hover:text-primary-800 transition">
                            Get in touch
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}