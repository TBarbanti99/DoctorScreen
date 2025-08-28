
import { createContext, useContext } from 'react';
import { useSelector } from 'react-redux';

type CalendlyContextType = {
  isCalendlyConnected: boolean;
  calendlyUrl: string;
  calendlyToken: string;
};

export const CalendlyContext = createContext<CalendlyContextType>({
  isCalendlyConnected: false,
  calendlyUrl: '',
  calendlyToken: '',
});

export const useCalendly = () => {
  const integration = useSelector((state: any) => state.integration);
  const { integrations } = integration || { integrations: [] };
  
  // Make sure integrations is an array before using find
  const calendlyIntegration = Array.isArray(integrations) 
    ? integrations.find((integration: any) => integration.platform === "calendly") 
    : undefined;

  return {
    isCalendlyConnected: !!calendlyIntegration,
    calendlyUrl: calendlyIntegration?.platformURL || '',
    calendlyToken: '', // We don't expose the token for security
  };
};
