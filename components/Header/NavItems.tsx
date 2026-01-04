import React, { useState } from 'react';
import { Icon } from '@iconify/react';

// Mock components - replace with your actual imports
const Logo = () => <div className="font-bold text-xl text-white">Logo</div>;
const ModalSearch = () => <Icon icon="ion:search" className="text-white text-xl cursor-pointer" />;
const ActionButton = () => (
  <div className="flex gap-3">
    <button className="px-4 py-2 text-white border border-white rounded hover:bg-white hover:text-default transition text-sm">Sign In</button>
    <button className="px-4 py-2 bg-white text-default rounded hover:bg-gray-100 transition">Sign Up</button>
  </div>
);

// NavItems Component
function NavItems({ isMobile = false, onClose = () => {} }) {
  const [isExploreOpen, setIsExploreOpen] = useState(false);

  const exploreByGoal = [
    'Learn AI',
    'Launch a new career',
    'Prepare for a certification',
    'Practice with Role Play',
  ];

  const aiCategories = [
    'AI Fundamentals',
    'AI For Professionals',
    'AI For Developers',
    'AI For Creatives',
  ];

  const categories = [
    'Development',
    'Business',
    'Finance & Accounting',
    'IT & Software',
    'Office Productivity',
    'Personal Development',
    'Design',
    'Marketing',
    'Lifestyle',
    'Photography & Video',
    'Health & Fitness',
    'Music',
    'Teaching & Academics',
  ];

  if (isMobile) {
    return (
      <div className="flex flex-col space-y-4 text-gray-800">
        {/* Explore Section */}
        <div>
          <button 
            onClick={() => setIsExploreOpen(!isExploreOpen)}
            className="flex items-center justify-between w-full py-3 px-4 hover:bg-primary-100 text-[14.8px] rounded transition"
          >
            <span className="font-semibold ">Explore</span>
            <Icon 
              icon={isExploreOpen ? "ion:chevron-up" : "ion:chevron-down"} 
              className="text-lg" 
            />
          </button>
          
          {isExploreOpen && (
            <div className="pl-4 mt-2 space-y-2">
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-gray-500 mb-2 px-4">Explore by Goal</h4>
                {exploreByGoal.map((goal, index) => (
                  <a key={index} href="#" className="block py-2 px-4 hover:bg-primary-100 text-[14.8px] rounded" onClick={onClose}>
                    {goal}
                  </a>
                ))}
              </div>
              
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-gray-500 mb-2 px-4">AI Categories</h4>
                {aiCategories.map((category, index) => (
                  <a key={index} href="#" className="block py-2 px-4 hover:bg-primary-100 text-[14.8px] rounded" onClick={onClose}>
                    {category}
                  </a>
                ))}
              </div>
              
              <div>
                <h4 className="text-xs font-semibold text-gray-500 mb-2 px-4">All Categories</h4>
                {categories.map((category, index) => (
                  <a key={index} href="#" className="block py-2 px-4 hover:bg-primary-100 text-[14.8px] rounded" onClick={onClose}>
                    {category}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Other Nav Items */}
        <a href="#" className="py-3 px-4 hover:bg-primary-100 text-[14.8px] rounded transition" onClick={onClose}>Book a Tutor</a>
        <a href="#" className="py-3 px-4 hover:bg-primary-100 text-[14.8px] rounded transition" onClick={onClose}>Become a Tutor</a>
        <a href="#" className="py-3 px-4 hover:bg-primary-100 text-[14.8px] rounded transition" onClick={onClose}>Our Programs</a>
        <a href="#" className="py-3 px-4 hover:bg-primary-100 text-[14.8px] rounded transition" onClick={onClose}>Download</a>
        <a href="#" className="py-3 px-4 hover:bg-primary-100 text-[14.8px] rounded transition" onClick={onClose}>Plan & Pricing</a>
        <a href="#" className="py-3 px-4 hover:bg-primary-100 text-[14.8px] rounded transition" onClick={onClose}>Contact Us</a>
        
        {/* Mobile Action Buttons */}
        <div className="pt-4 border-t border-gray-200 space-y-3">
          <a href="/auth/register" className="w-full py-3 px-4 text-default border-2 border-default rounded-lg font-semibold hover:bg-primary-100 text-[14.8px] transition">
            Sign In
          </a>
          <a href="/auth/login" className="w-full py-3 px-4 bg-default text-white rounded-lg font-semibold hover:bg-[#3A5F5F] transition">
            Sign Up
          </a>
        </div>
      </div>
    );
  }

  // Desktop Nav (original)
  return (
    <div>
      <ul className='flex gap-8 text-[16.7px]'>
        <li 
          className='relative cursor-pointer'
          onMouseEnter={() => setIsExploreOpen(true)}
          onMouseLeave={() => setIsExploreOpen(false)}
        >
          <span className='flex items-center gap-1 text-white font-semibold hover:text-default transition text-[14.8px]'>
            Explore
            <Icon icon="ion:chevron-down" className="text-sm" />
          </span>
          
          {isExploreOpen && (
            <div className='absolute top-full left-0 mt-2 bg-white shadow-2xl rounded-lg border border-gray-200 w-[600px] z-50 flex'>
              <div className='flex-1 p-6 border-r border-gray-200'>
                <div className='mb-6'>
                  <h3 className='text-[14.8px] font-semibold text-gray-500 mb-3'>Explore by Goal</h3>
                  <ul className='space-y-2'>
                    {exploreByGoal.map((goal, index) => (
                      <li key={index}>
                        <a href="#" className='flex items-center justify-between py-2 px-3 hover:bg-primary-100 text-[14.8px] rounded transition group'>
                          <span className='text-gray-700 group-hover:text-default'>{goal}</span>
                          <Icon icon="ion:chevron-forward" className="text-gray-400 group-hover:text-default" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className='border-t border-gray-200 pt-4'>
                  <ul className='space-y-2'>
                    {categories.map((category, index) => (
                      <li key={index}>
                        <a href="#" className='flex items-center justify-between py-2 px-3 hover:bg-primary-100 text-[14.8px] rounded transition group'>
                          <span className='text-gray-700 group-hover:text-default'>{category}</span>
                          <Icon icon="ion:chevron-forward" className="text-gray-400 group-hover:text-default" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className='w-64 p-6 bg-gray-50'>
                <ul className='space-y-2'>
                  {aiCategories.map((category, index) => (
                    <li key={index}>
                      <a href="#" className='flex items-center justify-between py-2 px-3 hover:bg-white rounded transition group text-sm'>
                        <span className='text-gray-700 group-hover:text-default'>{category}</span>
                        <Icon icon="ion:chevron-forward" className="text-gray-400 group-hover:text-default" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </li>
        <li className='cursor-pointer hover:text-default transition text-[14.8px] font-semibold text-white'>Book a Tutor</li>
        <li className='cursor-pointer hover:text-default transition text-[14.8px] font-semibold text-white'>Become a Tutor</li>
        <li className='cursor-pointer hover:text-default transition text-[14.8px] font-semibold text-white'>Our Programs</li>
        <li className='cursor-pointer hover:text-default transition text-[14.8px] font-semibold text-white'>Download</li>
        <li className='cursor-pointer hover:text-default transition text-[14.8px] font-semibold text-white'>Plan & Pricing</li>
        <li className='cursor-pointer hover:text-default transition text-[14.8px] font-semibold text-white'>Contact Us</li>
      </ul>
    </div>
  );
}

export default NavItems