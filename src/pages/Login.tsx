import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  return (
    <div className="flex min-h-screen bg-white overflow-y-auto">
      {/* Left Side */}
      <div className="flex flex-col justify-start items-start w-1/2 p-24">
        <div>
          <img src="/logo.svg" className="w-[60%] object-contain" />
          <p className="text-[black] font-bold text-[28px] font-normal leading-[100%] font-gabarito pt-20">
            We are excited to have you here!
          </p>
          <p className="text-[grey] text-[20px] font-light leading-[100%] font-gabarito mt-[5px]">
            Login with shared credentials
          </p>
        </div>

        {/* Login Section */}
        <div className="w-full max-w-sm mt-12 space-y-8">
          {/* Credential Inputs (optional / not required) */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">Enter Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="demo@askwhy.app"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">Enter Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1"
              />
            </div>
          </div>
          {/* Login Button */}
          <Button
            className="w-[60%] bg-[#FF8C42] hover:bg-[#ff9f66] flex justify-center items-center text-white text-base py-4 rounded-md shadow-sm"
            onClick={() => navigate("/dashboard")}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"} <ChevronRight />
          </Button>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-1/2 bg-[#F8F1E7] h-[140vh] relative">
        <img
          src="/Group 150.png"
          alt="Login illustration"
          className="absolute right-0 top-0 h-[140vh] w-[110%] object-cover select-none"
        />
      </div>
</div>

  );
};

export default Login;