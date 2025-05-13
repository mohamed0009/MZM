import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Modal from '@/components/ui/Modal';
import GradientButton from '@/components/ui/GradientButton';
import { AlertTriangle } from 'lucide-react-native';
import Colors from '@/constants/Colors';

interface DeleteConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
}

export default function DeleteConfirmationModal({ 
  visible, 
  onClose, 
  onConfirm, 
  itemName 
}: DeleteConfirmationModalProps) {
  
  return (
    <Modal visible={visible} onClose={onClose} title="Delete Product">
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <AlertTriangle size={48} color={Colors.light.error} />
        </View>
        
        <Text style={styles.warningText}>
          Are you sure you want to delete <Text style={styles.highlightText}>{itemName}</Text>?
        </Text>
        
        <Text style={styles.descriptionText}>
          This action cannot be undone and will permanently remove this product from your inventory.
        </Text>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.cancelButton]} 
            onPress={onClose}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.deleteButton]}
            onPress={() => {
              onConfirm();
              onClose();
            }}
          >
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  iconContainer: {
    marginBottom: 16,
  },
  warningText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  highlightText: {
    fontFamily: 'Poppins-SemiBold',
    color: Colors.light.error,
  },
  descriptionText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#9CA3AF',
  },
  cancelButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#FFFFFF',
  },
  deleteButton: {
    backgroundColor: Colors.light.error,
  },
  deleteButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#FFFFFF',
  },
}); 