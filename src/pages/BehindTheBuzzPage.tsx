import BehindTheBuzz from "@/components/BehindTheBuzz";
import ConnectDotsQuiz from "@/components/ConnectDotsQuiz";
import { RootState } from "@/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const BehindTheBuzzPage = () => {
  const [rounds, setRounds] = useState<any[]>([]);
  const topic = useSelector((state:RootState)=>state.topics.topics)

  
  useEffect(() => {
    // Build a single static round using the provided public image and options
    const staticRound = {
      behind: {
        ImagePublicUrl: "/rr.png",
        Image: "rr",
        Reach: "1M Views", // placeholder; adjust if you have a specific value
        Correct_Answer: "Clout", // middle option is correct
      },
      answers: [
        {
          id: "A",
          Word: "Propaganda",
          Description:
            "Propaganda is when someone twists facts or shares biased information to make others believe their side of the story.",
        },
        {
          id: "B",
          Word: "Clout",
          Description:
            "When people do something “for clout,” it means they’re doing it to get attention, followers, or fame — not because they truly believe in it.",
        },
        {
          id: "C",
          Word: "Exaggeration",
          Description:
            "People share exaggerated news online because it sounds exciting, grabs attention, and helps their posts get more reach, likes, and shares.",
        },
      ],
    };

    setRounds([staticRound]);
  }, [topic]);
  
  // Generate answer options ONLY after both behindqs and keywords are available
  // useEffect(() => {
  //   if (!behindqs || !keywords) return;

  //   const correctItem = keywords.find(
  //     (item: any) => item.Word === behindqs.Correct_Answer
  //   );
  //   if (!correctItem) return;

  //   const others = keywords.filter(
  //     (item: any) => item.Word !== behindqs.Correct_Answer
  //   );

  //   const randomTwo = [...others]
  //     .sort(() => 0.5 - Math.random())
  //     .slice(0, 2);

  //   const finalOptions = [correctItem, ...randomTwo].sort(
  //     () => 0.5 - Math.random()
  //   );

  //   setAnswer(finalOptions);
  // }, [behindqs, keywords]); // <-- runs only when both values arrive

  // useEffect(() => {
  //   fetchbehind();
  // }, []);

  if (rounds.length === 0) return <p>Loading...</p>;

return <ConnectDotsQuiz rounds={rounds} />;

};

export default BehindTheBuzzPage;
