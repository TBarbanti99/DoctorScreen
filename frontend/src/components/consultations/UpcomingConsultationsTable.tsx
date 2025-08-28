
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format, parseISO } from "date-fns";
import { Consultation } from "@/hooks/useConsultations";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface UpcomingConsultationsTableProps {
  consultations: Consultation[];
  isLoading: boolean;
  error: Error | null;
}

const UpcomingConsultationsTable: React.FC<UpcomingConsultationsTableProps> = ({
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Consultations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex flex-col space-y-3">
              <Skeleton className="h-8 w-full" />
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-4 text-red-500">Error loading consultations</div>
          ) : consultations.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {consultations.map((consultation: Consultation) => (
                  <TableRow key={consultation.uri}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{consultation.event_memberships[0]?.user_name || 'Patient'}</div>
                        <div className="text-sm text-slate-500">{consultation.event_memberships[0]?.user_email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{format(parseISO(consultation.start_time), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>{formatConsultationTime(consultation.start_time, consultation.end_time)}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="bg-blue-100 text-blue-800 hover:bg-blue-100"
                      >
                        {consultation.location.type.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStartConsultation(consultation)}
                      >
                        Join
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-4 text-slate-500">
              No upcoming consultations scheduled
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingConsultationsTable;
