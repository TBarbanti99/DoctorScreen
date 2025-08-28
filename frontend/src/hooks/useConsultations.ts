
import { useQuery } from "@tanstack/react-query";
import { API } from "../redux/api";
import { toast } from "sonner";

interface EventMembership {
  user_name: string;
  user_email: string;
  buffered_start_time: string;
  buffered_end_time: string;
  user: string;
}

interface Location {
  join_url: string;
  type: string;
  status: string;
}

export interface Consultation {
  start_time: string;
  end_time: string;
  name: string;
  status: string;
  location: Location;
  event_memberships: EventMembership[];
  uri: string;
}

export const useConsultations = () => {
  return useQuery({
    queryKey: ["consultations"],
    queryFn: async () => {
      const response = await API({
        endPoint: "/calendly/consultation",
        method: "GET",
        isHeaders: true,
        isToken: true,
        toast: toast,
      });
            
      // Check if the response has the expected structure
      if (response?.success && Array.isArray(response?.message)) {
        // If response.message is an array, we can directly return it
        return response.message;
      } else if (response?.success && Array.isArray(response?.message?.data)) {
        // If response.message.data is an array, return that instead
        return response.message.data;
      } else {
        // Default fallback
        console.error("Unexpected API response structure:", response);
        return [];
      }
    },
  });
};
