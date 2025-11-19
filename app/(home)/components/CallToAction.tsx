import React from 'react'

export default function CallToACtion() {
    return (
        <div className='container max-w-7xl mx-auto px-4'>
            {/* Call to Action Section */}
            <div className='bg-gray-50 rounded-3xl overflow-hidden'>
                    <div className='mb-6'>
                            <p className='text-sm text-gray-600 uppercase tracking-wider my-4'>Your Complete Learning Platform</p>
                            <h2 className='text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-8'>
                                Transform Your Career with Industry-Standard Courses and Expert Guidance
                            </h2>
                        </div>
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-20 items-center'>

                    {/* Left Content */}
                    <div className=' flex flex-col justify-center'>
                    

                        <div className='space-y-6 mb-10'>
                            <div className='flex items-start gap-3 border-b border-primary-950 pb-3'>
                                <p className='text-gray-700 text-lg'>Enroll in professional industry-standard career courses made by experts with legally recognized certifications</p>
                            </div>

                            <div className='flex items-start gap-3 border-b border-primary-950 pb-3'>
                                <p className='text-gray-700 text-lg'>Access comprehensive exam preparation materials for major international exams</p>
                            </div>




                        </div>

                        <div className='mb-10'>
                            <button className='px-8 py-4 bg-primary-300 text-primar-950 border-2 capitalize text-xl border-primary-950 font-semibold rounded hover:bg-primaty-800 transition-colors duration-300 inline-flex items-center gap-2'>
                                Get Started Today
                            </button>
                        </div>
                    </div>

                    {/* Right Image */}
                    <div className='relative h-full min-h-[200px]'>
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