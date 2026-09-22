# DevMatch

DevMatch is a full-stack developer networking platform where developers can discover other developers, send connection requests, build connections, and communicate through real-time chat.

The application also includes developer profiles, search, authentication, password recovery, profile image uploads, and a premium membership system.

## Features

- User registration and login
- JWT-based authentication with HTTP-only cookies
- Access and refresh token authentication
- Session management and logout
- Logout from all active sessions
- Password change and password reset
- Developer profiles with skills, bio, profile image and social links
- Developer discovery feed
- Send, accept, reject, ignore and cancel connection requests
- Manage accepted connections
- Real-time one-to-one chat
- Real-time group chat
- Typing indicators
- Persistent chat messages
- Developer search by username and skills
- Cloudinary profile image uploads
- Premium membership using Razorpay
- Payment verification
- Responsive React interface
- Protected frontend and backend routes

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- React Router
- Redux Toolkit
- Axios
- Tailwind CSS
- DaisyUI
- Socket.IO Client

### Backend

- Node.js
- Express
- TypeScript
- MongoDB
- Mongoose
- Socket.IO
- JWT
- bcryptjs

### Services

- Cloudinary — profile image storage
- Razorpay — premium membership payments
- Resend — password reset emails

## Core Functionality

### Authentication

DevMatch uses JWT-based authentication with short-lived access tokens and refresh tokens.

Refresh sessions are stored in the database, allowing sessions to be revoked during logout or logout-all operations.

Authentication tokens are stored using HTTP-only cookies.

### Developer Matching & Connections

Users can discover developers and interact with them through connection requests.

Supported actions include:

- Send request
- Accept request
- Reject request
- Ignore request
- Cancel pending request
- Remove connection

Connection states are maintained in MongoDB to prevent duplicate relationships.

### Real-Time Chat

DevMatch uses Socket.IO for real-time communication.

Users can:

- Send messages in real time
- Chat one-to-one
- Create and participate in group conversations
- See typing indicators
- Join conversation rooms
- Persist messages in MongoDB

Messages support text, image and file message types.

### Developer Search

Premium users can search for developers using:

- Username
- Skills

Search results provide developer profile information and matching skills.

### Premium Membership

Premium membership is implemented using Razorpay.

The payment flow includes:

1. Creating a payment order
2. Processing the Razorpay checkout
3. Verifying the payment signature on the backend
4. Recording the verified payment
5. Updating the user's premium status

   Clone the repository
git clone <repository-url>
cd devmatch
Backend
cd backend
npm install
npm run dev

Create a .env file in the backend:

PORT=3000
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

RESEND_API_KEY=your_resend_api_key

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
Frontend
cd frontend
npm install
npm run dev

Configure the frontend environment variables required by the application.

## Project Structure

```text
DevMatch
├── frontend
│   └── src
│       ├── api
│       ├── components
│       ├── hooks
│       ├── layout
│       ├── pages
│       ├── redux
│       ├── routes
│       ├── services
│       ├── socket
│       └── types
│
└── backend
    └── src
        ├── config
        ├── controllers
        ├── middlewares
        ├── models
        ├── routes
        ├── services
        ├── socket
        ├── types
        ├── utils
        └── validators
