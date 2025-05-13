import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Switch, Modal, TextInput, Alert, Image } from 'react-native';
import { User, Bell, Moon, Globe, Shield, Info, ChevronRight, X, Check, Key, Languages, LogOut, Camera, ArrowLeft } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { router } from 'expo-router';
import { useDispatch } from 'react-redux';
import { logout } from '@/store/slices/authSlice';
import AnimatedLogo from '@/components/ui/AnimatedLogo';

interface SettingItem {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  type: 'toggle' | 'navigation' | 'info';
  value?: boolean;
}

// Profile information interface
interface ProfileInfo {
  name: string;
  email: string;
  phone: string;
  position: string;
  avatar: string | null;
}

// Security settings interface
interface SecuritySettings {
  password: string;
  twoFactorEnabled: boolean;
  loginNotifications: boolean;
}

// Language option interface
interface LanguageOption {
  id: string;
  name: string;
  code: string;
  selected: boolean;
}

export default function SettingsScreen() {
  const dispatch = useDispatch<any>();
  // App settings
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    biometrics: true,
    autoUpdate: false,
    analytics: true,
  });

  // Modal states
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [securityModalVisible, setSecurityModalVisible] = useState(false);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [logoutConfirmVisible, setLogoutConfirmVisible] = useState(false);

  // Profile information state
  const [profileInfo, setProfileInfo] = useState<ProfileInfo>({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    position: 'Pharmacy Manager',
    avatar: null,
  });

  // Security settings state
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    password: '••••••••',
    twoFactorEnabled: true,
    loginNotifications: false,
  });

  // Language options
  const [languages, setLanguages] = useState<LanguageOption[]>([
    { id: 'en', name: 'English', code: 'en-US', selected: true },
    { id: 'es', name: 'Spanish', code: 'es-ES', selected: false },
    { id: 'fr', name: 'French', code: 'fr-FR', selected: false },
    { id: 'de', name: 'German', code: 'de-DE', selected: false },
    { id: 'zh', name: 'Chinese', code: 'zh-CN', selected: false },
  ]);

  // Toggle app settings
  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Toggle security settings
  const toggleSecuritySetting = (key: keyof Omit<SecuritySettings, 'password'>) => {
    setSecuritySettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Select language
  const selectLanguage = (id: string) => {
    setLanguages(prev => 
      prev.map(lang => ({
        ...lang,
        selected: lang.id === id
      }))
    );
  };

  // Update profile info
  const updateProfileInfo = (field: keyof ProfileInfo, value: string) => {
    setProfileInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle logout
  const handleLogout = () => {
    // Show confirmation dialog
    setLogoutConfirmVisible(true);
  };

  // Confirm logout
  const confirmLogout = () => {
    setLogoutConfirmVisible(false);
    
    // Dispatch logout action
    dispatch(logout());
    
    // Navigate to login screen
    setTimeout(() => {
      router.replace('/');
    }, 500);
  };

  // Open navigation routes
  const handleNavigation = (id: string) => {
    switch(id) {
      case 'profile':
        setProfileModalVisible(true);
        break;
      case 'security':
        setSecurityModalVisible(true);
        break;
      case 'language':
        setLanguageModalVisible(true);
        break;
      default:
        break;
    }
  };

  // Save profile changes
  const saveProfileChanges = () => {
    Alert.alert('Success', 'Profile information updated successfully');
    setProfileModalVisible(false);
  };

  // Save security changes
  const saveSecurityChanges = () => {
    Alert.alert('Success', 'Security settings updated successfully');
    setSecurityModalVisible(false);
  };

  // Save language changes
  const saveLanguageChanges = () => {
    const selectedLang = languages.find(lang => lang.selected);
    Alert.alert('Success', `Language changed to ${selectedLang?.name}`);
    setLanguageModalVisible(false);
  };

  const settingsSections = [
    {
      title: 'Account',
      items: [
        {
          id: 'profile',
          title: 'Profile Information',
          description: 'Manage your personal information',
          icon: User,
          type: 'navigation' as const,
        },
        {
          id: 'security',
          title: 'Security Settings',
          description: 'Password, authentication settings',
          icon: Shield,
          type: 'navigation' as const,
        },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          id: 'notifications',
          title: 'Notifications',
          description: 'Manage alerts and notifications',
          icon: Bell,
          type: 'toggle' as const,
          value: settings.notifications,
        },
        {
          id: 'darkMode',
          title: 'Dark Mode',
          description: 'Toggle light/dark appearance',
          icon: Moon,
          type: 'toggle' as const,
          value: settings.darkMode,
        },
        {
          id: 'language',
          title: 'Language',
          description: 'Set your preferred language',
          icon: Globe,
          type: 'navigation' as const,
        },
      ],
    },
    {
      title: 'App Settings',
      items: [
        {
          id: 'biometrics',
          title: 'Biometric Login',
          description: 'Use fingerprint or face ID to login',
          icon: Shield,
          type: 'toggle' as const,
          value: settings.biometrics,
        },
        {
          id: 'autoUpdate',
          title: 'Auto Update Data',
          description: 'Automatically refresh data in background',
          icon: Info,
          type: 'toggle' as const,
          value: settings.autoUpdate,
        },
        {
          id: 'analytics',
          title: 'Usage Analytics',
          description: 'Send anonymous usage data to improve app',
          icon: Info,
          type: 'toggle' as const,
          value: settings.analytics,
        },
      ],
    },
  ];

  const renderSettingItem = (item: SettingItem) => {
    return (
      <TouchableOpacity 
        key={item.id} 
        style={styles.settingItem}
        onPress={() => {
          if (item.type === 'toggle') {
            toggleSetting(item.id as keyof typeof settings);
          } else if (item.type === 'navigation') {
            handleNavigation(item.id);
          }
        }}
      >
        <View style={[styles.iconContainer, { backgroundColor: `${Colors.light.gradientStart}15` }]}>
          <item.icon size={20} color={Colors.light.gradientStart} />
        </View>
        <View style={styles.settingContent}>
          <Text style={styles.settingTitle}>{item.title}</Text>
          <Text style={styles.settingDescription}>{item.description}</Text>
        </View>
        {item.type === 'toggle' ? (
          <Switch
            value={item.value}
            onValueChange={() => toggleSetting(item.id as keyof typeof settings)}
            trackColor={{ false: '#E5E7EB', true: `${Colors.light.gradientStart}50` }}
            thumbColor={item.value ? Colors.light.gradientStart : '#fff'}
          />
        ) : (
          <ChevronRight size={20} color="#9CA3AF" />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.pageTitle}>Settings</Text>
        
        {settingsSections.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionContent}>
              {section.items.map(renderSettingItem)}
            </View>
          </View>
        ))}
        
        <View style={styles.footer}>
          <Text style={styles.version}>PharmaFlow v1.0.0</Text>
          <TouchableOpacity onPress={handleLogout}>
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Profile Information Modal */}
      <Modal
        visible={profileModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setProfileModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity 
                style={styles.backButton} 
                onPress={() => setProfileModalVisible(false)}
              >
                <ArrowLeft size={20} color="#6B7280" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Profile Information</Text>
              <TouchableOpacity 
                style={styles.saveButton} 
                onPress={saveProfileChanges}
              >
                <Check size={20} color={Colors.light.gradientStart} />
              </TouchableOpacity>
            </View>

            <View style={styles.avatarSection}>
              <View style={styles.avatarContainer}>
                <User size={64} color="#FFFFFF" />
              </View>
              <TouchableOpacity style={styles.changeAvatarButton}>
                <Camera size={18} color={Colors.light.gradientStart} />
                <Text style={styles.changeAvatarText}>Change photo</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                value={profileInfo.name}
                onChangeText={(text) => updateProfileInfo('name', text)}
                placeholder="Enter your full name"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={styles.input}
                value={profileInfo.email}
                onChangeText={(text) => updateProfileInfo('email', text)}
                placeholder="Enter your email address"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                value={profileInfo.phone}
                onChangeText={(text) => updateProfileInfo('phone', text)}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Position</Text>
              <TextInput
                style={styles.input}
                value={profileInfo.position}
                onChangeText={(text) => updateProfileInfo('position', text)}
                placeholder="Enter your job position"
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Security Settings Modal */}
      <Modal
        visible={securityModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSecurityModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity 
                style={styles.backButton} 
                onPress={() => setSecurityModalVisible(false)}
              >
                <ArrowLeft size={20} color="#6B7280" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Security Settings</Text>
              <TouchableOpacity 
                style={styles.saveButton} 
                onPress={saveSecurityChanges}
              >
                <Check size={20} color={Colors.light.gradientStart} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={styles.securityItem}
              onPress={() => Alert.alert('Change Password', 'A password reset link has been sent to your email.')}
            >
              <View style={[styles.securityIconContainer, { backgroundColor: `${Colors.light.gradientStart}15` }]}>
                <Key size={20} color={Colors.light.gradientStart} />
              </View>
              <View style={styles.securityContent}>
                <Text style={styles.securityTitle}>Change Password</Text>
                <Text style={styles.securityValue}>{securitySettings.password}</Text>
              </View>
              <ChevronRight size={20} color="#9CA3AF" />
            </TouchableOpacity>

            <View style={styles.securityItem}>
              <View style={[styles.securityIconContainer, { backgroundColor: `${Colors.light.gradientStart}15` }]}>
                <Shield size={20} color={Colors.light.gradientStart} />
              </View>
              <View style={styles.securityContent}>
                <Text style={styles.securityTitle}>Two-Factor Authentication</Text>
                <Text style={styles.securityDescription}>Add an extra layer of security</Text>
              </View>
              <Switch
                value={securitySettings.twoFactorEnabled}
                onValueChange={() => toggleSecuritySetting('twoFactorEnabled')}
                trackColor={{ false: '#E5E7EB', true: `${Colors.light.gradientStart}50` }}
                thumbColor={securitySettings.twoFactorEnabled ? Colors.light.gradientStart : '#fff'}
              />
            </View>

            <View style={styles.securityItem}>
              <View style={[styles.securityIconContainer, { backgroundColor: `${Colors.light.gradientStart}15` }]}>
                <Bell size={20} color={Colors.light.gradientStart} />
              </View>
              <View style={styles.securityContent}>
                <Text style={styles.securityTitle}>Login Notifications</Text>
                <Text style={styles.securityDescription}>Get alerts for new sign-ins</Text>
              </View>
              <Switch
                value={securitySettings.loginNotifications}
                onValueChange={() => toggleSecuritySetting('loginNotifications')}
                trackColor={{ false: '#E5E7EB', true: `${Colors.light.gradientStart}50` }}
                thumbColor={securitySettings.loginNotifications ? Colors.light.gradientStart : '#fff'}
              />
            </View>

            <TouchableOpacity
              style={[styles.securityAction, styles.dangerAction]}
              onPress={() => Alert.alert(
                'Reset Security Settings',
                'Are you sure you want to reset all security settings to default?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { 
                    text: 'Reset', 
                    style: 'destructive',
                    onPress: () => {
                      setSecuritySettings({
                        password: '••••••••',
                        twoFactorEnabled: false,
                        loginNotifications: false,
                      });
                      Alert.alert('Reset Complete', 'Your security settings have been reset to default');
                    }
                  }
                ]
              )}
            >
              <Text style={styles.dangerActionText}>Reset All Security Settings</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Language Settings Modal */}
      <Modal
        visible={languageModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setLanguageModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity 
                style={styles.backButton} 
                onPress={() => setLanguageModalVisible(false)}
              >
                <ArrowLeft size={20} color="#6B7280" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Language</Text>
              <TouchableOpacity 
                style={styles.saveButton} 
                onPress={saveLanguageChanges}
              >
                <Check size={20} color={Colors.light.gradientStart} />
              </TouchableOpacity>
            </View>

            <Text style={styles.languageDescription}>
              Select your preferred language. This will change the language throughout the app.
            </Text>

            {languages.map(lang => (
              <TouchableOpacity 
                key={lang.id}
                style={[
                  styles.languageItem,
                  lang.selected && styles.selectedLanguageItem
                ]}
                onPress={() => selectLanguage(lang.id)}
              >
                <View style={styles.languageInfo}>
                  <Languages size={20} color={lang.selected ? Colors.light.gradientStart : '#6B7280'} />
                  <Text style={[
                    styles.languageName,
                    lang.selected && styles.selectedLanguageName
                  ]}>
                    {lang.name}
                  </Text>
                </View>
                {lang.selected && (
                  <View style={styles.selectedIndicator}>
                    <Check size={18} color={Colors.light.gradientStart} />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* Logout Confirmation Modal */}
      <Modal
        visible={logoutConfirmVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setLogoutConfirmVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.logoutModalContent}>
            <View style={styles.logoutIconContainer}>
              <LogOut size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.logoutTitle}>Log Out</Text>
            <Text style={styles.logoutMessage}>
              Are you sure you want to log out of PharmaFlow?
            </Text>
            <View style={styles.logoutActions}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setLogoutConfirmVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.logoutButton}
                onPress={confirmLogout}
              >
                <Text style={styles.logoutButtonText}>Log Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    marginTop: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  pageTitle: {
    fontSize: 22,
    fontFamily: 'Poppins-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#6B7280',
    marginBottom: 12,
    paddingLeft: 4,
  },
  sectionContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#1F2937',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#6B7280',
  },
  footer: {
    marginTop: 24,
    marginBottom: 32,
    alignItems: 'center',
  },
  version: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#9CA3AF',
    marginBottom: 12,
  },
  logoutText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: Colors.light.error,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    width: '90%',
    maxHeight: '90%',
    maxWidth: 500,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#1F2937',
  },
  saveButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.light.gradientStart,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  changeAvatarButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeAvatarText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: Colors.light.gradientStart,
    marginLeft: 8,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#4B5563',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#1F2937',
  },
  securityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  securityIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  securityContent: {
    flex: 1,
  },
  securityTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#1F2937',
    marginBottom: 4,
  },
  securityDescription: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#6B7280',
  },
  securityValue: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#6B7280',
  },
  securityAction: {
    alignItems: 'center',
    paddingVertical: 16,
    marginTop: 24,
    borderRadius: 8,
  },
  dangerAction: {
    backgroundColor: '#FEE2E2',
  },
  dangerActionText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: Colors.light.error,
  },
  languageDescription: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#6B7280',
    marginBottom: 16,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    borderRadius: 8,
  },
  selectedLanguageItem: {
    backgroundColor: `${Colors.light.gradientStart}10`,
  },
  languageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageName: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#1F2937',
    marginLeft: 12,
  },
  selectedLanguageName: {
    fontFamily: 'Poppins-Medium',
    color: Colors.light.gradientStart,
  },
  selectedIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: `${Colors.light.gradientStart}20`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    width: '80%',
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logoutIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.light.error,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoutTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  logoutMessage: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  logoutActions: {
    flexDirection: 'row',
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginRight: 8,
  },
  cancelButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#4B5563',
  },
  logoutButton: {
    flex: 1,
    backgroundColor: Colors.light.error,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginLeft: 8,
  },
  logoutButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#FFFFFF',
  },
}); 