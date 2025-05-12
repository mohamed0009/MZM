import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import TextInput from '@/components/ui/TextInput';
import GradientButton from '@/components/ui/GradientButton';
import { Mail, ArrowLeft } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import AnimatedLogo from '@/components/ui/AnimatedLogo';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordReset = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address.');
      return;
    }
    
    setIsLoading(true);
    // --- Placeholder for actual password reset logic ---
    console.log('Attempting password reset for:', email);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500)); 
    // --- End Placeholder ---
    setIsLoading(false);
    
    Alert.alert(
      'Check Your Email', 
      'If an account exists for this email, a password reset link has been sent.',
      [{ text: 'OK', onPress: () => router.replace('/login') }] // Go back to login after alert
    );
    setEmail(''); // Clear email field
  };

  return (
    <LinearGradient
      colors={[Colors.light.gradientStart, Colors.light.gradientEnd]}
      style={styles.background}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <AnimatedLogo size={48} color={Colors.light.gradientStart} />
            </View>
            <Text style={styles.appName}>PharmaFlow</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>
              Enter the email address associated with your account, and we'll send you a link to reset your password.
            </Text>

            <TextInput
              label="Email"
              placeholder="your.email@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              icon={<Mail size={20} color="#9CA3AF" />}
              editable={!isLoading}
              containerStyle={{ marginBottom: 20 }}
            />

            <GradientButton
              title={isLoading ? 'Sending...' : 'Send Reset Link'}
              onPress={handlePasswordReset}
              isLoading={isLoading}
              style={{ marginBottom: 16 }}
            />
            
            <TouchableOpacity onPress={() => router.replace('/login')} style={styles.loginLink}>
              <Text style={styles.loginLinkText}>Back to Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  appName: {
    fontSize: 28,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.light.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  loginLink: {
    marginTop: 24,
    alignItems: 'center',
  },
  loginLinkText: {
    color: Colors.light.tint,
    fontSize: 15,
    fontFamily: 'Poppins-Medium',
  },
}); 