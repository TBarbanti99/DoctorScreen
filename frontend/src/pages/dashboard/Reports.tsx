
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useReportManagement } from "@/hooks/useReportManagement";
import ReportFilters from "@/components/reports/ReportFilters";
import ReportTable from "@/components/reports/ReportTable";
import RequestReportDialog from "@/components/reports/RequestReportDialog";

const Reports = () => {
  const {
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
    handleRequestReport,
    handleCopyLink,
    handleSendEmail,
    handleDownload,
    handleSelectReport,
    handleMarkAsReviewed,
  } = useReportManagement();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#062D46]">Patient Reports</h1>
        <p className="text-slate-500">
          Manage and view uploaded patient reports
        </p>
      </div>

      <ReportFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedReports={selectedReports}
        handleRequestReport={handleRequestReport}
        handleMarkAsReviewed={handleMarkAsReviewed}
        isSubmitting={isSubmitting}
      />

      <Card>
        <CardHeader>
          <CardTitle>All Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <ReportTable
            filteredReports={filteredReports}
            selectedReports={selectedReports}
            handleSelectReport={handleSelectReport}
            handleDownload={handleDownload}
            isDownloading={isDownloading}
            isLoading={isLoading}
            handleRequestReport={handleRequestReport}
          />
        </CardContent>
      </Card>

      <RequestReportDialog
        isOpen={isRequestDialogOpen}
        setIsOpen={setIsRequestDialogOpen}
        reportLink={reportLink}
        handleCopyLink={handleCopyLink}
        isCopyingLink={isCopyingLink}
        isSendingEmail={isSendingEmail}
        onSendEmail={handleSendEmail}
      />
    </div>
  );
};

export default Reports;
