# 🚀 Backend Server Startup Guide

## Quick Start

### Option 1: Using npm (Recommended)
```bash
cd Backend
npm start
```

### Option 2: Using Node directly
```bash
cd Backend
node app.js
```

### Option 3: Development mode (with auto-restart)
```bash
cd Backend
npm run dev
```

## Expected Output
When the server starts successfully, you should see:
```
MongoDB connected
Server running on http://localhost:5000
```

## Available API Endpoints
Once the server is running, these endpoints will be available:

### Health Check
- `GET http://localhost:5000/` - Basic health check
- `GET http://localhost:5000/health` - Detailed health status

### Authentication
- `GET http://localhost:5000/api/auth/users` - Get all users
- `POST http://localhost:5000/api/auth/login` - User login
- `POST http://localhost:5000/api/auth/register` - User registration

### Tasks
- `GET http://localhost:5000/api/task/assigned` - Get all assigned tasks
- `POST http://localhost:5000/api/task/assign` - Assign new task

### Analytics
- `GET http://localhost:5000/api/analytics/dashboard` - Dashboard analytics
- `GET http://localhost:5000/api/analytics/task-trends` - Task trends data
- `GET http://localhost:5000/api/analytics/notifications` - System notifications

### Notifications
- `POST http://localhost:5000/api/notifications/message` - Send message

## Troubleshooting

### Issue: "MongoDB connection failed"
**Solution:** The MongoDB URI in `.env` file should work, but if it fails:
1. Check your internet connection
2. Verify the MongoDB URI is correct
3. Try using a local MongoDB instance

### Issue: "Port 5000 already in use"
**Solution:** 
1. Kill the process using port 5000: `lsof -ti:5000 | xargs kill -9` (Mac/Linux)
2. Or change the PORT in `.env` file to a different port (e.g., 5001)

### Issue: "Module not found"
**Solution:**
```bash
cd Backend
npm install
```

## Environment Variables
The `.env` file contains:
- `MONGO_URI` - MongoDB connection string
- `PORT` - Server port (default: 5000)
- `JWT_SECRET` - Secret key for JWT tokens

## Testing the Server
You can test if the server is working by visiting:
- http://localhost:5000/ in your browser
- You should see a JSON response with server information

## Frontend Connection
Once the backend is running:
1. The red "Backend Offline" indicator should turn green
2. All API calls will work properly
3. Real data will be displayed instead of demo data

## Need Help?
If you're still having issues:
1. Make sure you're in the `Backend` directory
2. Check that all dependencies are installed (`npm install`)
3. Verify the `.env` file exists and has the correct values
4. Check the console for any error messages