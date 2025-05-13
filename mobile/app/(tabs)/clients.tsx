import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, TextInput, SafeAreaView, Platform, Alert } from 'react-native';
import Card from '@/components/ui/Card';
import { Search, Plus, CreditCard as Edit2, Trash2, Phone, Mail, MapPin, ShoppingBag, Calendar } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Modal from '@/components/ui/Modal';
import TextInputComponent from '@/components/ui/TextInput';
import GradientButton from '@/components/ui/GradientButton';

// Define Client interface
interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  totalPurchases: number;
  lastVisit: string;
}

// Mock clients data
const clientsData: Client[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+33 6 12 34 56 78',
    address: '123 Main St, Paris',
    totalPurchases: 12,
    lastVisit: '2023-05-15',
  },
  {
    id: '2',
    name: 'Marie Dupont',
    email: 'marie.dupont@example.com',
    phone: '+33 6 23 45 67 89',
    address: '456 Avenue Victor Hugo, Lyon',
    totalPurchases: 8,
    lastVisit: '2023-06-20',
  },
  {
    id: '3',
    name: 'Pierre Martin',
    email: 'pierre.martin@example.com',
    phone: '+33 6 34 56 78 90',
    address: '789 Rue de la Liberté, Marseille',
    totalPurchases: 15,
    lastVisit: '2023-06-25',
  },
  {
    id: '4',
    name: 'Sophie Lefevre',
    email: 'sophie.lefevre@example.com',
    phone: '+33 6 45 67 89 01',
    address: '10 Boulevard Saint-Michel, Paris',
    totalPurchases: 5,
    lastVisit: '2023-07-02',
  },
  {
    id: '5',
    name: 'Lucas Bernard',
    email: 'lucas.bernard@example.com',
    phone: '+33 6 56 78 90 12',
    address: '25 Rue du Commerce, Bordeaux',
    totalPurchases: 20,
    lastVisit: '2023-07-05',
  },
];

// New Client Modal Component
function AddClientModal({ visible, onClose, onSubmit }: { visible: boolean, onClose: () => void, onSubmit: (client: Omit<Client, 'id' | 'totalPurchases'>) => void }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    lastVisit: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = () => {
    onSubmit(formData);
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      lastVisit: new Date().toISOString().split('T')[0],
    });
    onClose();
  };

  return (
    <Modal visible={visible} onClose={onClose} title="Add New Client">
      <View style={styles.form}>
        {/* Client basic info */}
        <TextInputComponent
          label="Client Name"
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
          icon={<Edit2 size={20} color="#9CA3AF" />}
        />

        <View style={styles.row}>
          <TextInputComponent
            label="Phone Number"
            value={formData.phone}
            onChangeText={(text) => setFormData({ ...formData, phone: text })}
            keyboardType="phone-pad"
            icon={<Phone size={20} color="#9CA3AF" />}
            containerStyle={styles.halfInput}
          />
          
          <TextInputComponent
            label="Email"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            keyboardType="email-address"
            icon={<Mail size={20} color="#9CA3AF" />}
            containerStyle={styles.halfInput}
          />
        </View>

        <View style={styles.row}>
          <TextInputComponent
            label="Address"
            value={formData.address}
            onChangeText={(text) => setFormData({ ...formData, address: text })}
            icon={<MapPin size={20} color="#9CA3AF" />}
            containerStyle={styles.fullInput}
          />
        </View>
          
        <View style={styles.row}>
          <TextInputComponent
            label="Last Visit Date"
            value={formData.lastVisit}
            onChangeText={(text) => setFormData({ ...formData, lastVisit: text })}
            placeholder="YYYY-MM-DD"
            icon={<Calendar size={20} color="#9CA3AF" />}
            containerStyle={styles.fullInput}
          />
        </View>
        
        <GradientButton
          title="Add Client"
          onPress={handleSubmit}
          style={styles.submitButton}
        />
      </View>
    </Modal>
  );
}

// Edit Client Modal Component
function EditClientModal({ visible, onClose, onSubmit, client }: { visible: boolean, onClose: () => void, onSubmit: (client: Client) => void, client: Client | null }) {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    totalPurchases: 0,
    lastVisit: '',
  });

  // Update form data when client changes
  React.useEffect(() => {
    if (client) {
      setFormData({
        id: client.id,
        name: client.name,
        email: client.email,
        phone: client.phone,
        address: client.address,
        totalPurchases: client.totalPurchases,
        lastVisit: client.lastVisit,
      });
    }
  }, [client]);

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
  };

  return (
    <Modal visible={visible} onClose={onClose} title="Edit Client">
      <View style={styles.form}>
        {/* Client basic info */}
        <TextInputComponent
          label="Client Name"
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
          icon={<Edit2 size={20} color="#9CA3AF" />}
        />

        <View style={styles.row}>
          <TextInputComponent
            label="Phone Number"
            value={formData.phone}
            onChangeText={(text) => setFormData({ ...formData, phone: text })}
            keyboardType="phone-pad"
            icon={<Phone size={20} color="#9CA3AF" />}
            containerStyle={styles.halfInput}
          />
          
          <TextInputComponent
            label="Email"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            keyboardType="email-address"
            icon={<Mail size={20} color="#9CA3AF" />}
            containerStyle={styles.halfInput}
          />
        </View>

        <View style={styles.row}>
          <TextInputComponent
            label="Address"
            value={formData.address}
            onChangeText={(text) => setFormData({ ...formData, address: text })}
            icon={<MapPin size={20} color="#9CA3AF" />}
            containerStyle={styles.fullInput}
          />
        </View>
          
        <View style={styles.row}>
          <TextInputComponent
            label="Last Visit Date"
            value={formData.lastVisit}
            onChangeText={(text) => setFormData({ ...formData, lastVisit: text })}
            placeholder="YYYY-MM-DD"
            icon={<Calendar size={20} color="#9CA3AF" />}
            containerStyle={styles.fullInput}
          />
        </View>
        
        <GradientButton
          title="Update Client"
          onPress={handleSubmit}
          style={styles.submitButton}
        />
      </View>
    </Modal>
  );
}

// Delete Confirmation Modal
function DeleteConfirmationModal({ visible, onClose, onConfirm, clientName }: { visible: boolean, onClose: () => void, onConfirm: () => void, clientName: string }) {
  return (
    <Modal visible={visible} onClose={onClose} title="Delete Client">
      <View style={styles.deleteConfirmation}>
        <Text style={styles.deleteConfirmText}>
          Are you sure you want to delete client "{clientName}"? This action cannot be undone.
        </Text>
        <View style={styles.deleteButtonsContainer}>
          <TouchableOpacity 
            style={[styles.deleteActionButton, styles.cancelButton]}
            onPress={onClose}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.deleteActionButton, styles.confirmButton]}
            onPress={() => {
              onConfirm();
              onClose();
            }}
          >
            <Text style={styles.confirmButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

export default function ClientsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [clients, setClients] = useState(clientsData);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  
  const filteredClients = searchQuery.trim() === ''
    ? clients
    : clients.filter(client => 
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.phone.includes(searchQuery)
      );
  
  const handleAddClient = (clientData: Omit<Client, 'id' | 'totalPurchases'>) => {
    const newClient: Client = {
      ...clientData,
      id: (clients.length + 1).toString(),
      totalPurchases: 0,
    };
    
    setClients([...clients, newClient]);
  };

  const handleEditClient = (clientData: Client) => {
    const updatedClients = clients.map(client => 
      client.id === clientData.id ? clientData : client
    );
    setClients(updatedClients);
  };

  const handleDeleteClient = () => {
    if (selectedClient) {
      const updatedClients = clients.filter(client => client.id !== selectedClient.id);
      setClients(updatedClients);
    }
  };
  
  const renderClientItem = ({ item }: { item: Client }) => {
    // Convert lastVisit string to Date and format as local date
    const lastVisitDate = new Date(item.lastVisit);
    const formattedDate = lastVisitDate.toLocaleDateString();
    
    return (
      <Card style={styles.clientCard}>
        <View style={styles.clientHeader}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {item.name.split(' ').map((n: string) => n[0]).join('')}
            </Text>
          </View>
          <View style={styles.clientInfo}>
            <Text style={styles.clientName}>{item.name}</Text>
            <Text style={styles.clientAddress}>{item.address}</Text>
          </View>
        </View>
        
        <View style={styles.contactContainer}>
          <View style={styles.contactItem}>
            <Phone size={16} color="#6B7280" style={styles.contactIcon} />
            <Text style={styles.contactText}>{item.phone}</Text>
          </View>
          <View style={styles.contactItem}>
            <Mail size={16} color="#6B7280" style={styles.contactIcon} />
            <Text style={styles.contactText}>{item.email}</Text>
          </View>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{item.totalPurchases}</Text>
            <Text style={styles.statLabel}>Purchases</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{formattedDate}</Text>
            <Text style={styles.statLabel}>Last Visit</Text>
          </View>
        </View>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.editButton]}
            onPress={() => {
              setSelectedClient(item);
              setShowEditModal(true);
            }}
          >
            <Edit2 size={16} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => {
              setSelectedClient(item);
              setShowDeleteModal(true);
            }}
          >
            <Trash2 size={16} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </Card>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
    <View style={styles.container}>
        <View style={styles.topContainer}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search clients..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
          </View>
          
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setShowAddModal(true)}
          >
            <View style={styles.fabButton}>
              <Plus size={22} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
      </View>
      
      <FlatList
        data={filteredClients}
        renderItem={renderClientItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchQuery.trim() !== '' ? 'No clients match your search' : 'No clients available'}
            </Text>
          </View>
        }
      />
        
        {/* Add Client Modal */}
        <AddClientModal 
          visible={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddClient}
        />

        {/* Edit Client Modal */}
        <EditClientModal 
          visible={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSubmit={handleEditClient}
          client={selectedClient}
        />

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal 
          visible={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteClient}
          clientName={selectedClient?.name || ''}
        />
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  topContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  addButton: {
    marginLeft: 8,
  },
  fabButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.light.gradientStart,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      }
    }),
  },
  searchContainer: {
    flex: 1,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      }
    }),
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#1F2937',
  },
  listContainer: {
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 88 : 72, // Extra bottom padding
  },
  clientCard: {
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      }
    }),
  },
  clientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.light.gradientStart,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
    color: '#1F2937',
    marginBottom: 4,
  },
  clientAddress: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#6B7280',
  },
  contactContainer: {
    marginBottom: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactIcon: {
    marginRight: 8,
  },
  contactText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#4B5563',
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  statItem: {
    marginRight: 24,
  },
  statValue: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.light.gradientStart,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#6B7280',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  editButton: {
    backgroundColor: Colors.light.gradientStart,
  },
  deleteButton: {
    backgroundColor: Colors.light.error,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    marginLeft: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#6B7280',
  },
  // Modal form styles
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
  fullInput: {
    flex: 1,
    marginHorizontal: 4,
  },
  submitButton: {
    marginTop: 16,
  },
  // Delete confirmation modal styles
  deleteConfirmation: {
    padding: 8,
  },
  deleteConfirmText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#4B5563',
    marginBottom: 24,
    textAlign: 'center',
  },
  deleteButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  deleteActionButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
  },
  confirmButton: {
    backgroundColor: Colors.light.error,
  },
  cancelButtonText: {
    color: '#4B5563',
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
  },
});