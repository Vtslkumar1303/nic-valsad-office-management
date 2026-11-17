import { FormEvent, useMemo, useState } from "react";
import {
  Activity, ArrowDownToLine, ArrowLeft, ArrowUpRight, Bell, BookOpen,
  CalendarDays, CheckCircle2, ChevronDown, CircleHelp, ClipboardList,
  Cloud, FilePlus2, Filter, Gauge, HardDrive, LayoutDashboard, Menu,
  Network, Plus, Search, Settings, ShieldCheck, Users, Video, X
} from "lucide-react";

type Field = { key: string; label: string; placeholder: string; type?: string };
type Row = Record<string, string>;
type Module = {
  name: string; short: string; description: string; icon: typeof ClipboardList;
  fields: Field[]; columns: { key: string; label: string }[]; samples: Row[];
};

const modules: Module[] = [
  {
    name: "RFMS Query Management", short: "RFMS Queries", description: "Track incoming queries, assignments and resolution status.", icon: ClipboardList,
    fields: [{key:"reference",label:"Reference number",placeholder:"e.g. DEMO-RFMS-001"},{key:"subject",label:"Subject",placeholder:"Enter query subject"},{key:"received",label:"Received on",placeholder:"",type:"date"},{key:"priority",label:"Priority",placeholder:"Normal / High / Urgent"},{key:"status",label:"Status",placeholder:"Open / In progress / Resolved"},{key:"assignee",label:"Assigned to",placeholder:"Demo staff member"}],
    columns:[{key:"reference",label:"Reference"},{key:"subject",label:"Subject"},{key:"received",label:"Received"},{key:"priority",label:"Priority"},{key:"assignee",label:"Assigned to"},{key:"status",label:"Status"}],
    samples:[{reference:"DEMO-RFMS-001",subject:"Demonstration query – land records",received:"2026-11-12",priority:"Normal",assignee:"Demo User A",status:"In progress"},{reference:"DEMO-RFMS-002",subject:"Demonstration query – portal access",received:"2026-11-14",priority:"High",assignee:"Demo User B",status:"Open"},{reference:"DEMO-RFMS-003",subject:"Demonstration query – report correction",received:"2026-11-15",priority:"Low",assignee:"Demo User A",status:"Resolved"}]
  },
  {
    name:"Daily Work Diary",short:"Work Diary",description:"Record daily activities, work notes and follow-ups.",icon:BookOpen,
    fields:[{key:"date",label:"Entry date",placeholder:"",type:"date"},{key:"title",label:"Activity",placeholder:"Short activity title"},{key:"category",label:"Category",placeholder:"Administration / Technical / Meeting"},{key:"duration",label:"Duration (minutes)",placeholder:"e.g. 60",type:"number"},{key:"details",label:"Work notes",placeholder:"Describe the work completed"}],
    columns:[{key:"date",label:"Date"},{key:"title",label:"Activity"},{key:"category",label:"Category"},{key:"duration",label:"Minutes"},{key:"details",label:"Work notes"}],
    samples:[{date:"2026-11-17",title:"Daily system review",category:"Technical",duration:"45",details:"Fictional demonstration entry"},{date:"2026-11-16",title:"Coordination meeting",category:"Meeting",duration:"30",details:"Fictional demonstration entry"}]
  },
  {
    name:"VC Management",short:"Video Conferences",description:"Plan meetings, manage schedules and maintain VC records.",icon:Video,
    fields:[{key:"title",label:"Meeting title",placeholder:"Enter meeting title"},{key:"date",label:"Meeting date",placeholder:"",type:"date"},{key:"time",label:"Start time",placeholder:"",type:"time"},{key:"organizer",label:"Organizer",placeholder:"Demo organizer"},{key:"venue",label:"VC venue",placeholder:"Demo VC room"},{key:"status",label:"Status",placeholder:"Scheduled / Completed / Cancelled"}],
    columns:[{key:"title",label:"Meeting"},{key:"date",label:"Date"},{key:"time",label:"Time"},{key:"organizer",label:"Organizer"},{key:"venue",label:"Venue"},{key:"status",label:"Status"}],
    samples:[{title:"Sample district review VC",date:"2026-11-20",time:"11:00",organizer:"Demo Coordinator",venue:"Demo VC Room",status:"Scheduled"},{title:"Sample project coordination",date:"2026-11-18",time:"15:00",organizer:"Demo Coordinator",venue:"Demo VC Room",status:"Completed"}]
  },
  {
    name:"Network Management",short:"Network",description:"Log connectivity issues, escalation and restoration updates.",icon:Network,
    fields:[{key:"ticket",label:"Ticket number",placeholder:"DEMO-NET-001"},{key:"location",label:"Location",placeholder:"Fictional location"},{key:"service",label:"Service",placeholder:"Internet / LAN / VPN"},{key:"issue",label:"Issue summary",placeholder:"Describe the issue"},{key:"severity",label:"Severity",placeholder:"Low / Medium / High / Critical"},{key:"status",label:"Status",placeholder:"Open / In progress / Resolved"}],
    columns:[{key:"ticket",label:"Ticket"},{key:"location",label:"Location"},{key:"service",label:"Service"},{key:"issue",label:"Issue"},{key:"severity",label:"Severity"},{key:"status",label:"Status"}],
    samples:[{ticket:"DEMO-NET-001",location:"Demo Office A",service:"LAN",issue:"Sample connectivity issue",severity:"Medium",status:"In progress"},{ticket:"DEMO-NET-002",location:"Demo Office B",service:"Internet",issue:"Sample link interruption",severity:"High",status:"Resolved"}]
  },
  {
    name:"Seva Setu Management",short:"Seva Setu",description:"Maintain drive schedules, coordination and progress.",icon:Users,
    fields:[{key:"drive",label:"Drive name",placeholder:"Enter drive name"},{key:"date",label:"Drive date",placeholder:"",type:"date"},{key:"location",label:"Location",placeholder:"Fictional location"},{key:"taluka",label:"Taluka",placeholder:"Demo taluka"},{key:"status",label:"Status",placeholder:"Planned / In progress / Completed"},{key:"notes",label:"Notes",placeholder:"Coordination notes"}],
    columns:[{key:"drive",label:"Drive"},{key:"date",label:"Date"},{key:"location",label:"Location"},{key:"taluka",label:"Taluka"},{key:"status",label:"Status"}],
    samples:[{drive:"Sample service delivery camp",date:"2026-11-22",location:"Demo location A",taluka:"Demo Taluka",status:"Planned"},{drive:"Sample public assistance drive",date:"2026-11-10",location:"Demo location B",taluka:"Demo Taluka",status:"Completed"}]
  },
  {
    name:"Reports & Dashboard",short:"Reports",description:"View operational summaries and export approved reports.",icon:Gauge,
    fields:[],columns:[{key:"report",label:"Report"},{key:"period",label:"Period"},{key:"description",label:"Description"},{key:"status",label:"Availability"}],
    samples:[{report:"RFMS status summary",period:"Current month",description:"Summary report template",status:"Demo preview"},{report:"Network incident register",period:"Current month",description:"Incident report template",status:"Demo preview"},{report:"ICT asset register",period:"Current quarter",description:"Inventory report template",status:"Demo preview"}]
  },
  {
    name:"ICT Asset Management",short:"ICT Assets",description:"Maintain inventory, allocation, warranty and service history.",icon:HardDrive,
    fields:[{key:"tag",label:"Asset tag",placeholder:"DEMO-ASSET-001"},{key:"type",label:"Asset type",placeholder:"Desktop / Laptop / Printer"},{key:"model",label:"Make / model",placeholder:"Fictional model"},{key:"location",label:"Location",placeholder:"Demo location"},{key:"assigned",label:"Assigned to",placeholder:"Demo staff member"},{key:"status",label:"Asset status",placeholder:"In use / In stock / Under repair"}],
    columns:[{key:"tag",label:"Asset tag"},{key:"type",label:"Type"},{key:"model",label:"Model"},{key:"location",label:"Location"},{key:"assigned",label:"Assigned to"},{key:"status",label:"Status"}],
    samples:[{tag:"DEMO-ASSET-001",type:"Desktop",model:"Sample model A",location:"Demo Office",assigned:"Demo User A",status:"In use"},{tag:"DEMO-ASSET-002",type:"Printer",model:"Sample model B",location:"Demo Store",assigned:"Unassigned",status:"In stock"}]
  },
  {
    name:"Staff Tour & Attendance",short:"Staff Movement",description:"Record official tours, attendance and movement details.",icon:CalendarDays,
    fields:[{key:"staff",label:"Staff member",placeholder:"Demo staff member"},{key:"type",label:"Movement type",placeholder:"Tour / Attendance / Leave"},{key:"from",label:"From date",placeholder:"",type:"date"},{key:"to",label:"To date",placeholder:"",type:"date"},{key:"destination",label:"Destination",placeholder:"Fictional destination"},{key:"purpose",label:"Purpose",placeholder:"Official purpose"},{key:"approval",label:"Approval status",placeholder:"Pending / Approved / Rejected"}],
    columns:[{key:"staff",label:"Staff"},{key:"type",label:"Type"},{key:"from",label:"From"},{key:"to",label:"To"},{key:"destination",label:"Destination"},{key:"approval",label:"Approval"}],
    samples:[{staff:"Demo User A",type:"Tour",from:"2026-11-19",to:"2026-11-19",destination:"Demo destination",approval:"Pending"},{staff:"Demo User B",type:"Attendance",from:"2026-11-17",to:"2026-11-17",destination:"Office",approval:"Approved"}]
  },
  {
    name:"Events & Training",short:"Events",description:"Coordinate events, training programmes and ICT support.",icon:Cloud,
    fields:[{key:"event",label:"Event name",placeholder:"Enter event name"},{key:"type",label:"Event type",placeholder:"Training / Event / Exam support"},{key:"start",label:"Start date",placeholder:"",type:"date"},{key:"end",label:"End date",placeholder:"",type:"date"},{key:"venue",label:"Venue",placeholder:"Fictional venue"},{key:"requirements",label:"ICT requirements",placeholder:"Describe demo requirements"},{key:"status",label:"Status",placeholder:"Planned / Ongoing / Completed"}],
    columns:[{key:"event",label:"Event"},{key:"type",label:"Type"},{key:"start",label:"Start date"},{key:"end",label:"End date"},{key:"venue",label:"Venue"},{key:"status",label:"Status"}],
    samples:[{event:"Sample district training",type:"Training",start:"2026-11-25",end:"2026-11-25",venue:"Demo Training Hall",status:"Planned"},{event:"Sample ICT readiness exercise",type:"ICT support",start:"2026-11-08",end:"2026-11-08",venue:"Demo Venue",status:"Completed"}]
  }
];

const navItems = [
  { label:"Overview", icon:LayoutDashboard },
  { label:"All modules", icon:ClipboardList },
  { label:"Calendar", icon:CalendarDays },
  { label:"Staff", icon:Users },
  { label:"Settings", icon:Settings }
];

const initialRecords: Record<string, Row[]> = Object.fromEntries(modules.map(m => [m.name,m.samples]));

function Status({value}:{value?:string}) {
  if (!value) return <span className="muted">—</span>;
  const v=value.toLowerCase();
  const tone=v.includes("resolved")||v.includes("completed")||v.includes("approved")||v.includes("in use") ? "green" : v.includes("urgent")||v.includes("critical")||v.includes("high")||v.includes("rejected") ? "red" : v.includes("progress")||v.includes("pending")||v.includes("planned") ? "amber" : "blue";
  return <span className={`status-pill ${tone}`}><i/>{value}</span>;
}

export default function App() {
  const [active,setActive]=useState("Overview");
  const [records,setRecords]=useState<Record<string,Row[]>>(initialRecords);
  const [search,setSearch]=useState("");
  const [showForm,setShowForm]=useState(false);
  const [form,setForm]=useState<Row>({});
  const [mobileOpen,setMobileOpen]=useState(false);
  const [toast,setToast]=useState("");
  const [noticeOpen,setNoticeOpen]=useState(true);

  const selected=modules.find(m=>m.name===active);
  const rows=selected ? records[selected.name] || [] : [];
  const filtered=useMemo(()=>rows.filter(row=>Object.values(row).join(" ").toLowerCase().includes(search.toLowerCase())),[rows,search]);

  function navigate(label:string) {
    setActive(label);setSearch("");setMobileOpen(false);setShowForm(false);
  }
  function saveRecord(e:FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selected) return;
    setRecords(current=>({...current,[selected.name]:[{...form},...(current[selected.name]||[])]}));
    setForm({});setShowForm(false);setToast("Demo record added to this browser session.");
    window.setTimeout(()=>setToast(""),3200);
  }
  function exportCsv() {
    if (!selected) return;
    const cols=selected.columns;
    const quote=(value:string)=>`"${(value||"").replace(/"/g,'""')}"`;
    const csv=[cols.map(c=>quote(c.label)).join(","),...filtered.map(row=>cols.map(c=>quote(row[c.key]||"")).join(","))].join("\n");
    const url=URL.createObjectURL(new Blob(["\uFEFF"+csv],{type:"text/csv;charset=utf-8"}));
    const a=document.createElement("a");a.href=url;a.download=`${selected.short.toLowerCase().replaceAll(" ","-")}-demo.csv`;a.click();URL.revokeObjectURL(url);
  }

  return <div className="shell">
    <aside className={mobileOpen?"sidebar open":"sidebar"}>
      <div className="brand"><div className="brand-mark"><ShieldCheck size={24}/></div><div><strong>NIC VALSAD</strong><span>OFFICE MANAGEMENT</span></div><button className="mobile-close" onClick={()=>setMobileOpen(false)} aria-label="Close menu"><X size={18}/></button></div>
      <div className="office-tag"><span className="status-dot"/> District Office · Gujarat</div>
      <div className="nav-label">WORKSPACE</div>
      <nav>{navItems.map(item=><button key={item.label} className={active===item.label?"nav-item selected":"nav-item"} onClick={()=>navigate(item.label)}><item.icon size={18}/><span>{item.label}</span>{active===item.label&&<span className="nav-indicator"/>}</button>)}</nav>
      <div className="nav-label modules-nav-label">MODULES</div>
      <nav className="module-nav">{modules.map(m=><button key={m.name} className={active===m.name?"nav-item selected":"nav-item"} onClick={()=>navigate(m.name)}><m.icon size={17}/><span>{m.short}</span></button>)}</nav>
      <div className="sidebar-bottom"><div className="help-card"><CircleHelp size={18}/><div><b>Need assistance?</b><span>Contact your system administrator.</span></div></div><div className="profile"><div className="avatar">AD</div><div><b>Demo Administrator</b><span>Demo environment</span></div><ChevronDown size={16}/></div></div>
    </aside>

    <main className="main">
      <header className="topbar"><button className="menu-button" onClick={()=>setMobileOpen(true)} aria-label="Open menu"><Menu/></button><div className="breadcrumb">Workspace <span>/</span> <b>{active}</b></div><div className="top-actions"><span className="environment"><i/> DEMO MODE</span><button className="icon-button" aria-label="Notifications"><Bell size={19}/><i/></button><div className="top-avatar">AD</div></div></header>
      <section className="content">
        {active==="Overview"||active==="All modules" ? <>
          <div className="welcome-row"><div><div className="eyebrow">DISTRICT INFORMATICS OFFICE</div><h1>{active==="Overview"?"Office overview":"All office modules"}</h1><p>One workspace for coordinating district-level e-Governance operations.</p></div><div className="date-chip"><CalendarDays size={16}/>{new Date().toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})}</div></div>
          {noticeOpen&&<div className="notice"><div className="notice-icon"><ShieldCheck size={19}/></div><div><b>Development environment</b><span>Fictional sample records only. Entries added here remain in this browser session and are not saved to a database.</span></div><button className="notice-dismiss" onClick={()=>setNoticeOpen(false)} aria-label="Dismiss notice"><X size={16}/></button></div>}
          <div className="section-heading"><div><h2>At a glance</h2><p>Sample counters based on the current demonstration data.</p></div><button className="text-button" onClick={()=>navigate("Reports & Dashboard")}>View reports <ArrowUpRight size={15}/></button></div>
          <div className="stats-grid">{[
            {label:"RFMS queries",value:records["RFMS Query Management"].length,icon:ClipboardList},
            {label:"Network incidents",value:records["Network Management"].length,icon:Activity},
            {label:"Upcoming VCs",value:records["VC Management"].filter(r=>r.status==="Scheduled").length,icon:Video},
            {label:"ICT assets",value:records["ICT Asset Management"].length,icon:HardDrive}
          ].map(s=><div className="stat-card" key={s.label}><div className="stat-top"><span>{s.label}</span><div className="stat-icon"><s.icon size={18}/></div></div><div className="stat-value">{s.value}</div><div className="stat-note">Demo records · not live data</div></div>)}</div>
          <div className="section-heading modules-heading"><div><h2>Office modules</h2><p>Open a workspace to view and manage its demonstration records.</p></div><span className="module-count">09 MODULES</span></div>
          <div className="module-grid">{modules.map(mod=><button className="module-card" key={mod.name} onClick={()=>navigate(mod.name)}><div className="module-card-top"><div className="module-icon"><mod.icon size={20}/></div><ArrowUpRight size={17} className="card-arrow"/></div><h3>{mod.name}</h3><p>{mod.description}</p><div className="module-footer"><span>{records[mod.name].length} demo records</span><span className="open-label">Open workspace <ArrowUpRight size={13}/></span></div></button>)}</div>
        </>:selected ? <>
          <div className="workspace-heading"><button className="back-link" onClick={()=>navigate("Overview")}><ArrowLeft size={15}/> Overview</button><div className="workspace-title-row"><div><div className="eyebrow">OFFICE WORKSPACE</div><h1>{selected.name}</h1><p>{selected.description}</p></div>{selected.fields.length>0&&<button className="primary-button" onClick={()=>{setForm({});setShowForm(true)}}><Plus size={16}/> Add record</button>}</div></div>
          <div className="workspace-summary"><div><span className="summary-label">TOTAL RECORDS</span><strong>{rows.length}</strong></div><div><span className="summary-label">FILTERED RESULTS</span><strong>{filtered.length}</strong></div><div><span className="summary-label">DATA SOURCE</span><strong className="demo-source">Demo session</strong></div></div>
          {active==="Reports & Dashboard"&&<div className="report-note"><Gauge size={18}/><div><b>Report preview</b><span>These are sample report definitions. Live aggregation and scheduled exports will be connected after the database and permissions layer is implemented.</span></div></div>}
          <div className="table-toolbar"><div className="search-wrap"><Search size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder={`Search ${selected.short.toLowerCase()}...`} aria-label="Search records"/></div><div className="toolbar-actions"><span className="result-count">{filtered.length} records</span><button className="secondary-button" onClick={exportCsv}><ArrowDownToLine size={15}/> Export CSV</button></div></div>
          <div className="data-table-wrap"><table className="data-table"><thead><tr>{selected.columns.map(col=><th key={col.key}>{col.label}</th>)}</tr></thead><tbody>{filtered.map((row,i)=><tr key={i}>{selected.columns.map(col=><td key={col.key}>{col.key==="status"||col.key==="approval"||col.key==="priority"||col.key==="severity"?<Status value={row[col.key]}/>:<span>{row[col.key]||"—"}</span>}</td>)}</tr>)}</tbody></table>{filtered.length===0&&<div className="table-empty"><Filter size={22}/><b>No records found</b><span>Try changing your search or add a new demonstration record.</span></div>}</div>
          <div className="table-footnote"><ShieldCheck size={14}/> Demonstration data only · Not connected to an office database</div>
        </>:active==="Calendar"||active==="Staff"||active==="Settings"?<>
          <div className="welcome-row"><div><div className="eyebrow">WORKSPACE</div><h1>{active}</h1><p>{active==="Calendar"?"A combined calendar view will bring together VCs, events and staff movements.":active==="Staff"?"Staff directory and role-based access will be managed here.":"Application preferences, user access and security controls."}</p></div></div>
          <div className="placeholder-panel"><div className="placeholder-icon">{active==="Calendar"?<CalendarDays/>:active==="Staff"?<Users/>:<Settings/>}</div><h2>{active} workspace</h2><p>This section is planned for the next implementation milestone. It will be connected to the same PostgreSQL database and permission system.</p><button className="secondary-button" onClick={()=>navigate("Overview")}><ArrowLeft size={15}/> Return to overview</button></div>
        </>:null}
        <footer><span>NIC Valsad Office Management <b>·</b> Development build</span><span>Secure by design <ShieldCheck size={13}/></span></footer>
      </section>
    </main>
    {mobileOpen&&<button className="backdrop" onClick={()=>setMobileOpen(false)} aria-label="Close navigation"/>}
    {showForm&&selected&&<div className="modal-backdrop" onClick={()=>setShowForm(false)}><div className="modal" onClick={e=>e.stopPropagation()}><div className="modal-head"><div><span className="eyebrow">NEW DEMO ENTRY</span><h2>Add {selected.short} record</h2></div><button className="icon-button" onClick={()=>setShowForm(false)} aria-label="Close form"><X size={19}/></button></div><form onSubmit={saveRecord}><div className="form-grid">{selected.fields.map(field=><label className={field.key==="details"||field.key==="notes"||field.key==="purpose"||field.key==="requirements"?"field full":"field"} key={field.key}><span>{field.label}</span>{field.key==="details"||field.key==="notes"||field.key==="purpose"||field.key==="requirements"?<textarea required={field.key==="title"||field.key==="details"} placeholder={field.placeholder} value={form[field.key]||""} onChange={e=>setForm({...form,[field.key]:e.target.value})}/>:<input required={["reference","subject","date","title","ticket","location","issue","drive","tag","type","staff","event"].includes(field.key)} type={field.type||"text"} placeholder={field.placeholder} value={form[field.key]||""} onChange={e=>setForm({...form,[field.key]:e.target.value})}/>}</label>)}</div><div className="modal-actions"><button type="button" className="secondary-button" onClick={()=>setShowForm(false)}>Cancel</button><button type="submit" className="primary-button"><FilePlus2 size={16}/> Save demo record</button></div><p className="form-disclaimer">This entry is stored only in the current browser session. Database saving is not enabled yet.</p></form></div></div>}
    {toast&&<div className="toast"><CheckCircle2 size={17}/>{toast}</div>}
  </div>;
}
