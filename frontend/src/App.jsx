import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PostDetail from './pages/PostDetail';
import CreateEditPost from './pages/CreateEditPost';
import Profile from './pages/Profile';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />
          <main className="flex-grow px-4 pb-12">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/posts/:id" element={<PostDetail />} />
              <Route path="/create-post" element={<CreateEditPost />} />
              <Route path="/edit-post/:id" element={<CreateEditPost />} />
            </Routes>
          </main>
          <footer className="bg-white border-t border-gray-200 py-6 text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} BlogSpace. All rights reserved.</p>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
