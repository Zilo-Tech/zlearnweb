"use client"
export default function TrendingCourse() {


  return (
    <div className='container max-w-7xl mx-auto px-4 pb-20'>
   
      {/* Trending Courses Section */}
      <div className='mt-32'>
        <div className='text-center md:text-start mb-14'>
          <h2 className='capitalize text-4xl md:text-5xl xl:text-7xl font-bold text-gray-900 mb-4'>Trending Courses. Most popular courses this month</h2>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {/* Course Card 1 */}
          <div className='bg-white rounded border border-primary-950 transition-shadow duration-300'>
            <img
              src='https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop'
              alt='Web Development Course'
              className='w-full h-48 object-cover'
            />
            <div className='p-6'>
              <div className='flex items-center gap-2 mb-3'>
                <span className='px-3 py-1 text-sm font-semibold rounded     border'>
                  Development
                </span>
                <span className='text-yellow-500 text-sm '>★  <span className="text-gray-900">4.3</span></span>
              </div>
              <h1 className='text-2xl font-bold text-primary-950 border-t-2 py-4 mt-4 border-primary-950'>
                Complete Web Development Bootcamp
              </h1>
              <p className='text-gray-600 mb-4'>
                Master HTML, CSS, JavaScript, React, and Node.js from scratch
              </p>
              <div className='flex items-center justify-between'>
                <span className='text-2xl font-bold text-gray-900'>$49.99</span>
                <span className='text-sm text-gray-500'>12,543 students</span>
              </div>
            </div>
          </div>

          {/* Course Card 2 */}
          <div className='bg-white rounded border border-primary-950 transition-shadow duration-300'>
            <img
              src='https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=250&fit=crop'
              alt='Data Science Course'
              className='w-full h-48 object-cover'
            />
            <div className='p-6'>
              <div className='flex items-center gap-2 mb-3'>
                <span className='px-3 py-1 bg-green-100 text-green-600 text-sm font-semibold rounded     border'>
                  Data Science
                </span>
                <span className='text-yellow-500 text-sm '>★ <span className="text-gray-900">4.9</span></span>
              </div>
              <h1 className='text-2xl font-bold text-primary-950 border-t-2 py-4 mt-4 border-primary-950'>
                Python for Data Science & Machine Learning
              </h1>
              <p className='text-gray-600 mb-4'>
                Learn Python, pandas, NumPy, and build ML models
              </p>
              <div className='flex items-center justify-between'>
                <span className='text-2xl font-bold text-gray-900'>$59.99</span>
                <span className='text-sm text-gray-500'>9,876 students</span>
              </div>
            </div>
          </div>

          {/* Course Card 3 */}
          <div className='bg-white rounded border border-primary-950 transition-shadow duration-300'>
            <img
              src='https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop'
              alt='UI/UX Design Course'
              className='w-full h-48 object-cover'
            />
            <div className='p-6'>
              <div className='flex items-center gap-2 mb-3'>
                <span className='px-3 py-1 bg-purple-100 text-purple-600 text-sm font-semibold rounded   border'>
                  Design
                </span>
                <span className='text-yellow-500 text-sm '>★  <span className="text-gray-900">4.2</span></span>
              </div>
              <h1 className='text-2xl font-bold text-primary-950 border-t-2 py-4 mt-4 border-primary-950'>
                UI/UX Design Masterclass
              </h1>
              <p className='text-gray-600 mb-4'>
                Design beautiful interfaces with Figma and user research
              </p>
              <div className='flex items-center justify-between'>
                <span className='text-2xl font-bold text-gray-900'>$44.99</span>
                <span className='text-sm text-gray-500'>8,234 students</span>
              </div>
            </div>
          </div>

          {/* Course Card 4 */}
          <div className='bg-white rounded border border-primary-950 transition-shadow duration-300'>
            <img
              src='https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=250&fit=crop'
              alt='Digital Marketing Course'
              className='w-full h-48 object-cover'
            />
            <div className='p-6'>
              <div className='flex items-center gap-2 mb-3'>
                <span className='px-3 py-1 bg-orange-100 text-orange-600 text-sm font-semibold rounded   border'>
                  Marketing
                </span>
                <span className='text-yellow-500 text-sm '>★  <span className="text-gray-900">4.6</span></span>
              </div>
              <h1 className='text-2xl font-bold text-primary-950 border-t-2 py-4 mt-4 border-primary-950'>
                Complete Digital Marketing Course
              </h1>
              <p className='text-gray-600 mb-4'>
                SEO, social media, email marketing, and analytics
              </p>
              <div className='flex items-center justify-between'>
                <span className='text-2xl font-bold text-gray-900'>$39.99</span>
                <span className='text-sm text-gray-500'>11,432 students</span>
              </div>
            </div>
          </div>

          {/* Course Card 5 */}
          <div className='bg-white rounded border border-primary-950 transition-shadow duration-300'>
            <img
              src='https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400&h=250&fit=crop'
              alt='Photography Course'
              className='w-full h-48 object-cover'
            />
            <div className='p-6'>
              <div className='flex items-center gap-2 mb-3'>
                <span className='px-3 py-1 bg-pink-100 text-pink-600 text-sm font-semibold rounded   border'>
                  Photography
                </span>
                <span className='text-yellow-500 text-sm '>★  <span className="text-gray-900">4.8</span></span>
              </div>
              <h1 className='text-2xl font-bold text-primary-950 border-t-2 py-4 mt-4 border-primary-950'>
                Professional Photography Masterclass
              </h1>
              <p className='text-gray-600 mb-4'>
                From beginner to pro: composition, lighting, and editing
              </p>
              <div className='flex items-center justify-between'>
                <span className='text-2xl font-bold text-gray-900'>$54.99</span>
                <span className='text-sm text-gray-500'>7,654 students</span>
              </div>
            </div>
          </div>

          {/* Course Card 6 */}
          <div className='bg-white rounded border border-primary-950 transition-shadow duration-300'>
            <img
              src='https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=250&fit=crop'
              alt='Business Course'
              className='w-full h-48 object-cover'
            />
            <div className='p-6'>
              <div className='flex items-center gap-2 mb-3'>
                <span className='px-3 py-1 bg-red-100 text-red-600 text-sm font-semibold rounded     border'>
                  Business
                </span>
                <span className='text-yellow-500 text-sm '>★  <span className="text-gray-900">4.7</span></span>
              </div>
              <h1 className='text-2xl font-bold text-primary-950 border-t-2 py-4 mt-4 border-primary-950'>
                MBA Essentials: Business Strategy
              </h1>
              <p className='text-gray-600 mb-4'>
                Learn business strategy, finance, and leadership skills
              </p>
              <div className='flex items-center justify-between'>
                <span className='text-2xl font-bold text-gray-900'>$69.99</span>
                <span className='text-sm text-gray-500'>6,789 students</span>
              </div>
            </div>
          </div>
        </div>

        <div className='text-center mt-12'>
          <button className='px-8 py-4 bg-primary-700 text-white font-bold rounded border-4 border-primary-950 hover:bg-primary-800 transition-colors duration-300'>
            View All Courses
          </button>
        </div>
      </div>
    </div>
  )
}