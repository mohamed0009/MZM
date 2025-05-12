import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList } from 'react-native';
import Card from '@/components/ui/Card';
import { CalendarDays, Clock, User, Package, Pill, Clipboard, Stethoscope } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import AnimatedLogo from '@/components/ui/AnimatedLogo';

// Define Event interface
interface Event {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'meeting' | 'delivery' | 'reminder' | 'appointment';
}

// Define Day interface
interface Day {
  id: string;
  day: string;
  date: string;
  isSelected: boolean;
  isToday: boolean;
}

export default function CalendarScreen() {
  // Get current date information
  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const [selectedMonth, setSelectedMonth] = useState(`${monthNames[currentMonth]} ${currentYear}`);
  const [selectedDay, setSelectedDay] = useState(currentDay.toString());
  const [days, setDays] = useState<Day[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  
  // Generate week days centered around today
  useEffect(() => {
    const generateWeekDays = () => {
      const daysArray: Day[] = [];
      
      // Start 3 days before today
      const startDate = new Date(currentYear, currentMonth, currentDay - 3);
      
      // Generate 7 days
      for (let i = 0; i < 7; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        
        const dayNum = date.getDate();
        const isToday = 
          date.getDate() === today.getDate() && 
          date.getMonth() === today.getMonth() && 
          date.getFullYear() === today.getFullYear();
        
        daysArray.push({
          id: i.toString(),
          day: dayNames[date.getDay()],
          date: dayNum.toString(),
          isSelected: isToday,
          isToday: isToday
        });
      }
      
      setDays(daysArray);
    };
    
    generateWeekDays();
  }, []);
  
  // Generate pharmacy-related events for the selected day
  useEffect(() => {
    const generateEvents = () => {
      const pharmEvents: Event[] = [
        {
          id: '1',
          title: 'Supplier Meeting - MedPharm Inc.',
          description: 'Quarterly review and new product catalog discussion',
          time: '09:00 - 10:30 AM',
          type: 'meeting',
        },
        {
          id: '2',
          title: 'Medication Delivery',
          description: 'Expected delivery of antibiotics and cardiovascular medications',
          time: '11:15 AM',
          type: 'delivery',
        },
        {
          id: '3',
          title: 'Prescription Refill Reminder',
          description: 'Send reminders to patients with prescriptions expiring this week',
          time: '01:00 PM',
          type: 'reminder',
        },
        {
          id: '4',
          title: 'Inventory Expiry Check',
          description: 'Review products expiring within 90 days and plan for promotions',
          time: '03:00 - 04:00 PM',
          type: 'reminder',
        },
        {
          id: '5',
          title: 'Customer Consultation',
          description: 'Scheduled medication review with Mr. Johnson (diabetes management)',
          time: '04:30 - 05:00 PM',
          type: 'appointment',
        },
      ];
      
      setEvents(pharmEvents);
    };
    
    generateEvents();
  }, [selectedDay]);
  
  const handleDaySelect = (id: string, date: string) => {
    setSelectedDay(date);
    
    // Update the days array to reflect the new selection
    const updatedDays = days.map(day => ({
      ...day,
      isSelected: day.id === id
    }));
    
    setDays(updatedDays);
  };
  
  const renderEventItem = ({ item }: { item: Event }) => {
    let IconComponent;
    let iconColor;
    
    switch (item.type) {
      case 'meeting':
        IconComponent = User;
        iconColor = Colors.light.gradientStart;
        break;
      case 'delivery':
        IconComponent = Package;
        iconColor = Colors.light.warning;
        break;
      case 'reminder':
        IconComponent = Clock;
        iconColor = '#3B82F6'; // blue
        break;
      case 'appointment':
        IconComponent = Stethoscope;
        iconColor = '#8B5CF6'; // purple
        break;
      default:
        IconComponent = CalendarDays;
        iconColor = Colors.light.gradientStart;
    }
    
    return (
      <Card style={styles.eventCard}>
        <View style={styles.eventItem}>
          <View style={[styles.eventIconContainer, { backgroundColor: `${iconColor}20` }]}>
            <IconComponent size={20} color={iconColor} />
          </View>
          <View style={styles.eventContent}>
            <Text style={styles.eventTitle}>{item.title}</Text>
            <Text style={styles.eventDescription}>{item.description}</Text>
            <Text style={styles.eventTime}>{item.time}</Text>
          </View>
        </View>
      </Card>
    );
  };

  const renderDayItem = ({ item }: { item: Day }) => {
    return (
      <TouchableOpacity 
        style={[
          styles.dayItem, 
          item.isSelected && styles.selectedDayItem,
          item.isToday && styles.todayItem
        ]}
        onPress={() => handleDaySelect(item.id, item.date)}
      >
        <Text style={[styles.dayText, item.isSelected && styles.selectedDayText]}>
          {item.day}
        </Text>
        <Text style={[styles.dateText, item.isSelected && styles.selectedDateText]}>
          {item.date}
        </Text>
        {item.isToday && <View style={styles.todayIndicator} />}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.pageTitle}>Calendar</Text>
        <AnimatedLogo size={32} color={Colors.light.tint} />
      </View>
      
      <View style={styles.content}>
        <View style={styles.calendarHeader}>
          <Text style={styles.monthText}>{selectedMonth}</Text>
          <View style={styles.calendarControls}>
            <TouchableOpacity style={styles.controlButton}>
              <Text style={styles.controlButtonText}>Today</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.weekView}>
          <FlatList
            data={days}
            renderItem={renderDayItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.daysContainer}
          />
        </View>
        
        <View style={styles.eventsSection}>
          <View style={styles.scheduleDateHeader}>
            <Text style={styles.sectionTitle}>Schedule</Text>
            <Text style={styles.scheduleDateText}>{selectedMonth.split(' ')[0]} {selectedDay}</Text>
          </View>
          <FlatList
            data={events}
            renderItem={renderEventItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.eventsContainer}
            ListEmptyComponent={
              <View style={styles.noEventsContainer}>
                <Text style={styles.noEventsText}>No events scheduled for this day</Text>
              </View>
            }
          />
        </View>
      </View>
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
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  monthText: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#1F2937',
  },
  calendarControls: {
    flexDirection: 'row',
  },
  controlButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.light.gradientStart + '20',
    borderRadius: 8,
  },
  controlButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: Colors.light.gradientStart,
  },
  weekView: {
    marginBottom: 24,
  },
  daysContainer: {
    paddingHorizontal: 8,
  },
  dayItem: {
    width: 60,
    height: 80,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 8,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    position: 'relative',
  },
  selectedDayItem: {
    backgroundColor: Colors.light.gradientStart,
  },
  todayItem: {
    borderWidth: 2,
    borderColor: Colors.light.gradientStart,
  },
  todayIndicator: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.light.gradientStart,
  },
  dayText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#6B7280',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#1F2937',
  },
  selectedDayText: {
    color: '#FFFFFF',
  },
  selectedDateText: {
    color: '#FFFFFF',
  },
  eventsSection: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scheduleDateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#1F2937',
  },
  scheduleDateText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: Colors.light.gradientStart,
  },
  eventsContainer: {
    paddingBottom: 16,
  },
  eventCard: {
    marginBottom: 12,
  },
  eventItem: {
    flexDirection: 'row',
    padding: 16,
  },
  eventIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#1F2937',
    marginBottom: 4,
  },
  eventDescription: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#6B7280',
    marginBottom: 8,
  },
  eventTime: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#9CA3AF',
  },
  noEventsContainer: {
    padding: 20,
    alignItems: 'center',
  },
  noEventsText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#6B7280',
  },
}); 