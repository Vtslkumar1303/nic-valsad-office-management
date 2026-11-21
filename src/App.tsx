import { FormEvent, useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import {
  Activity, ArrowDownToLine, ArrowLeft, ArrowUpRight, Bell, BookOpen,
  CalendarDays, CheckCircle2, ChevronDown, CircleHelp, ClipboardList,
  Cloud, FilePlus2, Filter, Gauge, HardDrive, LayoutDashboard, Menu,
  Network, Plus, Search, Settings, ShieldCheck, Users, Video, X
} from "lucide-react";

type Field = { key: string; label: string; placeholder: string; type?: string; options?: string[] };
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
      {key:"project",label:"Project",placeholder:"Project name",options:["iORA","RO Diary","WebBhulekh/e-Dhara","e-DharaDocs","AnyRoR","RO Diary","iRCMS ","iiLMS","RCMS","Sparrow / VPN Services ","PDS/iPDS/FPS/Efps","SSO","Valsad NIC Website","eMail Services","PG Portal","eSign","Digital Gujarat","eForms","IVFRT VPN Token"]},
      {key:"queryReportedByOffice",label:"Query reported by Office",placeholder:"Office / reporting unit",options:["Collector Office","Mamlatdar Dharampur","Mamlatdar Valsad","Mamlatdar Valsad City","Mamlatdar Vapi","Mamlatdar Vapi City","Mamlatdar Umbergaon","Mamlatdar Pardi","Mamlatdar Kaprada","Mamlatdar Nanapondha","SP Office","DSO Office","District Panchayat","Vapi MNC","DILR Office","DPO Office","Mamlatdar Disaster","Prant Pardi","Gram Panchayat","SLR Office Vapi","Prant Dharampur","SLR Valsad","Stam Duty Office","Others"]},
      {key:"rfmsNo",label:"RFMS No.",placeholder:"Demo reference only"},
      {key:"description",label:"Description",placeholder:"Fictional demo description"},
      {key:"status",label:"Status",placeholder:"Open / In progress / Resolved",options:["Pending at the Concerned Department","Pending at NIC State​","Pending at SMC","Resolved","Technical Guidance Given","Resolved but RFMS Query Response Pending at NIC State","Pending at District NIC"]},
      {key:"media",label:"Media (Whatsapp, Email, Both)",placeholder:"Whatsapp / Email / Both",options:["e Mail","Whatsapp","Both","Office Letter"]},
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
    name:"Daily Work Diary",short:"Work Diary",description:"All eight source columns from Daily Task Entry are displayed as recorded in Excel.",icon:BookOpen,
    fields:[{key:"date",label:"Source column A",placeholder:""},{key:"title",label:"Source column B",placeholder:""},{key:"details",label:"Source column C",placeholder:""},{key:"update2",label:"Source column D",placeholder:""},{key:"update3",label:"Source column E",placeholder:""},{key:"update4",label:"Source column F",placeholder:""},{key:"update5",label:"Source column G",placeholder:""},{key:"update6",label:"Source column H",placeholder:""}],
    columns:[{key:"date",label:"Column A"},{key:"title",label:"Column B"},{key:"details",label:"Column C"},{key:"update2",label:"Column D"},{key:"update3",label:"Column E"},{key:"update4",label:"Column F"},{key:"update5",label:"Column G"},{key:"update6",label:"Column H"}],
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
  ,
  {
    name:"Pending Task (Backup)",short:"RFMS Archive",description:"Separate backup worksheet with the source headings; not merged into the active RFMS register.",icon:ClipboardList,
    fields:[{key:"reportedDate",label:"Reported Date",placeholder:"",type:"date"},{key:"project",label:"Project",placeholder:"Project",options:["iORA","RO Diary","WebBhulekh/e-Dhara","e-DharaDocs","AnyRoR","RO Diary","iRCMS ","iiLMS","RCMS","Sparrow / VPN Services ","PDS/iPDS/FPS/Efps","SSO","Valsad NIC Website","eMail Services","PG Portal","eSign","Digital Gujarat","eForms","IVFRT VPN Token"]},{key:"queryReportedByOffice",label:"Query reported by Office",placeholder:"Office",options:["Collector Office","Mamlatdar Dharampur","Mamlatdar Valsad","Mamlatdar Valsad City","Mamlatdar Vapi","Mamlatdar Vapi City","Mamlatdar Umbergaon","Mamlatdar Pardi","Mamlatdar Kaprada","Mamlatdar Nanapondha","SP Office","DSO Office","District Panchayat","Vapi MNC","DILR Office","DPO Office","Mamlatdar Disaster","Prant Pardi","Gram Panchayat","SLR Office Vapi","Prant Dharampur","SLR Valsad","Stam Duty Office","Others"]},{key:"rfmsNo",label:"RFMS No.",placeholder:"Reference"},{key:"description",label:"Description",placeholder:"Description"},{key:"status",label:"Status",placeholder:"Status",options:["Pending at the Concerned Department","Pending at NIC State​","Pending at SMC","Resolved","Technical Guidance Given","Resolved but RFMS Query Response Pending at NIC State","Pending at District NIC"]},{key:"media",label:"Media (Whatsapp, Email, Both)",placeholder:"Media",options:["e Mail","Whatsapp","Both","Office Letter"]},{key:"dioRemarks",label:"DIO Remarks",placeholder:"Remarks"},{key:"followupUpdate",label:"Followup Date & Update Query status in details",placeholder:"Follow-up details"},{key:"diaRemarks",label:"DIA Remarks",placeholder:"Remarks"},{key:"column12",label:"Column 12",placeholder:""},{key:"column11",label:"Column 11",placeholder:""}],
    columns:[{key:"reportedDate",label:"Reported Date"},{key:"project",label:"Project"},{key:"queryReportedByOffice",label:"Query reported by Office"},{key:"rfmsNo",label:"RFMS No."},{key:"description",label:"Description"},{key:"status",label:"Status"},{key:"media",label:"Media (Whatsapp, Email, Both)"},{key:"dioRemarks",label:"DIO Remarks"},{key:"followupUpdate",label:"Followup Date & Update Query status in details"},{key:"diaRemarks",label:"DIA Remarks"},{key:"column12",label:"Column 12"},{key:"column11",label:"Column 11"}],samples:[]
  },
  {
    name:"GoG Projects",short:"GoG Projects",description:"The source tab contains a reference heading only; linked contact details are not embedded in this workbook.",icon:BookOpen,
    fields:[{key:"reference",label:"NIC Out of Scope Project Contact Details",placeholder:"Reference"}],
    columns:[{key:"reference",label:"NIC Out of Scope Project Contact Details"}],samples:[]
  },
  {
    name:"Collection Status",short:"Collection Status",description:"Displays both tables embedded in Sheet9: collection summary and request/ticket log.",icon:Activity,
    fields:[{key:"district",label:"District ",placeholder:"District"},{key:"dioDia",label:"DIO/DIA",placeholder:"DIO/DIA"},{key:"collectionStatus",label:"Collection Status",placeholder:"Status"},{key:"amount",label:"Amount",placeholder:"Amount",type:"number"}],
    columns:[{key:"district",label:"District"},{key:"dioDia",label:"DIO/DIA"},{key:"collectionStatus",label:"Collection Status"},{key:"amount",label:"Amount"},{key:"requestSrNo",label:"Request Sr. No."},{key:"requestId",label:"Request ID"},{key:"contact",label:"Contact"},{key:"account",label:"Account"},{key:"category",label:"Category"},{key:"title",label:"Title"},{key:"createdTime",label:"Created Time"},{key:"completedTime",label:"Completed Time"},{key:"age",label:"Age"},{key:"requestStatus",label:"Request Status"},{key:"serialNo",label:"Serial No."},{key:"requestRemarks",label:"Remarks"},{key:"confirm",label:"Confirm"}],samples:[]
  },
  {
    name:"Poll Day Dashboard",short:"Poll Day",description:"Sheet7 reporting layout with source time checkpoints and gender headings; no polling figures are copied.",icon:Gauge,
    fields:[{key:"authorityType",label:"Local authority type",placeholder:"TP / DP / NP / MNP"},{key:"male",label:"Male ",placeholder:"",type:"number"},{key:"female",label:"Female",placeholder:"",type:"number"},{key:"0945",label:"09:45",placeholder:"",type:"number"},{key:"1030",label:"10:30",placeholder:"",type:"number"},{key:"1200",label:"12:00",placeholder:"",type:"number"},{key:"0100",label:"01:00",placeholder:"",type:"number"},{key:"0200",label:"02:00",placeholder:"",type:"number"},{key:"0300",label:"03:00",placeholder:"",type:"number"},{key:"0400",label:"04:00",placeholder:"",type:"number"},{key:"0500",label:"05:00",placeholder:"",type:"number"},{key:"0600",label:"06:00",placeholder:"",type:"number"},{key:"0700",label:"07:00",placeholder:"",type:"number"}],
    columns:[{key:"authorityType",label:"Local authority type"},{key:"male",label:"Male "},{key:"female",label:"Female"},{key:"0945",label:"09:45"},{key:"1030",label:"10:30"},{key:"1200",label:"12:00"},{key:"0100",label:"01:00"},{key:"0200",label:"02:00"},{key:"0300",label:"03:00"},{key:"0400",label:"04:00"},{key:"0500",label:"05:00"},{key:"0600",label:"06:00"},{key:"0700",label:"07:00"}],samples:[]
  }

];

const navItems = [
  { label:"Overview", icon:LayoutDashboard },
  { label:"Master Workbook", icon:BookOpen },
  { label:"All modules", icon:ClipboardList },
  { label:"Calendar", icon:CalendarDays },
  { label:"Staff", icon:Users },
  { label:"Settings", icon:Settings }
];

const initialRecords: Record<string, Row[]> = Object.fromEntries(modules.map(m => [m.name,[]]));

function Status({value}:{value?:string}) {
  if (!value) return <span className="muted">—</span>;
  const v=value.toLowerCase();
  const tone=v.includes("resolved")||v.includes("completed")||v.includes("approved")||v.includes("in use") ? "green" : v.includes("urgent")||v.includes("critical")||v.includes("high")||v.includes("rejected") ? "red" : v.includes("progress")||v.includes("pending")||v.includes("planned") ? "amber" : "blue";
  return <span className={`status-pill ${tone}`}><i/>{value}</span>;
}


function BarChart({title,subtitle,items}:{title:string;subtitle:string;items:{label:string;value:number}[]}) {
 const max=Math.max(1,...items.map(x=>x.value));
 return <div className="chart-card"><div className="chart-heading"><div><h3>{title}</h3><p>{subtitle}</p></div><span className="chart-kind">BAR</span></div><div className="bar-chart">{items.map(x=><div className="bar-row" key={x.label}><span className="bar-label" title={x.label}>{x.label}</span><div className="bar-track"><div className="bar-fill" style={{width:`${x.value?Math.max(5,x.value/max*100):0}%`}}/></div><b>{x.value}</b></div>)}</div>{items.length===0&&<div className="chart-empty">No data available</div>}</div>;
}
function DonutChart({title,subtitle,items}:{title:string;subtitle:string;items:{label:string;value:number;color:string}[]}) {
 const total=items.reduce((n,x)=>n+x.value,0);let offset=0;
 const stops=items.map(x=>{const start=offset;offset+=total?x.value/total*100:0;return `${x.color} ${start}% ${offset}%`;});
 return <div className="chart-card"><div className="chart-heading"><div><h3>{title}</h3><p>{subtitle}</p></div><span className="chart-kind">MIX</span></div><div className="donut-layout"><div className="donut" style={{background:total?`conic-gradient(${stops.join(",")})`:"#edf1f4"}}><div className="donut-hole"><strong>{total}</strong><span>Total</span></div></div><div className="donut-legend">{items.map(x=><div key={x.label}><i style={{background:x.color}}/><span>{x.label}</span><b>{x.value}</b></div>)}</div></div></div>;
}
const countBy=(rows:Row[],key:string)=>rows.reduce<Record<string,number>>((acc,row)=>{const label=(row[key]||"Not specified").trim()||"Not specified";acc[label]=(acc[label]||0)+1;return acc;},{});
const monthCounts=(rows:Row[],dateKey:string)=>{const names=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];const counts=Array(12).fill(0);rows.forEach(row=>{const d=new Date(row[dateKey]);if(row[dateKey]&&!Number.isNaN(d.getTime()))counts[d.getMonth()]++;});return names.map((label,i)=>({label,value:counts[i]}));};
export default function App() {
  const [active,setActive]=useState("Overview");
  const [records,setRecords]=useState<Record<string,Row[]>>(initialRecords);
  const [workbookSheets,setWorkbookSheets]=useState<Record<string,(string|number|boolean)[][]>>({});
  const [selectedSheet,setSelectedSheet]=useState("");
  const [workbookLoading,setWorkbookLoading]=useState(true);
  const [workbookError,setWorkbookError]=useState("");
  const [search,setSearch]=useState("");
  const [sortKey,setSortKey]=useState("");
  const [sortDir,setSortDir]=useState<"asc"|"desc">("asc");
  const [statusFilter,setStatusFilter]=useState("All");
  const [masterSortCol,setMasterSortCol]=useState(-1);
  const [masterSortDir,setMasterSortDir]=useState<"asc"|"desc">("asc");
  const [showForm,setShowForm]=useState(false);
  const [form,setForm]=useState<Row>({});
  const [editingCell,setEditingCell]=useState<{rowIndex:number;key:string}|null>(null);
  const [editValue,setEditValue]=useState("");
  const [mobileOpen,setMobileOpen]=useState(false);
  const [toast,setToast]=useState("");
  const [noticeOpen,setNoticeOpen]=useState(true);

  useEffect(()=>{
    let cancelled=false;
    (async()=>{
      try {
        const response=await fetch("https://raw.githubusercontent.com/Vtslkumar1303/nic-valsad-office-management/main/Valsad%20NIC%20Daily%20update.xlsx");
        if(!response.ok) throw new Error(`Workbook fetch failed (${response.status})`);
        const bytes=await response.arrayBuffer();
        const workbook=XLSX.read(bytes,{type:"array",cellDates:false});
        const sheets:Record<string,(string|number|boolean)[][]>={};
        workbook.SheetNames.forEach(name=>{
          const sheet=workbook.Sheets[name];
          const ref=sheet["!ref"];
          if(!ref){sheets[name]=[];return;}
          const range=XLSX.utils.decode_range(ref);
          const rows:(string|number|boolean)[][]=[];
          for(let r=range.s.r;r<=range.e.r;r++){
            const row:(string|number|boolean)[]=[];
            for(let col=range.s.c;col<=range.e.c;col++){
              const cell=sheet[XLSX.utils.encode_cell({r,c:col})];
              const value=cell ? (cell.w ?? (cell.v instanceof Date ? cell.v.toLocaleDateString() : cell.v ?? "")) : "";
              row.push(typeof value==="string"||typeof value==="number"||typeof value==="boolean"?value:String(value));
            }
            if(row.some(value=>String(value).trim()!=="")) rows.push(row);
          }
          sheets[name]=rows;
        });
        const asText=(v:unknown)=>String(v??"").trim();
        const findHeader=(name:string,needle:string)=>{const data=sheets[name]||[];return data.findIndex(row=>row.some(cell=>asText(cell).toLowerCase()===needle.toLowerCase()));};
        const fromHeader=(name:string,headerNeedle:string,keys:string[],offset=0,filter?:(row:(string|number|boolean)[])=>boolean)=>{
          const data=sheets[name]||[];const h=findHeader(name,headerNeedle);if(h<0)return [];
          return data.slice(h+1+offset).filter(row=>row.some(v=>asText(v)!=="")&&(!filter||filter(row))).map(row=>Object.fromEntries(keys.map((key,i)=>[key,asText(row[i])])) as Row);
        };
        const imported:Record<string,Row[]>={...initialRecords};
        imported["RFMS Query Management"]=fromHeader("Pending Task ","Reported Date",["reportedDate","project","queryReportedByOffice","rfmsNo","description","status","media","remarks","followupHistory","diaRemarks","lastFollowupDate","nextActionDueDate","followupAgingAlert"],0,row=>!asText(row[0]).toUpperCase().startsWith("YEAR"));
        imported["Pending Task (Backup)"]=fromHeader("Pending Task (Backup)","Reported Date",["reportedDate","project","queryReportedByOffice","rfmsNo","description","status","media","dioRemarks","followupUpdate","diaRemarks","column12","column11"],0,row=>!asText(row[0]).toUpperCase().startsWith("YEAR"));
        imported["Daily Work Diary"]=(sheets["Daily Task Entry"]||[]).filter(row=>row.some(v=>asText(v)!=="")).map(row=>({date:asText(row[0]),title:asText(row[1]),details:asText(row[2]),update2:asText(row[3]),update3:asText(row[4]),update4:asText(row[5]),update5:asText(row[6]),update6:asText(row[7])}));
        imported["Seva Setu Management"]=fromHeader("Seva Setu 2.0","Email Received Date",["srNo","emailReceivedDate","officeDept","scheduledDates","mamlatdarUsers","talukaPanchayatUsers","remarks","scheduleEntryDone"],0,row=>row.slice(0,8).some(v=>asText(v)!==""));
        imported["Events & Training"]=fromHeader("Events","Month, Year",["monthYear","dateOfEvent","event","category","venue"]);
        imported["VC Management"]=fromHeader("VC LOG","SL",["sl","vcidPlace","date","time","duration","subject","vcLink","remarks","forCollectorOfficeNic"]);
        const net=sheets["Network related call logs"]||[];const netHead=net.findIndex(row=>asText(row[0]).toLowerCase()==="sr. no.");
        imported["Network Management"]=netHead>=0?net.slice(netHead+1).filter(row=>row.slice(0,10).some(v=>asText(v)!=="")).map(row=>({srNo:asText(row[0]),dateComplaint:asText(row[1]),department:asText(row[2]),category:asText(row[3]),problemDescription:asText(row[4]),dktNo:asText(row[5]),dateResolved:asText(row[6]),actionTaken:asText(row[7]),status:asText(row[8]),remarks:asText(row[9])})): [];
        imported["iRAD Project Update"]=fromHeader("iRAD Project Update","Date",["date","todaysTask","descriptionTask","timeDuration","remarks"]);
        imported["Staff Tour & Attendance"]=fromHeader("NIC Staff TourAttendance ","Sr. No",["srNo","date","reason","reportedBy"]);
        imported["Inactivation Logs"]=fromHeader("Inactivation Logs","Column 9",["column9","userId","fullName","loginName","column1","officeName","designation","inactiveDate","lastLogin","mob"]);
        const coll=sheets["Sheet9"]||[];const collHead=coll.findIndex(row=>asText(row[3]).toLowerCase()==="district");
        const collectionRows=collHead>=0?coll.slice(collHead+1).filter(row=>row.slice(3,7).some(v=>asText(v)!=="")&&!asText(row[5]).toLowerCase().startsWith("total")).map(row=>({district:asText(row[3]),dioDia:asText(row[4]),collectionStatus:asText(row[5]),amount:asText(row[6])})): [];
        const requestHead=coll.findIndex(row=>asText(row[2]).toLowerCase()==="request id");
        const requestRows=requestHead>=0?coll.slice(requestHead+1).filter(row=>row.slice(1,14).some(v=>asText(v)!=="")).map(row=>({district:"",dioDia:"",collectionStatus:"",amount:"",requestSrNo:asText(row[1]),requestId:asText(row[2]),contact:asText(row[3]),account:asText(row[4]),category:asText(row[5]),title:asText(row[6]),createdTime:asText(row[7]),completedTime:asText(row[8]),age:asText(row[9]),requestStatus:asText(row[10]),serialNo:asText(row[11]),requestRemarks:asText(row[12]),confirm:asText(row[13])})): [];
        imported["Collection Status"]=[...collectionRows,...requestRows];
        imported["Poll Day Dashboard"]=(sheets["Sheet7"]||[]).slice(2).filter(row=>asText(row[1])!==""&&row.slice(1,14).some(v=>asText(v)!=="")&&!asText(row[2]).toLowerCase().startsWith("column")).map(row=>({authorityType:asText(row[1]),male:asText(row[2]),female:asText(row[3]),"0945":asText(row[4]),"1030":asText(row[5]),"1200":asText(row[6]),"0100":asText(row[7]),"0200":asText(row[8]),"0300":asText(row[9]),"0400":asText(row[10]),"0500":asText(row[11]),"0600":asText(row[12]),"0700":asText(row[13])}));
        imported["ICT Asset Management"]=(sheets["NIC Valsad Stock"]||[]).filter(row=>row.some(v=>asText(v)!=="")).map(row=>({register:asText(row[0]),source:asText(row[1])}));
        imported["GoG Projects"]=(sheets["GoG Projects"]||[]).filter(row=>row.some(v=>asText(v)!=="")).map(row=>({reference:row.map(asText).filter(Boolean).join(" | ")}));
        if(!cancelled){let saved:Record<string,Row[]>|null=null;try{const raw=localStorage.getItem("nic-valsad-records");if(raw)saved=JSON.parse(raw);}catch{}setWorkbookSheets(sheets);setRecords(saved?{...imported,...saved}:imported);setSelectedSheet(workbook.SheetNames[0]||"");setWorkbookLoading(false);}
      } catch(error){if(!cancelled){setWorkbookError(error instanceof Error?error.message:"Unable to load workbook");setWorkbookLoading(false);}}
    })();
    return ()=>{cancelled=true;};
  },[]);

  const masterRows=useMemo(()=>{const base=(workbookSheets[selectedSheet]||[]).map((row,index)=>({row,index})).filter(x=>x.row.some(cell=>String(cell??"").toLowerCase().includes(search.toLowerCase())));if(masterSortCol<0)return base;return [...base].sort((a,b)=>{const av=String(a.row[masterSortCol]??""),bv=String(b.row[masterSortCol]??"");const cmp=av.localeCompare(bv,undefined,{numeric:true,sensitivity:"base"});return masterSortDir==="asc"?cmp:-cmp;});},[workbookSheets,selectedSheet,search,masterSortCol,masterSortDir]);
  const sortMaster=(col:number)=>{if(masterSortCol===col)setMasterSortDir(d=>d==="asc"?"desc":"asc");else{setMasterSortCol(col);setMasterSortDir("asc");}};
  const selected=modules.find(m=>m.name===active);
  const rows=selected ? records[selected.name] || [] : [];
  const filtered=useMemo(()=>{
    const matched=rows.filter(row=>Object.values(row).join(" ").toLowerCase().includes(search.toLowerCase())&&(statusFilter==="All"||String(row.status||"").toLowerCase()===statusFilter.toLowerCase()));
    if(!sortKey)return matched;
    return [...matched].sort((a,b)=>{const av=String(a[sortKey]??"").trim(),bv=String(b[sortKey]??"").trim();const an=Number(av),bn=Number(bv);const cmp=av&&bv&&Number.isFinite(an)&&Number.isFinite(bn)?an-bn:av.localeCompare(bv,undefined,{numeric:true,sensitivity:"base"});return sortDir==="asc"?cmp:-cmp;});
  },[rows,search,statusFilter,sortKey,sortDir]);
  const sortBy=(key:string)=>{if(sortKey===key)setSortDir(d=>d==="asc"?"desc":"asc");else{setSortKey(key);setSortDir("asc");}};
  const agingAlert=(row:Row)=>{
    if(!row.reportedDate&&!row.description)return "";
    if(row.status==="Resolved")return "Resolved";
    if(row.status==="Technical Guidance Given")return "Guidance Given";
    const due=row.nextActionDueDate?new Date(row.nextActionDueDate):null;
    const last=row.lastFollowupDate?new Date(row.lastFollowupDate):null;
    const today=new Date();today.setHours(0,0,0,0);
    if(due&&!Number.isNaN(due.getTime())){due.setHours(0,0,0,0);const diff=Math.floor((due.getTime()-today.getTime())/86400000);return diff<0?"Overdue ("+Math.abs(diff)+"d)":diff===0?"Due Today":diff<=3?"Due Soon ("+diff+"d)":"Upcoming ("+diff+"d)";}
    if(last&&!Number.isNaN(last.getTime())){last.setHours(0,0,0,0);const diff=Math.floor((today.getTime()-last.getTime())/86400000);return diff>7?"Follow-up Overdue ("+diff+"d)":"Followed Up ("+diff+"d ago)";}
    const reported=new Date(row.reportedDate);if(!Number.isNaN(reported.getTime()))return "Pending ("+Math.floor((today.getTime()-reported.getTime())/86400000)+"d)";
    return "Pending";
  };
  const rowAlert=(row:Row)=>row.followupAgingAlert||agingAlert(row);
  const alertClass=(value:string)=>value.toLowerCase().includes("overdue")?"alert-overdue":value==="Due Today"||value.includes("Due Soon")?"alert-due":value==="Resolved"?"alert-resolved":value==="Guidance Given"?"alert-guidance":"alert-pending";

  function navigate(label:string) {
    setActive(label);setSearch("");setStatusFilter("All");setSortKey("");setSortDir("asc");setMobileOpen(false);setShowForm(false);
  }
  function saveRecord(e:FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selected) return;
    setRecords(current=>{const next={...current,[selected.name]:[{...form},...(current[selected.name]||[])]};try{localStorage.setItem("nic-valsad-records",JSON.stringify(next));}catch{}return next;});
    setForm({});setShowForm(false);setToast("Record added and saved in this browser.");
    window.setTimeout(()=>setToast(""),3200);
  }
  function updateCell(rowIndex:number,key:string,value:string) {
    if(!selected)return;
    setRecords(current=>{
      const nextRows=[...(current[selected.name]||[])];
      nextRows[rowIndex]={...nextRows[rowIndex],[key]:value};
      const next={...current,[selected.name]:nextRows};
      try{localStorage.setItem("nic-valsad-records",JSON.stringify(next));}catch{}
      return next;
    });
    setEditingCell(null);
    setToast("Cell updated and saved in this browser.");
    window.setTimeout(()=>setToast(""),2500);
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
      <header className="topbar"><button className="menu-button" onClick={()=>setMobileOpen(true)} aria-label="Open menu"><Menu/></button><div className="breadcrumb">Workspace <span>/</span> <b>{active}</b></div><div className="top-actions"><span className="environment"><i/> WORKBOOK IMPORT</span><button className="icon-button" aria-label="Notifications"><Bell size={19}/><i/></button><div className="top-avatar">AD</div></div></header>
      <section className="content">
        {active==="Overview"||active==="All modules" ? <>
          <div className="welcome-row"><div><div className="eyebrow">DISTRICT INFORMATICS OFFICE</div><h1>{active==="Overview"?"Office overview":"All office modules"}</h1><p>One workspace for coordinating district-level e-Governance operations. Open Master Workbook to view the imported source records.</p></div><div className="date-chip"><CalendarDays size={16}/>{new Date().toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})}</div></div>
          {noticeOpen&&<div className="notice"><div className="notice-icon"><ShieldCheck size={19}/></div><div><b>Master workbook connected</b><span>Source worksheets are loaded directly from the Excel file committed to this repository.</span></div><button className="notice-dismiss" onClick={()=>setNoticeOpen(false)} aria-label="Dismiss notice"><X size={16}/></button></div>}
          <div className="section-heading"><div><h2>At a glance</h2><p>Sample counters based on the current demonstration data.</p></div><button className="text-button" onClick={()=>navigate("Reports & Dashboard")}>View reports <ArrowUpRight size={15}/></button></div>
          <div className="stats-grid">{[
            {label:"RFMS queries",value:records["RFMS Query Management"].length,icon:ClipboardList},
            {label:"Network incidents",value:records["Network Management"].length,icon:Activity},
            {label:"Upcoming VCs",value:records["VC Management"].filter(r=>r.status==="Scheduled").length,icon:Video},
            {label:"ICT assets",value:records["ICT Asset Management"].length,icon:HardDrive}
          ].map(s=><div className="stat-card" key={s.label}><div className="stat-top"><span>{s.label}</span><div className="stat-icon"><s.icon size={18}/></div></div><div className="stat-value">{s.value}</div><div className="stat-note">Demo records · not live data</div></div>)}</div>
          <div className="section-heading"><div><h2>Operational insights</h2><p>Live summaries from the demonstration records.</p></div></div>
          <div className="charts-grid"><BarChart title="Records by workspace" subtitle="Entries currently loaded in each module" items={modules.filter(m=>m.name!=="Reports & Dashboard").map(m=>({label:m.short,value:records[m.name]?.length||0}))}/><DonutChart title="RFMS query status" subtitle="Distribution of tracked queries" items={Object.entries(countBy(records["RFMS Query Management"],"status")).map(([label,value],i)=>({label,value,color:["#477da5","#d5a24c","#4b9a79","#c56c66","#8c7bb5"][i%5]}))}/></div>
          <div className="section-heading modules-heading"><div><h2>Office modules</h2><p>Open a workspace to view and manage its demonstration records.</p></div><span className="module-count">11 MODULES</span></div>
          <div className="module-grid">{modules.map(mod=><button className="module-card" key={mod.name} onClick={()=>navigate(mod.name)}><div className="module-card-top"><div className="module-icon"><mod.icon size={20}/></div><ArrowUpRight size={17} className="card-arrow"/></div><h3>{mod.name}</h3><p>{mod.description}</p><div className="module-footer"><span>{records[mod.name].length} demo records</span><span className="open-label">Open workspace <ArrowUpRight size={13}/></span></div></button>)}</div>
        </>:active==="Master Workbook" ? <>{<div className="workspace-heading"><div className="eyebrow">SOURCE DATA</div><div className="workspace-title-row"><div><h1>Master Workbook</h1><p>Read-only view of all worksheets from Valsad NIC Daily update.xlsx.</p></div></div></div>}{workbookLoading?<div className="placeholder-panel"><h2>Loading workbook…</h2><p>Reading the Excel worksheets.</p></div>:workbookError?<div className="placeholder-panel"><h2>Workbook could not be loaded</h2><p>{workbookError}</p><button className="secondary-button" onClick={()=>window.location.reload()}>Retry</button></div>:<><div className="workspace-summary"><div><span className="summary-label">WORKSHEETS</span><strong>{Object.keys(workbookSheets).length}</strong></div><div><span className="summary-label">SELECTED SHEET ROWS</span><strong>{workbookSheets[selectedSheet]?.length||0}</strong></div><div><span className="summary-label">DATA SOURCE</span><strong className="demo-source">Excel workbook</strong></div></div><div className="table-toolbar"><div className="search-wrap"><Search size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search this worksheet..." aria-label="Search worksheet"/></div><div className="toolbar-actions"><select value={selectedSheet} onChange={e=>{setSelectedSheet(e.target.value);setSearch("");}} aria-label="Select worksheet">{Object.keys(workbookSheets).map(name=><option key={name} value={name}>{name}</option>)}</select><span className="result-count">{(workbookSheets[selectedSheet]||[]).length} rows</span></div></div><div className="data-table-wrap"><table className="data-table"><thead><tr><th><button className="sort-header" onClick={()=>sortMaster(-1)}>Excel row ↕</button></th>{Array.from({length:Math.max(0,...(workbookSheets[selectedSheet]||[]).map(r=>r.length))},(_,i)=><th key={i}><button className="sort-header" onClick={()=>sortMaster(i)}>{XLSX.utils.encode_col(i)}{masterSortCol===i?(masterSortDir==="asc"?" ↑":" ↓"):" ↕"}</button></th>)}</tr></thead><tbody>{masterRows.map(({row,index})=><tr key={index}><td>{index+1}</td>{Array.from({length:Math.max(0,...(workbookSheets[selectedSheet]||[]).map(r=>r.length))},(_,i)=><td key={i}><span>{String(row[i]??"")||"—"}</span></td>)}</tr>)}</tbody></table>{(workbookSheets[selectedSheet]||[]).length===0&&<div className="table-empty"><b>No rows in this worksheet</b></div>}</div><div className="table-footnote"><ShieldCheck size={14}/> Source worksheet values · all original worksheet columns retained</div></>}</>:selected ? <>
          <div className="workspace-heading"><button className="back-link" onClick={()=>navigate("Overview")}><ArrowLeft size={15}/> Overview</button><div className="workspace-title-row"><div><div className="eyebrow">OFFICE WORKSPACE</div><h1>{selected.name}</h1><p>{selected.description}</p></div>{selected.fields.length>0&&<button className="primary-button" onClick={()=>{setForm({});setShowForm(true)}}><Plus size={16}/> Add record</button>}</div></div>
          <div className="workspace-summary"><div><span className="summary-label">TOTAL RECORDS</span><strong>{rows.length}</strong></div><div><span className="summary-label">FILTERED RESULTS</span><strong>{filtered.length}</strong></div><div><span className="summary-label">DATA SOURCE</span><strong className="demo-source">Excel workbook</strong></div></div>
          {active==="Reports & Dashboard"&&<div className="report-visuals"><div className="section-heading"><div><h2>Office performance reports</h2><p>Charts recalculate from records in this browser session.</p></div></div><div className="charts-grid">
<BarChart title="RFMS query status" subtitle="Workload by current status" items={Object.entries(countBy(records["RFMS Query Management"],"status")).map(([label,value])=>({label,value}))}/>
<DonutChart title="Network complaint status" subtitle="Incident resolution distribution" items={Object.entries(countBy(records["Network Management"],"status")).map(([label,value],i)=>({label,value,color:["#477da5","#d5a24c","#4b9a79","#c56c66"][i%4]}))}/>
<BarChart title="Monthly VC schedule" subtitle="Meetings by calendar month" items={monthCounts(records["VC Management"],"date")}/>
<BarChart title="Events by category" subtitle="Event and training mix" items={Object.entries(countBy(records["Events & Training"],"category")).map(([label,value])=>({label,value}))}/>
<BarChart title="Seva Setu user activation" subtitle="User counts from entered values" items={[{label:"Mamlatdar users",value:records["Seva Setu Management"].reduce((n,r)=>n+(Number.parseInt(r.mamlatdarUsers||"0",10)||0),0)},{label:"Taluka Panchayat users",value:records["Seva Setu Management"].reduce((n,r)=>n+(Number.parseInt(r.talukaPanchayatUsers||"0",10)||0),0)}]}/>
<BarChart title="iRAD task updates" subtitle="Daily entries by month" items={monthCounts(records["iRAD Project Update"],"date")}/>
</div><div className="section-heading chart-subheading"><div><h2>Network speed-test overview</h2><p>Average download and upload speeds (Mbps).</p></div></div><div className="stats-grid speed-stats">{[{label:"Average download",values:records["Network Management"].map(r=>Number(r.downloadMbps)).filter(n=>Number.isFinite(n)&&n>0)},{label:"Average upload",values:records["Network Management"].map(r=>Number(r.uploadMbps)).filter(n=>Number.isFinite(n)&&n>0)}].map(x=><div className="stat-card" key={x.label}><div className="stat-top"><span>{x.label}</span><div className="stat-icon"><Activity size={18}/></div></div><div className="stat-value">{x.values.length?(x.values.reduce((a,b)=>a+b,0)/x.values.length).toFixed(1):"—"}</div><div className="stat-note">Mbps · based on available entries</div></div>)}</div></div>}
          {active==="Reports & Dashboard"&&<div className="report-note"><Gauge size={18}/><div><b>Report preview</b><span>These are sample report definitions. Live aggregation and scheduled exports will be connected after the database and permissions layer is implemented.</span></div></div>}
          <div className="table-toolbar"><div className="search-wrap"><Search size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder={`Search ${selected.short.toLowerCase()}...`} aria-label="Search records"/></div><div className="toolbar-actions">{selected.columns.some(col=>col.key==="status")&&<select className="table-filter" value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}><option>All</option>{[...new Set(rows.map(r=>r.status).filter(Boolean))].sort().map(s=><option key={s}>{s}</option>)}</select>}<span className="result-count">{filtered.length} records</span><button className="secondary-button" onClick={exportCsv}><ArrowDownToLine size={15}/> Export CSV</button></div></div>
          <div className="data-table-wrap"><table className="data-table"><thead><tr>{selected.columns.map(col=><th key={col.key}><button className="sort-header" onClick={()=>sortBy(col.key)}>{col.label}{sortKey===col.key?(sortDir==="asc"?" ↑":" ↓"):" ↕"}</button></th>)}</tr></thead><tbody>{filtered.map((row,i)=>{const alert=rowAlert(row);return <tr key={i} className={String(row.status||"").includes("Pending at NIC State")?"alert-nic-pending":alert?alertClass(alert):""}>{selected.columns.map(col=>{const rowIndex=rows.indexOf(row);const editing=editingCell?.rowIndex===rowIndex&&editingCell.key===col.key;return <td key={col.key} className="editable-cell" title="Click to edit"><div className="editable-value" onClick={()=>{setEditingCell({rowIndex,key:col.key});setEditValue(row[col.key]||"");}}>{editing?<input autoFocus className="cell-editor" value={editValue} onChange={e=>setEditValue(e.target.value)} onBlur={()=>updateCell(rowIndex,col.key,editValue)} onKeyDown={e=>{if(e.key==="Enter"){e.preventDefault();updateCell(rowIndex,col.key,editValue);}if(e.key==="Escape")setEditingCell(null);}}/>:col.key==="status"||col.key==="approval"||col.key==="priority"||col.key==="severity"?<Status value={row[col.key]}/>:col.key==="followupAgingAlert"?<span className={"alert-pill "+alertClass(alert)}>{alert||"—"}</span>:<span>{row[col.key]||"—"}</span>}</div></td>})}</tr>})}</tbody></table>{filtered.length===0&&<div className="table-empty"><Filter size={22}/><b>No records found</b><span>Try changing your search or add a new record.</span></div>}</div>
          <div className="table-footnote"><ShieldCheck size={14}/> Click any cell to edit · Changes and new entries are saved in this browser only</div>
        </>:active==="Calendar"||active==="Staff"||active==="Settings"?<>
          <div className="welcome-row"><div><div className="eyebrow">WORKSPACE</div><h1>{active}</h1><p>{active==="Calendar"?"A combined calendar view will bring together VCs, events and staff movements.":active==="Staff"?"Staff directory and role-based access will be managed here.":"Application preferences, user access and security controls."}</p></div></div>
          <div className="placeholder-panel"><div className="placeholder-icon">{active==="Calendar"?<CalendarDays/>:active==="Staff"?<Users/>:<Settings/>}</div><h2>{active} workspace</h2><p>This section is planned for the next implementation milestone. It will be connected to the same PostgreSQL database and permission system.</p><button className="secondary-button" onClick={()=>navigate("Overview")}><ArrowLeft size={15}/> Return to overview</button></div>
        </>:null}
        <footer><span>NIC Valsad Office Management <b>·</b> Development build</span><span>Secure by design <ShieldCheck size={13}/></span></footer>
      </section>
    </main>
    {mobileOpen&&<button className="backdrop" onClick={()=>setMobileOpen(false)} aria-label="Close navigation"/>}
    {showForm&&selected&&<div className="modal-backdrop" onClick={()=>setShowForm(false)}><div className="modal" onClick={e=>e.stopPropagation()}><div className="modal-head"><div><span className="eyebrow">NEW ENTRY</span><h2>Add {selected.short} record</h2></div><button className="icon-button" onClick={()=>setShowForm(false)} aria-label="Close form"><X size={19}/></button></div><form onSubmit={saveRecord}><div className="form-grid">{selected.fields.map(field=><label className={field.key==="details"||field.key==="notes"||field.key==="purpose"||field.key==="requirements"?"field full":"field"} key={field.key}><span>{field.label}</span>{field.key==="details"||field.key==="notes"||field.key==="purpose"||field.key==="requirements"?<textarea required={field.key==="details"} placeholder={field.placeholder} value={form[field.key]||""} onChange={e=>setForm({...form,[field.key]:e.target.value})}/>:field.options?<select value={form[field.key]||""} onChange={e=>setForm({...form,[field.key]:e.target.value})}><option value="">Select an option</option>{field.options.map(option=><option key={option} value={option}>{option}</option>)}</select>:<input required={["reference","subject","date","title","ticket","location","issue","drive","tag","type","staff","event"].includes(field.key)} type={field.type||"text"} placeholder={field.placeholder} value={form[field.key]||""} onChange={e=>setForm({...form,[field.key]:e.target.value})}/>}</label>)}</div><div className="modal-actions"><button type="button" className="secondary-button" onClick={()=>setShowForm(false)}>Cancel</button><button type="submit" className="primary-button"><FilePlus2 size={16}/> Save record</button></div><p className="form-disclaimer">This entry is stored only in the current browser session. Database saving is not enabled yet.</p></form></div></div>}
    {toast&&<div className="toast"><CheckCircle2 size={17}/>{toast}</div>}
  </div>;
}
