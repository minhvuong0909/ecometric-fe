# EcoMetric flow validation

- Manual and scanned activity inputs store physical quantity/unit/source within an OPEN period. Saving is DRAFT, submitting is PENDING_REVIEW, and manager confirmation calculates CO2e.
- Ledger values come only from emission-calculation results. Existing VND drafts are preserved and must be edited with real activity quantities before confirmation.
- COMPANY_ADMIN closes a complete period. CLOSED periods support Eco Score and reports. Reopening is explicit; the UI does not lock periods automatically.
- Report creation enqueues once; QUEUED/GENERATING are polled; PDF/XLSX/CSV/JSON downloads are authenticated and refresh expired access tokens.
- Recommendations receive the selected period range. No savings, scores or emissions are invented when data is absent.
- PayOS checkout returns an order, not a business. The authenticated buyer polls an owner-scoped order endpoint. Only a verified webhook matching successful code, VND and amount creates a business. Fulfillment locks the order and commits business+membership+branch+period+PAID atomically.

## Google configuration

VPS external auth is currently disabled. Until configured, Google is disabled in the login UI and password login remains available.
Create a Clerk JWT template named `ecometric` with signed `sub`, `email`, `email_verified=true`, issuer for the Clerk instance and audience `ecometric-api`. Use verified email claims only.
Configure backend AUTH_EXTERNAL_ENABLED=true, AUTH_EXTERNAL_PROVIDER=clerk, AUTH_OIDC_ISSUER_URL, AUTH_OIDC_JWKS_URL and AUTH_OIDC_AUDIENCE=ecometric-api.
Set VITE_AUTH_EXTERNAL_ENABLED=true and VITE_CLERK_JWT_TEMPLATE=ecometric, rebuild frontend. Clerk login must exchange its token through /auth/external/exchange before app routes load.
Never trust Clerk browser user data as a backend session and never disable signature/issuer/audience verification to make login succeed.
