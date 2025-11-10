import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-[100vh] bg-white overflow-hidden">
      {/* Left Side */}
      <div className="flex flex-col  items-start w-1/2 p-24 ">
        {/* Logo and Tagline */}
        <div>
          {/* <h1 className="text-[48px] font-bold text-[#A11D8C]">
            askwhy<span className="text-[#D22B8A]">?</span>
          </h1> */}
          <img src="/logo.svg"
          className="w-[60%] object-contain"/>
          <p className="text-[#5E2B9D] text-[20px] font-normal leading-[100%] mt-1 font-gabarito">
  Bridging minds, one question at a time.
</p>

        </div>

        {/* Welcome Section */}
        <div className="w-full max-w-sm py-16 space-y-6">

          {/* Email */}
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="font-medium text-base text-gray-800"
            >
              Enter Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder=""
              className="w-full h-[48px] bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-[#A11D8C]"
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="font-medium text-base text-gray-800"
            >
              Enter password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder=""
              className="w-full h-[48px] bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-[#A11D8C]"
            />
          </div>

          {/* Login Button */}
          <Button
            className="w-[50%] bg-[#FF8C42] hover:bg-[#ff9f66] text-white text-base py-3 rounded-md"
            onClick={() => navigate("/dashboard")}
          >
            Login →
          </Button>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-1/2 bg-[#F8F1E7] flex flex-col  items-center relative">
        <img
          src="/onboarding.svg"
          alt="illustration"
          className="w-[90%] object-contain"
        />
        
        <p className="absolute bottom-10 text-black text-lg">
          Is your algorithm your story?
        </p>
      </div>
    </div>
  );
};

export default Login;
