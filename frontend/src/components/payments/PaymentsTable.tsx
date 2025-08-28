
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";


interface Payment {
  id: string;
  reportId: string;
  amount: number;
  sessionId: string;
  paymentStatus: string;
  currency: string;
  email: string;
  name: string;
  doctorId: string;
  createdAt?: string;
}

interface PaymentsTableProps {
  payments: Payment[];
}

const PaymentsTable = ({ payments }: PaymentsTableProps) => {
  if (payments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle className="h-12 w-12 text-slate-300 mb-4" />
        <h3 className="text-lg font-medium mb-2">No Payments Found</h3>
        <p className="text-sm text-slate-500 mb-4 max-w-md">
          There are no payment records available at the moment.
        </p>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case "COMPLETE":
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

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Patient</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Report ID</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell className="font-medium">{payment.id.substring(0, 8)}...</TableCell>
              <TableCell>
                <div className="font-medium">{payment.name}</div>
                <div className="text-sm text-slate-500">{payment.email}</div>
              </TableCell>
              <TableCell>
                {formatCurrency(payment.amount / 100, payment.currency)}
              </TableCell>
              <TableCell>{getStatusBadge(payment.paymentStatus)}</TableCell>
              <TableCell>
                {payment.reportId?.substring(0, 8)}...
              </TableCell>
              <TableCell>
                {payment.createdAt ? 
                  new Date(payment.createdAt).toLocaleDateString() : 
                  "Not available"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PaymentsTable;
