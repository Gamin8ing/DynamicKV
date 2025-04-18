import React from 'react';
import { Link } from 'react-router-dom';

const Start = () => {
  return (
    <div className="min-h-screen bg-white flex items-start justify-center pt-32 px-4">
      <div className="border border-gray-300 bg-white shadow-sm rounded-md p-8 w-full max-w-sm text-center space-y-5">
        <h1 className="text-xl font-medium text-gray-900">Sign in or create account</h1>
        <p className="text-sm text-gray-600">Start your journey by logging in or signing up below.</p>

        <div className="space-y-3">
          <Link
            to="/Userlogin"
            className="block w-full py-2 text-sm bg-sky-400 text-white font-medium rounded-sm hover:bg-gray-800 transition"
          >
            Login
          </Link>

          <Link
            to="/Usersignup"
            className="block w-full py-2 text-sm border border-sky-400 text-sky-400 font-medium rounded-sm hover:bg-gray-100 transition"
          >
            Sign Up
          </Link>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-4"></div>

        {/* Admin login link */}
        <div className="text-sm text-gray-500">
          Are you an admin?{' '}
          <Link
            to="/captainLogin"
            className="text-sky-500 hover:underline hover:text-sky-600"
          >
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Start;
