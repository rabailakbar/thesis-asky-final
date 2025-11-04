import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
<div className="flex h-[calc(100vh-80px)] flex-col items-center justify-center bg-[#F8F1E7] rounded-2xl shadow-sm overflow-hidden">
<div className="flex flex-col items-center justify-center space-y-10 w-full max-w-xl text-center rounded-2xl">
 
        {/* Heading */}
        <h1
  className="font-normal text-[64px] leading-[100%] text-black text-center whitespace-nowrap"
>
  Is your algorithm your story?
</h1>


        {/* Video Placeholder */}
        <div className="w-120 h-120 rounded-lg flex items-center justify-center relative flex-shrink-0 ">
  <img
    src="/start.jpeg"
    alt="Module 1"
    className="w-120 h-120 object-contain"
  />
</div>

        {/* Button */}
        <Button
          className="bg-[#5F237B] hover:bg-[#8649e8] text-white px-6 py-2 rounded-md"
          onClick={() => navigate("/login")}
        >
          Let’s find out →
        </Button>
      </div>
    </div>
  );
};

export default Index;
