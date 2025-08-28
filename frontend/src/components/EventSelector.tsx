
import React, { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedEventUri } from '@/redux/slices/IntegrationSlice';
import { submitEventType } from '@/redux/actions/IntegrationAction';
import { Loader } from 'lucide-react';
import { toast } from "sonner";

type Event = {
  name: string;
  uri: string;
  scheduling_url: string;
  duration: number;
  active: boolean; // Added the active property to match CalendlyEvent in IntegrationSlice
};

const EventSelector = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const { calendlyEvents, selectedEventUri, integrations } = useSelector((state: any) => state.integration);

  const handleEventSelect = (eventUri: string) => {
    dispatch(setSelectedEventUri(eventUri));
  };

  useEffect(() => {
    // Set default selected event if none is selected but events are available
    if (calendlyEvents?.length > 0 && !selectedEventUri) {
      const activeEvent = calendlyEvents.find((event: Event) => event.active);
      const eventToSelect = activeEvent ? activeEvent.uri : calendlyEvents[0].uri;
      dispatch(setSelectedEventUri(eventToSelect));
    }
  }, [calendlyEvents, selectedEventUri, dispatch]);

  const handleSubmit = async () => {
    if (selectedEventUri) {
      setIsSubmitting(true);
      try {
        const selectedEvent = calendlyEvents.find((event: Event) => event.uri === selectedEventUri);
        if (selectedEvent) {
          const calendlyIntegration = integrations?.find(
            (integration: any) => integration.platform === "calendly"
          );

          if (calendlyIntegration) {
            const userData = {
              integrationId: calendlyIntegration.id,
              meta_data: {
                scheduling_url: selectedEvent.scheduling_url,
                name: selectedEvent.name,
                uri: selectedEvent.uri
              }
            };

            const response = await submitEventType({
              userData,
              toast,
              dispatch
            });
            
            // Check the response and handle accordingly
            if (response && response.success) {
              toast.success("Event type successfully saved!");
            } else {
              toast.error("Failed to save event type.");
            }
          }
        }
      } catch (error) {
        console.error("Error submitting event type:", error);
        toast.error("An error occurred while saving event type.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm font-medium">Select Event Type</p>
        <p className="text-xs text-muted-foreground">
          Choose which event type you want to make available for scheduling. Only one event can be active at a time.
        </p>
      </div>

      <div className="flex gap-4">
        <Select
          value={selectedEventUri || ''}
          onValueChange={handleEventSelect}
        >
          <SelectTrigger className="w-[300px]">
            <SelectValue placeholder="Select an event type" />
          </SelectTrigger>
          <SelectContent>
            {calendlyEvents?.map((event: Event) => (
              <SelectItem key={event.uri} value={event.uri}>
                {event.name} ({event.duration} min)
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button 
          onClick={handleSubmit}
          disabled={!selectedEventUri || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit"
          )}
        </Button>
      </div>
    </div>
  );
};

export default EventSelector;
