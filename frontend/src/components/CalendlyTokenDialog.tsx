
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { InfoIcon } from "lucide-react";

const CalendlyTokenDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <InfoIcon className="w-4 h-4 mr-2" />
          How to obtain access token
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>How to Get Your Calendly Access Token</DialogTitle>
          <DialogDescription>
            Follow these steps to obtain your personal access token:
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <ol className="list-decimal pl-4 space-y-3">
            <li className="text-sm">Log in to your Calendly account</li>
            <li className="text-sm">Navigate to the Integrations Page</li>
            <li className="text-sm">Select the API & Webhooks tile</li>
            <li className="text-sm">
              If you have no prior personal access tokens, select <span className="font-semibold">Get a token now</span> under Personal Access Tokens
            </li>
            <li className="text-sm">
              If you already have a token, select <span className="font-semibold">Generate new token</span> under Your personal access tokens
            </li>
            <li className="text-sm">
              At <span className="font-semibold">Create your personal access token</span>, create an identifiable name for your token and select Create Token, then Copy token
            </li>
          </ol>
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800">
              ⚠️ Make sure to copy your token immediately after generation as you won't be able to see it again.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CalendlyTokenDialog;
