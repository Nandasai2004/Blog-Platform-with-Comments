import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { Calendar, User, Trash2, Edit } from 'lucide-react';

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        const [postRes, commentsRes] = await Promise.all([
          axios.get(`/posts/${id}`),
          axios.get(`/comments/${id}`)
        ]);
        setPost(postRes.data);
        setComments(commentsRes.data);
      } catch (error) {
        console.error('Error fetching data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPostAndComments();
  }, [id]);

  const handleDeletePost = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await axios.delete(`/posts/${id}`);
        navigate('/');
      } catch (error) {
        console.error('Error deleting post', error);
      }
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const res = await axios.post('/comments', { postId: id, text: newComment });
      setComments([res.data, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`/comments/${commentId}`);
      setComments(comments.filter(c => c._id !== commentId));
    } catch (error) {
      console.error('Error deleting comment', error);
    }
  };

  if (loading) return <div className="text-center mt-10 text-gray-500">Loading post...</div>;
  if (!post) return <div className="text-center mt-10 text-red-500">Post not found</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-8">
        {post.image && (
          <img src={`http://localhost:5000${post.image}`} alt={post.title} className="w-full h-96 object-cover rounded-lg mb-8" />
        )}
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-4xl font-extrabold text-gray-900">{post.title}</h1>
          {user && post.author._id === user.id && (
            <div className="flex space-x-2">
              <Link to={`/edit-post/${post._id}`} className="text-indigo-600 hover:bg-indigo-50 p-2 rounded-full transition-colors">
                <Edit className="w-5 h-5" />
              </Link>
              <button onClick={handleDeletePost} className="text-red-600 hover:bg-red-50 p-2 rounded-full transition-colors">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
        <div className="flex items-center text-sm text-gray-500 space-x-4 mb-8 border-b pb-4">
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
        <div className="prose max-w-none text-gray-800 whitespace-pre-wrap">
          {post.content}
        </div>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Comments ({comments.length})</h3>
        
        {user ? (
          <form onSubmit={handleAddComment} className="mb-8">
            <textarea
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 min-h-[100px] mb-3"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              required
            ></textarea>
            <button
              type="submit"
              className="bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Post Comment
            </button>
          </form>
        ) : (
          <div className="bg-gray-50 p-4 rounded-md mb-8 text-gray-600">
            Please <Link to="/login" className="text-indigo-600 hover:underline">login</Link> to leave a comment.
          </div>
        )}

        <div className="space-y-6">
          {comments.map(comment => (
            <div key={comment._id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  {comment.user?.profilePicture ? (
                    <img src={`http://localhost:5000${comment.user.profilePicture}`} alt="User" className="w-6 h-6 rounded-full object-cover border border-gray-200" />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                  <span className="font-semibold text-gray-700">{comment.user?.name}</span>
                  <span>•</span>
                  <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                </div>
                {user && comment.user?._id === user.id && (
                  <button 
                    onClick={() => handleDeleteComment(comment._id)}
                    className="text-red-500 hover:text-red-700 text-sm flex items-center transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <p className="text-gray-800 ml-8">{comment.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
