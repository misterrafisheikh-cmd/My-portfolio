import { useEffect, useState } from "react";

// Cycles through `words`, typing and deleting each one. Respects
// prefers-reduced-motion by just showing the first word statically.
export function useTypedText(words, { typeMs = 62, deleteMs = 30, holdMs = 1700, pauseMs = 260 } = {}) {
  const [text, setText] = useState("");

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setText(words[0] || "");
      return;
    }
    let wordIndex = 0;
    let charIndex = 0;
    let deleting = false;
    let timer;

    const tick = () => {
      const word = words[wordIndex];
      setText(word.slice(0, charIndex));

      if (!deleting && charIndex < word.length) {
        charIndex++;
        timer = setTimeout(tick, typeMs);
      } else if (!deleting) {
        deleting = true;
        timer = setTimeout(tick, holdMs);
      } else if (charIndex > 0) {
        charIndex--;
        timer = setTimeout(tick, deleteMs);
      } else {
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        timer = setTimeout(tick, pauseMs);
      }
    };

    timer = setTimeout(tick, typeMs);
    return () => clearTimeout(timer);
  }, [words, typeMs, deleteMs, holdMs, pauseMs]);

  return text;
}
