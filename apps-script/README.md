# Google Sheets secure connection

This Apps Script project is the authenticated gateway between the static UI and the spreadsheet.

## Security model
- The web app runs as the signed-in user accessing it.
- Every server call verifies the user's Google email and requires that account to be the spreadsheet owner or an Editor.
- The spreadsheet remains the source of truth; workbook data is not bundled into the frontend.
- Module edits use a script lock and revision checks to avoid silently overwriting another user's changes.
- Do not deploy as Execute as me. Do not grant anonymous access.
- Only share the spreadsheet with staff authorised to view and edit these records. Editors can write; viewers are denied.

## Link the existing Apps Script project
1. In Apps Script, open Project Settings and copy the Script ID. Do not share an OAuth token or password.
2. In a local clone of this repository, create apps-script/.clasp.json with: {"scriptId":"YOUR_SCRIPT_ID","rootDir":"."}
3. Install/login once: npx @google/clasp login
4. From the apps-script folder run: npx @google/clasp push
5. In Apps Script, choose Deploy → New deployment → Web app.
   - Execute as: User accessing the web app
   - Who has access: Google-account users, if offered. The server independently denies accounts that are not spreadsheet Editors.
6. Authorise the requested Sheets, Drive-read and email scopes. Copy the deployment URL and open it while signed in with the spreadsheet-owner account.

If the Apps Script deployment UI does not offer the exact access setting above, stop and do not choose anonymous access as a workaround.

## Existing spreadsheet
The spreadsheet ID is configured in Code.gs. Its owner and authorised Editors are the only accounts accepted by the backend. The app creates _AppData and _AppMeta support tabs on first write.

## Important rollout notes
- The public GitHub Pages address is only the UI shell; it is not an access-control boundary. Open the app through the Apps Script deployment URL.
- The source workbook was removed from the latest public repository revision. Git history may still contain earlier copies; those historical objects must be purged or the repository made private before treating the workbook as confidential.
- Obtain NIC/MeitY and data-owner approval before entering official, personal, VC, access-code, or operationally sensitive records into a personal Google account.
- This is a technical prototype. It has not been production-security-tested or deployed. Do not treat this commit as production approval.
