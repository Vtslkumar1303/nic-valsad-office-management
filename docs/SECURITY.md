# Security and deployment gate

This project is intended for an office environment. A private GitHub repository is not an approved production hosting environment.

Before real use:
1. Obtain the required NIC/MeitY approval for hosting, data classification, network exposure and security review.
2. Use an approved server and managed PostgreSQL instance with encrypted connections, encrypted backups and restricted network access.
3. Complete invitation-only account provisioning, password hashing, session lifecycle, MFA policy where required, role authorization and audit coverage.
4. Enforce authorization in the API and database. Frontend visibility is not access control.
5. Encrypt sensitive VC meeting URLs at rest and never write them to logs.
6. Configure TLS, secure cookies, CSRF protection, rate limits, input validation, dependency scanning and security headers.
7. Test backup restoration and define retention, recovery objectives and incident response.
8. Keep production secrets in an approved secret manager, never in GitHub or frontend environment variables.
9. Review privacy and retention requirements for staff, attendance, tour and operational records.

## Development safeguards
- Use fictional sample records only.
- Do not import office spreadsheets into this repository.
- Do not use actual user names, email addresses, phone numbers, IP addresses, network details, credentials or VC links in issues, commits or test fixtures.
- The API currently exposes only a health endpoint. It is not ready for real data or multi-user production access.
