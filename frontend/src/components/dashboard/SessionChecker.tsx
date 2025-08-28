
import { useEffect } from "react";
import { clearAuthError } from "@/utils/tokenUtils";

interface SessionCheckerProps {
  handleAutoLogout: () => void;
}

const SessionChecker = ({ handleAutoLogout }: SessionCheckerProps) => {
  useEffect(() => {
    const checkAuthError = () => {
      const authError = localStorage.getItem("auth_error");
      if (authError === "true") {
        // Clear the auth error flag
        clearAuthError();
        // Handle automatic logout
        handleAutoLogout();
      }
    };

    // Check immediately on component mount
    checkAuthError();
    
    // Set up interval to check periodically (every 5 seconds)
    const intervalId = setInterval(checkAuthError, 5000);
    
    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [handleAutoLogout]);

  // This component doesn't render anything
  return null;
};

export default SessionChecker;
