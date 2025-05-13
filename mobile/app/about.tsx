import React from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity, Linking } from 'react-native';
import { Info, Users, Code, Phone, Mail, ExternalLink, MapPin } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import AnimatedLogo from '@/components/ui/AnimatedLogo';
import Header from '@/components/ui/Header';
import Card from '@/components/ui/Card';

export default function AboutScreen() {
  const openLink = (url: string) => {
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  };

  return (
    <View style={styles.container}>
      <Header title="About" showBackButton={true} />
      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Info size={20} color={Colors.light.tint} />
            <Text style={styles.sectionTitle}>Our Mission</Text>
          </View>
          <Text style={styles.sectionText}>
            PharmaFlow aims to streamline pharmacy operations, enhance patient care, and improve medication management through intuitive and efficient software solutions.
          </Text>
        </Card>
        
        <Text style={styles.description}>
          PharmaFlow is a comprehensive pharmacy management system designed to streamline inventory, 
          sales, and customer management for pharmacies of all sizes.
        </Text>
        
        <Text style={styles.sectionTitle}>Features</Text>
        <Text style={styles.feature}>• Inventory Management</Text>
        <Text style={styles.feature}>• Sales Tracking</Text>
        <Text style={styles.feature}>• Customer Management</Text>
        <Text style={styles.feature}>• Analytics & Reporting</Text>
        
        <Text style={styles.copyright}>© 2023 PharmaFlow. All rights reserved.</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontFamily: 'Poppins-Medium',
    marginBottom: 4,
  },
  version: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#6B7280',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#374151',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
    marginBottom: 12,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  feature: {
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
    color: '#4B5563',
    marginBottom: 8,
    alignSelf: 'flex-start',
    paddingLeft: 10,
  },
  copyright: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#9CA3AF',
    marginTop: 40,
  },
  sectionCard: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#374151',
  },
}); 