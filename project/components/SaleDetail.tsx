import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, SafeAreaView, Image, Animated, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FileText, ChevronLeft, CreditCard, ShoppingBag, Clock, CheckCircle, XCircle, AlertCircle, ArrowLeft, Printer } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

// Import the SaleItem and Sale interfaces from the main sales page
interface SaleItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Sale {
  id: string;
  date: string;
  customer: string;
  items: number;
  total: number;
  status: 'completed' | 'pending' | 'cancelled';
  paymentMethod?: 'cash' | 'card' | 'transfer';
  note?: string;
  saleItems?: SaleItem[];
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

// Mock sales data (we'll use the same data as in the sales.tsx file)
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

// Pre-define all text components to ensure no unwrapped text
const PriceText = ({ children }: { children: React.ReactNode }) => (
  <Text>{children}</Text>
);

const ItemQuantityText = ({ item }: { item: SaleItem }) => (
  <Text style={styles.itemQuantity}>
    {item.quantity} x ${item.price.toFixed(2)}
  </Text>
);

const ItemPriceText = ({ item }: { item: SaleItem }) => (
  <Text style={styles.itemPrice}>
    ${(item.quantity * item.price).toFixed(2)}
  </Text>
);

const SubtotalText = ({ value }: { value: number }) => (
  <Text style={styles.summaryValue}>
    ${value.toFixed(2)}
  </Text>
);

const TaxText = ({ value }: { value: number }) => (
  <Text style={styles.summaryValue}>
    ${value.toFixed(2)}
  </Text>
);

const DiscountText = ({ value }: { value: number }) => (
  <Text style={[styles.summaryValue, styles.discountValue]}>
    -${value.toFixed(2)}
  </Text>
);

const TotalText = ({ value }: { value: number }) => (
  <Text style={styles.totalValue}>
    ${value.toFixed(2)}
  </Text>
);

// Payment method text component
const PaymentMethodText = ({ method }: { method?: 'cash' | 'card' | 'transfer' }) => (
  <Text style={styles.paymentValueText}>
    {method === 'cash' ? 'Cash' : 
     method === 'card' ? 'Card' : 
     method === 'transfer' ? 'Bank Transfer' : 
     'Unknown'}
  </Text>
);

// Format card number text component
// const CardNumberText = ({ last4 }: { last4: string }) => (
//   <Text>•••• •••• •••• {last4}</Text>
// );

export default function SaleDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [sale, setSale] = useState<Sale | null>(null);
  const scrollY = React.useRef(new Animated.Value(0)).current;
  const [isPrinting, setIsPrinting] = useState(false);

  // Animated header opacity based on scroll
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.9],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    // Find the sale with the matching ID
    const foundSale = salesData.find(s => s.id === id);
    setSale(foundSale || null);
  }, [id]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
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
  
  const formatCardNumber = (last4?: string): string | null => {
    return last4 ? `•••• •••• •••• ${last4}` : null;
  };
  
  const getPaymentMethodName = (method?: 'cash' | 'card' | 'transfer'): string => {
    switch (method) {
      case 'cash': return 'Cash';
      case 'card': return 'Card';
      case 'transfer': return 'Bank Transfer';
      default: return 'Unknown';
    }
  };
  
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

  // Function to generate HTML receipt content
  const generateReceiptHTML = (sale: Sale) => {
    // Get method name as string for HTML
    const methodStr = getPaymentMethodName(sale.paymentMethod);
    
    // Format the sale items for HTML
    const itemsHTML = sale.saleItems?.map(item => 
      `<div class="item-row">
        <div>${item.name}</div>
        <div class="item-detail">
          <span>${item.quantity} x $${item.price.toFixed(2)}</span>
          <span>$${(item.quantity * item.price).toFixed(2)}</span>
        </div>
      </div>`
    ).join('') || '';

    // Format the discount section
    const discountHTML = sale.discount && sale.discount > 0 
      ? `<div class="info-row">
          <span>Discount:</span>
          <span>-$${sale.discount.toFixed(2)}</span>
        </div>`
      : '';
    
    // Format the tax section
    const taxHTML = sale.tax && sale.tax > 0 
      ? `<div class="info-row">
          <span>Tax:</span>
          <span>$${sale.tax.toFixed(2)}</span>
        </div>`
      : '';
    
    // Format the card details section
    const cardDetailsHTML = sale.paymentMethod === 'card' && sale.paymentDetails?.cardLast4 
      ? `<div class="info-row">
          <span>Card:</span>
          <span>${formatCardNumber(sale.paymentDetails.cardLast4)}</span>
        </div>`
      : '';
    
    // Format the transaction ID section
    const transactionHTML = sale.transactionId 
      ? `<div class="info-row">
          <span>Transaction ID:</span>
          <span>${sale.transactionId}</span>
        </div>`
      : '';

    return `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
          <style>
            body {
              font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
              padding: 20px;
              max-width: 300px;
              margin: 0 auto;
            }
            .header {
              text-align: center;
              margin-bottom: 20px;
            }
            .store-name {
              font-size: 18px;
              font-weight: bold;
            }
            .receipt-title {
              font-size: 16px;
              margin: 10px 0;
            }
            .info-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 5px;
              font-size: 12px;
            }
            .divider {
              border-top: 1px dashed #ccc;
              margin: 10px 0;
            }
            .item-row {
              margin-bottom: 5px;
              font-size: 12px;
            }
            .item-detail {
              display: flex;
              justify-content: space-between;
            }
            .total-row {
              display: flex;
              justify-content: space-between;
              font-weight: bold;
              margin-top: 10px;
              font-size: 14px;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              font-size: 12px;
            }
            .status {
              text-align: center;
              padding: 5px;
              margin: 10px 0;
              font-weight: bold;
              border-radius: 4px;
            }
            .completed {
              background-color: #d1fae5;
              color: #065f46;
            }
            .pending {
              background-color: #fef3c7;
              color: #92400e;
            }
            .cancelled {
              background-color: #fee2e2;
              color: #b91c1c;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="store-name">PharmaFlow</div>
            <div class="receipt-title">Sales Receipt</div>
          </div>
          
          <div class="info-row">
            <span>Receipt #:</span>
            <span>${sale.receiptNumber || sale.id}</span>
          </div>
          <div class="info-row">
            <span>Date:</span>
            <span>${formatDate(sale.date)}</span>
          </div>
          <div class="info-row">
            <span>Customer:</span>
            <span>${sale.customer}</span>
          </div>
          <div class="info-row">
            <span>Cashier:</span>
            <span>${sale.cashier || 'Staff'}</span>
          </div>
          
          <div class="status ${sale.status}">
            ${sale.status.toUpperCase()}
          </div>
          
          <div class="divider"></div>
          
          <div>
            ${itemsHTML}
          </div>
          
          <div class="divider"></div>
          
          <div class="info-row">
            <span>Subtotal:</span>
            <span>$${(sale.total - (sale.tax || 0)).toFixed(2)}</span>
          </div>
          
          ${discountHTML}
          
          ${taxHTML}
          
          <div class="total-row">
            <span>Total:</span>
            <span>$${sale.total.toFixed(2)}</span>
          </div>
          
          <div class="divider"></div>
          
          <div class="info-row">
            <span>Payment Method:</span>
            <span>${methodStr}</span>
          </div>
          
          ${cardDetailsHTML}
          
          ${transactionHTML}
          
          <div class="footer">
            <p>Thank you for your purchase!</p>
            <p>PharmaFlow - Your Health, Our Priority</p>
          </div>
        </body>
      </html>
    `;
  };

  // Function to print receipt
  const printReceipt = async () => {
    if (!sale) return;
    
    try {
      setIsPrinting(true);
      
      // Generate HTML for the receipt
      const html = generateReceiptHTML(sale);
      
      // Print the receipt
      const { uri } = await Print.printToFileAsync({ html });
      
      // Check if sharing is available
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Share or Print Receipt',
          UTI: 'com.adobe.pdf',
        });
      } else {
        Alert.alert(
          'Sharing not available',
          'Sharing is not available on this device'
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Could not print receipt');
      console.error('Printing error: ', error);
    } finally {
      setIsPrinting(false);
    }
  };

  // Function to start a new sale
  const startNewSale = () => {
    Alert.alert(
      'New Sale',
      'Start a new sale transaction?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Yes',
          onPress: () => router.push('/sales'),
        }
      ]
    );
  };

  if (!sale) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <LinearGradient
          colors={[Colors.light.gradientStart, Colors.light.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientHeader}
        >
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Sale Details</Text>
          <View style={{ width: 24 }} />
        </LinearGradient>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Sale not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Animated Gradient Header */}
      <Animated.View style={{ opacity: headerOpacity }}>
        <LinearGradient
          colors={[Colors.light.gradientStart, Colors.light.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientHeader}
        >
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Sale Details</Text>
          <View style={{ width: 24 }} />
        </LinearGradient>
      </Animated.View>

      {/* Elegant StatusBar with transaction info */}
      <View style={styles.statusContainer}>
        <View style={styles.transactionInfo}>
          <Text style={styles.transactionLabel}>Invoice #{sale.receiptNumber || sale.id}</Text>
          <Text style={styles.transactionDate}>{formatDate(sale.date)}</Text>
        </View>
        <View style={[styles.statusBadge, getStatusStyle(sale.status)]}>
          {getStatusIcon(sale.status)}
          <Text style={[styles.statusText, getStatusTextStyle(sale.status)]}>
            {sale.status}
          </Text>
        </View>
      </View>

      <Animated.ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {/* Customer Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Customer Details</Text>
          </View>
          <View style={styles.cardContent}>
            <View style={styles.customerRow}>
              <Text style={styles.customerName}>{sale.customer}</Text>
              <Text style={styles.customerDetail}>Served by: {sale.cashier || 'Staff'}</Text>
            </View>
            
            {sale.note && (
              <View style={styles.noteContainer}>
                <Text style={styles.noteText}>{sale.note}</Text>
              </View>
            )}
          </View>
        </View>
          
        {/* Payment Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Payment Information</Text>
          </View>
          <View style={styles.cardContent}>
            <View style={styles.paymentRow}>
              <View style={styles.paymentLabel}>
                <Text style={styles.paymentLabelText}>Method</Text>
              </View>
              <View style={styles.paymentValue}>
                {sale.paymentMethod === 'card' && sale.paymentDetails?.cardType && 
                  getCardTypeIcon(sale.paymentDetails.cardType)
                }
                <PaymentMethodText method={sale.paymentMethod} />
                {/* Render card number details only if available */}
                {sale.paymentMethod === 'card' && sale.paymentDetails?.cardLast4 ? (
                  <Text style={styles.paymentCardNumber}> ({formatCardNumber(sale.paymentDetails.cardLast4)})</Text>
                ) : null}
              </View>
            </View>
            
            {sale.paymentMethod === 'card' && sale.paymentDetails?.authCode && (
              <View style={styles.paymentRow}>
                <View style={styles.paymentLabel}>
                  <Text style={styles.paymentLabelText}>Auth Code</Text>
                </View>
                <View style={styles.paymentValue}>
                  <Text style={styles.paymentValueText}>{sale.paymentDetails.authCode}</Text>
                </View>
              </View>
            )}

            <View style={styles.paymentRow}>
              <View style={styles.paymentLabel}>
                <Text style={styles.paymentLabelText}>Transaction ID</Text>
              </View>
              <View style={styles.paymentValue}>
                <Text style={styles.paymentValueText}>{sale.transactionId || '-'}</Text>
              </View>
            </View>
          </View>
        </View>
          
        {/* Items Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Items</Text>
          </View>
          <View style={[styles.cardContent, styles.noPadding]}>
            {sale.saleItems?.map((item, index) => (
              <View key={index} style={[
                styles.itemRow,
                index === sale.saleItems!.length - 1 ? styles.lastItemRow : null
              ]}>
                <View style={styles.itemDetails}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <View style={styles.itemMeta}>
                    <ItemQuantityText item={item} />
                  </View>
                </View>
                <ItemPriceText item={item} />
              </View>
            ))}
            
            {/* Summary Section */}
            {sale && (
              <View style={styles.summaryContainer}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Subtotal</Text>
                  <SubtotalText value={(sale.total - (sale.tax || 0))} />
                </View>
                
                {sale.discount && sale.discount > 0 && (
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Discount</Text>
                    <DiscountText value={sale.discount} />
                  </View>
                )}
                
                {sale.tax && sale.tax > 0 && (
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Tax</Text>
                    <TaxText value={sale.tax} />
                  </View>
                )}
                
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Total</Text>
                  <TotalText value={sale.total} />
                </View>
              </View>
            )}
          </View>
        </View>
        
        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={[styles.secondaryButton, isPrinting && styles.disabledButton]}
            onPress={printReceipt}
            disabled={isPrinting}
          >
            <Printer size={20} color={isPrinting ? '#9CA3AF' : Colors.light.gradientStart} />
            <Text style={[styles.secondaryButtonText, isPrinting && styles.disabledButtonText]}>
              {isPrinting ? 'Processing...' : 'Print Receipt'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={startNewSale}
          >
            <ShoppingBag size={20} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>New Sale</Text>
          </TouchableOpacity>
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  gradientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    height: 64,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  transactionDate: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'capitalize',
    marginLeft: 6,
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
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  cardContent: {
    padding: 16,
  },
  noPadding: {
    padding: 0,
  },
  customerRow: {
    marginBottom: 12,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  customerDetail: {
    fontSize: 14,
    color: '#6B7280',
  },
  noteContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: Colors.light.gradientStart,
  },
  noteText: {
    fontSize: 14,
    color: '#4B5563',
    fontStyle: 'italic',
  },
  paymentRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center',
  },
  paymentLabel: {
    width: 100,
  },
  paymentLabelText: {
    fontSize: 14,
    color: '#6B7280',
  },
  paymentValue: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentValueText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  paymentCardNumber: {
    color: '#6B7280',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  lastItemRow: {
    borderBottomWidth: 0,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  itemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemQuantity: {
    fontSize: 13,
    color: '#6B7280',
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.light.gradientStart,
  },
  summaryContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    backgroundColor: '#F9FAFB',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  discountValue: {
    color: Colors.light.error,
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
    fontWeight: '600',
    color: '#111827',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.gradientStart,
  },
  actionsContainer: {
    flexDirection: 'row',
    marginTop: 8,
    marginBottom: 24,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.light.gradientStart,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.gradientStart,
    marginLeft: 8,
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: Colors.light.gradientStart,
    borderRadius: 12,
    marginLeft: 8,
    elevation: 2,
    shadowColor: Colors.light.gradientStart,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  disabledButton: {
    backgroundColor: '#F3F4F6',
    borderColor: '#D1D5DB',
  },
  disabledButtonText: {
    color: '#9CA3AF',
  },
}); 