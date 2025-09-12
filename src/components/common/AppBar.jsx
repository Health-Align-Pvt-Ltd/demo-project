// Fixed App Bar Component
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Bell, MoreVertical } from 'lucide-react';

const AppBar = ({ 
  title, 
  showBack = true, 
  showSearch = false, 
  showNotifications = false, 
  showMenu = false,
  onSearch,
  onNotificationClick,
  onMenuClick,
  backgroundColor = 'bg-white',
  textColor = 'text-gray-900'
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 ${backgroundColor} border-b border-gray-200 shadow-sm`}>
      <div className="flex items-center justify-between px-4 py-3 pt-12">
        {/* Left Section */}
        <div className="flex items-center space-x-3">
          {showBack && (
            <button
              onClick={handleBack}
              className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className={`w-5 h-5 ${textColor}`} />
            </button>
          )}
          <h1 className={`text-lg font-semibold ${textColor} truncate`}>
            {title}
          </h1>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-1">
          {showSearch && (
            <button
              onClick={onSearch}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Search className={`w-5 h-5 ${textColor}`} />
            </button>
          )}
          
          {showNotifications && (
            <button
              onClick={onNotificationClick}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors relative"
            >
              <Bell className={`w-5 h-5 ${textColor}`} />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>
          )}
          
          {showMenu && (
            <button
              onClick={onMenuClick}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <MoreVertical className={`w-5 h-5 ${textColor}`} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppBar;