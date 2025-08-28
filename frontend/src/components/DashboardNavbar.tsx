
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LogoutUser } from "@/redux/actions/UserAction";
import { logoutUserAction } from "@/redux/slices/UserSlice";
import { toast } from "sonner";
import UserInfo from "@/components/dashboard/UserInfo";
import LogoutButton from "@/components/dashboard/LogoutButton";
import SessionChecker from "@/components/dashboard/SessionChecker";

const DashboardNavbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state: any) => state.user);

  const handleLogout = async () => {
    await LogoutUser({
      toast,
      dispatch,
      action: logoutUserAction
    });
    
    navigate("/login");
  };

  const handleAutoLogout = () => {
    handleLogout();
    toast.error("Session expired. Please login again.");
  };

  return (
    <div className="flex items-center justify-between h-16 px-4 border-b lg:px-6">
      <UserInfo userName={user?.userName} />
      
      <div className="flex items-center gap-4">
        <LogoutButton handleLogout={handleLogout} />
      </div>
      
      <SessionChecker handleAutoLogout={handleAutoLogout} />
    </div>
  );
};

export default DashboardNavbar;
