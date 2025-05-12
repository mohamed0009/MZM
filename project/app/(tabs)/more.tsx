import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import Card from '@/components/ui/Card';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { logout } from '@/store/slices/authSlice';
import { useRouter } from 'expo-router';
import { BellRing, CalendarDays, ChartBar as FileBarChart, Settings, Users, LogOut, CircleHelp as HelpCircle, ShieldCheck, User, Bell, Clock } from 'lucide-react-native';
import Colors from '@/constants/Colors';

// Define Alert interface
interface Alert {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'stock' | 'expiry' | 'order';
}

// Mock alerts data
const alertsData: Alert[] = [
  {
    id: '1',
    title: 'Low Stock Alert',
    message: 'Paracetamol stock is below 20 units',
    time: '2 hours ago',
    type: 'stock',
  },
  {
    id: '2',
    title: 'Expiry Alert',
    message: 'Amoxicillin batch #A245 expires in 30 days',
    time: '1 day ago',
    type: 'expiry',
  },
  {
    id: '3',
    title: 'Order Reminder',
    message: 'Order #ORD-2023-142 is pending confirmation',
    time: '2 days ago',
    type: 'order',
  },
];

export default function MoreScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  
  const handleLogout = async () => {
    await dispatch(logout());
    router.replace('/(auth)/login');
  };
  
  const menuItems = [
    {
      title: 'Alerts',
      icon: <BellRing size={24} color={Colors.light.gradientStart} />,
      route: '/alerts' as const,
    },
    {
      title: 'Calendar',
      icon: <CalendarDays size={24} color={Colors.light.gradientStart} />,
      route: '/calendar' as const,
    },
    {
      title: 'Reports',
      icon: <FileBarChart size={24} color={Colors.light.gradientStart} />,
      route: '/reports' as const,
    },
    {
      title: 'User Management',
      icon: <Users size={24} color={Colors.light.gradientStart} />,
      route: '/users' as const,
    },
    {
      title: 'Settings',
      icon: <Settings size={24} color={Colors.light.gradientStart} />,
      route: '/settings' as const,
    },
    {
      title: 'Help & Support',
      icon: <HelpCircle size={24} color={Colors.light.gradientStart} />,
      route: '/help' as const,
    },
    {
      title: 'Privacy & Security',
      icon: <ShieldCheck size={24} color={Colors.light.gradientStart} />,
      route: '/privacy' as const,
    },
  ];
  
  const renderAlertItem = (alert: Alert, index: number) => {
    let IconComponent;
    let iconColor;
    
    switch (alert.type) {
      case 'stock':
        IconComponent = Bell;
        iconColor = Colors.light.error;
        break;
      case 'expiry':
        IconComponent = Clock;
        iconColor = Colors.light.warning;
        break;
      case 'order':
        IconComponent = Bell;
        iconColor = Colors.light.gradientStart;
        break;
      default:
        IconComponent = Bell;
        iconColor = Colors.light.gradientStart;
    }
    
    return (
      <View key={alert.id} style={[styles.alertItem, index > 0 && styles.alertDivider]}>
        <View style={[styles.alertIconContainer, { backgroundColor: `${iconColor}20` }]}>
          <IconComponent size={20} color={iconColor} />
        </View>
        <View style={styles.alertContent}>
          <Text style={styles.alertTitle}>{alert.title}</Text>
          <Text style={styles.alertMessage}>{alert.message}</Text>
          <Text style={styles.alertTime}>{alert.time}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <User size={40} color="#FFFFFF" />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>John Doe</Text>
            <Text style={styles.profileEmail}>john.doe@example.com</Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Alerts</Text>
          <Card style={styles.alertsCard}>
            {alertsData.map((alert, index) => renderAlertItem(alert, index))}
            <TouchableOpacity 
              style={styles.viewAllButton}
              onPress={() => {
                router.push('/alerts' as any);
              }}
            >
              <Text style={styles.viewAllText}>View All Alerts</Text>
            </TouchableOpacity>
          </Card>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Menu</Text>
          <Card style={styles.menuCard}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.menuItem, index < menuItems.length - 1 && styles.menuDivider]}
                onPress={() => {
                  const route = item.route as any;
                  router.push(route);
                }}
              >
                <View style={styles.menuIconContainer}>{item.icon}</View>
                <Text style={styles.menuItemText}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </Card>
        </View>
        
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color={Colors.light.error} style={styles.logoutIcon} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
        
        <View style={styles.footer}>
          <Text style={styles.versionText}>PharmaFlow v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  profileImageContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.light.gradientStart,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#6B7280',
  },
  section: {
    marginHorizontal: 16,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
    color: '#1F2937',
    marginBottom: 12,
  },
  alertsCard: {
    padding: 0,
    overflow: 'hidden',
  },
  alertItem: {
    flexDirection: 'row',
    padding: 16,
  },
  alertDivider: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  alertIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#1F2937',
    marginBottom: 4,
  },
  alertMessage: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#4B5563',
    marginBottom: 4,
  },
  alertTime: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#9CA3AF',
  },
  viewAllButton: {
    padding: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  viewAllText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: Colors.light.gradientStart,
  },
  menuCard: {
    padding: 0,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  menuDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  menuIconContainer: {
    marginRight: 16,
  },
  menuItemText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#1F2937',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 16,
    padding: 16,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 12,
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: Colors.light.error,
  },
  footer: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 16,
  },
  versionText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#9CA3AF',
  },
});