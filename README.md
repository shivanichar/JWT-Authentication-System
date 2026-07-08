# JWT Authentication System

A full-stack authentication application built with **React**, **Node.js**, **Express**, **MongoDB**, **JWT**, and **bcrypt**.

This project demonstrates a complete authentication flow including user registration, login, password hashing, JWT-based authentication, protected routes, and MongoDB integration.

---

## Features

### Authentication
- User Registration
- User Login
- JWT Token Generation
- Protected API Routes
- Authentication Middleware
- Token Expiry Handling
- Logout Functionality

### Security
- Password Hashing using bcrypt
- JWT Authentication
- Environment Variables using dotenv
- Protected Routes using Express Middleware
- Password never stored in plain text
- Password excluded from API responses

### Database
- MongoDB Atlas
- Mongoose ODM
- User Schema
- Unique Email Validation

### Frontend
- React
- Conditional Rendering
- Login/Register Toggle
- Local Storage Authentication
- Automatic Logout on Token Expiry
- Reusable API Helper (`fetchWithToken`)

---

## Tech Stack

### Frontend

- React
- JavaScript (ES6+)
- Fetch API

### Backend

- Node.js
- Express.js

### Database

- MongoDB Atlas
- Mongoose

### Authentication

- JWT (jsonwebtoken)
- bcrypt

### Other Packages

- dotenv
- cors

---

## Folder Structure

```
reactjwt
│
├── backend
│   ├── config
│   │     db.js
│   │
│   ├── middleware
│   │     authMiddleware.js
│   │
│   ├── models
│   │     User.js
│   │
│   ├── .env
│   ├── server.js
│   └── package.json
│
└── frontend
    ├── src
    │     App.js
    │     api.js
    │
    └── package.json
```

---

## Authentication Flow

```
User
   │
   ▼
React Login/Register UI
   │
   ▼
Express API
   │
   ▼
MongoDB
   │
   ▼
JWT Generated
   │
   ▼
Stored in LocalStorage
   │
   ▼
Authorization Header
   │
   ▼
Authentication Middleware
   │
   ▼
Protected Routes
```

---

## API Endpoints

### Register

```
POST /register
```

Registers a new user.

---

### Login

```
POST /login
```

Authenticates the user and returns a JWT.

---

### Profile

```
GET /profile
```

Protected Route

Returns logged-in user's profile.

---

### Dashboard

```
GET /dashboard
```

Protected Route

---

### Settings

```
GET /settings
```

Protected Route

---

## Environment Variables

Create a `.env` file inside the backend folder.

```
PORT=3005

JWT_SECRET=your_secret_key

MONGO_URI=your_mongodb_connection_string
```

---

## Installation

### Backend

```bash
cd backend

npm install

npm run dev
```

---

### Frontend

```bash
cd frontend

npm install

npm start
```

---

## Security Implemented

✔ Password Hashing using bcrypt

✔ JWT Authentication

✔ Authentication Middleware

✔ Protected Routes

✔ Password Hidden from Responses

✔ Environment Variables

✔ MongoDB User Validation

---

## Learning Outcomes

Through this project, I learned:

- React Authentication Flow
- Conditional Rendering
- Local Storage Management
- Fetch API
- Express Routing
- Middleware
- JWT Authentication
- bcrypt Password Hashing
- MongoDB Atlas
- Mongoose Models
- CRUD Basics
- Environment Variables
- API Error Handling
- Authentication Best Practices

---

## Author

Shivani
