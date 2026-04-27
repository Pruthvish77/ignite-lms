'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiBook, FiUsers, FiAward, FiPlay, FiClock, FiStar, FiTrendingUp, FiCheckCircle } from 'react-icons/fi'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

export default function Home() {
  const { user } = useAuth()
  const [featuredCourses, setFeaturedCourses] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalInstructors: 0,
    completionRate: 0
  })

  useEffect(() => {
    // Mock data for demo
    setFeaturedCourses([
      {
        id: 1,
        title: 'Complete Web Development Bootcamp',
        instructor: 'Dr. Sarah Johnson',
        rating: 4.8,
        students: 15420,
        duration: '42 hours',
        level: 'Beginner',
        price: 89.99,
        image: '/courses/web-dev.jpg',
        description: 'Learn HTML, CSS, JavaScript, React, Node.js and more in this comprehensive course.'
      },
      {
        id: 2,
        title: 'Data Science & Machine Learning',
        instructor: 'Prof. Michael Chen',
        rating: 4.9,
        students: 12350,
        duration: '56 hours',
        level: 'Intermediate',
        price: 129.99,
        image: '/courses/data-science.jpg',
        description: 'Master Python, TensorFlow, and advanced ML algorithms.'
      },
      {
        id: 3,
        title: 'UI/UX Design Masterclass',
        instructor: 'Emily Rodriguez',
        rating: 4.7,
        students: 8920,
        duration: '28 hours',
        level: 'Beginner',
        price: 79.99,
        image: '/courses/ui-ux.jpg',
        description: 'Create beautiful user interfaces and amazing user experiences.'
      }
    ])

    setStats({
      totalCourses: 1250,
      totalStudents: 450000,
      totalInstructors: 850,
      completionRate: 87
    })
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <FiBook className="text-blue-600 text-2xl" />
                <span className="text-xl font-bold text-gray-900">Ignite LMS</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/courses" className="text-gray-700 hover:text-blue-600 transition">
                Courses
              </Link>
              <Link href="/instructors" className="text-gray-700 hover:text-blue-600 transition">
                Instructors
              </Link>
              {user ? (
                <Link href="/dashboard" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link href="/login" className="text-gray-700 hover:text-blue-600 transition">
                    Login
                  </Link>
                  <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6"
            >
              Learn Without Limits
              <span className="block text-blue-600">Start, Switch, or Advance Your Career</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
            >
              Access thousands of courses from expert instructors. Learn at your own pace, anywhere, anytime.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                href="/courses"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition transform hover:scale-105"
              >
                <FiPlay className="inline mr-2" />
                Browse Courses
              </Link>
              <Link
                href="/register"
                className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-50 transition transform hover:scale-105"
              >
                Get Started Free
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: FiBook, label: 'Courses', value: stats.totalCourses, suffix: '+' },
              { icon: FiUsers, label: 'Students', value: stats.totalStudents.toLocaleString(), suffix: '+' },
              { icon: FiAward, label: 'Instructors', value: stats.totalInstructors, suffix: '+' },
              { icon: FiTrendingUp, label: 'Completion Rate', value: stats.completionRate, suffix: '%' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <stat.icon className="text-blue-600 text-2xl" />
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  {stat.value}{stat.suffix}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Featured Courses</h2>
            <p className="text-xl text-gray-600">Explore our most popular courses</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="h-48 bg-gradient-to-r from-blue-400 to-purple-500"></div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-blue-600 font-semibold">{course.level}</span>
                    <div className="flex items-center">
                      <FiStar className="text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm text-gray-600">{course.rating}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
                  <p className="text-gray-600 mb-4">{course.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <FiClock className="mr-1" />
                      {course.duration}
                    </div>
                    <div className="flex items-center">
                      <FiUsers className="mr-1" />
                      {course.students.toLocaleString()} students
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-gray-900">${course.price}</span>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                      Enroll Now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Why Choose Ignite LMS?</h2>
            <p className="text-xl text-gray-600">Everything you need to succeed in your learning journey</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: FiPlay,
                title: 'Learn at Your Own Pace',
                description: 'Access courses anytime, anywhere. Learn on your schedule with lifetime access.'
              },
              {
                icon: FiAward,
                title: 'Expert Instructors',
                description: 'Learn from industry experts and experienced educators who are passionate about teaching.'
              },
              {
                icon: FiCheckCircle,
                title: 'Practical Learning',
                description: 'Hands-on projects and real-world examples to help you apply what you learn.'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <feature.icon className="text-blue-600 text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of students who are already learning with Ignite LMS
          </p>
          <Link
            href="/register"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-50 transition transform hover:scale-105 inline-block"
          >
            Get Started Today
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <FiBook className="text-blue-400 text-2xl" />
                <span className="text-xl font-bold">Ignite LMS</span>
              </div>
              <p className="text-gray-400">Empowering learners worldwide with quality education.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/courses" className="hover:text-white transition">Courses</Link></li>
                <li><Link href="/instructors" className="hover:text-white transition">Instructors</Link></li>
                <li><Link href="/about" className="hover:text-white transition">About Us</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help" className="hover:text-white transition">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-white transition">Contact Us</Link></li>
                <li><Link href="/faq" className="hover:text-white transition">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition">Terms of Service</Link></li>
                <li><Link href="/cookies" className="hover:text-white transition">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Ignite LMS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
