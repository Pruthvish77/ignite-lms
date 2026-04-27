'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiBook, FiClock, FiAward, FiTrendingUp, FiPlay, FiCheckCircle, FiLogOut, FiUser } from 'react-icons/fi'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useCourse } from '@/contexts/CourseContext'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const { enrolledCourses } = useCourse()
  const [stats, setStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    totalHours: 0,
    certificates: 0,
    inProgressCourses: 0
  })

  useEffect(() => {
    // Calculate stats from enrolled courses
    const completed = enrolledCourses.filter(course => course.progress === 100).length
    const inProgress = enrolledCourses.filter(course => course.progress && course.progress > 0 && course.progress < 100).length
    const totalHours = enrolledCourses.reduce((acc, course) => {
      const hours = parseInt(course.duration.split(' ')[0])
      return acc + hours
    }, 0)

    setStats({
      totalCourses: enrolledCourses.length,
      completedCourses: completed,
      totalHours: totalHours,
      certificates: completed,
      inProgressCourses: inProgress
    })
  }, [enrolledCourses])

  const handleLogout = () => {
    logout()
    window.location.href = '/'
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <FiBook className="text-blue-600 text-2xl" />
              <span className="text-xl font-bold text-gray-900">Ignite LMS</span>
            </Link>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <FiUser className="text-gray-600" />
                <span className="text-gray-900 font-medium">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition"
              >
                <FiLogOut />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}!</h1>
            <p className="text-blue-100">Continue your learning journey</p>
          </motion.div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {[
            { icon: FiBook, label: 'Enrolled Courses', value: stats.totalCourses, color: 'blue' },
            { icon: FiPlay, label: 'In Progress', value: stats.inProgressCourses, color: 'green' },
            { icon: FiCheckCircle, label: 'Completed', value: stats.completedCourses, color: 'purple' },
            { icon: FiClock, label: 'Learning Hours', value: stats.totalHours, color: 'orange' },
            { icon: FiAward, label: 'Certificates', value: stats.certificates, color: 'pink' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`bg-white rounded-xl shadow-sm p-6 border-l-4 border-${stat.color}-500`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 bg-${stat.color}-100 rounded-lg`}>
                  <stat.icon className={`text-${stat.color}-600 text-xl`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Recent Courses */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Enrolled Courses */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">My Courses</h2>
              
              {enrolledCourses.length === 0 ? (
                <div className="text-center py-8">
                  <FiBook className="mx-auto text-6xl text-gray-300 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses yet</h3>
                  <p className="text-gray-600 mb-4">Start by enrolling in a course</p>
                  <Link
                    href="/courses"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Browse Courses
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {enrolledCourses.map((course, index) => (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{course.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">{course.instructor}</p>
                          
                          {/* Progress Bar */}
                          <div className="mb-2">
                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                              <span>Progress</span>
                              <span>{course.progress || 0}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${course.progress || 0}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="ml-4">
                          <Link
                            href={`/courses/${course.id}`}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                          >
                            <FiPlay className="mr-2" />
                            Continue
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
              
              <div className="space-y-3">
                <Link
                  href="/courses"
                  className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                >
                  <div className="flex items-center">
                    <FiBook className="text-blue-600 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">Browse Courses</p>
                      <p className="text-sm text-gray-600">Discover new courses</p>
                    </div>
                  </div>
                </Link>
                
                <Link
                  href="/certificates"
                  className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                >
                  <div className="flex items-center">
                    <FiAward className="text-purple-600 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">My Certificates</p>
                      <p className="text-sm text-gray-600">View earned certificates</p>
                    </div>
                  </div>
                </Link>
                
                <Link
                  href="/profile"
                  className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                >
                  <div className="flex items-center">
                    <FiUser className="text-green-600 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">Profile Settings</p>
                      <p className="text-sm text-gray-600">Update your information</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Learning Streak */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-gradient-to-r from-orange-400 to-pink-500 rounded-xl shadow-sm p-6 mt-6 text-white"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg mb-1">Learning Streak</h3>
                  <p className="text-orange-100">Keep up the great work!</p>
                </div>
                <div className="text-3xl font-bold">🔥 7</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
