const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 5000
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Middleware
app.use(cors())
app.use(express.json())

// Mock data for demo (when MySQL is not available)
const mockUsers = []
const mockCourses = [
  {
    id: 1,
    title: 'Complete Web Development Bootcamp',
    description: 'Learn HTML, CSS, JavaScript, React, Node.js and more in this comprehensive course.',
    instructor: 'Dr. Sarah Johnson',
    price: 89.99,
    duration: '42 hours',
    level: 'Beginner',
    rating: 4.8,
    students: 15420,
    image: '/courses/web-dev.jpg',
    category: 'Web Development'
  },
  {
    id: 2,
    title: 'Data Science & Machine Learning',
    description: 'Master Python, TensorFlow, and advanced ML algorithms.',
    instructor: 'Prof. Michael Chen',
    price: 129.99,
    duration: '56 hours',
    level: 'Intermediate',
    rating: 4.9,
    students: 12350,
    image: '/courses/data-science.jpg',
    category: 'Data Science'
  },
  {
    id: 3,
    title: 'UI/UX Design Masterclass',
    description: 'Create beautiful user interfaces and amazing user experiences.',
    instructor: 'Emily Rodriguez',
    price: 79.99,
    duration: '28 hours',
    level: 'Beginner',
    rating: 4.7,
    students: 8920,
    image: '/courses/ui-ux.jpg',
    category: 'Design'
  }
]

let useMockData = false
let pool

// Try to connect to MySQL, fallback to mock data
async function initializeDatabase() {
  try {
    const mysql = require('mysql2/promise')
    
    const dbConfig = {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'ignite_lms',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    }

    pool = mysql.createPool(dbConfig)
    
    // Test connection
    await pool.execute('SELECT 1')
    
    // Create tables if they don't exist
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('student', 'instructor', 'admin') DEFAULT 'student',
        avatar VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `)

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS courses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        instructor VARCHAR(255),
        price DECIMAL(10,2),
        duration VARCHAR(50),
        level ENUM('Beginner', 'Intermediate', 'Advanced'),
        rating DECIMAL(3,2) DEFAULT 0,
        students INT DEFAULT 0,
        image VARCHAR(255),
        category VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `)

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS enrollments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        course_id INT,
        progress INT DEFAULT 0,
        enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
        UNIQUE KEY unique_enrollment (user_id, course_id)
      )
    `)

    // Insert sample courses if table is empty
    const [courses] = await pool.execute('SELECT COUNT(*) as count FROM courses')
    if (courses[0].count === 0) {
      await pool.execute(`
        INSERT INTO courses (title, description, instructor, price, duration, level, rating, students, category) VALUES
        ('Complete Web Development Bootcamp', 'Learn HTML, CSS, JavaScript, React, Node.js and more in this comprehensive course.', 'Dr. Sarah Johnson', 89.99, '42 hours', 'Beginner', 4.8, 15420, 'Web Development'),
        ('Data Science & Machine Learning', 'Master Python, TensorFlow, and advanced ML algorithms.', 'Prof. Michael Chen', 129.99, '56 hours', 'Intermediate', 4.9, 12350, 'Data Science'),
        ('UI/UX Design Masterclass', 'Create beautiful user interfaces and amazing user experiences.', 'Emily Rodriguez', 79.99, '28 hours', 'Beginner', 4.7, 8920, 'Design')
      `)
    }

    console.log('✅ MySQL database connected successfully')
    useMockData = false
  } catch (error) {
    console.log('⚠️  MySQL not available, using mock data')
    console.log('Error:', error.message)
    useMockData = true
  }
}

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Access token required' })
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' })
    }
    req.user = user
    next()
  })
}

// Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body

    if (useMockData) {
      // Mock registration
      const existingUser = mockUsers.find(u => u.email === email)
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' })
      }

      const hashedPassword = await bcrypt.hash(password, 10)
      const newUser = {
        id: mockUsers.length + 1,
        name,
        email,
        password: hashedPassword,
        role: role || 'student'
      }
      mockUsers.push(newUser)

      const token = jwt.sign(
        { id: newUser.id, name, email, role: newUser.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      )

      return res.status(201).json({
        message: 'User created successfully (mock data)',
        token,
        user: { id: newUser.id, name, email, role: newUser.role }
      })
    }

    // MySQL registration
    const [existingUsers] = await pool.execute('SELECT * FROM users WHERE email = ?', [email])
    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'User already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role || 'student']
    )

    const token = jwt.sign(
      { id: result.insertId, name, email, role: role || 'student' },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: { id: result.insertId, name, email, role: role || 'student' }
    })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (useMockData) {
      // Mock login
      const user = mockUsers.find(u => u.email === email)
      if (!user) {
        return res.status(400).json({ error: 'Invalid credentials' })
      }

      const validPassword = await bcrypt.compare(password, user.password)
      if (!validPassword) {
        return res.status(400).json({ error: 'Invalid credentials' })
      }

      const token = jwt.sign(
        { id: user.id, name: user.name, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      )

      return res.json({
        message: 'Login successful (mock data)',
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role }
      })
    }

    // MySQL login
    const [users] = await pool.execute('SELECT * FROM users WHERE email = ?', [email])
    if (users.length === 0) {
      return res.status(400).json({ error: 'Invalid credentials' })
    }

    const user = users[0]

    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid credentials' })
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.get('/api/courses', async (req, res) => {
  try {
    if (useMockData) {
      return res.json(mockCourses)
    }

    const [courses] = await pool.execute('SELECT * FROM courses ORDER BY created_at DESC')
    res.json(courses)
  } catch (error) {
    console.error('Get courses error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.get('/api/courses/:id', async (req, res) => {
  try {
    const courseId = parseInt(req.params.id)

    if (useMockData) {
      const course = mockCourses.find(c => c.id === courseId)
      if (!course) {
        return res.status(404).json({ error: 'Course not found' })
      }
      return res.json(course)
    }

    const [courses] = await pool.execute('SELECT * FROM courses WHERE id = ?', [courseId])
    if (courses.length === 0) {
      return res.status(404).json({ error: 'Course not found' })
    }
    res.json(courses[0])
  } catch (error) {
    console.error('Get course error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.post('/api/enroll', authenticateToken, async (req, res) => {
  try {
    const { courseId } = req.body
    const userId = req.user.id

    if (useMockData) {
      // Mock enrollment - just return success
      return res.json({ message: 'Enrolled successfully (mock data)' })
    }

    // Check if already enrolled
    const [existing] = await pool.execute(
      'SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?',
      [userId, courseId]
    )
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Already enrolled' })
    }

    // Create enrollment
    await pool.execute(
      'INSERT INTO enrollments (user_id, course_id) VALUES (?, ?)',
      [userId, courseId]
    )

    // Update course students count
    await pool.execute(
      'UPDATE courses SET students = students + 1 WHERE id = ?',
      [courseId]
    )

    res.json({ message: 'Enrolled successfully' })
  } catch (error) {
    console.error('Enrollment error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.get('/api/enrollments', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id

    if (useMockData) {
      // Return mock enrolled courses
      return res.json([])
    }

    const [enrollments] = await pool.execute(`
      SELECT c.*, e.progress, e.enrolled_at, e.completed_at
      FROM courses c
      JOIN enrollments e ON c.id = e.course_id
      WHERE e.user_id = ?
      ORDER BY e.enrolled_at DESC
    `, [userId])
    res.json(enrollments)
  } catch (error) {
    console.error('Get enrollments error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

// Start server
async function startServer() {
  await initializeDatabase()
  
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`)
    console.log(`📚 Ignite LMS API ready`)
  })
}

startServer().catch(console.error)
