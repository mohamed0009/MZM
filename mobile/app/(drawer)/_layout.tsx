import React, { useRef, useEffect } from 'react';
import { createDrawerNavigator, DrawerNavigationProp } from '@react-navigation/drawer';
import { Slot, useNavigation } from 'expo-router';
import { 
  LayoutGrid, 
  Package, 
  Users, 
  ShoppingCart, 
  Settings, 
  HelpCircle, 
  Info,
  FileBarChart,
  BellRing,
  FileCheck,
  Bell
} from 'lucide-react-native';
import CustomDrawer from '@/components/ui/CustomDrawer';
import TabsLayout from '../(tabs)/_layout';
import SettingsScreen from '../settings';
import HelpScreen from '../help';
import AboutScreen from '../about';
import Colors from '@/constants/Colors';
import { DrawerProvider, useDrawer } from '@/components/ui/DrawerContext';
import { Drawer } from 'expo-router/drawer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, LogBox } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Home } from 'lucide-react-native';

// Suppress specific warnings that might be related to react-native-gesture-handler
LogBox.ignoreLogs([
  "Sending `onAnimatedValueUpdate` with no listeners registered.",
  "Calling `getNode()` on the ref of an Animated component is no longer necessary."
]);

const DrawerNavigator = createDrawerNavigator();

// Wrapper component to connect our context to the drawer
function DrawerContent(props: any) {
  const drawerNavigation = useRef<DrawerNavigationProp<any>>(props.navigation);
  const { isDrawerOpen } = useDrawer();

  // Keep drawer state in sync with our context
  useEffect(() => {
    try {
      if (isDrawerOpen) {
        drawerNavigation.current?.openDrawer();
      } else {
        drawerNavigation.current?.closeDrawer();
      }
    } catch (error) {
      console.error("Error syncing drawer state:", error);
    }
  }, [isDrawerOpen]);

  return <CustomDrawer {...props} />;
}

function DrawerNavigatorComponent() {
  const { toggleDrawer } = useDrawer();

  // Handle actual drawer state changes from navigation
  const handleDrawerStateChange = (isOpen: boolean) => {
    try {
      toggleDrawer();
    } catch (error) {
      console.error("Error in drawer state change:", error);
    }
  };

  return (
    <DrawerNavigator.Navigator
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: Colors.light.gradientStart,
        drawerInactiveTintColor: '#6B7280',
        drawerLabelStyle: {
          marginLeft: -16,
          fontFamily: 'Poppins-Medium',
          fontSize: 15,
        },
        drawerItemStyle: {
          borderRadius: 8,
          paddingLeft: 8,
          marginHorizontal: 12,
        },
        drawerActiveBackgroundColor: 'rgba(16, 185, 129, 0.1)',
        drawerStyle: {
          width: 300,
          borderTopRightRadius: 24,
          borderBottomRightRadius: 24,
          elevation: 24,
          shadowColor: '#000',
          shadowOffset: { width: 4, height: 0 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
        },
      }}
    >
      <DrawerNavigator.Screen
        name="(tabs)"
        component={Slot}
        options={{
          drawerLabel: 'Dashboard',
          title: 'Dashboard',
          drawerIcon: ({ color, size }) => <LayoutGrid size={size} color={color} />,
        }}
      />
      <DrawerNavigator.Screen
        name="inventory"
        component={Slot}
        options={{
          drawerLabel: 'Inventory',
          title: 'Inventory',
          drawerIcon: ({ color, size }) => <Package size={size} color={color} />,
        }}
      />
      <DrawerNavigator.Screen
        name="clients"
        component={Slot}
        options={{
          drawerLabel: 'Clients',
          title: 'Clients',
          drawerIcon: ({ color, size }) => <Users size={size} color={color} />,
        }}
      />
      <DrawerNavigator.Screen
        name="sales"
        component={Slot}
        options={{
          drawerLabel: 'Sales',
          title: 'Sales',
          drawerIcon: ({ color, size }) => <ShoppingCart size={size} color={color} />,
        }}
      />
      <DrawerNavigator.Screen
        name="reports"
        component={Slot}
        options={{
          drawerLabel: 'Reports',
          title: 'Reports',
          drawerIcon: ({ color, size }) => <FileBarChart size={size} color={color} />,
        }}
      />
      <DrawerNavigator.Screen
        name="notifications"
        component={Slot}
        options={{
          drawerLabel: 'Notifications',
          title: 'Notifications',
          drawerIcon: ({ color, size }) => <Bell size={size} color={color} />,
        }}
      />
      <DrawerNavigator.Screen
        name="settings"
        component={SettingsScreen}
        options={{
          drawerLabel: 'Settings',
          title: 'Settings',
          drawerIcon: ({ color, size }) => <Settings size={size} color={color} />,
        }}
      />
      <DrawerNavigator.Screen
        name="help"
        component={HelpScreen}
        options={{
          drawerLabel: 'Help & Support',
          title: 'Help & Support',
          drawerIcon: ({ color, size }) => <HelpCircle size={size} color={color} />,
        }}
      />
      <DrawerNavigator.Screen
        name="about"
        component={AboutScreen}
        options={{
          drawerLabel: 'About',
          title: 'About',
          drawerIcon: ({ color, size }) => <Info size={size} color={color} />,
        }}
      />
    </DrawerNavigator.Navigator>
  );
}

export default function DrawerLayout() {
  const insets = useSafeAreaInsets();
  
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <DrawerProvider>
        <DrawerNavigatorComponent />
      </DrawerProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userName: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#1F2937',
  },
  userEmail: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  versionText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 4,
  },
}); 