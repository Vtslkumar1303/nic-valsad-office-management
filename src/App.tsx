import { useMemo, useState } from "react";
import {
  Activity, ArrowUpRight, Bell, BookOpen, CalendarDays, CheckCircle2,
  ChevronDown, CircleHelp, ClipboardList, Cloud, FileText, Gauge,
  HardDrive, LayoutDashboard, Menu, Network, Search, Settings,
  ShieldCheck, Users, Video, X
} from "lucide-react";

const modules = [
  { name: "RFMS Query Management", short: "RFMS Queries", desc: "Track incoming queries, assignments and resolution status.", icon: ClipboardList, count: "Query workspace" },
  { name: "Daily Work Diary", short: "Work Diary", desc: "Record daily activities, work notes and follow-ups.", icon: BookOpen, count: "Daily entries" },
  { name: "VC Management", short: "Video Conferences", desc: "Plan meetings, manage schedules and maintain VC records.", icon: Video, count: "Meeting register" },
  { name: "Network Management", short: "Network", desc: "Log connectivity issues, escalation and restoration updates.", icon: Network, count: "Incident register" },
  { name: "Seva Setu Management", short: "Seva Setu", desc: "Maintain drive schedules, coordination and progress.", icon: Users, count: "Drive tracker" },
  { name: "Reports & Dashboard", short: "Reports", desc: "View operational summaries and export approved reports.", icon: Gauge, count: "Analytics" },
  { name: "ICT Asset Management", short: "ICT Assets", desc: "Maintain inventory, allocation, warranty and service history.", icon: HardDrive, count: "Asset register" },
  { name: "Staff Tour & Attendance", short: "Staff Movement", desc: "Record official tours, attendance and movement details.", icon: CalendarDays, count: "Movement register" },
  { name: "Events & Training", short: "Events", desc: "Coordinate events, training programmes and ICT support.", icon: Cloud, count: "Event calendar" },
];

const demoStats = [
  { label: "Open RFMS queries", value: "—", note: "Connect database to load", icon: ClipboardList },
  { label: "Network incidents", value: "—", note: "Live records not connected", icon: Activity },
  { label: "Upcoming VCs", value: "—", note: "Schedule data not connected", icon: Video },
  { label: "ICT assets", value: "—", note: "Inventory not connected", icon: HardDrive },
];

export default function App() {
  const [active, setActive] = useState("Overview");
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const filtered = useMemo(() => modules.filter(m =>
    (m.name + " " + m.desc).toLowerCase().includes(query.toLowerCase())
  ), [query]);

  const navigation = [
    { label: "Overview", icon: LayoutDashboard },
    { label: "All modules", icon: ClipboardList },
    { label: "Calendar", icon: CalendarDays },
    { label: "Staff", icon: Users },
    { label: "Settings", icon: Settings },
  ];

  return <div className="shell">
    <aside className={mobileOpen ? "sidebar open" : "sidebar"}>
      <div className="brand">
        <div className="brand-mark"><ShieldCheck size={24} /></div>
        <div><strong>NIC VALSAD</strong><span>OFFICE MANAGEMENT</span></div>
        <button className="mobile-close" onClick={() => setMobileOpen(false)} aria-label="Close menu"><X size={18}/></button>
      </div>
      <div className="office-tag"><span className="status-dot"/> District Office · Gujarat</div>
      <div className="nav-label">WORKSPACE</div>
      <nav>{navigation.map(item => <button key={item.label} className={active === item.label ? "nav-item selected" : "nav-item"} onClick={() => {setActive(item.label);setMobileOpen(false);}}>
        <item.icon size={18}/><span>{item.label}</span>{item.label === "Overview" && <span className="nav-indicator"/>}
      </button>)}</nav>
      <div className="sidebar-bottom">
        <div className="help-card"><CircleHelp size={18}/><div><b>Need assistance?</b><span>Contact your system administrator.</span></div></div>
        <div className="profile"><div className="avatar">AD</div><div><b>Demo Administrator</b><span>Demo environment</span></div><ChevronDown size={16}/></div>
      </div>
    </aside>

    <main className="main">
      <header className="topbar">
        <button className="menu-button" onClick={() => setMobileOpen(true)} aria-label="Open menu"><Menu/></button>
        <div className="breadcrumb">Workspace <span>/</span> <b>{active}</b></div>
        <div className="top-actions"><span className="environment"><i/> DEMO MODE</span><button className="icon-button" aria-label="Notifications"><Bell size={19}/><i/></button><div className="top-avatar">AD</div></div>
      </header>

      <section className="content">
        <div className="welcome-row">
          <div><div className="eyebrow">DISTRICT INFORMATICS OFFICE</div><h1>{active === "Overview" ? "Office overview" : active}</h1><p>One workspace for coordinating district-level e-Governance operations.</p></div>
          <div className="date-chip"><CalendarDays size={16}/> {new Date().toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})}</div>
        </div>

        <div className="notice"><div className="notice-icon"><ShieldCheck size={19}/></div><div><b>Development environment</b><span>This is a demonstration interface. No live NIC records, user accounts or operational systems are connected.</span></div><CheckCircle2 className="notice-check" size={18}/></div>

        <div className="section-heading"><div><h2>At a glance</h2><p>Live metrics will appear after secure database integration.</p></div><button className="text-button" onClick={() => setActive("Reports & Dashboard")}>View reports <ArrowUpRight size={15}/></button></div>
        <div className="stats-grid">{demoStats.map((stat) => <div className="stat-card" key={stat.label}><div className="stat-top"><span>{stat.label}</span><div className="stat-icon"><stat.icon size={18}/></div></div><div className="stat-value">{stat.value}</div><div className="stat-note">{stat.note}</div></div>)}</div>

        <div className="section-heading modules-heading"><div><h2>Office modules</h2><p>Choose a workspace to manage its records and activities.</p></div><span className="module-count">09 MODULES</span></div>
        <div className="search-wrap"><Search size={18}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search modules..." aria-label="Search modules"/><kbd>⌘ K</kbd></div>
        <div className="module-grid">{filtered.map((mod,index) => <button className="module-card" key={mod.name} onClick={() => setActive(mod.name)}>
          <div className="module-card-top"><div className="module-icon"><mod.icon size={20}/></div><ArrowUpRight size={17} className="card-arrow"/></div>
          <h3>{mod.name}</h3><p>{mod.desc}</p><div className="module-footer"><span>{mod.count}</span><span className="open-label">Open workspace <ArrowUpRight size={13}/></span></div>
        </button>)}</div>
        {filtered.length === 0 && <div className="empty-state"><Search size={24}/><b>No matching modules</b><span>Try another search term.</span></div>}
        <footer><span>NIC Valsad Office Management <b>·</b> Development build</span><span>Secure by design <ShieldCheck size={13}/></span></footer>
      </section>
    </main>
    {mobileOpen && <button className="backdrop" onClick={() => setMobileOpen(false)} aria-label="Close navigation"/>}
  </div>;
}
