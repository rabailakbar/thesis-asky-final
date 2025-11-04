import { Clock } from "lucide-react"



const ModuleHeader = (props) => {
    return (
        <>
            <div className=" mb-10">
                <div className="flex items-center justify-between">
                    {/* Left side: Icon + Module Info */}
                    <div className="flex items-center gap-8">
                        {/* Puzzle Icon */}
                        <div className="w-32 h-32 rounded-lg flex items-center justify-center relative flex-shrink-0 ">
                            <img
                                src={props.src}
                                alt="Module 1"
                                className="w-32 h-32 object-contain"
                            />
                        </div>

                        {/* Module Info */}
                        <div>
                        <h1 className="font-semibold text-[48px] leading-[100%] tracking-[0] text-[#1E1E2F] mb-1">
  Find your vibe
</h1>

<p className=" font-normal text-[24px] leading-[100%] tracking-[0] text-[#1E1E2F] mb-2">
  Let's help you build your feed!
</p>

                            <div className="flex items-center gap-2 text-[#1E1E2F]">
                                <Clock className="w-[33px] h-[33px]" />
                                <span className="font-normal text-[33px] leading-[100%] tracking-[0]">
                                    02:00
                                </span>
                            </div>

                        </div>
                    </div>

                    {/* Right side: Counter */}
                    <div className="text-right">
                        <div className="text-3xl font-bold text-gray-900">{props.selectedCount}/7</div>
                    </div>
                </div>
            </div>

            {/* Instructions */}
            <h2
                className=" font-normal text-[27px] leading-[100%] text-center text-[black] mb-6"
            >
                Click to narrow down your interests
            </h2>
        </>)
}
export default ModuleHeader