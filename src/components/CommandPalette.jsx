import React, { useEffect, useMemo, useRef, useState } from "react";
import { useApp } from "../context/AppContext";

export default function CommandPalette() {
  const { paletteOpen, setPaletteOpen, setActiveTab, theme, toggleTheme, addToast, logout, setShortcutsOpen } = useApp();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef(null);

  const actions = useMemo(
    () => [
      { id: "nav-overview", group: "Navigate", icon: "📊", label: "Go to Overview", run: () => setActiveTab("overview") },
      { id: "nav-leaderboard", group: "Navigate", icon: "🏆", label: "Go to Leaderboard", run: () => setActiveTab("leaderboard") },
      { id: "nav-activity", group: "Navigate", icon: "⚡", label: "Go to Activity", run: () => setActiveTab("activity") },
      { id: "nav-search", group: "Navigate", icon: "🔍", label: "Go to Search", run: () => setActiveTab("search") },
      { id: "nav-insights", group: "Navigate", icon: "🤖", label: "Go to Insights", run: () => setActiveTab("insights") },
      { id: "nav-profile", group: "Navigate", icon: "🛡️", label: "Go to Profile", run: () => setActiveTab("profile") },
      {
        id: "toggle-theme",
        group: "Actions",
        icon: theme === "dark" ? "☀️" : "🌙",
        label: theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode",
        run: () => {
          toggleTheme();
          addToast("Theme switched", "info");
        },
      },
      {
        id: "shortcuts",
        group: "Actions",
        icon: "⌨️",
        label: "Show Keyboard Shortcuts",
        run: () => setShortcutsOpen(true),
      },
      { id: "logout", group: "Actions", icon: "🚪", label: "Logout", run: () => logout() },
    ],
    [theme, setActiveTab, toggleTheme, addToast, logout, setShortcutsOpen]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return actions;
    return actions.filter((a) => a.label.toLowerCase().includes(q));
  }, [actions, query]);

  useEffect(() => {
    setSelected(0);
  }, [query, paletteOpen]);

  useEffect(() => {
    if (paletteOpen && inputRef.current) {
      inputRef.current.focus();
    }
    if (!paletteOpen) setQuery("");
  }, [paletteOpen]);

  if (!paletteOpen) return null;

  const runSelected = (action) => {
    action.run();
    setPaletteOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      setPaletteOpen(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelected((s) => Math.min(s + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected((s) => Math.max(s - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[selected]) runSelected(filtered[selected]);
    }
  };

  let lastGroup = null;

  return (
    <div className="cmdk-backdrop" onMouseDown={() => setPaletteOpen(false)}>
      <div className="cmdk-panel" onMouseDown={(e) => e.stopPropagation()}>
        <div className="cmdk-input-row">
          <span className="cmdk-input-icon">🔎</span>
          <input
            ref={inputRef}
            className="cmdk-input"
            placeholder="Type a command or search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <span className="cmdk-esc">ESC</span>
        </div>
        <div className="cmdk-list">
          {filtered.length === 0 && <div className="cmdk-empty">No matching commands</div>}
          {filtered.map((action, idx) => {
            const showLabel = action.group !== lastGroup;
            lastGroup = action.group;
            return (
              <React.Fragment key={action.id}>
                {showLabel && <div className="cmdk-section-label">{action.group}</div>}
                <div
                  className={"cmdk-item " + (idx === selected ? "active" : "")}
                  onMouseEnter={() => setSelected(idx)}
                  onClick={() => runSelected(action)}
                >
                  <span className="cmdk-item-icon">{action.icon}</span>
                  <span className="cmdk-item-label">{action.label}</span>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
