import { supabase } from "@/integrations/supabase/client";

const Tooltip = (props) => {
  let lines = props.description.split(";");
  if (props.description == "") return <div></div>;

  let imageName = "";
  const lineWithImageCode = lines.filter((line) =>
    line.includes("Image code:")
  )[0];

  if (lineWithImageCode != null) {
    imageName = lineWithImageCode.split(":")[1].replace(/'/g, "").trim();
    lines = lines.filter((line) => !line.includes("Image code:"));
  }

  const toUrl = (code: string) => {
    return supabase.storage.from("Thesis").getPublicUrl(`Modules/${code}.png`)
      .data.publicUrl;
  };
  return (
    <div
      className="
        w-[240px] p-2 bg-[#780091] text-white shadow-lg relative
        rounded-t-3xl rounded-tr-3xl rounded-br-none rounded-bl-3xl
      "
    >
      <div className="flex items-start justify-between items-start gap-2 pb-2 pr-2">
        <div className="flex-col">
          <div className="w-10 h-10 rounded-full bg-[#FF9348] flex items-center justify-center">
            <img src="/tooltip.svg" className="w-10 h-10" />
          </div>
        </div>
        <div className="flex-col">
          <ul className="text-[12px] leading-snug text-white/90 w-[170px] text-left">
            {lines.map((line) => {
              return <li>{line}</li>;
            })}
          </ul>
          {imageName ? <img src={toUrl(imageName)} className="rounded-2xl" /> : null}
        </div>
      </div>
    </div>
  );
};

export default Tooltip;
