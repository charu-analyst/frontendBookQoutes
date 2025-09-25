import React from 'react';
import { User } from 'lucide-react';

const Profile = ({ user, onLogout }) => {
  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-20">
      <div className="max-w-md mx-auto bg-white p-6 m-4 rounded-2xl shadow-lg">
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
          <p className="text-gray-600">{user.email}</p>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-blue-50 p-4 rounded-xl">
              <p className="text-2xl font-bold text-blue-600">12</p>
              <p className="text-sm text-gray-600">Quotes Liked</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-xl">
              <p className="text-2xl font-bold text-purple-600">5</p>
              <p className="text-sm text-gray-600">Quotes Shared</p>
            </div>
            <div className="bg-green-50 p-4 rounded-xl">
              <p className="text-2xl font-bold text-green-600">3</p>
              <p className="text-sm text-gray-600">Quotes Added</p>
            </div>
          </div>
          
          <button
            onClick={onLogout}
            className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 transition-all"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;




