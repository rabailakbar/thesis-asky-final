import { useEffect, useState } from "react"
import DebateModule from "./DebateModule";
import DebateSwitch from "./DebateSwitch";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { supabase } from "@/integrations/supabase/client";


const Debate = () => {
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

    return show ? (
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
            goNext={goToNextTopic}     // ✅ Pass next-topic callback
        />
    );
};

export default Debate;