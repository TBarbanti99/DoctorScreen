
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Calendar, Link, Loader, CreditCard } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import EventSelector from '../EventSelector';
import CalendlyTokenDialog from '@/components/CalendlyTokenDialog';
import StripeTokenDialog from '@/components/StripeTokenDialog';
import {
  connectIntegration,
  fetchIntegrations,
  fetchCalendlyEvents,
  disconnectIntegration,
  clearCalendlyEvents,
  addStripeCredentials
} from '@/redux/actions/IntegrationAction';

const IntegrationsForm = () => {
  const [calendlyUrl, setCalendlyUrl] = useState("");
  const [calendlyToken, setCalendlyToken] = useState("");
  const [stripePublicKey, setStripePublicKey] = useState("");
  const [stripeSecretKey, setStripeSecretKey] = useState("");
  const [stripeAmount, setStripeAmount] = useState(0);
  const [stripeAmountReport, setStripeAmountReport] = useState(0);
  const [isConnectLoading, setIsConnectLoading] = useState(false);
  const [isDisconnectLoading, setIsDisconnectLoading] = useState(false);
  const [isStripeConnectLoading, setIsStripeConnectLoading] = useState(false);
  const [isStripeDisconnectLoading, setIsStripeDisconnectLoading] = useState(false);
  const [hasFetchedOnMount, setHasFetchedOnMount] = useState(false);
  const dispatch = useDispatch();
  
  // Get the integration state and properly handle possible null/undefined values
  const integration = useSelector((state: any) => state.integration);
  const { calendlyEvents = [], integrations = [], isLoading = false } = integration || {};

  const handleConnectCalendly = async () => {
    if (!calendlyUrl) {
      toast.error("Please enter your Calendly URL");
      return;
    }

    if (!calendlyToken) {
      toast.error("Please enter your Calendly access token");
      return;
    }

    if (!calendlyUrl.includes("calendly.com")) {
      toast.error("Please enter a valid Calendly URL");
      return;
    }

    setIsConnectLoading(true);
    const response = await connectIntegration({
      userData: {
        access_token: calendlyToken,
        platform: "calendly",
        platformURL: calendlyUrl
      },
      toast,
      dispatch
    });

    setIsConnectLoading(false);
    if (response.success) {
      setCalendlyUrl("");
      setCalendlyToken("");
      fetchCalendlyEvents({ toast, dispatch });
    }
  };

  const handleDisconnectCalendly = async () => {
    const calendlyIntegration = integrations.find(
      (integration: any) => integration.platform === "calendly"
    );

    if (calendlyIntegration) {
      setIsDisconnectLoading(true);
      const response = await disconnectIntegration({
        userData: {
          integrationId: calendlyIntegration.id
        },
        toast,
        dispatch
      });

      setIsDisconnectLoading(false);
      if (response.success) {
        setCalendlyUrl("");
        setCalendlyToken("");
        
        try {
          clearCalendlyEvents({ dispatch });
        } catch (error) {
          console.error("Error clearing Calendly events:", error);
        }
      }
    }
  };

  const handleConnectStripe = async () => {
    if (!stripePublicKey) {
      toast.error("Please enter your Stripe public key");
      return;
    }

    if (!stripeSecretKey) {
      toast.error("Please enter your Stripe secret key");
      return;
    }
    if(stripeAmount === 0){
      toast.error("Please enter the amount to charge for consultation in dollars");
      return;
    }
    if(stripeAmountReport === 0){
      toast.error("Please enter the amount to charge for report in dollars");
      return;
    }

    setIsStripeConnectLoading(true);
    
    const response = await addStripeCredentials({
      userData: {
        publicKey: stripePublicKey,
        privateKey: stripeSecretKey,
        amount : stripeAmount,
        amountReport : stripeAmountReport
      },
      toast,
      dispatch
    });

    setIsStripeConnectLoading(false);
    if (response.success) {
      setStripePublicKey("");
      setStripeSecretKey("");
      toast.success("Stripe integration connected successfully");
    }
  };

  const handleDisconnectStripe = async () => {
    const stripeIntegration = integrations.find(
      (integration: any) => integration.platform === "stripe"
    );

    if (stripeIntegration) {
      setIsStripeDisconnectLoading(true);
      const response = await disconnectIntegration({
        userData: {
          integrationId: stripeIntegration.id
        },
        toast,
        dispatch
      });

      setIsStripeDisconnectLoading(false);
      if (response.success) {
        toast.success("Stripe integration disconnected successfully");
      }
    }
  };

  // Make sure we safely check if integrations is an array before using .some()
  const isCalendlyIntegrated = Array.isArray(integrations) && 
    integrations.some((integration: any) => integration.platform === "calendly");
  
  const isStripeIntegrated = Array.isArray(integrations) && 
    integrations.some((integration: any) => integration.platform === "stripe");

  // Fetch integrations when component mounts - always fetch to ensure fresh data after login
  useEffect(() => {
    if (!hasFetchedOnMount && !isLoading) {
      console.log("Fetching integrations on mount");
      fetchIntegrations({ toast, dispatch });
      setHasFetchedOnMount(true);
    }
  }, [hasFetchedOnMount, isLoading, dispatch]);

  // Only fetch Calendly events if Calendly is integrated
  useEffect(() => {
    if (isCalendlyIntegrated && Array.isArray(calendlyEvents) && calendlyEvents.length === 0) {
      fetchCalendlyEvents({ toast, dispatch });
    }
  }, [isCalendlyIntegrated, calendlyEvents, dispatch]);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-blue-100 text-blue-700">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-medium">Calendly</h4>
              <p className="text-sm text-muted-foreground">
                Connect your Calendly account to manage consultations
              </p>
            </div>
          </div>
          {isCalendlyIntegrated ? (
            <Button 
              variant="outline" 
              onClick={handleDisconnectCalendly}
              className="text-red-500 border-red-200 hover:text-red-600 hover:border-red-300 hover:bg-red-50"
              disabled={isDisconnectLoading}
            >
              {isDisconnectLoading ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Disconnecting...
                </>
              ) : (
                "Disconnect"
              )}
            </Button>
          ) : (
            <Button 
              variant="outline" 
              className="text-green-600 border-green-200 hover:text-green-700 hover:border-green-300 hover:bg-green-50"
              disabled={!calendlyUrl || !calendlyToken || isConnectLoading}
              onClick={handleConnectCalendly}
            >
              {isConnectLoading ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                "Connect"
              )}
            </Button>
          )}
        </div>
        
        {!isCalendlyIntegrated && (
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="calendlyUrl">Your Calendly URL</Label>
              <Input 
                id="calendlyUrl" 
                placeholder="https://calendly.com/yourusername" 
                value={calendlyUrl}
                onChange={(e) => setCalendlyUrl(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="calendlyToken">Access Token</Label>
                <CalendlyTokenDialog />
              </div>
              <Input 
                id="calendlyToken" 
                type="password"
                placeholder="Enter your Calendly access token" 
                value={calendlyToken}
                onChange={(e) => setCalendlyToken(e.target.value)}
              />
            </div>

            <Button 
              onClick={handleConnectCalendly}
              disabled={!calendlyUrl || !calendlyToken || isConnectLoading}
            >
              {isConnectLoading ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                "Connect"
              )}
            </Button>
          </div>
        )}

        {isCalendlyIntegrated && Array.isArray(calendlyEvents) && calendlyEvents.length > 0 && (
          <div className="mt-6 p-4 border border-gray-200 rounded-lg">
            <EventSelector />
          </div>
        )}
      </div>

      <Separator />

      {/* Stripe Integration Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-purple-100 text-purple-700">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-medium">Stripe</h4>
              <p className="text-sm text-muted-foreground">
                Connect your Stripe account to process payments
              </p>
            </div>
          </div>
          {isStripeIntegrated ? (
            <Button 
              variant="outline" 
              onClick={handleDisconnectStripe}
              className="text-red-500 border-red-200 hover:text-red-600 hover:border-red-300 hover:bg-red-50"
              disabled={isStripeDisconnectLoading}
            >
              {isStripeDisconnectLoading ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Disconnecting...
                </>
              ) : (
                "Disconnect"
              )}
            </Button>
          ) : (
            <Button 
              variant="outline" 
              className="text-green-600 border-green-200 hover:text-green-700 hover:border-green-300 hover:bg-green-50"
              disabled={!stripePublicKey || !stripeSecretKey || isStripeConnectLoading}
              onClick={handleConnectStripe}
            >
              {isStripeConnectLoading ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                "Connect"
              )}
            </Button>
          )}
        </div>
        
        {!isStripeIntegrated && (
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="stripePublicKey">Stripe Public Key</Label>
              <Input 
                id="stripePublicKey" 
                placeholder="pk_test_..." 
                value={stripePublicKey}
                onChange={(e) => setStripePublicKey(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="stripeSecretKey">Stripe Secret Key</Label>
                <StripeTokenDialog />
              </div>
              <Input 
                id="stripeSecretKey" 
                type="password"
                placeholder="sk_test_..." 
                value={stripeSecretKey}
                onChange={(e) => setStripeSecretKey(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="stripeAmount">
                  Amount to Charge for Consultation (in dollars)
                </Label>
              </div>
              <Input 
                id="stripeAmount" 
                type="number"
                placeholder="Enter amount in dollars (50)" 
                value={stripeAmount}
                onChange={(e) => setStripeAmount(parseInt(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="stripeAmount">
                  Amount to Charge for Report (in dollars)
                </Label>
              </div>
              <Input 
                id="stripeAmount" 
                type="number"
                placeholder="Enter amount in dollars (50)" 
                value={stripeAmountReport}
                onChange={(e) => setStripeAmountReport(parseInt(e.target.value))}
              />
            </div>


            <Button 
              onClick={handleConnectStripe}
              disabled={!stripePublicKey || !stripeSecretKey || isStripeConnectLoading}
            >
              {isStripeConnectLoading ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                "Connect"
              )}
            </Button>
          </div>
        )}
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-slate-100 text-slate-700">
              <Link className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-medium">Other Integrations</h4>
              <p className="text-sm text-muted-foreground">
                More integrations coming soon
              </p>
            </div>
          </div>
          <Button variant="outline" disabled>
            Coming Soon
          </Button>
        </div>
      </div>
    </div>
  );
};

export default IntegrationsForm;
