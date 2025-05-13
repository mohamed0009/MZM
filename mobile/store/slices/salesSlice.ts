import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface Sale {
  id: string;
  clientName: string;
  date: string;
  total: number;
  items: number;
  status: 'completed' | 'pending' | 'refunded';
  paymentMethod: string;
}

interface SalesState {
  sales: Sale[];
  loading: boolean;
  error: string | null;
}

const initialState: SalesState = {
  sales: [],
  loading: false,
  error: null,
};

export const fetchSales = createAsyncThunk('sales/fetchSales', async () => {
  // Mock API call
  return [
    {
      id: '1',
      clientName: 'John Doe',
      date: '2023-07-10T14:30:00',
      total: 78.50,
      items: 5,
      status: 'completed',
      paymentMethod: 'Card',
    },
    {
      id: '2',
      clientName: 'Marie Dupont',
      date: '2023-07-09T11:15:00',
      total: 45.25,
      items: 2,
      status: 'completed',
      paymentMethod: 'Cash',
    },
  ] as Sale[];
});

const salesSlice = createSlice({
  name: 'sales',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSales.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSales.fulfilled, (state, action: PayloadAction<Sale[]>) => {
        state.loading = false;
        state.sales = action.payload;
      })
      .addCase(fetchSales.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch sales';
      });
  },
});

export default salesSlice.reducer;