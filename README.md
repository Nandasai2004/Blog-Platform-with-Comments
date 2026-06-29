# Blog Platform with Comments

A full-stack web application built with the MERN stack (MongoDB, Express, React, Node.js). This platform allows users to create, manage, and interact with blog content. Users can register, log in securely, publish blog posts with cover images, manage their profiles, and comment on posts.

## Features

- **User Authentication**: Secure JWT-based registration and login system.
- **User Profiles**: Users can update their bio and upload a custom profile picture.
- **Blog Posts**: Create, edit, and delete blog posts. Add custom cover images to posts.
- **Comments**: Users can engage with content by adding and deleting comments.
- **Authorization**: Ensures only authors can edit or delete their posts and comments.
- **Modern UI**: Designed with Tailwind CSS for a fully responsive and clean interface.

## Technology Stack

- **Frontend**: React (Vite), Tailwind CSS, React Router, Axios, Lucide React (Icons).
- **Backend**: Node.js, Express.js, JWT, bcrypt.js, Multer (Image Uploads).
- **Database**: MongoDB with Mongoose.

## Getting Started

### Prerequisites

Ensure you have the following installed on your local machine:
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [Docker](https://www.docker.com/) (Optional: for quickly spinning up MongoDB)
- [MongoDB](https://www.mongodb.com/) (If not using Docker)

### 1. Database Setup

If you have Docker Desktop installed, simply run the following command in the root folder to start a MongoDB container on port `27017`:
```bash
docker-compose up -d
```
*(If you are running MongoDB locally, make sure it is running on the default port `27017`)*

### 2. Backend Setup

Open a terminal and navigate to the backend directory:
```bash
cd backend
```
Install the dependencies:
```bash
npm install
```
Start the backend server:
```bash
npm run dev
# or `node server.js`
```
The server will run on `http://localhost:5000`.

### 3. Frontend Setup

Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```
Install the dependencies:
```bash
npm install
```
Start the frontend development server:
```bash
npm run dev
```
The client will run on `http://localhost:5173`.

## Environment Variables
The backend uses a `.env` file (which is ignored by git for security). If you clone this repository, you should create a `.env` file in the `backend/` directory with the following variables:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/blog-platform
JWT_SECRET=your_jwt_secret_key_here
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
