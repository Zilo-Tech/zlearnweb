import React from 'react';
import { Icon } from '@iconify/react';

const TopCategories: React.FC = () => {
    const categories = [
        {
            icon: 'ion:code-slash',
            title: 'Development',
            courses: '1,200+ courses',
        },
        {
            icon: 'hugeicons:briefcase-08',
            title: 'Business',
            courses: '850+ courses',
        },
        {
            icon: 'streamline-freehand:design-tool-pen-brush-cup',
            title: 'Design',
            courses: '650+ courses',
        },
        {
            icon: 'mdi:marketplace-outline',
            title: 'Marketing',
            courses: '720+ courses',
        },
        {
            icon: 'solar:server-minimalistic-line-duotone',
            title: 'IT & Software',
            courses: '950+ courses',
        },
        {
            icon: 'solar:camera-square-broken',
            title: 'Photography',
            courses: '420+ courses',
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
        <div className="bg-[#F0F5F5] py-16 md:py-20">
            <div className="container max-w-7xl mx-auto px-6">
                <div className="mx-auto">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between md:items-center mb-8">
                        <div className="">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                                Top Categories
                            </h2>
                            <p className="text-lg text-gray-600">
                                Explore our most popular course categories and start learning today
                            </p>
                        </div>
                        <div className=" mt-10 hidden md:block">
                            <button className="px-8 py-3 text-defaut font-bold flex items-center gap-2">
                                <Icon icon="iwwa:add" className='size-6 md:size-8z' /> View All Categories
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
                                        <h3 className="text-xl md:text-4xl font-semibold text-gray-900 ">
                                            {category.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 ml-2">{category.courses}</p>
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