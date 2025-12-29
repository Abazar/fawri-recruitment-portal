(async () => {
  const body = {
    email: `rider+${Date.now()}@test.com`,
    password: 'Test@1234',
    firstName: 'Test',
    lastName: 'Rider',
    phone: '1234567890',
    nationality: 'Testland',
    currentCountry: 'Testland',
    language: 'en',
  };

  const res = await fetch('http://localhost:3001/api/v1/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  console.log('STATUS', res.status);
  console.log(text);

  process.exit(res.ok ? 0 : 1);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
