import React, { useState, useContext } from 'react';
import axios from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { Camera } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile } = useContext(AuthContext);
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [profilePicture, setProfilePicture] = useState(user?.profilePicture || '');
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      let imageUrl = profilePicture;
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        const uploadRes = await axios.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        imageUrl = uploadRes.data;
      }
      
      await updateProfile({ name, bio, profilePicture: imageUrl });
      setProfilePicture(imageUrl);
      setMessage('Profile updated successfully!');
    } catch (err) {
      console.error(err);
      setMessage('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Profile</h1>
      {message && <div className="mb-4 p-3 rounded-md text-sm bg-indigo-50 text-indigo-700">{message}</div>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col items-center">
          <div className="relative">
            <img 
              src={imageFile ? URL.createObjectURL(imageFile) : (profilePicture ? `http://localhost:5000${profilePicture}` : 'https://via.placeholder.com/150')} 
              alt="Profile" 
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-100"
            />
            <label className="absolute bottom-0 right-0 bg-indigo-600 p-2 rounded-full text-white cursor-pointer hover:bg-indigo-700 transition">
              <Camera className="w-5 h-5" />
              <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
            </label>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-lg"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 min-h-[150px]"
            placeholder="Tell us about yourself..."
          ></textarea>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
