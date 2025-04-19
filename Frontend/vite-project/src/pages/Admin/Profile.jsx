// src/pages/Profile.jsx
import React, { useEffect, useState } from 'react';
import API from '../../utils/api';
import {
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  Edit2Icon,
  GithubIcon,
  TwitterIcon,
  LinkedinIcon
} from 'lucide-react';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    API.get('/user/profile')
      .then(res => setProfile(res.data))
      .catch(err => {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile.');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full py-20">
        <p className="text-gray-500">Loading profile…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-700 p-6 rounded-md mx-auto max-w-md">
        {error}
      </div>
    );
  }

  const {
    avatarUrl, name, role, joinedAt,
    bio, email, phone, address, social,
    stats, recentActivities
  } = profile;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      {/* Header Card */}
      <div className="bg-white p-6 rounded-xl shadow-md flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
        <img
          src={avatarUrl}
          alt={`${name} avatar`}
          className="w-32 h-32 rounded-full object-cover ring-4 ring-[#63D2FF]/30"
        />
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">{name}</h1>
              <span className="inline-block mt-1 px-3 py-1 text-xs font-medium bg-[#63D2FF] text-white rounded-full">
                {role}
              </span>
            </div>
            <button className="flex items-center space-x-1 text-sm text-[#63D2FF] hover:underline">
              <Edit2Icon size={16} />
              <span>Edit Profile</span>
            </button>
          </div>
          <p className="text-gray-600">{bio}</p>
          <div className="flex flex-wrap gap-4 text-gray-600 text-sm">
            <span className="flex items-center space-x-1">
              <CalendarIcon size={16} />
              <span>Joined {new Date(joinedAt).toLocaleDateString()}</span>
            </span>
            <span className="flex items-center space-x-1">
              <MailIcon size={16} />
              <span>{email}</span>
            </span>
            <span className="flex items-center space-x-1">
              <PhoneIcon size={16} />
              <span>{phone}</span>
            </span>
            <span className="flex items-center space-x-1">
              <MapPinIcon size={16} />
              <span>
                {address.street}, {address.city}, {address.state} {address.zip}
              </span>
            </span>
          </div>
          {/* Social */}
          <div className="flex items-center space-x-4 mt-3">
            {social.twitter && (
              <a
                href={`https://twitter.com/${social.twitter}`}
                target="_blank" rel="noopener noreferrer"
                className="hover:text-[#1DA1F2]"
              >
                <TwitterIcon size={20} />
              </a>
            )}
            {social.github && (
              <a
                href={`https://github.com/${social.github}`}
                target="_blank" rel="noopener noreferrer"
                className="hover:text-gray-800"
              >
                <GithubIcon size={20} />
              </a>
            )}
            {social.linkedin && (
              <a
                href={`https://linkedin.com/in/${social.linkedin}`}
                target="_blank" rel="noopener noreferrer"
                className="hover:text-[#0A66C2]"
              >
                <LinkedinIcon size={20} />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Orders', value: stats.orders },
          { label: 'Reviews', value: stats.reviews },
          { label: 'Wishlist', value: stats.wishlist },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white p-4 rounded-lg shadow-sm text-center">
            <p className="text-3xl font-bold text-gray-800">{value}</p>
            <p className="text-gray-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h2>
        <ul className="space-y-3">
          {recentActivities.map(({ id, action, date }) => (
            <li key={id} className="flex items-start space-x-3">
              <span className="mt-1 text-gray-400">•</span>
              <div>
                <p className="text-gray-700">{action}</p>
                <p className="text-xs text-gray-500">
                  {new Date(date).toLocaleString()}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Profile;
