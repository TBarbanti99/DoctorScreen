
import { User } from "lucide-react";

interface UserInfoProps {
  userName: string | undefined;
  userRole?: string;
}

const UserInfo = ({ userName, userRole }: UserInfoProps) => {
  return (
    <div className="flex items-center gap-2">
      <User className="w-5 h-5 text-gray-500" />
      <div className="flex flex-col">
        <span className="text-sm font-medium">
          {userName || "Doctor"}
        </span>
        {userRole && (
          <span className="text-xs text-gray-500 capitalize">
            {userRole.toLowerCase()}
          </span>
        )}
      </div>
    </div>
  );
};

export default UserInfo;
