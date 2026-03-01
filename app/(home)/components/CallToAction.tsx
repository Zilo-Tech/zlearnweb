import React from 'react'
import Link from 'next/link'

export default function CallToACtion() {
    return (
        <div className='container max-w-7xl mx-auto px-4'>
            {/* Call to Action Section */}
            <div className='bg-gray-50 rounded-3xl overflow-hidden'>
                <div className='mb-6'>
                    <p className='text-sm text-primary-600 uppercase tracking-widest my-4 font-bold'>READY TO START?</p>
                    <h2 className='text-4xl lg:text-6xl font-black text-gray-900 leading-tight mb-8 tracking-tight'>
                        YOUR LEARNING JOURNEY STARTS HERE
                    </h2>
                </div>
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-20 items-center'>

                    {/* Left Content */}
                    <div className=' flex flex-col justify-center'>


                        <div className='space-y-6 mb-10'>
                            <div className='flex items-start gap-3 border-b-2 border-primary-950 pb-4'>
                                <div>
                                    <p className='text-gray-900 text-xl font-bold mb-1'>Professional Courses & Certifications</p>
                                    <p className='text-gray-700 text-base leading-relaxed'>Expert-led courses to level up your career. Track progress, earn XP, and get recognized for what you learn.</p>
                                </div>
                            </div>

                            <div className='flex items-start gap-3 border-b-2 border-primary-950 pb-4'>
                                <div>
                                    <p className='text-gray-900 text-xl font-bold mb-1'>Entrance Exam Prep & Mock Exams</p>
                                    <p className='text-gray-700 text-base leading-relaxed'>Practice with past papers and timed mock exams. Analytics and leaderboards help you see where you stand and improve.</p>
                                </div>
                            </div>

                            <div className='flex items-start gap-3 border-b-2 border-primary-950 pb-4'>
                                <div>
                                    <p className='text-gray-900 text-xl font-bold mb-1'>AI Tutor & Personalized Recommendations</p>
                                    <p className='text-gray-700 text-base leading-relaxed'>Get help when you’re stuck and see what to learn next. Our AI supports your goals — whether career, exams, or school.</p>
                                </div>
                            </div>

                        </div>

                        <div className='mb-10'>
                            <Link href="/auth/register">
                                <button className='px-10 py-5 bg-primary-500 text-white border-2 text-lg md:text-xl border-primary-900 font-black rounded    hover:bg-primary-800 transition-all duration-300 inline-flex items-center gap-2  shadow-xl'>
                                    CLAIM YOUR SPOT NOW
                                </button>
                            </Link>
                            <p className='text-sm text-gray-600 mt-3'>Free to start • No credit card required</p>
                        </div>
                    </div>

                    {/* Right Image */}
                    <div className='hidden md:block relative h-full min-h-[200px]'>
                        <img
                            src='https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=800&fit=crop'
                            alt='Business professionals collaborating'
                            className='absolute inset-0 w-full h-full object-cover'
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}