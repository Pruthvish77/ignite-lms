'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiPlay, FiLock, FiCheckCircle, FiClock, FiBookOpen, FiStar } from 'react-icons/fi'
import ReactPlayer from 'react-player'
import { useAuth } from '@/contexts/AuthContext'
import { useCourse } from '@/contexts/CourseContext'

interface Course {
  id: string
  title: string
  description: string
  instructor: string
  price: number
  duration: string
  level: string
  rating: number
  students: number
  image: string
  category: string
  lessons: Lesson[]
  enrolled: boolean
  progress?: number
  videoUrl?: string
  purchased?: boolean
}

interface Lesson {
  id: string
  title: string
  duration: string
  videoUrl?: string
  content?: string
  order: number
  completed?: boolean
  isPreview?: boolean
}

export default function CourseDetail({ courseId }: { courseId: string }) {
  const { user } = useAuth()
  const { getCourse, enrollCourse, updateProgress } = useCourse()
  const [course, setCourse] = useState<Course | null>(null)
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState(true)
  const [showPayment, setShowPayment] = useState(false)

  // Real course data with video URLs
  const realCourses: Record<string, Course> = {
    '1': {
      id: '1',
      title: 'Complete Web Development Bootcamp',
      description: 'Learn HTML, CSS, JavaScript, React, Node.js and more in this comprehensive course.',
      instructor: 'Dr. Sarah Johnson',
      price: 89.99,
      duration: '42 hours',
      level: 'Beginner',
      rating: 4.8,
      students: 15420,
      image: '/courses/web-dev.jpg',
      category: 'Web Development',
      enrolled: false,
      purchased: false,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      lessons: [
        {
          id: '1-1',
          title: 'Introduction to Web Development',
          duration: '15 min',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          order: 1,
          isPreview: true
        },
        {
          id: '1-2',
          title: 'HTML Fundamentals',
          duration: '45 min',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
          order: 2
        },
        {
          id: '1-3',
          title: 'CSS Styling Basics',
          duration: '60 min',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
          order: 3
        },
        {
          id: '1-4',
          title: 'JavaScript Essentials',
          duration: '90 min',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
          order: 4
        }
      ]
    },
    '2': {
      id: '2',
      title: 'Data Science & Machine Learning',
      description: 'Master Python, TensorFlow, and advanced ML algorithms.',
      instructor: 'Prof. Michael Chen',
      price: 129.99,
      duration: '56 hours',
      level: 'Intermediate',
      rating: 4.9,
      students: 12350,
      image: '/courses/data-science.jpg',
      category: 'Data Science',
      enrolled: false,
      purchased: false,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
      lessons: [
        {
          id: '2-1',
          title: 'Python for Data Science',
          duration: '30 min',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
          order: 1,
          isPreview: true
        },
        {
          id: '2-2',
          title: 'NumPy and Pandas',
          duration: '45 min',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
          order: 2
        },
        {
          id: '2-3',
          title: 'Machine Learning Basics',
          duration: '60 min',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          order: 3
        }
      ]
    },
    '3': {
      id: '3',
      title: 'UI/UX Design Masterclass',
      description: 'Create beautiful user interfaces and amazing user experiences.',
      instructor: 'Emily Rodriguez',
      price: 79.99,
      duration: '28 hours',
      level: 'Beginner',
      rating: 4.7,
      students: 8920,
      image: '/courses/ui-ux.jpg',
      category: 'Design',
      enrolled: false,
      purchased: false,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      lessons: [
        {
          id: '3-1',
          title: 'Design Principles',
          duration: '20 min',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
          order: 1,
          isPreview: true
        },
        {
          id: '3-2',
          title: 'User Research Methods',
          duration: '35 min',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
          order: 2
        },
        {
          id: '3-3',
          title: 'Prototyping with Figma',
          duration: '50 min',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
          order: 3
        }
      ]
    }
  }

  useEffect(() => {
    const courseData = realCourses[courseId] || getCourse(courseId)
    setCourse(courseData || null)
    if (courseData) {
      setCurrentLesson(courseData.lessons[0])
    }
    setLoading(false)
  }, [courseId])

  const handleEnroll = async () => {
    if (!user) {
      alert('Please login to enroll')
      return
    }
    
    if (!course?.purchased) {
      setShowPayment(true)
      return
    }

    try {
      await enrollCourse(courseId)
      if (course) {
        setCourse({ ...course, enrolled: true })
      }
    } catch (error) {
      console.error('Enrollment failed:', error)
    }
  }

  const handlePayment = () => {
    // Simulate payment processing
    alert('Payment successful! You now have access to this course.')
    if (course) {
      setCourse({ ...course, purchased: true, enrolled: true })
    }
    setShowPayment(false)
  }

  const handleLessonComplete = (lessonId: string) => {
    updateProgress(courseId, lessonId)
  }

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-xl">Loading course...</div>
    </div>
  }

  if (!course) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-xl">Course not found</div>
    </div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <a href="/" className="flex items-center space-x-2">
              <FiBookOpen className="text-blue-600 text-2xl" />
              <span className="text-xl font-bold text-gray-900">Ignite LMS</span>
            </a>
            <div className="flex items-center space-x-4">
              <a href="/courses" className="text-gray-700 hover:text-blue-600 transition">
                Courses
              </a>
              {user ? (
                <a href="/dashboard" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                  Dashboard
                </a>
              ) : (
                <a href="/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                  Login
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Player Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              {/* Video Player */}
              <div className="aspect-video bg-black">
                {currentLesson && (course.enrolled || currentLesson.isPreview) ? (
                  <ReactPlayer
                    src={currentLesson.videoUrl || ''}
                    width="100%"
                    height="100%"
                    controls={true}
                    playing={true}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-white">
                      <FiLock className="mx-auto text-6xl mb-4" />
                      <p className="text-xl">Enroll to access this lesson</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Course Info */}
              <div className="p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">{course.title}</h1>
                <p className="text-gray-600 mb-6">{course.description}</p>
                
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <FiStar className="text-yellow-400 fill-current" />
                      <span className="ml-1 text-gray-900 font-semibold">{course.rating}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FiClock className="mr-1" />
                      {course.duration}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FiBookOpen className="mr-1" />
                      {course.lessons.length} lessons
                    </div>
                  </div>
                  
                  {!course.enrolled && (
                    <button
                      onClick={handleEnroll}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                    >
                      {course.purchased ? 'Enroll Now' : `Purchase - $${course.price}`}
                    </button>
                  )}
                </div>

                {/* Instructor Info */}
                <div className="border-t pt-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Instructor</h3>
                  <p className="text-gray-600">{course.instructor}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Lessons Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">Course Content</h2>
              
              <div className="space-y-2">
                {course.lessons.map((lesson, index) => (
                  <div
                    key={lesson.id}
                    onClick={() => setCurrentLesson(lesson)}
                    className={`p-3 rounded-lg cursor-pointer transition ${
                      currentLesson?.id === lesson.id
                        ? 'bg-blue-50 border-2 border-blue-500'
                        : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          {lesson.completed ? (
                            <FiCheckCircle className="text-green-500" />
                          ) : lesson.isPreview || course.enrolled ? (
                            <FiPlay className="text-blue-600" />
                          ) : (
                            <FiLock className="text-gray-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{lesson.title}</p>
                          <p className="text-sm text-gray-500">{lesson.duration}</p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">{index + 1}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-8 max-w-md w-full mx-4"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Complete Your Purchase</h2>
            <div className="mb-6">
              <p className="text-gray-600 mb-2">Course: {course.title}</p>
              <p className="text-3xl font-bold text-gray-900">${course.price}</p>
            </div>
            
            {/* Phone Payment Options */}
            <div className="space-y-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Pay via UPI/PhonePe/Paytm</h3>
                <div className="text-center">
                  <p className="text-gray-600 mb-2">Scan QR Code or Pay to:</p>
                  <div className="bg-white p-3 rounded border-2 border-blue-500">
                    <p className="text-2xl font-bold text-blue-600">7259771372</p>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">UPI ID: 7259771372@upi</p>
                </div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Payment Steps:</h3>
                <ol className="text-sm text-gray-600 space-y-1">
                  <li>1. Open PhonePe/Paytm/GPay</li>
                  <li>2. Enter number: 7259771372</li>
                  <li>3. Pay ${course.price}</li>
                  <li>4. Screenshot payment confirmation</li>
                  <li>5. Click "Payment Done" below</li>
                </ol>
              </div>
              
              <div className="bg-yellow-50 p-3 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> After payment, contact support with screenshot to activate your course access
                </p>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={handlePayment}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                Payment Done
              </button>
              <button
                onClick={() => setShowPayment(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
