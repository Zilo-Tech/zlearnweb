"use client"
import React, { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Icon } from '@iconify/react/dist/iconify.js'
import Link from 'next/link'

export default function Learn() {
    const [currentSlide, setCurrentSlide] = useState(0)

    const slides = [
        {
            title: "Learn at Your Own Pace",
            description: "Flexible courses designed to fit your schedule, anytime.",
            image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop"
        },
        {
            title: "Expert-Led Courses",
            description: "Learn from industry professionals with real-world knowledge.",
            image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&h=400&fit=crop"
        },
        {
            title: "Interactive Learning",
            description: "Hands-on projects and practical exercises to apply your skills.",
            image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop"
        },
        {
            title: "Build Your Portfolio",
            description: "Create projects that showcase your skills to employers.",
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
        <div className='container max-w-7xl mx-auto px-4 py-2 md:py-20'>
            <div>
                <h1 className='capitalize text-4xl md:text-5xl xl:text-7xl text-start md:text-center mb-5 md:mb-16'>
                    Learn new skills when and where you like.
                </h1>
            </div>

            <div className='relative mt-12'>
                <div className='flex flex-col xl:flex-row items-center gap-8 max-w-5xl mx-auto'>
                    {/* Description - Left Side */}
                    <div className='flex-1 space-y-2 md:space-y-5 flex flex-col order-2 md:order-1'>
                        <h2 className='text-2xl md:text-2xl xl:text-4xl font-bold text-gray-900  max-w-md tracking-tight'>
                            {slides[currentSlide].title}
                        </h2>
                        <p className='text-base md:text-lg text-gray-900 max-w-md'>
                            {slides[currentSlide].description}
                        </p>

                      

                        {/* Navigation Buttons */}
                        <div className='flex gap-4 pt-4 w-full'>
                            <button
                                onClick={prevSlide}
                                className='transition-colors'
                                aria-label='Previous slide'
                            >
                                <Icon icon="material-symbols-light:arrow-back" className="size-8" />
                            </button>
                            <button
                                onClick={nextSlide}
                                className='transition-colors'
                                aria-label='Next slide'
                            >
                                <Icon icon="material-symbols-light:arrow-forward" className="size-8" />
                            </button>
                        </div>

                        {/* Slide Indicators */}
                        <div className='flex gap-2'>
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
                        <div className='relative w-[270px] xl:w-[500px] h-[400px] xl:h-[600px] '>
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
                                            className='w-[270px] xl:w-[500px] h-[400px] xl:h-[600px] object-cover  shadow-xl'
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