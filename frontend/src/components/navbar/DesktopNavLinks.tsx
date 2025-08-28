
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import UserDropdown from "./UserDropdown";

interface DesktopNavLinksProps {
  isAuthenticated: boolean;
  user: any;
  getUserInitials: () => string;
  handleLogout: () => Promise<void>;
}

const DesktopNavLinks = ({
  isAuthenticated,
  user,
  getUserInitials,
  handleLogout,
}: DesktopNavLinksProps) => {
  return (
    <nav className="hidden md:flex items-center space-x-8">
      <a
        href="#features"
        className="text-slate-700 hover:text-[#062D46] transition-colors"
      >
        Features
      </a>
      <a
        href="#how-it-works"
        className="text-slate-700 hover:text-[#062D46] transition-colors"
      >
        How It Works
      </a>
      <a
        href="#doctors"
        className="text-slate-700 hover:text-[#062D46] transition-colors"
      >
        For Doctors
      </a>
      <a
        href="#contact"
        className="text-slate-700 hover:text-[#062D46] transition-colors"
      >
        Contact
      </a>
      
      {isAuthenticated ? (
        <UserDropdown 
          user={user}
          getUserInitials={getUserInitials}
          handleLogout={handleLogout}
        />
      ) : (
        <>
          <Button
            variant="ghost"
            className="text-[#062D46] hover:text-[#05253a] hover:bg-blue-50"
            asChild
          >
            <Link to="/login">Login</Link>
          </Button>
          <Button className="bg-[#062D46] hover:bg-[#05253a]" asChild>
            <Link to="/signup">Sign Up</Link>
          </Button>
        </>
      )}
    </nav>
  );
};

export default DesktopNavLinks;
