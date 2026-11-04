// Writes the stored history into the stopped app's container (control server).
const response = http.post(CONTROL_URL + '/history/seed', { body: '' });
if (response.status !== 200) throw new Error('history seed failed: ' + response.status);
