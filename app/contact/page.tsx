"use client"
import { Icon } from "@iconify/react/dist/iconify.js"
import { useState } from "react"

// Contact Page Component
function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    })

    const handleSubmit = () => {
        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            alert('Please fill in all fields')
            return
        }
        console.log('Form submitted:', formData)
        alert('Thank you for your message! We will get back to you soon.')
        setFormData({ name: '', email: '', subject: '', message: '' })
    }

    const handleChange = (e: any) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const contactInfo = [
        {
            icon: "material-symbols-light:mail-outline",
            title: "Email Us",
            info: "support@example.com",
            link: "mailto:support@example.com"
        },
        {
            icon: "material-symbols-light:call-outline",
            title: "Call Us",
            info: "+1 (555) 123-4567",
            link: "tel:+15551234567"
        },
        {
            icon: "material-symbols-light:location-on-outline",
            title: "Visit Us",
            info: "123 Learning Street, Education City",
            link: "#"
        },
        {
            icon: "material-symbols-light:schedule",
            title: "Office Hours",
            info: "Mon-Fri: 9AM - 6PM",
            link: "#"
        }
    ]

    return (
        <div className='container max-w-7xl mx-auto px-6 md:px-4 py-2 md:py-20'>
            <div>
                <h1 className='capitalize text-4xl md:text-5xl xl:text-7xl font-extrabold text-start md:text-center mb-5 md:mb-16'>
                    Get in Touch With Us Today
                </h1>
            </div>

            <div className='relative mt-12'>
                <div className='flex flex-col md:flex-row items-start justify-center gap-8 max-w-6xl mx-auto'>
                    {/* Contact Form - Left Side */}
                    <div className='flex-1 w-full order-2 md:order-1'>
                        <div className='bg-white p-6 md:p-8 rounded-lg shadow-lg'>
                            <h2 className='text-2xl md:text-3xl font-bold text-gray-900 mb-6'>
                                Send Us a Message
                            </h2>
                            <div className='space-y-5'>
                                <div>
                                    <label htmlFor='name' className='block text-sm font-medium text-gray-700 mb-2'>
                                        Your Name
                                    </label>
                                    <input
                                        type='text'
                                        id='name'
                                        name='name'
                                        value={formData.name}
                                        onChange={handleChange}
                                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all'
                                        placeholder='John Doe'
                                    />
                                </div>

                                <div>
                                    <label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-2'>
                                        Email Address
                                    </label>
                                    <input
                                        type='email'
                                        id='email'
                                        name='email'
                                        value={formData.email}
                                        onChange={handleChange}
                                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all'
                                        placeholder='john@example.com'
                                    />
                                </div>

                                <div>
                                    <label htmlFor='subject' className='block text-sm font-medium text-gray-700 mb-2'>
                                        Subject
                                    </label>
                                    <input
                                        type='text'
                                        id='subject'
                                        name='subject'
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all'
                                        placeholder='How can we help?'
                                    />
                                </div>

                                <div>
                                    <label htmlFor='message' className='block text-sm font-medium text-gray-700 mb-2'>
                                        Message
                                    </label>
                                    <textarea
                                        id='message'
                                        name='message'
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows={5}
                                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all resize-none'
                                        placeholder='Tell us more about your inquiry...'
                                    />
                                </div>

                                <button
                                    onClick={handleSubmit}
                                    className='w-full bg-gray-900 text-white py-4 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-colors duration-300'
                                >
                                    Send Message
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Contact Info - Right Side */}
                    <div className='flex-1 w-full order-1 md:order-2'>
                        <div className='space-y-6'>
                            <div>
                                <h2 className='text-2xl md:text-3xl font-bold text-gray-900 mb-4'>
                                    Contact Information
                                </h2>
                                <p className='text-base md:text-lg text-gray-700 mb-8'>
                                    We're here to help and answer any question you might have. We look forward to hearing from you.
                                </p>
                            </div>

                            <div className='space-y-4'>
                                {contactInfo.map((item, index) => (
                                    <a
                                        key={index}
                                        href={item.link}
                                        className='flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors'
                                    >
                                        <div className='p-3 bg-gray-900 rounded-full'>
                                            <Icon icon={item.icon} className="size-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className='font-semibold text-gray-900 mb-1'>
                                                {item.title}
                                            </h3>
                                            <p className='text-gray-700'>
                                                {item.info}
                                            </p>
                                        </div>
                                    </a>
                                ))}
                            </div>

                            <div className='mt-8 p-6 bg-gray-900 text-white rounded-lg'>
                                <h3 className='text-xl font-bold mb-3'>Follow Us</h3>
                                <div className='flex gap-4'>
                                    <a href='#' className='p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all'>
                                        <Icon icon="mdi:facebook" className="size-6" />
                                    </a>
                                    <a href='#' className='p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all'>
                                        <Icon icon="mdi:twitter" className="size-6" />
                                    </a>
                                    <a href='#' className='p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all'>
                                        <Icon icon="mdi:instagram" className="size-6" />
                                    </a>
                                    <a href='#' className='p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all'>
                                        <Icon icon="mdi:linkedin" className="size-6" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ContactPage