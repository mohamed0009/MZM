import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Modal from '@/components/ui/Modal';
import TextInput from '@/components/ui/TextInput';
import GradientButton from '@/components/ui/GradientButton';
import { Package, Tag, FileText, Calendar, DollarSign, Hash } from 'lucide-react-native';
import Colors from '@/constants/Colors';

interface AddProductModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (product: any) => void;
}

export default function AddProductModal({ visible, onClose, onSubmit }: AddProductModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    expiryDate: '',
  });

  const handleSubmit = () => {
    onSubmit({
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock, 10),
    });
    setFormData({ name: '', description: '', price: '', stock: '', category: '', expiryDate: '' });
    onClose();
  };

  return (
    <Modal visible={visible} onClose={onClose} title="Add New Product">
      <View style={styles.form}>
        {/* Product basics section */}
        <TextInput
          label="Product Name"
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
          icon={<Package size={20} color="#9CA3AF" />}
        />
        
        <TextInput
          label="Description"
          value={formData.description}
          onChangeText={(text) => setFormData({ ...formData, description: text })}
          multiline
          numberOfLines={3}
          icon={<FileText size={20} color="#9CA3AF" />}
        />
        
        {/* Two column section for price and stock */}
        <View style={styles.row}>
        <TextInput
          label="Price"
          value={formData.price}
          onChangeText={(text) => setFormData({ ...formData, price: text })}
          keyboardType="decimal-pad"
            icon={<DollarSign size={20} color="#9CA3AF" />}
            containerStyle={styles.halfInput}
        />
          
        <TextInput
          label="Stock Quantity"
          value={formData.stock}
          onChangeText={(text) => setFormData({ ...formData, stock: text })}
          keyboardType="number-pad"
            icon={<Hash size={20} color="#9CA3AF" />}
            containerStyle={styles.halfInput}
        />
        </View>
        
        {/* Two column section for category and expiry */}
        <View style={styles.row}>
        <TextInput
          label="Category"
          value={formData.category}
          onChangeText={(text) => setFormData({ ...formData, category: text })}
          icon={<Tag size={20} color="#9CA3AF" />}
            containerStyle={styles.halfInput}
        />
          
        <TextInput
          label="Expiry Date"
          value={formData.expiryDate}
          onChangeText={(text) => setFormData({ ...formData, expiryDate: text })}
          placeholder="YYYY-MM-DD"
          icon={<Calendar size={20} color="#9CA3AF" />}
            containerStyle={styles.halfInput}
        />
        </View>
        
        <GradientButton
          title="Add Product"
          onPress={handleSubmit}
          style={styles.submitButton}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: -4,
  },
  halfInput: {
    flex: 1,
    marginHorizontal: 4,
  },
  submitButton: {
    marginTop: 16,
  },
});