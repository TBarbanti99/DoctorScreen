
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckSquare, Link } from "lucide-react";
import { Loader } from "lucide-react";

interface ReportFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedReports: string[];
  handleRequestReport: () => void;
  handleMarkAsReviewed: () => void;
  isSubmitting: boolean;
}

const ReportFilters = ({
  searchTerm,
  setSearchTerm,
  selectedReports,
  handleRequestReport,
  handleMarkAsReviewed,
  isSubmitting
}: ReportFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between">
      <div className="relative w-full sm:w-96">
        <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search reports..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        {selectedReports.length > 0 && (
          <Button onClick={handleMarkAsReviewed} variant="outline" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <CheckSquare className="mr-2 h-4 w-4" />
                Mark as Reviewed ({selectedReports.length})
              </>
            )}
          </Button>
        )}
        <Button onClick={handleRequestReport}>
          <Link className="mr-2 h-4 w-4" />
          Request Report
        </Button>
      </div>
    </div>
  );
};

export default ReportFilters;
