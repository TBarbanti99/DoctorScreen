
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link, Loader, AlertTriangle, Settings } from "lucide-react";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

interface CalendarCardProps {
  isCalendlyConnected: boolean;
  isStripeConnected : boolean;
  selectedEventUri: string | null;
  integrations: any[];
}

const CalendarCard: React.FC<CalendarCardProps> = ({
  isCalendlyConnected,
  selectedEventUri,
  integrations,
  isStripeConnected
}) => {
  const [isSending, setIsSending] = useState(false);
  const { user } = useSelector((state: any) => state.user);
  const navigate = useNavigate();

  const handleSendLink = async () => {
    if (!selectedEventUri) {
      toast.error("Please select an event type in Integrations first");
      return;
    }

    if (!user?.id) {
      toast.error("User session not found. Please log in again.");
      return;
    }

    const calendlyIntegration = integrations?.find(
      (integration: any) => integration.platform === "calendly"
    );

    if (!calendlyIntegration?.meta_data?.scheduling_url) {
      toast.error("Booking link not found. Please check your integration settings.");
      return;
    }

    setIsSending(true);
    try {
      const bookingUrl = `${window.location.origin}/booking/${calendlyIntegration.id}/${user.id}`;
      await navigator.clipboard.writeText(bookingUrl);
      toast.success("Booking link copied to clipboard!");
    } catch (err) {
      console.error('Failed to copy link: ', err);
      toast.error("Failed to copy booking link. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const navigateToCalendlySettings = () => {
    navigate("/dashboard/settings", { state: { defaultTab: "integrations" } });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Booking Link</CardTitle>
          <div className="flex flex-col items-end gap-2">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSendLink}
                disabled={!isCalendlyConnected || !isStripeConnected || !selectedEventUri || isSending}
              >
                {isSending ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Copying...
                  </>
                ) : (
                  <>
                    <Link className="mr-2 h-4 w-4" />
                    Copy Booking Link
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {!isCalendlyConnected || !isStripeConnected && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <span className="text-slate-300 mb-4">📅</span>
            <h3 className="text-lg font-medium mb-2">
              {
                !isCalendlyConnected && !isStripeConnected
                  ? "Connect Calendly and Stripe to manage your schedule":
                  !isCalendlyConnected
                  ? "Connect Calendly to manage your schedule":
                  "Connect Stripe to manager your payments"
              }
              </h3>
            <p className="text-sm text-slate-500 mb-4 max-w-xs">
              {
                !isCalendlyConnected && !isStripeConnected
                  ? "You need to connect both Calendly and Stripe to manage your consultations."
                  : !isCalendlyConnected
                    ? "Connect your Calendly account to manage your consultations."
                    : "Connect your Stripe account to manage payments for consultations."
              }
            </p>
            <Button onClick={navigateToCalendlySettings}>
              {
                !isCalendlyConnected && !isStripeConnected
                  ? "Connect Integrations":
                  !isCalendlyConnected
                  ? "Connect Calendly":
                  "Connect Stripe"
              }
            </Button>
          </div>
        )}
        
        {isCalendlyConnected && !selectedEventUri && (
          <div className="space-y-4">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Please select an event type from Settings to enable booking functionality.
              </AlertDescription>
            </Alert>
            <div className="flex flex-col items-center justify-center py-4 text-center">
              <Settings className="h-8 w-8 text-slate-400 mb-3" />
              <h3 className="text-lg font-medium mb-2">Event Type Required</h3>
              <p className="text-sm text-slate-500 mb-4 max-w-xs">
                You need to select an event type in Settings before you can generate booking links
              </p>
              <Button onClick={navigateToCalendlySettings}>
                <Settings className="mr-2 h-4 w-4" />
                Go to Settings
              </Button>
            </div>
          </div>
        )}
        
        {isCalendlyConnected && isStripeConnected && selectedEventUri && (
          <div className="mt-4 p-4 border rounded-md bg-slate-50">
            <h3 className="text-sm font-medium mb-2">Custom Booking Link</h3>
            <p className="text-xs text-slate-500 mb-4">
              Share this booking link with anyone to collect their information.
            </p>
            <Button size="sm" className="w-full" onClick={handleSendLink}>
              Copy Link
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CalendarCard;
