import api from './authService';

export const productService = {
  // Get all products
  async getProducts() {
    try {
      // For demo purposes, mock the response
      /*
      const response = await api.get('/products');
      return response.data;
      */
      
      // Mock response
      return [
        {
          id: '1',
          name: 'Paracetamol',
          description: 'Pain reliever and fever reducer',
          price: 5.99,
          stock: 150,
          category: 'Pain Relief',
          expiryDate: '2025-12-31',
        },
        {
          id: '2',
          name: 'Amoxicillin',
          description: 'Antibiotic medication',
          price: 12.50,
          stock: 75,
          category: 'Antibiotics',
          expiryDate: '2024-10-15',
        },
        {
          id: '3',
          name: 'Ibuprofen',
          description: 'Non-steroidal anti-inflammatory drug',
          price: 7.25,
          stock: 120,
          category: 'Pain Relief',
          expiryDate: '2025-06-20',
        },
        {
          id: '4',
          name: 'Loratadine',
          description: 'Antihistamine for allergies',
          price: 8.99,
          stock: 90,
          category: 'Allergies',
          expiryDate: '2025-03-11',
        },
        {
          id: '5',
          name: 'Omeprazole',
          description: 'Proton pump inhibitor for acid reflux',
          price: 15.75,
          stock: 60,
          category: 'Digestive Health',
          expiryDate: '2024-08-25',
        },
      ];
    } catch (error) {
      throw new Error('Failed to fetch products');
    }
  },

  // Get a single product by ID
  async getProduct(id: string) {
    try {
      // For demo purposes, mock the response
      /*
      const response = await api.get(`/products/${id}`);
      return response.data;
      */
      
      // Mock response based on ID
      const products = await this.getProducts();
      const product = products.find(p => p.id === id);
      if (!product) throw new Error('Product not found');
      return product;
    } catch (error) {
      throw new Error('Failed to fetch product');
    }
  },

  // Add a new product
  async addProduct(product: any) {
    try {
      // For demo purposes, mock the response
      /*
      const response = await api.post('/products', product);
      return response.data;
      */
      
      // Mock response
      return {
        ...product,
        id: Math.random().toString(36).substring(2, 11),
      };
    } catch (error) {
      throw new Error('Failed to add product');
    }
  },

  // Update an existing product
  async updateProduct(product: any) {
    try {
      // For demo purposes, mock the response
      /*
      const response = await api.put(`/products/${product.id}`, product);
      return response.data;
      */
      
      // Mock response
      return product;
    } catch (error) {
      throw new Error('Failed to update product');
    }
  },

  // Delete a product
  async deleteProduct(id: string) {
    try {
      // For demo purposes, mock the response
      /*
      await api.delete(`/products/${id}`);
      */
      
      // Mock response - in a real app this would delete the product
      return true;
    } catch (error) {
      throw new Error('Failed to delete product');
    }
  },
};