
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Calendar,
  Users,
  Settings,
  Menu,
  X,
  Home,
  CreditCard,
} from "lucide-react";
import Logo from "@/assets/logo";
import DashboardNavbar from "@/components/DashboardNavbar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    {
      title: "Dashboard",
      icon: Home,
      href: "/dashboard",
    },
    {
      title: "Reports",
      icon: FileText,
      href: "/dashboard/reports",
    },
    {
      title: "Consultations",
      icon: Calendar,
      href: "/dashboard/consultations",
    },
    {
      title: "Patients",
      icon: Users,
      href: "/dashboard/patients",
    },
    {
      title: "Payments",
      icon: CreditCard,
      href: "/dashboard/payments",
    },
    {
      title: "Settings",
      icon: Settings,
      href: "/dashboard/settings",
    },
  ];

  return (
    <div className="flex min-h-screen w-full bg-gray-50/40">
      {/* Sidebar for large screens */}
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 border-r bg-white lg:block">
        <div className="flex h-full flex-col">
          <div className="border-b px-4 py-6">
            <Link to="/" className="flex items-center gap-2">
              <Logo />
              <span className="text-xl font-semibold">Doctor Screen</span>
            </Link>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${
                  location.pathname === item.href
                    ? "bg-[#062D46] text-white"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.title}
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          <div className="fixed inset-y-0 left-0 z-40 w-64 bg-white">
            <div className="flex items-center justify-between border-b px-4 py-5">
              <Link to="/" className="flex items-center gap-2">
                <Logo />
                <span className="text-xl font-semibold">Doctor Screen</span>
              </Link>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <nav className="space-y-1 px-2 py-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${
                    location.pathname === item.href
                      ? "bg-[#062D46] text-white"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  {item.title}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col lg:pl-64">
        {/* Top navigation */}
        <DashboardNavbar />

        {/* Mobile top nav */}
        <div className="border-b lg:hidden">
          <div className="flex h-16 items-center gap-4 px-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <Link to="/" className="flex items-center gap-2">
              <Logo />
              <span className="text-xl font-semibold">Doctor Screen</span>
            </Link>
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
