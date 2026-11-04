// Brings the e2e database back to its seeded state (control server).
const response = http.post(CONTROL_URL + '/reset', { body: '' });
if (response.status !== 200) throw new Error('reset failed: ' + response.status);
