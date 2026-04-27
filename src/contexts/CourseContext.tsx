'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

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

interface CourseContextType {
  courses: Course[]
  featuredCourses: Course[]
  enrolledCourses: Course[]
  loading: boolean
  enrollCourse: (courseId: string) => Promise<void>
  getCourse: (courseId: string) => Course | undefined
  updateProgress: (courseId: string, lessonId: string) => void
}

const CourseContext = createContext<CourseContextType | undefined>(undefined)

export const useCourse = () => {
  const context = useContext(CourseContext)
  if (context === undefined) {
    throw new Error('useCourse must be used within a CourseProvider')
  }
  return context
}

interface CourseProviderProps {
  children: ReactNode
}

export const CourseProvider = ({ children }: CourseProviderProps) => {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data for demo with real videos
    const mockCourses: Course[] = [
      {
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
          }
        ]
      },
      {
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
      {
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
    ]
    setCourses(mockCourses)
    setLoading(false)
  }, [])

  const featuredCourses = courses.slice(0, 3)
  const enrolledCourses = courses.filter(course => course.enrolled)

  const enrollCourse = async (courseId: string) => {
    try {
      // Mock enrollment - in real app, this would be an API call
      setCourses(prev => prev.map(course => 
        course.id === courseId 
          ? { ...course, enrolled: true, purchased: true, progress: 0 }
          : course
      ))
    } catch (error) {
      throw new Error('Enrollment failed')
    }
  }

  const getCourse = (courseId: string) => {
    return courses.find(course => course.id === courseId)
  }

  const updateProgress = (courseId: string, lessonId: string) => {
    setCourses(prev => prev.map(course => {
      if (course.id === courseId) {
        const updatedLessons = course.lessons.map(lesson =>
          lesson.id === lessonId ? { ...lesson, completed: true } : lesson
        )
        const completedLessons = updatedLessons.filter(lesson => lesson.completed).length
        const progress = (completedLessons / updatedLessons.length) * 100
        return { ...course, lessons: updatedLessons, progress }
      }
      return course
    }))
  }

  const value = {
    courses,
    featuredCourses,
    enrolledCourses,
    loading,
    enrollCourse,
    getCourse,
    updateProgress
  }

  return (
    <CourseContext.Provider value={value}>
      {children}
    </CourseContext.Provider>
  )
}
