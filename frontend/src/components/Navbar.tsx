
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/assets/logo";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { LogoutUser } from "@/redux/actions/UserAction";
import { logoutUserAction } from "@/redux/slices/UserSlice";
import { useToast } from "@/hooks/use-toast";
import DesktopNavLinks from "@/components/navbar/DesktopNavLinks";
import MobileMenu from "@/components/navbar/MobileMenu";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user } = useSelector((state: any) => state.user);
  const dispatch = useDispatch();
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await LogoutUser({
      toast,
      dispatch,
      action: logoutUserAction,
    });
  };

  const getUserInitials = () => {
    if (!user) return "U";
    
    if (user.name) {
      return user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase();
    }
    
    if (user.email) {
      return user.email[0].toUpperCase();
    }
    
    return "U";
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "py-3 glass border-b border-slate-200"
          : "py-5 bg-transparent"
      }`}
    >
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Logo />
              <span className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#062D46] to-[#05253a]">
                Doctor Screen
              </span>
            </Link>
          </div>

          <DesktopNavLinks 
            isAuthenticated={isAuthenticated}
            user={user}
            getUserInitials={getUserInitials}
            handleLogout={handleLogout}
          />

          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        isAuthenticated={isAuthenticated}
        user={user}
        getUserInitials={getUserInitials}
        handleLogout={handleLogout}
      />
    </header>
  );
};

export default Navbar;
