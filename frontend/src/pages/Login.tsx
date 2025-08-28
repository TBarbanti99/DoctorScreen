
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, ArrowRight, Mail, Lock } from "lucide-react";
import Logo from "@/assets/logo";
import { toast } from "sonner";
import { LoginUser } from "@/redux/actions/UserAction";
import { useDispatch } from "react-redux";
import { loginUpUserAction } from "@/redux/slices/UserSlice";

const Login = () => {
  const [email, setEmail] = useState("doctor@example.com");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await LoginUser({
      userData: { email, password },
      toast,
      dispatch,
      action: loginUpUserAction,
    });
    if (result.success) {
      navigate("/dashboard");
    }
    setIsLoading(false)
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top navigation */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Logo />
            <span className="text-xl font-semibold text-[#062D46]">
              Doctor Screen
            </span>
          </Link>
          <Button
            variant="ghost"
            className="text-sm hover:bg-slate-100"
            onClick={() => navigate("/")}
          >
            Back to Home
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 bg-gradient-to-b from-white to-slate-50">
        <div className="w-full max-w-md">
          <Card className="shadow-lg border-slate-200">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center text-[#062D46]">
                Doctor Login
              </CardTitle>
              <CardDescription className="text-center">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                      <Mail size={18} />
                    </div>
                    <Input
                      id="email"
                      type="email"
                      placeholder="doctor@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <a
                      href="#"
                      className="text-sm font-medium text-[#062D46] hover:underline"
                    >
                      Forgot password?
                    </a>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                      <Lock size={18} />
                    </div>
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute inset-y-0 right-0 px-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff size={18} className="text-slate-400" />
                      ) : (
                        <Eye size={18} className="text-slate-400" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" />
                  <label
                    htmlFor="remember"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Remember me
                  </label>
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#062D46] hover:bg-[#05253a] disabled:cursor-not-allowed disabled:bg-[#062e4684]"
                >
                  <span>
                    {
                      isLoading ? "Loading..." : "Login"
                    }
                  </span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="text-sm text-center text-slate-500">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="font-medium text-[#062D46] hover:underline"
                >
                  Register
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <div className="py-6 text-center text-sm text-slate-500 border-t">
        <p>
          &copy; {new Date().getFullYear()} Doctor Screen. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
