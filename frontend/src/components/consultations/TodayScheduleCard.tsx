
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format, parseISO } from "date-fns";
import { Consultation } from "@/hooks/useConsultations";
import { toast } from "sonner";

interface TodayScheduleCardProps {
  consultations: Consultation[];
  isLoading: boolean;
  error: Error | null;
}

const TodayScheduleCard: React.FC<TodayScheduleCardProps> = ({ 
  consultations, 
  isLoading, 
  error 
}) => {
  const handleStartConsultation = (consultation: Consultation) => {
    if (consultation?.location?.join_url) {
      window.open(consultation.location.join_url, '_blank');
    } else {
      toast.error("Meeting link not available");
    }
  };

  const formatConsultationTime = (startTime: string, endTime: string) => {
    try {
      return `${format(parseISO(startTime), 'h:mm a')} - ${format(parseISO(endTime), 'h:mm a')}`;
    } catch (e) {
      console.error("Error formatting time:", startTime, endTime, e);
      return "Time unavailable";
    }
  };

  // Render loading skeletons
  const renderLoadingSkeleton = () => (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center justify-between border-b pb-4">
          <div className="flex items-start gap-3">
            <Skeleton className="h-5 w-5 rounded-full" />
            <div>
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
          <Skeleton className="h-8 w-16" />
        </div>
      ))}
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Schedule</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            renderLoadingSkeleton()
          ) : error ? (
            <div className="text-center py-4 text-red-500">Error loading consultations</div>
          ) : consultations.length > 0 ? (
            consultations.map((consultation: Consultation) => (
              <div
                key={consultation.uri}
                className="flex items-center justify-between border-b pb-4"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <Video className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">{consultation.event_memberships[0]?.user_name || 'Patient'}</p>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{formatConsultationTime(consultation.start_time, consultation.end_time)}</span>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => handleStartConsultation(consultation)}
                  size="sm"
                >
                  Join
                </Button>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-slate-500">
              No consultations scheduled for today
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TodayScheduleCard;
