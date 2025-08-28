
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { API } from "@/redux/api";

type VerificationResult = {
  success: boolean;
  message: string;
};

const PaymentSuccess = () => {
  const [progress, setProgress] = useState(0);
  const [verificationStatus, setVerificationStatus] = useState<VerificationResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [searchParams , setSearchParams] = useSearchParams()
  const newParams = new URLSearchParams(searchParams);
  
  useEffect(() => {
    // Start progress animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90 && isLoading) return 90; // Stay at 90% until loading completes
        return Math.min(prev + 5, 100);
      });
    }, 150);
    
    // Get query parameters
    const queryParams = new URLSearchParams(location.search);
    const state = queryParams.get('state');
    const doctorId = queryParams.get('doctorId');
    const sessionId = queryParams.get('session_id');
    
    // Verify payment
    const verifyPayment = async () => {
      try {
        const response = await API({
          endPoint: "/stripe/verify/payment",
          method: "POST",
          body: { 
            state, 
            session_id: sessionId,
            doctorId : doctorId
          },
          isHeaders: true,
          isToken: false,
        });
        
        if (response.success) {
          setVerificationStatus({
            success: true,
            message: response.message || "Your payment has been processed successfully."
          });
          toast({
            title: "Payment Verified",
            description: "Your payment has been verified successfully.",
            variant: "default",
          });
          setSearchParams({})
        } else {
          setVerificationStatus({
            success: false,
            message: response.message?.message || "There was a problem verifying your payment."
          });
          setError(response.message?.message || "Payment verification failed.");
          toast({
            title: "Payment Verification Failed",
            description: response.message?.message || "There was a problem verifying your payment.",
            variant: "destructive",
          });
        }
      } catch (err) {
        console.error("Payment verification error:", err);
        setVerificationStatus({
          success: false,
          message: "An unexpected error occurred during payment verification."
        });
        setError("An unexpected error occurred during payment verification.");
        toast({
          title: "Error",
          description: "An unexpected error occurred during payment verification.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
        setProgress(100); // Complete the progress bar
      }
    };
    
    if(state && sessionId){
      verifyPayment();
    }
    
    return () => {
      clearInterval(progressInterval);
    };
  }, [toast, location]);

  const handleGoToDashboard = () => {
    navigate("/dashboard");
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="h-[100vh] flex items-center justify-center bg-gray-50">
      <div className="container max-w-md mx-auto my-12 px-4">
        <Card className={`shadow-lg border-2 ${verificationStatus?.success ? 'border-green-500' : error ? 'border-red-500' : 'border-gray-300'}`}>
          <CardHeader className="text-center">
            {isLoading ? (
              <div className="flex flex-col items-center space-y-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-36" />
              </div>
            ) : (
              <>
                <div className="mb-4 flex justify-center">
                  {verificationStatus?.success ? (
                    <CheckCircle className="h-16 w-16 text-green-500" />
                  ) : (
                    <XCircle className="h-16 w-16 text-red-500" />
                  )}
                </div>
                <CardTitle className="text-2xl">
                  {verificationStatus?.success ? "Payment Successful!" : "Payment Verification Issue"}
                </CardTitle>
                <CardDescription>
                  {verificationStatus?.success 
                    ? "Your transaction has been completed successfully"
                    : "We encountered an issue verifying your payment"}
                </CardDescription>
              </>
            )}
          </CardHeader>
          <CardContent>
            <Progress value={progress} className="h-2 mb-4" />
            
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : (
              <>
                <Alert className={`${verificationStatus?.success ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'} mb-4`}>
                  <AlertDescription>
                    {verificationStatus?.message}
                  </AlertDescription>
                </Alert>
                
                {/* {verificationStatus?.success && (
                  <div className="mt-4 text-center text-sm text-muted-foreground">
                    <p>Transaction ID: {Math.random().toString(36).substring(2, 12).toUpperCase()}</p>
                    <p>Date: {new Date().toLocaleDateString()}</p>
                  </div>
                )} */}
              </>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            {!isLoading && (
              <>
                {/* {verificationStatus?.success && (
                  <Button className="w-full" onClick={handleGoToDashboard}>
                    Go to Dashboard
                  </Button>
                )} */}
                <Button 
                  variant={verificationStatus?.success ? "outline" : "default"} 
                  className="w-full" 
                  onClick={handleGoHome}
                >
                  Return to Home
                </Button>
              </>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default PaymentSuccess;
