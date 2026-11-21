/**
 * NIC Valsad Office Management - Google Apps Script bridge.
 *
 * Deploy as: Execute as "User accessing the web app"
 * Access: Google accounts only. The user must also be an Editor of the
 * configured spreadsheet. Never deploy this as "Me" / public anonymous access.
 *
 * The React UI is hosted on GitHub Pages. This Apps Script page is the
 * authenticated parent frame and brokers requests through google.script.run.
 */
const CONFIG = Object.freeze({
  SPREADSHEET_ID: "1QySf292lyeRYPtS-QvSmeEjupOSTcgceJPgalVFjgfo",
  APP_ORIGIN: "https://vtslkumar1303.github.io",
  APP_URL: "https://vtslkumar1303.github.io/nic-valsad-office-management/",
  DATA_SHEET: "_AppData",
  META_SHEET: "_AppMeta",
  MAX_RECORDS_PER_MODULE: 5000
});

const ALLOWED_MODULES = Object.freeze([
  "RFMS Query Management", "Daily Work Diary", "VC Management",
  "Network Management", "Seva Setu Management", "ICT Asset Management",
  "Staff Tour & Attendance", "Events & Training", "iRAD Project Update",
  "Inactivation Logs", "Pending Task (Backup)", "GoG Projects",
  "Collection Status", "Poll Day Dashboard"
]);

function doGet() {
  const user = assertAuthorized_();
  const template = HtmlService.createTemplateFromFile("Index");
  template.appUrl = CONFIG.APP_URL;
  template.userEmail = user;
  return template.evaluate()
    .setTitle("NIC Valsad Office Management")
    .addMetaTag("viewport", "width=device-width, initial-scale=1");
}

/** Returns workbook values only to a signed-in spreadsheet editor. */
function getWorkbookData() {
  assertAuthorized_();
  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  const result = {};
  ss.getSheets().forEach(sheet => {
    if (sheet.getName().startsWith("_App")) return;
    result[sheet.getName()] = sheet.getDataRange().getDisplayValues();
  });
  return result;
}

/** Loads saved application records and their optimistic-lock revisions. */
function loadModuleData(moduleName) {
  assertModule_(moduleName);
  assertAuthorized_();
  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  const data = ensureSheet_(ss, CONFIG.DATA_SHEET, ["module", "recordId", "payload", "updatedAt", "updatedBy"]);
  const meta = ensureSheet_(ss, CONFIG.META_SHEET, ["module", "revision"]);
  const values = data.getLastRow() > 1 ? data.getRange(2, 1, data.getLastRow() - 1, 5).getValues() : [];
  const records = values.filter(r => r[0] === moduleName).map(r => {
    const parsed = JSON.parse(String(r[2] || "{}"));
    return Object.assign({ _recordId: String(r[1]) }, parsed);
  });
  const revisionRows = meta.getLastRow() > 1 ? meta.getRange(2, 1, meta.getLastRow() - 1, 2).getValues() : [];
  const found = revisionRows.find(r => r[0] === moduleName);
  return { records, revision: found ? Number(found[1]) || 0 : 0 };
}

/**
 * Replaces one module's record set atomically. A stale revision is rejected
 * rather than silently overwriting another staff member's recent changes.
 */
function saveModuleData(moduleName, records, expectedRevision) {
  assertModule_(moduleName);
  const user = assertAuthorized_();
  if (!Array.isArray(records) || records.length > CONFIG.MAX_RECORDS_PER_MODULE) {
    throw new Error("Invalid record set or module record limit exceeded.");
  }
  records.forEach(record => {
    if (!record || typeof record !== "object" || Array.isArray(record)) throw new Error("Invalid record.");
    if (JSON.stringify(record).length > 45000) throw new Error("A record exceeds the safe cell-size limit.");
  });

  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    const data = ensureSheet_(ss, CONFIG.DATA_SHEET, ["module", "recordId", "payload", "updatedAt", "updatedBy"]);
    const meta = ensureSheet_(ss, CONFIG.META_SHEET, ["module", "revision"]);
    const metaRows = meta.getLastRow() > 1 ? meta.getRange(2, 1, meta.getLastRow() - 1, 2).getValues() : [];
    const metaIndex = metaRows.findIndex(r => r[0] === moduleName);
    const currentRevision = metaIndex >= 0 ? Number(metaRows[metaIndex][1]) || 0 : 0;
    if (Number(expectedRevision) !== currentRevision) {
      throw new Error("CONFLICT: Another user changed this module. Reload the records before saving.");
    }

    const existing = data.getLastRow() > 1 ? data.getRange(2, 1, data.getLastRow() - 1, 5).getValues() : [];
    const keep = existing.filter(r => r[0] !== moduleName);
    const now = new Date();
    const replacement = records.map((record, index) => [
      moduleName,
      String(record._recordId || Utilities.getUuid()),
      JSON.stringify(Object.fromEntries(Object.entries(record).filter(([key]) => key !== "_recordId"))),
      now,
      user
    ]);
    if (data.getLastRow() > 1) data.getRange(2, 1, data.getLastRow() - 1, 5).clearContent();
    const all = keep.concat(replacement);
    if (all.length) data.getRange(2, 1, all.length, 5).setValues(all);
    const nextRevision = currentRevision + 1;
    if (metaIndex >= 0) meta.getRange(metaIndex + 2, 2).setValue(nextRevision);
    else meta.appendRow([moduleName, nextRevision]);
    return { revision: nextRevision, saved: replacement.length };
  } finally {
    lock.releaseLock();
  }
}

function getCurrentUser() {
  return { email: assertAuthorized_() };
}

function assertAuthorized_() {
  const email = String(Session.getActiveUser().getEmail() || "").trim().toLowerCase();
  if (!email) throw new Error("Google could not verify your signed-in email. Ask the spreadsheet owner to review the deployment access settings.");
  const file = DriveApp.getFileById(CONFIG.SPREADSHEET_ID);
  const editors = file.getEditors().map(user => String(user.getEmail() || "").trim().toLowerCase());
  if (!editors.includes(email)) throw new Error("Access denied. Ask the spreadsheet owner to grant Editor access to the NIC office database.");
  return email;
}

function assertModule_(moduleName) {
  if (!ALLOWED_MODULES.includes(String(moduleName))) throw new Error("Unknown or unsupported module.");
}

function ensureSheet_(ss, name, headers) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) sheet = ss.insertSheet(name);
  if (sheet.getLastRow() === 0) sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  return sheet;
}
