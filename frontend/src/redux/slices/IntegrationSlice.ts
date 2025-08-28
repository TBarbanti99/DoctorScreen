
import { createSlice } from "@reduxjs/toolkit";

interface CalendlyEvent {
  name: string;
  uri: string;
  scheduling_url: string;
  duration: number;
  active: boolean;
}

interface Integration {
  id: string;
  platform: string;
  platformURL: string;
  userId: string;
  meta_data?: {
    uri?: string;
    name?: string;
    scheduling_url?: string;
    publishable_key?: string;
  } | null;
}

interface IntegrationState {
  integrations: Integration[];
  calendlyEvents: CalendlyEvent[];
  selectedEventUri: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: IntegrationState = {
  integrations: [],
  calendlyEvents: [],
  selectedEventUri: null,
  isLoading: false,
  error: null,
};

const integrationSlice = createSlice({
  name: "integration",
  initialState,
  reducers: {
    setIntegrations: (state, action) => {
      state.integrations = action.payload;
      
      // Check if any integration has meta_data with uri
      const calendlyIntegration = action.payload.find(
        (integration: Integration) => 
          integration.platform === "calendly" && 
          integration.meta_data?.uri
      );
      
      if (calendlyIntegration?.meta_data?.uri) {
        state.selectedEventUri = calendlyIntegration.meta_data.uri;
      }
      
      state.isLoading = false;
      state.error = null;
    },
    setCalendlyEvents: (state, action) => {
      state.calendlyEvents = action.payload;
      
      // If no event is selected and we have events, select the active one or the first one
      if (!state.selectedEventUri && action.payload?.length > 0) {
        const activeEvent = action.payload.find((event: CalendlyEvent) => event.active);
        state.selectedEventUri = activeEvent ? activeEvent.uri : action.payload[0].uri;
      }
      
      state.isLoading = false;
      state.error = null;
    },
    setSelectedEventUri: (state, action) => {
      state.selectedEventUri = action.payload;
    },
    addIntegration: (state, action) => {
      state.integrations = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    removeIntegration: (state, action) => {
      state.integrations = state.integrations.filter(
        (integration) => integration.id !== action.payload.id
      );
      
      // Clear Calendly events if no Calendly integration exists after removal
      const hasCalendlyIntegration = state.integrations.some(
        integration => integration.platform === "calendly"
      );
      
      if (!hasCalendlyIntegration) {
        state.calendlyEvents = [];
        state.selectedEventUri = null;
      }
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const {
  setIntegrations,
  addIntegration,
  removeIntegration,
  setLoading,
  setError,
  setCalendlyEvents,
  setSelectedEventUri,
} = integrationSlice.actions;
export const integrationReducer = integrationSlice.reducer;
