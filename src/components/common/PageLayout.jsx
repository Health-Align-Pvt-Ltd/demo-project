// Common Page Layout with AppBar and BottomNavBar
import React, { useState } from 'react';
import AppBar from './AppBar';
import BottomNavBar from './BottomNavBar';
import NavigationDrawer from './NavigationDrawer';

const PageLayout = ({ 
  children, 
  title,
  subtitle,
  showBack = true,
  showSearch = false,
  showNotifications = false,
  showMenu = false,
  showDrawer = false,
  showBottomNav = true,
  backgroundColor,
  textColor,
  rightActions,
  appBarProps = {},
  className = "bg-gray-50"
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };
  return (
    <div className={`min-h-screen ${className}`}>
      {/* Fixed App Bar */}
      <AppBar 
        title={title}
        subtitle={subtitle}
        showBack={showBack}
        showSearch={showSearch}
        showNotifications={showNotifications}
        showMenu={showMenu}
        showDrawer={showDrawer}
        backgroundColor={backgroundColor}
        textColor={textColor}
        rightActions={rightActions}
        onDrawerToggle={handleDrawerToggle}
        {...appBarProps}
      />
      
      {/* Main Content with proper spacing */}
      <main className={`pt-16 ${showBottomNav ? 'pb-16' : 'pb-4'} px-4`}>
        {children}
      </main>
      
      {/* Bottom Navigation */}
      {showBottomNav && <BottomNavBar />}
      
      {/* Navigation Drawer */}
      {showDrawer && (
        <NavigationDrawer 
          isOpen={isDrawerOpen}
          onToggle={setIsDrawerOpen}
        />
      )}
    </div>
  );
};

export default PageLayout;