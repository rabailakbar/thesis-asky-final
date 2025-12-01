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
          <p className="text-[#39154A] font-bold text-[1.5vw]  leading-[100%]  pt-20">
            We are excited to have you here!
          </p>
          <p className="text-[#757888] text-[1vw] font-normal leading-[100%]  mt-2">
            Login with shared credentials
          </p>
        </div>

        {/* Login Section */}
        <div className="w-full max-w-sm mt-12 space-y-8">
          {/* Credential Inputs (optional / not required) */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-[1vw] font-normal text-[#32302E]">Enter Email</Label>
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
              <Label htmlFor="password" className="text-[1vw] font-normal text-[#32302E]">Enter Password</Label>
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
            className="w-[100%] bg-[#FF8C42] hover:bg-[#ff9f66] flex justify-center items-center text-white text-[1.1vw] rounded-md shadow-sm"
            onClick={() => navigate("/dashboard")}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </div>
      </div>

      {/* Right Side */}
    <div className="py-12 pr-24">
      <div className=" py-1 rounded-[24px] shadow-[0px_0px_25px_0px_#0000001A_inset]  bg-[#F8F1E7] relative">
        <img
          src="/Group 150.png"
          alt="Login illustration"
          className=" w-[100%] object-cover select-none"
        />
      </div>
      </div>
</div>

  );
};

export default Login;