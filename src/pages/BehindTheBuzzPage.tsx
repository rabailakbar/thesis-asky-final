import BehindTheBuzz from "@/components/BehindTheBuzz";
import ConnectDotsQuiz from "@/components/ConnectDotsQuiz";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState, useMemo } from "react";

const BehindTheBuzzPage = () => {
  const [behindqs, setBehindQs] = useState<any>(null);
  const [keywords, setKeywords] = useState<any>(null);
  const [answer, setAnswer] = useState<any>(null);

  const fetchbehind = async () => {
    const { data, error } = await supabase.from("behind").select("*");
    console.log(data)
    if (error) return console.error(error);

    setBehindQs(data[0]);

    const { data: kwData, error: kwError } = await supabase.from("keywords").select("*");
    if (kwError) return console.error(kwError);

    setKeywords(kwData);
  };

  // Generate answer options ONLY after both behindqs and keywords are available
  useEffect(() => {
    if (!behindqs || !keywords) return;

    const correctItem = keywords.find(
      (item: any) => item.Word === behindqs.Correct_Answer
    );
    if (!correctItem) return;

    const others = keywords.filter(
      (item: any) => item.Word !== behindqs.Correct_Answer
    );

    const randomTwo = [...others]
      .sort(() => 0.5 - Math.random())
      .slice(0, 2);

    const finalOptions = [correctItem, ...randomTwo].sort(
      () => 0.5 - Math.random()
    );

    setAnswer(finalOptions);
  }, [behindqs, keywords]); // <-- runs only when both values arrive

  useEffect(() => {
    fetchbehind();
  }, []);

  if (!answer || !behindqs) return <p>Loading...</p>;

  return <ConnectDotsQuiz answers={answer} behindqs={behindqs} />;
};

export default BehindTheBuzzPage;
