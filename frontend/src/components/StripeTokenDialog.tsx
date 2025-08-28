
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

const StripeTokenDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <InfoIcon className="w-4 h-4 mr-2" />
          How to get Stripe keys
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>How to Get Your Stripe API Keys</DialogTitle>
          <DialogDescription>
            Follow these steps to obtain your Stripe API keys:
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <ol className="list-decimal pl-4 space-y-3">
            <li className="text-sm">
              Log in to your <a href="https://dashboard.stripe.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Stripe Dashboard</a>
            </li>
            <li className="text-sm">
              In the left sidebar, click on <span className="font-semibold">Developers</span>
            </li>
            <li className="text-sm">
              Select <span className="font-semibold">API keys</span> from the submenu
            </li>
            <li className="text-sm">
              You'll see both your <span className="font-semibold">Publishable key</span> (starts with 'pk_') and <span className="font-semibold">Secret key</span> (starts with 'sk_')
            </li>
            <li className="text-sm">
              For the Secret key, click <span className="font-semibold">Reveal test key</span> to see the full value
            </li>
            <li className="text-sm">
              Copy both keys and paste them into the respective fields in the form
            </li>
          </ol>
          
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800">
              💡 <span className="font-semibold">Test vs Live Mode:</span> By default, your dashboard shows Test mode keys. For production use, toggle to "View live keys" in the Stripe dashboard.
            </p>
          </div>
          
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800">
              ⚠️ <span className="font-semibold">Keep your Secret key secure:</span> Never expose your Secret key in client-side code or public repositories.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StripeTokenDialog;
