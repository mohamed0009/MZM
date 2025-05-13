import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DrawerContextType {
  toggleDrawer: () => void;
  isDrawerOpen: boolean;
}

// Create a default implementation for when the context is used outside provider
const defaultValue: DrawerContextType = {
  toggleDrawer: () => {
    console.warn('DrawerContext used outside of DrawerProvider');
  },
  isDrawerOpen: false,
};

const DrawerContext = createContext<DrawerContextType>(defaultValue);

export const useDrawer = () => {
  try {
    const context = useContext(DrawerContext);
    // If context is undefined, it means we're using it outside provider
    if (!context) {
      return defaultValue;
    }
    return context;
  } catch (error) {
    console.warn('Error accessing DrawerContext:', error);
    return defaultValue;
  }
};

interface DrawerProviderProps {
  children: ReactNode;
  onDrawerToggle?: (isOpen: boolean) => void;
}

export const DrawerProvider = ({ children, onDrawerToggle }: DrawerProviderProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    try {
      const newState = !isDrawerOpen;
      setIsDrawerOpen(newState);
      if (onDrawerToggle) {
        onDrawerToggle(newState);
      }
    } catch (error) {
      console.error("Error toggling drawer:", error);
    }
  };

  return (
    <DrawerContext.Provider value={{ toggleDrawer, isDrawerOpen }}>
      {children}
    </DrawerContext.Provider>
  );
}; 