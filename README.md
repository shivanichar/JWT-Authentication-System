# JWT Authentication System

A full-stack authentication application built with **React**, **Node.js**, **Express**, **MongoDB**, **JWT**, and **bcrypt**.

This project demonstrates a complete authentication flow including user registration, login, password hashing, JWT-based authentication, protected routes, automatic token refresh, and MongoDB integration.

---

## Features

### Authentication
- User Registration
- User Login
- JWT Token Generation
- JWT Refresh Token Authentication
- Protected API Routes
- Authentication Middleware
- Token Expiry Handling
- Logout Functionality

### Security
- Password Hashing using bcrypt
- Access Token Expiry
- Refresh Token Support
- Refresh Token Rotation (RTR)
- Role-Based Access Control (RBAC)
- Password Never Stored in Plain Text
- Password Excluded from API Responses
- Environment Variables using dotenv
- Authorization Header (Bearer Token)

### Database
- MongoDB Atlas
- Mongoose ODM
- User Schema
- Unique Email Validation
- Refresh Token Storage
- Automatic Timestamps

### Frontend
- React
- Conditional Rendering
- Login/Register Toggle
- Local Storage Authentication
- Automatic Token Refresh
- Automatic Logout
- Reusable Fetch Wrapper
- Error Handling

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
│   │     authorize.js
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

                Register
                    │
                    ▼
          Password hashed (bcrypt)
                    │
                    ▼
             Stored in MongoDB
                    │
                    ▼
                  Login
                    │
                    ▼
      Verify Email + Password
                    │
                    ▼
      Generate Access Token (1 min)
      Generate Refresh Token (2 days)
                    │
                    ▼
     Refresh Token stored in MongoDB
                    │
                    ▼
      Tokens stored in LocalStorage
                    │
                    ▼
       Protected API Request
                    │
                    ▼
      Authorization: Bearer Token
                    │
                    ▼
        Authentication Middleware
                    │
                    ▼
           Authorized Response

---
## Refresh Token Flow
Access Token Expired
          │
          ▼
Frontend calls /refresh
          │
          ▼
Verify Refresh Token
          │
          ▼
Match Token with MongoDB
          │
          ▼
Generate New Access Token
          │
          ▼
Generate New Refresh Token
          │
          ▼
Update MongoDB
          │
          ▼
Frontend replaces old tokens
          │
          ▼
Retry Original Request

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

### Refresh

```
POST /refresh
```

Refresh access token.

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
### Settings

```
POST /logout
```

Logout User.

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
