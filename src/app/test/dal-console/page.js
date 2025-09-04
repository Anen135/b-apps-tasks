"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { runDalCommand } from "@/lib/dal/cli";

export default function DALConsole() {
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState("");

  const appendHistory = (cmd, output) => {
    setHistory((prev) => [...prev, { cmd, output }]);
  };

  const runCommand = async (line) => {
    try {
      const result = await runDalCommand(line);
      appendHistory(line, result);
    } catch (err) {
      appendHistory(line, { error: err.message });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    await runCommand(input);
    setInput("");
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <Card className="shadow-xl rounded-2xl">
        <CardContent className="p-4">
          <div className="h-[60vh] overflow-y-auto font-mono text-sm space-y-2 mb-4 bg-black text-green-400 p-2 rounded-lg">
            {history.map((h, i) => (
              <div key={i}>
                <div className="text-green-300">DAL&gt; {h.cmd}</div>
                <pre className="whitespace-pre-wrap">
                  {typeof h.output === "string"
                    ? h.output
                    : JSON.stringify(h.output, null, 2)}
                </pre>
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type command, e.g. user:list"
              className="flex-1 bg-black text-green-300"
            />
            <Button type="submit">Run</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
