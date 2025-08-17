"use client";
import { useLayoutEffect, useState } from "react";
import NodeWave from "@/components/loading/NodeWave";

const messages = [
  { text: "[DevBridge] Initializing secure handshake...", color: "text-[#00e0ff]" },
  { text: "[DevBridge] Connecting clients ↔ developers", color: "text-[#b48cff]" },
  { text: "[Console] Coffee detected ☕ — optimizing productivity", color: "text-[#4ade80]" },
  { text: "[Console] Deploying bridge protocol v1.0 🚀", color: "text-[#00e0ff]" },
  { text: "[DevBridge] All systems nominal. Welcome aboard!", color: "text-[#b48cff]" },
];

export function LoadingPage() {
  const [currentLine, setCurrentLine] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [charIndex, setCharIndex] = useState(0);

  // Typewriter effect
  useLayoutEffect(() => {
    if (currentLine < messages.length) {
      if (charIndex < messages[currentLine].text.length) {
        const timeout = setTimeout(() => {
          setDisplayText((prev) => prev + messages[currentLine].text[charIndex]);
          setCharIndex((prev) => prev + 1);
        }, 30); // typing speed
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => {
          setCurrentLine((prev) => prev + 1);
          setCharIndex(0);
          setDisplayText("");
        }, 800); // delay before next line
        return () => clearTimeout(timeout);
      }
    }
  }, [charIndex, currentLine]);

  return (
    <div className="fixed inset-0 flex bg-[#0d0b14] font-mono text-sm">
      {/* LEFT: Console */}
      <div className="w-1/2 md:w-1/3 p-6 bg-[#12121d] border-r border-[#1e1b29] overflow-hidden">
        <h1 className="mb-4 text-lg font-bold text-[#b48cff]">Loading your page</h1>
        <div className="h-full leading-relaxed">
          {messages.slice(0, currentLine).map((msg, i) => (
            <p key={i} className={`${msg.color}`}>{msg.text}</p>
          ))}

          {currentLine < messages.length && (
            <p className={`${messages[currentLine].color}`}>
              {displayText}
              <span className="inline-block w-2 h-5 bg-[#b48cff] ml-1 animate-pulse" />
            </p>
          )}
        </div>
      </div>
      <NodeWave />
    </div>
  );
}
