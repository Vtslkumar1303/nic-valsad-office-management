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
    name: "RFMS Query Management", short: "RFMS Queries", description: "Track RFMS queries using the headings in the master workbook.", icon: ClipboardList,
    fields: [
      {key:"reportedDate",label:"Reported Date",placeholder:"",type:"date"},
      {key:"project",label:"Project",placeholder:"Project name"},
      {key:"queryReportedByOffice",label:"Query reported by Office",placeholder:"Office / reporting unit"},
      {key:"rfmsNo",label:"RFMS No.",placeholder:"Demo reference only"},
      {key:"description",label:"Description",placeholder:"Fictional demo description"},
      {key:"status",label:"Status",placeholder:"Open / In progress / Resolved"},
      {key:"media",label:"Media (Whatsapp, Email, Both)",placeholder:"Whatsapp / Email / Both"},
      {key:"remarks",label:"Remarks",placeholder:"Fictional demo remarks"},
      {key:"followupHistory",label:"Follow-up History (WhatsApp & Email)",placeholder:"Fictional follow-up summary"},
      {key:"diaRemarks",label:"DIA Remarks",placeholder:"Fictional demo remarks"},
      {key:"lastFollowupDate",label:"Last Follow-up Date",placeholder:"",type:"date"},
      {key:"nextActionDueDate",label:"Next Action Due Date",placeholder:"",type:"date"},
      {key:"followupAgingAlert",label:"Follow-up Aging / Alert",placeholder:"Demo aging / alert"}
    ],
    columns:[
      {key:"reportedDate",label:"Reported Date"},{key:"project",label:"Project"},{key:"queryReportedByOffice",label:"Query reported by Office"},{key:"rfmsNo",label:"RFMS No."},{key:"description",label:"Description"},{key:"status",label:"Status"},{key:"media",label:"Media (Whatsapp, Email, Both)"},{key:"remarks",label:"Remarks"},{key:"followupHistory",label:"Follow-up History (WhatsApp & Email)"},{key:"diaRemarks",label:"DIA Remarks"},{key:"lastFollowupDate",label:"Last Follow-up Date"},{key:"nextActionDueDate",label:"Next Action Due Date"},{key:"followupAgingAlert",label:"Follow-up Aging / Alert"}
    ],
    samples:[
      {reportedDate:"2026-11-12",project:"Demo e-Governance Project",queryReportedByOffice:"Demo Taluka Office",rfmsNo:"DEMO-RFMS-001",description:"Fictional sample query for interface preview",status:"In progress",media:"Email",remarks:"Demo record only",followupHistory:"Sample follow-up entry",diaRemarks:"Sample DIA remark",lastFollowupDate:"2026-11-15",nextActionDueDate:"2026-11-20",followupAgingAlert:"5 days remaining"},
      {reportedDate:"2026-11-14",project:"Demo Portal",queryReportedByOffice:"Demo District Office",rfmsNo:"DEMO-RFMS-002",description:"Fictional access-related query",status:"Open",media:"Whatsapp",remarks:"Demo record only",followupHistory:"No follow-up in demo",diaRemarks:"",lastFollowupDate:"",nextActionDueDate:"2026-11-21",followupAgingAlert:"Due soon"}
    ]
  },
  {
    name:"Daily Work Diary",short:"Work Diary",description:"The workbook's Daily Task Entry tab has no explicit header row; its source layout is not being guessed here.",icon:BookOpen,
    fields:[{key:"date",label:"Date (provisional)",placeholder:"",type:"date"},{key:"title",label:"Today's task (provisional)",placeholder:"Fictional demo task"},{key:"details",label:"Progress / update (provisional)",placeholder:"Fictional demo update"}],
    columns:[{key:"date",label:"Date (provisional)"},{key:"title",label:"Today's task (provisional)"},{key:"details",label:"Progress / update (provisional)"}],
    samples:[{date:"2026-11-17",title:"Sample system review",details:"Fictional demonstration entry"},{date:"2026-11-16",title:"Sample coordination task",details:"Fictional demonstration entry"}]
  },
  {
    name:"VC Management",short:"Video Conferences",description:"Maintain VC records with the exact VC LOG headings from the workbook.",icon:Video,
    fields:[{key:"sl",label:"SL",placeholder:"Demo serial number"},{key:"vcidPlace",label:"VCID/place of meeting",placeholder:"Demo VCID / meeting place"},{key:"date",label:"Date",placeholder:"",type:"date"},{key:"time",label:"Time",placeholder:"",type:"time"},{key:"duration",label:"Duration",placeholder:"e.g. 45 minutes"},{key:"subject",label:"Subject",placeholder:"Fictional demo subject"},{key:"vcLink",label:"VC Link",placeholder:"Do not enter real meeting links in this public demo"},{key:"remarks",label:"Remarks",placeholder:"Fictional demo remarks"},{key:"forCollectorOfficeNic",label:"For Collector Office/NIC",placeholder:"Demo note"}],
    columns:[{key:"sl",label:"SL"},{key:"vcidPlace",label:"VCID/place of meeting"},{key:"date",label:"Date"},{key:"time",label:"Time"},{key:"duration",label:"Duration"},{key:"subject",label:"Subject"},{key:"vcLink",label:"VC Link"},{key:"remarks",label:"Remarks"},{key:"forCollectorOfficeNic",label:"For Collector Office/NIC"}],
    samples:[{sl:"1",vcidPlace:"Demo VC Room",date:"2026-11-20",time:"11:00",duration:"45 minutes",subject:"Sample district review VC",vcLink:"Demo link withheld",remarks:"Fictional record",forCollectorOfficeNic:"NIC demo support"}]
  },
  {
    name:"Network Management",short:"Network",description:"Complaint register and speed-test fields follow the workbook headings.",icon:Network,
    fields:[{key:"srNo",label:"Sr. No.",placeholder:"Demo serial number"},{key:"dateComplaint",label:"Date of complaint",placeholder:"",type:"date"},{key:"department",label:"Department",placeholder:"Demo department"},{key:"category",label:"Category",placeholder:"Demo category"},{key:"problemDescription",label:"Problem description",placeholder:"Fictional issue description"},{key:"dktNo",label:"Dkt. NO",placeholder:"Demo docket number"},{key:"dateResolved",label:"Date of resolved",placeholder:"",type:"date"},{key:"actionTaken",label:"Action Taken",placeholder:"Fictional action taken"},{key:"status",label:"Status",placeholder:"Open / In progress / Resolved"},{key:"remarks",label:"Remarks",placeholder:"Fictional demo remarks"},{key:"speedTestDate",label:"Date (Speed test)",placeholder:"",type:"date"},{key:"downloadMbps",label:"download(mbps)",placeholder:"Demo numeric value",type:"number"},{key:"uploadMbps",label:"upload(mbps)",placeholder:"Demo numeric value",type:"number"}],
    columns:[{key:"srNo",label:"Sr. No."},{key:"dateComplaint",label:"Date of complaint"},{key:"department",label:"Department"},{key:"category",label:"Category"},{key:"problemDescription",label:"Problem description"},{key:"dktNo",label:"Dkt. NO"},{key:"dateResolved",label:"Date of resolved"},{key:"actionTaken",label:"Action Taken"},{key:"status",label:"Status"},{key:"remarks",label:"Remarks"},{key:"speedTestDate",label:"Date (Speed test)"},{key:"downloadMbps",label:"download(mbps)"},{key:"uploadMbps",label:"upload(mbps)"}],
    samples:[{srNo:"1",dateComplaint:"2026-11-12",department:"Demo Department",category:"Connectivity",problemDescription:"Fictional connectivity issue",dktNo:"DEMO-DKT-001",dateResolved:"2026-11-13",actionTaken:"Sample troubleshooting completed",status:"Resolved",remarks:"Demo record",speedTestDate:"2026-11-14",downloadMbps:"92",uploadMbps:"88"}]
  },
  {
    name:"Seva Setu Management",short:"Seva Setu",description:"Use the Seva Setu 2.0 sheet's original column headings.",icon:Users,
    fields:[{key:"srNo",label:"Sr No",placeholder:"Demo serial number"},{key:"emailReceivedDate",label:"Email Received Date",placeholder:"",type:"date"},{key:"officeDept",label:"Office/Dept.",placeholder:"Demo office / department"},{key:"scheduledDates",label:"Scheduled Dates",placeholder:"Demo schedule dates"},{key:"mamlatdarUsers",label:"Mamlatdar Users to be activate",placeholder:"Demo count / details"},{key:"talukaPanchayatUsers",label:"Taluka Panchayat User to be activated",placeholder:"Demo count / details"},{key:"remarks",label:"Remarks",placeholder:"Fictional demo remarks"},{key:"scheduleEntryDone",label:"Schedule entry done by collector office ?",placeholder:"Yes / No / Pending"}],
    columns:[{key:"srNo",label:"Sr No"},{key:"emailReceivedDate",label:"Email Received Date"},{key:"officeDept",label:"Office/Dept."},{key:"scheduledDates",label:"Scheduled Dates"},{key:"mamlatdarUsers",label:"Mamlatdar Users to be activate"},{key:"talukaPanchayatUsers",label:"Taluka Panchayat User to be activated"},{key:"remarks",label:"Remarks"},{key:"scheduleEntryDone",label:"Schedule entry done by collector office ?"}],
    samples:[{srNo:"1",emailReceivedDate:"2026-11-10",officeDept:"Demo Office",scheduledDates:"2026-11-22",mamlatdarUsers:"2 demo users",talukaPanchayatUsers:"3 demo users",remarks:"Fictional sample only",scheduleEntryDone:"Yes"}]
  },
  {
    name:"Reports & Dashboard",short:"Reports",description:"View operational summaries and export approved reports.",icon:Gauge,
    fields:[],columns:[{key:"report",label:"Report"},{key:"period",label:"Period"},{key:"description",label:"Description"},{key:"status",label:"Availability"}],
    samples:[{report:"RFMS status summary",period:"Current month",description:"Summary report template",status:"Demo preview"},{report:"Network incident register",period:"Current month",description:"Incident report template",status:"Demo preview"},{report:"ICT asset register",period:"Current quarter",description:"Inventory report template",status:"Demo preview"}]
  },
  {
    name:"ICT Asset Management",short:"ICT Assets",description:"The workbook's NIC Valsad Stock tab is a register index; detailed asset-row headings are in linked registers, not this workbook.",icon:HardDrive,
    fields:[],columns:[{key:"register",label:"Register / reference"},{key:"source",label:"Source in master workbook"}],
    samples:[{register:"ICT INFRA HARDWARE STOCK ENTRY DETAILS NIC DISTRICT CENTRE, GUJARAT",source:"NIC Valsad Stock tab"},{register:"DistFurn-ReceivedList",source:"NIC Valsad Stock tab"},{register:"DistHardwareIssue",source:"NIC Valsad Stock tab"},{register:"VALSAD - District-Stock-Verification-Format",source:"NIC Valsad Stock tab"}]
  },
  {
    name:"Staff Tour & Attendance",short:"Staff Movement",description:"Record movement using the exact NIC Staff TourAttendance headings.",icon:CalendarDays,
    fields:[{key:"srNo",label:"Sr. No",placeholder:"Demo serial number"},{key:"date",label:"Date",placeholder:"",type:"date"},{key:"reason",label:"Early leave Office Reason/Leave Reasons/Office Tour",placeholder:"Fictional demo reason"},{key:"reportedBy",label:"Reported By",placeholder:"Demo staff role"}],
    columns:[{key:"srNo",label:"Sr. No"},{key:"date",label:"Date"},{key:"reason",label:"Early leave Office Reason/Leave Reasons/Office Tour"},{key:"reportedBy",label:"Reported By"}],
    samples:[{srNo:"1",date:"2026-11-17",reason:"Sample official tour entry",reportedBy:"Demo staff member"}]
  },
  {
    name:"Events & Training",short:"Events",description:"Maintain event details using the Events sheet headings.",icon:Cloud,
    fields:[{key:"monthYear",label:"Month, Year",placeholder:"e.g. November, 2026"},{key:"dateOfEvent",label:"Date of Event",placeholder:"",type:"date"},{key:"event",label:"Event",placeholder:"Fictional demo event"},{key:"category",label:"Category",placeholder:"Demo category"},{key:"venue",label:"Venue",placeholder:"Fictional venue"}],
    columns:[{key:"monthYear",label:"Month, Year"},{key:"dateOfEvent",label:"Date of Event"},{key:"event",label:"Event"},{key:"category",label:"Category"},{key:"venue",label:"Venue"}],
    samples:[{monthYear:"November, 2026",dateOfEvent:"2026-11-25",event:"Sample district training",category:"Training",venue:"Demo Training Hall"}]
  },
  {
    name:"iRAD Project Update",short:"iRAD Updates",description:"Daily iRAD task updates using the workbook's original headings.",icon:Activity,
    fields:[{key:"date",label:"Date",placeholder:"",type:"date"},{key:"todaysTask",label:"Today's task",placeholder:"Fictional demo task"},{key:"descriptionTask",label:"Desciprtion of task (Training given to Whom (designation) ? What Project related work you have done today? )",placeholder:"Fictional demo description"},{key:"timeDuration",label:"Time Duration if Training /Meeting /NIC",placeholder:"Demo duration"},{key:"remarks",label:"Remarks",placeholder:"Fictional demo remarks"}],
    columns:[{key:"date",label:"Date"},{key:"todaysTask",label:"Today's task"},{key:"descriptionTask",label:"Desciprtion of task (Training given to Whom (designation) ? What Project related work you have done today? )"},{key:"timeDuration",label:"Time Duration if Training /Meeting /NIC"},{key:"remarks",label:"Remarks"}],
    samples:[{date:"2026-11-17",todaysTask:"Sample project coordination",descriptionTask:"Fictional demo description only",timeDuration:"30 minutes",remarks:"Demo entry"}]
  },
  {
    name:"Inactivation Logs",short:"Inactivation Logs",description:"Column structure mirrors the Inactivation Logs tab; no source records are copied.",icon:ClipboardList,
    fields:[{key:"column9",label:"Column 9",placeholder:"Demo value"},{key:"userId",label:"User ID",placeholder:"Use fictional demo identifiers only"},{key:"fullName",label:"Full name",placeholder:"Demo Person"},{key:"loginName",label:"Login name",placeholder:"demo.login"},{key:"column1",label:"Column 1",placeholder:"Demo value"},{key:"officeName",label:"Office Name",placeholder:"Demo office"},{key:"designation",label:"Designation",placeholder:"Demo designation"},{key:"inactiveDate",label:"InActive Date",placeholder:"",type:"date"},{key:"lastLogin",label:"Last Login",placeholder:"",type:"datetime-local"},{key:"mob",label:"Mob.",placeholder:"Do not enter real phone numbers in this public demo"}],
    columns:[{key:"column9",label:"Column 9"},{key:"userId",label:"User ID"},{key:"fullName",label:"Full name"},{key:"loginName",label:"Login name"},{key:"column1",label:"Column 1"},{key:"officeName",label:"Office Name"},{key:"designation",label:"Designation"},{key:"inactiveDate",label:"InActive Date"},{key:"lastLogin",label:"Last Login"},{key:"mob",label:"Mob."}],
    samples:[{column9:"1",userId:"DEMO-USER-001",fullName:"Demo Person A",loginName:"demo.user.a",column1:"—",officeName:"Demo Office",designation:"Demo Designation",inactiveDate:"",lastLogin:"2026-11-10T10:30",mob:"0000000000"}]
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
    {showForm&&selected&&<div className="modal-backdrop" onClick={()=>setShowForm(false)}><div className="modal" onClick={e=>e.stopPropagation()}><div className="modal-head"><div><span className="eyebrow">NEW DEMO ENTRY</span><h2>Add {selected.short} record</h2></div><button className="icon-button" onClick={()=>setShowForm(false)} aria-label="Close form"><X size={19}/></button></div><form onSubmit={saveRecord}><div className="form-grid">{selected.fields.map(field=><label className={field.key==="details"||field.key==="notes"||field.key==="purpose"||field.key==="requirements"?"field full":"field"} key={field.key}><span>{field.label}</span>{field.key==="details"||field.key==="notes"||field.key==="purpose"||field.key==="requirements"?<textarea required={field.key==="details"} placeholder={field.placeholder} value={form[field.key]||""} onChange={e=>setForm({...form,[field.key]:e.target.value})}/>:<input required={["reference","subject","date","title","ticket","location","issue","drive","tag","type","staff","event"].includes(field.key)} type={field.type||"text"} placeholder={field.placeholder} value={form[field.key]||""} onChange={e=>setForm({...form,[field.key]:e.target.value})}/>}</label>)}</div><div className="modal-actions"><button type="button" className="secondary-button" onClick={()=>setShowForm(false)}>Cancel</button><button type="submit" className="primary-button"><FilePlus2 size={16}/> Save demo record</button></div><p className="form-disclaimer">This entry is stored only in the current browser session. Database saving is not enabled yet.</p></form></div></div>}
    {toast&&<div className="toast"><CheckCircle2 size={17}/>{toast}</div>}
  </div>;
}
