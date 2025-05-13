import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface Alert {
  id: string;
  title: string;
  message: string;
  type: 'stock' | 'expiry' | 'order';
  time: string;
  read: boolean;
}

interface AlertsState {
  alerts: Alert[];
  loading: boolean;
  error: string | null;
}

const initialState: AlertsState = {
  alerts: [],
  loading: false,
  error: null,
};

export const fetchAlerts = createAsyncThunk('alerts/fetchAlerts', async () => {
  // Mock API call
  return [
    {
      id: '1',
      title: 'Low Stock Alert',
      message: 'Paracetamol stock is below 20 units',
      type: 'stock',
      time: '2 hours ago',
      read: false,
    },
    {
      id: '2',
      title: 'Expiry Alert',
      message: 'Amoxicillin batch #A245 expires in 30 days',
      type: 'expiry',
      time: '1 day ago',
      read: false,
    },
  ] as Alert[];
});

const alertsSlice = createSlice({
  name: 'alerts',
  initialState,
  reducers: {
    markAsRead: (state, action: PayloadAction<string>) => {
      const alert = state.alerts.find(a => a.id === action.payload);
      if (alert) {
        alert.read = true;
      }
    },
    clearAlert: (state, action: PayloadAction<string>) => {
      state.alerts = state.alerts.filter(a => a.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAlerts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAlerts.fulfilled, (state, action: PayloadAction<Alert[]>) => {
        state.loading = false;
        state.alerts = action.payload;
      })
      .addCase(fetchAlerts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch alerts';
      });
  },
});

export const { markAsRead, clearAlert } = alertsSlice.actions;
export default alertsSlice.reducer;