import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ImageBackground, 
  Image, 
  TouchableOpacity,
  Platform,
  ScrollView
} from 'react-native';
import { 
  DrawerContentScrollView,
  DrawerItemList,
  DrawerContentComponentProps 
} from '@react-navigation/drawer';
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import { logout } from '@/store/slices/authSlice';
import { AppDispatch } from '@/store';
import { LinearGradient } from 'expo-linear-gradient';
import { LogOut, ChevronRight } from 'lucide-react-native';
import Colors from '@/constants/Colors';

export default function CustomDrawer(props: DrawerContentComponentProps) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  
  const handleLogout = async () => {
    await dispatch(logout());
    router.replace('/(auth)/login');
  };

  return (
    <View style={styles.container}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.drawerContent}
      >
        <LinearGradient
          colors={[Colors.light.gradientStart, Colors.light.gradientEnd]}
          style={styles.profileSection}
        >
          <View style={styles.profileContainer}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>JD</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>John Doe</Text>
              <Text style={styles.profileEmail}>john.doe@example.com</Text>
            </View>
          </View>
        </LinearGradient>
        
        <View style={styles.drawerItemsContainer}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
      
      <View style={styles.bottomSection}>
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>PharmaFlow v1.0.0</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <LogOut size={20} color={Colors.light.error} />
          <Text style={styles.logoutText}>Logout</Text>
          <ChevronRight size={16} color={Colors.light.error} style={styles.logoutArrow} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  drawerContent: {
    paddingBottom: 0,
  },
  profileSection: {
    padding: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 24,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 22,
    fontFamily: 'Poppins-Medium',
    color: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
    color: '#FFFFFF',
  },
  profileEmail: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  drawerItemsContainer: {
    flex: 1,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  bottomSection: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F1F1F1',
  },
  versionContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  versionText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#9CA3AF',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 12,
  },
  logoutText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: Colors.light.error,
  },
  logoutArrow: {
    opacity: 0.7,
  },
}); 