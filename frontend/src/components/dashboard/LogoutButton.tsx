
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LogoutButtonProps {
  handleLogout: () => void;
}

const LogoutButton = ({ handleLogout }: LogoutButtonProps) => {
  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={handleLogout}
      className="flex items-center gap-1 text-gray-700 hover:text-red-600"
    >
      <LogOut className="w-4 h-4" />
      <span>Logout</span>
    </Button>
  );
};

export default LogoutButton;
