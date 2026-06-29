import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import { Calendar, User } from 'lucide-react';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get('/posts');
        setPosts(res.data);
      } catch (error) {
        console.error('Error fetching posts', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) return <div className="text-center mt-10 text-gray-500">Loading posts...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Latest Posts</h1>
      {posts.length === 0 ? (
        <p className="text-gray-500">No posts available. Be the first to write one!</p>
      ) : (
        <div className="space-y-6">
          {posts.map(post => (
            <div key={post._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              {post.image && (
                <Link to={`/posts/${post._id}`}>
                  <img src={`http://localhost:5000${post.image}`} alt={post.title} className="w-full h-64 object-cover rounded-md mb-4" />
                </Link>
              )}
              <Link to={`/posts/${post._id}`}>
                <h2 className="text-2xl font-bold text-gray-800 hover:text-indigo-600 mb-3">{post.title}</h2>
              </Link>
              <p className="text-gray-600 mb-4 line-clamp-3">{post.content}</p>
              <div className="flex items-center text-sm text-gray-500 space-x-4">
                <span className="flex items-center">
                  {post.author?.profilePicture ? (
                    <img src={`http://localhost:5000${post.author.profilePicture}`} alt="Author" className="w-6 h-6 rounded-full object-cover mr-2 border border-gray-200" />
                  ) : (
                    <User className="w-4 h-4 mr-1" />
                  )}
                  {post.author?.name || 'Unknown'}
                </span>
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
