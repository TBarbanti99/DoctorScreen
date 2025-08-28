
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import PaymentsTable from "@/components/payments/PaymentsTable";
import { API } from "@/redux/api";
import { toast } from "@/components/ui/use-toast";
import { AlertCircle } from "lucide-react";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPayments = async () => {
      setIsLoading(true);
      try {
        const response = await API({
          endPoint: "/stripe/payment/list",
          method: "GET",
          isFormData: false,
          isHeaders: true,
          isToken: true,
        });
        if (response.success) {
          // The API returns payments directly in the response
          setPayments(response?.message?.payments || []);
        } else {
          setError("Failed to load payments data");
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load payments data",
          });
        }
      } catch (error) {
        console.error("Error fetching payments:", error);
        setError("An error occurred while loading payments");
        toast({
          variant: "destructive",
          title: "Error",
          description: "An error occurred while loading payments",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayments();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#062D46]">Payments</h1>
        <p className="text-slate-500">View and manage all payment transactions</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-4 w-4 rounded" />
                  <Skeleton className="h-12 w-full rounded" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="h-12 w-12 text-slate-300 mb-4" />
              <h3 className="text-lg font-medium mb-2">Failed to Load Payments</h3>
              <p className="text-sm text-slate-500 mb-4 max-w-md">
                {error}. Please try again later.
              </p>
            </div>
          ) : (
            <PaymentsTable payments={payments} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Payments;
