
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

const PaymentCanceled = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    // Show cancellation toast
    toast({
      title: "Payment Canceled",
      description: "Your payment process has been canceled.",
      variant: "destructive",
    });
  }, [toast]);

  const handleTryAgain = () => {
    // Redirect to checkout or payment page
    // This should be updated to match your payment flow
    navigate("/");
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="h-[100vh] flex items-center justify-center bg-gray-50">
      <div className="container max-w-md mx-auto my-12 px-4">
        <Card className="border-gray-300 shadow-lg">
          <CardHeader className="text-center">
            <div className="mb-4 flex justify-center">
              <X className="h-16 w-16 text-gray-500" />
            </div>
            <CardTitle className="text-2xl">Payment Canceled</CardTitle>
            <CardDescription>
              Your payment process has been canceled
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="bg-gray-50 border-gray-200 mb-4">
              <AlertDescription>
                No charges were made to your account. You can try again whenever you're ready.
              </AlertDescription>
            </Alert>
            
            <div className="mt-4 text-center text-sm text-muted-foreground">
              <p>If you experienced any issues during checkout, please contact our support team.</p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            {/* <Button className="w-full" onClick={handleTryAgain}>
              Try Again
            </Button> */}
            <Button variant="outline" className="w-full" onClick={handleGoHome}>
              Return to Home
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default PaymentCanceled;
