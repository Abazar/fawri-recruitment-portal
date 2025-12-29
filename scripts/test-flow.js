/*
  Minimal flow test (API-level):
  - Register new applicant
  - Login as that applicant
  - Call /api/v1/auth/me with token
  - Login as seeded admin
  - Call /api/v1/applications with admin token

  Run: node scripts/test-flow.js
*/

const BASE_URL = process.env.API_URL || 'http://localhost:3001';

async function httpJson(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = { raw: text };
  }

  return { status: res.status, json };
}

function randomEmail() {
  const now = Date.now();
  return `flow_${now}@example.com`;
}

async function main() {
  console.log('BASE_URL:', BASE_URL);

  // 1) Register
  const email = randomEmail();
  const password = 'Test@1234A';

  const registerPayload = {
    email,
    password,
    firstName: 'Flow',
    lastName: 'Test',
    phone: '+12345678901',
    dateOfBirth: '1995-01-01',
    nationality: 'Test',
    currentCountry: 'Test',
    language: 'en',
  };

  const reg = await httpJson('/api/v1/auth/register', { method: 'POST', body: registerPayload });
  console.log('\n[REGISTER]', reg.status);
  console.log(reg.json);
  if (reg.status !== 201) process.exitCode = 1;

  const applicantToken = reg.json?.data?.tokens?.accessToken;

  // 2) Login as applicant
  const loginApplicant = await httpJson('/api/v1/auth/login', {
    method: 'POST',
    body: { email, password },
  });
  console.log('\n[LOGIN applicant]', loginApplicant.status);
  console.log(loginApplicant.json);
  if (loginApplicant.status !== 200) process.exitCode = 1;

  const applicantLoginToken = loginApplicant.json?.data?.tokens?.accessToken || applicantToken;

  // 3) /me for applicant
  const meApplicant = await httpJson('/api/v1/auth/me', { token: applicantLoginToken });
  console.log('\n[ME applicant]', meApplicant.status);
  console.log(meApplicant.json);
  if (meApplicant.status !== 200) process.exitCode = 1;

  // 4) Login as seeded admin
  const adminEmail = 'admin@fawri.com';
  const adminPassword = 'Admin@123';

  const loginAdmin = await httpJson('/api/v1/auth/login', {
    method: 'POST',
    body: { email: adminEmail, password: adminPassword },
  });
  console.log('\n[LOGIN admin]', loginAdmin.status);
  console.log(loginAdmin.json);
  if (loginAdmin.status !== 200) process.exitCode = 1;

  const adminToken = loginAdmin.json?.data?.tokens?.accessToken;

  // 5) Fetch applications as admin (dashboard data)
  const apps = await httpJson('/api/v1/applications', { token: adminToken });
  console.log('\n[GET applications as admin]', apps.status);
  console.log(apps.json);
  if (apps.status !== 200) process.exitCode = 1;

  console.log('\nDone.');
  console.log('Logout is client-side (clears localStorage + api token).');
}

main().catch((err) => {
  console.error('Flow test failed:', err);
  process.exit(1);
});
