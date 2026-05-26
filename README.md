# LevelUp ⚡
### Scalable E-Learning Platform

> **Learn anything. Teach anyone. Track everything.**

LevelUp is a full-stack e-learning platform where instructors create and sell courses, students enroll and track progress in real time, and admins manage the whole platform. Built with a focus on clean API design, role-based access control, and reliable payment handling.

---

## What it does

**For students** — browse courses, enroll (free or paid), watch video lessons, attempt quizzes, and track progress live as they complete content.

**For instructors** — create courses, upload lessons and resources via ImageKit CDN, set pricing, publish to the platform, and monitor who's enrolled.

**For admins** — approve instructors, manage users, view platform-wide reports, and control what gets published.

---

## System Design

```
User (Browser)
     │
     ▼
React Frontend (Vite + Tailwind)
     │  REST API calls (Axios)
     ▼
Express.js Backend
     ├── JWT middleware (auth + role checks per route)
     ├── Multer (file parsing before upload)
     ├── ImageKit (CDN storage for videos/images)
     ├── Razorpay (payment order creation + webhook verification)
     ├── WebSocket server (real-time progress updates)
     │
     └── MongoDB
           ├── users        (role, hashed password, enrolled courses)
           ├── courses      (instructor, lessons, price, status)
           ├── enrollments  (student, course, payment status)
           └── progress     (lesson completion per student)
```

**Key design decisions:**
- **RBAC via middleware** — each route checks both authentication (valid JWT) and authorization (correct role). A student hitting an instructor route gets rejected at middleware, not inside the handler.
- **WebSockets for progress** — progress updates are pushed to the client in real time instead of polling. Tested with 100+ simulated concurrent connections without issues.
- **Razorpay webhook verification** — payment confirmation is verified server-side using Razorpay's webhook signature, not just the frontend callback. This prevents enrollment on failed payments.
- **MongoDB indexing** — course and enrollment collections are indexed on frequently queried fields to keep response times consistent as data grows.
- **ImageKit for media** — course videos and thumbnails are stored on ImageKit CDN, keeping the server stateless and file serving fast.

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React.js, Tailwind CSS, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| Auth | JWT, bcrypt |
| File Uploads | Multer, ImageKit CDN |
| Payments | Razorpay |
| Real-time | WebSockets |
| Deployment | AWS (backend), Vercel (frontend) |

---

## Project Structure

```
.
├── client/                  # React frontend
│   └── src/
│       ├── pages/
│       │   ├── Student/     # Course browser, player, progress
│       │   ├── Instructor/  # Course builder, dashboard
│       │   └── Admin/       # User management, reports
│       └── components/
│
└── server/                  # Express backend
    ├── routes/
    │   ├── auth.js
    │   ├── courses.js
    │   ├── enrollments.js
    │   └── progress.js
    ├── middleware/
    │   ├── authMiddleware.js     # JWT verification
    │   └── roleMiddleware.js     # Role-based access
    ├── models/                   # Mongoose schemas
    └── index.js
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- npm
- MongoDB instance (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) free tier)
- [Razorpay](https://razorpay.com) account (test mode works fine)
- [ImageKit](https://imagekit.io) account (free tier available)

### 1. Clone the repo

```bash
git clone https://github.com/Prince1895/LevelUp.git
cd LevelUp
```

### 2. Install dependencies

```bash
# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### 3. Set up environment variables

Create a `.env` file inside the `server/` directory:

```env
# Database
MONGODB_URI=your_mongodb_connection_string

# Auth
JWT_SECRET=your_jwt_secret

# Razorpay (use test keys during development)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# ImageKit (for video/image CDN)
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_imagekit_id
```

> **Razorpay note:** Use Razorpay's test mode keys during development. Test card: `4111 1111 1111 1111`, any future expiry, any CVV.

### 4. Run in development

```bash
# Start the backend (from /server)
npm run server

# Start the frontend (from /client)
npm run dev
```

- Frontend → `http://localhost:5173`
- API → `http://localhost:5000`

---

## API Overview

| Method | Endpoint | Role | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register as student or instructor |
| POST | `/api/auth/login` | Public | Login, receive JWT |
| GET | `/api/courses` | Public | Browse all published courses |
| POST | `/api/courses` | Instructor | Create a new course |
| POST | `/api/courses/:id/enroll` | Student | Enroll (triggers Razorpay order) |
| POST | `/api/payments/verify` | Student | Verify payment + activate enrollment |
| GET | `/api/progress/:courseId` | Student | Get lesson completion status |
| PATCH | `/api/progress/:lessonId` | Student | Mark lesson as complete |
| GET | `/api/admin/users` | Admin | List all users |
| PATCH | `/api/admin/instructors/:id/approve` | Admin | Approve instructor account |

---

## Deployment

| Service | Platform |
|---|---|
| Backend | AWS EC2 / Elastic Beanstalk |
| Frontend | Vercel (static build) |
| Database | MongoDB Atlas |
| Media CDN | ImageKit |

---

## License

MIT License — see [LICENSE](./LICENSE) for details.
