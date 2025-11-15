import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SplitText from "@/components/animations/SplitText";
import { ChevronRight } from "lucide-react";

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const sequence = [0, 1, 2];
    let i = 0;
    const interval = setInterval(() => {
      i++;
      if (i >= sequence.length - 1) {
        setStep(sequence[i]);
        clearInterval(interval);
      } else {
        setStep(sequence[i]);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleAnimationComplete = () => {
    console.log("All letters have animated!");
  };

  return (
    <div className="h-[100vh]">
      {/* STEP 0 */}
      {step === 0 && (
        <div className="h-[100vh] flex justify-center items-center bg-[#F8F1E7] ">
          <SplitText
            text="hello, you!"
            className="text-[84px] font-bold text-black text-center"
            delay={200}
            duration={0.7}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            onLetterAnimationComplete={handleAnimationComplete}
          />
        </div>
      )}

      {/* STEP 1 */}
      {/* {step === 1 && (
        <div className="h-[100vh] flex">
          <div className="flex justify-center items-center bg-[#F8F1E7] w-1/2">
            <h1 className="text-[84px] font-bold text-black">Is your world</h1>
          </div>
          <div className="flex justify-center items-center bg-white w-1/2"></div>
        </div>
      )} */}

      {/* STEP 2 */}
      {/* STEP 2 */}
{step === 1 && (
  <div className="h-[100vh] flex overflow-hidden">
    {/* Left Column (slides up first) */}
    <motion.div
      className="h-[100vh] flex justify-center items-center bg-[#F8F1E7] w-1/2"
      initial={{ y: "100%", opacity: 0 }}
      animate={{ y: "0%", opacity: 1 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
    >
      <motion.h1
        className="text-[84px] font-bold text-black"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        Is your world
      </motion.h1>
    </motion.div>

    {/* Right Column (slides down after left finishes) */}
    <motion.div
      className="h-[100vh] flex justify-center items-center bg-black w-1/2"
      initial={{ y: "-100%", opacity: 0 }}
      animate={{ y: "0%", opacity: 1 }}
      transition={{ delay: 1.0, duration: 0.8, ease: "easeOut" }}
    >
      <motion.h1
        className="text-[84px] text-[#F8F1E7] font-bold"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6, duration: 0.6 }}
      >
        divided in two
      </motion.h1>
    </motion.div>
  </div>
)}


      {/* STEP 3 */}
      {step === 2 && (
        <div className="h-[100vh] relative flex items-center justify-start overflow-hidden bg-white">
          {/* Background stripes with animation */}
          <div className="absolute inset-0 flex">
            {[
              "#FEFCFA",
              "#FCF9F5",
              "#FBF7F1",
              "#F9F4EC",
              "#F8F1E7",
              "#C6C1B9",
              "#95918B",
              "#63605C",
              "#32302E",
            ].map((color, index) => (
              <motion.div
                key={color}
                className="flex-1 h-full"
                style={{ backgroundColor: color }}
                initial={{ y: "-100%" }}            
                animate={{ y: "0%" }}               
                transition={{
                  duration: 0.9,
                  ease: "easeOut",
                  delay: index * 0.12,               
                }}
              />
            ))}
          </div>

          {/* Text content */}
          <div className="relative z-10 pl-16 w-[50%]">
            <h1 className="text-[84px] font-bold text-black leading-tight mb-6">
              What if we start navigating it through?
            </h1>
            <button
              onClick={() => navigate("/login")}
              className="bg-[#FF7A00] text-white text-lg flex justify-center items-center px-6 py-2 rounded-md hover:bg-[#e86a00] transition"
            >
              Click here to start <ChevronRight/>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
