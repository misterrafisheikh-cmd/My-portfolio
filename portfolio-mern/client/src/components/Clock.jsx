import { useEffect, useState } from "react";

// A small live clock shown in the navbar. Updates every second by
// itself — no props needed, no server call. Uses the visitor's own
// device time/timezone (Intl.DateTimeFormat with no timeZone option
// defaults to the browser's local zone).
export default function Clock() {
  // useState(() => new Date()) runs the function once on first render
  // only, instead of creating a new Date on every re-render.
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    // setInterval runs this every 1000ms (1 second) forever, until the
    // component is removed from the page (the cleanup function below
    // then stops it, so it doesn't keep running in the background).
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []); // empty [] means "run this setup only once, when Navbar first appears"

  // toLocaleTimeString formats a Date as "10:42 AM" style text.
  const label = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <span
      className="hidden select-none whitespace-nowrap font-mono text-[0.8rem] sm:inline"
      style={{ color: "var(--muted)" }}
      title={now.toLocaleDateString()}
    >
      {label}
    </span>
  );
}
