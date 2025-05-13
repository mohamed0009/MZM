import React, { useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, RefreshControl } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { fetchProducts } from '@/store/slices/productsSlice';
import Card from '@/components/ui/Card';
import { LineChart } from 'react-native-chart-kit';
import { LinearGradient } from 'expo-linear-gradient';
import { Package, Users, ShoppingCart, TriangleAlert as AlertTriangle } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import AnimatedLogo from '@/components/ui/AnimatedLogo';

export default function DashboardScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector((state: RootState) => state.products.products);
  const loading = useSelector((state: RootState) => state.products.loading);
  
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const onRefresh = () => {
    dispatch(fetchProducts());
  };

  // Mock chart data
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
        color: () => Colors.light.gradientStart,
        strokeWidth: 2,
      },
    ],
    legend: ['Sales'],
  };

  const chartConfig = {
    backgroundColor: '#FFFFFF',
    backgroundGradientFrom: '#FFFFFF',
    backgroundGradientTo: '#FFFFFF',
    decimalPlaces: 0,
    color: () => Colors.light.gradientStart,
    labelColor: () => '#6B7280',
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: Colors.light.gradientEnd,
    },
  };

  // KPI data
  const kpiData = [
    {
      title: 'Total Products',
      value: products.length,
      icon: <Package size={24} color={Colors.light.gradientStart} />,
      bgColor: 'rgba(16, 185, 129, 0.1)',
    },
    {
      title: 'Clients',
      value: 842,
      icon: <Users size={24} color="#3B82F6" />,
      bgColor: 'rgba(59, 130, 246, 0.1)',
    },
    {
      title: 'Sales Today',
      value: 28,
      icon: <ShoppingCart size={24} color="#8B5CF6" />,
      bgColor: 'rgba(139, 92, 246, 0.1)',
    },
    {
      title: 'Alerts',
      value: 3,
      icon: <AlertTriangle size={24} color="#F59E0B" />,
      bgColor: 'rgba(245, 158, 11, 0.1)',
    },
  ];

  // Recent transactions
  const recentTransactions = [
    { id: '1', client: 'John Doe', items: 5, total: 78.50, date: '1h ago' },
    { id: '2', client: 'Sarah Smith', items: 2, total: 45.25, date: '3h ago' },
    { id: '3', client: 'Michael Brown', items: 8, total: 124.99, date: '5h ago' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} />
        }
      >
        <LinearGradient
          colors={[Colors.light.gradientStart, Colors.light.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.welcomeBanner}
        >
          <View style={styles.bannerContent}>
            <View>
          <Text style={styles.welcomeText}>Welcome back, John</Text>
          <Text style={styles.todayText}>Today's Overview</Text>
            </View>
            <AnimatedLogo size={36} color="#FFFFFF" />
          </View>
        </LinearGradient>

        <View style={styles.kpiContainer}>
          {kpiData.map((kpi, index) => (
            <Card key={index} style={styles.kpiCard}>
              <View style={[styles.iconContainer, { backgroundColor: kpi.bgColor }]}>
                {kpi.icon}
              </View>
              <Text style={styles.kpiValue}>{kpi.value}</Text>
              <Text style={styles.kpiTitle}>{kpi.title}</Text>
            </Card>
          ))}
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Sales Performance</Text>
          <Card>
            <LineChart
              data={data}
              width={350}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          </Card>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          {recentTransactions.map((transaction) => (
            <Card key={transaction.id} style={styles.transactionCard}>
              <View style={styles.transactionHeader}>
                <Text style={styles.clientName}>{transaction.client}</Text>
                <Text style={styles.transactionDate}>{transaction.date}</Text>
              </View>
              <View style={styles.transactionDetails}>
                <Text style={styles.transactionItems}>{transaction.items} items</Text>
                <Text style={styles.transactionTotal}>${transaction.total.toFixed(2)}</Text>
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>
    </View>
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
  welcomeBanner: {
    padding: 24,
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 60,
  },
  bannerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
  },
  todayText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  kpiContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 16,
  },
  kpiCard: {
    width: '48%',
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  kpiValue: {
    fontSize: 24,
    fontFamily: 'Poppins-SemiBold',
    color: '#1F2937',
  },
  kpiTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#6B7280',
    marginTop: 4,
  },
  sectionContainer: {
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
    color: '#1F2937',
    marginBottom: 12,
  },
  chart: {
    marginTop: 8,
    borderRadius: 16,
  },
  transactionCard: {
    marginBottom: 12,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  clientName: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#1F2937',
  },
  transactionDate: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#6B7280',
  },
  transactionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  transactionItems: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#6B7280',
  },
  transactionTotal: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.light.gradientStart,
  },
});