"use client"
import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function TrendingCourse() {
  const [currentIndex, setCurrentIndex] = useState(0)
  // Guard initial value to avoid referencing `window` during SSR
  const [isMobile, setIsMobile] = useState(() => (typeof window !== 'undefined' ? window.innerWidth < 768 : false))

  // Detect screen size on the client only
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const courses = [
    {
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop',
      alt: 'Web Development Course',
      category: 'Development',
      categoryColor: 'bg-blue-100 text-blue-600',
      rating: 4.3,
      title: 'Complete Web Development Bootcamp',
      description: 'Master HTML, CSS, JavaScript, React, and Node.js from scratch',
      price: 'Free',
      students: '12,543 students'
    },
    {
      image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=250&fit=crop',
      alt: 'Data Science Course',
      category: 'Data Science',
      categoryColor: 'bg-green-100 text-green-600',
      rating: 4.9,
      title: 'Python for Data Science & Machine Learning',
      description: 'Learn Python, pandas, NumPy, and build ML models',
      price: 'Free',
      students: '9,876 students'
    },
    {
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop',
      alt: 'UI/UX Design Course',
      category: 'Design',
      categoryColor: 'bg-purple-100 text-purple-600',
      rating: 4.2,
      title: 'UI/UX Design Masterclass',
      description: 'Design beautiful interfaces with Figma and user research',
      price: 'Free',
      students: '8,234 students'
    },
    {
      image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=250&fit=crop',
      alt: 'Digital Marketing Course',
      category: 'Marketing',
      categoryColor: 'bg-orange-100 text-orange-600',
      rating: 4.6,
      title: 'Complete Digital Marketing Course',
      description: 'SEO, social media, email marketing, and analytics',
      price: 'Free',
      students: '11,432 students'
    },
    {
      image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400&h=250&fit=crop',
      alt: 'Photography Course',
      category: 'Photography',
      categoryColor: 'bg-pink-100 text-pink-600',
      rating: 4.8,
      title: 'Professional Photography Masterclass',
      description: 'From beginner to pro: composition, lighting, and editing',
      price: 'Free',
      students: '7,654 students'
    },
    {
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=250&fit=crop',
      alt: 'Business Course',
      category: 'Business',
      categoryColor: 'bg-red-100 text-red-600',
      rating: 4.7,
      title: 'MBA Essentials: Business Strategy',
      description: 'Learn business strategy, finance, and leadership skills',
      price: 'Free',
      students: '6,789 students'
    }
  ]

  const nextSlide = () => {
    const maxIndex = isMobile ? courses.length - 1 : courses.length - 3
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0))
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  return (
    <div className='container max-w-7xl mx-auto px-4 pb-20'>
      <div className='mt-32'>
        <div className='text-center md:text-start mb-14'>
          <p className='text-sm text-primary-600 uppercase tracking-widest mb-3 font-bold'>🔥HOT THIS MONTH</p>
          <h2 className='capitalize text-4xl md:text-5xl xl:text-7xl font-black text-gray-900 mb-4 tracking-tight'>
            THE COURSES THAT ARE GETTING PEOPLE HIRED RIGHT NOW
          </h2>
          <p className='text-lg text-gray-600  max-w-2xl mt-4'>
            Join 12,000+ students who enrolled this month. These are the skills employers are hiring for TODAY.
          </p>
        </div>

        <div className='relative'>
          {/* Carousel Container */}
          <div className='overflow-hidden'>
            <div 
              className='flex transition-transform duration-500 ease-out'
              style={{ 
                transform: isMobile 
                  ? `translateX(-${currentIndex * 100}%)` 
                  : `translateX(-${currentIndex * (100 / 3)}%)`
              }}
            >
              {courses.map((course, index: number) => (
                <div key={index} className='min-w-full md:min-w-[33.333%] px-2 md:px-4'>
                  <div className='bg-white rounded border border-gray-900 transition-shadow duration-300 h-full'>
                    <img
                      src={course.image}
                      alt={course.alt}
                      className='w-full h-48 object-cover'
                    />
                    <div className='p-6'>
                      <div className='flex items-center gap-2 mb-3'>
                        <span className={`px-3 py-1 text-xs md:text-sm font-semibold rounded border ${course.categoryColor}`}>
                          {course.category}
                        </span>
                        <span className='text-yellow-500 text-xs md:text-sm'>
                          ★ <span className="text-gray-900">{course.rating}</span>
                        </span>
                      </div>
                      <h1 className='text-lg md:text-xl font-black text-gray-900 border-t-2 py-4 mt-4 border-gray-900'>
                        {course.title}
                      </h1>
                      <p className='text-gray-700 mb-4 text-sm '>
                        {course.description}
                      </p>
                      <div className='flex items-center justify-between'>
                        <div>
                          <span className='text-xl md:text-2xl font-black text-gray-900'>{course.price}</span>
                          {/* <span className='text-xs md:text-sm text-gray-500 line-through ml-2'>$199.99</span> */}
                        </div>
                        <span className='text-xs md:text-sm text-primary-600 font-bold'>{course.students} enrolled</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className='absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10'
            aria-label='Previous course'
          >
            <ChevronLeft className='w-6 h-6 text-gray-900' />
          </button>
          
          <button
            onClick={nextSlide}
            className='absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10'
            aria-label='Next course'
          >
            <ChevronRight className='w-6 h-6 text-gray-900' />
          </button>

          {/* Dots Indicator */}
          <div className='flex justify-center gap-2 mt-8'>
            {(isMobile ? courses : courses.slice(0, courses.length - 2)).map((_, index: number) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentIndex === index 
                    ? 'bg-gray-900 w-8' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <div className='text-center mt-12'>
          <button className='px-10 py-5 text-base md:text-lg bg-primary-500 text-white font-black rounded border-2 border-primary-900 hover:bg-primary-800 transition-all duration-300 transform hover:scale-105 shadow-xl'>
            SEE ALL COURSES & START LEARNING 
          </button>
          <p className='text-sm text-gray-600 mt-4 '>Pro Tip: Enroll in 3+ courses and save 40%</p>
        </div>
      </div>
    </div>
  )
}