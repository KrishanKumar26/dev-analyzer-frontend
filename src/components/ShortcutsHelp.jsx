import React, { useEffect } from "react";
import { useApp } from "../context/AppContext";

const SHORTCUTS = [
  { keys: ["Ctrl/⌘", "K"], desc: "Open command palette" },
  { keys: ["Alt", "1"], desc: "Go to Overview" },
  { keys: ["Alt", "2"], desc: "Go to Leaderboard" },
  { keys: ["Alt", "3"], desc: "Go to Activity" },
  { keys: ["Alt", "4"], desc: "Go to Search" },
  { keys: ["Alt", "5"], desc: "Go to Insights" },
  { keys: ["Alt", "6"], desc: "Go to Profile" },
  { keys: ["?"], desc: "Show this help" },
  { keys: ["Esc"], desc: "Close any overlay" },
];

export default function ShortcutsHelp() {
  const { shortcutsOpen, setShortcutsOpen } = useApp();

  useEffect(() => {
    if (!shortcutsOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") setShortcutsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [shortcutsOpen, setShortcutsOpen]);

  if (!shortcutsOpen) return null;

  return (
    <div className="cmdk-backdrop" onMouseDown={() => setShortcutsOpen(false)}>
      <div className="cmdk-panel" style={{ maxWidth: 480 }} onMouseDown={(e) => e.stopPropagation()}>
        <div className="cmdk-input-row">
          <span className="cmdk-input-icon">⌨️</span>
          <span className="cmdk-input" style={{ fontSize: 14 }}>Keyboard Shortcuts</span>
          <span className="cmdk-esc">ESC</span>
        </div>
        <div className="shortcuts-grid">
          {SHORTCUTS.map((s, i) => (
            <div className="shortcut-row" key={i}>
              <span>{s.desc}</span>
              <span className="shortcut-keys">
                {s.keys.map((k, j) => (
                  <span className="kbd" key={j}>{k}</span>
                ))}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
