"use client"
import React, { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Icon } from '@iconify/react/dist/iconify.js'
import Link from 'next/link'

export default function Learn() {
    const [currentSlide, setCurrentSlide] = useState(0)

    const slides = [
        {
            title: "Learn on YOUR Schedule — No Excuses",
            description: "Study anywhere, anytime. 24/7 access means you can level up your skills while working full-time. Join thousands who've transformed their careers without quitting their day job.",
            image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop"
        },
        {
            title: "Learn from Million-Dollar Experts",
            description: "Get taught by industry leaders who've built real companies and earned real results. Not theory — proven strategies that actually work in the real world.",
            image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&h=400&fit=crop"
        },
        {
            title: "Build Real Projects That Get You Hired",
            description: "Create portfolio-worthy projects that impress employers. Every course includes hands-on work you can show off — and that's what gets you the job.",
            image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop"
        },
        {
            title: "Get Hired Faster with a Standout Portfolio",
            description: "Stop sending empty resumes. Build a portfolio that makes recruiters call YOU. Our students get 3x more interview requests than average.",
            image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&h=400&fit=crop"
        }
    ]

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length)
    }

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    }

    return (
        <div className='container max-w-7xl mx-auto px-6 md:px-4 py-2 md:py-20'>
            <div>
                <h1 className='capitalize text-4xl md:text-5xl xl:text-7xl font-black text-start md:text-center mb-5 md:mb-16 tracking-tight'>
                    STOP WASTING TIME — START EARNING MORE TODAY
                </h1>
                <p className='text-center text-lg md:text-xl text-gray-600 font-medium max-w-3xl mx-auto mb-8'>
                    Join 50,000+ professionals who've already transformed their careers. Your future self will thank you.
                </p>
            </div>

            <div className='relative mt-12'>
                <div className='flex flex-col md:flex-row items-center justify-center gap-8 max-w-6xl mx-auto'>
                    {/* Description - Left Side */}
                    <div className='flex-1 space-y-2 md:space-y-5 flex flex-col order-2 md:order-1 w-full'>
                        <h1 className='text-2xl md:text-3xl xl:text-5xl font-black text-gray-900  max-w-md tracking-tight leading-tight'>
                            {slides[currentSlide].title}
                        </h1>
                        <p className='text-base md:text-lg text-gray-700 max-w-md font-medium leading-relaxed'>
                            {slides[currentSlide].description}
                        </p>

                      

                        {/* Navigation Buttons */}
                        <div className='flex gap-4 pt-4 w-full'>
                            <button
                                onClick={prevSlide}
                                className='transition-colors p-3 bg-gray-300 rounded-full'
                                aria-label='Previous slide'
                            >
                                <Icon icon="material-symbols-light:arrow-back" className="size-8" />
                            </button>
                            <button
                                onClick={nextSlide}
                                className='transition-colors p-3 bg-gray-300 rounded-full'
                                aria-label='Next slide'
                            >
                                <Icon icon="material-symbols-light:arrow-forward" className="size-8" />
                            </button>
                        </div>

                        {/* Slide Indicators */}
                        <div className='flex gap-2 p-3'>
                            {slides.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentSlide(index)}
                                    className={`h-2 rounded transition-all ${index === currentSlide
                                        ? 'w-8 bg-primary-900'
                                        : 'w-2 bg-gray-300 hover:bg-gray-400'
                                        }`}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Images - Right Side - Stacked */}
                    <div className='flex-1   order-1 md:order-2  w-full'>
                        <div className='relative w-[270px] lg:w-[500px] h-[400px] lg:h-[600px] '>
                            {slides.map((slide, index) => {
                                const offset = index - currentSlide
                                const isVisible = Math.abs(offset) <= 2

                                return isVisible ? (
                                    <div
                                        key={index}
                                        className='absolute transition-all duration-500 ease-out'
                                        style={{
                                            zIndex: slides.length - Math.abs(offset),
                                            transform: `translateX(${offset * 20}px) translateY(${offset * 20}px) scale(${1 - Math.abs(offset) * 0.05})`,
                                            opacity: 1 - Math.abs(offset) * 0.3,
                                        }}
                                    >
                                        <img
                                            src={slide.image}
                                            alt={slide.title}
                                            className='w-[270px] lg:w-[500px] h-[400px] lg:h-[600px] object-cover  shadow-xl'
                                        />
                                    </div>
                                ) : null
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}