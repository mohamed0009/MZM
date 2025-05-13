import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  totalPurchases: number;
  lastVisit: string;
}

interface ClientsState {
  clients: Client[];
  loading: boolean;
  error: string | null;
}

const initialState: ClientsState = {
  clients: [],
  loading: false,
  error: null,
};

export const fetchClients = createAsyncThunk('clients/fetchClients', async () => {
  // Mock API call
  return [
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
  ];
});

const clientsSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClients.fulfilled, (state, action: PayloadAction<Client[]>) => {
        state.loading = false;
        state.clients = action.payload;
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch clients';
      });
  },
});

export default clientsSlice.reducer;