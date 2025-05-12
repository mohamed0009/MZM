import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Modal from '@/components/ui/Modal';
import TextInput from '@/components/ui/TextInput';
import GradientButton from '@/components/ui/GradientButton';
import { Search, Plus, Minus, ShoppingCart } from 'lucide-react-native';
import Colors from '@/constants/Colors';

interface NewSaleModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (sale: any) => void;
}

export default function NewSaleModal({ visible, onClose, onSubmit }: NewSaleModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  
  // Mock products data
  const products = [
    { id: '1', name: 'Paracetamol', price: 5.99, stock: 150 },
    { id: '2', name: 'Amoxicillin', price: 12.50, stock: 75 },
    { id: '3', name: 'Ibuprofen', price: 7.25, stock: 120 },
  ];

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addProduct = (product: any) => {
    const existing = selectedProducts.find(p => p.id === product.id);
    if (existing) {
      setSelectedProducts(selectedProducts.map(p =>
        p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
      ));
    } else {
      setSelectedProducts([...selectedProducts, { ...product, quantity: 1 }]);
    }
  };

  const removeProduct = (productId: string) => {
    setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setSelectedProducts(selectedProducts.map(p =>
      p.id === productId
        ? { ...p, quantity: Math.max(0, p.quantity + delta) }
        : p
    ).filter(p => p.quantity > 0));
  };

  const total = selectedProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0);

  const handleSubmit = () => {
    onSubmit({
      products: selectedProducts,
      total,
      date: new Date().toISOString(),
    });
    setSelectedProducts([]);
    setSearchQuery('');
    onClose();
  };

  return (
    <Modal visible={visible} onClose={onClose} title="New Sale">
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <TextInput
            label="Search Products"
            value={searchQuery}
            onChangeText={setSearchQuery}
            icon={<Search size={20} color="#9CA3AF" />}
            containerStyle={styles.searchInput}
          />
        </View>

        <ScrollView style={styles.productList}>
          {filteredProducts.map(product => (
            <TouchableOpacity
              key={product.id}
              style={styles.productItem}
              onPress={() => addProduct(product)}
            >
              <View>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
              </View>
              <Plus size={20} color={Colors.light.gradientStart} />
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.selectedProducts}>
          <Text style={styles.sectionTitle}>Selected Items</Text>
          {selectedProducts.map(product => (
            <View key={product.id} style={styles.selectedItem}>
              <Text style={styles.selectedItemName}>{product.name}</Text>
              <View style={styles.quantityControls}>
                <TouchableOpacity
                  onPress={() => updateQuantity(product.id, -1)}
                  style={styles.quantityButton}
                >
                  <Minus size={16} color={Colors.light.text} />
                </TouchableOpacity>
                <Text style={styles.quantity}>{product.quantity}</Text>
                <TouchableOpacity
                  onPress={() => updateQuantity(product.id, 1)}
                  style={styles.quantityButton}
                >
                  <Plus size={16} color={Colors.light.text} />
                </TouchableOpacity>
              </View>
              <Text style={styles.itemTotal}>
                ${(product.price * product.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalAmount}>${total.toFixed(2)}</Text>
          </View>
          <GradientButton
            title="Complete Sale"
            onPress={handleSubmit}
            disabled={selectedProducts.length === 0}
            icon={<ShoppingCart size={20} color="#FFFFFF" />}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 600,
    display: 'flex',
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchInput: {
    marginBottom: 0,
  },
  productList: {
    maxHeight: 200,
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    marginBottom: 8,
  },
  productName: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: Colors.light.text,
  },
  productPrice: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#6B7280',
  },
  selectedProducts: {
    flex: 1,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: Colors.light.text,
    marginBottom: 12,
  },
  selectedItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedItemName: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: Colors.light.text,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  quantityButton: {
    padding: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
  },
  quantity: {
    marginHorizontal: 12,
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: Colors.light.text,
  },
  itemTotal: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: Colors.light.gradientStart,
  },
  footer: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 16,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
    color: Colors.light.text,
  },
  totalAmount: {
    fontSize: 24,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.light.gradientStart,
  },
});