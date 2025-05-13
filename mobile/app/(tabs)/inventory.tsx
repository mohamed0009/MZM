import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, TextInput, RefreshControl, Alert, Platform, SafeAreaView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { fetchProducts, addProduct, updateProduct, deleteProduct } from '@/store/slices/productsSlice';
import Card from '@/components/ui/Card';
import { Search, Plus, CreditCard as Edit2, Trash2, Package } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import AddProductModal from '@/components/modals/AddProductModal';
import EditProductModal from '@/components/modals/EditProductModal';
import DeleteConfirmationModal from '@/components/modals/DeleteConfirmationModal';
import { Product } from '@/store/slices/productsSlice';

// Mock data for inventory items
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Paracetamol 500mg',
    description: 'Pain relief medication',
    category: 'Painkillers',
    stock: 150,
    price: 5.99,
    expiryDate: '2024-12-31',
  },
  {
    id: '2',
    name: 'Amoxicillin 250mg',
    description: 'Antibiotic medication',
    category: 'Antibiotics',
    stock: 75,
    price: 12.50,
    expiryDate: '2024-10-15',
  },
  {
    id: '3',
    name: 'Ibuprofen 400mg',
    description: 'Anti-inflammatory medication',
    category: 'Painkillers',
    stock: 200,
    price: 7.25,
    expiryDate: '2025-03-20',
  },
];

export default function InventoryScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading, error } = useSelector((state: RootState) => state.products);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products.length > 0 ? products : mockProducts);
  
  // Modal states
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showEditProduct, setShowEditProduct] = useState(false);
  const [showDeleteProduct, setShowDeleteProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);
  
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProducts(products.length > 0 ? products : mockProducts);
    } else {
      const filtered = (products.length > 0 ? products : mockProducts).filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products]);

  const onRefresh = () => {
    dispatch(fetchProducts());
  };

  const handleAddProduct = (productData: Omit<Product, 'id'>) => {
    dispatch(addProduct(productData))
      .unwrap()
      .then(() => {
        // Success notification could be added here
      })
      .catch(error => {
        Alert.alert('Error', 'Failed to add product. Please try again.');
      });
    setShowAddProduct(false);
  };

  const handleEditProduct = (product: Product) => {
    dispatch(updateProduct(product))
      .unwrap()
      .then(() => {
        // Success notification could be added here
      })
      .catch(error => {
        Alert.alert('Error', 'Failed to update product. Please try again.');
      });
    setShowEditProduct(false);
  };

  const handleDeleteProduct = () => {
    if (selectedProduct) {
      dispatch(deleteProduct(selectedProduct.id))
        .unwrap()
        .then(() => {
          // Success notification could be added here
        })
        .catch(error => {
          Alert.alert('Error', 'Failed to delete product. Please try again.');
        });
    }
  };

  const renderInventoryItem = ({ item }: { item: Product }) => {
    const formattedDate = new Date(item.expiryDate || Date.now()).toLocaleDateString();
    
    return (
      <Card style={styles.inventoryCard}>
        <View style={styles.inventoryHeader}>
          <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productCategory}>{item.category}</Text>
          </View>
        <View style={styles.stockContainer}>
            <Package size={16} color={Colors.light.gradientStart} style={styles.stockIcon} />
            <Text style={styles.stockValue}>{item.stock}</Text>
            <Text style={styles.stockLabel}>units</Text>
        </View>
      </View>
      
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Price</Text>
          <Text style={styles.priceValue}>${item.price.toFixed(2)}</Text>
      </View>
      
        <View style={styles.expiryContainer}>
          <Text style={styles.expiryLabel}>Expiry Date:</Text>
          <Text style={styles.expiryDate}>{formattedDate}</Text>
        </View>
      
      <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.editButton]}
            onPress={() => {
              setSelectedProduct(item);
              setShowEditProduct(true);
            }}
          >
          <Edit2 size={16} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => {
              setSelectedProduct(item);
              setShowDeleteProduct(true);
            }}
          >
          <Trash2 size={16} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
              placeholder="Search inventory..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>
      
      <FlatList
        data={filteredProducts}
          renderItem={renderInventoryItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
            <RefreshControl 
              refreshing={loading} 
              onRefresh={onRefresh}
              tintColor={Colors.light.gradientStart}
              colors={[Colors.light.gradientStart]} // Android
            />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
                {searchQuery.trim() !== '' ? 'No items match your search' : 'No inventory items available'}
            </Text>
          </View>
        }
      />
        
        {/* Floating Action Button */}
        <TouchableOpacity 
          style={[styles.fab, Platform.OS === 'ios' ? styles.fabIOS : null]}
          onPress={() => setShowAddProduct(true)}
        >
          <Plus size={24} color="#FFFFFF" />
        </TouchableOpacity>
        
        {/* Add Product Modal */}
        <AddProductModal 
          visible={showAddProduct}
          onClose={() => setShowAddProduct(false)}
          onSubmit={handleAddProduct}
        />
        
        {/* Edit Product Modal */}
        <EditProductModal 
          visible={showEditProduct}
          onClose={() => setShowEditProduct(false)}
          onSubmit={handleEditProduct}
          product={selectedProduct}
        />
        
        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal 
          visible={showDeleteProduct}
          onClose={() => setShowDeleteProduct(false)}
          onConfirm={handleDeleteProduct}
          itemName={selectedProduct?.name || ''}
      />
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
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: Platform.OS === 'ios' ? 12 : 16, // Adjusted padding for where header was
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: Platform.OS === 'ios' ? 10 : 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    // iOS-specific shadow
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      }
    }),
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: Platform.OS === 'ios' ? 36 : 44,
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#1F2937',
  },
  listContainer: {
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 88 : 72, // Extra padding at bottom for iOS
  },
  inventoryCard: {
    marginBottom: 16,
    borderRadius: Platform.OS === 'ios' ? 12 : 8,
    // iOS-specific shadow
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6, 
      },
      android: {
        elevation: 3,
      }
    }),
  },
  inventoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
    color: '#1F2937',
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#4B5563',
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: 8,
  },
  stockIcon: {
    marginRight: 4,
  },
  stockLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: Colors.light.gradientStart,
    marginLeft: 2,
  },
  stockValue: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.light.gradientStart,
  },
  priceContainer: {
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#9CA3AF',
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.light.gradientStart,
  },
  expiryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  expiryLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#9CA3AF',
  },
  expiryDate: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',

    color: '#4B5563',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Platform.OS === 'ios' ? 10 : 8,
    marginLeft: 8,
  },
  editButton: {
    backgroundColor: Colors.light.gradientStart,
  },
  deleteButton: {
    backgroundColor: Colors.light.error,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    marginLeft: 4,
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
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.light.gradientStart,
    justifyContent: 'center',
    alignItems: 'center',
    // Android-specific shadow
    elevation: 4,
  },
  fabIOS: {
    // iOS-specific styling for FAB
    width: 50,
    height: 50,
    borderRadius: 25,
    bottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4.5,
  },
});
