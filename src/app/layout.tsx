import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/contexts/AuthContext'
import { CourseProvider } from '@/contexts/CourseContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Ignite LMS - Modern Learning Management System',
  description: 'Advanced Learning Management System with courses, quizzes, and progress tracking',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <CourseProvider>
            {children}
          </CourseProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
