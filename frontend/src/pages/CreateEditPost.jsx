import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../api/axios';
import { ImagePlus } from 'lucide-react';

const CreateEditPost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [currentImage, setCurrentImage] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  useEffect(() => {
    if (isEditMode) {
      const fetchPost = async () => {
        try {
          const res = await axios.get(`/posts/${id}`);
          setTitle(res.data.title);
          setContent(res.data.content);
          setCurrentImage(res.data.image);
        } catch (err) {
          setError('Failed to fetch post for editing');
        }
      };
      fetchPost();
    }
  }, [id, isEditMode]);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = currentImage;
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        const uploadRes = await axios.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        imageUrl = uploadRes.data;
      }

      if (isEditMode) {
        await axios.put(`/posts/${id}`, { title, content, image: imageUrl });
        navigate(`/posts/${id}`);
      } else {
        const res = await axios.post('/posts', { title, content, image: imageUrl });
        navigate(`/posts/${res.data._id}`);
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to save post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        {isEditMode ? 'Edit Post' : 'Create New Post'}
      </h1>
      {error && <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image</label>
          <div className="flex items-center space-x-4">
            {(imageFile || currentImage) && (
              <img 
                src={imageFile ? URL.createObjectURL(imageFile) : `http://localhost:5000${currentImage}`} 
                alt="Cover Preview" 
                className="w-32 h-24 object-cover rounded-md border border-gray-200"
              />
            )}
            <label className="flex items-center px-4 py-2 bg-gray-50 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-100 transition-colors">
              <ImagePlus className="w-5 h-5 mr-2 text-gray-600" />
              <span className="text-gray-700">Upload Image</span>
              <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
            </label>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-lg"
            placeholder="Enter post title"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 min-h-[300px]"
            placeholder="Write your post content here..."
            required
          ></textarea>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Saving...' : (isEditMode ? 'Update Post' : 'Publish Post')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEditPost;
