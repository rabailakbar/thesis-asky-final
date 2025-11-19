import { useNavigate } from "react-router";
import { Button } from "./ui/button";
import CircleScore from "./CircleScore";
import { ChevronRight } from "lucide-react";

const ClosingModal = (props) => {
  
  const navigate = useNavigate();


  return (
    <div className="p-8">
<div className="h-[90vh] flex items-center justify-center rounded-[24px] " style={{ backgroundColor: '#F8F1E7' }}>
              <div className=" w-full px-72 bg-[#F8F1E7] rounded-3xl  text-center">

              {/* Module Completion Header */}
              <div className="flex  justify-center gap-12 mb-6">
              {/* <div className="mx-auto w-24 h-24 rounded-full  p-[12px] bg-[linear-gradient(180deg,#D0193E_0%,#5F237B_100%)]">
<div className="w-full h-full bg-[#FDF8F3] rounded-full flex items-center justify-center text-4xl font-semibold text-gray-700">
  –
</div>
</div> */}
{ props.module!=1 && <CircleScore scoreDrop={props.score}/>}
                  <div className="text-left">
                  <h1 className=" text-[#5F237B] font-semibold text-[64px] leading-[100%] tracking-[0%]  mb-4">
                    
  Module {props.module}: Complete
</h1>


<p className="text-black font-normal gap-2 flex text-[20px] leading-[100%] mt-1">
{/* ✓ 4/4 Likes  |  2/2 saves  */}
 <img src="/check.svg"/> {props.text}
</p>

                  </div>
              </div>

              {/* Score Circle */}
              <div className="mt-4 mb-4 flex justify-center items-center">
<img src={"/closing22.png"} className="h-[35vh]" />

              </div>

<div className="text-[24px] font-normal">


{props.ending}

</div>
              {/* Next Module Button */}
              <Button
                  size="lg"
                  onClick={() => navigate(props.src)}
                  className="mt-6 px-8 py-2 rounded-md bg-[#FF9348]  text-white text-base"
              >
                  Next Module <ChevronRight/>
              </Button>
          </div>
      </div>
      </div>
  );
} 
export default ClosingModal
