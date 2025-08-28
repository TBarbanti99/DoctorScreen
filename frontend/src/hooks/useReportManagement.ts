import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { getReportList, sendReportOnEmail, updateReportStatus } from "@/redux/actions/reportAction";
import { useStripe } from "@/contexts/StripeContext";
import { useCalendly } from "@/contexts/CalendlyContext";
import JSZip from "jszip";

interface RootState {
  user: { user: any };
}

export const useReportManagement = () => {
  const { isStripeConnected } = useStripe();
  const { isCalendlyConnected, calendlyUrl } = useCalendly();
  const integration = useSelector((state: any) => state.integration);
  const { selectedEventUri } = integration || {};
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const [reportLink, setReportLink] = useState("");
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [reports, setReports] = useState([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isCopyingLink, setIsCopyingLink] = useState(false);
  const { user } = useSelector((state: RootState) => state.user);

  const filteredReports = reports.filter(
    (report) =>
      report.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRequestReport = () => {
    // Check if Stripe is connected before allowing report request
    if (!isStripeConnected) {
      toast.error("Stripe integration is required to request reports. Please connect Stripe in the Settings page.");
      return;
    }

    // Check if Calendly is connected and event is selected
    if (!isCalendlyConnected) {
      toast.error("Calendly integration is required to request reports. Please connect Calendly in the Settings page.");
      return;
    }

    if (!selectedEventUri) {
      toast.error("Please select an event type in Settings before requesting reports.");
      return;
    }
    
    // Generate a unique request ID
    const requestId =
      "REQ-" + Math.random().toString(36).substring(2, 10).toUpperCase();

    // Create a shareable link that would normally be sent to the patient
    const doctorId = user?.id;
    const link = `${window.location.origin}/submit-report?doctorId=${doctorId}&requestId=${requestId}`;
    // Save the link and open dialog
    setReportLink(link);
    setIsRequestDialogOpen(true);
  };

  const handleCopyLink = async () => {
    // Double check integrations
    if (!isStripeConnected) {
      toast.error("Stripe integration is required to send report links");
      return;
    }

    if (!isCalendlyConnected || !selectedEventUri) {
      toast.error("Calendly integration and event selection are required");
      return;
    }
    
    setIsCopyingLink(true);
    try {
      await navigator.clipboard.writeText(reportLink);
      toast.success("Report request link copied to clipboard!");
      console.log("Report request link:", reportLink);
    } catch (err) {
      console.error("Failed to copy link: ", err);
      toast.error("Failed to copy link. Please try again.");
    } finally {
      setIsCopyingLink(false);
    }
  };

  const handleSendEmail = async (emailData: any) => {
    // Double check integrations
    if (!isStripeConnected) {
      toast.error("Stripe integration is required to send report emails");
      return;
    }

    if (!isCalendlyConnected || !selectedEventUri) {
      toast.error("Calendly integration and event selection are required");
      return;
    }
    
    // If email data is missing required fields
    if (!emailData.email || !emailData.subject || !emailData.message) {
      toast.error("Please fill in all email fields");
      return;
    }

    setIsSendingEmail(true);
    // In a real app, this would send an email through your backend
    try {
      const formData = {
        email: emailData.email,
        subject: emailData.subject,
        message: emailData.message,
        link: reportLink,
      }
      const result = await sendReportOnEmail({toast,formData});
      if (result.success) {
        setIsRequestDialogOpen(false);
      }
    } catch (error) {
      toast.error("Failed to send email. Please try again.");
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleDownload = async (reportId: string, UrlsList: any, folderName: string) => {
    if (UrlsList?.length === 0) {
      toast.error("No files to download");
      return;
    }
    setIsDownloading(true);
    // Create a new JSZip instance
    const zip = new JSZip();
    const folder = zip.folder(folderName);

    // Add files to the zip folder
    UrlsList.forEach((item: any) => {
      const fileName = item.fileName;
      folder?.file(fileName, fetch(item.fileURL, {
        headers: {
          "ngrok-skip-browser-warning": "true",
        }
      }).then(res => res.blob()));
    });

    // Generate the zip file and trigger download
    await zip.generateAsync({ type: "blob" }).then((content) => {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(content);
      link.download = `${folderName}.zip`;
      link.click();
    });
    setIsDownloading(false);
    toast.success(`Downloading report ${reportId}`);
  };

  const handleSelectReport = (reportId: string) => {
    setSelectedReports((prev) => {
      if (prev.includes(reportId)) {
        return prev.filter((id) => id !== reportId);
      } else {
        return [...prev, reportId];
      }
    });
  };

  const handleMarkAsReviewed = async () => {
    if (selectedReports.length === 0) {
      toast.error("Please select at least one report to mark as reviewed");
      return;
    }
    setIsSubmitting(true);
    try {
      const formData = {
        reportIds: selectedReports,
      };
      const result = await updateReportStatus({ toast, formData });
      
      if (!result.success) {
        toast.error(result.message?.message || "Failed to update report status");
        return;
      }

      // update the status of the reports in the state
      const updatedReports = reports.map((report: any) => {
        if (selectedReports.includes(report?.id)) {
          return {
            ...report,
            status: "COMPLETED",
          };
        } else {
          return report;
        }
      });
      setReports(updatedReports);
      setSelectedReports([]);
      toast.success("Reports marked as reviewed successfully");
    } catch (error) {
      console.error("Error updating report status:", error);
      toast.error("An error occurred while updating report status");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchReports = async () => {
      setIsLoading(true);
      try {
        const result = await getReportList({ toast });
        if (result.success) {
          setReports(result?.message?.reports || []);
        } else {
          console.error("Failed to fetch reports:", result);
          toast.error("Failed to fetch reports. Please try again later.");
        }
      } catch (error) {
        console.error("Error fetching reports:", error);
        toast.error("An error occurred while fetching reports");
      } finally {
        setIsLoading(false);
      }
    };
    fetchReports();
  }, []);

  return {
    searchTerm,
    setSearchTerm,
    isRequestDialogOpen,
    setIsRequestDialogOpen,
    reportLink,
    selectedReports,
    filteredReports,
    isDownloading,
    isSubmitting,
    isLoading,
    isSendingEmail,
    isCopyingLink,
    isStripeConnected,
    isCalendlyConnected,
    selectedEventUri,
    handleRequestReport,
    handleCopyLink,
    handleSendEmail,
    handleDownload,
    handleSelectReport,
    handleMarkAsReviewed,
  };
};
