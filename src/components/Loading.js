"use client";
import { useEffect, useState } from "react";
import NodeWave from "@/components/loading/NodeWave";
import { ConsoleLoader } from "./loading/ConsoleLoader";
import { useTypewriter } from "@/hooks/useTypewriter";

const messages = [
  { text: "[DevBridge] Initializing secure handshake...", color: "text-[#00e0ff]" },
  { text: "[DevBridge] Connecting clients ↔ developers", color: "text-[#b48cff]" },
  { text: "[Console] Coffee detected ☕ — optimizing productivity", color: "text-[#4ade80]" },
  { text: "[Console] Deploying bridge protocol v1.0 🚀", color: "text-[#00e0ff]" },
  { text: "[DevBridge] All systems nominal. Welcome aboard!", color: "text-[#b48cff]" },
];


export function LoadingPage() {
  const { index: current, out: display } = useTypewriter(messages);

  return (
    <div className="fixed inset-0 flex bg-[#0d0b14]">
      <ConsoleLoader messages={messages} current={current} display={display} />
      <NodeWave />
    </div>
  );
}

const Spinner = ({ size = 24, color = "currentColor" }) => {
  return (
    <svg
      className="animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      width={size}
      height={size}
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke={color}
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill={color}
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      ></path>
    </svg>
  );
};

export { Spinner };
