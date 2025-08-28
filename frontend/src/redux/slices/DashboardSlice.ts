
import { createSlice } from "@reduxjs/toolkit";

interface DashboardStats {
  totalReports: number;
  pendingConsultations: number;
  newMessages: number;
  activePatients: number;
  recentReports: any[];
  upcomingConsultations: any[];
}

interface DashboardState {
  data: DashboardStats;
  isLoading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  data: {
    totalReports: 0,
    pendingConsultations: 0,
    newMessages: 0,
    activePatients: 0,
    recentReports: [],
    upcomingConsultations: []
  },
  isLoading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setDashboardData: (state, action) => {
      state.data = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setDashboardLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setDashboardError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const {
  setDashboardData,
  setDashboardLoading,
  setDashboardError,
} = dashboardSlice.actions;
export const dashboardReducer = dashboardSlice.reducer;
