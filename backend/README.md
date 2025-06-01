# Expense Tracker Backend API

A RESTful API built with Node.js, Express, and MongoDB for managing personal expenses.

## Features

- **User Authentication**: JWT-based authentication with registration and login
- **Expense Management**: Full CRUD operations for expenses
- **Data Filtering**: Filter expenses by date, category, and amount
- **Statistics**: Get expense analytics and summaries
- **Validation**: Comprehensive input validation and error handling
- **Security**: Password hashing, JWT tokens, and CORS protection

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Express Validator
- **Security**: bcryptjs for password hashing

## API Endpoints

### Authentication Routes (`/api/auth`)

- `POST /register` - Register a new user
- `POST /login` - Login user
- `GET /me` - Get current user profile
- `PUT /profile` - Update user profile

### Expense Routes (`/api/expenses`)

- `GET /` - Get all expenses (with filtering and pagination)
- `GET /:id` - Get single expense
- `POST /` - Create new expense
- `PUT /:id` - Update expense
- `DELETE /:id` - Delete expense
- `GET /stats` - Get expense statistics

### Health Check

- `GET /api/health` - API health check

## Database Schema

### User Model
```javascript
{
  name: String (required, 2-50 chars)
  email: String (required, unique, valid email)
  password: String (required, min 6 chars, hashed)
  createdAt: Date
  updatedAt: Date
}
```

### Expense Model
```javascript
{
  title: String (required, max 100 chars)
  amount: Number (required, positive)
  category: String (required, enum values)
  date: Date (required, not future)
  description: String (optional, max 500 chars)
  userId: ObjectId (required, ref to User)
  createdAt: Date
  updatedAt: Date
}
```

## Available Categories

- Food & Dining
- Transportation
- Shopping
- Entertainment
- Bills & Utilities
- Healthcare
- Travel
- Education
- Personal Care
- Gifts & Donations
- Business
- Other

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   - Copy `.env.example` to `.env`
   - Update the environment variables:
     ```
     MONGODB_URI=mongodb://localhost:27017/expense_tracker
     JWT_SECRET=your-super-secret-jwt-key
     JWT_EXPIRE=7d
     PORT=3000
     NODE_ENV=development
     FRONTEND_URL=http://localhost:5173
     ```

3. **Start MongoDB**
   - Make sure MongoDB is running on your system
   - Or use MongoDB Atlas for cloud database

4. **Run the Server**
   ```bash
   npm start
   ```

The server will start on `http://localhost:3000`

## API Response Format

### Success Response
```javascript
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

### Error Response
```javascript
{
  "success": false,
  "message": "Error message",
  "errors": [
    // Validation errors (if any)
  ]
}
```

## Authentication

Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Filtering and Pagination

### Query Parameters for GET /api/expenses

- `category` - Filter by category
- `startDate` - Filter expenses from this date
- `endDate` - Filter expenses until this date
- `minAmount` - Minimum amount filter
- `maxAmount` - Maximum amount filter
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `sortBy` - Sort field (date, amount, title)
- `sortOrder` - Sort order (asc, desc)

Example:
```
GET /api/expenses?category=Food&startDate=2024-01-01&page=1&limit=10
```

## Development

- The server uses `nodemon` for auto-restart during development
- All routes are protected except authentication routes
- Comprehensive error handling and logging
- Input validation on all endpoints
- MongoDB indexes for optimized queries

## Production Deployment

1. Set `NODE_ENV=production`
2. Use a strong JWT secret
3. Use MongoDB Atlas or a production MongoDB instance
4. Configure proper CORS origins
5. Use environment variables for all sensitive data
