
import { Action, Dispatch } from "redux";
import { API } from "../api";
import { setDashboardData, setDashboardLoading, setDashboardError } from "../slices/DashboardSlice";
import { setIntegrations } from "../slices/IntegrationSlice";

interface ActionInterface {
  toast?: any;
  dispatch?: Dispatch<Action>;
}

// Fetch Dashboard Data
export const fetchDashboardData = async ({ toast, dispatch }: ActionInterface) => {
  if (dispatch) dispatch(setDashboardLoading(true));

  try {
    // First fetch integrations to ensure they're available across the app
    const integrationsResponse = await API({
      endPoint: "/integration/list",
      method: "GET",
      isFormData: false,
      toast,
      isToast: false,
      isHeaders: true,
      isToken: true,
    });

    if (integrationsResponse?.success && integrationsResponse?.message) {
      if (dispatch) {
        dispatch(setIntegrations(integrationsResponse.message));
      }
    }

    // Get reports data
    const reportsResponse = await API({
      endPoint: "/reports/list",
      method: "GET",
      isFormData: false,
      toast,
      isToast: false,
      isHeaders: true,
      isToken: true,
    });

    // Get consultations data
    const consultationsResponse = await API({
      endPoint: "/calendly/consultation",
      method: "GET",
      isFormData: false,
      toast,
      isToast: false,
      isHeaders: true,
      isToken: true,
    });

    // Initialize default dashboard data with empty values
    const dashboardData = {
      totalReports: 0,
      pendingConsultations: 0,
      newMessages: 0, // This will be implemented when messages API is available
      activePatients: 0, // This will be implemented when patients API is available
      recentReports: [], 
      upcomingConsultations: [], 
    };

    // Process reports data if available
    if (reportsResponse?.success && reportsResponse?.message?.reports) {
      const reports = reportsResponse.message.reports || [];
      dashboardData.totalReports = reports.length;
      dashboardData.recentReports = reports.slice(0, 5); // Get 5 most recent reports
    }
    
    // Process consultations data if available
    if (consultationsResponse?.success && consultationsResponse?.message) {
      const consultations = consultationsResponse.message || [];
      
      if(consultations?.length > 0) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const upcomingConsultations = consultations.filter((consultation: any) => {
          const consultationDate = new Date(consultation.start_time);
          return consultationDate >= today;
        });
        
        dashboardData.pendingConsultations = upcomingConsultations?.length || 0;
        dashboardData.upcomingConsultations = upcomingConsultations?.slice(0, 5) || []; // Get 5 upcoming consultations
      }
    }

    // Dispatch the dashboard data regardless of partial failures
    if (dispatch) {
      dispatch(setDashboardData(dashboardData));
    }
  } catch (error: any) {
    console.error("Dashboard data fetch error:", error);
    // Only set error if we have no data at all
    if (dispatch) {
      dispatch(setDashboardLoading(false));
      // We're not setting the error here to prevent showing error messages when partial data is available
    }
  }
};
