"use client";
import { motion } from "framer-motion";
import React from "react";

interface TooltipMarkerProps {
  text: string;
  color: string;
  top: string; // e.g. "20%"
}

export const TooltipMarker = ({ text, color, top }: TooltipMarkerProps) => (
  <motion.div
    initial={{ opacity: 0, x: -15 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.4 }}
    className="absolute flex items-center gap-2 z-50"
    style={{
      top,
      right: "100%",
      transform: "translateX(-12px)",
      overflow: "visible",
    }}
  >
    {/* Tooltip bubble */}
    <div
      className="text-white text-[11px] sm:text-[12px] font-medium px-3 py-2 rounded-md shadow-md leading-snug text-left break-words"
      style={{
        backgroundColor: color,
        whiteSpace: "normal",
        maxWidth: "110px",  // ✅ ~4–6 words per line
        minWidth: "100px",  // keeps consistent bubble width
        flexShrink: 0,      // ✅ stops collapsing inside flex
        display: "block",   // ✅ ensures text layout acts like a box
      }}
    >
      {text}
      <div
      className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full w-0 h-0 border-l-[6px] border-r-[6px] border-b-[6px] border-transparent"
      style={{ borderBottomColor: "white" }}
    />
    </div>

    {/* Pointer triangle */}
    <div
      className="w-0 h-0 border-y-[6px] border-y-transparent border-l-[6px]"
      style={{ borderLeftColor: color }}
    />
  </motion.div>
);
