// components/Footer.tsx
import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <>
      {/* New White Background Section */}
      <section className="bg-white p-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Communication Section */}
            <div className="space-y-4">
              <h3 className="text-xs font-semibold text-gray-900">Communication</h3>
              <ul className="space-y-3">
                <li><Link href="/live-chat" className="text-gray-600 hover:text-blue-600 transition-colors flex items-center text-[14px]">
                  Live Chat Support
                </Link></li>
                <li><Link href="/discussion-forums" className="text-gray-600 hover:text-blue-600 transition-colors flex items-center text-[14px]">
                  Discussion Forums
                </Link></li>
                <li><Link href="/video-calls" className="text-gray-600 hover:text-blue-600 transition-colors flex items-center text-[14px]">
                  Video Calls with Tutors
                </Link></li>
                <li><Link href="/messaging" className="text-gray-600 hover:text-blue-600 transition-colors flex items-center text-[14px]">
                  Direct Messaging
                </Link></li>
                <li><Link href="/group-chats" className="text-gray-600 hover:text-blue-600 transition-colors flex items-center text-[14px]">
                  Group Study Chats
                </Link></li>
                <li><Link href="/announcements" className="text-gray-600 hover:text-blue-600 transition-colors flex items-center text-[14px]">
                  Course Announcements
                </Link></li>
                <li><Link href="/feedback-system" className="text-gray-600 hover:text-blue-600 transition-colors flex items-center text-[14px]">
                  Feedback System
                </Link></li>
                <li><Link href="/webinars" className="text-gray-600 hover:text-blue-600 transition-colors flex items-center text-[14px]">
                  Live Webinars
                </Link></li>
              </ul>
            </div>

            {/* Online Classes Section */}
            <div className="space-y-4">
              <h3 className="text-xs font-semibold text-gray-900">Online Classes</h3>
              <ul className="space-y-3">
                <li><Link href="/live-classes" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Live Online Classes</Link></li>
                <li><Link href="/recorded-sessions" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Recorded Sessions</Link></li>
                <li><Link href="/interactive-courses" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Interactive Courses</Link></li>
                <li><Link href="/self-paced" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Self-Paced Learning</Link></li>
                <li><Link href="/virtual-labs" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Virtual Labs</Link></li>
                <li><Link href="/assignment-portal" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Assignment Portal</Link></li>
                <li><Link href="/class-resources" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Class Resources</Link></li>
                <li><Link href="/progress-tracking" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Progress Tracking</Link></li>
              </ul>
            </div>

            {/* Tutors Nearby Section */}
            <div className="space-y-4">
              <h3 className="text-xs font-semibold text-gray-900">Tutors Nearby</h3>
              <ul className="space-y-3">
                <li><Link href="/local-tutors" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Find Local Tutors</Link></li>
                <li><Link href="/in-person-sessions" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">In-Person Sessions</Link></li>
                <li><Link href="/tutor-reviews" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Tutor Reviews & Ratings</Link></li>
                <li><Link href="/subject-experts" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Subject Experts</Link></li>
                <li><Link href="/tutor-availability" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Availability Calendar</Link></li>
                <li><Link href="/booking-system" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Easy Booking System</Link></li>
                <li><Link href="/tutor-profiles" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Detailed Tutor Profiles</Link></li>
                <li><Link href="/location-based" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Location-Based Search</Link></li>
              </ul>
            </div>

            {/* Certifications Section */}
            <div className="space-y-4">
              <h3 className="text-xs font-semibold text-gray-900">Certifications</h3>
              
              {/* Certifications by Skills */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-800 mb-3">By Skills</h4>
                <ul className="space-y-2">
                  <li><Link href="/tech-certifications" className="text-gray-600 hover:text-blue-600 transition-colors text-xs">Technology Certifications</Link></li>
                  <li><Link href="/business-certs" className="text-gray-600 hover:text-blue-600 transition-colors text-xs">Business & Management</Link></li>
                  <li><Link href="/creative-skills" className="text-gray-600 hover:text-blue-600 transition-colors text-xs">Creative Skills</Link></li>
                  <li><Link href="/language-certs" className="text-gray-600 hover:text-blue-600 transition-colors text-xs">Language Certifications</Link></li>
                </ul>
              </div>

              {/* General Certifications */}
              <div>
                <h4 className="font-medium text-gray-800 mb-3">Professional Certifications</h4>
                <ul className="space-y-2">
                  <li><Link href="/industry-recognized" className="text-gray-600 hover:text-blue-600 transition-colors text-xs">Industry Recognized</Link></li>
                  <li><Link href="/government-approved" className="text-gray-600 hover:text-blue-600 transition-colors text-xs">Government Approved</Link></li>
                  <li><Link href="/international-certs" className="text-gray-600 hover:text-blue-600 transition-colors text-xs">International Certifications</Link></li>
                  <li><Link href="/digital-badges" className="text-gray-600 hover:text-blue-600 transition-colors text-xs">Digital Badges</Link></li>
                  <li><Link href="/certificate-verification" className="text-gray-600 hover:text-blue-600 transition-colors text-xs">Certificate Verification</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Original Footer Section */}
      <footer className="bg-primary-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Column 1: Learning Platform */}
            <div className="space-y-4">
              <h3 className="text-xs font-semibold">Learning Platform</h3>
              <ul className="space-y-2">
                <li><Link href="/courses" className="text-gray-300 hover:text-white transition-colors text-xs">Browse Courses</Link></li>
                <li><Link href="/certifications" className="text-gray-300 hover:text-white transition-colors text-xs">Professional Certifications</Link></li>
                <li><Link href="/enrollment" className="text-gray-300 hover:text-white transition-colors text-xs">Enrollment Process</Link></li>
                <li><Link href="/industry-courses" className="text-gray-300 hover:text-white transition-colors text-xs">Industry Standard Courses</Link></li>
                <li><Link href="/expert-instructors" className="text-gray-300 hover:text-white transition-colors text-xs">Expert Instructors</Link></li>
                <li><Link href="/learning-paths" className="text-gray-300 hover:text-white transition-colors text-xs">Career Learning Paths</Link></li>
                <li><Link href="/course-catalog" className="text-gray-300 hover:text-white transition-colors text-xs">Course Catalog</Link></li>
                <li><Link href="/specializations" className="text-gray-300 hover:text-white transition-colors text-xs">Specializations</Link></li>
              </ul>
            </div>

            {/* Column 2: Exam Preparation */}
            <div className="space-y-4">
              <h3 className="text-xs font-semibold">Exam Preparation</h3>
              <ul className="space-y-2">
                <li><Link href="/exam-materials" className="text-gray-300 hover:text-white transition-colors text-xs">Study Materials</Link></li>
                <li><Link href="/practice-tests" className="text-gray-300 hover:text-white transition-colors text-xs">Practice Tests</Link></li>
                <li><Link href="/international-exams" className="text-gray-300 hover:text-white transition-colors text-xs">International Exams</Link></li>
                <li><Link href="/certification-prep" className="text-gray-300 hover:text-white transition-colors text-xs">Certification Prep</Link></li>
                <li><Link href="/study-guides" className="text-gray-300 hover:text-white transition-colors text-xs">Study Guides</Link></li>
                <li><Link href="/exam-strategies" className="text-gray-300 hover:text-white transition-colors text-xs">Exam Strategies</Link></li>
                <li><Link href="/mock-exams" className="text-gray-300 hover:text-white transition-colors text-xs">Mock Exams</Link></li>
                <li><Link href="/score-improvement" className="text-gray-300 hover:text-white transition-colors text-xs">Score Improvement</Link></li>
              </ul>
            </div>

            {/* Column 3: Tutoring & AI Support */}
            <div className="space-y-4">
              <h3 className="text-xs font-semibold">Tutoring & AI Support</h3>
              <ul className="space-y-2">
                <li><Link href="/one-on-one-tutoring" className="text-gray-300 hover:text-white transition-colors text-xs">1-on-1 Tutoring</Link></li>
                <li><Link href="/ai-career-orientation" className="text-gray-300 hover:text-white transition-colors text-xs">AI Career Orientation</Link></li>
                <li><Link href="/personalized-lessons" className="text-gray-300 hover:text-white transition-colors text-xs">Personalized Lessons</Link></li>
                <li><Link href="/find-tutors" className="text-gray-300 hover:text-white transition-colors text-xs">Find Tutors</Link></li>
                <li><Link href="/ai-learning-assistant" className="text-gray-300 hover:text-white transition-colors text-xs">AI Learning Assistant</Link></li>
                <li><Link href="/career-guidance" className="text-gray-300 hover:text-white transition-colors text-xs">Career Guidance</Link></li>
                <li><Link href="/tutor-sessions" className="text-gray-300 hover:text-white transition-colors text-xs">Tutor Sessions</Link></li>
                <li><Link href="/ai-recommendations" className="text-gray-300 hover:text-white transition-colors text-xs">AI Recommendations</Link></li>
              </ul>
            </div>

            {/* Column 4: Community & Support */}
            <div className="space-y-4">
              <h3 className="text-xs font-semibold">Community & Support</h3>
              <ul className="space-y-2">
                <li><Link href="/community" className="text-gray-300 hover:text-white transition-colors text-xs">Community Forum</Link></li>
                <li><Link href="/study-groups" className="text-gray-300 hover:text-white transition-colors text-xs">Study Groups</Link></li>
                <li><Link href="/idea-sharing" className="text-gray-300 hover:text-white transition-colors text-xs">Idea Sharing</Link></li>
                <li><Link href="/peer-support" className="text-gray-300 hover:text-white transition-colors text-xs">Peer Support</Link></li>
                <li><Link href="/help-center" className="text-gray-300 hover:text-white transition-colors text-xs">Help Center</Link></li>
                <li><Link href="/faq" className="text-gray-300 hover:text-white transition-colors text-xs">FAQ</Link></li>
                <li><Link href="/contact-support" className="text-gray-300 hover:text-white transition-colors text-xs">Contact Support</Link></li>
                <li><Link href="/feedback" className="text-gray-300 hover:text-white transition-colors text-xs">Feedback</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-12 pt-8 border-t border-gray-700">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <h2 className="text-2xl font-bold">Z-learn</h2>
                <p className="text-gray-400 mt-2 text-sm">
                  Your gateway to professional education and career advancement
                </p>
              </div>
              
              <div className="flex space-x-6">
                <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors text-xs">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="text-gray-400 hover:text-white transition-colors text-xs">
                  Terms of Service
                </Link>
                <Link href="/cookies" className="text-gray-400 hover:text-white transition-colors text-xs">
                  Cookie Policy
                </Link>
              </div>
            </div>
            
            <div className="mt-6 text-center md:text-left text-xs">
              <p className="text-gray-400">
                &copy; {new Date().getFullYear()} EduPlatform. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;