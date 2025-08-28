
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  isAuthenticated: boolean;
  user: any;
  getUserInitials: () => string;
  handleLogout: () => Promise<void>;
}

const MobileMenu = ({
  isOpen,
  onClose,
  isAuthenticated,
  user,
  getUserInitials,
  handleLogout,
}: MobileMenuProps) => {
  if (!isOpen) return null;

  return (
    <div className="md:hidden glass">
      <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        <a
          href="#features"
          className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-[#062D46] hover:bg-blue-50"
          onClick={onClose}
        >
          Features
        </a>
        <a
          href="#how-it-works"
          className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-[#062D46] hover:bg-blue-50"
          onClick={onClose}
        >
          How It Works
        </a>
        <a
          href="#doctors"
          className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-[#062D46] hover:bg-blue-50"
          onClick={onClose}
        >
          For Doctors
        </a>
        <a
          href="#contact"
          className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-[#062D46] hover:bg-blue-50"
          onClick={onClose}
        >
          Contact
        </a>
        
        {isAuthenticated ? (
          <div className="flex items-center justify-between px-3 py-2">
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                {user && user.profilePicture ? (
                  <AvatarImage src={user.profilePicture} alt={user.name || "User"} />
                ) : (
                  <AvatarFallback className="bg-[#062D46] text-white text-sm">
                    {getUserInitials()}
                  </AvatarFallback>
                )}
              </Avatar>
              <span className="text-base font-medium">
                {user && (user.name || user.email) ? 
                  (user.name || user.email) : 
                  "My Account"
                }
              </span>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClose}
                asChild
              >
                <Link to="/dashboard">Dashboard</Link>
              </Button>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={async () => {
                  await handleLogout();
                  onClose();
                }}
              >
                Logout
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex space-x-2 pt-2">
            <Button
              variant="ghost"
              className="w-full justify-center text-[#062D46] hover:text-[#05253a] hover:bg-blue-50"
              onClick={onClose}
              asChild
            >
              <Link to="/login">Login</Link>
            </Button>
            <Button
              className="w-full justify-center bg-[#062D46] hover:bg-[#05253a]"
              onClick={onClose}
              asChild
            >
              <Link to="/signup">Sign Up</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;
