import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client"; // You'll need this for password comparison

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const handleLogin = async () => {
    setLoading(true);
    setErrorMsg("");

    // Query the Users table for the provided email
    const { data, error } = await supabase
      .from("Users")
      .select("Email, Password")
      .eq("Email", email)
      .single();  // Assumes single row returned, so using `.single()`

    setLoading(false);


    if (error || !data) {
      setErrorMsg("Invalid email or password.");
      return;
    }
console.log(data)
    // Compare the provided password with the hashed password in the database
    const isPasswordValid = password==data.Password;

    if (!isPasswordValid) {
      setErrorMsg("Invalid email or password.");
      return;
    }
    localStorage.setItem("email",JSON.stringify(email))
    localStorage.setItem("password",JSON.stringify(password))

    // If login is successful, redirect to dashboard
    navigate("/dashboard");
  };

  return (
    <div className="flex h-[100vh] bg-white overflow-hidden">
      {/* Left Side */}
      <div className="flex flex-col items-start w-1/2 p-24">
        <div>
          <img src="/logo.svg" className="w-[60%] object-contain" />
          <p className="text-[black] text-[20px] font-normal leading-[100%] mt-1 font-gabarito">
            Bridging minds, one question at a time.
          </p>
        </div>

        {/* Login Section */}
        <div className="w-full max-w-sm py-16 space-y-6">
          {/* Error Message */}
          {errorMsg && (
            <p className="text-red-600 text-sm font-medium">{errorMsg}</p>
          )}

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="font-medium text-base text-gray-800">
              Enter Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-[48px] bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-[#A11D8C]"
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="font-medium text-base text-gray-800">
              Enter Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-[48px] bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-[#A11D8C]"
            />
          </div>

          {/* Login Button */}
          <Button
            className="w-[50%] bg-[#FF8C42] hover:bg-[#ff9f66] flex justify-center items-center text-white text-base py-3 rounded-md"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"} <ChevronRight />
          </Button>

        </div>
      </div>

      {/* Right Side */}
      <div className="w-1/2 bg-[#F8F1E7] flex flex-col items-center relative">
  {/* <img
    src="/onboarding.svg"
    alt="illustration"
    className="w-[90%] object-contain relative z-10" 
  />

  <div className="w-[700px] flex-col items-start relative z-20">
    <img 
      src="/loginn.svg" 
      className="w-[200px] mt-[45%] relative z-30" 
    />
    <p className="absolute  text-black text-left text-lg z-40">
      Is your algorithm your story?
    </p>
  </div> */}
  <img src="/S.png"/>
</div>
</div>

  );
};

export default Login;
