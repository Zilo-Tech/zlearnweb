import React from 'react';
import { Icon } from '@iconify/react';

const TopCategories: React.FC = () => {
    const categories = [
        {
            icon: 'ion:school',
            title: 'Academic Curriculum',
            courses: 'School-aligned learning',
        },
        {
            icon: 'hugeicons:briefcase-08',
            title: 'Professional Courses',
            courses: 'Career-focused skills',
        },
        {
            icon: 'ion:document-text',
            title: 'Exam Preparation',
            courses: 'Mock exams & past papers',
        },
        {
            icon: 'ion:code-slash',
            title: 'Development & Tech',
            courses: 'Coding & software',
        },
        {
            icon: 'mdi:account-group',
            title: 'Community & Study Groups',
            courses: 'Learn together',
        },
        {
            icon: 'ion:sparkles',
            title: 'AI Tutor & Personalization',
            courses: 'Smart recommendations',
        },
        // {
        //     icon: 'clarity:music-note-line',
        //     title: 'Music',
        //     courses: '380+ courses',
        // },
        // {
        //     icon: 'mage:health-square',
        //     title: 'Health & Fitness',
        //     courses: '540+ courses',
        // }
    ];

    return (
        <div className=" py-16 md:py-20 dark:bg-black">
            <div className="container max-w-7xl mx-auto px-6">
                <div className="mx-auto">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between md:items-center mb-8">
                        <div className="">
                            <p className='text-sm text-primary-600 uppercase tracking-widest mb-2 font-bold'>START HERE</p>
                            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 tracking-tight">
                                CHOOSE YOUR PATH
                            </h2>
                            <p className="text-lg text-gray-700 max-w-2xl leading-relaxed">
                                Academic curriculum, professional courses, exam prep, and more. One platform for every learning goal.
                            </p>
                        </div>
                        <div className=" mt-10 hidden md:block">
                            <button className="px-8 py-3 text-defaut font-bold flex items-center gap-2">
                                <Icon icon="iwwa:add" className='size-6 md:size-8' /> View All Categories
                            </button>
                        </div>
                    </div>
                    {/* Categories Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                        {categories.map((category, index) => (
                            <div
                                key={index}
                                className=" md:rounded p-6 cursor-pointer group border-b-2 md:border-2"
                            >
                                <div className="flex items-start gap-4">
                                    <div className={` rounded-lg flex items-center justify-center text-2xl   transition`}>
                                        <Icon icon={category.icon} className='size-10 md:size-12' />
                                    </div>
                                    <div>
                                        <h3 className="text-xl md:text-4xl font-black text-gray-900 tracking-tight">
                                            {category.title}
                                        </h3>
                                        <p className="text-sm text-gray-700 font-semibold">{category.courses}</p>
                                        <p className="text-xs text-primary-600  mt-1 font-bold">Start Learning</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* View All Button */}
                    <div className=" mt-10 md:hidden">
                        <button className=" text-defaut font-bold flex items-center gap-2 ">
                            <Icon icon="iwwa:add" className='size-6 md:size-8' /> View All Categories
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopCategories;