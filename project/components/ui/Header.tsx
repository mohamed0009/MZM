import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ViewStyle, Platform } from 'react-native';
import { useNavigation, useRouter, usePathname } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Menu } from 'lucide-react-native';
import Colors from '@/constants/Colors';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  showMenuButton?: boolean;
  rightComponent?: React.ReactNode;
  containerStyle?: ViewStyle;
  onMenuPress?: () => void;
}

// Safely import the DrawerContext to prevent errors when used outside drawer
const useDrawerToggle = () => {
  try {
    // Dynamically import useDrawer
    const { useDrawer } = require('./DrawerContext');
    const drawer = useDrawer();
    return drawer?.toggleDrawer || (() => console.log('Drawer toggle not available'));
  } catch (error) {
    console.warn('Error importing DrawerContext:', error);
    // Return a no-op function if DrawerContext isn't available
    return () => console.log('Drawer context not available');
  }
};

export default function Header({
  title,
  showBackButton = false,
  showMenuButton = false,
  rightComponent,
  containerStyle,
  onMenuPress,
}: HeaderProps) {
  const navigation = useNavigation();
  const router = useRouter();
  const toggleDrawer = useDrawerToggle();

  const handleMenuPress = () => {
    try {
      if (onMenuPress) {
        onMenuPress();
      } else {
        // Try to toggle drawer
        toggleDrawer();
      }
    } catch (error) {
      console.error("Error handling menu press:", error);
      // Fallback to attempting direct navigation
      try {
        router.push("/");
      } catch (navError) {
        console.error("Navigation fallback failed:", navError);
      }
    }
  };

  const handleBackPress = () => {
    try {
      navigation.goBack();
    } catch (error) {
      console.error("Error navigating back:", error);
      try {
        router.back();
      } catch (routerError) {
        console.error("Router back navigation failed:", routerError);
        router.push("/");
      }
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <LinearGradient
        colors={[Colors.light.background, Colors.light.gradientStart]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.contentContainer}>
      <View style={styles.leftContainer}>
        {showBackButton && (
              <TouchableOpacity onPress={handleBackPress} style={styles.iconButton}>
                <ChevronLeft color={Colors.light.text} size={26} />
          </TouchableOpacity>
        )}
        {showMenuButton && (
              <TouchableOpacity onPress={handleMenuPress} style={styles.iconButton}>
                <Menu color={Colors.light.text} size={26} />
          </TouchableOpacity>
        )}
      </View>
          <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">{title}</Text>
      <View style={styles.rightContainer}>{rightComponent}</View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: Platform.OS === 'ios' ? 70 : 60,
    paddingTop: Platform.OS === 'ios' ? 10 : 0,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  leftContainer: {
    width: 50,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: Colors.light.text,
    marginHorizontal: 8,
  },
  rightContainer: {
    width: 50,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  iconButton: {
    padding: 10,
  },
});