import React from 'react';
import { StyleSheet, View, Text, ScrollView, FlatList } from 'react-native';
import Header from '@/components/ui/Header';
import { BellRing, Clock } from 'lucide-react-native';
import Card from '@/components/ui/Card';
import Colors from '@/constants/Colors';

// Define the notification type
interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

// Mock notifications data
const notifications: Notification[] = [
  {
    id: '1',
    title: 'Low Stock Alert',
    message: 'Paracetamol 500mg is running low. Current stock: 15 units',
    time: '3 hours ago',
    read: false,
  },
  {
    id: '2',
    title: 'New Sale Completed',
    message: 'Sale #10456 was completed for $124.50',
    time: 'Yesterday',
    read: true,
  },
  {
    id: '3',
    title: 'Product Expiring Soon',
    message: 'Amoxicillin 250mg will expire in 30 days',
    time: '2 days ago',
    read: true,
  },
];

export default function NotificationsScreen() {
  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <Card style={[
      styles.notificationCard, 
      !item.read ? styles.unreadCard : null
    ] as any}>
      {!item.read && <View style={styles.unreadIndicator} />}
      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationMessage}>{item.message}</Text>
        <View style={styles.timeContainer}>
          <Clock size={14} color="#9CA3AF" />
          <Text style={styles.timeText}>{item.time}</Text>
        </View>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Header title="Notifications" showMenuButton={true} />
      
      <FlatList
        data={notifications}
        renderItem={renderNotificationItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <BellRing size={60} color={Colors.light.gradientStart} />
            <Text style={styles.emptyText}>No notifications yet</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  listContainer: {
    padding: 16,
  },
  notificationCard: {
    marginBottom: 12,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  unreadCard: {
    borderLeftWidth: 0,
  },
  unreadIndicator: {
    width: 4,
    backgroundColor: Colors.light.gradientStart,
  },
  notificationContent: {
    flex: 1,
    padding: 16,
  },
  notificationTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#1F2937',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#4B5563',
    marginBottom: 8,
    lineHeight: 20,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#9CA3AF',
    marginLeft: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
    color: '#6B7280',
    marginTop: 16,
  },
}); 