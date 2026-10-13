"use client";

import { useEffect, useState } from "react";
import Scanner from "@/components/Scanner";

type ViewId =
  | "dashboard"
  | "targets"
  | "scans"
  | "services"
  | "reports"
  | "schedules"
  | "team"
  | "settings";

interface NavItem {
  id: ViewId;
  label: string;
  icon: string;
}

const NAV: { section: string; items: NavItem[] }[] = [
  {
    section: "Overview",
    items: [
      { id: "dashboard", label: "Dashboard", icon: "◎" },
      { id: "targets", label: "Targets", icon: "✛" },
      { id: "scans", label: "Scans", icon: "⟳" },
    ],
  },
  {
    section: "Analyze",
    items: [
      { id: "services", label: "Services", icon: "▤" },
      { id: "reports", label: "Reports", icon: "▦" },
      { id: "schedules", label: "Schedules", icon: "◷" },
    ],
  },
  {
    section: "Account",
    items: [
      { id: "team", label: "Team", icon: "◍" },
      { id: "settings", label: "Settings", icon: "⚙" },
    ],
  },
];

const TITLES: Record<ViewId, string> = {
  dashboard: "Dashboard",
  targets: "Targets",
  scans: "Scans",
  services: "Services",
  reports: "Reports",
  schedules: "Schedules",
  team: "Team",
  settings: "Settings",
};

export default function Page() {
  const [view, setView] = useState<ViewId>("dashboard");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Read the theme the inline head script already applied.
  useEffect(() => {
    const current =
      (document.documentElement.getAttribute("data-theme") as
        | "dark"
        | "light") || "dark";
    setTheme(current);
  }, []);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* storage may be unavailable */
    }
  }

  function go(id: ViewId) {
    setView(id);
    setSidebarOpen(false);
  }

  return (
    <div className="shell">
      <aside className={"sidebar" + (sidebarOpen ? " open" : "")}>
        <div className="brand">
          <div className="logo">S</div>
          <div className="brand-text">
            <strong>SecSelect</strong>
            <span>Service Selector</span>
          </div>
        </div>

        <nav>
          {NAV.map((group) => (
            <div className="nav-group" key={group.section}>
              <div className="nav-section">{group.section}</div>
              {group.items.map((item) => (
                <button
                  key={item.id}
                  className={"nav-item" + (view === item.id ? " active" : "")}
                  onClick={() => go(item.id)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-foot">
          <div className="demo-badge">Demo</div>
          <span>dummy data only</span>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="scrim" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="main">
        <header className="topbar">
          <button
            className="hamburger"
            onClick={() => setSidebarOpen((s) => !s)}
            aria-label="Toggle menu"
          >
            ☰
          </button>
          <h1>{TITLES[view]}</h1>
          <div className="topbar-right">
            <button
              className="icon-btn"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              title={theme === "dark" ? "Switch to light" : "Switch to dark"}
            >
              {theme === "dark" ? "☀" : "☾"}
            </button>
            <div className="avatar" title="Demo user">
              FS
            </div>
          </div>
        </header>

        <div className="content">
          {view === "dashboard" ? (
            <Scanner />
          ) : view === "settings" ? (
            <SettingsView theme={theme} onToggle={toggleTheme} />
          ) : (
            <Placeholder id={view} />
          )}
        </div>
      </div>
    </div>
  );
}

const STATS: Partial<Record<ViewId, { label: string; value: string }[]>> = {
  targets: [
    { label: "Registered targets", value: "12" },
    { label: "Verified", value: "9" },
    { label: "Pending auth", value: "3" },
  ],
  scans: [
    { label: "This month", value: "48" },
    { label: "Running", value: "2" },
    { label: "Avg. duration", value: "6m 20s" },
  ],
  reports: [
    { label: "Generated", value: "37" },
    { label: "High findings", value: "5" },
    { label: "Exported", value: "21" },
  ],
  schedules: [
    { label: "Active", value: "6" },
    { label: "Paused", value: "2" },
    { label: "Next run", value: "in 3h" },
  ],
  services: [
    { label: "Services", value: "2" },
    { label: "Avg. match", value: "71%" },
    { label: "Uptime", value: "99.9%" },
  ],
  team: [
    { label: "Members", value: "4" },
    { label: "Admins", value: "1" },
    { label: "Invites", value: "1" },
  ],
};

function Placeholder({ id }: { id: ViewId }) {
  const stats = STATS[id];
  const rows = Array.from({ length: 5 });
  return (
    <>
      {stats && (
        <div className="stat-row">
          {stats.map((s, i) => (
            <div className="stat" key={i}>
              <div className="stat-label">{s.label}</div>
              <div className="stat-value">{s.value}</div>
            </div>
          ))}
        </div>
      )}
      <div className="card">
        <div className="placeholder-head">
          <h3>{TITLES[id]}</h3>
          <button className="btn">+ New</button>
        </div>
        <div className="table">
          <div className="table-row table-head">
            <span>Name</span>
            <span>Status</span>
            <span>Updated</span>
          </div>
          {rows.map((_, i) => (
            <div className="table-row" key={i}>
              <span className="skeleton w-lg" />
              <span className="skeleton w-sm" />
              <span className="skeleton w-md" />
            </div>
          ))}
        </div>
        <p className="placeholder-note">
          Dummy view — wire this up to real data later.
        </p>
      </div>
    </>
  );
}

function SettingsView({
  theme,
  onToggle,
}: {
  theme: "dark" | "light";
  onToggle: () => void;
}) {
  return (
    <div className="card">
      <div className="setting-row">
        <div>
          <strong>Appearance</strong>
          <p className="meta">Switch between dark and light mode.</p>
        </div>
        <button className="btn-ghost" onClick={onToggle}>
          {theme === "dark" ? "☀ Light mode" : "☾ Dark mode"}
        </button>
      </div>
      <div className="setting-row">
        <div>
          <strong>Organization</strong>
          <p className="meta">Acme Security (demo)</p>
        </div>
        <button className="btn-ghost" disabled>
          Manage
        </button>
      </div>
      <div className="setting-row">
        <div>
          <strong>API keys</strong>
          <p className="meta">No keys configured in this demo.</p>
        </div>
        <button className="btn-ghost" disabled>
          Generate
        </button>
      </div>
    </div>
  );
}
