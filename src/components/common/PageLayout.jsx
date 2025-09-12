// Common Page Layout with AppBar and BottomNavBar
import React from 'react';
import AppBar from './AppBar';
import BottomNavBar from './BottomNavBar';

const PageLayout = ({ 
  children, 
  title,
  showBack = true,
  showSearch = false,
  showNotifications = false,
  showMenu = false,
  showBottomNav = true,
  appBarProps = {},
  className = "bg-gray-50"
}) => {
  return (
    <div className={`min-h-screen ${className}`}>
      {/* Fixed App Bar */}
      <AppBar 
        title={title}
        showBack={showBack}
        showSearch={showSearch}
        showNotifications={showNotifications}
        showMenu={showMenu}
        {...appBarProps}
      />
      
      {/* Main Content with proper spacing */}
      <main className={`pt-20 ${showBottomNav ? 'pb-16' : 'pb-4'} px-4`}>
        {children}
      </main>
      
      {/* Bottom Navigation */}
      {showBottomNav && <BottomNavBar />}
    </div>
  );
};

export default PageLayout;