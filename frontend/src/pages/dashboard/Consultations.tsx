
import React from "react"; // Removed useState
import { useSelector } from "react-redux";
import { isToday, isFuture, parseISO } from "date-fns";
import { useCalendly } from "../../contexts/CalendlyContext";
import { useConsultations, Consultation } from "@/hooks/useConsultations";

// Import refactored components
import TodayScheduleCard from "@/components/consultations/TodayScheduleCard";
import CalendarCard from "@/components/consultations/CalendarCard";
import UpcomingConsultationsTable from "@/components/consultations/UpcomingConsultationsTable";
import { useStripe } from "@/contexts/StripeContext";

const Consultations = () => {
  const { isCalendlyConnected } = useCalendly();
  const {isStripeConnected} = useStripe()
  const { selectedEventUri, integrations } = useSelector((state: any) => state.integration);
  const { data: consultations = [], isLoading, error } = useConsultations();


  // Safely filter consultations
  const safelyParseDate = (dateString: string) => {
    try {
      return parseISO(dateString);
    } catch (e) {
      console.error("Error parsing date:", dateString, e);
      return new Date(0); // Return epoch date as fallback
    }
  };

  // If consultations exist, filter them by today and upcoming
  const todayConsultations = Array.isArray(consultations) 
    ? consultations.filter((consultation: Consultation) => {
        if (!consultation?.start_time) return false;
        return isToday(safelyParseDate(consultation.start_time));
      })
    : [];

  const upcomingConsultations = Array.isArray(consultations)
    ? consultations.filter((consultation: Consultation) => {
        if (!consultation?.start_time) return false;
        const parsedDate = safelyParseDate(consultation.start_time);
        return isFuture(parsedDate) && !isToday(parsedDate);
      })
    : [];


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#062D46]">Consultations</h1>
        <p className="text-slate-500">Manage your patient consultations</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <TodayScheduleCard 
          consultations={todayConsultations} 
          isLoading={isLoading} 
          error={error} 
        />

        <CalendarCard 
          isCalendlyConnected={isCalendlyConnected}
          isStripeConnected={isStripeConnected}
          selectedEventUri={selectedEventUri}
          integrations={integrations}
        />
      </div>

      <UpcomingConsultationsTable 
        consultations={upcomingConsultations} 
        isLoading={isLoading} 
        error={error} 
      />
    </div>
  );
};

export default Consultations;

