# NIC Valsad Office Management

A React + TypeScript office-management interface with a Google Sheets data layer behind an authenticated Google Apps Script gateway.

## Application modules
- RFMS Query Management and backup
- Daily Work Diary
- VC Management
- Network Management
- Seva Setu Management
- Events & Training
- iRAD Project Update
- Staff Tour & Attendance
- Inactivation Logs
- Collection Status and Poll Day Dashboard
- ICT Asset and GoG project reference registers
- Reports & Dashboard

## Architecture
- Frontend: React + TypeScript + Vite, hosted as a static GitHub Pages UI shell.
- Authentication and API gateway: Google Apps Script HTML Service.
- Database: the configured Google spreadsheet.
- Access control: each request verifies the signed-in Google account and requires spreadsheet ownership or Editor permission.
- Writes: module records are stored in private support tabs using a script lock and optimistic revision checks.

The static GitHub Pages URL is not the authenticated entry point. Users must open the deployed Apps Script web-app URL. Direct access to GitHub Pages does not provide data access.

## Google Apps Script setup
See [apps-script/README.md](apps-script/README.md). The Apps Script project files are in `apps-script/`.

The Apps Script manifest is configured to execute as the user accessing the web app. Never change this to execute as the script owner, and never allow anonymous access.

## Development
Requirements: Node.js 20+ and npm.

```bash
npm install
npm run dev:web
npm run build
```

The repository includes an Express API scaffold from an earlier milestone; it is not the active data path for the Google Sheets deployment.

## Security and governance
- Do not commit spreadsheets, exports, passwords, tokens, meeting links, access codes, or personal/operational records.
- Share the spreadsheet only with staff who are formally authorised to access the records.
- Only spreadsheet Editors can use the application; viewer access is intentionally not sufficient.
- Obtain NIC/MeitY and data-owner approval before storing official or personal data in a personal Google account.
- This implementation is a prototype and has not yet been deployed or security-tested for production use.
- The workbook was removed from the latest public revision. Earlier Git history may still contain it; purge historical copies before considering the data confidential.
