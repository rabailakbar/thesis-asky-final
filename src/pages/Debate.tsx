import { useEffect, useState } from "react"
import DebateModule from "./DebateModule";
import DebateSwitch from "./DebateSwitch";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { supabase } from "@/integrations/supabase/client";
import ModuleHeader from "@/components/ModuleHeader";


const Debate = () => {
    const score = useSelector((state:RootState)=>state.topics.score)
    const [debateList, setDebateList] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [imageUrl, setImageUrl] = useState("");
    const [show, setShow] = useState(true);

    useEffect(() => {
        fetchTopics();
    }, []);

    const fetchTopics = async () => {
        const { data, error } = await supabase
            .from("debate")
            .select("*")
            .limit(4);      // ✅ Fetch 4 topics

        if (error) {
            console.error("Error fetching debate topics:", error);
            return;
        }
console.log(data)
        setDebateList(data);
        
        await loadImageForTopic(0, data);
    };

    const loadImageForTopic = async (index: number, list = debateList) => {
        if (!list.length) return;

        const { data: link } = supabase.storage
            .from("Thesis")
            .getPublicUrl(`Modules/${list[index].Image}.png`);

        setImageUrl(link.publicUrl);
    };

    // Called when a topic finishes both rounds
    const goToNextTopic = async () => {
        if (currentIndex + 1 < debateList.length) {
            await loadImageForTopic(currentIndex + 1);
            setCurrentIndex(prev => prev + 1);
            setShow(true);
        } else {
            console.log("All topics completed!");
        }
    };

    {/* <ModuleHeader currentQuestionIndex={props.round} polarizationScore={score} /> */}
    
    {/* <ModuleHeader setDone={setDone} module={2} src={"/opening12.png"} heading={"Pick & Flick"} description={"Is everything not real?!"} time={120}       savesCount={savesCount} likesCount={likesCount} MAX_LIKES={MAX_LIKES} MAX_SAVES={MAX_SAVES} polarizationScore={score} />
    
   
*/}
    
    const[done,setDone] = useState(false)
return (
    <div className="p-8">
        <div className=" overflow-auto h-[90vh] bg-[#F8F1E7]">
        <div className=" py-6 px-16">
      <ModuleHeader
        setDone={setDone}
        module={6}
        src={"/opening16.png"}
        heading={"Debate Switch"}
        description={"One debate, two sides, endless perspectives"}
        time={600}
        left={currentIndex}
        polarizationScore={score}
      />
      </div>
  
      {show ? (
        <DebateModule
          currentIndex={currentIndex}
          setShow={setShow}
          debate={debateList[currentIndex]}
          imageUrl={imageUrl}
        />
      ) : (
        <DebateSwitch
          round={currentIndex}
          debate={debateList[currentIndex]}
          goNext={goToNextTopic} // callback
        />
      )}
    </div>
    </div>
  );
  
};

export default Debate;