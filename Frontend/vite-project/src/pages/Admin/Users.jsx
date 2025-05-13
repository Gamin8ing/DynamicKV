import React, { useEffect, useState } from "react";
import {
  Users as UsersIcon,
  Plus,
  Edit,
  Trash2,
  AlertCircle,
  RefreshCw,
  X,
} from "lucide-react";
import API from "../../utils/api";

const RoleIndicator = ({ role }) => {
  let roleStyle;

  if (role === "admin") {
    roleStyle = "text-purple-600 bg-purple-50";
  } else if (role === "manager") {
    roleStyle = "text-blue-600 bg-blue-50";
  } else {
    roleStyle = "text-green-600 bg-green-50";
  }

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleStyle}`}>
      {role || "user"}
    </span>
  );
};

const UserRow = ({ user, onEdit, onDelete }) => {
  const { _id, username = "usertrial", email, role, avatarUrl } = user;
  console.log(user, " <----- this is sf ");
  return (
    <tr
      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
      id={_id}
    >
      <td className="py-4 px-2">
        <div className="flex items-center">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={username}
              className="w-10 h-10 mr-3 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 mr-3 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-gray-500 font-medium">
                {username ? username.charAt(0).toUpperCase() : "trial"}
              </span>
            </div>
          )}
          <div>
            <span className="font-medium text-gray-800 block">{username}</span>
            <span className="text-gray-500 text-xs">{email}</span>
          </div>
        </div>
      </td>
      <td className="py-4 px-2">
        <RoleIndicator role={role || "user"} />
      </td>
      <td className="py-4 px-2">
        <div className="flex space-x-3">
          <button
            onClick={() => onEdit(user)}
            className="flex items-center text-blue-500 hover:text-blue-700 transition-colors"
            aria-label={`Edit ${username}`}
          >
            <Edit size={16} className="mr-1" />
            <span className="text-xs">Edit</span>
          </button>

          <button
            onClick={() => onDelete(user.id)}
            className="flex items-center text-red-500 hover:text-red-700 transition-colors"
            aria-label={`Delete ${username}`}
          >
            <Trash2 size={16} className="mr-1" />
            <span className="text-xs">Delete</span>
          </button>
        </div>
      </td>
    </tr>
  );
};

// New AddUserModal component
const AddUserModal = ({ isOpen, onClose, onAddUser }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "user",
    password: "",
    confirmPassword: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (!formData.username || !formData.email || !formData.password) {
      setError("All fields are required");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await API.post("/admin/users", formData);
      onAddUser(response.data);
      onClose();
      // Reset form
      setFormData({
        username: "",
        email: "",
        role: "user",
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error("Error adding user:", err);
      setError(
        err.response?.data?.message || "Failed to add user. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Add New User</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="p-3 mb-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="johndoe"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Role
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 flex items-center"
            >
              {isSubmitting && (
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              Save User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchUsers = async () => {
    try {
      setRefreshing(true);
      const response = await API.get("/admin/users");
      setUsers(response.data);
      console.log(response, " <---------------------");
      setError(null);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(
        err.response?.data?.message ||
          "Failed to load users. Please try again.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = () => {
    setIsAddModalOpen(true);
  };

  const handleUserAdded = (newUser) => {
    setUsers((prevUsers) => [...prevUsers, newUser]);
  };

  const handleEditUser = (user) => {
    // Implement edit user functionality
    console.log("Edit user:", user);
  };

  const handleDeleteUser = (userId) => {
    // Implement delete confirmation and API call
    console.log("Delete user ID:", userId);
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
            <RefreshCw
              size={16}
              className={`mr-2 ${refreshing ? "animate-spin" : ""}`}
            />
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
          <AlertCircle
            size={20}
            className="text-red-500 mr-2 mt-0.5 flex-shrink-0"
          />
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
                    key={user._id}
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

      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddUser={handleUserAdded}
      />
    </div>
  );
};

export default Users;

