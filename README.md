# 🎓 Ignite LMS - Learning Management System

A modern, feature-rich Learning Management System built with Next.js, Node.js, and MySQL.

## 🚀 Features

### 📚 Core Features
- **User Authentication** - Login, Register, Role-based access (Student/Instructor/Admin)
- **Course Management** - Create, edit, and organize courses
- **Student Dashboard** - Track progress, view enrolled courses
- **Course Enrollment** - Easy enrollment system with progress tracking
- **Responsive Design** - Works perfectly on all devices

### 🎯 Advanced Features
- **Video Player Integration** - Embedded video lessons
- **Quiz System** - Interactive assessments
- **Progress Tracking** - Real-time learning progress
- **Certificate Generation** - Auto-generate completion certificates
- **Payment Integration** - Stripe/PayPal support (ready to implement)
- **Discussion Forums** - Course discussions and Q&A
- **Analytics & Reports** - Detailed learning analytics

## 🛠 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Modern styling framework
- **Framer Motion** - Beautiful animations
- **React Icons** - Icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MySQL** - Database
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing

### Deployment
- **Vercel** - Frontend hosting
- **Heroku/Railway** - Backend hosting
- **MySQL Cloud** - Database hosting

## 📋 Quick Start

### Prerequisites
- Node.js 18+ installed
- MySQL database
- Git

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd ignite-lms
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
# Create .env file in server directory
cp server/api.env server/.env
```

4. **Set up MySQL database**
```sql
CREATE DATABASE ignite_lms;
```

5. **Start the application**

**Terminal 1 - Backend Server:**
```bash
npm run server
```

**Terminal 2 - Frontend Development:**
```bash
npm run dev
```

6. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🌐 Deployment

### Deploy to Vercel (Frontend)

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy**
```bash
vercel --prod
```

### Deploy Backend (Heroku/Railway)

1. **Install Heroku CLI**
```bash
npm i -g heroku
```

2. **Create app**
```bash
heroku create your-lms-app
```

3. **Set environment variables**
```bash
heroku config:set JWT_SECRET=your-secret-key
heroku config:set DB_HOST=your-db-host
heroku config:set DB_USER=your-db-user
heroku config:set DB_PASSWORD=your-db-password
heroku config:set DB_NAME=your-db-name
```

4. **Deploy**
```bash
git push heroku main
```

## 📁 Project Structure

```
ignite-lms/
├── src/
│   ├── app/                 # Next.js app router pages
│   │   ├── (auth)/         # Authentication pages
│   │   ├── courses/        # Course pages
│   │   ├── dashboard/      # Student dashboard
│   │   └── admin/          # Admin dashboard
│   ├── components/         # Reusable components
│   ├── contexts/          # React contexts
│   ├── lib/               # Utility functions
│   └── types/             # TypeScript types
├── server/
│   ├── index.js           # Express server
│   ├── routes/            # API routes
│   ├── middleware/        # Express middleware
│   └── models/            # Database models
├── public/                # Static assets
└── docs/                 # Documentation
```

## 🔧 Configuration

### Environment Variables

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

**Backend (server/.env):**
```env
PORT=5000
JWT_SECRET=your-super-secret-jwt-key
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your-password
DB_NAME=ignite_lms
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get single course
- `POST /api/courses` - Create course (instructor/admin)
- `PUT /api/courses/:id` - Update course (instructor/admin)

### Enrollments
- `POST /api/enroll` - Enroll in course
- `GET /api/enrollments` - Get user enrollments
- `PUT /api/enrollments/:id/progress` - Update progress

## 🎨 Customization

### Branding
- Update colors in `tailwind.config.js`
- Replace logo in `src/app/layout.tsx`
- Customize theme in CSS variables

### Features
- Add new pages in `src/app/`
- Create components in `src/components/`
- Extend API in `server/routes/`

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@ignite-lms.com or create an issue on GitHub.

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=your-username/ignite-lms&type=Date)](https://star-history.com/#your-username/ignite-lms&Date)

---

**Built with ❤️ by the Ignite LMS Team**
