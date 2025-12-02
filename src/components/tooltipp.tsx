import React from "react";
import { X } from "lucide-react";
import { Line } from "recharts";

const Tooltip = (props) => {
  const lines = props.description.split(';');
  if(props.description=="") return<div></div>
  return (
    <div
      className="
        w-[240px] p-2 bg-[#780091] text-white shadow-lg relative
        rounded-t-3xl rounded-tr-3xl rounded-br-3xl rounded-bl-none
      "
    >
      <div className="flex items-start justify-between items-start">
          <div className="w-10 h-10 rounded-full bg-[#FF9348] flex items-center justify-center">
            <img src="/tooltip.svg" className="w-10 h-10" />
          </div>

          <ul className="text-[12px] leading-snug text-white/90 w-[170px] text-left">
          {lines.map(line => {
            return <li>{line}</li>
          })}
          </ul>
      </div>
    </div>
  );
};

export default Tooltip;
