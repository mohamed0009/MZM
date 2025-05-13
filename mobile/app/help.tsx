import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Linking, Platform, LayoutAnimation, UIManager } from 'react-native';
import { Mail, Phone, MessageCircle, HelpCircle, ChevronDown, ChevronUp, ExternalLink, FileText, BookOpen, Search, Heart, ChevronRight } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import AnimatedLogo from '@/components/ui/AnimatedLogo';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

interface GuideItem {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
}

interface ContactOption {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  action: string;
}

export default function HelpScreen() {
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const toggleFaq = (id: string) => {
    if (expandedFaq === id) {
      setExpandedFaq(null);
    } else {
      setExpandedFaq(id);
    }
  };

  const handleContactAction = (action: string) => {
    if (action.startsWith('mailto:')) {
      Linking.openURL(action);
    } else if (action.startsWith('tel:')) {
      Linking.openURL(action);
    } else if (action === 'chat') {
      // Implement chat functionality
      alert('Chat functionality would open here');
    }
  };

  const faqCategories = [
    { id: 'all', name: 'All' },
    { id: 'inventory', name: 'Inventory' },
    { id: 'sales', name: 'Sales' },
    { id: 'account', name: 'Account' },
  ];

  const faqs: FAQItem[] = [
    {
      id: '1',
      question: 'How do I add a new product to inventory?',
      answer: 'To add a new product, go to the Inventory tab and tap the "+" button in the bottom right corner. Fill in the product details and tap Save. The new product will appear in your inventory list.',
      category: 'inventory'
    },
    {
      id: '2',
      question: 'How can I track expiry dates?',
      answer: 'The system automatically tracks expiry dates for all products with batch information. You can view products nearing expiry in the Alerts section, and also filter products by expiry date in the Inventory section.',
      category: 'inventory'
    },
    {
      id: '3',
      question: 'Can I generate sales reports?',
      answer: 'Yes, you can generate various reports including sales reports. Navigate to the Reports section from the More menu, select the type of report and time period, then tap Generate. You can view, download or share the generated reports.',
      category: 'sales'
    },
    {
      id: '4',
      question: 'How do I add a new user to the system?',
      answer: 'To add a new user, go to User Management in the More menu. Tap the "+" button, fill in the user details, select their role and permissions, then tap Save. New users will receive an email with instructions to set up their password.',
      category: 'account'
    },
    {
      id: '5',
      question: 'What should I do if I forgot my password?',
      answer: 'On the login screen, tap "Forgot Password". Enter your registered email address and follow the instructions sent to your email to reset your password. For security reasons, password reset links expire after 24 hours.',
      category: 'account'
    },
  ];

  const filteredFaqs = activeCategory === 'all' 
    ? faqs 
    : faqs.filter(faq => faq.category === activeCategory);

  const guides: GuideItem[] = [
    {
      id: '1',
      title: 'Inventory Management',
      description: 'Learn how to organize and track your products efficiently',
      icon: FileText,
    },
    {
      id: '2',
      title: 'Sales Process',
      description: 'Step-by-step guide for processing sales transactions',
      icon: BookOpen,
    },
    {
      id: '3',
      title: 'Reporting Tools',
      description: 'How to generate and analyze business reports',
      icon: FileText,
    },
  ];

  const contactOptions: ContactOption[] = [
    {
      id: '1',
      title: 'Email Support',
      description: 'support@pharmaflow.com',
      icon: Mail,
      action: 'mailto:support@pharmaflow.com',
    },
    {
      id: '2',
      title: 'Phone Support',
      description: '+1 (800) 555-1234',
      icon: Phone,
      action: 'tel:+18005551234',
    },
    {
      id: '3',
      title: 'Live Chat',
      description: 'Chat with our support team',
      icon: MessageCircle,
      action: 'chat',
    },
  ];

  const renderFaqItem = (item: FAQItem) => {
    const isExpanded = expandedFaq === item.id;
    
    return (
      <View 
        key={item.id} 
        style={[
          styles.faqItem,
          isExpanded && { borderColor: Colors.light.gradientStart },
        ]}
      >
        <TouchableOpacity
          style={styles.faqHeader}
          onPress={() => toggleFaq(item.id)}
          activeOpacity={0.7}
        >
          <View style={styles.faqQuestion}>
            <View style={[
              styles.faqIconContainer, 
              { backgroundColor: `${Colors.light.gradientStart}20` }
            ]}>
              <HelpCircle size={16} color={Colors.light.gradientStart} />
            </View>
            <Text style={styles.questionText}>{item.question}</Text>
          </View>
          {isExpanded ? (
            <ChevronUp size={20} color="#9CA3AF" />
          ) : (
            <ChevronDown size={20} color="#9CA3AF" />
          )}
        </TouchableOpacity>
        
        {isExpanded && (
          <View style={[
            styles.faqAnswer,
            { backgroundColor: `${Colors.light.gradientStart}05` }
          ]}>
            <Text style={styles.answerText}>{item.answer}</Text>
          </View>
        )}
      </View>
    );
  };

  const renderGuideItem = (item: GuideItem) => {
    return (
      <View key={item.id} style={styles.guideItem}>
        <TouchableOpacity 
          style={styles.guideInner}
          activeOpacity={0.7}
        >
          <View style={[
            styles.iconContainer, 
            { backgroundColor: `${Colors.light.gradientStart}15` }
          ]}>
            <item.icon size={20} color={Colors.light.gradientStart} />
          </View>
          <View style={styles.guideContent}>
            <Text style={styles.guideTitle}>{item.title}</Text>
            <Text style={styles.guideDescription}>{item.description}</Text>
          </View>
          <View style={[
            styles.arrowContainer,
            { backgroundColor: `${Colors.light.gradientStart}10` }
          ]}>
            <ExternalLink size={16} color={Colors.light.gradientStart} />
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderContactItem = (item: ContactOption) => {
    return (
      <View key={item.id} style={styles.contactItem}>
        <TouchableOpacity 
          style={styles.contactInner}
          onPress={() => handleContactAction(item.action)}
          activeOpacity={0.7}
        >
          <View style={[
            styles.iconContainer, 
            { backgroundColor: `${Colors.light.gradientStart}15` }
          ]}>
            <item.icon size={20} color={Colors.light.gradientStart} />
          </View>
          <View style={styles.contactContent}>
            <Text style={styles.contactTitle}>{item.title}</Text>
            <Text style={styles.contactDescription}>{item.description}</Text>
          </View>
          <ChevronRight size={18} color="#9CA3AF" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.pageTitle}>Help & Support</Text>
        <AnimatedLogo size={32} color={Colors.light.tint} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Header Card */}
        <View style={styles.headerCard}>
          <LinearGradient
            colors={[`${Colors.light.gradientStart}20`, `${Colors.light.gradientEnd}10`]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerGradient}
          >
            <View style={styles.headerContent}>
              <View style={styles.headerTextContainer}>
                <Text style={styles.headerTitle}>
                  How can we help you?
                </Text>
                <Text style={styles.headerSubtitle}>
                  Find answers to common questions or contact our support team
                </Text>
              </View>
              <View style={[styles.searchIconContainer, { backgroundColor: '#FFFFFF' }]}>
                <Search size={22} color={Colors.light.gradientStart} />
              </View>
            </View>
          </LinearGradient>
        </View>
        
        {/* FAQ Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          
          {/* FAQ Categories */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.categoriesContainer}
          >
            {faqCategories.map(category => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryButton,
                  activeCategory === category.id && [
                    styles.activeCategoryButton,
                    { backgroundColor: `${Colors.light.gradientStart}15`, borderColor: Colors.light.gradientStart }
                  ]
                ]}
                onPress={() => setActiveCategory(category.id)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    activeCategory === category.id && { color: Colors.light.gradientStart, fontFamily: 'Poppins-Medium' }
                  ]}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          <View style={styles.faqContainer}>
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map(renderFaqItem)
            ) : (
              <View style={styles.emptyState}>
                <View style={[styles.emptyIconContainer, { backgroundColor: `${Colors.light.gradientStart}10` }]}>
                  <HelpCircle size={24} color={Colors.light.gradientStart} />
                </View>
                <Text style={styles.emptyTitle}>No FAQs Found</Text>
                <Text style={styles.emptyText}>
                  There are no FAQs in this category yet. Please try another category.
                </Text>
              </View>
            )}
          </View>
        </View>
        
        {/* Quick Guides Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Guides</Text>
          <View style={styles.guidesContainer}>
            {guides.map(renderGuideItem)}
          </View>
        </View>
        
        {/* Contact Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Support</Text>
          <View style={styles.contactContainer}>
            {contactOptions.map(renderContactItem)}
          </View>
          
          <View style={[styles.supportHours, { backgroundColor: `${Colors.light.gradientStart}08` }]}>
            <View style={styles.supportHoursHeader}>
              <View style={[styles.miniIconContainer, { backgroundColor: `${Colors.light.gradientStart}15` }]}>
                <Clock size={16} color={Colors.light.gradientStart} />
              </View>
              <Text style={styles.supportHoursTitle}>Support Hours</Text>
            </View>
            <Text style={styles.supportHoursText}>Monday to Friday: 9:00 AM - 5:00 PM ET</Text>
            <Text style={styles.supportHoursText}>Weekend: Email support only</Text>
          </View>
          
          <View style={styles.feedbackCard}>
            <View style={styles.feedbackHeader}>
              <Heart size={18} color={Colors.light.gradientStart} style={{ marginRight: 8 }} />
              <Text style={styles.feedbackTitle}>We value your feedback</Text>
            </View>
            <Text style={styles.feedbackText}>
              Help us improve PharmaFlow by sharing your experience and suggestions.
            </Text>
            <TouchableOpacity 
              style={[styles.feedbackButton, { backgroundColor: `${Colors.light.gradientStart}15` }]}
              activeOpacity={0.7}
            >
              <Text style={[styles.feedbackButtonText, { color: Colors.light.gradientStart }]}>
                Send Feedback
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

// Custom Clock icon
function Clock(props: { size: number, color: string }) {
  return (
    <View style={{ width: props.size, height: props.size, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ width: props.size, height: props.size, borderRadius: props.size/2, borderWidth: 2, borderColor: props.color }} />
      <View style={{ position: 'absolute', height: props.size/2.5, width: 2, backgroundColor: props.color, bottom: props.size/2, transform: [{ rotate: '0deg' }] }} />
      <View style={{ position: 'absolute', height: props.size/3.5, width: 2, backgroundColor: props.color, right: props.size/2, transform: [{ rotate: '90deg' }] }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
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
    padding: 16,
  },
  headerCard: {
    marginBottom: 24,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  headerGradient: {
    borderRadius: 12,
    padding: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTextContainer: {
    flex: 1,
    paddingRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#4B5563',
    lineHeight: 20,
    opacity: 0.9,
  },
  searchIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  categoriesContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  activeCategoryButton: {
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#4B5563',
  },
  faqContainer: {
    marginBottom: 8,
  },
  faqItem: {
    marginBottom: 12,
    padding: 0,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'transparent',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  faqQuestion: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  faqIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  questionText: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Poppins-Medium',
    color: '#1F2937',
  },
  faqAnswer: {
    padding: 16,
    paddingTop: 0,
    paddingLeft: 60,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  answerText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#4B5563',
    lineHeight: 22,
    paddingBottom: 8,
  },
  guidesContainer: {
    marginBottom: 8,
  },
  guideItem: {
    marginBottom: 12,
    padding: 0,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  guideInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  guideContent: {
    flex: 1,
    paddingRight: 8,
  },
  guideTitle: {
    fontSize: 15,
    fontFamily: 'Poppins-Medium',
    color: '#1F2937',
    marginBottom: 4,
  },
  guideDescription: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    color: '#6B7280',
    opacity: 0.7,
  },
  arrowContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactContainer: {
    marginBottom: 16,
  },
  contactItem: {
    marginBottom: 12,
    padding: 0,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  contactInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  contactContent: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 15,
    fontFamily: 'Poppins-Medium',
    color: '#1F2937',
    marginBottom: 2,
  },
  contactDescription: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    color: '#6B7280',
    opacity: 0.8,
  },
  supportHours: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
  },
  supportHoursHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  miniIconContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  supportHoursTitle: {
    fontSize: 15,
    fontFamily: 'Poppins-Medium',
    color: '#1F2937',
  },
  supportHoursText: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    color: '#4B5563',
    marginBottom: 4,
    paddingLeft: 38,
  },
  feedbackCard: {
    padding: 16,
    marginBottom: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  feedbackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  feedbackTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#1F2937',
  },
  feedbackText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 16,
  },
  feedbackButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  feedbackButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  emptyState: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  emptyIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#1F2937',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#6B7280',
    textAlign: 'center',
    opacity: 0.7,
    paddingHorizontal: 16,
  },
}); 