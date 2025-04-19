import React, { useEffect, useState } from 'react';
import API from '../../utils/api';
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Github,
  Twitter,
  Linkedin,
  RefreshCw,
  AlertCircle,
  User,
  Star,
  ShoppingBag,
  Heart
} from 'lucide-react';

// Social media link component
const SocialLink = ({ platform, username, children }) => {
  const platforms = {
    twitter: {
      url: `https://twitter.com/${username}`,
      hoverColor: 'hover:text-blue-400'
    },
    github: {
      url: `https://github.com/${username}`,
      hoverColor: 'hover:text-gray-800'
    },
    linkedin: {
      url: `https://linkedin.com/in/${username}`,
      hoverColor: 'hover:text-blue-600'
    }
  };

  const { url, hoverColor } = platforms[platform];

  return (
    <a
      href={url}
      target="_blank" 
      rel="noopener noreferrer"
      className={`transition-colors ${hoverColor}`}
      aria-label={`${platform} profile`}
    >
      {children}
    </a>
  );
};

// Stat card component
const StatCard = ({ icon, label, value }) => {
  const IconComponent = icon;
  
  return (
    <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-50 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-center mb-2">
        <IconComponent size={18} className="text-blue-500" />
      </div>
      <p className="text-3xl font-bold text-gray-800 text-center">{value}</p>
      <p className="text-gray-500 text-center">{label}</p>
    </div>
  );
};

// Activity item component
const ActivityItem = ({ action, date }) => {
  return (
    <li className="pb-4 border-b border-gray-50 last:border-0 last:pb-0">
      <div className="flex items-start space-x-3">
        <div className="mt-1 h-2 w-2 rounded-full bg-blue-400 flex-shrink-0"></div>
        <div>
          <p className="text-gray-700">{action}</p>
          <p className="text-xs text-gray-500 mt-1">
            {new Date(date).toLocaleString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      </div>
    </li>
  );
};

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProfile = async () => {
    try {
      setRefreshing(true);
      const response = await API.get('/user/profile');
      setProfile(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err.response?.data?.message || 'Failed to load profile. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    fetchProfile();
  };

  const handleEditProfile = () => {
    // Implement edit profile functionality
    console.log('Edit profile clicked');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full py-20">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-3"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4">
        <div className="bg-red-50 text-red-700 p-6 rounded-xl border border-red-200 flex items-start">
          <AlertCircle size={20} className="text-red-500 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold">Error Loading Profile</h3>
            <p>{error}</p>
            <button 
              onClick={handleRefresh}
              className="mt-3 text-blue-500 hover:text-blue-700 font-medium text-sm flex items-center"
            >
              <RefreshCw size={14} className="mr-1" /> Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Destructure profile data
  const {
    avatarUrl, name, role, joinedAt,
    bio, email, phone, address, social,
    stats, recentActivities
  } = profile;

  // Format joined date
  const formattedJoinDate = new Date(joinedAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      {/* Page header with refresh */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">My Profile</h1>
        <button 
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center px-3 py-2 bg-white border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={16} className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Header Card */}
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
          {/* Avatar */}
          <div className="relative">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={`${name} avatar`}
                className="w-32 h-32 rounded-full object-cover ring-4 ring-blue-400/30"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center ring-4 ring-blue-400/30">
                <User size={48} className="text-blue-400" />
              </div>
            )}
            <button 
              onClick={handleEditProfile}
              className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full shadow-md hover:bg-blue-600 transition-colors"
              aria-label="Edit profile picture"
            >
              <Edit size={14} />
            </button>
          </div>
          
          {/* Profile details */}
          <div className="flex-1 space-y-4 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">{name}</h2>
                <span className="inline-block mt-2 px-3 py-1 text-xs font-medium bg-blue-500 text-white rounded-full">
                  {role}
                </span>
              </div>
              <button 
                onClick={handleEditProfile}
                className="hidden md:flex items-center mt-3 md:mt-0 space-x-2 text-sm text-blue-500 hover:text-blue-700 transition-colors"
              >
                <Edit size={16} />
                <span>Edit Profile</span>
              </button>
            </div>
            
            {/* Bio */}
            <p className="text-gray-600">{bio}</p>
            
            {/* Contact info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-600 text-sm">
              <div className="flex items-center space-x-2">
                <Calendar size={16} className="text-gray-400" />
                <span>Joined {formattedJoinDate}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail size={16} className="text-gray-400" />
                <span>{email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone size={16} className="text-gray-400" />
                <span>{phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin size={16} className="text-gray-400" />
                <span className="truncate">
                  {address.street}, {address.city}, {address.state} {address.zip}
                </span>
              </div>
            </div>
            
            {/* Social links */}
            <div className="flex items-center justify-center md:justify-start space-x-5 pt-2">
              {social.twitter && (
                <SocialLink platform="twitter" username={social.twitter}>
                  <Twitter size={20} />
                </SocialLink>
              )}
              {social.github && (
                <SocialLink platform="github" username={social.github}>
                  <Github size={20} />
                </SocialLink>
              )}
              {social.linkedin && (
                <SocialLink platform="linkedin" username={social.linkedin}>
                  <Linkedin size={20} />
                </SocialLink>
              )}
            </div>

            {/* Mobile edit button */}
            <button 
              onClick={handleEditProfile}
              className="flex md:hidden mx-auto items-center mt-3 space-x-2 text-sm text-blue-500 hover:text-blue-700 transition-colors"
            >
              <Edit size={16} />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard 
          icon={ShoppingBag} 
          label="Orders" 
          value={stats.orders} 
        />
        <StatCard 
          icon={Star} 
          label="Reviews" 
          value={stats.reviews} 
        />
        <StatCard 
          icon={Heart} 
          label="Wishlist" 
          value={stats.wishlist} 
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Calendar size={18} className="mr-2 text-blue-500" />
          Recent Activity
        </h2>
        
        {recentActivities.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            <p>No recent activity to display.</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {recentActivities.map(({ id, action, date }) => (
              <ActivityItem key={id} action={action} date={date} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Profile;