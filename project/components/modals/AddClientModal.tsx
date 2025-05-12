import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Modal from '@/components/ui/Modal';
import TextInput from '@/components/ui/TextInput';
import GradientButton from '@/components/ui/GradientButton';
import { Mail, Phone, User, MapPin } from 'lucide-react-native';

interface AddClientModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (client: any) => void;
}

export default function AddClientModal({ visible, onClose, onSubmit }: AddClientModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const handleSubmit = () => {
    onSubmit(formData);
    setFormData({ name: '', email: '', phone: '', address: '' });
    onClose();
  };

  return (
    <Modal visible={visible} onClose={onClose} title="Add New Client">
      <View style={styles.form}>
        <TextInput
          label="Full Name"
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
          icon={<User size={20} color="#9CA3AF" />}
        />
        <TextInput
          label="Email"
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
          keyboardType="email-address"
          autoCapitalize="none"
          icon={<Mail size={20} color="#9CA3AF" />}
        />
        <TextInput
          label="Phone"
          value={formData.phone}
          onChangeText={(text) => setFormData({ ...formData, phone: text })}
          keyboardType="phone-pad"
          icon={<Phone size={20} color="#9CA3AF" />}
        />
        <TextInput
          label="Address"
          value={formData.address}
          onChangeText={(text) => setFormData({ ...formData, address: text })}
          icon={<MapPin size={20} color="#9CA3AF" />}
        />
        <GradientButton
          title="Add Client"
          onPress={handleSubmit}
          style={styles.submitButton}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 16,
  },
  submitButton: {
    marginTop: 8,
  },
});