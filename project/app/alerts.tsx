import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, StatusBar, ActivityIndicator } from 'react-native';
import Card from '@/components/ui/Card';
import { Bell, Clock, ShoppingCart, AlertCircle, CheckCircle, Filter, ChevronDown, ChevronUp, X, MoreVertical, Calendar } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import AnimatedLogo from '@/components/ui/AnimatedLogo';

// Define Alert interface
interface Alert {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'stock' | 'expiry' | 'order';
  read: boolean;
  priority: 'high' | 'medium' | 'low';
}

// Define Filter Option interface
interface FilterOption {
  id: string;
  label: string;
  value: string;
}

// Mock alerts data
const alertsData: Alert[] = [
  {
    id: '1',
    title: 'Low Stock Alert',
    message: 'Paracetamol stock is below 20 units',
    time: '2 hours ago',
    type: 'stock',
    read: false,
    priority: 'high',
  },
  {
    id: '2',
    title: 'Expiry Alert',
    message: 'Amoxicillin batch #A245 expires in 30 days',
    time: '1 day ago',
    type: 'expiry',
    read: false,
    priority: 'medium',
  },
  {
    id: '3',
    title: 'Order Reminder',
    message: 'Order #ORD-2023-142 is pending confirmation',
    time: '2 days ago',
    type: 'order',
    read: true,
    priority: 'medium',
  },
  {
    id: '4',
    title: 'Low Stock Alert',
    message: 'Ibuprofen stock is below 15 units',
    time: '3 days ago',
    type: 'stock',
    read: true,
    priority: 'high',
  },
  {
    id: '5',
    title: 'Expiry Alert',
    message: 'Aspirin batch #B123 expires in 45 days',
    time: '4 days ago',
    type: 'expiry',
    read: true,
    priority: 'low',
  },
  {
    id: '6',
    title: 'Order Reminder',
    message: 'Order #ORD-2023-139 has been delivered',
    time: '5 days ago',
    type: 'order',
    read: true,
    priority: 'low',
  },
];

export default function AlertsScreen() {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [showFilterOptions, setShowFilterOptions] = useState<boolean>(false);
  const [markAllAsRead, setMarkAllAsRead] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [alerts, setAlerts] = useState<Alert[]>(alertsData);

  // Filter options
  const filterOptions: FilterOption[] = [
    { id: 'all', label: 'All Alerts', value: 'all' },
    { id: 'unread', label: 'Unread', value: 'unread' },
    { id: 'stock', label: 'Low Stock', value: 'stock' },
    { id: 'expiry', label: 'Expiry', value: 'expiry' },
    { id: 'order', label: 'Orders', value: 'order' },
  ];

  // Filter alerts based on selected filter
  const filteredAlerts = alerts.filter(alert => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'unread') return !alert.read;
    return alert.type === activeFilter;
  });

  // Handle filter selection
  const handleFilterSelect = (filter: string) => {
    setActiveFilter(filter);
    setShowFilterOptions(false);
  };

  // Handle mark as read
  const handleMarkAsRead = (id: string) => {
    setAlerts(prevAlerts => 
      prevAlerts.map(alert => 
        alert.id === id ? { ...alert, read: true } : alert
      )
    );
  };

  // Handle mark all as read
  const handleMarkAllAsRead = () => {
    setAlerts(prevAlerts => 
      prevAlerts.map(alert => ({ ...alert, read: true }))
    );
    setMarkAllAsRead(true);
    
    // Simulate API call
    setTimeout(() => {
      setMarkAllAsRead(false);
    }, 1000);
  };

  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true);
    
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  // Get statistics
  const stats = {
    total: alerts.length,
    unread: alerts.filter(alert => !alert.read).length,
    high: alerts.filter(alert => alert.priority === 'high').length,
  };

  const renderAlertItem = ({ item }: { item: Alert }) => {
    let IconComponent;
    let iconColor;
    let borderColor;
    
    switch (item.type) {
      case 'stock':
        IconComponent = Bell;
        iconColor = Colors.light.error;
        borderColor = Colors.light.error;
        break;
      case 'expiry':
        IconComponent = Clock;
        iconColor = Colors.light.warning;
        borderColor = Colors.light.warning;
        break;
      case 'order':
        IconComponent = ShoppingCart;
        iconColor = Colors.light.gradientStart;
        borderColor = Colors.light.gradientStart;
        break;
      default:
        IconComponent = Bell;
        iconColor = Colors.light.gradientStart;
        borderColor = Colors.light.gradientStart;
    }
    
    return (
      <Card 
        style={[
          styles.alertCard, 
          !item.read && { borderLeftWidth: 3, borderLeftColor: borderColor }
        ] as any}
      >
        <TouchableOpacity 
          style={styles.alertItem}
          onPress={() => handleMarkAsRead(item.id)}
          activeOpacity={0.7}
        >
          <View style={[styles.alertIconContainer, { backgroundColor: `${iconColor}20` }]}>
            <IconComponent size={20} color={iconColor} />
          </View>
          <View style={styles.alertContent}>
            <View style={styles.alertHeader}>
              <Text style={styles.alertTitle}>{item.title}</Text>
              {item.priority === 'high' && (
                <View style={styles.priorityBadge}>
                  <AlertCircle size={12} color={Colors.light.error} style={{ marginRight: 4 }} />
                  <Text style={styles.priorityText}>High</Text>
                </View>
              )}
            </View>
            <Text style={styles.alertMessage}>{item.message}</Text>
            <View style={styles.alertFooter}>
              <View style={styles.timeContainer}>
                <Calendar size={12} color="#9CA3AF" style={styles.timeIcon} />
                <Text style={styles.alertTime}>{item.time}</Text>
              </View>
              {item.read ? (
                <View style={styles.readIndicator}>
                  <CheckCircle size={12} color={Colors.light.gradientStart} style={styles.readIcon} />
                  <Text style={styles.readText}>Read</Text>
                </View>
              ) : (
                <TouchableOpacity 
                  style={styles.markReadButton}
                  onPress={() => handleMarkAsRead(item.id)}
                >
                  <Text style={styles.markReadText}>Mark as read</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
          <TouchableOpacity style={styles.moreButton}>
            <MoreVertical size={16} color="#9CA3AF" />
          </TouchableOpacity>
        </TouchableOpacity>
      </Card>
    );
  };
  
  const ListEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Bell size={32} color={Colors.light.gradientStart} />
      </View>
      <Text style={styles.emptyTitle}>No alerts found</Text>
      <Text style={styles.emptyText}>There are no alerts matching your current filter</Text>
      <TouchableOpacity 
        style={styles.resetButton}
        onPress={() => setActiveFilter('all')}
      >
        <Text style={styles.resetButtonText}>Reset filters</Text>
      </TouchableOpacity>
    </View>
  );
  
  const ListHeaderComponent = () => (
    <>
      <View style={styles.statsContainer}>
        <View style={[
          styles.statCard,
          { backgroundColor: `${Colors.light.gradientStart}15` }
        ]}>
          <Text style={[styles.statValue, { color: Colors.light.gradientStart }]}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={[
          styles.statCard,
          { backgroundColor: `${Colors.light.warning}15` }
        ]}>
          <Text style={[styles.statValue, { color: Colors.light.warning }]}>{stats.unread}</Text>
          <Text style={styles.statLabel}>Unread</Text>
        </View>
        <View style={[
          styles.statCard,
          { backgroundColor: `${Colors.light.error}15` }
        ]}>
          <Text style={[styles.statValue, { color: Colors.light.error }]}>{stats.high}</Text>
          <Text style={styles.statLabel}>High Priority</Text>
        </View>
      </View>
      
      <View style={styles.filtersRow}>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilterOptions(!showFilterOptions)}
        >
          <Filter size={16} color={Colors.light.gradientStart} style={styles.filterIcon} />
          <Text style={styles.filterText}>
            {filterOptions.find(option => option.value === activeFilter)?.label || 'All Alerts'}
          </Text>
          {showFilterOptions ? (
            <ChevronUp size={16} color="#9CA3AF" />
          ) : (
            <ChevronDown size={16} color="#9CA3AF" />
          )}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.markAllReadButton,
            { opacity: stats.unread > 0 ? 1 : 0.5 }
          ]}
          onPress={handleMarkAllAsRead}
          disabled={stats.unread === 0 || markAllAsRead}
        >
          {markAllAsRead ? (
            <ActivityIndicator size="small" color={Colors.light.gradientStart} />
          ) : (
            <Text style={styles.markAllReadText}>Mark all as read</Text>
          )}
        </TouchableOpacity>
      </View>
      
      {showFilterOptions && (
        <View style={styles.filterOptions}>
          {filterOptions.map(option => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.filterOption,
                activeFilter === option.value && styles.activeFilterOption
              ]}
              onPress={() => handleFilterSelect(option.value)}
            >
              <Text 
                style={[
                  styles.filterOptionText,
                  activeFilter === option.value && styles.activeFilterOptionText
                ]}
              >
                {option.label}
              </Text>
              {activeFilter === option.value && (
                <Check size={16} color={Colors.light.gradientStart} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.pageTitle}>Alerts & Notifications</Text>
        <AnimatedLogo size={32} color={Colors.light.tint} />
      </View>
      
      <View style={styles.content}>
        <View style={styles.filterContainer}>
         {/* ... rest of filters */}
        </View>
      <FlatList
        data={filteredAlerts}
        renderItem={renderAlertItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={ListEmptyComponent}
        onRefresh={handleRefresh}
        refreshing={refreshing}
      />
      </View>
    </View>
  );
}

// Custom Check icon component
function Check({size, color}: {size: number, color: string}) {
  return (
    <View style={{ width: size, height: size }}>
      <View style={{
        width: size,
        height: size / 2,
        borderBottomWidth: 2,
        borderLeftWidth: 2,
        borderColor: color,
        transform: [{ rotate: '-45deg' }],
        position: 'absolute',
        bottom: size / 4,
        left: size / 4
      }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingTop: 60,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  pageTitle: {
    fontSize: 22,
    fontFamily: 'Poppins-SemiBold',
    color: '#1F2937',
  },
  content: {
    flex: 1,
    paddingTop: 16,
  },
  filterContainer: {
    // ... rest of filter container styles
  },
  listContainer: {
    padding: 16,
    paddingTop: 0,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#1F2937',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#6B7280',
  },
  filtersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderLeftWidth: 3,
    borderLeftColor: Colors.light.gradientStart,
  },
  filterIcon: {
    marginRight: 6,
  },
  filterText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#1F2937',
    marginRight: 6,
  },
  markAllReadButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderLeftWidth: 3,
    borderLeftColor: Colors.light.gradientStart,
  },
  markAllReadText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: Colors.light.gradientStart,
  },
  filterOptions: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    borderLeftWidth: 3,
    borderLeftColor: Colors.light.gradientStart,
  },
  filterOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  activeFilterOption: {
    backgroundColor: `${Colors.light.gradientStart}15`,
    borderLeftWidth: 3,
    borderLeftColor: Colors.light.gradientStart,
  },
  filterOptionText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#1F2937',
  },
  activeFilterOptionText: {
    fontFamily: 'Poppins-Medium',
    color: Colors.light.gradientStart,
  },
  alertCard: {
    marginBottom: 12,
    padding: 0,
    overflow: 'hidden',
  },
  alertItem: {
    flexDirection: 'row',
    padding: 16,
  },
  alertIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  alertTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#1F2937',
    flex: 1,
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: `${Colors.light.error}30`,
  },
  priorityText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: Colors.light.error,
  },
  alertMessage: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#6B7280',
    marginBottom: 8,
    lineHeight: 20,
  },
  alertFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeIcon: {
    marginRight: 4,
  },
  alertTime: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#9CA3AF',
  },
  readIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readIcon: {
    marginRight: 4,
  },
  readText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: Colors.light.gradientStart,
  },
  markReadButton: {
    padding: 4,
  },
  markReadText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: Colors.light.gradientStart,
  },
  moreButton: {
    padding: 4,
    justifyContent: 'center',
    height: 24,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    marginTop: 24,
  },
  emptyIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: `${Colors.light.gradientStart}15`,
    borderWidth: 1,
    borderColor: `${Colors.light.gradientStart}30`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
    color: '#1F2937',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  resetButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: `${Colors.light.gradientStart}15`,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: `${Colors.light.gradientStart}30`,
  },
  resetButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: Colors.light.gradientStart,
  },
}); 