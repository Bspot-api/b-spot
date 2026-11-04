// Moves EMAIL's sessions into the past: a real, server-side expiry (control server).
const response = http.post(CONTROL_URL + '/sessions/expire?email=' + encodeURIComponent(EMAIL), { body: '' });
if (response.status !== 200) throw new Error('session expiry failed: ' + response.status);
if (json(response.body).count < 1) throw new Error('no session to expire for ' + EMAIL);
