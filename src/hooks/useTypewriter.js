import { useEffect, useState } from "react";

export function useTypewriter( lines = [], charDelay = 30, lineDelay = 800 ) {
  const [index, setIndex] = useState(0);
  const [cursor, setCursor] = useState(0);
  const [out, setOut] = useState("");

  useEffect(() => {
    if (index >= lines.length) return;
    const {text} = lines[index];
    const timer = setTimeout(() => {
      if (cursor < text.length) {
        setOut((o) => o + text[cursor]);
        setCursor((c) => c + 1);
      } else {
        setTimeout(() => {
          setIndex((i) => i + 1);
          setCursor(0);
          setOut("");
        }, lineDelay);
      }
    }, charDelay);
    return () => clearTimeout(timer);
  }, [cursor, index, lines, charDelay, lineDelay]);

  return { index, out };
}