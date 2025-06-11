# Task-Manager
# 📋 Task Manager Pro

[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-lightgrey.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-brightgreen.svg)](https://www.mongodb.com/)
[![Material-UI](https://img.shields.io/badge/MUI-v5-blue.svg)](https://mui.com/)

> A modern, full-stack task management application with a beautiful UI and powerful features.

![Task Manager Demo](demo-screenshot.png)

## ✨ Features

- 🔐 **Secure Authentication**: JWT-based user authentication system
- 📱 **Responsive Design**: Beautiful UI that works on all devices
- 📌 **Task Pinning**: Pin important tasks to the top
- ✅ **Task Status**: Mark tasks as complete/incomplete
- 🔄 **Real-time Updates**: Instant updates when tasks are modified
- 🎨 **Material Design**: Modern and clean user interface using Material-UI
- 🔍 **Smart Sorting**: Sort tasks by title, status, or date
- 📝 **Rich Task Management**: Create, edit, delete, and organize tasks

## 🚀 Tech Stack

- **Frontend**:
  - React.js
  - Material-UI (MUI)
  - Context API for state management
  - Axios for API requests

- **Backend**:
  - Node.js
  - Express.js
  - MongoDB with Mongoose
  - JWT Authentication
  - bcrypt for password hashing

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/task-manager.git
   cd task-manager
   ```

2. **Setup Backend**
   ```bash
   cd server
   npm install
   # Create .env file and add your MongoDB URI and JWT secret
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   cd client
   npm install
   npm start
   ```

## 🌐 Environment Variables

Create a `.env` file in the server directory:

```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=5000
```

## 💻 Usage

1. Register a new account or login with existing credentials
2. Create new tasks with title and description
3. Pin important tasks to keep them at the top
4. Mark tasks as complete/incomplete
5. Edit or delete tasks as needed
6. Sort tasks by different criteria

## 🔒 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

## 📱 Screenshots

### Dashboard
![Dashboard](dashboard.png)

### Task Management
![Task Management](task-management.png)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👏 Acknowledgments

- Material-UI for the beautiful components
- MongoDB Atlas for database hosting
- The amazing open-source community

---

<div align="center">
  Made with ❤️ by [SADHA SHREE RAMESH]
</div>
