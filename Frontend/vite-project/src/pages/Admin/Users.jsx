import React, { useEffect, useState } from 'react';
import { Users as UsersIcon, Plus, Edit, Trash2, AlertCircle, RefreshCw } from 'lucide-react';
import API from '../../utils/api';

const RoleIndicator = ({ role }) => {
  let roleStyle;
  
  if (role === 'admin') {
    roleStyle = "text-purple-600 bg-purple-50";
  } else if (role === 'manager') {
    roleStyle = "text-blue-600 bg-blue-50";
  } else {
    roleStyle = "text-green-600 bg-green-50";
  }
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleStyle}`}>
      {role || 'user'}
    </span>
  );
};

const UserRow = ({ user, onEdit, onDelete }) => {
  const { id, name, email, role, avatarUrl } = user;
  
  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <td className="py-4 px-2">
        <div className="flex items-center">
          {avatarUrl ? (
            <img 
              src={avatarUrl} 
              alt={name} 
              className="w-10 h-10 mr-3 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 mr-3 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-gray-500 font-medium">{name.charAt(0).toUpperCase()}</span>
            </div>
          )}
          <div>
            <span className="font-medium text-gray-800 block">{name}</span>
            <span className="text-gray-500 text-xs">{email}</span>
          </div>
        </div>
      </td>
      <td className="py-4 px-2">
        <RoleIndicator role={role || 'user'} />
      </td>
      <td className="py-4 px-2">
        <div className="flex space-x-3">
          <button 
            onClick={() => onEdit(user)}
            className="flex items-center text-blue-500 hover:text-blue-700 transition-colors" 
            aria-label={`Edit ${name}`}
          >
            <Edit size={16} className="mr-1" />
            <span className="text-xs">Edit</span>
          </button>
          
          <button 
            onClick={() => onDelete(user.id)}
            className="flex items-center text-red-500 hover:text-red-700 transition-colors" 
            aria-label={`Delete ${name}`}
          >
            <Trash2 size={16} className="mr-1" />
            <span className="text-xs">Delete</span>
          </button>
        </div>
      </td>
    </tr>
  );
};

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUsers = async () => {
    try {
      setRefreshing(true);
      const response = await API.get('/admin/users');
      setUsers(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.response?.data?.message || 'Failed to load users. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = () => {
    // Implement navigation to add user page or open modal
    console.log('Add user clicked');
  };

  const handleEditUser = (user) => {
    // Implement edit user functionality
    console.log('Edit user:', user);
  };

  const handleDeleteUser = (userId) => {
    // Implement delete confirmation and API call
    console.log('Delete user ID:', userId);
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchUsers();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 h-64">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-3"></div>
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <UsersIcon size={24} className="text-blue-600 mr-3" />
          <h1 className="text-2xl font-semibold text-gray-800">Users</h1>
        </div>
        
        <div className="flex space-x-3">
          <button 
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center px-3 py-2 bg-white border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={16} className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          
          <button 
            onClick={handleAddUser}
            className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            <Plus size={16} className="mr-2" />
            <span className="text-sm font-medium">Add User</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 rounded-lg border border-red-200 flex items-start">
          <AlertCircle size={20} className="text-red-500 mr-2 mt-0.5 flex-shrink-0" />
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        {users.length === 0 ? (
          <div className="py-12 text-center">
            <UsersIcon size={40} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No users to display.</p>
            <button 
              onClick={handleAddUser}
              className="mt-4 text-blue-500 hover:text-blue-700 font-medium"
            >
              Add your first user
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="pb-3 pt-1 px-2 font-medium">User</th>
                  <th className="pb-3 pt-1 px-2 font-medium">Role</th>
                  <th className="pb-3 pt-1 px-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <UserRow 
                    key={user.id} 
                    user={user} 
                    onEdit={handleEditUser}
                    onDelete={handleDeleteUser}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;