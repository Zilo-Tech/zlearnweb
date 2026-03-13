'use client';

import React from 'react';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const TopCategories: React.FC = () => {
    const router = useRouter();
    
    const categories = [
        {
            icon: 'ion:school',
            title: 'Academic Curriculum',
            courses: 'School-aligned learning',
            link: '/auth/register',
            requiresAuth: true,
        },
        {
            icon: 'hugeicons:briefcase-08',
            title: 'Professional Courses',
            courses: 'Career-focused skills',
            link: '/auth/register',
            requiresAuth: true,
        },
        {
            icon: 'ion:document-text',
            title: 'Exam Preparation',
            courses: 'Mock exams & past papers',
            link: '/auth/register',
            requiresAuth: true,
        },
        {
            icon: 'ion:code-slash',
            title: 'Development & Tech',
            courses: 'Coding & software',
            link: '/auth/register',
            requiresAuth: true,
        },
        {
            icon: 'mdi:account-group',
            title: 'Community & Study Groups',
            courses: 'Learn together',
            link: '/auth/register',
            requiresAuth: true,
        },
        {
            icon: 'ion:sparkles',
            title: 'AI Tutor & Personalization',
            courses: 'Smart recommendations',
            link: '/auth/register',
            requiresAuth: true,
        },
    ];

    const handleViewAll = () => {
        router.push('/auth/register');
    };

    return (
        <div className="py-16 md:py-20 dark:bg-black">
            <div className="container max-w-7xl mx-auto px-6">
                <div className="mx-auto">
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
                        <div className="mt-10 hidden md:block">
                            <button 
                                onClick={handleViewAll}
                                className="px-8 py-3 text-gray-900 font-bold flex items-center gap-2 hover:text-primary-600 transition-colors"
                            >
                                <Icon icon="iwwa:add" className='size-6 md:size-8' /> View All Categories
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                        {categories.map((category, index) => (
                            <Link
                                key={index}
                                href={category.link}
                                className="md:rounded p-6 cursor-pointer group border-b-2 md:border-2 border-gray-200 hover:border-primary-500 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="rounded-lg flex items-center justify-center text-2xl transition group-hover:scale-110">
                                        <Icon icon={category.icon} className='size-10 md:size-12 text-gray-700 group-hover:text-primary-600 transition-colors' />
                                    </div>
                                    <div>
                                        <h3 className="text-xl md:text-4xl font-black text-gray-900 tracking-tight group-hover:text-primary-700 transition-colors">
                                            {category.title}
                                        </h3>
                                        <p className="text-sm text-gray-700 font-semibold">{category.courses}</p>
                                        <p className="text-xs text-primary-600 mt-1 font-bold group-hover:underline">Start Learning →</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className="mt-10 md:hidden">
                        <button 
                            onClick={handleViewAll}
                            className="text-gray-900 font-bold flex items-center gap-2 hover:text-primary-600 transition-colors"
                        >
                            <Icon icon="iwwa:add" className='size-6 md:size-8' /> View All Categories
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopCategories;