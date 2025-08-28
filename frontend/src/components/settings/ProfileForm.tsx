
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Loader } from "lucide-react";
import { updateProfile } from "@/redux/actions/UserAction";
import { updateProfileAction } from "@/redux/slices/UserSlice";
import { toast } from "sonner";

const ProfileForm = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: any) => state.user);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    fullName: user?.userName || "",
    email: user?.email || "",
    mobileNumber: user?.phone || "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.userName || "",
        email: user.email || "",
        mobileNumber: user.phone || "",
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      
      const fileReader = new FileReader();
      fileReader.onload = () => {
        if (fileReader.result) {
          setPreviewUrl(fileReader.result as string);
        }
      };
      fileReader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsProfileLoading(true);
    const updateFormData = new FormData();
    updateFormData.append('userName', formData.fullName);
    updateFormData.append('email', formData.email);
    updateFormData.append('phone', formData.mobileNumber);
    
    if (profileImage) {
      updateFormData.append('file', profileImage);
    }

    const response = await updateProfile({
      userData: updateFormData,
      toast,
      dispatch,
      action: updateProfileAction
    });

    setIsProfileLoading(false);
    if (response.success) {
      toast.success("Profile updated successfully");
    }
  };

  const getInitial = () => {
    return formData.fullName ? formData.fullName.charAt(0).toUpperCase() : 'U';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 md:items-center">
        <Avatar className="w-20 h-20">
          {(previewUrl || user?.profilePicture) ? (
            <AvatarImage 
              src={previewUrl || user?.profilePicture} 
              alt="Profile" 
            />
          ) : null}
          <AvatarFallback className="text-xl">{getInitial()}</AvatarFallback>
        </Avatar>
        <div className="space-y-2">
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            id="profile-image"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => document.getElementById('profile-image')?.click()}
          >
            Change Avatar
          </Button>
          <p className="text-xs text-muted-foreground">
            JPG, GIF or PNG. Max size of 3MB.
          </p>
        </div>
      </div>

      <Separator />

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input 
            id="fullName" 
            value={formData.fullName} 
            onChange={handleInputChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            value={formData.email} 
            onChange={handleInputChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="mobileNumber">Mobile Number</Label>
          <Input 
            id="mobileNumber" 
            value={formData.mobileNumber} 
            onChange={handleInputChange}
          />
        </div>
      </div>

      <Button 
        onClick={handleSave} 
        className="bg-[#062D46] hover:bg-[#05253a]"
        disabled={isProfileLoading}
      >
        {isProfileLoading ? (
          <>
            <Loader className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          "Save Changes"
        )}
      </Button>
    </div>
  );
};

export default ProfileForm;
