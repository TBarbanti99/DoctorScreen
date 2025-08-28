
import { useState } from "react";
import { FileText, Download, Loader, Link, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { API } from "@/redux/api";

interface ReportTableProps {
  filteredReports: any[];
  selectedReports: string[];
  handleSelectReport: (reportId: string) => void;
  handleDownload: (reportId: string, urlsList: any, folderName: string) => void;
  isDownloading: boolean;
  isLoading: boolean;
  handleRequestReport: () => void;
}

const ReportTable = ({
  filteredReports,
  selectedReports,
  handleSelectReport,
  handleDownload,
  isDownloading,
  isLoading,
  handleRequestReport
}: ReportTableProps) => {
  const { user } = useSelector((state: any) => state.user);
  const [isSendingBooking, setIsSendingBooking] = useState(false);

  const handleSendBookingLink = async (patientEmail: string) => {
    if (!user?.id) {
      toast.error("User session not found. Please log in again.");
      return;
    }

    setIsSendingBooking(true);
    try {
      const response = await API({
        endPoint: "/integration/send/booking/link",
        method: "POST",
        body: {
          name: "Patient",
          email: patientEmail,
          note: "Booking request from your healthcare provider",
          phone: "Not provided",
          userId: user.id
        },
        isFormData: false,
        toast,
        isToast: true,
        isHeaders: true,
        isToken: true
      });

      if (response.success) {
        toast.success("Booking link sent successfully");
      }
    } catch (error) {
      console.error("Error sending booking link:", error);
      toast.error("Failed to send booking link");
    } finally {
      setIsSendingBooking(false);
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    if (!status) return null;
    
    switch(status) {
      case "COMPLETED":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Completed
          </Badge>
        );
      case "FAILED":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            Failed
          </Badge>
        );
      case "PENDING":
      default:
        return (
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
            Pending
          </Badge>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-12 w-full rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (filteredReports.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle className="h-12 w-12 text-slate-300 mb-4" />
        <h3 className="text-lg font-medium mb-2">No Reports Found</h3>
        <p className="text-sm text-slate-500 mb-4 max-w-md">
          There are no reports available at the moment. Request a new report from your patient or try a different search term.
        </p>
        <Button onClick={handleRequestReport}>
          <Link className="mr-2 h-4 w-4" />
          Request New Report
        </Button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="pb-3 text-left font-medium w-10"></th>
            <th className="pb-3 text-left font-medium">Report Name</th>
            <th className="pb-3 text-left font-medium">Email</th>
            <th className="pb-3 text-left font-medium">Date</th>
            <th className="pb-3 text-left font-medium">Status</th>
            <th className="pb-3 text-left font-medium">Payment</th>
            <th className="pb-3 text-left font-medium">Type</th>
            <th className="pb-3 text-left font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredReports.map((report) => (
            <tr key={report.id} className="border-b">
              <td className="py-4 pl-4">
                {report.status !== "COMPLETED" && (
                  <Checkbox
                    checked={selectedReports.includes(report.id)}
                    onCheckedChange={() => handleSelectReport(report.id)}
                    aria-label={`Select ${report?.fullName}`}
                  />
                )}
              </td>
              <td className="py-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-[#062D46]" />
                  <span className="font-medium">{report?.fullName}</span>
                </div>
              </td>
              <td className="py-4">
                <div>
                  {/* <div className="font-medium">{report?.patient || "John Doe"}</div>
                  <div className="text-sm text-slate-500">ID: {report?.patientId || 357826}</div> */}
                  <div className="text-sm text-slate-500">{report?.reportEmail || "No email provided"}</div>
                </div>
              </td>
              <td className="py-4">{report?.createdAt?.slice(0,11)}</td>
              <td className="py-4">
                <Badge
                  variant={report.status === "COMPLETED" ? "default" : "outline"}
                  className={
                    report.status === "COMPLETED"
                      ? "bg-green-100 text-green-800 hover:bg-green-100"
                      : "bg-amber-100 text-amber-800 hover:bg-amber-100"
                  }
                >
                  {report.status === "COMPLETED" ? "Reviewed" : "Pending Review"}
                </Badge>
              </td>
              <td className="py-4">
                {getPaymentStatusBadge(report.paymentStatus)}
              </td>
              <td className="py-4 flex gap-[2px] justify-left place-items-center">
                {report?.reportAssets?.map((item:any) => (
                  <div key={item.id} className="flex items-center gap-2">
                    <span className="text-sm text-slate-500">{item?.fileName?.split(".")[1]},</span>
                  </div>
                ))}
              </td>
              <td className="py-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(report.id, report?.reportAssets, report?.fullName)}
                    disabled={isDownloading}
                  >
                    {isDownloading ? (
                      <>
                        <Loader className="h-3.5 w-3.5 mr-1 animate-spin" />
                        Downloading...
                      </>
                    ) : (
                      <>
                        <Download className="h-3.5 w-3.5 mr-1" />
                        Download
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSendBookingLink(report.reportEmail)}
                    disabled={isSendingBooking}
                  >
                    {isSendingBooking ? (
                      <>
                        <Loader className="h-3.5 w-3.5 mr-1 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Link className="h-3.5 w-3.5 mr-1" />
                        Send Booking Link
                      </>
                    )}
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReportTable;
