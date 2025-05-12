import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, TextInput, Modal, Switch, Alert, ActivityIndicator, Image } from 'react-native';
import Card from '@/components/ui/Card';
import { User, Search, Plus, Edit2, Trash2, Shield, UserCheck, X, Check, Mail, Filter } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import AnimatedLogo from '@/components/ui/AnimatedLogo';

// Define User interface
interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'staff';
  status: 'active' | 'inactive';
}

// Define form errors interface
interface FormErrors {
  name?: string;
  email?: string;
}

// Mock users data
const initialUsersData: UserData[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'admin',
    status: 'active',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    role: 'manager',
    status: 'active',
  },
  {
    id: '3',
    name: 'Mike Williams',
    email: 'mike.williams@example.com',
    role: 'staff',
    status: 'active',
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily.davis@example.com',
    role: 'staff',
    status: 'inactive',
  },
  {
    id: '5',
    name: 'Robert Wilson',
    email: 'robert.wilson@example.com',
    role: 'manager',
    status: 'active',
  },
];

export default function UserManagementScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [usersData, setUsersData] = useState<UserData[]>(initialUsersData);
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>(initialUsersData);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterRole, setFilterRole] = useState<'all' | 'admin' | 'manager' | 'staff'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  
  // Form state
  const [formData, setFormData] = useState<Omit<UserData, 'id'>>({
    name: '',
    email: '',
    role: 'staff',
    status: 'active',
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  
  // Filter users when search query or filters change
  useEffect(() => {
    let filtered = usersData;
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.role.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply role filter
    if (filterRole !== 'all') {
      filtered = filtered.filter(user => user.role === filterRole);
    }
    
    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(user => user.status === filterStatus);
    }
    
    setFilteredUsers(filtered);
  }, [usersData, searchQuery, filterRole, filterStatus]);
  
  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text) {
      const filtered = usersData.filter(
        (user) =>
          user.name.toLowerCase().includes(text.toLowerCase()) ||
          user.email.toLowerCase().includes(text.toLowerCase()) ||
          user.role.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(usersData);
    }
  };
  
  const getRoleIcon = (role: UserData['role']) => {
    switch (role) {
      case 'admin':
        return <Shield size={16} color="#8B5CF6" />;
      case 'manager':
        return <UserCheck size={16} color="#3B82F6" />;
      case 'staff':
        return <User size={16} color="#10B981" />;
      default:
        return <User size={16} color="#10B981" />;
    }
  };
  
  // Open add user modal
  const handleAddUser = () => {
    setIsEditing(false);
    setSelectedUser(null);
    setFormData({
      name: '',
      email: '',
      role: 'staff',
      status: 'active'
    });
    setFormErrors({});
    setModalVisible(true);
  };
  
  // Open edit user modal
  const handleEditUser = (user: UserData) => {
    setIsEditing(true);
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    });
    setFormErrors({});
    setModalVisible(true);
  };
  
  // Open delete user modal
  const handleDeleteModal = (user: UserData) => {
    setSelectedUser(user);
    setDeleteModalVisible(true);
  };
  
  // Handle form input changes
  const handleInputChange = (field: keyof Omit<UserData, 'id'>, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user types
    if (formErrors[field as keyof FormErrors]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };
  
  // Handle role selection
  const handleRoleSelect = (role: UserData['role']) => {
    setFormData(prev => ({
      ...prev,
      role
    }));
  };
  
  // Handle status toggle
  const handleStatusToggle = (value: boolean) => {
    setFormData(prev => ({
      ...prev,
      status: value ? 'active' : 'inactive'
    }));
  };
  
  // Validate form
  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email';
    } else if (!isEditing) {
      // Check if email already exists (only for new users)
      const emailExists = usersData.some(user => 
        user.email.toLowerCase() === formData.email.toLowerCase()
      );
      if (emailExists) {
        errors.email = 'Email already in use';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Submit form - create or update user
  const handleSubmit = () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      if (isEditing && selectedUser) {
        // Update existing user
        const updatedUsers = usersData.map(user => 
          user.id === selectedUser.id 
            ? { ...user, ...formData } 
            : user
        );
        setUsersData(updatedUsers);
        Alert.alert('Success', `User ${formData.name} has been updated`);
      } else {
        // Create new user
        const newUser: UserData = {
          id: (usersData.length + 1).toString(),
          ...formData
        };
        setUsersData([...usersData, newUser]);
        Alert.alert('Success', `User ${formData.name} has been added`);
      }
      
      setIsLoading(false);
      setModalVisible(false);
    }, 1000);
  };
  
  // Delete user
  const handleDeleteUser = () => {
    if (!selectedUser) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const updatedUsers = usersData.filter(user => user.id !== selectedUser.id);
      setUsersData(updatedUsers);
      setDeleteModalVisible(false);
      setIsLoading(false);
      Alert.alert('Success', `User ${selectedUser.name} has been deleted`);
    }, 1000);
  };
  
  const renderUserItem = ({ item }: { item: UserData }) => {
    return (
      <Card style={styles.userCard}>
        <View style={styles.userHeader}>
          <View style={styles.userInfo}>
            <View style={[
              styles.avatarContainer,
              item.role === 'admin' 
                ? styles.adminAvatar 
                : item.role === 'manager' 
                  ? styles.managerAvatar 
                  : styles.staffAvatar
            ]}>
              <Text style={styles.avatarText}>
                {item.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </Text>
            </View>
            <View>
              <Text style={styles.userName}>{item.name}</Text>
              <View style={styles.emailContainer}>
                <Mail size={12} color="#6B7280" style={styles.emailIcon} />
                <Text style={styles.userEmail}>{item.email}</Text>
              </View>
            </View>
          </View>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.userDetails}>
          <View style={[
            styles.roleContainer,
            item.role === 'admin' 
              ? styles.adminRole 
              : item.role === 'manager' 
                ? styles.managerRole 
                : styles.staffRole
          ]}>
            {getRoleIcon(item.role)}
            <Text style={[
              styles.roleText,
              { color: item.role === 'admin' ? '#8B5CF6' : item.role === 'manager' ? '#3B82F6' : '#10B981' }
            ]}>
              {item.role.charAt(0).toUpperCase() + item.role.slice(1)}
            </Text>
          </View>
          
          <View style={[
            styles.statusContainer,
            item.status === 'active' ? styles.activeStatus : styles.inactiveStatus
          ]}>
            <View style={[
              styles.statusIndicator,
              { backgroundColor: item.status === 'active' ? '#10B981' : '#EF4444' }
            ]} />
            <Text style={[
              styles.statusText,
              { color: item.status === 'active' ? '#10B981' : '#EF4444' }
            ]}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          </View>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.cardActions}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.editActionButton]}
            onPress={() => handleEditUser(item)}
          >
            <Edit2 size={18} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Edit</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.deleteActionButton]}
            onPress={() => handleDeleteModal(item)}
          >
            <Trash2 size={18} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </Card>
    );
  };
  
  const handleFilterReset = () => {
    setFilterRole('all');
    setFilterStatus('all');
    setShowFilterModal(false);
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.headerGradient}>
        <View style={styles.headerContainer}>
          <View>
            <Text style={styles.pageTitle}>User Management</Text>
            <Text style={styles.pageSubtitle}>Manage your team members</Text>
          </View>
          <AnimatedLogo size={38} color="#FFFFFF" />
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Search size={18} color="#9CA3AF" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search users by name, email or role..."
              value={searchQuery}
              onChangeText={handleSearch}
              placeholderTextColor="#9CA3AF"
            />
          </View>
          
          <TouchableOpacity 
            style={[
              styles.filterButton,
              (filterRole !== 'all' || filterStatus !== 'all') && styles.filterButtonActive
            ]}
            onPress={() => setShowFilterModal(true)}
          >
            <Filter size={18} color={(filterRole !== 'all' || filterStatus !== 'all') ? '#FFFFFF' : '#6B7280'} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.addButton}
            onPress={handleAddUser}
          >
            <Plus size={18} color="#FFFFFF" />
            <Text style={styles.addButtonText}>Add User</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{usersData.length}</Text>
            <Text style={styles.statLabel}>Total Users</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {usersData.filter(user => user.status === 'active').length}
            </Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {usersData.filter(user => user.role === 'admin').length}
            </Text>
            <Text style={styles.statLabel}>Admins</Text>
          </View>
        </View>
        
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>User List</Text>
          <Text style={styles.listCount}>{filteredUsers.length} users</Text>
        </View>
        
        <FlatList
          data={filteredUsers}
          renderItem={renderUserItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.usersList}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconContainer}>
                <User size={40} color={Colors.light.gradientStart} />
              </View>
              <Text style={styles.emptyTitle}>No users found</Text>
              <Text style={styles.emptyText}>Try changing your search or filter criteria</Text>
            </View>
          }
        />
      </View>
      
      {/* Add/Edit User Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>
                  {isEditing ? 'Edit User' : 'Add New User'}
                </Text>
                <Text style={styles.modalSubtitle}>
                  {isEditing 
                    ? 'Update user information and settings' 
                    : 'Complete user information and settings'}
                </Text>
              </View>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <X size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Full Name</Text>
              <View style={[
                styles.inputContainer,
                formErrors.name ? styles.inputError : null
              ]}>
                <User size={18} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter full name"
                  value={formData.name}
                  onChangeText={(text) => handleInputChange('name', text)}
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              {formErrors.name && (
                <Text style={styles.errorText}>{formErrors.name}</Text>
              )}
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Email Address</Text>
              <View style={[
                styles.inputContainer,
                formErrors.email ? styles.inputError : null
              ]}>
                <Mail size={18} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter email address"
                  value={formData.email}
                  onChangeText={(text) => handleInputChange('email', text)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              {formErrors.email && (
                <Text style={styles.errorText}>{formErrors.email}</Text>
              )}
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>User Role</Text>
              <View style={styles.rolesContainer}>
                <TouchableOpacity
                  style={[
                    styles.roleOption,
                    formData.role === 'admin' && styles.adminRoleSelected
                  ]}
                  onPress={() => handleRoleSelect('admin')}
                >
                  <Shield 
                    size={16} 
                    color={formData.role === 'admin' ? '#FFFFFF' : '#8B5CF6'} 
                  />
                  <Text 
                    style={[
                      styles.roleOptionText,
                      formData.role === 'admin' && styles.selectedRoleText
                    ]}
                  >
                    Admin
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.roleOption,
                    formData.role === 'manager' && styles.managerRoleSelected
                  ]}
                  onPress={() => handleRoleSelect('manager')}
                >
                  <UserCheck 
                    size={16} 
                    color={formData.role === 'manager' ? '#FFFFFF' : '#3B82F6'} 
                  />
                  <Text 
                    style={[
                      styles.roleOptionText,
                      formData.role === 'manager' && styles.selectedRoleText
                    ]}
                  >
                    Manager
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.roleOption,
                    formData.role === 'staff' && styles.staffRoleSelected
                  ]}
                  onPress={() => handleRoleSelect('staff')}
                >
                  <User 
                    size={16} 
                    color={formData.role === 'staff' ? '#FFFFFF' : '#10B981'} 
                  />
                  <Text 
                    style={[
                      styles.roleOptionText,
                      formData.role === 'staff' && styles.selectedRoleText
                    ]}
                  >
                    Staff
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.formGroup}>
              <View style={styles.statusToggleContainer}>
                <Text style={styles.label}>User Status</Text>
                <View style={styles.statusSwitchContainer}>
                  <Text style={[
                    styles.statusLabel,
                    formData.status === 'inactive' && styles.statusLabelActive
                  ]}>
                    Inactive
                  </Text>
                  <Switch
                    value={formData.status === 'active'}
                    onValueChange={handleStatusToggle}
                    trackColor={{ false: '#E5E7EB', true: `${Colors.light.gradientStart}50` }}
                    thumbColor={formData.status === 'active' ? Colors.light.gradientStart : '#9CA3AF'}
                    ios_backgroundColor="#E5E7EB"
                    style={styles.statusSwitch}
                  />
                  <Text style={[
                    styles.statusLabel,
                    formData.status === 'active' && styles.statusLabelActive
                  ]}>
                    Active
                  </Text>
                </View>
              </View>
            </View>
            
            <TouchableOpacity 
              style={[
                styles.submitButton,
                isLoading ? styles.submitButtonDisabled : null
              ]}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <>
                  <Check size={18} color="#FFFFFF" style={styles.submitIcon} />
                  <Text style={styles.submitText}>
                    {isEditing ? 'Update User' : 'Create User'}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <Modal
        visible={deleteModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.deleteModalContent}>
            <View style={styles.deleteIconContainer}>
              <Trash2 size={30} color="#FFFFFF" />
            </View>
            
            <Text style={styles.deleteTitle}>Delete User</Text>
            <Text style={styles.deleteMessage}>
              Are you sure you want to delete {selectedUser?.name}? This action cannot be undone.
            </Text>
            
            <View style={styles.deleteActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setDeleteModalVisible(false)}
                disabled={isLoading}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.deleteButton,
                  isLoading ? styles.deleteButtonDisabled : null
                ]}
                onPress={handleDeleteUser}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.deleteButtonText}>Delete</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Filter Modal */}
      <Modal
        visible={showFilterModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Filter Users</Text>
                <Text style={styles.modalSubtitle}>Filter users by role and status</Text>
              </View>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowFilterModal(false)}
              >
                <X size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Role</Text>
              <View style={styles.filterOptions}>
                {['all', 'admin', 'manager', 'staff'].map((role) => (
                  <TouchableOpacity
                    key={role}
                    style={[
                      styles.filterOption,
                      filterRole === role && styles.filterOptionSelected,
                      role === 'admin' && styles.adminFilterOption,
                      role === 'manager' && styles.managerFilterOption,
                      role === 'staff' && styles.staffFilterOption,
                    ]}
                    onPress={() => setFilterRole(role as any)}
                  >
                    {role !== 'all' && (
                      <View style={styles.filterIconContainer}>
                        {getRoleIcon(role as any)}
                      </View>
                    )}
                    <Text 
                      style={[
                        styles.filterOptionText,
                        filterRole === role && styles.filterOptionTextSelected,
                        role === 'admin' && styles.adminText,
                        role === 'manager' && styles.managerText,
                        role === 'staff' && styles.staffText,
                        filterRole === role && role === 'admin' && styles.adminTextSelected,
                        filterRole === role && role === 'manager' && styles.managerTextSelected,
                        filterRole === role && role === 'staff' && styles.staffTextSelected,
                      ]}
                    >
                      {role === 'all' ? 'All Roles' : role.charAt(0).toUpperCase() + role.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Status</Text>
              <View style={styles.filterOptions}>
                {['all', 'active', 'inactive'].map((status) => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.filterOption,
                      filterStatus === status && styles.filterOptionSelected,
                      status === 'active' && styles.activeFilterOption,
                      status === 'inactive' && styles.inactiveFilterOption,
                    ]}
                    onPress={() => setFilterStatus(status as any)}
                  >
                    {status !== 'all' && (
                      <View style={[
                        styles.statusIndicator,
                        { backgroundColor: status === 'active' ? '#10B981' : '#EF4444' }
                      ]} />
                    )}
                    <Text 
                      style={[
                        styles.filterOptionText,
                        filterStatus === status && styles.filterOptionTextSelected,
                        status === 'active' && styles.activeText,
                        status === 'inactive' && styles.inactiveText,
                        filterStatus === status && status === 'active' && styles.activeTextSelected,
                        filterStatus === status && status === 'inactive' && styles.inactiveTextSelected,
                      ]}
                    >
                      {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.filterActions}>
              <TouchableOpacity 
                style={styles.resetButton}
                onPress={handleFilterReset}
              >
                <Text style={styles.resetButtonText}>Reset Filters</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.applyButton}
                onPress={() => setShowFilterModal(false)}
              >
                <Text style={styles.applyButtonText}>Apply Filters</Text>
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
    backgroundColor: '#F5F7FA',
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: Colors.light.gradientStart,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  pageTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
  },
  pageSubtitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  content: {
    flex: 1,
    marginTop: -20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: '#F5F7FA',
    paddingTop: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontFamily: 'Poppins-Regular',
    color: '#1F2937',
    fontSize: 14,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  filterButtonActive: {
    backgroundColor: Colors.light.gradientStart,
  },
  addButton: {
    flexDirection: 'row',
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.light.gradientStart,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    shadowColor: Colors.light.gradientStart,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    marginLeft: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: Colors.light.gradientStart,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#6B7280',
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  listTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#1F2937',
  },
  listCount: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#6B7280',
  },
  usersList: {
    padding: 16,
    paddingTop: 4,
  },
  emptyContainer: {
    padding: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: `${Colors.light.gradientStart}20`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.light.gradientStart,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    width: '90%',
    maxWidth: 500,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#1F2937',
  },
  modalSubtitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#6B7280',
    marginTop: 4,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#4B5563',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  inputError: {
    borderColor: Colors.light.error,
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 48,
    fontFamily: 'Poppins-Regular',
    color: '#1F2937',
    fontSize: 14,
  },
  errorText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: Colors.light.error,
    marginTop: 6,
    marginLeft: 2,
  },
  rolesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  roleOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingVertical: 12,
    marginHorizontal: 4,
  },
  adminRoleSelected: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  managerRoleSelected: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  staffRoleSelected: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  roleOptionText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#4B5563',
    marginLeft: 6,
  },
  selectedRoleText: {
    color: '#FFFFFF',
  },
  statusToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusSwitchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusSwitch: {
    marginHorizontal: 8,
  },
  statusLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#9CA3AF',
  },
  statusLabelActive: {
    color: '#4B5563',
    fontFamily: 'Poppins-Medium',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.gradientStart,
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 10,
    shadowColor: Colors.light.gradientStart,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    backgroundColor: Colors.light.gradientStart + 'AA',
    shadowOpacity: 0,
    elevation: 0,
  },
  submitIcon: {
    marginRight: 8,
  },
  submitText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#FFFFFF',
  },
  deleteModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  deleteIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.light.error,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  deleteTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  deleteMessage: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  deleteActions: {
    flexDirection: 'row',
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingVertical: 14,
    marginRight: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#4B5563',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: Colors.light.error,
    borderRadius: 12,
    paddingVertical: 14,
    marginLeft: 8,
    alignItems: 'center',
    shadowColor: Colors.light.error,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  deleteButtonDisabled: {
    backgroundColor: Colors.light.error + 'AA',
    shadowOpacity: 0,
    elevation: 0,
  },
  deleteButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
  },
  userCard: {
    marginBottom: 16,
    borderRadius: 16,
    padding: 0,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarText: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
  },
  adminAvatar: {
    backgroundColor: '#8B5CF6',
  },
  managerAvatar: {
    backgroundColor: '#3B82F6',
  },
  staffAvatar: {
    backgroundColor: '#10B981',
  },
  userName: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emailIcon: {
    marginRight: 4,
  },
  userEmail: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#6B7280',
  },
  userDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 16,
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  adminRole: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
  },
  managerRole: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  staffRole: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  roleText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    marginLeft: 6,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  activeStatus: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  inactiveStatus: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 12,
    flex: 1,
    marginHorizontal: 4,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  editActionButton: {
    backgroundColor: '#8B5CF6',
  },
  deleteActionButton: {
    backgroundColor: '#EF4444',
  },
  actionButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#1F2937',
    marginBottom: 12,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minWidth: 100,
  },
  filterOptionSelected: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
  },
  filterIconContainer: {
    marginRight: 6,
  },
  filterOptionText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#4B5563',
  },
  filterOptionTextSelected: {
    fontFamily: 'Poppins-SemiBold',
  },
  adminText: {
    color: '#8B5CF6',
  },
  managerText: {
    color: '#3B82F6',
  },
  staffText: {
    color: '#10B981',
  },
  activeText: {
    color: '#10B981',
  },
  inactiveText: {
    color: '#EF4444',
  },
  adminTextSelected: {
    color: '#8B5CF6',
  },
  managerTextSelected: {
    color: '#3B82F6',
  },
  staffTextSelected: {
    color: '#10B981',
  },
  activeTextSelected: {
    color: '#10B981',
  },
  inactiveTextSelected: {
    color: '#EF4444',
  },
  adminFilterOption: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderColor: '#8B5CF6',
  },
  managerFilterOption: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderColor: '#3B82F6',
  },
  staffFilterOption: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: '#10B981',
  },
  activeFilterOption: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: '#10B981',
  },
  inactiveFilterOption: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: '#EF4444',
  },
  filterActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  resetButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#4B5563',
  },
  applyButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: Colors.light.gradientStart,
    marginLeft: 8,
    alignItems: 'center',
    shadowColor: Colors.light.gradientStart,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  applyButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
  },
}); 