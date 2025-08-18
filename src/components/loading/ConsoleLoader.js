import React from "react";

export function ConsoleLoader({ messages, current, display}) {
  return (
    <div className="w-1/2 md:w-1/3 p-6 bg-[#12121d] border-r border-[#1e1b29] overflow-hidden">
      <h1 className="mb-4 text-lg font-bold text-[#b48cff]">Loading your page</h1>
      <div className="h-full leading-relaxed font-mono text-sm">
        {messages.slice(0, current).map((m, i) => (
          <p key={i} className={m.color}>{m.text}</p>
        ))}
        {current < messages.length && (
          <p className={messages[current].color}>
            {display}
            <span className="inline-block w-2 h-5 bg-[#b48cff] ml-1 animate-pulse" />
          </p>
        )}
      </div>
    </div>
  );
}