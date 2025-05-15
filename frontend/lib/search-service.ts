import api from "@/lib/api";

export type SearchResult = {
  id: string;
  type: 'medication' | 'client' | 'prescription' | 'sale';
  name: string;
  details: string;
  iconType: string;
  link: string;
  data: any;
}

export type SearchResultsGroup = {
  medications: SearchResult[];
  clients: SearchResult[];
  prescriptions: SearchResult[];
  sales: SearchResult[];
}

/**
 * Search service for PharmaFlow application
 * Handles searching across different entities (medications, clients, etc.)
 */
class SearchService {
  /**
   * Perform a global search across all entities
   */
  async search(query: string): Promise<SearchResultsGroup> {
    // Return empty results if query is empty or just whitespace
    if (!query || !query.trim()) {
      return {
        medications: [],
        clients: [],
        prescriptions: [],
        sales: []
      };
    }

    try {
      // For real implementation, uncomment this
      // const response = await api.get(`/search?query=${encodeURIComponent(query)}`);
      // return response.data;

      // Mock implementation for demo purposes
      console.log(`Performing search for: "${query}"`);
      const results = this.getMockSearchResults(query);
      console.log("Search results:", {
        medications: results.medications.length,
        clients: results.clients.length,
        prescriptions: results.prescriptions.length,
        sales: results.sales.length
      });
      return results;
    } catch (error) {
      console.error('Error searching:', error);
      // Return empty results on error instead of throwing, which would break the UI
      return {
        medications: [],
        clients: [],
        prescriptions: [],
        sales: []
      };
    }
  }

  /**
   * Search medications
   */
  async searchMedications(query: string): Promise<SearchResult[]> {
    if (!query || !query.trim()) return [];
    
    try {
      // For real implementation, uncomment this
      // const response = await api.get(`/medications/search?query=${encodeURIComponent(query)}`);
      // return response.data.map(item => ({
      //   id: item.id,
      //   type: 'medication',
      //   name: item.name,
      //   details: `Stock: ${item.stock} | ${item.category}`,
      //   iconType: 'pill',
      //   link: `/inventory/${item.id}`,
      //   data: item
      // }));

      return this.getMockSearchResults(query).medications;
    } catch (error) {
      console.error('Error searching medications:', error);
      return [];
    }
  }

  /**
   * Search clients
   */
  async searchClients(query: string): Promise<SearchResult[]> {
    if (!query || !query.trim()) return [];
    
    try {
      // For real implementation, uncomment this
      // const response = await api.get(`/clients/search?query=${encodeURIComponent(query)}`);
      // return response.data.map(item => ({
      //   id: item.id,
      //   type: 'client',
      //   name: item.name,
      //   details: item.phone || item.email || '',
      //   iconType: 'user',
      //   link: `/clients/${item.id}`,
      //   data: item
      // }));

      return this.getMockSearchResults(query).clients;
    } catch (error) {
      console.error('Error searching clients:', error);
      return [];
    }
  }

  /**
   * Get mock search results for demo purposes
   */
  private getMockSearchResults(query: string): SearchResultsGroup {
    const normalizedQuery = query.trim().toLowerCase();
    
    // Return early for empty queries
    if (!normalizedQuery) {
      return {
        medications: [],
        clients: [],
        prescriptions: [],
        sales: []
      };
    }
    
    // Always return some results for demo purposes or for very short queries
    const shouldShowAllResults = normalizedQuery.length === 1;
    
    const mockMedications = [
      { id: '1', name: 'Paracetamol 500mg', stock: 120, category: 'Analgésique' },
      { id: '2', name: 'Amoxicilline 1g', stock: 85, category: 'Antibiotique' },
      { id: '3', name: 'Doliprane 1000mg', stock: 65, category: 'Analgésique' },
      { id: '4', name: 'Aspirine 500mg', stock: 140, category: 'Analgésique' },
      { id: '5', name: 'Ibuprofène 400mg', stock: 78, category: 'Anti-inflammatoire' },
      { id: '6', name: 'Ventoline 100mcg', stock: 35, category: 'Bronchodilatateur' },
      { id: '7', name: 'Levothyrox 100mcg', stock: 92, category: 'Hormone thyroïdienne' },
      { id: '8', name: 'Metformine 1000mg', stock: 113, category: 'Antidiabétique' }
    ];
    
    const mockClients = [
      { id: '1', name: 'Mohammed Alami', phone: '0612345678', email: 'alami@example.com', lastVisit: '2023-05-12' },
      { id: '2', name: 'Fatima Benali', phone: '0698765432', email: 'benali@example.com', lastVisit: '2023-05-18' },
      { id: '3', name: 'Ahmed Laroussi', phone: '0661234567', email: 'laroussi@example.com', lastVisit: '2023-05-15' },
      { id: '4', name: 'Samir Jamal', phone: '0677889900', email: 'jamal@example.com', lastVisit: '2023-05-05' },
      { id: '5', name: 'Leila Mourad', phone: '0611223344', email: 'mourad@example.com', lastVisit: '2023-05-20' }
    ];

    const mockPrescriptions = [
      { id: '1', patientName: 'Ahmed Laroussi', doctorName: 'Dr. Hassan', date: '2023-05-15', status: 'completed' },
      { id: '2', patientName: 'Fatima Benali', doctorName: 'Dr. Karima', date: '2023-05-18', status: 'pending' },
      { id: '3', patientName: 'Mohammed Alami', doctorName: 'Dr. Rachid', date: '2023-05-12', status: 'completed' }
    ];

    const mockSales = [
      { id: '1', clientName: 'Mohammed Alami', amount: 450, date: '2023-05-12', status: 'completed' },
      { id: '2', clientName: 'Fatima Benali', amount: 235, date: '2023-05-18', status: 'completed' },
      { id: '3', clientName: 'Ahmed Laroussi', amount: 290, date: '2023-05-15', status: 'completed' }
    ];
    
    // Enhanced filtering function that checks if an item contains the query string
    const matchesQuery = (text: string) => {
      if (!text) return false;
      return text.toLowerCase().includes(normalizedQuery);
    };

    return {
      medications: mockMedications
        .filter(med => shouldShowAllResults || 
          matchesQuery(med.name) || 
          matchesQuery(med.category))
        .map(med => ({
          id: med.id,
          type: 'medication' as const,
          name: med.name,
          details: `Stock: ${med.stock} | ${med.category}`,
          iconType: 'pill',
          link: `/inventory/${med.id}`,
          data: med
        })),
      clients: mockClients
        .filter(client => 
          shouldShowAllResults || 
          matchesQuery(client.name) || 
          matchesQuery(client.phone) ||
          matchesQuery(client.email))
        .map(client => ({
          id: client.id,
          type: 'client' as const,
          name: client.name,
          details: client.phone || client.email || '',
          iconType: 'user',
          link: `/clients/${client.id}`,
          data: client
        })),
      prescriptions: mockPrescriptions
        .filter(pres => 
          shouldShowAllResults ||
          matchesQuery(pres.patientName) ||
          matchesQuery(pres.doctorName) ||
          matchesQuery(`Ordonnance ${pres.id}`))
        .map(pres => ({
          id: pres.id,
          type: 'prescription' as const,
          name: `Ordonnance ${pres.id}`,
          details: `${pres.patientName} | ${pres.date}`,
          iconType: 'file-text',
          link: `/prescriptions/${pres.id}`,
          data: pres
        })),
      sales: mockSales
        .filter(sale => 
          shouldShowAllResults ||
          matchesQuery(sale.clientName) ||
          matchesQuery(`Vente #${sale.id}`) ||
          matchesQuery(sale.amount.toString()))
        .map(sale => ({
          id: sale.id,
          type: 'sale' as const,
          name: `Vente #${sale.id}`,
          details: `${sale.clientName} | ${sale.amount} Dh`,
          iconType: 'shopping-cart',
          link: `/sales/${sale.id}`,
          data: sale
        }))
    };
  }
}

export const searchService = new SearchService();
export default searchService; 