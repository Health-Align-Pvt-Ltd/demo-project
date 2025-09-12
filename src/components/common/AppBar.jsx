// Fixed App Bar Component
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Bell, MoreVertical, Menu } from 'lucide-react';

const AppBar = ({ 
  title, 
  showBack = true, 
  showSearch = false, 
  showNotifications = false, 
  showMenu = false,
  showDrawer = false,
  onSearch,
  onNotificationClick,
  onMenuClick,
  onDrawerToggle,
  backgroundColor = 'bg-white',
  textColor = 'text-gray-900',
  subtitle = null,
  rightActions = null
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 ${backgroundColor} border-b border-gray-200 shadow-sm`}>
      <div className="flex items-center justify-between px-4 py-2 pt-10">
        {/* Left Section */}
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          {showDrawer && (
            <button
              onClick={onDrawerToggle}
              className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0"
            >
              <Menu className={`w-5 h-5 ${textColor}`} />
            </button>
          )}
          {showBack && !showDrawer && (
            <button
              onClick={handleBack}
              className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0"
            >
              <ArrowLeft className={`w-5 h-5 ${textColor}`} />
            </button>
          )}
          <div className="min-w-0 flex-1">
            <h1 className={`text-lg font-semibold ${textColor} truncate`}>
              {title}
            </h1>
            {subtitle && (
              <p className={`text-xs ${textColor} opacity-70 truncate`}>
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-1 flex-shrink-0">
          {rightActions || (
            <>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppBar;