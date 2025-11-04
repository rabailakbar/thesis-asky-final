import { Button } from "@/components/ui/button";
import { useSearchParams, useNavigate } from "react-router-dom";



export const ClosingModal = (props: any) => {

    const navigate = useNavigate();


    return (
<div
  className="min-h-screen flex items-start justify-center rounded-[24px] pt-10"
  style={{ backgroundColor: '#F8F1E7' }}
>            <div className="max-w-2xl w-full mx-auto bg-[#F8F1E7] rounded-3xl shadow-sm  text-center">

                {/* Module Completion Header */}
                <div className="flex items-center justify-center gap-4 mb-6">
                    <div className="w-20 h-20 rounded-lg flex items-center justify-center relative flex-shrink-0 ">
                        <img
                            src="/m1end.png"
                            alt="Module 1"
                            className="w-20 h-20 object-contain"
                        />
                    </div>
                    <div className="text-left">
                    <h1 className="font-normal text-[67px] leading-none text-black whitespace-nowrap text-center mb-2"
>
  {`Module ${props.moduleId.replace("M", "")}: Complete`}
</h1>

<p className="text-black font-normal text-[25px] leading-[100%] mt-1">
  ✓ 7/7 Score interests narrowed!
</p>

                    </div>
                </div>

                {/* Score Circle */}
                <div className="mt-10 mb-10">
                <p className="text-center text-[black] font-normal text-[24px] leading-[100%] mb-8">
  Your new score is
</p>

                    {/* Gradient border circle */}
                    <div className="mx-auto w-48 h-48 rounded-full  p-[24px] bg-[linear-gradient(180deg,#D0193E_0%,#5F237B_100%)]">
  <div className="w-full h-full bg-[#FDF8F3] rounded-full flex items-center justify-center text-4xl font-semibold text-gray-700">
    –
  </div>
</div>


<p className="mt-16 text-center text-black font-normal text-[24px] leading-[100%]">
  We’ll start calculating from the next module…
</p>

                </div>


                {/* Next Module Button */}
                <Button
                    size="lg"
                    onClick={() => navigate(props.nextPath)}
                    className="mt-6 px-8 py-3 rounded-md bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-base"
                >
                    Next Module →
                </Button>
            </div>
        </div>
    );
} 
