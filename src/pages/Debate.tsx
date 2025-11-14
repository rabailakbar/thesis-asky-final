import { useEffect, useState } from "react"
import DebateModule from "./DebateModule";
import DebateSwitch from "./DebateSwitch";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { supabase } from "@/integrations/supabase/client";


const Debate = () => {
    const [debate, setDebate] = useState<any>({});
    const [imageUrl, setImageUrl] = useState("");
   const [show,setShow] = useState(true)
    const topic = useSelector((state: RootState) => state.topics.topics)
    const choose = topic[Math.floor(Math.random() * 7)]
    useEffect(() => {
        fetchSpotTheBias()
    }, []);

    const fetchSpotTheBias = async () => {

        const { data, error } = await supabase.from("debate").select("*");
        console.log("let me check", data)
        const { data: link } = supabase.storage
            .from('Thesis')
            .getPublicUrl(`Modules/${data[choose].Image}.png`);
        setDebate(data[choose])
        console.log("let me check", link.publicUrl)
        setImageUrl(link.publicUrl)

        if (error) {
            console.error("Error fetching spotthebias:", error);
            return;
        }

    }

    return (
        show ? (
            <DebateModule setShow={setShow}  debate={debate} imageUrl={imageUrl} choose={choose} />
        ) : (
            <DebateSwitch debate={debate} />
        )

    )
}

export default Debate