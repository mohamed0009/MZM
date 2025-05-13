import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Animated, Linking } from 'react-native';
import { ShieldCheck, Lock, Eye, Server, ChevronDown, ChevronUp, ExternalLink, Bell, UserCog, FileText, Info } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Switch } from 'react-native';
import Colors from '@/constants/Colors';
import AnimatedLogo from '@/components/ui/AnimatedLogo';

interface PrivacySection {
  id: string;
  title: string;
  content: string;
  icon: React.ElementType;
  expanded?: boolean;
}

interface PrivacyOption {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

const privacySections: PrivacySection[] = [
  {
    id: '1',
    title: 'Data Protection',
    content: 'We protect your personal data using industry-leading encryption standards and comply with all relevant data protection regulations including GDPR and HIPAA. All personal and health information is stored with end-to-end encryption and access is strictly controlled through secure authentication methods. We conduct regular security audits and vulnerability assessments to ensure your data remains protected.',
    icon: Lock,
  },
  {
    id: '2',
    title: 'Privacy Policy',
    content: 'Our comprehensive privacy policy explains how we collect, use, process, and share your personal information. We are committed to transparency and your right to privacy. You maintain control over your data and can request access, correction, or deletion of your information at any time. We do not sell your data to third parties and only share information with trusted partners necessary to provide our services, who are bound by strict confidentiality agreements.',
    icon: Eye,
  },
  {
    id: '3',
    title: 'Security Measures',
    content: 'We implement multiple layers of security including data encryption, secure access controls, intrusion detection systems, and regular security audits. Our application follows secure development practices and undergoes penetration testing to identify and address potential vulnerabilities. We use TLS/SSL encryption for all data transmissions and implement strict authentication protocols to prevent unauthorized access.',
    icon: ShieldCheck,
  },
  {
    id: '4',
    title: 'Data Storage',
    content: 'Your data is stored on secure cloud servers with redundancy and backup systems in place. All data is encrypted both in transit and at rest. We maintain strict access controls and activity logs to protect your information. Our data centers are certified compliant with relevant security standards (ISO 27001, SOC 2) and employ physical security measures to protect hardware infrastructure. Backups are performed regularly and tested to ensure data can be recovered in case of emergency.',
    icon: Server,
  },
  {
    id: '5',
    title: 'Regulatory Compliance',
    content: 'PharmaFlow complies with relevant healthcare and pharmaceutical regulations, including HIPAA (Health Insurance Portability and Accountability Act) in the US and similar healthcare privacy regulations in other jurisdictions. Our systems and processes are designed to maintain the confidentiality, integrity, and availability of protected health information and ensure regulatory compliance across all operations.',
    icon: FileText,
  },
  {
    id: '6',
    title: 'Third-Party Integrations',
    content: 'When integrating with third-party services, we carefully select partners that maintain high security and privacy standards. All third-party integrations are assessed for privacy implications, and data sharing is limited to what is necessary to provide requested functionality. You\'ll always be informed about which third parties have access to your data and for what purpose.',
    icon: ExternalLink,
  },
];

const privacyOptions: PrivacyOption[] = [
  {
    id: 'marketing',
    title: 'Marketing Communications',
    description: 'Receive updates about new features, promotions, and industry news',
    enabled: true,
  },
  {
    id: 'analytics',
    title: 'Analytics & Usage Data',
    description: 'Help improve our app by sharing anonymous usage statistics',
    enabled: true,
  },
  {
    id: 'thirdParty',
    title: 'Third-Party Data Sharing',
    description: 'Allow sharing of anonymized data with trusted partners',
    enabled: false,
  }
];

export default function PrivacyScreen() {
  const [sections, setSections] = useState(privacySections.map(section => ({ ...section, expanded: false })));
  const [options, setOptions] = useState(privacyOptions);
  const [showConsentAlert, setShowConsentAlert] = useState(false);

  const toggleSection = (id: string) => {
    setSections(sections.map(section => 
      section.id === id 
        ? { ...section, expanded: !section.expanded } 
        : section
    ));
  };

  const toggleOption = (id: string) => {
    setOptions(options.map(option => 
      option.id === id 
        ? { ...option, enabled: !option.enabled } 
        : option
    ));
    
    if (id === 'analytics' || id === 'thirdParty') {
      setShowConsentAlert(true);
      setTimeout(() => setShowConsentAlert(false), 3000);
    }
  };

  const openPrivacyPolicy = () => {
    Linking.openURL('https://pharmaflow.com/privacy-policy');
  };

  return (
    <View style={styles.container}>
      {/* Add Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.pageTitle}>Privacy Policy</Text>
        <AnimatedLogo size={32} color={Colors.light.tint} />
        </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Introduction */}
        <View style={styles.introContainer}>
          <Text style={styles.introText}>
            At PharmaFlow, we're committed to maintaining the highest standards of privacy and security for your data. 
            Our comprehensive approach ensures your sensitive information remains protected at all times.
          </Text>
        </View>

        {/* Privacy Options */}
        <View style={styles.optionsContainer}>
          <View style={styles.sectionHeaderRow}>
            <UserCog size={20} color={Colors.light.gradientStart} />
            <Text style={styles.sectionHeaderText}>Privacy Preferences</Text>
          </View>
          
          {options.map((option) => (
            <View key={option.id} style={styles.optionRow}>
              <View style={styles.optionInfo}>
                <Text style={styles.optionTitle}>{option.title}</Text>
                <Text style={styles.optionDescription}>{option.description}</Text>
              </View>
              <Switch
                value={option.enabled}
                onValueChange={() => toggleOption(option.id)}
                trackColor={{ false: '#D1D5DB', true: Colors.light.gradientStart + '80' }}
                thumbColor={option.enabled ? Colors.light.gradientStart : '#F3F4F6'}
              />
            </View>
          ))}
        </View>

        {/* Consent Alert */}
        {showConsentAlert && (
          <Animated.View style={styles.alertContainer}>
            <View style={styles.alertContent}>
              <Info size={20} color="#FFFFFF" />
              <Text style={styles.alertText}>Your preferences have been updated</Text>
            </View>
          </Animated.View>
        )}

        {/* Privacy Details */}
        <View style={styles.detailsContainer}>
          <View style={styles.sectionHeaderRow}>
            <Shield size={20} color={Colors.light.gradientStart} />
            <Text style={styles.sectionHeaderText}>Privacy & Security Details</Text>
          </View>
          
          {sections.map((section) => (
            <View key={section.id} style={styles.accordionContainer}>
              <TouchableOpacity 
                style={styles.accordionHeader} 
                onPress={() => toggleSection(section.id)}
                activeOpacity={0.7}
              >
                <View style={styles.accordionTitleContainer}>
                  <View style={styles.iconContainer}>
                    <section.icon size={20} color={Colors.light.gradientStart} />
                  </View>
                  <Text style={styles.accordionTitle}>{section.title}</Text>
                </View>
                {section.expanded ? 
                  <ChevronUp size={20} color={Colors.light.text} /> : 
                  <ChevronDown size={20} color={Colors.light.text} />
                }
              </TouchableOpacity>
              
              {section.expanded && (
                <View style={styles.accordionContent}>
                  <Text style={styles.accordionText}>{section.content}</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={openPrivacyPolicy}
          >
            <Text style={styles.actionButtonText}>View Full Privacy Policy</Text>
            <ExternalLink size={16} color={Colors.light.gradientStart} />
          </TouchableOpacity>
          
          <View style={styles.contactContainer}>
            <Text style={styles.contactTitle}>Questions or Concerns?</Text>
            <Text style={styles.contactText}>
              If you have any questions about privacy and security, please contact our data protection officer:
            </Text>
            <Text style={styles.contactEmail}>privacy@pharmaflow.com</Text>
          </View>
        </View>
        
        <Text style={styles.versionText}>Privacy Policy v2.0 • Last updated: June 2023</Text>
      </ScrollView>
    </View>
  );
}

const Shield = ({ size, color }: { size: number, color: string }) => {
  return <ShieldCheck size={size} color={color} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingTop: 60,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  pageTitle: {
    fontSize: 22,
    fontFamily: 'Poppins-SemiBold',
    color: '#1F2937',
  },
  content: {
    flex: 1,
  },
  introContainer: {
    marginTop: 24,
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  introText: {
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
    color: '#4B5563',
    lineHeight: 24,
  },
  optionsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 20,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionHeaderText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#1F2937',
    marginLeft: 8,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  optionInfo: {
    flex: 1,
    marginRight: 16,
  },
  optionTitle: {
    fontSize: 15,
    fontFamily: 'Poppins-Medium',
    color: '#1F2937',
    marginBottom: 2,
  },
  optionDescription: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    color: '#6B7280',
  },
  detailsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 20,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  accordionContainer: {
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    borderRadius: 8,
    overflow: 'hidden',
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#F9FAFB',
  },
  accordionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.light.gradientStart + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  accordionTitle: {
    fontSize: 15,
    fontFamily: 'Poppins-Medium',
    color: '#1F2937',
  },
  accordionContent: {
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  accordionText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#4B5563',
    lineHeight: 22,
  },
  actionsContainer: {
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  actionButtonText: {
    fontSize: 15,
    fontFamily: 'Poppins-Medium',
    color: Colors.light.gradientStart,
    marginRight: 8,
  },
  contactContainer: {
    backgroundColor: Colors.light.gradientStart + '08',
    borderRadius: 12,
    padding: 16,
  },
  contactTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  contactText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#4B5563',
    lineHeight: 22,
    marginBottom: 8,
  },
  contactEmail: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: Colors.light.gradientStart,
  },
  versionText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#9CA3AF',
    textAlign: 'center',
    marginVertical: 16,
  },
  alertContainer: {
    position: 'absolute',
    top: 10,
    left: 16,
    right: 16,
    zIndex: 100,
  },
  alertContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.gradientStart,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  alertText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    marginLeft: 8,
  },
}); 