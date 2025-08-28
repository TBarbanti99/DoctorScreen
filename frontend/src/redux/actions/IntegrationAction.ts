
import { Action, Dispatch } from "redux";
import { API } from "../api";
import { setIntegrations, addIntegration, setLoading, setError, setCalendlyEvents, removeIntegration, setSelectedEventUri } from "../slices/IntegrationSlice";

interface ActionInterface {
  userData?: any;
  toast?: any;
  dispatch?: Dispatch<Action>;
}

// Connect Integration
export const connectIntegration = ({ userData, toast, dispatch }: ActionInterface) => {
  if (dispatch) dispatch(setLoading(true));
  
  return API({
    endPoint: "/integration/connect",
    method: "POST",
    body: userData,
    isFormData: false,
    toast,
    isToast: true,
    action: addIntegration,
    dispatch,
    isHeaders: true,
    isToken: true,
  });
};

// Add Stripe Credentials - New dedicated endpoint
export const addStripeCredentials = ({ userData, toast, dispatch }: ActionInterface) => {
  if (dispatch) dispatch(setLoading(true));
  
  return API({
    endPoint: "/stripe/create/credentials",
    method: "POST",
    body: userData,
    isFormData: false,
    toast,
    isToast: true,
    action: addIntegration,
    dispatch,
    isHeaders: true,
    isToken: true,
  });
};

// Fetch Integrations
export const fetchIntegrations = ({ toast, dispatch }: ActionInterface) => {
  if (dispatch) dispatch(setLoading(true));

  return API({
    endPoint: "/integration/list",
    method: "GET",
    isFormData: false,
    toast,
    isToast: false,
    action: setIntegrations,
    dispatch,
    isHeaders: true,
    isToken: true,
  });
};

// Fetch Calendly Events
export const fetchCalendlyEvents = ({ toast, dispatch }: ActionInterface) => {
  if (dispatch) dispatch(setLoading(true));

  return API({
    endPoint: "/calendly/events",
    method: "GET",
    isFormData: false,
    toast,
    isToast: false,
    action: setCalendlyEvents,
    dispatch,
    isHeaders: true,
    isToken: true,
  });
};

// Submit Calendly Event Type
export const submitEventType = ({ userData, toast, dispatch }: ActionInterface) => {
  if (dispatch) dispatch(setLoading(true));
  
  return API({
    endPoint: "/integration/meta/data",
    method: "POST",
    body: userData,
    isFormData: false,
    toast,
    isToast: true,
    action: setIntegrations,
    dispatch,
    isHeaders: true,
    isToken: true,
  });
};

// Disconnect Integration
export const disconnectIntegration = ({ userData, toast, dispatch }: ActionInterface) => {
  if (dispatch) dispatch(setLoading(true));
  
  return API({
    endPoint: "/integration/disconnect",
    method: "POST",
    body: userData,
    isFormData: false,
    toast,
    isToast: true,
    action: removeIntegration,
    dispatch,
    isHeaders: true,
    isToken: true,
  });
};

// Clear Calendly Events
export const clearCalendlyEvents = ({ dispatch }: { dispatch: Dispatch<Action> }) => {
  if (dispatch) {
    dispatch(setCalendlyEvents([]));
    dispatch(setSelectedEventUri(null));
  }
  
  // Return a valid action object to prevent Redux errors
  return { type: 'CLEAR_CALENDLY_EVENTS' };
};
