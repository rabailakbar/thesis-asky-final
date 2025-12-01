import { useNavigate } from "react-router";
import { Button } from "./ui/button";
import CircleScore from "./CircleScore";
import { ChevronRight } from "lucide-react";
import { useDispatch } from "react-redux";
import { nextModule } from "@/store/topicsSlice";

const ClosingModal = (props) => {
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // If incoming text includes a leading black tick character, remove it.
  const displayText =
    typeof props.text === "string"
      ? props.text.replace(/^[\s]*[✓✔✅]\s*/u, "")
      : props.text;


  return (
    <div className="p-12">
    <div className="h-[90vh] flex items-center justify-center rounded-[24px] shadow-[0px_0px_25px_0px_#0000001A_inset] " style={{ backgroundColor: '#F8F1E7' }}>
      <div className="w-full max-w-[1000px] mx-auto px-8 bg-[#F8F1E7] rounded-3xl">

              {/* Module Completion Header */}
              {/* Top row: Circular score + heading */}
              <div className="flex flex-row items-start justify-center gap-8 mb-6 text-center">
              {/* <div className="mx-auto w-24 h-24 rounded-full  p-[12px] bg-[linear-gradient(180deg,#D0193E_0%,#5F237B_100%)]">
<div className="w-full h-full bg-[#FDF8F3] rounded-full flex items-center justify-center text-4xl font-semibold text-gray-700">
  –
</div>
</div> */}
{ props.module!=1 && (
  <div className="flex-shrink-0">
    <CircleScore scoreDrop={props.score} animateFrom={props.animateFrom} />
  </div>
)}
                  <div className="text-center flex flex-col">
                  <h1 className=" text-[#5F237B] flex justify-center items-center font-semibold text-[48px] md:text-[60px] leading-[100%] tracking-[0%] mt-2 mb-2">
                    Module {props.module}: Complete
                  </h1>
                  <p className="text-black font-normal gap-2 flex  text-[18px] md:text-[20px] leading-[100%] mt-1">
                    <img src="/check.svg"/> {displayText}
                  </p>
                  </div>
              </div>

              {/* Character Illustration */}
              <div className="mt-4 mb-4 flex justify-center items-center text-center">
<img src={"/closing22.png"} className="h-[35vh]" />

              </div>

<div className="text-[24px] font-normal text-center">


{props.ending}

</div>
                {/* Next Module Button */}
                <div className="flex justify-center">
                <Button
                  size="lg"
                  onClick={() => {
                    dispatch(nextModule());
                    navigate(props.src);
                  }}
                  className="mt-6 px-8 py-2 rounded-md bg-[#FF9348] text-white text-base"
                >
                  Next Module <ChevronRight />
                </Button>
                </div>
          </div>
      </div>
      </div>
  );
} 
export default ClosingModal
