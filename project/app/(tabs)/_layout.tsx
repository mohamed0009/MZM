import React, { useEffect, useRef } from 'react';
import { Tabs } from 'expo-router';
import { Home, Package, Users, ShoppingCart, MoreHorizontal } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet, View, Platform, Dimensions, Animated } from 'react-native';
import { BlurView } from 'expo-blur';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const screenWidth = Dimensions.get('window').width;
  const tabBarHeight = Platform.OS === 'ios' ? 70 + insets.bottom : 70;
  
  // Define colors for minimalistic design
  const activeColor = '#10B981'; // Green highlight for active tabs
  const inactiveColor = '#94A3B8'; // Subtle gray for inactive tabs
  const backgroundColor = '#FFFFFF'; // Clean white background
  
  // Animation for Home button
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  useEffect(() => {
    const pulseTiming = Animated.timing(pulseAnim, {
      toValue: 1.1,
      duration: 1000,
      useNativeDriver: true,
    });
    
    const pulseTimingBack = Animated.timing(pulseAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    });
    
    Animated.loop(
      Animated.sequence([
        pulseTiming,
        pulseTimingBack,
      ])
    ).start();
    
    return () => {
      // Cleanup animation
      pulseAnim.stopAnimation();
    };
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: activeColor,
          tabBarInactiveTintColor: inactiveColor,
          tabBarStyle: {
            height: tabBarHeight,
            backgroundColor: Platform.OS === 'ios' ? 'transparent' : backgroundColor,
            borderTopWidth: 0,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.05,
            shadowRadius: 6,
            elevation: 8,
            ...styles.tabBar
          },
          tabBarBackground: () => (
            Platform.OS === 'ios' ? (
              <BlurView
                tint="light"
                intensity={80}
                style={StyleSheet.absoluteFill}
              />
            ) : null
          ),
          tabBarLabelStyle: {
            fontFamily: 'Poppins-Medium',
            fontSize: 11,
            lineHeight: 14,
            marginBottom: Platform.OS === 'ios' ? 8 : 6,
          },
          tabBarIconStyle: {
            marginTop: 8,
          },
          tabBarItemStyle: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: 3,
            height: Platform.OS === 'ios' ? 50 : 48,
            // Each tab takes exactly 1/5 of screen width
            width: screenWidth / 5,
          },
          tabBarShowLabel: true,
          tabBarHideOnKeyboard: true,
        }}
      >
        {/* Tab Order: Inventory, Clients, Home, Sales, More */}
        <Tabs.Screen
          name="inventory"
          options={{
            title: 'Inventory',
            tabBarIcon: ({ color, size }) => 
              <View style={styles.iconContainer}>
                <Package size={size - 2} color={color} strokeWidth={2} />
              </View>
          }}
        />
        <Tabs.Screen
          name="clients"
          options={{
            title: 'Clients',
            tabBarIcon: ({ color, size }) => 
              <View style={styles.iconContainer}>
                <Users size={size - 2} color={color} strokeWidth={2} />
              </View>
          }}
        />
        <Tabs.Screen
          name="index" // Using index route for Home
          options={{
            title: 'Home',
            tabBarIcon: ({ focused, size }) => (
              <Animated.View 
                style={[
                  styles.iconContainer, 
                  styles.primaryIconContainer, 
                  { transform: [{ scale: pulseAnim }] }
                ]}
              >
                <Home size={size} color="#FFFFFF" strokeWidth={2.2} />
              </Animated.View>
            ),
            tabBarLabel: () => null, // Hide label for floating button
            tabBarActiveTintColor: '#FFFFFF' // Ensure icon stays white when active
          }}
        />
        <Tabs.Screen
          name="sales"
          options={{
            title: 'Sales',
            tabBarIcon: ({ color, size }) => 
              <View style={styles.iconContainer}>
                <ShoppingCart size={size - 2} color={color} strokeWidth={2} />
              </View>
          }}
        />
        <Tabs.Screen
          name="more"
          options={{
            title: 'More',
            tabBarIcon: ({ color, size }) => 
              <View style={styles.iconContainer}>
                <MoreHorizontal size={size - 2} color={color} strokeWidth={2} />
              </View>
          }}
        />
        
        {/* Include sales/[id] but hide it completely */}
        
      </Tabs>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderColor: 'transparent',
    overflow: 'visible',
    borderTopColor: 'transparent',
    // Flex layout properties for tab bar
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between', // Make sure items are evenly distributed
    alignItems: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 36,
    height: 36,
    borderRadius: 12,
  },
  primaryIconContainer: {
    backgroundColor: '#10B981',
    borderRadius: 20,
    transform: [{ translateY: -18 }], // Raise button
    width: 56,
    height: 56,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
    position: 'absolute',
    top: 0, // Position from top
    alignSelf: 'center', // Center horizontally
    zIndex: 1, // Ensure button stays on top
  },
});