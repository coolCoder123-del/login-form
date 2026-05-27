# 🔐 MERN Authentication System

A full-stack authentication application built with the MERN stack (MongoDB, Express.js, React.js, Node.js). The project provides secure user registration and login functionality with form validation, password hashing, JWT authentication, notifications, and a modern responsive UI.

---

## 🚀 Features

### Authentication
- User Registration
- User Login
- JWT Token Authentication
- Protected Routes
- Session Management

### Validation
- Client-side Form Validation
- Server-side Validation using Express Validator
- Real-time Error Messages
- Email Format Validation
- Password Length Validation
- Confirm Password Matching
- Username Validation

### Security
- Password Hashing using bcryptjs
- JWT-based Authentication
- Protected API Endpoints
- Input Sanitization

### User Experience
- Password Strength Meter
- Show/Hide Password Feature
- Toast Notifications
- Responsive Design
- Dark/Light Theme Toggle
- Loading States
- Animated Form Feedback

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- Axios
- React Context API
- Lucide React Icons
- CSS3

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- express-validator
- dotenv
- cors

---

## 📂 Project Structure

```text
mern-login/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── LoginForm.jsx
│   │   │   ├── RegisterForm.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Notification.jsx
│   │   │   └── ThemeToggle.jsx
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   │
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   └── package.json
│
├── server/
│   ├── config/
│   │   └── db.js
│   │
│   ├── middleware/
│   │   └── auth.js
│   │
│   ├── models/
│   │   └── User.js
│   │
│   ├── routes/
│   │   └── auth.js
│   │
│   ├── server.js
│   ├── .env
│   └── package.json
│
└── README.md
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/your-username/mern-login.git
```

### Move Into Project

```bash
cd mern-login
```

---

## Backend Setup

Navigate to server folder:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Create `.env` file:

```env
PORT=5050
MONGO_URI=mongodb://localhost:27017/authdb
JWT_SECRET=your_secret_key
```

Run backend server:

```bash
npm run dev
```

Backend runs on:

```text
http://localhost:5050
```

---

## Frontend Setup

Open a new terminal:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Run frontend:

```bash
npm run dev
```

Frontend runs on:

```text
http://localhost:5174
```

---

## 📌 API Endpoints

### Register User

```http
POST /api/auth/register
```

Request:

```json
{
  "username": "john123",
  "email": "john@example.com",
  "password": "password123"
}
```

Response:

```json
{
  "token": "jwt_token"
}
```

---

### Login User

```http
POST /api/auth/login
```

Request:

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

Response:

```json
{
  "token": "jwt_token"
}
```

---

### Get Logged-in User

```http
GET /api/auth/user
```

Headers:

```http
Authorization: Bearer <jwt_token>
```

---

## 🗄️ Database Schema

### User Model

```javascript
{
  username: String,
  email: String,
  password: String,
  createdAt: Date
}
```

Validation Rules:

- Username: Minimum 3 characters
- Email: Valid email format
- Password: Minimum 6 characters

---

## 🔒 Authentication Flow

1. User registers an account.
2. Password is hashed using bcryptjs.
3. User data is stored in MongoDB.
4. JWT token is generated after successful login.
5. Token is sent with protected requests.
6. Middleware verifies token before granting access.

---

## 🎨 UI Features

- Modern Glassmorphism Design
- Responsive Layout
- Password Visibility Toggle
- Password Strength Indicator
- Dark Mode / Light Mode
- Interactive Validation Messages
- Loading Animations
- Notification System

---

## 🎯 Learning Outcomes

This project demonstrates:

- MERN Stack Development
- REST API Creation
- MongoDB Integration
- Mongoose Models & Validation
- JWT Authentication
- Password Hashing
- React State Management
- Context API Usage
- Form Validation
- Error Handling
- Secure Authentication Practices

---

## 🔮 Future Improvements

- Forgot Password Feature
- Email Verification
- Refresh Tokens
- OAuth Login (Google/GitHub)
- User Profile Management
- Role-Based Access Control
- Multi-Factor Authentication

---

## 👨‍💻 Author

Developed as a MERN Stack Authentication Project for learning full-stack web development and authentication workflows.

---
