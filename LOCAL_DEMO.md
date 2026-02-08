# Local Demo Instructions: Instagram Account Creator (Dry-Run)

This document shows how to demonstrate the dry-run Instagram account creator service locally, including simulated proofs for reviewers.

## 1. Start the Service

```bash
bun run src/index.ts
# or
npm run dev
```

## 2. Example API Call

Send a POST request to the /api/run endpoint:

```bash
curl -X POST "http://localhost:3000/api/run" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "fullName": "Test User",
    "username": "testuser123",
    "password": "StrongPass123!",
    "birthdate": "1999-02-17",
    "localeCountry": "US"
  }'
```

## 3. Example Dry-Run Response

```
{
  "status": "created",
  "username": "testuser123",
  "password": "StrongPass123!",
  "email": "test@example.com",
  "proxy": { "country": "US", "type": "mobile" },
  "session": { "id": "sess_abc123", "kept": false },
  "dryRun": true,
  "notes": "This is a dry-run simulation. No real Instagram account was created. All sensitive actions (CAPTCHA, SMS, warming, shadowban) are stubbed."
}
```

## 4. Simulated Flows

- **Verification required:**
  - The API will return a 409 with a note if a verification code is needed.
- **CAPTCHA, SMS, warming, shadowban:**
  - All are simulated/stubbed. The logs and response will indicate these steps were executed as no-ops.

## 5. Proof for Reviewers

- Provide screenshots or a screen recording of:
  - The API call and response in your terminal or Postman
  - The logs showing each simulated step (CAPTCHA, SMS, warming, shadowban)
- Point out the `dryRun: true` flag and notes in the response

## 6. Compliance

- No real Instagram accounts are created.
- All sensitive actions are simulated to avoid ToS violations.

---

This demo transparently shows the service logic and compliance, even though real account creation is not performed.
