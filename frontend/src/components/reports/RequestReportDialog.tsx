
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Mail, Send, Loader, Clipboard, Link } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface RequestReportDialogProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  reportLink: string;
  handleCopyLink: () => void;
  isCopyingLink: boolean;
  isSendingEmail: boolean;
  onSendEmail: (emailData: any) => void;
}

const RequestReportDialog = ({
  isOpen,
  setIsOpen,
  reportLink,
  handleCopyLink,
  isCopyingLink,
  isSendingEmail,
  onSendEmail
}: RequestReportDialogProps) => {
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [emailData, setEmailData] = useState({
    email: "",
    subject: "",
    message: "",
  });

  const handleCancel = () => {
    setShowEmailForm(false);
  };

  const handleSendEmail = () => {
    if (showEmailForm) {
      // Submit the email data
      onSendEmail(emailData);
    } else {
      // Just show the email form
      setShowEmailForm(true);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Report Request</DialogTitle>
          <DialogDescription>
            How would you like to share this report request with the patient?
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Input value={reportLink} readOnly className="w-full" />
          </div>
          <Button 
            size="sm" 
            className="px-3" 
            onClick={handleCopyLink}
            disabled={isCopyingLink}
          >
            <span className="sr-only">Copy</span>
            {isCopyingLink ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>

        {showEmailForm && (
          <div className="mt-4 space-y-3">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Patient's Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="patient@example.com"
                value={emailData.email}
                onChange={(e) =>
                  setEmailData({ ...emailData, email: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium">
                Subject
              </label>
              <Input
                id="subject"
                type="text"
                placeholder="Medical Report Request"
                value={emailData.subject}
                onChange={(e) =>
                  setEmailData({ ...emailData, subject: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">
                Message
              </label>
              <Textarea
                id="message"
                placeholder="Here is a link to submit your medical report..."
                value={emailData.message}
                onChange={(e) =>
                  setEmailData({ ...emailData, message: e.target.value })
                }
                rows={4}
              />
            </div>
          </div>
        )}

        <DialogFooter
          className={showEmailForm ? "sm:justify-end" : "sm:justify-between"}
        >
          {showEmailForm ? (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="mt-2 sm:mt-0"
              >
                Cancel
              </Button>
              <Button 
                type="button" 
                onClick={handleSendEmail}
                disabled={isSendingEmail}
              >
                {isSendingEmail ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Email
                  </>
                )}
              </Button>
            </>
          ) : (
            <>
              <Button
                type="button"
                variant="secondary"
                onClick={handleCopyLink}
                disabled={isCopyingLink}
              >
                {isCopyingLink ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Copying...
                  </>
                ) : (
                  <>
                    <Clipboard className="mr-2 h-4 w-4" />
                    Copy Link
                  </>
                )}
              </Button>
              <Button 
                type="button" 
                onClick={handleSendEmail}
                disabled={isSendingEmail}
              >
                {isSendingEmail ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Send by Email
                  </>
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RequestReportDialog;
