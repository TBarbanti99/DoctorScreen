
import { createContext, useContext } from 'react';
import { useSelector } from 'react-redux';

type StripeContextType = {
  isStripeConnected: boolean;
  publishableKey: string;
};

export const StripeContext = createContext<StripeContextType>({
  isStripeConnected: false,
  publishableKey: '',
});

export const useStripe = () => {
  const integration = useSelector((state: any) => state.integration);
  const { integrations } = integration || { integrations: [] };
  
  // Make sure integrations is an array before using find
  const stripeIntegration = Array.isArray(integrations) 
    ? integrations.find((integration: any) => integration.platform === "stripe") 
    : undefined;

  return {
    isStripeConnected: !!stripeIntegration,
    publishableKey: stripeIntegration?.meta_data?.publishable_key || '',
  };
};
