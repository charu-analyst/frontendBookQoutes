import React from 'react';
import { Home, Search, Plus, User } from 'lucide-react';

const Navigation = ({ activeTab, onTabChange, user, onLogout }) => {
  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'search', icon: Search, label: 'Search' },
    { id: 'add', icon: Plus, label: 'Add' },
    { id: 'profile', icon: User, label: 'Profile' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center p-2 rounded-lg transition-all duration-200 ${
                activeTab === tab.id
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Icon className="h-6 w-6" />
              <span className="text-xs font-medium mt-1">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Navigation;