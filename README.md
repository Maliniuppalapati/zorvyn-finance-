Zorvyn Finance Dashboard – Backend

Developer: Geya Malini Uppalapati

📖 Overview
This project is a backend system for managing personal finances. It allows users to track income and expenses securely using role-based access control. The main goal was to build a clean and secure API with proper authentication and data privacy.

Focused on building a production-like backend with proper authentication, authorization, and data security practices.

🏗️ Tech Stack
Node.js, Express.js  
MongoDB Atlas, Mongoose  
JWT Authentication, bcrypt  
MVC Architecture

⚙️ Key Features

- User authentication using JWT
- Role-based access (Admin & Viewer)
- Admin can add and delete records, Viewer has read-only access
- Financial summary using MongoDB aggregation
- Input validation for safe data handling
- Soft delete functionality using isDeleted

🧪 Security

- Unauthorized actions are blocked (403 errors)
- Invalid inputs are handled properly (400 errors)
- Each user can access only their own data

🔑 Test Credentials
You can use these accounts to test the application:

Role Email Password  
Admin admin@test.com password123  
Viewer viewer@test.com password123

Note:

- Run the project
- Register the above emails with respective roles
- Then login to test features

📡 API Endpoints
POST /api/auth/login → Login  
GET /api/finance/summary → Get summary  
POST /api/finance/add → Add record (Admin only)  
DELETE /api/finance/:id → Delete record (Admin only)

🚀 Setup
git clone <your-repo-link>  
cd <project-folder>  
npm install

Create a `.env` file:

PORT=5000  
MONGO_URI=your_mongodb_uri  
JWT_SECRET=your_secret

Run server:

npm start
