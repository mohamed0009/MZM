import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, TextInput, SafeAreaView, Modal, ScrollView } from 'react-native';
import Card from '@/components/ui/Card';
import GradientButton from '@/components/ui/GradientButton';
import { Search, Calendar, User, FileText, ChevronRight, X, Filter, CreditCard, ShoppingBag, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';
import { useRouter } from 'expo-router';

// Interface for detailed sales item
interface SaleItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

// Extend Sale interface to include items details
interface Sale {
  id: string;
  date: string;
  customer: string;
  items: number;
  total: number;
  status: 'completed' | 'pending' | 'cancelled';
  // Add these for detailed view
  paymentMethod?: 'cash' | 'card' | 'transfer';
  note?: string;
  saleItems?: SaleItem[];
  // Additional fields for enhanced details
  transactionId?: string;
  cashier?: string;
  discount?: number;
  tax?: number;
  receiptNumber?: string;
  paymentDetails?: {
    cardType?: 'visa' | 'mastercard' | 'amex';
    cardLast4?: string;
    authCode?: string;
  };
}

// Mock sales data with additional fields
const salesData: Sale[] = [
  {
    id: '1',
    date: '2023-07-05',
    customer: 'Marie Dupont',
    items: 3,
    total: 45.99,
    status: 'completed',
    paymentMethod: 'card',
    note: 'Customer requested delivery for next purchase',
    saleItems: [
      { id: '1', name: 'Paracetamol 500mg', quantity: 1, price: 5.99 },
      { id: '2', name: 'Vitamin C 1000mg', quantity: 1, price: 12.50 },
      { id: '3', name: 'Antacid Tablets', quantity: 1, price: 27.50 }
    ],
    transactionId: 'TRX-23070501',
    cashier: 'John Smith',
    tax: 2.30,
    discount: 0,
    receiptNumber: 'R-10052',
    paymentDetails: {
      cardType: 'visa',
      cardLast4: '4582',
      authCode: 'AUTH2345'
    }
  },
  {
    id: '2',
    date: '2023-07-04',
    customer: 'Jean Martin',
    items: 1,
    total: 12.50,
    status: 'completed',
    paymentMethod: 'cash',
    saleItems: [
      { id: '1', name: 'Vitamin C 1000mg', quantity: 1, price: 12.50 }
    ],
    transactionId: 'TRX-23070402',
    cashier: 'John Smith',
    tax: 0.63,
    discount: 0,
    receiptNumber: 'R-10051'
  },
  {
    id: '3',
    date: '2023-07-03',
    customer: 'Sophie Lefevre',
    items: 5,
    total: 78.25,
    status: 'pending',
    paymentMethod: 'transfer',
    note: 'Pending payment confirmation',
    saleItems: [
      { id: '1', name: 'Paracetamol 500mg', quantity: 2, price: 11.98 },
      { id: '2', name: 'Ibuprofen 400mg', quantity: 1, price: 7.25 },
      { id: '3', name: 'Cough Syrup', quantity: 1, price: 15.99 },
      { id: '4', name: 'Allergy Relief', quantity: 1, price: 43.03 }
    ],
    transactionId: 'TRX-23070303',
    cashier: 'Jane Doe',
    tax: 3.91,
    discount: 0,
    receiptNumber: 'R-10050'
  },
  {
    id: '4',
    date: '2023-07-02',
    customer: 'Lucas Bernard',
    items: 2,
    total: 34.99,
    status: 'completed',
    paymentMethod: 'card',
    saleItems: [
      { id: '1', name: 'Multivitamins', quantity: 1, price: 22.50 },
      { id: '2', name: 'Ibuprofen 400mg', quantity: 1, price: 12.49 }
    ],
    transactionId: 'TRX-23070204',
    cashier: 'Jane Doe',
    tax: 1.75,
    discount: 0,
    receiptNumber: 'R-10049',
    paymentDetails: {
      cardType: 'mastercard',
      cardLast4: '8845',
      authCode: 'AUTH1122'
    }
  },
  {
    id: '5',
    date: '2023-07-01',
    customer: 'Camille Dubois',
    items: 4,
    total: 56.75,
    status: 'cancelled',
    paymentMethod: 'card',
    note: 'Customer cancelled due to payment issues',
    saleItems: [
      { id: '1', name: 'Pain Relief Gel', quantity: 1, price: 14.99 },
      { id: '2', name: 'Antibiotic Ointment', quantity: 1, price: 11.50 },
      { id: '3', name: 'Bandages', quantity: 1, price: 8.25 },
      { id: '4', name: 'Medical Tape', quantity: 1, price: 22.01 }
    ],
    transactionId: 'TRX-23070105',
    cashier: 'John Smith',
    tax: 2.84,
    discount: 0,
    receiptNumber: 'R-10048',
    paymentDetails: {
      cardType: 'visa',
      cardLast4: '1234',
      authCode: 'AUTH3456'
    }
  },
];

export default function SalesScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [sales, setSales] = useState(salesData);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<Sale['status'] | 'all'>('all');
  const [filterDateRange, setFilterDateRange] = useState<'all' | 'today' | 'week' | 'month'>('all');
  
  // Apply filters to sales data
  const filteredSales = sales.filter(sale => {
    // Search filter
    const matchesSearch = searchQuery.trim() === '' || 
      sale.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.date.includes(searchQuery);
    
    // Status filter
    const matchesStatus = filterStatus === 'all' || sale.status === filterStatus;
    
    // Date range filter
    let matchesDate = true;
    const saleDate = new Date(sale.date);
    const today = new Date();
    
    if (filterDateRange === 'today') {
      matchesDate = saleDate.toDateString() === today.toDateString();
    } else if (filterDateRange === 'week') {
      const lastWeek = new Date();
      lastWeek.setDate(today.getDate() - 7);
      matchesDate = saleDate >= lastWeek;
    } else if (filterDateRange === 'month') {
      const lastMonth = new Date();
      lastMonth.setMonth(today.getMonth() - 1);
      matchesDate = saleDate >= lastMonth;
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });
  
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  const handleViewDetails = (sale: Sale) => {
    router.push(`/sales/${sale.id}` as any);
  };
  
  const renderSaleItem = ({ item }: { item: Sale }) => {
    return (
    <Card style={styles.saleCard}>
        <View style={styles.saleCardHeader}>
          <View style={styles.saleDate}>
            <Calendar size={16} color="#6B7280" style={styles.saleIcon} />
            <Text style={styles.saleDateText}>{formatDate(item.date)}</Text>
          </View>
          <View style={[styles.statusBadge, getStatusStyle(item.status)]}>
            <Text style={[styles.statusText, getStatusTextStyle(item.status)]}>{item.status}</Text>
          </View>
        </View>
        
        <View style={styles.saleCustomer}>
          <User size={16} color="#6B7280" style={styles.saleIcon} />
          <Text style={styles.saleCustomerText}>{item.customer}</Text>
      </View>
      
      <View style={styles.saleDetails}>
          <View style={styles.saleInfo}>
            <FileText size={16} color="#6B7280" style={styles.saleIcon} />
            <Text style={styles.saleInfoText}>{item.items} items</Text>
        </View>
          <Text style={styles.saleTotal}>${item.total.toFixed(2)}</Text>
      </View>
      
        <TouchableOpacity 
          style={styles.viewButton} 
          onPress={() => handleViewDetails(item)}
        >
          <Text style={styles.viewButtonText}>View Details</Text>
        <ChevronRight size={16} color={Colors.light.gradientStart} />
      </TouchableOpacity>
    </Card>
  );
  };
  
  const getStatusStyle = (status: Sale['status']) => {
    switch (status) {
      case 'completed':
        return styles.statusCompleted;
      case 'pending':
        return styles.statusPending;
      case 'cancelled':
        return styles.statusCancelled;
      default:
        return {};
    }
  };
  
  const getStatusTextStyle = (status: Sale['status']) => {
    switch (status) {
      case 'completed':
        return { color: Colors.light.gradientStart };
      case 'pending':
        return { color: Colors.light.warning };
      case 'cancelled':
        return { color: Colors.light.error };
      default:
        return {};
    }
  };
  
  const getStatusIcon = (status: Sale['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={18} color={Colors.light.gradientStart} />;
      case 'pending':
        return <Clock size={18} color={Colors.light.warning} />;
      case 'cancelled':
        return <XCircle size={18} color={Colors.light.error} />;
      default:
        return <AlertCircle size={18} color="#9CA3AF" />;
    }
  };
  
  const getPaymentMethodName = (method?: 'cash' | 'card' | 'transfer') => {
    switch (method) {
      case 'cash': return 'Cash';
      case 'card': return 'Card';
      case 'transfer': return 'Bank Transfer';
      default: return 'Unknown';
    }
  };

  // Add this utility function to format card numbers
  const formatCardNumber = (last4?: string) => {
    return last4 ? `•••• •••• •••• ${last4}` : '';
  };
  
  // Completely rewrite the getCardTypeIcon function to ensure it's properly structured
  const getCardTypeIcon = (cardType?: 'visa' | 'mastercard' | 'amex') => {
    let cardColor = "#6B7280";
    
    if (cardType === 'visa') cardColor = "#1434CB";
    else if (cardType === 'mastercard') cardColor = "#EB001B";
    else if (cardType === 'amex') cardColor = "#2E77BC";
    
    return (
      <View style={{ marginRight: 6 }}>
        <CreditCard size={16} color={cardColor} />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.light.gradientStart, Colors.light.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.newSaleCard}
      >
        <View style={styles.newSaleContent}>
          <Text style={styles.newSaleTitle}>New Transaction</Text>
          <Text style={styles.newSaleText}>Create a new sale transaction</Text>
        </View>
        <GradientButton
          title="Start Sale"
          onPress={() => {}}
          style={styles.newSaleButton}
        />
      </LinearGradient>
      
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search sales..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>
      
      <View style={styles.filterContainer}>
        <Text style={styles.filterTitle}>Recent Sales</Text>
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setShowFilterModal(true)}
          >
            <Filter size={16} color={Colors.light.gradientStart} style={{ marginRight: 4 }} />
            <Text style={styles.filterText}>
              {filterStatus !== 'all' || filterDateRange !== 'all' 
                ? 'Filters applied' 
                : 'Filter'}
            </Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={filteredSales}
        renderItem={renderSaleItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
                {searchQuery.trim() !== '' || filterStatus !== 'all' || filterDateRange !== 'all'
                  ? 'No sales match your filters'
                  : 'No sales available'
                }
            </Text>
          </View>
        }
      />
        
        {/* Filter Modal */}
        <Modal
          visible={showFilterModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowFilterModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContainer, styles.filterModalContainer]}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Filter Sales</Text>
                <TouchableOpacity 
                  onPress={() => setShowFilterModal(false)}
                  style={styles.closeButton}
                >
                  <X size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>
              
              <ScrollView style={styles.modalContent}>
                <View style={styles.filterSection}>
                  <Text style={styles.filterSectionTitle}>Status</Text>
                  <View style={styles.filterOptions}>
                    {['all', 'completed', 'pending', 'cancelled'].map((status) => (
                      <TouchableOpacity
                        key={status}
                        style={[
                          styles.filterOption,
                          filterStatus === status && styles.filterOptionSelected
                        ]}
                        onPress={() => setFilterStatus(status as any)}
                      >
                        <Text 
                          style={[
                            styles.filterOptionText,
                            filterStatus === status && styles.filterOptionTextSelected
                          ]}
                        >
                          {status === 'all' ? 'All' : status}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                
                <View style={styles.filterSection}>
                  <Text style={styles.filterSectionTitle}>Date Range</Text>
                  <View style={styles.filterOptions}>
                    {[
                      { value: 'all', label: 'All Time' },
                      { value: 'today', label: 'Today' },
                      { value: 'week', label: 'This Week' },
                      { value: 'month', label: 'This Month' }
                    ].map((option) => (
                      <TouchableOpacity
                        key={option.value}
                        style={[
                          styles.filterOption,
                          filterDateRange === option.value && styles.filterOptionSelected
                        ]}
                        onPress={() => setFilterDateRange(option.value as any)}
                      >
                        <Text 
                          style={[
                            styles.filterOptionText,
                            filterDateRange === option.value && styles.filterOptionTextSelected
                          ]}
                        >
                          {option.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </ScrollView>
              
              <View style={styles.filterActions}>
                <TouchableOpacity 
                  style={styles.resetButton}
                  onPress={() => {
                    setFilterStatus('all');
                    setFilterDateRange('all');
                  }}
                >
                  <Text style={styles.resetButtonText}>Reset</Text>
                </TouchableOpacity>
                
                <GradientButton
                  title="Apply Filters"
                  onPress={() => setShowFilterModal(false)}
                  style={styles.applyButton}
                />
              </View>
            </View>
          </View>
        </Modal>
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  newSaleCard: {
    borderRadius: 16,
    margin: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  newSaleContent: {
    flex: 1,
  },
  newSaleTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  newSaleText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#FFFFFF',
    opacity: 0.8,
  },
  newSaleButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#1F2937',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  filterTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#1F2937',
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: `${Colors.light.gradientStart}15`,
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: Colors.light.gradientStart,
  },
  listContainer: {
    padding: 16,
    paddingTop: 8,
  },
  saleCard: {
    marginBottom: 16,
  },
  saleCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  saleDate: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  saleIcon: {
    marginRight: 6,
  },
  saleDateText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#4B5563',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusCompleted: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  statusPending: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
  },
  statusCancelled: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    textTransform: 'capitalize',
  },
  saleCustomer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  saleCustomerText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#1F2937',
  },
  saleDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  saleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  saleInfoText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#6B7280',
  },
  saleTotal: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.light.gradientStart,
  },
  viewButton: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  viewButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: Colors.light.gradientStart,
    marginRight: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#6B7280',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '90%',
    maxHeight: '90%',
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  filterModalContainer: {
    height: 480,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#1F2937',
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    flex: 1,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
  },
  transactionId: {
    flex: 1,
  },
  transactionIdLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#6B7280',
  },
  transactionIdValue: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#1F2937',
  },
  detailSection: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#6B7280',
    marginRight: 8,
    width: 120,
  },
  detailValue: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#1F2937',
    flex: 1,
  },
  statusBadgeLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusTextLarge: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    textTransform: 'capitalize',
    marginLeft: 6,
  },
  noteContainer: {
    marginTop: 8,
  },
  noteText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#4B5563',
    backgroundColor: '#F3F4F6',
    padding: 8,
    borderRadius: 6,
    marginTop: 4,
  },
  itemsContainer: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#1F2937',
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#1F2937',
  },
  itemQuantity: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#6B7280',
  },
  itemPrice: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.light.gradientStart,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  totalLabel: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#1F2937',
  },
  totalValue: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: Colors.light.gradientStart,
  },
  filterSection: {
    marginBottom: 20,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#1F2937',
    marginBottom: 12,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterOption: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
    marginBottom: 8,
  },
  filterOptionSelected: {
    backgroundColor: `${Colors.light.gradientStart}20`,
  },
  filterOptionText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#4B5563',
    textTransform: 'capitalize',
  },
  filterOptionTextSelected: {
    color: Colors.light.gradientStart,
  },
  filterActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 16,
  },
  resetButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 12,
    justifyContent: 'center',
  },
  resetButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#6B7280',
  },
  applyButton: {
    minWidth: 120,
  },
  paymentSection: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  paymentDetails: {
    marginTop: 8,
  },
  paymentMethod: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  paymentLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#6B7280',
    width: 90,
  },
  paymentMethodValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentValueText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#1F2937',
    marginLeft: 8,
  },
  summaryContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#1F2937',
  },
  discountValue: {
    color: Colors.light.error,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 16,
  },
  actionButtonSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: `${Colors.light.gradientStart}15`,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
  },
  actionButtonPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: Colors.light.gradientStart,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
  },
  actionIcon: {
    marginRight: 8,
  },
  actionButtonSecondaryText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: Colors.light.gradientStart,
  },
  actionButtonPrimaryText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#FFFFFF',
  },
});