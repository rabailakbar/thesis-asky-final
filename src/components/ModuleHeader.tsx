import { Clock } from "lucide-react"

const ModuleHeader = () => {
    return (
        <>
            <div className="  pt-6 mb-2">
                <div className="flex items-center justify-between">
                    {/* Left side: Icon + Module Info */}
                    <div className="flex items-center gap-8">
                        {/* Puzzle Icon */}
                        <div className="w-25 rounded-lg flex items-center justify-center relative flex-shrink-0 ">
                            <img
                                src={"/characterm.svg"}
                                alt="Module 1"
                                className="w-25  object-contain"
                            />
                        </div>
  
                        {/* Module Info */}
                        <div>
                        <h1 className="font-semibold text-[36px] leading-[100%] tracking-[0] text-[#201E1C] mb-2">
  Fake or fact</h1>
  
  <p className="font-normal text-[16px] leading-[100%] tracking-[0] text-[#201E1C] mb-2">
  Is everything not real?!
  </p>
  
  
                            <div className="flex items-center gap-4 text-[#201E1C]">
<img src={"/clocl.svg"} />

                                <span className="font-normal text-[24px] leading-[100%] tracking-[0]">
  02:00
  </span>
  
                            </div>
  
                        </div>
                    </div>
  
                    {/* Right side: Counter */}
                    <div className="text-right">
                        <div className="text-3xl font-bold text-gray-900">/7</div>
                    </div>
                </div>
            </div>
  
            {/* Instructions */}
            
        </>)
  }

  export default ModuleHeader